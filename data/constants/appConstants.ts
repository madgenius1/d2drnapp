/**
 * App-wide Constants
 * Global constants used throughout the app
 */

/**
 * App metadata
 */
export const APP_NAME = 'D2D';
export const APP_TAGLINE = 'Pick. Drop. Done.';
export const APP_DESCRIPTION = 'Your reliable delivery partner';

/**
 * Brand colors
 */
export const BRAND_COLORS = {
  PRIMARY: '#099d15',
  WHITE: '#ffffff',
  DARK: '#121212',
} as const;

/**
 * Currency
 */
export const CURRENCY = 'KES';
export const CURRENCY_SYMBOL = 'KES';

/**
 * Phone number formats
 */
export const PHONE_FORMATS = {
  KENYA_LOCAL: /^07[0-9]{8}$/,
  KENYA_INTL_PLUS: /^\+2547[0-9]{8}$/,
  KENYA_INTL: /^2547[0-9]{8}$/,
} as const;

/**
 * Validation rules
 */
export const VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_PASSWORD_LENGTH: 6,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_NOTES_LENGTH: 0,
  MAX_NOTES_LENGTH: 300,
} as const;

/**
 * Pricing constants
 */
export const PRICING = {
  SAME_ROUTE_DIVISOR: 1.8,
  DIFFERENT_ROUTE_DIVISOR: 2,
  FIXED_FEE: 50,
} as const;

/**
 * Date formats
 */
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_TIME: 'MMM dd, yyyy • h:mm a',
  FULL: 'EEEE, MMMM dd, yyyy',
  TIME_ONLY: 'h:mm a',
} as const;

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@d2d/auth_token',
  USER_DATA: '@d2d/user_data',
  THEME: '@d2d/theme',
  ONBOARDING_COMPLETE: '@d2d/onboarding_complete',
  RECENT_ROUTES: '@d2d/recent_routes',
} as const;

/**
 * API endpoints (placeholders)
 */
export const API_ENDPOINTS = {
  ORDERS: '/api/orders',
  ERRANDS: '/api/errands',
  USERS: '/api/users',
  ROUTES: '/api/routes',
  PAYMENT: '/api/payment',
} as const;

/**
 * Google Sheets logging
 */
export const GOOGLE_SHEETS = {
  SCRIPT_URL: process.env.EXPO_PUBLIC_GOOGLE_SCRIPT_URL || '',
  ENABLED: process.env.EXPO_PUBLIC_GOOGLE_SHEETS_ENABLED === 'true',
} as const;

/**
 * Feature flags
 */
export const FEATURES = {
  ENABLE_PAYMENT: false, // M-Pesa integration
  ENABLE_REAL_TIME_TRACKING: false,
  ENABLE_PUSH_NOTIFICATIONS: false,
  ENABLE_QR_SCANNING: false,
  ENABLE_ANALYTICS: false,
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'Requested resource not found.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  ORDER_CREATED: 'Order created successfully!',
  ORDER_UPDATED: 'Order updated successfully!',
  ORDER_CANCELLED: 'Order cancelled successfully.',
  ERRAND_CREATED: 'Errand submitted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
} as const;