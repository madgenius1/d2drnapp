/**
 * Theme context provider
 */

import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import type { ColorScheme, ThemeColors } from '../theme/colors';
import { colors } from '../theme/colors';
import { darkTheme, lightTheme } from '../theme/theme';

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  colorScheme: ColorScheme;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    systemColorScheme === 'dark' ? 'dark' : 'light'
  );

  useEffect(() => {
    // Update theme when system color scheme changes
    if (systemColorScheme) {
      setColorScheme(systemColorScheme as ColorScheme);
    }
  }, [systemColorScheme]);

  const isDark = colorScheme === 'dark';
  const currentColors = colors[colorScheme];
  const paperTheme = isDark ? darkTheme : lightTheme;

  const toggleTheme = (): void => {
    setColorScheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const value: ThemeContextType = {
    isDark,
    colors: currentColors,
    toggleTheme,
    colorScheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};