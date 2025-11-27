/**
 * Error Message Component
 * Displays error messages with optional retry action
 */

import { AlertCircle, RefreshCw } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import Button from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
  style?: object;
}

export default function ErrorMessage({
  message,
  onRetry,
  fullScreen = false,
  style,
}: ErrorMessageProps) {
  const theme = useTheme();

  const containerStyle = fullScreen
    ? styles.fullScreenContainer
    : styles.container;

  return (
    <View style={[containerStyle, { backgroundColor: theme.colors.background }, style]}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme.colors.error + '15' },
        ]}
      >
        <AlertCircle size={32} color={theme.colors.error} strokeWidth={1.5} />
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
        Something went wrong
      </Text>

      <Text
        style={[
          styles.message,
          {
            color: theme.colors.text.secondary,
            fontFamily: 'Quicksand-Regular',
          },
        ]}
      >
        {message}
      </Text>

      {onRetry && (
        <Button
          title="Try Again"
          onPress={onRetry}
          leftIcon={RefreshCw}
          size="medium"
          style={styles.retryButton}
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
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    minWidth: 150,
  },
});