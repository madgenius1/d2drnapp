/**
 * Theme Color Palette
 * Centralized color definitions for light and dark themes
 */

export const lightColors = {
  // Primary
  primary: '#099d15',
  primaryLight: '#0acc1b',
  primaryDark: '#076e0f',

  // Background
  background: '#ffffff',
  surface: '#ffffff',
  elevated: '#f8f9fa',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Card
  card: {
    background: '#ffffff',
    border: '#e5e7eb',
  },

  // Input
  input: {
    background: '#f8f9fa',
    border: '#e5e7eb',
    placeholder: '#9ca3af',
  },

  // Text
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
  },

  // Border
  border: '#e5e7eb',
  divider: '#f3f4f6',

  // Status colors
  success: '#22C75A',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#1485FF',
  pending: '#F59E0B',

  // Tab bar
  tabBar: {
    background: '#ffffff',
    border: '#e5e7eb',
    active: '#099d15',
    inactive: '#9ca3af',
  },

  // Shadow
  shadow: '#000000',
};

export const darkColors = {
  // Primary
  primary: '#0acc1b',
  primaryLight: '#1de52d',
  primaryDark: '#099d15',

  // Background
  background: '#121212',
  surface: '#1e1e1e',
  elevated: '#2a2a2a',
  overlay: 'rgba(0, 0, 0, 0.7)',

  // Card
  card: {
    background: '#1e1e1e',
    border: '#2a2a2a',
  },

  // Input
  input: {
    background: '#2a2a2a',
    border: '#3a3a3a',
    placeholder: '#6b7280',
  },

  // Text
  text: {
    primary: '#f9fafb',
    secondary: '#d1d5db',
    tertiary: '#9ca3af',
    inverse: '#1f2937',
  },

  // Border
  border: '#2a2a2a',
  divider: '#1e1e1e',

  // Status colors
  success: '#22C75A',
  error: '#F87171',
  warning: '#FBBF24',
  info: '#60A5FA',
  pending: '#FBBF24',

  // Tab bar
  tabBar: {
    background: '#1e1e1e',
    border: '#2a2a2a',
    active: '#0acc1b',
    inactive: '#6b7280',
  },

  // Shadow
  shadow: '#000000',
};

export type ThemeColors = typeof lightColors;

export default {
  light: lightColors,
  dark: darkColors,
};