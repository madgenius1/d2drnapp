/**
 * useAuth Hook
 * Provides authentication state and methods
 */

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    login,
    register,
    logout,
    initializeAuth,
  } = useAuthStore();

  // Initialize auth listener on mount
  useEffect(() => {
    console.log('[useAuth] Initializing auth listener...');
    const unsubscribe = initializeAuth();

    return () => {
      console.log('[useAuth] Cleaning up auth listener...');
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || !isInitialized, // Consider not initialized as loading
    isInitialized,
    login,
    register,
    logout,
  };
}