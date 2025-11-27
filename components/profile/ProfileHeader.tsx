/**
 * Profile Header Component
 * User profile display with avatar and info
 */

import { Edit2, Mail, Phone, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import type { User as UserType } from '../../types';
import { formatPhoneNumber } from '../../utils/formatting';
import Card from '../common/Card';

interface ProfileHeaderProps {
  user: UserType;
  onEdit: () => void;
  style?: object;
}

export default function ProfileHeader({ user, onEdit, style }: ProfileHeaderProps) {
  const theme = useTheme();

  return (
    <Card style={style}>
      <View style={styles.container}>
        {/* Avatar */}
        <View
          style={[
            styles.avatar,
            { backgroundColor: theme.colors.primary + '20' },
          ]}
        >
          {user.avatar ? (
            <Text>Avatar Image</Text>
          ) : (
            <User size={36} color={theme.colors.primary} strokeWidth={1.5} />
          )}
        </View>

        {/* User Info */}
        <View style={styles.info}>
          <Text
            style={[
              styles.name,
              {
                color: theme.colors.text.primary,
                fontFamily: 'Quicksand-Bold',
              },
            ]}
          >
            {user.name}
          </Text>

          <View style={styles.contactRow}>
            <Mail
              size={16}
              color={theme.colors.text.secondary}
              strokeWidth={1.5}
            />
            <Text
              style={[
                styles.contactText,
                {
                  color: theme.colors.text.secondary,
                  fontFamily: 'Quicksand-Regular',
                },
              ]}
            >
              {user.email}
            </Text>
          </View>

          {user.phone && (
            <View style={styles.contactRow}>
              <Phone
                size={16}
                color={theme.colors.text.secondary}
                strokeWidth={1.5}
              />
              <Text
                style={[
                  styles.contactText,
                  {
                    color: theme.colors.text.secondary,
                    fontFamily: 'Quicksand-Regular',
                  },
                ]}
              >
                {formatPhoneNumber(user.phone)}
              </Text>
            </View>
          )}
        </View>

        {/* Edit Button */}
        <TouchableOpacity
          onPress={onEdit}
          style={[
            styles.editButton,
            { backgroundColor: theme.colors.primary + '15' },
          ]}
        >
          <Edit2 size={20} color={theme.colors.primary} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    marginLeft: 8,
  },
  editButton: {
    padding: 12,
    borderRadius: 20,
  },
});