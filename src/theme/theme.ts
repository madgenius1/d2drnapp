/**
 * React Native Paper theme configuration
 */

import type { MD3Theme } from 'react-native-paper';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { colors } from './colors';

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.light.primary,
    background: colors.light.background,
    surface: colors.light.surface,
    error: colors.light.error,
    onPrimary: '#ffffff',
    onBackground: colors.light.text,
    onSurface: colors.light.text,
  },
  roundness: 16,
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.dark.primary,
    background: colors.dark.background,
    surface: colors.dark.surface,
    error: colors.dark.error,
    onPrimary: '#ffffff',
    onBackground: colors.dark.text,
    onSurface: colors.dark.text,
  },
  roundness: 16,
};