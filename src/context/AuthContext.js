import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService, ROLES } from '../firebase/services/AuthService';
import { toast } from 'react-toastify';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

// Create context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [hasWebAccess, setHasWebAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle Google Sign-in users with club-owner role
  const checkEmailRoles = async (email) => {
    if (!email) return false;
    
    try {
      // Sanitize the email to use as the document ID
      const sanitizedEmail = email.replace(/[.#$[\]]/g, '_');
      
      // Check if there's an entry in email_roles for this email
      const emailRoleRef = doc(db, 'email_roles', sanitizedEmail);
      const emailRoleDoc = await getDoc(emailRoleRef);
      
      if (emailRoleDoc.exists()) {
        const roleData = emailRoleDoc.data();
        
        // If this email has club-owner role assigned, update the user's roles
        if (roleData.roles && roleData.roles.includes(ROLES.CLUB_OWNER)) {
          return {
            hasClubOwnerRole: true,
            hasWebAccess: roleData.hasWebAccess || false,
            roles: roleData.roles || []
          };
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error checking email roles:", error);
      return false;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Load user profile data
          const profile = await AuthService.getUserProfile(user.uid);
          
          if (profile) {
            // Set user roles
            setUserRoles(profile.roles || []);
            
            // Check if user can access web dashboard
            const canAccessWeb = await AuthService.canAccessWebDashboard(user.uid);
            setHasWebAccess(canAccessWeb);
            
            // If user doesn't have web access, check email_roles for Google users
            if (!canAccessWeb) {
              const emailRoleCheck = await checkEmailRoles(user.email);
              
              if (emailRoleCheck && emailRoleCheck.hasClubOwnerRole) {
                // User has a club-owner role in email_roles
                setUserRoles(prev => [...prev, ...emailRoleCheck.roles]);
                setHasWebAccess(emailRoleCheck.hasWebAccess);
                
                // Update the user's profile with the new roles
                await AuthService.setUserRole(user.uid, ROLES.CLUB_OWNER);
                toast.success('Club-owner permissions have been added to your account.');
              } else if (window.location.pathname !== '/access-denied') {
                toast.error('You do not have access to the web dashboard');
                await AuthService.signOut();
                window.location.href = '/login';
              }
            }
          } else {
            setUserRoles([]);
            setHasWebAccess(false);
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          setUserRoles([]);
          setHasWebAccess(false);
        }
      } else {
        setUserRoles([]);
        setHasWebAccess(false);
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Sign in with email and password
  const signIn = async (email, password) => {
    setError(null);
    try {
      const user = await AuthService.signIn(email, password);
      
      // Update last login time
      const userRef = await AuthService.getUserProfile(user.uid);
      if (userRef) {
        // Update user profile
        await AuthService.setUserRole(user.uid, userRef.roles?.[0] || ROLES.CLUB_OWNER);
      }
      
      // Load user roles and check web access
      const roles = await AuthService.getUserRoles(user.uid);
      setUserRoles(roles);
      
      const canAccessWeb = await AuthService.canAccessWebDashboard(user.uid);
      setHasWebAccess(canAccessWeb);
      
      if (!canAccessWeb) {
        toast.error('You do not have access to the web dashboard');
        await AuthService.signOut();
        throw new Error('You do not have permission to access the web dashboard');
      }
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    setError(null);
    try {
      await AuthService.signOut();
      setUserRoles([]);
      setHasWebAccess(false);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign up - always as club owner for the web dashboard
  const signUp = async (email, password, displayName, role = ROLES.CLUB_OWNER) => {
    setError(null);
    try {
      const user = await AuthService.createUser(email, password, { displayName }, role);
      
      // Set the user roles and web access in the state
      setUserRoles([role]);
      setHasWebAccess(true);
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    setError(null);
    try {
      await AuthService.sendPasswordReset(email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };
  
  // Check if user has a specific role
  const hasRole = (role) => {
    return userRoles.includes(role);
  };
  
  // Add a role to the current user
  const addRole = async (role) => {
    if (!currentUser) return false;
    
    try {
      await AuthService.setUserRole(currentUser.uid, role);
      
      // Update local state
      if (!userRoles.includes(role)) {
        setUserRoles([...userRoles, role]);
      }
      
      // If adding a web role, update web access
      if (role === ROLES.CLUB_OWNER || role === ROLES.ADMIN || role === ROLES.STAFF) {
        setHasWebAccess(true);
      }
      
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  // Value object
  const value = {
    currentUser,
    userRoles,
    hasWebAccess,
    loading,
    error,
    signIn,
    signOut,
    signUp,
    resetPassword,
    hasRole,
    addRole,
    roles: ROLES // Export roles constants for component use
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 