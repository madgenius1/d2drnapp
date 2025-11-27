/**
 * Card Component (TypeScript)
 * Container card with optional press action
 */

import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
  borderRadius?: number;
  shadow?: boolean;
}

export default function Card({
  children,
  onPress,
  style = {},
  padding = 16,
  borderRadius = 12,
  shadow = true,
}: CardProps) {
  const theme = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.card.background,
    borderRadius,
    padding,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...style,
  };

  if (shadow) {
    Object.assign(cardStyle, {
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    });
  }

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}