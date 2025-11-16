/**
 * Login Screen
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
import { signIn } from '../../services/auth';
import { isValidEmail } from '../../utils/validation';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [form, setForm] = useState({
    email: '',
    password: '',
    showPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (key: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogin = async () => {
    setError('');

    if (!isValidEmail(form.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      await signIn(form.email, form.password);
      // router.replace('/dashboard'); // Optional redirect
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome Back!
          </Text>
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>
            Sign in to access your delivery dashboard.
          </Text>

          <View style={styles.form}>
            {/* Email Field */}
            <TextInput
              label="Email Address"
              value={form.email}
              onChangeText={(v) => updateField('email', v)}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={styles.input}
              outlineStyle={{ borderRadius: 12 }}
              left={<TextInput.Icon icon="email-outline" />}
            />

            {/* Password Field */}
            <TextInput
              label="Password"
              value={form.password}
              onChangeText={(v) => updateField('password', v)}
              mode="outlined"
              secureTextEntry={!form.showPassword}
              autoCapitalize="none"
              autoComplete="password"
              style={styles.input}
              outlineStyle={{ borderRadius: 12 }}
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={form.showPassword ? 'eye-off' : 'eye'}
                  onPress={() => updateField('showPassword', !form.showPassword)}
                />
              }
            />

            {/* Forgot Password */}
            <View style={styles.forgotPasswordContainer}>
              <Button
                variant="text"
                onPress={() => router.push('/(auth)/forgot-password')}
                disabled={loading}
                contentStyle={styles.forgotPasswordButtonContent}
                labelStyle={{ color: colors.primary, fontWeight: '600' }}
              >
                Forgot Password?
              </Button>
            </View>

            {/* Error */}
            {!!error && (
              <HelperText
                type="error"
                visible
                style={styles.errorText}
              >
                {error}
              </HelperText>
            )}

            {/* Login Button */}
            <Button
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.button}
              mode="contained"
            >
              Log In
            </Button>

            {/* Register Link */}
            <Button
              variant="text"
              onPress={() => router.push('/(auth)/register')}
              disabled={loading}
            >
              Don't have an account? Register
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  content: { padding: 24 },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 36,
    textAlign: 'center',
  },
  form: { marginTop: 16 },
  input: {
    marginBottom: 16,
    marginTop: 12,
  },
  button: {
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 12,
    paddingVertical: 10,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: -8,
    marginBottom: 12,
  },
  forgotPasswordButtonContent: {
    paddingHorizontal: 0,
    paddingVertical: 4,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 8,
  },
});
