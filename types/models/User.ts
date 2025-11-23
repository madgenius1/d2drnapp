/**
 * User Type Definitions
 * Defines all types for users and authentication
 */

/**
 * User role enum
 */
export enum UserRole {
  CUSTOMER = 'customer',
  DRIVER = 'driver',
  ADMIN = 'admin',
}

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  
  // Preferences
  preferences?: UserPreferences;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  
  // Status
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

/**
 * User preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationPreferences;
  language: string; // 'en', 'sw'
  defaultPaymentMethod?: string;
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  push: boolean;
  email: boolean;
  sms: boolean;
  orderUpdates: boolean;
  promotions: boolean;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Register data
 */
export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

/**
 * Auth response
 */
export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

/**
 * Auth state
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Profile update data
 */
export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}