# iOS Firebase Integration Guide for Bondfyr App

This guide will help you integrate your iOS application with the same Firebase backend used by the Bondfyr vendor web app.

## Prerequisites

- Xcode 15.0 or later
- iOS 16.0+ target
- Swift 5.9+
- CocoaPods or Swift Package Manager (SPM)

## Firebase Setup

### 1. Install Firebase SDK

#### Using CocoaPods

Add the following to your Podfile:

```ruby
pod 'Firebase/Core'
pod 'Firebase/Auth'
pod 'Firebase/Firestore'
pod 'Firebase/Database'
pod 'Firebase/Storage'
pod 'Firebase/Analytics'
pod 'Firebase/Messaging'  # If you need push notifications
```

Then run:

```bash
pod install
```

#### Using Swift Package Manager

1. In Xcode, select File > Add Packages...
2. Enter the Firebase iOS SDK package URL: https://github.com/firebase/firebase-ios-sdk.git
3. Select the Firebase iOS SDK package
4. Choose the products you need: FirebaseCore, FirebaseAuth, FirebaseFirestore, FirebaseDatabase, FirebaseStorage, FirebaseAnalytics, FirebaseMessaging (if needed)

### 2. Configure Firebase

1. Download the `GoogleService-Info.plist` file from the Firebase console
2. Add it to your Xcode project, making sure to add it to all targets
3. Initialize Firebase in your AppDelegate.swift file:

```swift
import Firebase

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        FirebaseApp.configure()
        return true
    }
    
    // ... rest of AppDelegate
}
```

## Integration with Bondfyr Services

### Firebase Configuration Values

Use these configuration values to ensure your iOS app connects to the same Firebase project as the web app:

```swift
let firebaseConfig = [
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_PROJECT_ID.firebaseapp.com",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_PROJECT_ID.appspot.com",
  "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
  "appId": "YOUR_APP_ID",
  "databaseURL": "https://YOUR_PROJECT_ID.firebaseio.com"
]
```

Replace the placeholder values with the actual values from your `.env` file in the web project.

### Key Database References

To maintain consistency with the web app, use the same database references:

```swift
let eventsRef = Database.database().reference().child("events")
let venueAnalyticsRef = Database.database().reference().child("venue_analytics")
let securityIncidentsRef = Database.database().reference().child("security_incidents")
let instagramClicksRef = Database.database().reference().child("instagram_clicks")
let userInstagramCorrelationRef = Database.database().reference().child("user_instagram_correlation")
let notificationAnalyticsRef = Database.database().reference().child("notification_analytics")
```

### Guest Profile Integration

Use this model to match the web app's guest profile structure:

```swift
struct GuestProfile {
    let id: String
    let fullName: String
    let phoneNumber: String
    let email: String
    let dateOfBirth: Date?
    let gender: String?
    let instagramHandle: String?
    let isFirstTime: Bool
    let visitCount: Int
    let referralSource: String?
    let createdAt: Date
    let updatedAt: Date
}

class GuestProfileService {
    static let collectionName = "guests"
    
    static func create(guestData: [String: Any]) -> Promise<String> {
        // Implementation details
    }
    
    static func update(guestId: String, updateData: [String: Any]) -> Promise<Void> {
        // Implementation details
    }
    
    static func getById(guestId: String) -> Promise<GuestProfile?> {
        // Implementation details
    }
    
    static func findByPhone(phoneNumber: String) -> Promise<GuestProfile?> {
        // Implementation details
    }
    
    static func incrementVisitCount(guestId: String) -> Promise<Void> {
        // Implementation details
    }
}
```

### Instagram Service Integration

Track app-to-Instagram clicks using the same structure as the web app:

```swift
class InstagramService {
    static func trackInstagramClick(userId: String, contentType: String) {
        let clicksRef = Database.database().reference().child("instagram_clicks").child("\(Int(Date().timeIntervalSince1970 * 1000))")
        clicksRef.setValue([
            "userId": userId,
            "timestamp": ServerValue.timestamp(),
            "contentType": contentType,
            "source": "ios_app"
        ])
    }
    
    static func correlateUsers(instagramUsername: String, userId: String) {
        let userRef = Database.database().reference().child("user_instagram_correlation").child(userId)
        userRef.setValue([
            "instagramUsername": instagramUsername,
            "timestamp": ServerValue.timestamp(),
            "lastInteraction": ServerValue.timestamp()
        ])
    }
}
```

### Venue Analytics Integration

```swift
class VenueAnalytics {
    static func subscribeToRealTimeStats(completion: @escaping ([String: Any]) -> Void) -> DatabaseHandle {
        let analyticsRef = Database.database().reference().child("venue_analytics")
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
    
    static func trackSecurityIncident(incidentData: [String: Any]) {
        let securityRef = Database.database().reference().child("security_incidents").childByAutoId()
        var data = incidentData
        data["timestamp"] = ServerValue.timestamp()
        securityRef.setValue(data)
    }
    
    static func trackNotificationEngagement(userId: String, notificationType: String, action: String) {
        let notificationRef = Database.database().reference().child("notification_analytics").child(notificationType)
        
        notificationRef.observeSingleEvent(of: .value) { snapshot in
            guard var data = snapshot.value as? [String: Any] else {
                notificationRef.setValue([
                    "total_sent": 1,
                    "\(action)_count": 1
                ])
                return
            }
            
            let totalSent = (data["total_sent"] as? Int ?? 0) + 1
            let actionCount = (data["\(action)_count"] as? Int ?? 0) + 1
            
            data["total_sent"] = totalSent
            data["\(action)_count"] = actionCount
            
            notificationRef.setValue(data)
        }
    }
}
```

### Event Management Integration

```swift
class EventManagementService {
    static let eventsRef = Database.database().reference().child("events")
    
    static func getEvents(completion: @escaping ([String: Any]) -> Void) {
        eventsRef.observeSingleEvent(of: .value) { snapshot in
            guard let events = snapshot.value as? [String: Any] else {
                completion([:])
                return
            }
            completion(events)
        }
    }
    
    static func createEvent(eventData: [String: Any], completion: @escaping (String?, Error?) -> Void) {
        let newEventRef = eventsRef.childByAutoId()
        var data = eventData
        data["createdAt"] = ServerValue.timestamp()
        data["updatedAt"] = ServerValue.timestamp()
        
        newEventRef.setValue(data) { error, _ in
            completion(error == nil ? newEventRef.key : nil, error)
        }
    }
    
    static func updateEventAnalytics(eventId: String, analyticsData: [String: Any]) {
        let eventAnalyticsRef = eventsRef.child(eventId).child("analytics")
        eventAnalyticsRef.updateChildValues(analyticsData)
    }
}
```

## Push Notification Handling

If you're using Firebase Cloud Messaging for push notifications:

```swift
import UserNotifications
import FirebaseMessaging

extension AppDelegate: UNUserNotificationCenterDelegate, MessagingDelegate {
    
    func registerForPushNotifications() {
        UNUserNotificationCenter.current().delegate = self
        
        let authOptions: UNAuthorizationOptions = [.alert, .badge, .sound]
        UNUserNotificationCenter.current().requestAuthorization(
            options: authOptions,
            completionHandler: { _, _ in }
        )
        
        UIApplication.shared.registerForRemoteNotifications()
        
        Messaging.messaging().delegate = self
    }
    
    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        let dataDict: [String: String] = ["token": fcmToken ?? ""]
        NotificationCenter.default.post(
            name: Notification.Name("FCMToken"),
            object: nil,
            userInfo: dataDict
        )
        
        // Save token to user profile if needed
        if let token = fcmToken, let userId = Auth.auth().currentUser?.uid {
            Database.database().reference().child("users").child(userId).child("fcmToken").setValue(token)
        }
    }
    
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Messaging.messaging().apnsToken = deviceToken
    }
}
```

## Authentication

Make sure to use Firebase Authentication for consistency across platforms:

```swift
import FirebaseAuth

class AuthService {
    static func signIn(email: String, password: String, completion: @escaping (Result<User, Error>) -> Void) {
        Auth.auth().signIn(withEmail: email, password: password) { result, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            if let user = result?.user {
                completion(.success(user))
            }
        }
    }
    
    static func signOut() throws {
        try Auth.auth().signOut()
    }
    
    static func getCurrentUser() -> User? {
        return Auth.auth().currentUser
    }
}
```

## Deep Linking

To support deep linking for Instagram integration:

1. Configure your app's Associated Domains and Universal Links in Xcode
2. Handle incoming links in your AppDelegate:

```swift
func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    if userActivity.activityType == NSUserActivityTypeBrowsingWeb, let url = userActivity.webpageURL {
        // Handle the URL (e.g., process Instagram deeplinks)
        return handleIncomingURL(url)
    }
    return false
}

func handleIncomingURL(_ url: URL) -> Bool {
    // Check if the URL is from Instagram and extract parameters
    if url.host == "instagram.com" || url.host?.contains("instagram") == true {
        // Track Instagram click
        if let userId = Auth.auth().currentUser?.uid {
            InstagramService.trackInstagramClick(userId: userId, contentType: "deeplink")
        }
        
        // Process specific paths/parameters
        // e.g., extract event ID from URL and navigate to the event details
        
        return true
    }
    return false
}
```

## Next Steps

1. Replace placeholder values with your actual Firebase credentials
2. Implement detailed service classes with proper error handling
3. Create appropriate Swift models for your data
4. Test integration with the web app's Firebase backend
5. Set up proper security rules in the Firebase console 