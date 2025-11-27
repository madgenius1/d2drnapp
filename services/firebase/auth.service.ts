/**
 * Firebase Authentication Service
 * Handles all authentication operations with Firebase Auth
 */

import {
    createUserWithEmailAndPassword,
    User as FirebaseAuthUser,
    signOut as firebaseSignOut,
    updateProfile as firebaseUpdateProfile,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    UserCredential,
} from 'firebase/auth';
import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import type {
    AuthCredentials,
    AuthResult,
    RegisterData,
    UpdateProfileData,
    User
} from '../../types';
import { auth, firestore } from './config';

/**
 * Convert Firebase Auth User to app User type
 */
const mapFirebaseUserToUser = async (
  firebaseUser: FirebaseAuthUser
): Promise<User> => {
  // Fetch user document from Firestore
  const userDocRef = doc(firestore, 'users', firebaseUser.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: userData.name || firebaseUser.displayName || '',
      phone: userData.phone,
      avatar: userData.avatar || firebaseUser.photoURL || undefined,
      createdAt: userData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: userData.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      preferences: userData.preferences || {
        notifications: true,
        darkMode: false,
        language: 'en',
      },
      stats: userData.stats || {
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        totalSpent: 0,
      },
    };
  }

  // User document doesn't exist, return minimal user
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    preferences: {
      notifications: true,
      darkMode: false,
      language: 'en',
    },
    stats: {
      totalOrders: 0,
      completedOrders: 0,
      pendingOrders: 0,
      totalSpent: 0,
    },
  };
};

/**
 * Create user document in Firestore
 */
const createUserDocument = async (
  userId: string,
  data: RegisterData
): Promise<void> => {
  const userDocRef = doc(firestore, 'users', userId);
  
  await setDoc(userDocRef, {
    email: data.email,
    name: data.name,
    phone: data.phone || null,
    avatar: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    preferences: {
      notifications: true,
      darkMode: false,
      language: 'en',
    },
    stats: {
      totalOrders: 0,
      completedOrders: 0,
      pendingOrders: 0,
      totalSpent: 0,
    },
  });
};

/**
 * Sign up new user with email and password
 */
export const signUpWithEmail = async (
  data: RegisterData
): Promise<AuthResult> => {
  try {
    // Create Firebase Auth user
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // Update Firebase Auth profile with display name
    await firebaseUpdateProfile(userCredential.user, {
      displayName: data.name,
    });

    // Create user document in Firestore
    await createUserDocument(userCredential.user.uid, data);

    // Fetch complete user data
    const user = await mapFirebaseUserToUser(userCredential.user);

    return {
      success: true,
      user,
    };
  } catch (error: any) {
    console.error('[Auth] Sign up error:', error);
    
    let errorMessage = 'Failed to create account. Please try again.';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered. Please sign in.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak. Use at least 6 characters.';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Sign in existing user with email and password
 */
export const signInWithEmail = async (
  credentials: AuthCredentials
): Promise<AuthResult> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    const user = await mapFirebaseUserToUser(userCredential.user);

    return {
      success: true,
      user,
    };
  } catch (error: any) {
    console.error('[Auth] Sign in error:', error);
    
    let errorMessage = 'Failed to sign in. Please try again.';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled.';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('[Auth] Sign out error:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (
  userId: string,
  data: UpdateProfileData
): Promise<AuthResult> => {
  try {
    const userDocRef = doc(firestore, 'users', userId);
    
    // Update Firestore document
    const updateData: any = {
      updatedAt: serverTimestamp(),
    };
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.preferences !== undefined) {
      updateData.preferences = data.preferences;
    }
    
    await updateDoc(userDocRef, updateData);

    // Update Firebase Auth profile if name changed
    if (data.name && auth.currentUser) {
      await firebaseUpdateProfile(auth.currentUser, {
        displayName: data.name,
      });
    }

    // Fetch updated user
    if (auth.currentUser) {
      const user = await mapFirebaseUserToUser(auth.currentUser);
      return {
        success: true,
        user,
      };
    }

    return {
      success: false,
      error: 'No user currently signed in',
    };
  } catch (error) {
    console.error('[Auth] Update profile error:', error);
    return {
      success: false,
      error: 'Failed to update profile. Please try again.',
    };
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<AuthResult> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
    };
  } catch (error: any) {
    console.error('[Auth] Password reset error:', error);
    
    let errorMessage = 'Failed to send reset email. Please try again.';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    return await mapFirebaseUserToUser(currentUser);
  } catch (error) {
    console.error('[Auth] Get current user error:', error);
    return null;
  }
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChange = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const user = await mapFirebaseUserToUser(firebaseUser);
      callback(user);
    } else {
      callback(null);
    }
  });
};

/**
 * Get Firebase ID token (for API authentication)
 */
export const getIdToken = async (): Promise<string | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    return await currentUser.getIdToken();
  } catch (error) {
    console.error('[Auth] Get ID token error:', error);
    return null;
  }
};

export default {
  signUpWithEmail,
  signInWithEmail,
  signOut,
  updateProfile,
  resetPassword,
  getCurrentUser,
  onAuthStateChange,
  getIdToken,
};