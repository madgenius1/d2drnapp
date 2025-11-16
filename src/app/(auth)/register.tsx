/**
 * Register screen
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { HelperText, Text, TextInput } from 'react-native-paper';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { signUp } from '../../services/auth';
import { typography } from '../../theme/typography'; // Import typography
import { getPasswordStrengthMessage, isValidEmail, isValidPassword } from '../../utils/validation';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { colors } = useTheme();
  const router = useRouter();

  const handleRegister = async () => {
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isValidPassword(password)) {
      setError(getPasswordStrengthMessage(password));
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, name);
      // Navigation handled by RootLayoutNav
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Logo/Icon Area - Add a visual element here */}
          {/* <View style={styles.headerIconContainer}>
            <Text style={[styles.headerIcon, { backgroundColor: colors.primary, color: colors.primary }]}>
              🚚
            </Text>
          </View> */}
          
          <Text style={[styles.title, { color: colors.text }]}>
            Join the d2dApp
          </Text>
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>
            Create your account experience better delivery!
          </Text>

          <View style={styles.form}>
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              autoCapitalize="words"
              style={styles.input}
              outlineColor={colors.border} // Use border color for outline
              activeOutlineColor={colors.primary} // Highlight with primary color
              placeholderTextColor={colors.placeholder}
            />

            <TextInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              placeholderTextColor={colors.placeholder}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password-new"
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                  color={colors.placeholder} // Use placeholder color for icon
                />
              }
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              placeholderTextColor={colors.placeholder}
            />

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              placeholderTextColor={colors.placeholder}
            />

            {error ? (
              // Use the error color from the theme for HelperText
              <HelperText type="error" visible={true} style={{ color: colors.error }}>
                {error}
              </HelperText>
            ) : null}

            <Button
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.button}
              // Button component uses theme primary color by default, so no color change needed here
            >
              Sign Up
            </Button>

            <Button
              variant="text"
              onPress={() => router.back()}
              disabled={loading}
              contentStyle={styles.textButtonContent}
              labelStyle={{ color: colors.primary, fontWeight: typography.fontWeight.medium }}
            >
              Already have an account? Log In
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  // New Header Icon Style
  headerIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcon: {
    fontSize: 48,
    padding: 16,
    borderRadius: 50, // Making it a circle
    overflow: 'hidden', // Required for borderRadius to clip background on some platforms
    elevation: 4, // Subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: typography.fontSize.xxl, // Use defined typography
    fontWeight: typography.fontWeight.bold,
    marginBottom: 4, // Reduced margin
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.md, // Use defined typography
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    marginTop: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16, // Increased spacing before primary button
    marginBottom: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  // Added style to remove extra padding on text button if needed
  textButtonContent: {
    paddingVertical: 0,
  }
});