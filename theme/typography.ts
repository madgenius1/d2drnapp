/**
 * Typography System
 * Quicksand font definitions and text styles
 */

/**
 * Font weights
 */
export const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

/**
 * Font families (Quicksand)
 */
export const fontFamilies = {
  light: 'Quicksand-Light',
  regular: 'Quicksand-Regular',
  medium: 'Quicksand-Medium',
  semibold: 'Quicksand-SemiBold',
  bold: 'Quicksand-Bold',
} as const;

/**
 * Font sizes
 */
export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
} as const;

/**
 * Line heights
 */
export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

/**
 * Text style interface
 */
export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight?: string;
  lineHeight?: number;
}

/**
 * Predefined text styles
 */
export const textStyles = {
  // Headings
  h1: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes['4xl'] * lineHeights.tight,
  },
  h2: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes['3xl'] * lineHeights.tight,
  },
  h3: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes['2xl'] * lineHeights.tight,
  },
  h4: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.xl * lineHeights.normal,
  },

  // Body
  bodyLarge: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.normal,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
  },
  bodySmall: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },

  // Labels
  label: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
  },
  labelSmall: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
  },

  // Buttons
  button: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },
  buttonLarge: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
  },

  // Caption
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.normal,
  },
} as const;