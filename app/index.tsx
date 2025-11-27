/**
 * App Root Index (Modified)
 * Redirects to splash screen
 */

import { Redirect } from 'expo-router';
import { useTheme } from '../theme';

export default function Index() {
  const theme = useTheme(); // Initialize theme

  return <Redirect href="/splash" />;
}