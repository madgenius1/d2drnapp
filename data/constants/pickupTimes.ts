/**
 * Pickup Time Constants
 * Defines available pickup time slots
 */

/**
 * Pickup time option
 */
export interface PickupTimeOption {
  id: string;
  name: string;
  value: string;
  hour: number; // 24-hour format
  minute: number;
}

/**
 * Available pickup times (as per requirements)
 */
export const PICKUP_TIMES: PickupTimeOption[] = [
  { id: '0830am', name: '8.30 AM', value: '8.30 AM', hour: 8, minute: 30 },
  { id: '0900am', name: '9.00 AM', value: '9.00 AM', hour: 9, minute: 0 },
  { id: '1000am', name: '10.00 AM', value: '10.00 AM', hour: 10, minute: 0 },
  { id: '1100am', name: '11.00 AM', value: '11.00 AM', hour: 11, minute: 0 },
  { id: '1200pm', name: '12.00 PM', value: '12.00 PM', hour: 12, minute: 0 },
  { id: '0100pm', name: '1.00 PM', value: '1.00 PM', hour: 13, minute: 0 },
  { id: '0200pm', name: '2.00 PM', value: '2.00 PM', hour: 14, minute: 0 },
  { id: '0300pm', name: '3.00 PM', value: '3.00 PM', hour: 15, minute: 0 },
  { id: '0400pm', name: '4.00 PM', value: '4.00 PM', hour: 16, minute: 0 },
  { id: '0430pm', name: '4.30 PM', value: '4.30 PM', hour: 16, minute: 30 },
];

/**
 * Get pickup time by ID
 */
export const getPickupTimeById = (id: string): PickupTimeOption | undefined => {
  return PICKUP_TIMES.find(time => time.id === id);
};

/**
 * Get pickup time by value
 */
export const getPickupTimeByValue = (value: string): PickupTimeOption | undefined => {
  return PICKUP_TIMES.find(time => time.value === value);
};

/**
 * Format time option for dropdown
 */
export const formatPickupTimeOption = (time: PickupTimeOption): { id: string; name: string } => {
  return {
    id: time.id,
    name: time.name,
  };
};

/**
 * Get all pickup times formatted for dropdown
 */
export const getPickupTimeOptions = (): { id: string; name: string }[] => {
  return PICKUP_TIMES.map(formatPickupTimeOption);
};