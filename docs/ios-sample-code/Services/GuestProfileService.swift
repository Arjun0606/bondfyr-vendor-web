import Foundation
import Firebase
import FirebaseFirestore
import FirebaseAuth

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
    
    // MARK: - Properties
    
    static let collectionName = "guests"
    private static let db = Firestore.firestore()
    
    // MARK: - CRUD Methods
    
    /// Create a new guest profile
    /// - Parameters:
    ///   - guestData: Dictionary containing guest information
    ///   - completion: Callback with the new guest ID or error
    static func create(guestData: [String: Any], completion: @escaping (Result<String, Error>) -> Void) {
        // Validate required fields
        guard let fullName = guestData["fullName"] as? String,
              let phoneNumber = guestData["phoneNumber"] as? String,
              let email = guestData["email"] as? String else {
            completion(.failure(NSError(domain: "GuestProfileService", code: 400, userInfo: [
                NSLocalizedDescriptionKey: "Missing required fields"
            ])))
            return
        }
        
        // Add timestamps
        var data = guestData
        data["createdAt"] = FieldValue.serverTimestamp()
        data["updatedAt"] = FieldValue.serverTimestamp()
        data["isFirstTime"] = data["isFirstTime"] as? Bool ?? true
        data["visitCount"] = data["visitCount"] as? Int ?? 1
        
        // Add to Firestore
        db.collection(collectionName).addDocument(data: data) { error, docRef in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            if let docId = docRef?.documentID {
                completion(.success(docId))
            } else {
                completion(.failure(NSError(domain: "GuestProfileService", code: 500, userInfo: [
                    NSLocalizedDescriptionKey: "Failed to get document ID"
                ])))
            }
        }
    }
    
    /// Update an existing guest profile
    /// - Parameters:
    ///   - guestId: ID of the guest to update
    ///   - updateData: Dictionary with fields to update
    ///   - completion: Callback with success or failure
    static func update(guestId: String, updateData: [String: Any], completion: @escaping (Result<Void, Error>) -> Void) {
        var data = updateData
        data["updatedAt"] = FieldValue.serverTimestamp()
        
        db.collection(collectionName).document(guestId).updateData(data) { error in
            if let error = error {
                completion(.failure(error))
            } else {
                completion(.success(()))
            }
        }
    }
    
    /// Fetch a guest profile by ID
    /// - Parameters:
    ///   - guestId: ID of the guest to fetch
    ///   - completion: Callback with the guest profile or error
    static func getById(guestId: String, completion: @escaping (Result<GuestProfile?, Error>) -> Void) {
        db.collection(collectionName).document(guestId).getDocument { snapshot, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let snapshot = snapshot, snapshot.exists else {
                completion(.success(nil))
                return
            }
            
            let data = snapshot.data() ?? [:]
            
            do {
                let profile = try self.parseGuestProfile(id: snapshot.documentID, data: data)
                completion(.success(profile))
            } catch {
                completion(.failure(error))
            }
        }
    }
    
    /// Find a guest by phone number
    /// - Parameters:
    ///   - phoneNumber: Phone number to search for
    ///   - completion: Callback with the guest profile or error
    static func findByPhone(phoneNumber: String, completion: @escaping (Result<GuestProfile?, Error>) -> Void) {
        db.collection(collectionName)
            .whereField("phoneNumber", isEqualTo: phoneNumber)
            .limit(to: 1)
            .getDocuments { snapshot, error in
                if let error = error {
                    completion(.failure(error))
                    return
                }
                
                guard let snapshot = snapshot, !snapshot.documents.isEmpty else {
                    completion(.success(nil))
                    return
                }
                
                let document = snapshot.documents[0]
                let data = document.data()
                
                do {
                    let profile = try self.parseGuestProfile(id: document.documentID, data: data)
                    completion(.success(profile))
                } catch {
                    completion(.failure(error))
                }
            }
    }
    
    /// Increment the visit count for a guest
    /// - Parameters:
    ///   - guestId: ID of the guest
    ///   - completion: Callback with success or failure
    static func incrementVisitCount(guestId: String, completion: @escaping (Result<Void, Error>) -> Void) {
        let guestRef = db.collection(collectionName).document(guestId)
        
        db.runTransaction({ (transaction, errorPointer) -> Any? in
            let guestDocument: DocumentSnapshot
            do {
                try guestDocument = transaction.getDocument(guestRef)
            } catch let fetchError as NSError {
                errorPointer?.pointee = fetchError
                return nil
            }
            
            guard let data = guestDocument.data() else {
                let error = NSError(domain: "GuestProfileService", code: 404, userInfo: [
                    NSLocalizedDescriptionKey: "Guest document does not exist"
                ])
                errorPointer?.pointee = error
                return nil
            }
            
            let currentCount = data["visitCount"] as? Int ?? 0
            
            transaction.updateData([
                "visitCount": currentCount + 1,
                "isFirstTime": false,
                "updatedAt": FieldValue.serverTimestamp()
            ], forDocument: guestRef)
            
            return nil
        }) { _, error in
            if let error = error {
                completion(.failure(error))
            } else {
                completion(.success(()))
            }
        }
    }
    
    /// Link the currently authenticated user to a guest profile
    /// - Parameters:
    ///   - guestId: ID of the guest profile
    ///   - completion: Callback with success or failure
    static func linkAuthUserToProfile(guestId: String, completion: @escaping (Result<Void, Error>) -> Void) {
        guard let userId = Auth.auth().currentUser?.uid else {
            completion(.failure(NSError(domain: "GuestProfileService", code: 401, userInfo: [
                NSLocalizedDescriptionKey: "No authenticated user"
            ])))
            return
        }
        
        // Update the guest document with the user ID
        db.collection(collectionName).document(guestId).updateData([
            "userId": userId,
            "updatedAt": FieldValue.serverTimestamp()
        ]) { error in
            if let error = error {
                completion(.failure(error))
            } else {
                // Also store the reference in the user's document
                db.collection("users").document(userId).setData([
                    "guestProfileId": guestId,
                    "updatedAt": FieldValue.serverTimestamp()
                ], merge: true) { error in
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
    
    /// Parse Firestore data into a GuestProfile struct
    /// - Parameters:
    ///   - id: Document ID
    ///   - data: Firestore document data
    /// - Returns: GuestProfile struct
    private static func parseGuestProfile(id: String, data: [String: Any]) throws -> GuestProfile {
        guard let fullName = data["fullName"] as? String,
              let phoneNumber = data["phoneNumber"] as? String,
              let email = data["email"] as? String else {
            throw NSError(domain: "GuestProfileService", code: 400, userInfo: [
                NSLocalizedDescriptionKey: "Invalid guest data format"
            ])
        }
        
        let gender = data["gender"] as? String
        let instagramHandle = data["instagramHandle"] as? String
        let isFirstTime = data["isFirstTime"] as? Bool ?? true
        let visitCount = data["visitCount"] as? Int ?? 1
        let referralSource = data["referralSource"] as? String
        
        // Parse timestamps
        let createdTimestamp = data["createdAt"] as? Timestamp
        let updatedTimestamp = data["updatedAt"] as? Timestamp
        
        let createdAt = createdTimestamp?.dateValue() ?? Date()
        let updatedAt = updatedTimestamp?.dateValue() ?? Date()
        
        // Parse date of birth if present
        var dateOfBirth: Date? = nil
        if let dobTimestamp = data["dateOfBirth"] as? Timestamp {
            dateOfBirth = dobTimestamp.dateValue()
        }
        
        return GuestProfile(
            id: id,
            fullName: fullName,
            phoneNumber: phoneNumber,
            email: email,
            dateOfBirth: dateOfBirth,
            gender: gender,
            instagramHandle: instagramHandle,
            isFirstTime: isFirstTime,
            visitCount: visitCount,
            referralSource: referralSource,
            createdAt: createdAt,
            updatedAt: updatedAt
        )
    }
} 