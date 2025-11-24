/**
 * Auth Slice - Zustand
 * Authentication state management
 */

import { StateCreator } from 'zustand';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../../types/models/User';

export interface AuthSlice {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearError: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  // Initial state
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Login action
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Replace with actual Firebase auth
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful login
      const mockUser: User = {
        id: 'user_1',
        email: credentials.email,
        name: 'John Doe',
        phone: '0712345678',
        role: 'customer' as any,
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = 'mock_token_12345';

      set({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return {
        success: true,
        user: mockUser,
        token: mockToken,
      };
    } catch (error: any) {
      set({
        error: error.message || 'Login failed',
        isLoading: false,
      });

      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  },

  // Register action
  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Replace with actual Firebase auth
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful registration
      const mockUser: User = {
        id: 'user_' + Date.now(),
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: 'customer' as any,
        isActive: true,
        isEmailVerified: false,
        isPhoneVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = 'mock_token_' + Date.now();

      set({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return {
        success: true,
        user: mockUser,
        token: mockToken,
      };
    } catch (error: any) {
      set({
        error: error.message || 'Registration failed',
        isLoading: false,
      });

      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  },

  // Logout action
  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  // Set user
  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: user !== null,
    });
  },

  // Set token
  setToken: (token: string | null) => {
    set({ token });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
});