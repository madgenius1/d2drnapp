/**
 * Date Formatting Utilities
 * Consistent date formatting throughout the app
 */

import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import { DATE_FORMATS } from '../../data/constants/appConstants';

/**
 * Format date for display (e.g., "Dec 23, 2024")
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, DATE_FORMATS.DISPLAY);
};

/**
 * Format date with time (e.g., "Dec 23, 2024 • 3:30 PM")
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, DATE_FORMATS.DISPLAY_TIME);
};

/**
 * Format full date (e.g., "Monday, December 23, 2024")
 */
export const formatFullDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, DATE_FORMATS.FULL);
};

/**
 * Format time only (e.g., "3:30 PM")
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, DATE_FORMATS.TIME_ONLY);
};

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

/**
 * Format smart date (Today, Yesterday, or date)
 */
export const formatSmartDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return 'Today';
  }
  
  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }
  
  return formatDate(dateObj);
};

/**
 * Get greeting based on time of day
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};