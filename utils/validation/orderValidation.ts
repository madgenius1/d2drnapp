/**
 * Order Validation Utilities
 * Validates order form data
 */

import { CreateOrderFormData, OrderValidationResult } from '../../types/models/Order';
import { isValidKenyanPhone } from './phoneValidation';
import { VALIDATION } from '../../data/constants/appConstants';

/**
 * Validate recipient name
 */
export const validateRecipientName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return 'Recipient name is required';
  }

  if (name.trim().length < VALIDATION.MIN_NAME_LENGTH) {
    return `Name must be at least ${VALIDATION.MIN_NAME_LENGTH} characters`;
  }

  if (name.trim().length > VALIDATION.MAX_NAME_LENGTH) {
    return `Name must be less than ${VALIDATION.MAX_NAME_LENGTH} characters`;
  }

  return null;
};

/**
 * Validate recipient phone
 */
export const validateRecipientPhone = (phone: string): string | null => {
  if (!phone || phone.trim().length === 0) {
    return 'Recipient phone is required';
  }

  if (!isValidKenyanPhone(phone)) {
    return 'Enter valid phone (07XX XXX XXX)';
  }

  return null;
};

/**
 * Validate item description
 */
export const validateItemDescription = (description: string): string | null => {
  if (!description || description.trim().length === 0) {
    return 'Item description is required';
  }

  if (description.trim().length < VALIDATION.MIN_DESCRIPTION_LENGTH) {
    return `Please provide more details (at least ${VALIDATION.MIN_DESCRIPTION_LENGTH} characters)`;
  }

  if (description.trim().length > VALIDATION.MAX_DESCRIPTION_LENGTH) {
    return `Description must be less than ${VALIDATION.MAX_DESCRIPTION_LENGTH} characters`;
  }

  return null;
};

/**
 * Validate special instructions (optional)
 */
export const validateSpecialInstructions = (instructions: string): string | null => {
  if (!instructions) {
    return null; // Optional field
  }

  if (instructions.trim().length > VALIDATION.MAX_NOTES_LENGTH) {
    return `Instructions must be less than ${VALIDATION.MAX_NOTES_LENGTH} characters`;
  }

  return null;
};

/**
 * Validate delivery notes (optional)
 */
export const validateDeliveryNotes = (notes: string): string | null => {
  if (!notes) {
    return null; // Optional field
  }

  if (notes.trim().length > VALIDATION.MAX_NOTES_LENGTH) {
    return `Notes must be less than ${VALIDATION.MAX_NOTES_LENGTH} characters`;
  }

  return null;
};

/**
 * Validate pickup time
 */
export const validatePickupTime = (time: string): string | null => {
  if (!time || time.trim().length === 0) {
    return 'Please select pickup time';
  }

  return null;
};

/**
 * Validate location selection
 */
export const validateLocation = (
  routeId: string,
  stopId: string,
  locationName: string
): string | null => {
  if (!routeId) {
    return `Please select ${locationName} route`;
  }

  if (!stopId) {
    return `Please select ${locationName} stop`;
  }

  return null;
};

/**
 * Check if same pickup and dropoff location
 */
export const isSameLocation = (
  pickupRouteId: string,
  pickupStopId: string,
  dropoffRouteId: string,
  dropoffStopId: string
): boolean => {
  return (
    pickupRouteId === dropoffRouteId &&
    pickupStopId === dropoffStopId
  );
};

/**
 * Validate complete order form
 */
export const validateOrderForm = (
  formData: CreateOrderFormData
): OrderValidationResult => {
  const errors: Record<string, string> = {};

  // Validate pickup location
  const pickupRouteError = validateLocation(
    formData.pickupRoute,
    formData.pickupStop,
    'pickup'
  );
  if (pickupRouteError) {
    if (!formData.pickupRoute) {
      errors.pickupRoute = 'Please select pickup route';
    }
    if (!formData.pickupStop) {
      errors.pickupStop = 'Please select pickup stop';
    }
  }

  // Validate dropoff location
  const dropoffRouteError = validateLocation(
    formData.dropoffRoute,
    formData.dropoffStop,
    'drop-off'
  );
  if (dropoffRouteError) {
    if (!formData.dropoffRoute) {
      errors.dropoffRoute = 'Please select drop-off route';
    }
    if (!formData.dropoffStop) {
      errors.dropoffStop = 'Please select drop-off stop';
    }
  }

  // Check if same location
  if (
    formData.pickupRoute &&
    formData.pickupStop &&
    formData.dropoffRoute &&
    formData.dropoffStop &&
    isSameLocation(
      formData.pickupRoute,
      formData.pickupStop,
      formData.dropoffRoute,
      formData.dropoffStop
    )
  ) {
    errors.dropoffStop = '⚠️ Pickup and drop-off cannot be the same location';
  }

  // Validate recipient details
  const nameError = validateRecipientName(formData.recipientName);
  if (nameError) {
    errors.recipientName = nameError;
  }

  const phoneError = validateRecipientPhone(formData.recipientPhone);
  if (phoneError) {
    errors.recipientPhone = phoneError;
  }

  // Validate item details
  const descriptionError = validateItemDescription(formData.itemDescription);
  if (descriptionError) {
    errors.itemDescription = descriptionError;
  }

  // Validate optional fields
  const instructionsError = validateSpecialInstructions(
    formData.specialInstructions || ''
  );
  if (instructionsError) {
    errors.specialInstructions = instructionsError;
  }

  const notesError = validateDeliveryNotes(formData.deliveryNotes || '');
  if (notesError) {
    errors.deliveryNotes = notesError;
  }

  // Validate pickup time
  const timeError = validatePickupTime(formData.pickupTime);
  if (timeError) {
    errors.pickupTime = timeError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Check if form is complete (for enabling submit button)
 */
export const isOrderFormComplete = (formData: CreateOrderFormData): boolean => {
  return (
    // Locations
    !!formData.pickupRoute &&
    !!formData.pickupStop &&
    !!formData.dropoffRoute &&
    !!formData.dropoffStop &&
    // Not same location
    !isSameLocation(
      formData.pickupRoute,
      formData.pickupStop,
      formData.dropoffRoute,
      formData.dropoffStop
    ) &&
    // Recipient
    formData.recipientName.trim().length >= VALIDATION.MIN_NAME_LENGTH &&
    isValidKenyanPhone(formData.recipientPhone) &&
    // Item
    formData.itemDescription.trim().length >= VALIDATION.MIN_DESCRIPTION_LENGTH &&
    // Time
    !!formData.pickupTime
  );
};