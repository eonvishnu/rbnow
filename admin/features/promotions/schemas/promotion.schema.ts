import { z } from 'zod';

const couponRowSchema = z.object({
  id: z.string(),
  code: z.string(),
  discount_type: z.string(),
  discount_value: z.coerce.number(),
  min_order_amount: z.coerce.number().nullable().optional(),
  max_discount_amount: z.coerce.number().nullable().optional(),
  is_active: z.boolean(),
  is_first_order_only: z.boolean().nullable().optional(),
  expiry_date: z.string().nullable().optional(),
});

const discountRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  discount_type: z.string(),
  discount_value: z.coerce.number(),
  is_active: z.boolean(),
  discount_variants: z.array(z.unknown()).nullable().optional(),
});

const productRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  product_variants: z.array(z.object({
    id: z.string(),
    unit: z.string(),
    price: z.coerce.number(),
  })).nullable(),
});

export const createCouponSchema = z.object({
  code: z.string().trim().min(1, 'Code is required.').transform((value) => value.toUpperCase().replace(/\s/g, '')),
  type: z.enum(['fixed', 'percentage']),
  value: z.string().trim().min(1, 'Value is required.').refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, 'Enter a positive discount value.').transform(Number),
  minOrderValue: z.string().trim().optional().nullable().transform((value) => value ? Number(value) || 0 : 0),
  maxDiscount: z.string().trim().optional().nullable().transform((value) => value ? Number(value) || null : null),
  isFirstOrderOnly: z.boolean().optional().default(false),
  expiryDate: z.string().optional().nullable().transform((val) => (val && val.trim() !== '' ? val : null)),
});

export const createVariantDiscountSchema = z.object({
  name: z.string(),
  type: z.enum(['percentage', 'fixed_amount']),
  value: z.number().finite().positive(),
  selectedVariantId: z.string().min(1, 'Please select a product variant.'),
});

export const promotionRows = {
  coupons: z.array(couponRowSchema),
  discounts: z.array(discountRowSchema),
  products: z.array(productRowSchema),
};
