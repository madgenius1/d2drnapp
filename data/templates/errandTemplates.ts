/**
 * Errand Templates
 * Pre-defined quick errand types for home screen
 */

import { ErrandTemplate, ErrandCategory } from '../../types/models/Errand';

/**
 * Available errand templates
 */
export const errandTemplates: ErrandTemplate[] = [
  {
    id: 'buy_groceries',
    title: 'Buy Groceries',
    description: 'Shop for groceries at a store',
    icon: 'ShoppingCart',
    category: ErrandCategory.SHOPPING,
    estimatedDuration: '30-60 mins',
    popularityScore: 10,
  },
  {
    id: 'pick_up_parcel',
    title: 'Pick Up Parcel',
    description: 'Collect package from courier',
    icon: 'Package',
    category: ErrandCategory.PICKUP,
    estimatedDuration: '15-30 mins',
    popularityScore: 9,
  },
  {
    id: 'pay_bills',
    title: 'Pay Bills',
    description: 'Pay utility bills at service center',
    icon: 'CreditCard',
    category: ErrandCategory.BILLS,
    estimatedDuration: '20-40 mins',
    popularityScore: 8,
  },
  {
    id: 'medical_pickup',
    title: 'Medical Pickup',
    description: 'Collect prescriptions from pharmacy',
    icon: 'Heart',
    category: ErrandCategory.MEDICAL,
    estimatedDuration: '15-25 mins',
    popularityScore: 7,
  },
  {
    id: 'document_delivery',
    title: 'Document Delivery',
    description: 'Deliver important documents',
    icon: 'FileText',
    category: ErrandCategory.DOCUMENTS,
    estimatedDuration: '20-40 mins',
    popularityScore: 6,
  },
  {
    id: 'food_delivery',
    title: 'Food Delivery',
    description: 'Order and deliver food from restaurant',
    icon: 'UtensilsCrossed',
    category: ErrandCategory.FOOD,
    estimatedDuration: '30-50 mins',
    popularityScore: 9,
  },
];

/**
 * Get template by ID
 */
export const getTemplateById = (id: string): ErrandTemplate | undefined => {
  return errandTemplates.find(template => template.id === id);
};

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (
  category: ErrandCategory
): ErrandTemplate[] => {
  return errandTemplates.filter(template => template.category === category);
};

/**
 * Get most popular templates
 */
export const getPopularTemplates = (limit: number = 6): ErrandTemplate[] => {
  return errandTemplates
    .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
    .slice(0, limit);
};