import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { app, db } from '../firebase';

// Define application roles
export const ROLES = {
  USER: 'user', // iOS app user
  CLUB_OWNER: 'club-owner', // Web dashboard club owner
  ADMIN: 'admin', // Web dashboard admin
  STAFF: 'staff', // Staff member
  PROMOTER: 'promoter' // Promoter role
};

export class AuthService {
  static auth = getAuth(app);
  
  /**
   * Create a vendor account entry for a Google-authenticated user
   * This is used when a user has already signed up with Google in the iOS app
   * and wants to add club-owner role without signing in with Google again
   * @param {string} email - User email
   * @param {string} displayName - User display name (venue name)
   * @returns {Promise<void>}
   */
  static async createGuestVendorAccount(email, displayName) {
    try {
      // Since we're starting fresh, we'll create a direct document in the users collection
      // Generate a unique ID that identifies this as a temp account
      const tempId = `temp_${Date.now()}_vendor`;
      
      // Create a simplified user record
      await setDoc(doc(db, 'users', tempId), {
        email,
        displayName,
        roles: [ROLES.CLUB_OWNER],
        isVendor: true,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('Created temporary vendor account for:', email);
      return true;
    } catch (error) {
      console.error('Error creating guest vendor account:', error);
      throw new Error(`Error creating guest vendor account: ${error.message}`);
    }
  }
  
  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User credentials
   */
  static async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(`Authentication error: ${error.message}`);
    }
  }
  
  /**
   * Sign out current user
   * @returns {Promise<void>}
   */
  static async signOut() {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw new Error(`Sign out error: ${error.message}`);
    }
  }
  
  /**
   * Create a new user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Object} profileData - User profile data
   * @param {string} role - User role (club-owner, user, etc.)
   * @returns {Promise<Object>} - User credentials
   */
  static async createUser(email, password, profileData = {}, role = ROLES.CLUB_OWNER) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      if (profileData.displayName) {
        await updateProfile(userCredential.user, {
          displayName: profileData.displayName,
          photoURL: profileData.photoURL || null
        });
      }
      
      // Save user role and metadata in Firestore
      await this.createUserProfile(userCredential.user.uid, {
        email,
        displayName: profileData.displayName || '',
        photoURL: profileData.photoURL || '',
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date()
      });
      
      return userCredential.user;
    } catch (error) {
      throw new Error(`User creation error: ${error.message}`);
    }
  }
  
  /**
   * Create or update user profile in Firestore
   * @param {string} userId - User ID
   * @param {Object} profileData - User profile data
   * @returns {Promise<void>}
   */
  static async createUserProfile(userId, profileData) {
    try {
      const userRef = doc(db, 'users', userId);
      
      // Check if user document exists
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Update existing user
        await updateDoc(userRef, {
          ...profileData,
          updatedAt: new Date(),
          lastLoginAt: new Date()
        });
      } else {
        // Create new user
        await setDoc(userRef, {
          ...profileData,
          apps: {
            ios: profileData.role === ROLES.USER, // Flag for iOS app usage
            web: profileData.role === ROLES.CLUB_OWNER || profileData.role === ROLES.ADMIN // Flag for web app usage
          },
          roles: [profileData.role] // Array of roles
        });
      }
    } catch (error) {
      throw new Error(`Error creating user profile: ${error.message}`);
    }
  }
  
  /**
   * Get current authenticated user
   * @returns {Object|null} - Current user or null
   */
  static getCurrentUser() {
    return this.auth.currentUser;
  }
  
  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  static async sendPasswordReset(email) {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      throw new Error(`Password reset error: ${error.message}`);
    }
  }
  
  /**
   * Subscribe to auth state changes
   * @param {Function} callback - Callback function
   * @returns {Function} - Unsubscribe function
   */
  static onAuthStateChanged(callback) {
    return onAuthStateChanged(this.auth, callback);
  }
  
  /**
   * Set user role in Firestore
   * @param {string} userId - User ID
   * @param {string} role - User role
   * @returns {Promise<void>}
   */
  static async setUserRole(userId, role) {
    try {
      const userRef = doc(db, 'users', userId);
      
      // Check if the user document already exists
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Get existing roles array
        const userData = userDoc.data();
        const roles = userData.roles || [];
        const apps = userData.apps || { ios: false, web: false };
        
        // Update apps flags based on role
        if (role === ROLES.USER) {
          apps.ios = true;
        } else if (role === ROLES.CLUB_OWNER || role === ROLES.ADMIN) {
          apps.web = true;
        }
        
        // Add the role if it doesn't already exist
        if (!roles.includes(role)) {
          roles.push(role);
          await updateDoc(userRef, { 
            roles,
            apps,
            updatedAt: new Date() 
          });
        } else {
          // Just update the apps flags and lastLoginAt
          await updateDoc(userRef, { 
            apps,
            lastLoginAt: new Date(),
            updatedAt: new Date() 
          });
        }
      } else {
        // Create new user document with role
        await setDoc(userRef, { 
          roles: [role],
          apps: {
            ios: role === ROLES.USER,
            web: role === ROLES.CLUB_OWNER || role === ROLES.ADMIN
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLoginAt: new Date()
        });
      }
    } catch (error) {
      throw new Error(`Error setting user role: ${error.message}`);
    }
  }
  
  /**
   * Get user profile data from Firestore
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User profile data
   */
  static async getUserProfile(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data();
      }
      
      return null;
    } catch (error) {
      throw new Error(`Error getting user profile: ${error.message}`);
    }
  }
  
  /**
   * Get user roles from Firestore
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of user roles
   */
  static async getUserRoles(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.roles || [];
      }
      
      return [];
    } catch (error) {
      throw new Error(`Error getting user roles: ${error.message}`);
    }
  }
  
  /**
   * Check if user has a specific role
   * @param {string} userId - User ID
   * @param {string} role - Role to check
   * @returns {Promise<boolean>} - True if user has the role
   */
  static async hasRole(userId, role) {
    const roles = await this.getUserRoles(userId);
    return roles.includes(role);
  }
  
  /**
   * Check if the user is allowed to access the web dashboard
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - True if user has access
   */
  static async canAccessWebDashboard(userId) {
    const profile = await this.getUserProfile(userId);
    
    if (!profile) return false;
    
    // Check roles that can access the web dashboard
    const webRoles = [ROLES.CLUB_OWNER, ROLES.ADMIN, ROLES.STAFF];
    const hasWebRole = profile.roles?.some(role => webRoles.includes(role));
    
    // Check if apps.web flag is true
    const hasWebAccess = profile.apps?.web === true;
    
    return hasWebRole || hasWebAccess;
  }
  
  /**
   * Delete a user account
   * @returns {Promise<void>}
   */
  static async deleteUserAccount() {
    const user = this.getCurrentUser();
    
    if (!user) {
      throw new Error('No authenticated user found');
    }
    
    try {
      // First delete the user's data from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      
      // Check if the document exists
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        await deleteDoc(userDocRef);
      }
      
      // Then delete the user's authentication
      await deleteUser(user);
      
      return true;
    } catch (error) {
      console.error('Error deleting user account:', error);
      
      // If the error is related to requiring recent login, throw a specific error
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('For security reasons, please log out and sign in again before deleting your account');
      }
      
      throw new Error(`Failed to delete account: ${error.message}`);
    }
  }
  
  /**
   * Reauthenticate the user before sensitive operations
   * @param {string} password - User's current password
   * @returns {Promise<void>}
   */
  static async reauthenticateUser(password) {
    const user = this.getCurrentUser();
    
    if (!user) {
      throw new Error('No authenticated user found');
    }
    
    if (!user.email) {
      throw new Error('User has no email associated with their account');
    }
    
    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      console.error('Reauthentication error:', error);
      throw new Error(`Reauthentication failed: ${error.message}`);
    }
  }
} 