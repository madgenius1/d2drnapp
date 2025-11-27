/**
 * Theme System - Central Export
 * Provides useTheme hook and theme utilities
 */

import { useColorScheme } from 'react-native';
import { darkColors, lightColors, ThemeColors } from './colors';
import { spacing, Spacing } from './spacing';
import { typography, Typography } from './typography';

export interface Theme {
  isDark: boolean;
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
}

/**
 * useTheme Hook
 * Provides current theme based on system color scheme
 */
export const useTheme = (): Theme => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    isDark,
    colors: isDark ? darkColors : lightColors,
    typography,
    spacing,
  };
};

/**
 * Get theme colors for a specific mode
 */
export const getThemeColors = (isDark: boolean): ThemeColors => {
  return isDark ? darkColors : lightColors;
};

/**
 * Export theme components
 */
export { darkColors, lightColors } from './colors';
export type { ThemeColors } from './colors';

export { typography } from './typography';
export type { Typography } from './typography';

export { spacing } from './spacing';
export type { Spacing } from './spacing';

export default {
  useTheme,
  getThemeColors,
  lightColors,
  darkColors,
  typography,
  spacing,
};