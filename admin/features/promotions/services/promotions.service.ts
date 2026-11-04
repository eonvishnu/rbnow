import {
  insertCoupon,
  insertVariantDiscount,
  listPromotionWorkspace,
  removeCoupon,
  removeVariantDiscount,
  updateCouponStatus,
} from '../repositories/promotions.repository';
import {
  createCouponSchema,
  createVariantDiscountSchema,
} from '../schemas/promotion.schema';

export { listPromotionWorkspace };

export async function createPromoCoupon(input: {
  code: string;
  type: 'fixed' | 'percentage';
  value: string;
  minOrderValue: string;
  maxDiscount: string;
  expiryDate: string;
}) {
  const result = createCouponSchema.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message || 'Coupon details are invalid.');
  const data = result.data;
  let parsedExpiry: string | null = null;
  if (data.expiryDate && String(data.expiryDate).trim() !== '') {
    try {
      const d = new Date(data.expiryDate);
      if (!isNaN(d.getTime())) {
        parsedExpiry = d.toISOString();
      }
    } catch {
      parsedExpiry = null;
    }
  }

  await insertCoupon({
    code: data.code,
    type: data.type,
    value: data.value,
    minOrderValue: data.minOrderValue,
    maxDiscount: data.maxDiscount,
    expiryDate: parsedExpiry,
  });
}

export async function createDiscountForVariant(input: {
  name: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  selectedVariantId: string;
}) {
  const result = createVariantDiscountSchema.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message || 'Discount details are invalid.');
  const data = result.data;
  await insertVariantDiscount({
    name: data.name,
    type: data.type,
    value: data.value,
    variantId: data.selectedVariantId,
  });
}

export async function togglePromoCoupon(id: string, currentStatus: boolean) {
  await updateCouponStatus(id, !currentStatus);
}

export async function deletePromoCoupon(id: string) {
  await removeCoupon(id);
}

export async function deleteVariantDiscount(id: string) {
  await removeVariantDiscount(id);
}
