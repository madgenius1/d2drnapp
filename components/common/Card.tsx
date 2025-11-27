import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useTheme } from "../theme/index";

export default function Card({
  children,
  onPress,
  style = {},
  padding = 16,
  borderRadius = 12,
  shadow = true,
  ...props
}) {
  const theme = useTheme();

  const cardStyle = {
    backgroundColor: theme.colors.card.background,
    borderRadius,
    padding,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...style,
  };

  if (shadow) {
    cardStyle.shadowColor = theme.colors.shadow;
    cardStyle.shadowOffset = { width: 0, height: 2 };
    cardStyle.shadowOpacity = 0.1;
    cardStyle.shadowRadius = 4;
    cardStyle.elevation = 3;
  }

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}
