/**
 * Hook for accessing theme context
 */

import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Access theme context (colors, isDark, toggleTheme)
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};