import Foundation
import Firebase
import FirebaseDatabase

struct Event {
    let id: String
    let title: String
    let description: String
    let date: Date
    let startTime: String
    let endTime: String
    let posterUrl: String?
    let pricingTiers: [[String: Any]]
    let musicGenres: [String]
    let eventType: String
    let targetDemographics: [String]
    var analytics: [String: Any]?
}

class EventManagementService {
    
    // MARK: - Properties
    
    static let eventsRef = Database.database().reference().child("events")
    
    // MARK: - Event Methods
    
    /// Get all events
    /// - Parameter completion: Callback with events dictionary
    static func getEvents(completion: @escaping ([String: Any]) -> Void) {
        eventsRef.observeSingleEvent(of: .value) { snapshot in
            guard let events = snapshot.value as? [String: Any] else {
                completion([:])
                return
            }
            completion(events)
        }
    }
    
    /// Get event by ID
    /// - Parameters:
    ///   - eventId: ID of the event to fetch
    ///   - completion: Callback with event or nil if not found
    static func getEvent(eventId: String, completion: @escaping (Event?) -> Void) {
        eventsRef.child(eventId).observeSingleEvent(of: .value) { snapshot in
            guard let eventData = snapshot.value as? [String: Any],
                  let title = eventData["title"] as? String,
                  let description = eventData["description"] as? String,
                  let dateStr = eventData["date"] as? String,
                  let startTime = eventData["startTime"] as? String,
                  let endTime = eventData["endTime"] as? String,
                  let pricingTiers = eventData["pricingTiers"] as? [[String: Any]],
                  let musicGenres = eventData["musicGenres"] as? [String],
                  let eventType = eventData["eventType"] as? String,
                  let targetDemographics = eventData["targetDemographics"] as? [String] else {
                completion(nil)
                return
            }
            
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyy-MM-dd"
            
            guard let date = dateFormatter.date(from: dateStr) else {
                completion(nil)
                return
            }
            
            let posterUrl = eventData["posterUrl"] as? String
            let analytics = eventData["analytics"] as? [String: Any]
            
            let event = Event(
                id: snapshot.key,
                title: title,
                description: description,
                date: date,
                startTime: startTime,
                endTime: endTime,
                posterUrl: posterUrl,
                pricingTiers: pricingTiers,
                musicGenres: musicGenres,
                eventType: eventType,
                targetDemographics: targetDemographics,
                analytics: analytics
            )
            
            completion(event)
        }
    }
    
    /// Create a new event
    /// - Parameters:
    ///   - eventData: Dictionary with event details
    ///   - completion: Callback with event ID or error
    static func createEvent(eventData: [String: Any], completion: @escaping (Result<String, Error>) -> Void) {
        // Validate required fields
        guard let title = eventData["title"] as? String,
              let date = eventData["date"] as? String else {
            let error = NSError(domain: "EventManagementService", code: 400, userInfo: [
                NSLocalizedDescriptionKey: "Missing required fields"
            ])
            completion(.failure(error))
            return
        }
        
        // Add timestamps
        var data = eventData
        data["createdAt"] = ServerValue.timestamp()
        data["updatedAt"] = ServerValue.timestamp()
        
        // Create event
        let newEventRef = eventsRef.childByAutoId()
        newEventRef.setValue(data) { error, _ in
            if let error = error {
                completion(.failure(error))
            } else if let eventId = newEventRef.key {
                completion(.success(eventId))
            } else {
                let error = NSError(domain: "EventManagementService", code: 500, userInfo: [
                    NSLocalizedDescriptionKey: "Failed to get event ID"
                ])
                completion(.failure(error))
            }
        }
    }
    
    /// Update event analytics
    /// - Parameters:
    ///   - eventId: ID of the event to update
    ///   - analyticsData: Dictionary with analytics metrics
    ///   - completion: Callback with success or error
    static func updateEventAnalytics(eventId: String, analyticsData: [String: Any], completion: @escaping (Result<Void, Error>) -> Void) {
        let analyticsRef = eventsRef.child(eventId).child("analytics")
        
        analyticsRef.updateChildValues(analyticsData) { error, _ in
            if let error = error {
                completion(.failure(error))
            } else {
                completion(.success(()))
            }
        }
    }
    
    /// Track event entry
    /// - Parameters:
    ///   - eventId: ID of the event
    ///   - entryData: Dictionary with entry information
    ///   - completion: Callback with success or error
    static func trackEntry(eventId: String, entryData: [String: Any], completion: @escaping (Result<Void, Error>) -> Void) {
        guard let guestId = entryData["guestId"] as? String else {
            let error = NSError(domain: "EventManagementService", code: 400, userInfo: [
                NSLocalizedDescriptionKey: "Missing guest ID"
            ])
            completion(.failure(error))
            return
        }
        
        // Add entry timestamp if not provided
        var data = entryData
        if data["timestamp"] == nil {
            data["timestamp"] = ServerValue.timestamp()
        }
        
        // Record entry
        let entriesRef = eventsRef.child(eventId).child("entries").childByAutoId()
        entriesRef.setValue(data) { error, _ in
            if let error = error {
                completion(.failure(error))
            } else {
                // Update event analytics
                EventManagementService.updateEntryAnalytics(eventId: eventId, entryData: data) { result in
                    switch result {
                    case .success:
                        completion(.success(()))
                    case .failure(let error):
                        completion(.failure(error))
                    }
                }
            }
        }
    }
    
    /// Track user RSVP
    /// - Parameters:
    ///   - eventId: ID of the event
    ///   - userId: ID of the user
    ///   - status: RSVP status (going, maybe, not going)
    ///   - completion: Callback with success or error
    static func trackRSVP(eventId: String, userId: String, status: String, completion: @escaping (Result<Void, Error>) -> Void) {
        let rsvpRef = eventsRef.child(eventId).child("rsvps").child(userId)
        
        rsvpRef.setValue([
            "status": status,
            "timestamp": ServerValue.timestamp()
        ]) { error, _ in
            if let error = error {
                completion(.failure(error))
            } else {
                // Update RSVP counts
                let countsRef = eventsRef.child(eventId).child("analytics").child("rsvp_counts")
                
                countsRef.runTransactionBlock({ currentData in
                    var counts = currentData.value as? [String: Int] ?? [:]
                    
                    // Increment the count for this status
                    let currentCount = counts[status] ?? 0
                    counts[status] = currentCount + 1
                    
                    currentData.value = counts
                    return TransactionResult.success(withValue: currentData)
                }) { error, _, _ in
                    if let error = error {
                        completion(.failure(error))
                    } else {
                        completion(.success(()))
                    }
                }
            }
        }
    }
    
    // MARK: - Helper Methods
    
    /// Update analytics based on event entry
    /// - Parameters:
    ///   - eventId: ID of the event
    ///   - entryData: Entry data to process
    ///   - completion: Callback with success or error
    private static func updateEntryAnalytics(eventId: String, entryData: [String: Any], completion: @escaping (Result<Void, Error>) -> Void) {
        let analyticsRef = eventsRef.child(eventId).child("analytics")
        
        // Get current analytics
        analyticsRef.observeSingleEvent(of: .value) { snapshot in
            var analytics = snapshot.value as? [String: Any] ?? [:]
            
            // Update total attendance
            let currentAttendance = analytics["total_attendance"] as? Int ?? 0
            let groupSize = entryData["groupSize"] as? Int ?? 1
            analytics["total_attendance"] = currentAttendance + groupSize
            
            // Update gender ratio if provided
            if let gender = entryData["gender"] as? String {
                var genderRatio = analytics["gender_ratio"] as? [String: Int] ?? [:]
                let currentCount = genderRatio[gender] ?? 0
                genderRatio[gender] = currentCount + 1
                analytics["gender_ratio"] = genderRatio
            }
            
            // Update revenue if payment info provided
            if let paymentAmount = entryData["paymentAmount"] as? Double {
                let currentRevenue = analytics["total_revenue"] as? Double ?? 0.0
                analytics["total_revenue"] = currentRevenue + paymentAmount
            }
            
            // Update peak hours
            if let timestamp = entryData["timestamp"] as? Int {
                let date = Date(timeIntervalSince1970: TimeInterval(timestamp / 1000))
                let formatter = DateFormatter()
                formatter.dateFormat = "HH:00"
                let hourKey = formatter.string(from: date)
                
                var hourlyEntries = analytics["hourly_entries"] as? [String: Int] ?? [:]
                let currentHourlyCount = hourlyEntries[hourKey] ?? 0
                hourlyEntries[hourKey] = currentHourlyCount + groupSize
                analytics["hourly_entries"] = hourlyEntries
            }
            
            // Update PR performance if applicable
            if let prCode = entryData["prCode"] as? String {
                var prPerformance = analytics["pr_performance"] as? [String: Int] ?? [:]
                let currentPRCount = prPerformance[prCode] ?? 0
                prPerformance[prCode] = currentPRCount + groupSize
                analytics["pr_performance"] = prPerformance
            }
            
            // Save updated analytics
            analyticsRef.updateChildValues(analytics) { error, _ in
                if let error = error {
                    completion(.failure(error))
                } else {
                    completion(.success(()))
                }
            }
        }
    }
    
    /// Subscribe to real-time entry updates for an event
    /// - Parameters:
    ///   - eventId: ID of the event to monitor
    ///   - completion: Callback with entry data
    /// - Returns: Database handle to use for unsubscribing
    static func subscribeToEntries(eventId: String, completion: @escaping ([String: Any]) -> Void) -> DatabaseHandle {
        let entriesRef = eventsRef.child(eventId).child("entries")
        return entriesRef.observe(.childAdded) { snapshot in
            guard let entryData = snapshot.value as? [String: Any] else {
                return
            }
            completion(entryData)
        }
    }
    
    /// Unsubscribe from real-time updates
    /// - Parameters:
    ///   - eventId: Event ID
    ///   - handle: Database handle to remove
    static func unsubscribeFromEntries(eventId: String, handle: DatabaseHandle) {
        let entriesRef = eventsRef.child(eventId).child("entries")
        entriesRef.removeObserver(withHandle: handle)
    }
} 