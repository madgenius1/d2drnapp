/**
 * Success Message Component
 * Displays success feedback with optional action button
 */

import { CheckCircle2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import Button from './Button';

interface SuccessMessageProps {
  message: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  fullScreen?: boolean;
  style?: object;
}

export default function SuccessMessage({
  message,
  description,
  actionLabel,
  onAction,
  fullScreen = false,
  style,
}: SuccessMessageProps) {
  const theme = useTheme();

  const containerStyle = fullScreen
    ? styles.fullScreenContainer
    : styles.container;

  return (
    <View style={[containerStyle, { backgroundColor: theme.colors.background }, style]}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme.colors.success + '15' },
        ]}
      >
        <CheckCircle2
          size={32}
          color={theme.colors.success}
          strokeWidth={1.5}
        />
      </View>

      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text.primary,
            fontFamily: 'Quicksand-SemiBold',
          },
        ]}
      >
        {message}
      </Text>

      {description && (
        <Text
          style={[
            styles.description,
            {
              color: theme.colors.text.secondary,
              fontFamily: 'Quicksand-Regular',
            },
          ]}
        >
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          size="medium"
          style={styles.actionButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fullScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  actionButton: {
    minWidth: 150,
  },
});