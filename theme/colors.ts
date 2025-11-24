/**
 * Theme Colors
 * Color palette for light and dark modes
 */

/**
 * Color palette interface
 */
export interface ColorPalette {
  // Brand
  primary: string;
  secondary: string;

  // Backgrounds
  background: string;
  surface: string;
  elevated: string;
  overlay: string;

  // Card
  card: {
    background: string;
    border: string;
  };

  // Text
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
  };

  // Input
  input: {
    background: string;
    border: string;
    placeholder: string;
  };

  // Status
  success: string;
  error: string;
  warning: string;
  info: string;
  pending: string;

  // Tab Bar
  tabBar: {
    background: string;
    border: string;
    active: string;
    inactive: string;
  };

  // Border & Divider
  border: string;
  divider: string;

  // Shadow
  shadow: string;
}

/**
 * Light mode colors
 */
export const lightColors: ColorPalette = {
  // Brand
  primary: '#099d15',
  secondary: '#1485FF',

  // Backgrounds
  background: '#ffffff',
  surface: '#f8f9fa',
  elevated: '#ffffff',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Card
  card: {
    background: '#ffffff',
    border: '#e5e7eb',
  },

  // Text
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    disabled: '#d1d5db',
  },

  // Input
  input: {
    background: '#f9fafb',
    border: '#e5e7eb',
    placeholder: '#9ca3af',
  },

  // Status
  success: '#22C75A',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#1485FF',
  pending: '#F59E0B',

  // Tab Bar
  tabBar: {
    background: '#ffffff',
    border: '#e5e7eb',
    active: '#099d15',
    inactive: '#9ca3af',
  },

  // Border & Divider
  border: '#e5e7eb',
  divider: '#f3f4f6',

  // Shadow
  shadow: '#000000',
};

/**
 * Dark mode colors
 */
export const darkColors: ColorPalette = {
  // Brand
  primary: '#099d15',
  secondary: '#1485FF',

  // Backgrounds
  background: '#121212',
  surface: '#1e1e1e',
  elevated: '#2a2a2a',
  overlay: 'rgba(0, 0, 0, 0.7)',

  // Card
  card: {
    background: '#1e1e1e',
    border: '#2a2a2a',
  },

  // Text
  text: {
    primary: '#f9fafb',
    secondary: '#d1d5db',
    tertiary: '#9ca3af',
    disabled: '#6b7280',
  },

  // Input
  input: {
    background: '#1e1e1e',
    border: '#2a2a2a',
    placeholder: '#6b7280',
  },

  // Status
  success: '#22C75A',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#1485FF',
  pending: '#F59E0B',

  // Tab Bar
  tabBar: {
    background: '#1e1e1e',
    border: '#2a2a2a',
    active: '#099d15',
    inactive: '#6b7280',
  },

  // Border & Divider
  border: '#2a2a2a',
  divider: '#1e1e1e',

  // Shadow
  shadow: '#000000',
};