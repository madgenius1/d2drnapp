/**
 * Profile tab screen
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Avatar, Divider, Switch, Text, TextInput } from 'react-native-paper';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { updateUserProfile } from '../../services/firestore';

export default function ProfileScreen() {
  const { user, userProfile, signOut, refreshProfile } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(
    userProfile?.displayName || ''
  );
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [saving, setSaving] = useState(false);

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    userProfile?.notificationsEnabled ?? true
  );
  const [emailNotifications, setEmailNotifications] = useState(
    userProfile?.emailNotificationsEnabled ?? true
  );
  const [smsNotifications, setSmsNotifications] = useState(
    userProfile?.smsNotificationsEnabled ?? false
  );

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      await updateUserProfile(user.uid, {
        displayName: displayName.trim() || null,
        phone: phone.trim() || null,
        notificationsEnabled,
        emailNotificationsEnabled: emailNotifications,
        smsNotificationsEnabled: smsNotifications,
      });

      await refreshProfile();
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          }
        },
      },
    ]);
  };

  const handleAvatarPress = () => {
    // TODO: Implement avatar upload
    Alert.alert(
      'Avatar Upload',
      'Avatar upload feature coming soon!',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleAvatarPress}>
          <Avatar.Text
            size={80}
            label={displayName ? displayName[0].toUpperCase() : 'U'}
            style={{ backgroundColor: colors.primary }}
          />
          <View
            style={[styles.avatarBadge, { backgroundColor: colors.primary }]}
          >
            <MaterialCommunityIcons name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>

        <Text style={[styles.name, { color: colors.text }]}>
          {displayName || 'User'}
        </Text>
        <Text style={[styles.email, { color: colors.placeholder }]}>
          {user?.email}
        </Text>
      </View>

      {/* Profile Information */}
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Profile Information
          </Text>
          {!editing && (
            <Button
              variant="text"
              onPress={() => setEditing(true)}
              compact
            >
              Edit
            </Button>
          )}
        </View>

        <Divider style={styles.divider} />

        {editing ? (
          <>
            <TextInput
              label="Display Name"
              value={displayName}
              onChangeText={setDisplayName}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              keyboardType="phone-pad"
              placeholder="0712345678"
              style={styles.input}
            />

            <View style={styles.editActions}>
              <Button
                onPress={handleSave}
                loading={saving}
                disabled={saving}
                style={styles.saveButton}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                onPress={() => {
                  setEditing(false);
                  setDisplayName(userProfile?.displayName || '');
                  setPhone(userProfile?.phone || '');
                }}
                disabled={saving}
              >
                Cancel
              </Button>
            </View>
          </>
        ) : (
          <>
            <InfoRow
              label="Display Name"
              value={displayName || 'Not set'}
              colors={colors}
            />
            <InfoRow
              label="Phone"
              value={phone || 'Not set'}
              colors={colors}
            />
          </>
        )}
      </Card>

      {/* Notification Settings */}
      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Notifications
        </Text>
        <Divider style={styles.divider} />

        <SettingRow
          label="Enable Notifications"
          value={notificationsEnabled}
          onValueChange={async (value) => {
            setNotificationsEnabled(value);
            if (user) {
              await updateUserProfile(user.uid, {
                notificationsEnabled: value,
              });
            }
          }}
          colors={colors}
        />

        <SettingRow
          label="Email Notifications"
          value={emailNotifications}
          onValueChange={async (value) => {
            setEmailNotifications(value);
            if (user) {
              await updateUserProfile(user.uid, {
                emailNotificationsEnabled: value,
              });
            }
          }}
          colors={colors}
          disabled={!notificationsEnabled}
        />

        <SettingRow
          label="SMS Notifications"
          value={smsNotifications}
          onValueChange={async (value) => {
            setSmsNotifications(value);
            if (user) {
              await updateUserProfile(user.uid, {
                smsNotificationsEnabled: value,
              });
            }
          }}
          colors={colors}
          disabled={!notificationsEnabled}
        />
      </Card>

      {/* App Settings */}
      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          App Settings
        </Text>
        <Divider style={styles.divider} />

        <SettingRow
          label="Dark Mode"
          value={isDark}
          onValueChange={toggleTheme}
          colors={colors}
        />
      </Card>

      {/* Sign Out */}
      <Button
        onPress={handleSignOut}
        variant="outlined"
        icon="logout"
        style={styles.signOutButton}
      >
        Sign Out
      </Button>

      <Text style={[styles.version, { color: colors.placeholder }]}>
        Version 1.0.0
      </Text>
    </ScrollView>
  );
}

const InfoRow: React.FC<{
  label: string;
  value: string;
  colors: any;
}> = ({ label, value, colors }) => (
  <View style={styles.infoRow}>
    <Text style={[styles.infoLabel, { color: colors.placeholder }]}>
      {label}
    </Text>
    <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
  </View>
);

const SettingRow: React.FC<{
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  colors: any;
  disabled?: boolean;
}> = ({ label, value, onValueChange, colors, disabled }) => (
  <View style={styles.settingRow}>
    <Text
      style={[
        styles.settingLabel,
        { color: colors.text },
        disabled && { opacity: 0.5 },
      ]}
    >
      {label}
    </Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    marginBottom: 12,
  },
  input: {
    marginBottom: 16,
  },
  editActions: {
    gap: 8,
  },
  saveButton: {
    marginBottom: 8,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  signOutButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  version: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});