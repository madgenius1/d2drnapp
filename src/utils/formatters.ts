/**
 * Formatting utility functions
 */

import { format, parseISO } from 'date-fns';

/**
 * Format a number as Kenyan Shillings
 */
export const formatCurrency = (amount: number): string => {
  return `KES ${amount.toFixed(2)}`;
};

/**
 * Format a date string (YYYY-MM-DD) to a readable format
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
};

/**
 * Format a time string (HH:MM) to 12-hour format
 */
export const formatTime = (timeString: string): string => {
  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch {
    return timeString;
  }
};

/**
 * Format a timestamp to a readable date and time
 */
export const formatTimestamp = (timestamp: number): string => {
  try {
    const date = new Date(timestamp);
    return format(date, 'MMM dd, yyyy hh:mm a');
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format a phone number (Kenya format)
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it starts with 254 (Kenya country code)
  if (cleaned.startsWith('254')) {
    return `+${cleaned}`;
  }
  
  // Check if it starts with 0 (local format)
  if (cleaned.startsWith('0')) {
    return `+254${cleaned.substring(1)}`;
  }
  
  // Otherwise, assume it needs +254 prefix
  return `+254${cleaned}`;
};

/**
 * Truncate text to a specified length
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};