import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { useTheme } from "../theme/index";

export default function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary", // primary, secondary, outline
  size = "large", // small, medium, large
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  style = {},
  textStyle = {},
  fullWidth = true,
  ...props
}) {
  const theme = useTheme();

  const getButtonStyle = () => {
    const baseStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: size === "small" ? 8 : 12,
      paddingHorizontal: size === "small" ? 12 : size === "medium" ? 16 : 20,
      paddingVertical: size === "small" ? 8 : size === "medium" ? 12 : 16,
      opacity: disabled || loading ? 0.6 : 1,
    };

    if (fullWidth) {
      baseStyle.width = "100%";
    }

    switch (variant) {
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: theme.colors.elevated,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: theme.colors.primary,
        };
      default: // primary
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary,
        };
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontFamily: "Quicksand-SemiBold",
      fontSize: size === "small" ? 14 : size === "medium" ? 16 : 18,
      fontWeight: "600",
    };

    switch (variant) {
      case "secondary":
        return {
          ...baseTextStyle,
          color: theme.colors.text.primary,
        };
      case "outline":
        return {
          ...baseTextStyle,
          color: theme.colors.primary,
        };
      default: // primary
        return {
          ...baseTextStyle,
          color: "#ffffff",
        };
    }
  };

  const iconSize = size === "small" ? 16 : size === "medium" ? 18 : 20;
  const iconColor =
    variant === "primary"
      ? "#ffffff"
      : variant === "outline"
        ? theme.colors.primary
        : theme.colors.text.primary;

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : (
        <>
          {LeftIcon && (
            <LeftIcon
              size={iconSize}
              color={iconColor}
              style={{ marginRight: title ? 8 : 0 }}
            />
          )}
          {title && <Text style={[getTextStyle(), textStyle]}>{title}</Text>}
          {RightIcon && (
            <RightIcon
              size={iconSize}
              color={iconColor}
              style={{ marginLeft: title ? 8 : 0 }}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
