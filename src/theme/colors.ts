/**
 * Color definitions for light and dark themes
 */

export const colors = {
  light: {
    background: '#ffffff',
    primary: '#099d15',
    text: '#121212',
    card: '#ffffff',
    border: '#e0e0e0',
    placeholder: '#9e9e9e',
    error: '#f44336',
    success: '#4caf50',
    warning: '#ff9800',
    info: '#2196f3',
    surface: '#f5f5f5',
    disabled: '#bdbdbd',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    background: '#121212',
    primary: '#099d15',
    text: '#ffffff',
    card: '#1e1e1e',
    border: '#2c2c2c',
    placeholder: '#757575',
    error: '#ef5350',
    success: '#66bb6a',
    warning: '#ffa726',
    info: '#42a5f5',
    surface: '#1e1e1e',
    disabled: '#616161',
    backdrop: 'rgba(0, 0, 0, 0.7)',
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type ThemeColors = typeof colors.light;