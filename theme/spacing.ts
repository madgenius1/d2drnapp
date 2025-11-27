/**
 * Theme Spacing System
 * Consistent spacing values for layouts
 */

export const spacing = {
  // Base spacing unit (4px)
  base: 4,

  // Common spacing values
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,

  // Screen padding
  screenHorizontal: 20,
  screenVertical: 20,

  // Card spacing
  cardPadding: 16,
  cardMargin: 12,
  cardRadius: 12,

  // Input spacing
  inputPadding: 16,
  inputMarginBottom: 16,

  // Button spacing
  buttonPaddingVertical: 16,
  buttonPaddingHorizontal: 20,
  buttonRadius: 12,

  // Icon sizes
  iconXs: 16,
  iconSm: 20,
  iconMd: 24,
  iconLg: 32,
  iconXl: 40,

  // Section spacing
  sectionMarginBottom: 24,
  sectionHeaderMarginBottom: 16,

  // List item spacing
  listItemPaddingVertical: 16,
  listItemPaddingHorizontal: 20,

  // Gap between elements
  gapXs: 4,
  gapSm: 8,
  gapMd: 12,
  gapLg: 16,
  gapXl: 20,
} as const;

export type Spacing = typeof spacing;

export default spacing;