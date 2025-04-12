import Foundation
import Firebase
import FirebaseDatabase

class InstagramService {
    
    // MARK: - Properties
    
    static let instagramClicksRef = Database.database().reference().child("instagram_clicks")
    static let userCorrelationRef = Database.database().reference().child("user_instagram_correlation")
    
    // MARK: - Instagram Tracking Methods
    
    /// Track when a user clicks on Instagram content
    /// - Parameters:
    ///   - userId: The Firebase user ID
    ///   - contentType: Type of content (post, story, reel, etc.)
    static func trackInstagramClick(userId: String, contentType: String) {
        let clickRef = instagramClicksRef.child("\(Int(Date().timeIntervalSince1970 * 1000))")
        clickRef.setValue([
            "userId": userId,
            "timestamp": ServerValue.timestamp(),
            "contentType": contentType,
            "source": "ios_app"
        ])
    }
    
    /// Correlate app user with Instagram username
    /// - Parameters:
    ///   - instagramUsername: User's Instagram username
    ///   - userId: Firebase user ID
    static func correlateUsers(instagramUsername: String, userId: String) {
        let userRef = userCorrelationRef.child(userId)
        userRef.setValue([
            "instagramUsername": instagramUsername,
            "timestamp": ServerValue.timestamp(),
            "lastInteraction": ServerValue.timestamp()
        ])
    }
    
    /// Load Instagram analytics
    /// - Parameter completion: Callback with Instagram analytics data
    static func loadAnalytics(completion: @escaping ([String: Any]?) -> Void) {
        let analyticsRef = Database.database().reference().child("instagram_analytics")
        
        analyticsRef.observeSingleEvent(of: .value) { snapshot in
            guard let data = snapshot.value as? [String: Any] else {
                completion(nil)
                return
            }
            completion(data)
        }
    }
    
    /// Load optimal posting times
    /// - Parameter completion: Callback with posting time data
    static func loadOptimalPostingTimes(completion: @escaping ([String: Any]?) -> Void) {
        let postingTimesRef = Database.database().reference().child("optimal_posting_times")
        
        postingTimesRef.observeSingleEvent(of: .value) { snapshot in
            guard let data = snapshot.value as? [String: Any] else {
                completion(nil)
                return
            }
            completion(data)
        }
    }
    
    /// Record Instagram conversion for an event
    /// - Parameters:
    ///   - eventId: The ID of the related event
    ///   - instagramPostId: The Instagram post that led to the conversion
    ///   - userId: The user who converted
    static func recordInstagramConversion(eventId: String, instagramPostId: String, userId: String) {
        let conversionRef = Database.database().reference().child("instagram_conversions").childByAutoId()
        
        conversionRef.setValue([
            "eventId": eventId,
            "instagramPostId": instagramPostId,
            "userId": userId,
            "timestamp": ServerValue.timestamp(),
            "source": "ios_app"
        ])
    }
    
    /// Share event to Instagram
    /// - Parameters:
    ///   - eventId: The event ID to share
    ///   - completion: Callback with success status and Instagram post ID
    static func shareEventToInstagram(eventId: String, completion: @escaping (Bool, String?) -> Void) {
        // This would integrate with Instagram's Sharing API
        // For this example, we'll just record that a share was attempted
        
        guard let userId = Auth.auth().currentUser?.uid else {
            completion(false, nil)
            return
        }
        
        let shareRef = Database.database().reference().child("instagram_shares").childByAutoId()
        let shareId = shareRef.key ?? UUID().uuidString
        
        shareRef.setValue([
            "eventId": eventId,
            "userId": userId,
            "timestamp": ServerValue.timestamp(),
            "status": "attempted",
            "platform": "ios"
        ]) { error, _ in
            completion(error == nil, shareId)
        }
    }
} 