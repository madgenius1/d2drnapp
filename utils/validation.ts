/**
 * Validation Utilities
 * Form validation helpers for user input
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || !email.trim()) {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }

  return { isValid: true };
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required',
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters',
    };
  }

  return { isValid: true };
};

/**
 * Validate Kenyan phone number
 * Accepts formats: 0712345678, +254712345678, 254712345678
 */
export const validateKenyanPhone = (phone: string): ValidationResult => {
  if (!phone || !phone.trim()) {
    return {
      isValid: false,
      error: 'Phone number is required',
    };
  }

  // Remove spaces and special characters
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Check if valid Kenyan number
  const phoneRegex = /^(?:\+?254|0)?([71]\d{8})$/;
  if (!phoneRegex.test(cleaned)) {
    return {
      isValid: false,
      error: 'Please enter a valid Kenyan phone number',
    };
  }

  return { isValid: true };
};

/**
 * Validate name (at least 2 characters, letters and spaces only)
 */
export const validateName = (name: string): ValidationResult => {
  if (!name || !name.trim()) {
    return {
      isValid: false,
      error: 'Name is required',
    };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: 'Name must be at least 2 characters',
    };
  }

  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) {
    return {
      isValid: false,
      error: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    };
  }

  return { isValid: true };
};

/**
 * Validate required field
 */
export const validateRequired = (
  value: string | null | undefined,
  fieldName: string = 'This field'
): ValidationResult => {
  if (!value || !value.toString().trim()) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  return { isValid: true };
};

/**
 * Validate minimum length
 */
export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string = 'This field'
): ValidationResult => {
  if (!value || value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }

  return { isValid: true };
};

/**
 * Validate maximum length
 */
export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string = 'This field'
): ValidationResult => {
  if (value && value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must not exceed ${maxLength} characters`,
    };
  }

  return { isValid: true };
};

/**
 * Validate numeric value
 */
export const validateNumeric = (
  value: string,
  fieldName: string = 'This field'
): ValidationResult => {
  if (!value) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  if (isNaN(Number(value))) {
    return {
      isValid: false,
      error: `${fieldName} must be a number`,
    };
  }

  return { isValid: true };
};

/**
 * Validate price (positive number with up to 2 decimal places)
 */
export const validatePrice = (
  value: string | number,
  fieldName: string = 'Price'
): ValidationResult => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return {
      isValid: false,
      error: `${fieldName} must be a valid number`,
    };
  }

  if (numValue < 0) {
    return {
      isValid: false,
      error: `${fieldName} must be positive`,
    };
  }

  // Check for max 2 decimal places
  if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
    return {
      isValid: false,
      error: `${fieldName} can have at most 2 decimal places`,
    };
  }

  return { isValid: true };
};

/**
 * Validate date (not in the past)
 */
export const validateFutureDate = (
  dateString: string,
  fieldName: string = 'Date'
): ValidationResult => {
  if (!dateString) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return {
      isValid: false,
      error: `${fieldName} cannot be in the past`,
    };
  }

  return { isValid: true };
};

/**
 * Validate order ID format
 */
export const validateOrderId = (orderId: string): ValidationResult => {
  if (!orderId || !orderId.trim()) {
    return {
      isValid: false,
      error: 'Order ID is required',
    };
  }

  // D2D order ID format: D2D-TIMESTAMP-RANDOM
  const orderIdRegex = /^D2D-[A-Z0-9]+-[A-Z0-9]+$/i;
  if (!orderIdRegex.test(orderId)) {
    return {
      isValid: false,
      error: 'Invalid order ID format',
    };
  }

  return { isValid: true };
};

/**
 * Batch validate multiple fields
 */
export const validateFields = (
  fields: Array<{ value: any; validator: (value: any) => ValidationResult }>
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  for (const field of fields) {
    const result = field.validator(field.value);
    if (!result.isValid && result.error) {
      errors.push(result.error);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  validateEmail,
  validatePassword,
  validateKenyanPhone,
  validateName,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumeric,
  validatePrice,
  validateFutureDate,
  validateOrderId,
  validateFields,
};