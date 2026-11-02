import { supabase } from '@/lib/supabase';
import type { DeliverySettings, DeliveryFeeRule } from '../types/delivery';

export async function fetchDeliverySettingsRow(): Promise<DeliverySettings> {
  const { data, error } = await supabase
    .from('delivery_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn('Error fetching delivery_settings:', error.message);
  }

  return {
    id: data?.id,
    storeLatitude: Number(data?.store_latitude ?? 17.351452),
    storeLongitude: Number(data?.store_longitude ?? 78.391039),
    deliveryPricingMode: (data?.delivery_pricing_mode as any) || 'rules',
  };
}

export async function saveDeliverySettingsRow(input: DeliverySettings): Promise<void> {
  const payload = {
    store_latitude: input.storeLatitude,
    store_longitude: input.storeLongitude,
    delivery_pricing_mode: input.deliveryPricingMode,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    const { error } = await supabase
      .from('delivery_settings')
      .update(payload)
      .eq('id', input.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('delivery_settings')
      .upsert(payload);
    if (error) throw error;
  }
}

export async function fetchDeliveryFeeRulesList(): Promise<DeliveryFeeRule[]> {
  const { data, error } = await supabase
    .from('delivery_fee_rules')
    .select('*')
    .order('priority', { ascending: true });

  if (error) {
    console.warn('Error fetching delivery_fee_rules:', error.message);
    return [];
  }

  return (data || []).map(r => ({
    id: r.id,
    name: r.name,
    minDistanceKm: Number(r.min_distance_km || 0),
    maxDistanceKm: r.max_distance_km != null ? Number(r.max_distance_km) : null,
    minOrderAmount: Number(r.min_order_amount || 0),
    maxOrderAmount: r.max_order_amount != null ? Number(r.max_order_amount) : null,
    minCheckoutSubtotal: Number(r.min_checkout_subtotal || 0),
    feeType: r.fee_type || 'free',
    feeAmount: Number(r.fee_amount || 0),
    priority: Number(r.priority || 1),
    isActive: Boolean(r.is_active ?? true),
  }));
}

export async function upsertDeliveryFeeRuleRecord(rule: Partial<DeliveryFeeRule> & { name: string }): Promise<void> {
  const payload = {
    name: rule.name,
    min_distance_km: rule.minDistanceKm ?? 0,
    max_distance_km: rule.maxDistanceKm,
    min_order_amount: rule.minOrderAmount ?? 0,
    max_order_amount: rule.maxOrderAmount,
    min_checkout_subtotal: rule.minCheckoutSubtotal ?? 0,
    fee_type: rule.feeType || 'free',
    fee_amount: rule.feeAmount ?? 0,
    priority: rule.priority ?? 1,
    is_active: rule.isActive ?? true,
    updated_at: new Date().toISOString(),
  };

  if (rule.id) {
    const { error } = await supabase
      .from('delivery_fee_rules')
      .update(payload)
      .eq('id', rule.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('delivery_fee_rules')
      .insert(payload);
    if (error) throw error;
  }
}

export async function deleteDeliveryFeeRuleRecord(ruleId: string): Promise<void> {
  const { error } = await supabase
    .from('delivery_fee_rules')
    .delete()
    .eq('id', ruleId);

  if (error) throw error;
}
