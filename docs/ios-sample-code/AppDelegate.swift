import UIKit
import Firebase
import UserNotifications
import FirebaseMessaging

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Configure Firebase
        FirebaseApp.configure()
        
        // Register for push notifications
        registerForPushNotifications()
        
        return true
    }
    
    // MARK: - UISceneSession Lifecycle
    
    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
        // Called when the user discards a scene session
    }
    
    // MARK: - Deep Linking
    
    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        if userActivity.activityType == NSUserActivityTypeBrowsingWeb, let url = userActivity.webpageURL {
            return handleIncomingURL(url)
        }
        return false
    }
    
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        return handleIncomingURL(url)
    }
    
    private func handleIncomingURL(_ url: URL) -> Bool {
        // Check if the URL is from Instagram and extract parameters
        if url.host == "instagram.com" || url.host?.contains("instagram") == true {
            // Track Instagram click
            if let userId = Auth.auth().currentUser?.uid {
                InstagramService.trackInstagramClick(userId: userId, contentType: "deeplink")
            }
            
            // Process specific paths/parameters
            if url.path.contains("/event/") {
                let components = url.pathComponents
                if let eventIdIndex = components.firstIndex(of: "event"), eventIdIndex + 1 < components.count {
                    let eventId = components[eventIdIndex + 1]
                    // Navigate to event details in your app
                    NotificationCenter.default.post(name: Notification.Name("OpenEvent"), object: nil, userInfo: ["eventId": eventId])
                    return true
                }
            }
            
            return true
        }
        return false
    }
}

// MARK: - Push Notification Handling
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
    
    // Handle notification received while app is in foreground
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        let userInfo = notification.request.content.userInfo
        
        // Log notification analytics
        if let userId = Auth.auth().currentUser?.uid,
           let notificationType = userInfo["type"] as? String {
            VenueAnalytics.trackNotificationEngagement(
                userId: userId,
                notificationType: notificationType,
                action: "received"
            )
        }
        
        completionHandler([.alert, .badge, .sound])
    }
    
    // Handle notification tap
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        let userInfo = response.notification.request.content.userInfo
        
        // Log notification interaction
        if let userId = Auth.auth().currentUser?.uid,
           let notificationType = userInfo["type"] as? String {
            VenueAnalytics.trackNotificationEngagement(
                userId: userId,
                notificationType: notificationType,
                action: "opened"
            )
        }
        
        // Handle specific notification types
        if let eventId = userInfo["eventId"] as? String {
            NotificationCenter.default.post(name: Notification.Name("OpenEvent"), object: nil, userInfo: ["eventId": eventId])
        }
        
        completionHandler()
    }
} 