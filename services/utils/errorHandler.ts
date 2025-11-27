/**
 * Centralized error handling utilities
 * Provides consistent error messages and logging
 */

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

/**
 * Error codes
 */
export const ERROR_CODES = {
  // Auth errors
  AUTH_INVALID_CREDENTIALS: 'auth/invalid-credentials',
  AUTH_USER_NOT_FOUND: 'auth/user-not-found',
  AUTH_EMAIL_EXISTS: 'auth/email-already-in-use',
  AUTH_WEAK_PASSWORD: 'auth/weak-password',
  AUTH_NETWORK_ERROR: 'auth/network-request-failed',
  
  // Order errors
  ORDER_NOT_FOUND: 'order/not-found',
  ORDER_CREATION_FAILED: 'order/creation-failed',
  ORDER_UPDATE_FAILED: 'order/update-failed',
  ORDER_INVALID_STATUS: 'order/invalid-status',
  
  // Network errors
  NETWORK_ERROR: 'network/error',
  NETWORK_TIMEOUT: 'network/timeout',
  
  // Validation errors
  VALIDATION_REQUIRED_FIELD: 'validation/required-field',
  VALIDATION_INVALID_FORMAT: 'validation/invalid-format',
  
  // Generic errors
  UNKNOWN_ERROR: 'unknown/error',
} as const;

/**
 * User-friendly error messages
 */
const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',
  [ERROR_CODES.AUTH_USER_NOT_FOUND]: 'No account found with this email',
  [ERROR_CODES.AUTH_EMAIL_EXISTS]: 'This email is already registered',
  [ERROR_CODES.AUTH_WEAK_PASSWORD]: 'Password is too weak. Use at least 6 characters',
  [ERROR_CODES.AUTH_NETWORK_ERROR]: 'Network error. Please check your connection',
  
  [ERROR_CODES.ORDER_NOT_FOUND]: 'Order not found',
  [ERROR_CODES.ORDER_CREATION_FAILED]: 'Failed to create order',
  [ERROR_CODES.ORDER_UPDATE_FAILED]: 'Failed to update order',
  [ERROR_CODES.ORDER_INVALID_STATUS]: 'Invalid order status',
  
  [ERROR_CODES.NETWORK_ERROR]: 'Network error. Please try again',
  [ERROR_CODES.NETWORK_TIMEOUT]: 'Request timed out. Please try again',
  
  [ERROR_CODES.VALIDATION_REQUIRED_FIELD]: 'This field is required',
  [ERROR_CODES.VALIDATION_INVALID_FORMAT]: 'Invalid format',
  
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred',
};

/**
 * Create app error object
 */
export const createError = (
  code: string,
  details?: any
): AppError => {
  return {
    code,
    message: ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
    details,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Handle Firebase error
 */
export const handleFirebaseError = (error: any): AppError => {
  const code = error.code || ERROR_CODES.UNKNOWN_ERROR;
  const message = ERROR_MESSAGES[code] || error.message || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
  
  console.error('[Error Handler] Firebase error:', {
    code,
    message: error.message,
    details: error,
  });
  
  return {
    code,
    message,
    details: __DEV__ ? error : undefined,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Handle network error
 */
export const handleNetworkError = (error: any): AppError => {
  console.error('[Error Handler] Network error:', error);
  
  if (error.message?.includes('timeout')) {
    return createError(ERROR_CODES.NETWORK_TIMEOUT);
  }
  
  return createError(ERROR_CODES.NETWORK_ERROR, error);
};

/**
 * Handle API error
 */
export const handleApiError = (error: any, context?: string): AppError => {
  console.error(`[Error Handler] API error${context ? ` (${context})` : ''}:`, error);
  
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;
    
    return {
      code: data?.code || `api/error-${status}`,
      message: data?.message || `Server error (${status})`,
      details: __DEV__ ? error : undefined,
      timestamp: new Date().toISOString(),
    };
  } else if (error.request) {
    // Request made but no response
    return handleNetworkError(error);
  } else {
    // Something else went wrong
    return createError(ERROR_CODES.UNKNOWN_ERROR, error);
  }
};

/**
 * Log error (can be extended to send to analytics/crash reporting)
 */
export const logError = (error: AppError, context?: string): void => {
  const logMessage = `[ERROR${context ? ` - ${context}` : ''}] ${error.code}: ${error.message}`;
  
  if (__DEV__) {
    console.error(logMessage, error.details);
  } else {
    console.error(logMessage);
    // TODO: Send to crash reporting service (e.g., Sentry, Firebase Crashlytics)
  }
};

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code];
  }
  
  return ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
};

export default {
  ERROR_CODES,
  createError,
  handleFirebaseError,
  handleNetworkError,
  handleApiError,
  logError,
  getErrorMessage,
};