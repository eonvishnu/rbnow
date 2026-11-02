export interface AdminCoupon {
  id: string;
  code: string;
  type: 'fixed' | 'percentage';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  isActive: boolean;
  expiresAt?: string;
}

export interface DiscountProductVariant {
  id: string;
  unit: string;
  price: number;
}

export interface DiscountProduct {
  id: string;
  name: string;
  product_variants: DiscountProductVariant[] | null;
}

export interface VariantDiscount {
  id: string;
  name: string;
  discount_type: string;
  discount_value: number;
  is_active: boolean;
  discount_variants: unknown[];
}

export interface PromotionWorkspace {
  coupons: AdminCoupon[];
  discounts: VariantDiscount[];
  products: DiscountProduct[];
}
