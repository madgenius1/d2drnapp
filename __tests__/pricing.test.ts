/**
 * Unit tests for pricing calculations
 */

import {
    calculateDifferentRoutePrice,
    calculateSameRoutePrice,
    calculateTariff,
} from '../src/utils/pricing';

describe('Pricing Calculations', () => {
  describe('calculateTariff', () => {
    it('should return 0 for index 0', () => {
      expect(calculateTariff(0, 100, 20)).toBe(0);
    });

    it('should calculate tariff correctly for index 1', () => {
      expect(calculateTariff(1, 100, 20)).toBe(120); // 100 + 20*1
    });

    it('should calculate tariff correctly for index 5', () => {
      expect(calculateTariff(5, 100, 20)).toBe(200); // 100 + 20*5
    });

    it('should use default values when not provided', () => {
      expect(calculateTariff(3)).toBe(160); // 100 + 20*3
    });
  });

  describe('calculateSameRoutePrice', () => {
    it('should calculate price for forward direction', () => {
      // Pickup at index 2, dropoff at index 5
      // Sum: t(3) + t(4) + t(5) = 160 + 180 + 200 = 540
      const result = calculateSameRoutePrice(2, 5, 100, 20);
      
      expect(result.price).toBe(540);
      expect(result.breakdown).toHaveLength(3);
      expect(result.fromIndex).toBe(2);
      expect(result.toIndex).toBe(5);
    });

    it('should calculate price for backward direction', () => {
      // Pickup at index 5, dropoff at index 2
      // Sum: t(3) + t(4) + t(5) = 160 + 180 + 200 = 540
      const result = calculateSameRoutePrice(5, 2, 100, 20);
      
      expect(result.price).toBe(540);
      expect(result.breakdown).toHaveLength(3);
      expect(result.fromIndex).toBe(2);
      expect(result.toIndex).toBe(5);
    });

    it('should calculate price for adjacent stops', () => {
      // Pickup at index 1, dropoff at index 2
      // Sum: t(2) = 140
      const result = calculateSameRoutePrice(1, 2, 100, 20);
      
      expect(result.price).toBe(140);
      expect(result.breakdown).toHaveLength(1);
      expect(result.breakdown[0].index).toBe(2);
      expect(result.breakdown[0].tariff).toBe(140);
    });

    it('should handle same index gracefully', () => {
      // This shouldn't happen in practice, but test the behavior
      const result = calculateSameRoutePrice(3, 3, 100, 20);
      
      expect(result.price).toBe(0);
      expect(result.breakdown).toHaveLength(0);
    });
  });

  describe('calculateDifferentRoutePrice', () => {
    it('should calculate price for different routes', () => {
      // Pickup at Mombasa Road index 2: t(1) + t(2) = 120 + 140 = 260
      // Transfer fee: 150
      // Dropoff at Kangundo Road index 4: t(1) + t(2) + t(3) + t(4) = 120 + 140 + 160 + 180 = 600
      // Total: 260 + 150 + 600 = 1010
      const result = calculateDifferentRoutePrice(
        2, 100, 20, // Pickup route
        4, 100, 20, // Dropoff route
        150         // Transfer fee
      );
      
      expect(result.price).toBe(1010);
      expect(result.breakdown.pickup).toHaveLength(2);
      expect(result.breakdown.transfer).toBe(150);
      expect(result.breakdown.dropoff).toHaveLength(4);
    });

    it('should handle index 1 on both routes', () => {
      // Pickup: t(1) = 120
      // Transfer: 150
      // Dropoff: t(1) = 120
      // Total: 120 + 150 + 120 = 390
      const result = calculateDifferentRoutePrice(
        1, 100, 20,
        1, 100, 20,
        150
      );
      
      expect(result.price).toBe(390);
    });

    it('should handle different base and step values', () => {
      // Pickup route: base=80, step=15, index=3
      // t(1) + t(2) + t(3) = 95 + 110 + 125 = 330
      // Dropoff route: base=120, step=25, index=2
      // t(1) + t(2) = 145 + 170 = 315
      // Total: 330 + 150 + 315 = 795
      const result = calculateDifferentRoutePrice(
        3, 80, 15,
        2, 120, 25,
        150
      );
      
      expect(result.price).toBe(795);
    });

    it('should sum pickup breakdown correctly', () => {
      const result = calculateDifferentRoutePrice(2, 100, 20, 2, 100, 20, 150);
      
      const pickupSum = result.breakdown.pickup.reduce(
        (sum, item) => sum + item.tariff,
        0
      );
      
      expect(pickupSum).toBe(260); // t(1) + t(2)
    });

    it('should sum dropoff breakdown correctly', () => {
      const result = calculateDifferentRoutePrice(2, 100, 20, 3, 100, 20, 150);
      
      const dropoffSum = result.breakdown.dropoff.reduce(
        (sum, item) => sum + item.tariff,
        0
      );
      
      expect(dropoffSum).toBe(420); // t(1) + t(2) + t(3)
    });
  });

  describe('Real-world scenarios', () => {
    it('should match spec example: Mombasa Road same route', () => {
      // Spec example: pickup index 2, drop index 5
      // Expected: t(3) + t(4) + t(5) = 160 + 180 + 200 = 540
      const result = calculateSameRoutePrice(2, 5, 100, 20);
      expect(result.price).toBe(540);
    });

    it('should match spec example: Different routes', () => {
      // Spec example: Mombasa index 2 to Kangundo index 4
      // Expected: (120+140) + 150 + (120+140+160+180) = 1010
      const result = calculateDifferentRoutePrice(2, 100, 20, 4, 100, 20, 150);
      expect(result.price).toBe(1010);
    });

    it('should handle short distance (1 stop)', () => {
      const result = calculateSameRoutePrice(0, 1, 100, 20);
      expect(result.price).toBe(120); // t(1)
    });

    it('should handle long distance (7 stops)', () => {
      const result = calculateSameRoutePrice(0, 7, 100, 20);
      // t(1) through t(7) = 120 + 140 + 160 + 180 + 200 + 220 + 240 = 1260
      expect(result.price).toBe(1260);
    });
  });
});