/**
 * Spacing Scale
 * Consistent spacing values throughout the app
 */

/**
 * Spacing values (8px base unit)
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

/**
 * Border radius values
 */
export const borderRadius = {
  sm: 8,
  md: 10,
  base: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

/**
 * Screen padding (safe area aware)
 */
export const screenPadding = {
  horizontal: spacing.lg,
  vertical: spacing.lg,
} as const;