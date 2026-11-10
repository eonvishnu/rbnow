import { supabase } from '@/lib/supabase';
import type { DeliverySettings, DeliveryFeeRule } from '../types/delivery';

export async function fetchCleanDeliverySettings() {
  const { data, error } = await supabase
    .from('delivery_settings')
    .select('*')
    .eq('id', 'default')
    .maybeSingle();

  if (error) {
    console.warn('Error fetching clean delivery_settings:', error.message);
  }

  return data || {
    id: 'default',
    is_free_delivery_enabled: true,
    delivery_mode: 'preset_rules',
    flat_delivery_fee: 65,
    preset_zone_radius_km: 5,
    preset_zone1_subtotal: 299,
    preset_zone1_fee: 30,
    preset_zone2_subtotal: 499,
    preset_zone2_fee: 30,
    tier1_max_km: 5,
    tier1_subtotal: 299,
    tier1_fee: 30,
    tier2_max_km: 10,
    tier2_subtotal: 500,
    tier2_fee: 30,
    tier3_subtotal: 699,
    tier3_fee: 30,
  };
}

export async function saveCleanDeliverySettings(settings: any) {
  const { error } = await supabase
    .from('delivery_settings')
    .upsert({
      id: 'default',
      is_free_delivery_enabled: settings.is_free_delivery_enabled ?? true,
      delivery_mode: settings.delivery_mode || 'preset_rules',
      flat_delivery_fee: Number(settings.flat_delivery_fee || 65),
      preset_zone_radius_km: Number(settings.preset_zone_radius_km || 5),
      preset_zone1_subtotal: Number(settings.preset_zone1_subtotal || 299),
      preset_zone1_fee: Number(settings.preset_zone1_fee || 30),
      preset_zone2_subtotal: Number(settings.preset_zone2_subtotal || 499),
      preset_zone2_fee: Number(settings.preset_zone2_fee || 30),
      tier1_max_km: Number(settings.tier1_max_km || 5),
      tier1_subtotal: Number(settings.tier1_subtotal || 299),
      tier1_fee: Number(settings.tier1_fee || 30),
      tier2_max_km: Number(settings.tier2_max_km || 10),
      tier2_subtotal: Number(settings.tier2_subtotal || 500),
      tier2_fee: Number(settings.tier2_fee || 30),
      tier3_subtotal: Number(settings.tier3_subtotal || 699),
      tier3_fee: Number(settings.tier3_fee || 30),
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;
}

export async function fetchDeliverySettingsRow(): Promise<DeliverySettings> {
  const data = await fetchCleanDeliverySettings();
  return {
    id: data?.id,
    storeLatitude: Number(data?.store_latitude ?? 17.351452),
    storeLongitude: Number(data?.store_longitude ?? 78.391039),
    deliveryPricingMode: (data?.delivery_pricing_mode as any) || 'rules',
  };
}

export async function saveDeliverySettingsRow(input: DeliverySettings): Promise<void> {
  const payload = {
    id: 'default',
    store_latitude: input.storeLatitude,
    store_longitude: input.storeLongitude,
    delivery_pricing_mode: input.deliveryPricingMode,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('delivery_settings')
    .upsert(payload);

  if (error) throw error;
}

export async function fetchDeliveryFeeRulesList(): Promise<DeliveryFeeRule[]> {
  try {
    const { data, error } = await supabase
      .from('delivery_fee_rules')
      .select('*')
      .order('priority', { ascending: true });

    if (error || !data) return [];

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
  } catch (err) {
    return [];
  }
}

export async function upsertDeliveryFeeRuleRecord(rule: Partial<DeliveryFeeRule> & { name: string }): Promise<void> {
  try {
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
      await supabase.from('delivery_fee_rules').update(payload).eq('id', rule.id);
    } else {
      await supabase.from('delivery_fee_rules').insert(payload);
    }
  } catch (err) {
    console.warn("Delivery fee rule upsert notice:", err);
  }
}

export async function deleteDeliveryFeeRuleRecord(ruleId: string): Promise<void> {
  try {
    await supabase.from('delivery_fee_rules').delete().eq('id', ruleId);
  } catch (err) {
    console.warn("Delivery fee rule delete notice:", err);
  }
}
