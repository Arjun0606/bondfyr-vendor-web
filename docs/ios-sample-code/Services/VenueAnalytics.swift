import Foundation
import Firebase
import FirebaseDatabase

class VenueAnalytics {
    
    // MARK: - Properties
    
    static let analyticsRef = Database.database().reference().child("venue_analytics")
    static let securityRef = Database.database().reference().child("security_incidents")
    static let notificationRef = Database.database().reference().child("notification_analytics")
    
    // MARK: - Analytics Methods
    
    /// Subscribe to real-time venue statistics
    /// - Parameter completion: Callback with venue statistics
    /// - Returns: Database handle for the observer
    static func subscribeToRealTimeStats(completion: @escaping ([String: Any]) -> Void) -> DatabaseHandle {
        return analyticsRef.observe(.value) { snapshot in
            guard let data = snapshot.value as? [String: Any] else {
                completion([:])
                return
            }
            
            var result: [String: Any] = [:]
            result["currentOccupancy"] = data["current_occupancy"] as? Int ?? 0
            
            if let genderRatio = data["gender_ratio"] as? [String: Any] {
                result["genderRatio"] = genderRatio
            } else {
                result["genderRatio"] = ["male": 0, "female": 0, "other": 0]
            }
            
            result["couplesCount"] = data["couples_count"] as? Int ?? 0
            
            var hourlyCheckins: [String: Any] = [:]
            for (key, value) in data {
                if key.starts(with: "hourly_checkins_"), let hourValue = value {
                    let hourKey = key.replacingOccurrences(of: "hourly_checkins_", with: "")
                    hourlyCheckins[hourKey] = hourValue
                }
            }
            result["hourlyCheckins"] = hourlyCheckins
            
            completion(result)
        }
    }
    
    /// Unsubscribe from real-time updates
    /// - Parameter handle: The database handle to remove
    static func unsubscribeFromRealTimeStats(handle: DatabaseHandle) {
        analyticsRef.removeObserver(withHandle: handle)
    }
    
    /// Track a security incident
    /// - Parameters:
    ///   - guestId: ID of the guest involved (optional)
    ///   - type: Type of incident (e.g., "fight", "medical", "theft")
    ///   - description: Descriptive details of the incident
    ///   - staffMember: Staff member reporting the incident
    ///   - severity: Severity level (1-5)
    ///   - action: Action taken to resolve the incident
    static func trackSecurityIncident(guestId: String? = nil, 
                                    type: String,
                                    description: String,
                                    staffMember: String,
                                    severity: Int,
                                    action: String) {
        
        let incidentRef = securityRef.childByAutoId()
        
        var incidentData: [String: Any] = [
            "type": type,
            "description": description,
            "staffMember": staffMember,
            "severity": severity,
            "action": action,
            "timestamp": ServerValue.timestamp(),
            "source": "ios_app"
        ]
        
        if let guestId = guestId {
            incidentData["guestId"] = guestId
        }
        
        incidentRef.setValue(incidentData)
    }
    
    /// Track notification engagement
    /// - Parameters:
    ///   - userId: User ID who received/interacted with notification
    ///   - notificationType: Type of notification
    ///   - action: Action taken (received, opened, converted)
    static func trackNotificationEngagement(userId: String, notificationType: String, action: String) {
        let specificNotificationRef = notificationRef.child(notificationType)
        
        specificNotificationRef.observeSingleEvent(of: .value) { snapshot in
            guard var data = snapshot.value as? [String: Any] else {
                specificNotificationRef.setValue([
                    "total_sent": 1,
                    "\(action)_count": 1
                ])
                return
            }
            
            let totalSent = (data["total_sent"] as? Int ?? 0) + 1
            let actionCount = (data["\(action)_count"] as? Int ?? 0) + 1
            
            data["total_sent"] = totalSent
            data["\(action)_count"] = actionCount
            
            specificNotificationRef.setValue(data)
        }
    }
    
    /// Track venue check-in
    /// - Parameters:
    ///   - userId: User ID checking in
    ///   - gender: Gender of the user
    ///   - groupSize: Size of the group (default 1)
    static func trackCheckin(userId: String, gender: String, groupSize: Int = 1) {
        // Update current venue stats
        analyticsRef.runTransactionBlock { currentData in
            var data = currentData.value as? [String: Any] ?? [:]
            
            // Update occupancy
            let currentOccupancy = data["current_occupancy"] as? Int ?? 0
            data["current_occupancy"] = currentOccupancy + groupSize
            
            // Update gender ratio
            var genderRatio = data["gender_ratio"] as? [String: Any] ?? [:]
            let genderCount = genderRatio[gender] as? Int ?? 0
            genderRatio[gender] = genderCount + 1
            data["gender_ratio"] = genderRatio
            
            // Update hourly check-ins
            let formatter = DateFormatter()
            formatter.dateFormat = "HH"
            let hour = formatter.string(from: Date())
            let hourlyKey = "hourly_checkins_\(hour)"
            let hourlyCount = data[hourlyKey] as? Int ?? 0
            data[hourlyKey] = hourlyCount + groupSize
            
            // Update data
            currentData.value = data
            return TransactionResult.success(withValue: currentData)
        }
        
        // Log individual check-in with details
        let checkinsRef = Database.database().reference().child("checkins").childByAutoId()
        checkinsRef.setValue([
            "userId": userId,
            "gender": gender,
            "groupSize": groupSize,
            "timestamp": ServerValue.timestamp(),
            "source": "ios_app"
        ])
    }
    
    /// Track PR code usage
    /// - Parameters:
    ///   - prCode: The PR code used
    ///   - userId: User who used the code
    ///   - groupSize: Size of the group
    static func trackPRCodeUsage(prCode: String, userId: String, groupSize: Int) {
        let prRef = Database.database().reference().child("pr_code_usage").childByAutoId()
        prRef.setValue([
            "prCode": prCode,
            "userId": userId,
            "groupSize": groupSize,
            "timestamp": ServerValue.timestamp(),
            "source": "ios_app"
        ])
    }
} 