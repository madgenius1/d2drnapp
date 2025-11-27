/**
 * Advanced Theme Hook (Optional)
 * Allows manual theme override with persistence
 * Use this instead of basic useTheme if you want theme toggle in settings
 */

import { useColorScheme } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { lightColors, darkColors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import type { Theme } from './index';

/**
 * Advanced useTheme with manual override support
 */
export const useThemeAdvanced = (): Theme & {
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  themeMode: 'light' | 'dark' | 'system';
} => {
  const systemScheme = useColorScheme();
  const { mode, setMode, toggleTheme } = useThemeStore();

  // Determine effective theme
  const effectiveTheme = mode === 'system' 
    ? (systemScheme === 'dark' ? 'dark' : 'light')
    : mode;

  const isDark = effectiveTheme === 'dark';

  return {
    isDark,
    colors: isDark ? darkColors : lightColors,
    typography,
    spacing,
    toggleTheme,
    setThemeMode: setMode,
    themeMode: mode,
  };
};

export default useThemeAdvanced;