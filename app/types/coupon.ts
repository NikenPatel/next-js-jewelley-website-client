// app/types/coupon.ts
export interface Coupon {
  _id?: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number; // percentage (0-100) or fixed amount
  applicableProducts?: string[]; // array of Product IDs
  applicableCategories?: string[]; // array of Category IDs
  isActive: boolean;
  startDate?: string; // ISO date string
  expiryDate?: string; // ISO date string
  usageLimit?: number; // max number of uses (null means unlimited)
  usedCount?: number; // current usage count
  minOrderAmount?: number;
  maxDiscount?: number;
  isFirstOrderOnly?: boolean;
  applicableUsers?: string[]; // array of User IDs
  createdAt?: string;
  updatedAt?: string;
}
