/**
 * Errand Quick Templates
 * Pre-defined errand categories for quick access
 */

export interface ErrandTemplate {
  id: string;
  title: string;
  description: string;
  icon: string; // Icon component name from lucide-react-native
  category: 'shopping' | 'documents' | 'health' | 'food' | 'finance' | 'other';
  suggestedDescription: string;
}

export const ERRAND_TEMPLATES: ErrandTemplate[] = [
  {
    id: 'buy-groceries',
    title: 'Buy Groceries',
    description: 'Shopping at supermarket',
    icon: 'ShoppingCart',
    category: 'shopping',
    suggestedDescription: 'Buy groceries at Naivas/Carrefour, deliver to my location',
  },
  {
    id: 'pick-parcel',
    title: 'Pick Up Parcel',
    description: 'Collect package',
    icon: 'Package',
    category: 'documents',
    suggestedDescription: 'Pick up parcel from courier office and deliver to my address',
  },
  {
    id: 'pay-bills',
    title: 'Pay Bills',
    description: 'Utility payments',
    icon: 'CreditCard',
    category: 'finance',
    suggestedDescription: 'Pay utility bills at service center',
  },
  {
    id: 'medical-pickup',
    title: 'Medical Pickup',
    description: 'Pharmacy/hospital',
    icon: 'Heart',
    category: 'health',
    suggestedDescription: 'Collect prescriptions from pharmacy and deliver',
  },
  {
    id: 'document-delivery',
    title: 'Document Delivery',
    description: 'Important papers',
    icon: 'FileText',
    category: 'documents',
    suggestedDescription: 'Deliver important documents to recipient',
  },
  {
    id: 'food-delivery',
    title: 'Food Delivery',
    description: 'Restaurant orders',
    icon: 'UtensilsCrossed',
    category: 'food',
    suggestedDescription: 'Pick up and special delivery from my favorite restaurant',
  },
];

export const getTemplateById = (id: string): ErrandTemplate | undefined => {
  return ERRAND_TEMPLATES.find((template) => template.id === id);
};

export const getTemplatesByCategory = (
  category: ErrandTemplate['category']
): ErrandTemplate[] => {
  return ERRAND_TEMPLATES.filter((template) => template.category === category);
};

export default ERRAND_TEMPLATES;