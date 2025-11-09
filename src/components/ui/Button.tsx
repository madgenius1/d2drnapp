/**
 * Custom Button component
 */

import React from 'react';
import type { ButtonProps as PaperButtonProps } from 'react-native-paper';
import { Button as PaperButton } from 'react-native-paper';

interface ButtonProps extends Omit<PaperButtonProps, 'children'> {
  children: string;
  variant?: 'primary' | 'secondary' | 'outlined' | 'text';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  mode,
  ...props
}) => {
  // Determine button mode based on variant
  let buttonMode: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal' = 'contained';

  if (variant === 'outlined') {
    buttonMode = 'outlined';
  } else if (variant === 'text') {
    buttonMode = 'text';
  } else if (variant === 'secondary') {
    buttonMode = 'outlined';
  }

  return (
    <PaperButton
      mode={mode || buttonMode}
      {...props}
    >
      {children}
    </PaperButton>
  );
};