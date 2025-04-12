# Bondfyr iOS App - Firebase Integration

This directory contains sample Swift code for integrating the Bondfyr iOS app with Firebase, matching the same backend used by the Bondfyr vendor web application.

## Setup

1. Follow the instructions in `../ios-firebase-integration.md` for initial Firebase setup
2. Add the provided Swift files to your Xcode project
3. Update the Firebase configuration with your project details

## Directory Structure

```
Services/
├── EventManagementService.swift      # Event management and analytics
├── GuestProfileService.swift         # Guest profile management
├── InstagramService.swift            # Instagram integration
└── VenueAnalytics.swift              # Venue analytics tracking
AppDelegate.swift                     # Firebase initialization and deep linking
```

## Key Features

### Firebase Integration

The integration allows the iOS app to share the same Firebase backend as the web vendor application, ensuring data consistency across platforms.

### Authentication

User authentication is handled through Firebase Authentication, matching the web app's authentication system.

### Real-Time Data

The services use Firebase Realtime Database to provide real-time updates and synchronization with the web application.

### Deep Linking

The app supports deep linking for Instagram integration, allowing users to be directed to specific content.

### Push Notifications

Firebase Cloud Messaging is set up for push notifications, with analytics tracking for engagement.

## Development Notes

- Replace placeholder values with your actual Firebase configuration
- Implement proper error handling in production code
- Add appropriate UI code to interact with these services
- Ensure proper security rules are set up in Firebase console

## Usage Examples

### Initialize Firebase

```swift
// In AppDelegate.swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    FirebaseApp.configure()
    return true
}
```

### Track Instagram Click

```swift
if let userId = Auth.auth().currentUser?.uid {
    InstagramService.trackInstagramClick(userId: userId, contentType: "story")
}
```

### Create Guest Profile

```swift
let guestData: [String: Any] = [
    "fullName": "John Doe",
    "phoneNumber": "+1234567890",
    "email": "john@example.com",
    "gender": "male",
    "instagramHandle": "@johndoe"
]

GuestProfileService.create(guestData: guestData) { result in
    switch result {
    case .success(let guestId):
        print("Created guest with ID: \(guestId)")
    case .failure(let error):
        print("Error creating guest: \(error)")
    }
}
```

### Get Event Details

```swift
EventManagementService.getEvent(eventId: "event123") { event in
    if let event = event {
        print("Event: \(event.title)")
        
        // Display event details in UI
        self.titleLabel.text = event.title
        self.descriptionLabel.text = event.description
        
        if let posterUrl = event.posterUrl {
            // Load poster image
        }
    }
}
```

### Subscribe to Venue Analytics

```swift
let handle = VenueAnalytics.subscribeToRealTimeStats { stats in
    let currentOccupancy = stats["currentOccupancy"] as? Int ?? 0
    let genderRatio = stats["genderRatio"] as? [String: Any] ?? [:]
    
    // Update UI with real-time stats
    self.occupancyLabel.text = "\(currentOccupancy)"
    
    // Update gender ratio chart
    if let male = genderRatio["male"] as? Int,
       let female = genderRatio["female"] as? Int {
        self.updateGenderChart(male: male, female: female)
    }
}

// When done, unsubscribe
VenueAnalytics.unsubscribeFromRealTimeStats(handle: handle)
```

## Next Steps

1. Implement the UI components for the app
2. Add appropriate error handling for network operations
3. Implement offline capabilities using Firebase's offline support
4. Add user authentication flows
5. Test integration with the web backend 