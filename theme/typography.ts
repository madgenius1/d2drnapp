/**
 * Theme Typography System
 * Font family, sizes, weights, and line heights
 */

export const typography = {
  // Font families
  fonts: {
    light: 'Quicksand-Light',
    regular: 'Quicksand-Regular',
    medium: 'Quicksand-Medium',
    semiBold: 'Quicksand-SemiBold',
    bold: 'Quicksand-Bold',
  },

  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
  },

  // Font weights (mapped to font families)
  weights: {
    '300': 'Quicksand-Light',
    '400': 'Quicksand-Regular',
    '500': 'Quicksand-Medium',
    '600': 'Quicksand-SemiBold',
    '700': 'Quicksand-Bold',
  },

  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Text styles (presets)
  styles: {
    // Headers
    h1: {
      fontSize: 32,
      fontFamily: 'Quicksand-Bold',
      fontWeight: '700' as const,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 28,
      fontFamily: 'Quicksand-Bold',
      fontWeight: '700' as const,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: 24,
      fontFamily: 'Quicksand-SemiBold',
      fontWeight: '600' as const,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: 20,
      fontFamily: 'Quicksand-SemiBold',
      fontWeight: '600' as const,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: 18,
      fontFamily: 'Quicksand-SemiBold',
      fontWeight: '600' as const,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: 16,
      fontFamily: 'Quicksand-Medium',
      fontWeight: '500' as const,
      lineHeight: 1.5,
    },

    // Body text
    body: {
      fontSize: 16,
      fontFamily: 'Quicksand-Regular',
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    bodySmall: {
      fontSize: 14,
      fontFamily: 'Quicksand-Regular',
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    bodyLarge: {
      fontSize: 18,
      fontFamily: 'Quicksand-Regular',
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },

    // Special text
    caption: {
      fontSize: 12,
      fontFamily: 'Quicksand-Regular',
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    button: {
      fontSize: 16,
      fontFamily: 'Quicksand-SemiBold',
      fontWeight: '600' as const,
      lineHeight: 1.2,
    },
    label: {
      fontSize: 14,
      fontFamily: 'Quicksand-Medium',
      fontWeight: '500' as const,
      lineHeight: 1.4,
    },
  },
} as const;

export type Typography = typeof typography;

export default typography;