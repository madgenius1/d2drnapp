/**
 * Order Layout
 * Stack navigator for order screens
 */

import { Stack } from 'expo-router';
import { useTheme } from '../../theme';

export default function OrderLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="create-order" />
      <Stack.Screen name="order-details" />
      <Stack.Screen name="track-order" />
      <Stack.Screen name="modify-order" />
    </Stack>
  );
}