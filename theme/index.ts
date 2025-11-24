/**
 * Theme System
 * Central theme exports and useTheme hook
 */

import { useColorScheme } from 'react-native';
import { ColorPalette, lightColors, darkColors } from './colors';
import { fontFamilies, fontSizes, textStyles } from './typography';
import { spacing, borderRadius } from './spacing';
import { shadows } from './shadows';

/**
 * Theme interface
 */
export interface Theme {
  isDark: boolean;
  colors: ColorPalette;
  fonts: typeof fontFamilies;
  fontSizes: typeof fontSizes;
  textStyles: typeof textStyles;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
}

/**
 * Get theme based on color scheme
 */
export const getTheme = (isDark: boolean): Theme => ({
  isDark,
  colors: isDark ? darkColors : lightColors,
  fonts: fontFamilies,
  fontSizes,
  textStyles,
  spacing,
  borderRadius,
  shadows,
});

/**
 * useTheme hook - Returns current theme
 */
export const useTheme = (): Theme => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return getTheme(isDark);
};

// Export all theme utilities
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';