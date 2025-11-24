/**
 * FragileToggle Component
 * Toggle switch for marking items as fragile
 */

import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { useTheme } from '../../theme';

interface FragileToggleProps {
  isFragile: boolean;
  onToggle: (value: boolean) => void;
  style?: any;
}

export default function FragileToggle({
  isFragile,
  onToggle,
  style,
}: FragileToggleProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelContainer}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isFragile
                ? theme.colors.warning + '20'
                : theme.colors.text.tertiary + '20',
            },
          ]}
        >
          <AlertTriangle
            size={20}
            color={isFragile ? theme.colors.warning : theme.colors.text.tertiary}
            strokeWidth={1.5}
          />
        </View>

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.label,
              {
                fontFamily: theme.fonts.semibold,
                color: theme.colors.text.primary,
              },
            ]}
          >
            Fragile Item
          </Text>
          <Text
            style={[
              styles.description,
              {
                fontFamily: theme.fonts.regular,
                color: theme.colors.text.secondary,
              },
            ]}
          >
            {isFragile
              ? 'Item will be handled with extra care'
              : 'Mark if item needs special handling'}
          </Text>
        </View>
      </View>

      <Switch
        value={isFragile}
        onValueChange={onToggle}
        trackColor={{
          false: theme.colors.border,
          true: theme.colors.warning + '60',
        }}
        thumbColor={isFragile ? theme.colors.warning : theme.colors.text.tertiary}
        ios_backgroundColor={theme.colors.border}
      />

      {isFragile && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: theme.colors.warning + '15',
              borderColor: theme.colors.warning + '30',
            },
          ]}
        >
          <AlertTriangle size={14} color={theme.colors.warning} />
          <Text
            style={[
              styles.badgeText,
              {
                fontFamily: theme.fonts.medium,
                color: theme.colors.warning,
              },
            ]}
          >
            Handle with Care
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 2,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 14,
    marginLeft: 6,
  },
});