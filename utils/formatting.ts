/**
 * Formatting Utilities
 * Date, currency, phone number formatting helpers
 */

import { format, formatDistance, isToday, isYesterday } from 'date-fns';

/**
 * Format currency (Kenyan Shillings)
 */
export const formatCurrency = (amount: number): string => {
  return `KES ${amount.toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format phone number (Kenyan format)
 * Converts to: +254 712 345 678
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Convert to international format
  let formatted = cleaned;
  if (cleaned.startsWith('0')) {
    formatted = '254' + cleaned.substring(1);
  } else if (!cleaned.startsWith('254')) {
    formatted = '254' + cleaned;
  }

  // Add spacing: +254 712 345 678
  if (formatted.length === 12) {
    return `+${formatted.substring(0, 3)} ${formatted.substring(3, 6)} ${formatted.substring(6, 9)} ${formatted.substring(9)}`;
  }

  return phone; // Return original if format doesn't match
};

/**
 * Format date (e.g., "Jan 15, 2024")
 */
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch (error) {
    return dateString;
  }
};

/**
 * Format date and time (e.g., "Jan 15, 2024 • 2:30 PM")
 */
export const formatDateTime = (dateString: string): string => {
  try {
    return format(new Date(dateString), "MMM dd, yyyy • h:mm a");
  } catch (error) {
    return dateString;
  }
};

/**
 * Format time only (e.g., "2:30 PM")
 */
export const formatTime = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'h:mm a');
  } catch (error) {
    return dateString;
  }
};

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();

    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    }

    if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    }

    return formatDistance(date, now, { addSuffix: true });
  } catch (error) {
    return dateString;
  }
};

/**
 * Format day of week (e.g., "Monday, January 15")
 */
export const formatDayOfWeek = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'EEEE, MMMM dd');
  } catch (error) {
    return dateString;
  }
};

/**
 * Format full date (e.g., "Monday, January 15, 2024")
 */
export const formatFullDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'EEEE, MMMM dd, yyyy');
  } catch (error) {
    return dateString;
  }
};

/**
 * Format order ID (shorten for display)
 * D2D-123ABC456-XYZ789 → D2D-...XYZ789
 */
export const formatOrderId = (orderId: string, maxLength: number = 15): string => {
  if (orderId.length <= maxLength) {
    return orderId;
  }

  const start = orderId.substring(0, 7); // "D2D-123"
  const end = orderId.substring(orderId.length - 6); // Last 6 chars

  return `${start}...${end}`;
};

/**
 * Format text to title case
 */
export const toTitleCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Format file size (bytes to human readable)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format duration (seconds to human readable)
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

/**
 * Format distance (meters to human readable)
 */
// export const formatDistance = (meters: number): string => {
//   if (meters < 1000) {
//     return `${Math.round(meters)}m`;
//   }

//   return `${(meters / 1000).toFixed(1)}km`;
// };

/**
 * Parse ISO date string to Date object safely
 */
export const parseDate = (dateString: string): Date | null => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    return null;
  }
};

export default {
  formatCurrency,
  formatPhoneNumber,
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatDayOfWeek,
  formatFullDate,
  formatOrderId,
  toTitleCase,
  truncateText,
  formatFileSize,
  formatDuration,
  formatDistance,
  parseDate,
};