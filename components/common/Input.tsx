/**
 * Input Component (TypeScript)
 * Text input with icons and validation
 */

import { Eye, EyeOff, LucideIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Text, TextInput, TextInputProps, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  style = {},
  inputStyle = {},
  disabled = false,
  ...props
}: InputProps) {
  const theme = useTheme();
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const getInputContainerStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    backgroundColor: theme.colors.input.background,
    borderWidth: 1,
    borderColor: error
      ? theme.colors.error
      : isFocused
        ? theme.colors.primary
        : theme.colors.input.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: multiline ? 12 : 16,
    opacity: disabled ? 0.6 : 1,
  });

  const getInputStyle = (): TextStyle => ({
    flex: 1,
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    color: theme.colors.text.primary,
    paddingLeft: LeftIcon ? 12 : 0,
    paddingRight: RightIcon || secureTextEntry ? 12 : 0,
    minHeight: multiline ? numberOfLines * 20 : undefined,
    textAlignVertical: multiline ? 'top' : 'center',
    ...inputStyle,
  });

  return (
    <View style={style}>
      {label && (
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Quicksand-Medium',
            color: theme.colors.text.primary,
            marginBottom: 8,
          }}
        >
          {label}
        </Text>
      )}

      <View style={getInputContainerStyle()}>
        {LeftIcon && <LeftIcon size={20} color={theme.colors.text.tertiary} />}

        <TextInput
          placeholder={placeholder}
          placeholderTextColor={theme.colors.input.placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={getInputStyle()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsSecure(!isSecure)}
            style={{ padding: 4 }}
          >
            {isSecure ? (
              <Eye size={20} color={theme.colors.text.tertiary} />
            ) : (
              <EyeOff size={20} color={theme.colors.text.tertiary} />
            )}
          </TouchableOpacity>
        )}

        {RightIcon && !secureTextEntry && (
          <RightIcon size={20} color={theme.colors.text.tertiary} />
        )}
      </View>

      {error && (
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Quicksand-Regular',
            color: theme.colors.error,
            marginTop: 4,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}