/**
 * Confirm Dialog Component
 * Modal confirmation dialog with customizable actions
 */

import { AlertTriangle } from 'lucide-react-native';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import Button from './Button';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  icon?: 'warning' | 'info' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor,
  icon = 'warning',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const theme = useTheme();

  const getIconColor = () => {
    switch (icon) {
      case 'danger':
        return theme.colors.error;
      case 'info':
        return theme.colors.info;
      default:
        return theme.colors.warning;
    }
  };

  const iconColor = getIconColor();
  const buttonColor = confirmColor || (icon === 'danger' ? theme.colors.error : theme.colors.primary);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}
        activeOpacity={1}
        onPress={onCancel}
      >
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View
            style={[
              styles.dialog,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: iconColor + '15' },
              ]}
            >
              <AlertTriangle size={32} color={iconColor} strokeWidth={1.5} />
            </View>

            <Text
              style={[
                styles.title,
                {
                  color: theme.colors.text.primary,
                  fontFamily: 'Quicksand-Bold',
                },
              ]}
            >
              {title}
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

            <View style={styles.actions}>
              <Button
                title={cancelText}
                onPress={onCancel}
                variant="outline"
                style={styles.button}
              />
              <Button
                title={confirmText}
                onPress={onConfirm}
                style={[styles.button, { backgroundColor: buttonColor }]}
              />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});