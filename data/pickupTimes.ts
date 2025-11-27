/**
 * Available Pickup Times
 * Fixed time slots for order scheduling
 */

import type { PickupTime } from '../types';

export const PICKUP_TIMES: PickupTime[] = [
  '8:30 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '4:30 PM',
];

export const PICKUP_TIME_OPTIONS = PICKUP_TIMES.map((time) => ({
  id: time,
  label: time,
  value: time,
}));

export default PICKUP_TIMES;