/**
 * Settings Item Component
 * Individual setting row with icon and action
 */

import { ChevronRight, LucideIcon } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

interface SettingsItemProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  subtitle?: string;
  type?: 'navigation' | 'switch' | 'info';
  value?: boolean;
  onPress?: () => void;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  style?: object;
}

export default function SettingsItem({
  icon: Icon,
  iconColor,
  title,
  subtitle,
  type = 'navigation',
  value,
  onPress,
  onValueChange,
  disabled = false,
  style,
}: SettingsItemProps) {
  const theme = useTheme();
  const color = iconColor || theme.colors.primary;

  const handlePress = () => {
    if (type === 'navigation' && onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card.background,
          borderBottomColor: theme.colors.divider,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || type !== 'navigation'}
      activeOpacity={type === 'navigation' ? 0.7 : 1}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: color + '15' },
        ]}
      >
        <Icon size={20} color={color} strokeWidth={1.5} />
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.text.primary,
              fontFamily: 'Quicksand-SemiBold',
            },
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              {
                color: theme.colors.text.secondary,
                fontFamily: 'Quicksand-Regular',
              },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {type === 'switch' && onValueChange && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primary + '40',
          }}
          thumbColor={
            value ? theme.colors.primary : theme.colors.text.tertiary
          }
        />
      )}

      {type === 'navigation' && (
        <ChevronRight
          size={20}
          color={theme.colors.text.tertiary}
          strokeWidth={1.5}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
  },
});