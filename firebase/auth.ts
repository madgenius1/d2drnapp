/**
 * Firebase Authentication Methods
 * Wrapper functions for Firebase Auth operations
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import { auth } from './config';
import { User, LoginCredentials, RegisterData } from '../types/models/User';

/**
 * Register new user with email and password
 */
export const registerWithEmail = async (
  data: RegisterData
): Promise<{ user: FirebaseUser; credential: UserCredential }> => {
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // Update display name
    if (credential.user && data.name) {
      await updateProfile(credential.user, {
        displayName: data.name,
      });
    }

    return { user: credential.user, credential };
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign in with email and password
 */
export const loginWithEmail = async (
  credentials: LoginCredentials
): Promise<{ user: FirebaseUser; credential: UserCredential }> => {
  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    return { user: credential.user, credential };
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign out current user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error('Failed to sign out');
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

/**
 * Convert Firebase User to App User
 */
export const convertFirebaseUserToUser = (firebaseUser: FirebaseUser): User => {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || '',
    phone: firebaseUser.phoneNumber || undefined,
    avatar: firebaseUser.photoURL || undefined,
    role: 'customer' as any,
    isActive: true,
    isEmailVerified: firebaseUser.emailVerified,
    isPhoneVerified: !!firebaseUser.phoneNumber,
    createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Get user-friendly error messages
 */
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    default:
      return 'Authentication failed. Please try again';
  }
};

/**
 * Auth state observer
 * Call this to listen for auth state changes
 */
export const onAuthStateChanged = (
  callback: (user: FirebaseUser | null) => void
) => {
  return auth.onAuthStateChanged(callback);
};