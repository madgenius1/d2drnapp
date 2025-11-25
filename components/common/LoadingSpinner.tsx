/**
 * LoadingSpinner Component
 * Full screen loading indicator
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  message,
  size = 'large',
  fullScreen = true,
}: LoadingSpinnerProps) {
  const theme = useTheme();

  if (!fullScreen) {
    return (
      <View style={styles.inline}>
        <ActivityIndicator size={size} color={theme.colors.primary} />
        {message && (
          <Text
            style={[
              styles.message,
              {
                fontFamily: theme.fonts.regular,
                color: theme.colors.text.secondary,
              },
            ]}
          >
            {message}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {message && (
        <Text
          style={[
            styles.message,
            {
              fontFamily: theme.fonts.regular,
              color: theme.colors.text.secondary,
            },
          ]}
        >
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inline: {
    padding: 20,
    alignItems: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});