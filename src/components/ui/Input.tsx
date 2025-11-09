/**
 * Custom Input component
 */

import React from 'react';
import type { TextInputProps } from 'react-native-paper';
import { TextInput } from 'react-native-paper';

interface InputProps extends TextInputProps {
  error?: string;
}

export const Input: React.FC<InputProps> = ({ error, ...props }) => {
  return (
    <TextInput
      mode="outlined"
      error={!!error}
      {...props}
    />
  );
};