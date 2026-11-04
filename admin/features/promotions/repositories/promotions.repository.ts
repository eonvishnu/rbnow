import { supabase } from '@/lib/supabase';
import { promotionRows } from '../schemas/promotion.schema';
import type { PromotionWorkspace } from '../types/promotion';

export async function listPromotionWorkspace(): Promise<PromotionWorkspace> {
  const [couponResult, discountResult, productResult] = await Promise.all([
    supabase.from('coupons').select('*').order('created_at', { ascending: false }),
    supabase.from('discounts').select('*, discount_variants(*, product_variants(*, products(*)))').order('created_at', { ascending: false }),
    supabase.from('products').select('*, product_variants(*)').order('name'),
  ]);
  if (couponResult.error) throw couponResult.error;
  if (discountResult.error) throw discountResult.error;
  if (productResult.error) throw productResult.error;

  const couponRows = promotionRows.coupons.parse(couponResult.data);
  return {
    coupons: couponRows.map((coupon) => ({
      id: coupon.id,
      code: coupon.code,
      type: coupon.discount_type === 'percentage' ? 'percentage' : 'fixed',
      value: coupon.discount_value,
      minOrderValue: coupon.min_order_amount || 0,
      maxDiscount: coupon.max_discount_amount ?? undefined,
      isActive: coupon.is_active,
      expiresAt: coupon.expiry_date ?? undefined,
    })),
    discounts: promotionRows.discounts.parse(discountResult.data).map((discount) => ({
      ...discount,
      discount_variants: discount.discount_variants || [],
    })),
    products: promotionRows.products.parse(productResult.data),
  };
}

export async function insertCoupon(input: {
  code: string;
  type: 'fixed' | 'percentage';
  value: number;
  minOrderValue: number;
  maxDiscount: number | null;
  expiryDate: string | null;
}) {
  const { error } = await supabase.from('coupons').insert({
    code: input.code,
    discount_type: input.type,
    discount_value: input.value,
    min_order_amount: input.minOrderValue || 0,
    max_discount_amount: input.maxDiscount || null,
    is_active: true,
    expiry_date: input.expiryDate && input.expiryDate.trim() !== '' ? input.expiryDate : null,
  });
  if (error) throw error;
}

export async function insertVariantDiscount(input: {
  name: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  variantId: string;
}) {
  const { data, error } = await supabase.from('discounts').insert({
    name: input.name || 'Variant Special Offer',
    discount_type: input.type,
    discount_value: input.value,
    is_active: true,
  }).select('id').single();
  if (error) throw error;
  const { error: linkError } = await supabase.from('discount_variants').insert({
    discount_id: data.id,
    variant_id: input.variantId,
  });
  if (linkError) throw linkError;
}

export async function updateCouponStatus(id: string, isActive: boolean) {
  const { error } = await supabase.from('coupons').update({ is_active: isActive }).eq('id', id);
  if (error) throw error;
}

export async function removeCoupon(id: string) {
  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (error) throw error;
}

export async function removeVariantDiscount(id: string) {
  const { error } = await supabase.from('discounts').delete().eq('id', id);
  if (error) throw error;
}
