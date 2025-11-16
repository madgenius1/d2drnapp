import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Appbar,
  Button,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Assuming you have a type defined for your navigation stack parameters
// Replace 'RootStackParamList' with your actual stack type if different
type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  // Add other screens as needed
};

type ForgotPasswordProps = NativeStackScreenProps<
  RootStackParamList,
  'ForgotPassword'
>;

/**
 * Enhanced Forgot Password Screen UI.
 */
const ForgotPasswordScreen: React.FC<ForgotPasswordProps> = ({ navigation }) => {
  const theme = useTheme();
  // State to hold the email input value
  const [email, setEmail] = React.useState<string>('');
  // State to handle loading/submission status
  const [loading, setLoading] = React.useState<boolean>(false);

  // Placeholder function for handling the password reset logic
  const handleResetPassword = () => {
    setLoading(true);
    console.log('Password reset request for:', email);
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      // In a real app, you'd navigate after successful submission
      // For now, let's navigate back to Login as a placeholder action
      navigation.goBack(); 
      // Or show a confirmation message
    }, 2000);
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 30, // Increased padding for better spacing below the App Bar
    },
    // Enhanced title style
    title: {
      fontSize: 32,
      fontWeight: '700', // Matches typography.fontWeight.bold
      color: theme.colors.onBackground,
      marginBottom: 8,
    },
    // Enhanced description text style
    description: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant, // A slightly muted text color for body copy
      marginBottom: 30,
      lineHeight: 24,
    },
    // Style for the submit button to ensure it uses primary color
    submitButton: {
      marginTop: 20,
      borderRadius: theme.roundness, // Use the theme's roundness
    },
    // Style for the content wrapper below the Appbar
    contentWrapper: {
        flexGrow: 1,
    }
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* App Bar for navigation back */}
      <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Account Recovery" />
      </Appbar.Header>

      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          {/* Main Title */}
          <Text style={styles.title}>
            Forgot Your Password?
          </Text>

          {/* Descriptive Text */}
          <Text style={styles.description}>
            Don't worry, it happens. Enter the email address associated with your account, and we'll send you a link to reset your password.
          </Text>

          {/* Email Input Field */}
          <TextInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined" // 'outlined' looks modern and complements roundness
            style={{ backgroundColor: theme.colors.surface }}
            outlineStyle={{ borderRadius: theme.roundness }} // Apply roundness to the input border
            // Optional: Add icons for a better look
            left={<TextInput.Icon icon="email-outline" />}
          />

          {/* Submit Button */}
          <Button
            mode="contained" // Use contained for the primary action
            onPress={handleResetPassword}
            loading={loading}
            disabled={loading || email.trim() === ''} // Disable if loading or email is empty
            style={styles.submitButton}
            contentStyle={{ paddingVertical: 8 }} // Increase hit area of the button
            labelStyle={{ fontWeight: '600' }} // Semi-Bold label
          >
            Reset Password
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;