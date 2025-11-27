/**
 * Stats Card Component
 * Displays user statistics with icon
 */

import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import Card from '../common/Card';

interface StatsCardProps {
  icon: LucideIcon;
  iconColor: string;
  value: number | string;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  style?: object;
}

export default function StatsCard({
  icon: Icon,
  iconColor,
  value,
  label,
  subtitle,
  onPress,
  style,
}: StatsCardProps) {
  const theme = useTheme();

  return (
    <Card
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: iconColor + '10',
          borderColor: iconColor + '20',
        },
        style,
      ]}
      padding={16}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
        <Icon size={24} color={iconColor} strokeWidth={1.5} />
      </View>

      <Text
        style={[
          styles.value,
          {
            color: theme.colors.text.primary,
            fontFamily: 'Quicksand-Bold',
          },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.label,
          {
            color: theme.colors.text.secondary,
            fontFamily: 'Quicksand-Medium',
          },
        ]}
      >
        {label}
      </Text>

      {subtitle && (
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.text.tertiary,
              fontFamily: 'Quicksand-Regular',
            },
          ]}
        >
          {subtitle}
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    minWidth: 100,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
});