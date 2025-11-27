/**
 * Theme Store (Zustand) - Optional Advanced Theme Management
 * Allows manual theme override beyond system settings
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  // State
  mode: ThemeMode;
  
  // Actions
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  resetToSystem: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial state
      mode: 'system',

      // Set theme mode
      setMode: (mode) => {
        set({ mode });
      },

      // Toggle between light and dark
      toggleTheme: () => {
        const currentMode = get().mode;
        if (currentMode === 'system') {
          // If system, switch to opposite of current system theme
          const systemScheme = useColorScheme();
          set({ mode: systemScheme === 'dark' ? 'light' : 'dark' });
        } else {
          // Toggle between light and dark
          set({ mode: currentMode === 'light' ? 'dark' : 'light' });
        }
      },

      // Reset to system default
      resetToSystem: () => {
        set({ mode: 'system' });
      },
    }),
    {
      name: 'd2d-theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

/**
 * Hook to get effective theme (resolves 'system' to actual light/dark)
 */
export const useEffectiveTheme = (): 'light' | 'dark' => {
  const { mode } = useThemeStore();
  const systemScheme = useColorScheme();

  if (mode === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }

  return mode;
};

export default useThemeStore;