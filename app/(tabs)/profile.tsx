/**
 * Profile Screen (TypeScript)
 * User profile and settings
 */

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogOut, Settings } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import ProfileHeader from '../../components/profile/ProfileHeader';
import SettingsItem from '../../components/profile/SettingsItem';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../theme';

export default function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing will be available soon.', [{ text: 'OK' }]);
  };

  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.colors.text.primary }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 28, fontFamily: 'Quicksand-Bold', color: theme.colors.text.primary, paddingHorizontal: 20, marginBottom: 8, fontWeight: '700' }}>
          Profile
        </Text>
        <Text style={{ fontSize: 16, fontFamily: 'Quicksand-Regular', color: theme.colors.text.secondary, paddingHorizontal: 20, marginBottom: 32 }}>
          Manage your account
        </Text>

        <ProfileHeader user={user} onEdit={handleEditProfile} style={{ marginHorizontal: 20, marginBottom: 32 }} />

        <View style={{ backgroundColor: theme.colors.card.background, marginHorizontal: 20, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border, marginBottom: 32 }}>
          <SettingsItem
            icon={Settings}
            title="Notifications"
            subtitle="Order updates and alerts"
            type="switch"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <Button
            title="Sign Out"
            leftIcon={LogOut}
            onPress={handleLogout}
            variant="outline"
            style={{ borderColor: theme.colors.error }}
            textStyle={{ color: theme.colors.error }}
          />
        </View>
      </ScrollView>
    </View>
  );
}