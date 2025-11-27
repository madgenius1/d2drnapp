/**
 * useAuth Hook
 * Provides authentication state and operations
 * Integrates Firebase Auth with Zustand store
 */

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import authService from '../services/firebase/auth.service';
import type {
  AuthCredentials,
  RegisterData,
  UpdateProfileData,
  AuthResult,
} from '../types';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setLoading,
    setError,
    clearError,
    logout: clearAuth,
  } = useAuthStore();

  /**
   * Subscribe to Firebase Auth state changes
   */
  useEffect(() => {
    setLoading(true);

    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Login with email and password
   */
  const login = async (credentials: AuthCredentials): Promise<AuthResult> => {
    try {
      setLoading(true);
      clearError();

      const result = await authService.signInWithEmail(credentials);

      if (result.success && result.user) {
        setUser(result.user);
      } else {
        setError(result.error || 'Login failed');
      }

      setLoading(false);
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Register new user
   */
  const register = async (data: RegisterData): Promise<AuthResult> => {
    try {
      setLoading(true);
      clearError();

      const result = await authService.signUpWithEmail(data);

      if (result.success && result.user) {
        setUser(result.user);
      } else {
        setError(result.error || 'Registration failed');
      }

      setLoading(false);
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Logout current user
   */
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await authService.signOut();
      clearAuth();
      setLoading(false);
    } catch (error: any) {
      console.error('[useAuth] Logout error:', error);
      setLoading(false);
      throw error;
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (
    data: UpdateProfileData
  ): Promise<AuthResult> => {
    try {
      if (!user) {
        return {
          success: false,
          error: 'No user logged in',
        };
      }

      setLoading(true);
      clearError();

      const result = await authService.updateProfile(user.id, data);

      if (result.success && result.user) {
        setUser(result.user);
      } else {
        setError(result.error || 'Update failed');
      }

      setLoading(false);
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Send password reset email
   */
  const resetPassword = async (email: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      clearError();

      const result = await authService.resetPassword(email);

      if (!result.success) {
        setError(result.error || 'Password reset failed');
      }

      setLoading(false);
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Refresh user data from Firestore
   */
  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error('[useAuth] Refresh user error:', error);
    }
  };

  /**
   * Get Firebase ID token for API calls
   */
  const getToken = async (): Promise<string | null> => {
    try {
      return await authService.getIdToken();
    } catch (error) {
      console.error('[useAuth] Get token error:', error);
      return null;
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    refreshUser,
    getToken,
    clearError,
  };
};

export default useAuth;