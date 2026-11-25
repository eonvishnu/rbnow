import { supabase } from '@/lib/supabase';

export async function listPreorderWorkspace() {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('sale_mode', 'preorder')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const campaigns = (data || []).map(p => ({
    id: p.id,
    name: p.name,
    product_id: p.id,
    product_variant_id: p.product_variants?.[0]?.id,
    status: p.is_available ? 'active' : 'fulfilled',
    expected_available_at: p.expected_dispatch_date,
    max_quantity: p.preorder_limit || 100,
    reserved_quantity: p.product_variants?.[0]?.preorder_reserved_qty || 0,
    price: p.product_variants?.[0]?.price || 0,
    product_variants: p.product_variants?.[0],
    products: p,
  }));

  return {
    campaigns,
    products: data || [],
  };
}

export async function insertPreorderCampaign(input: {
  name: string;
  productId: string;
  variantId: string;
  price: number;
  maxQuantity: number;
  expectedDate: string;
}) {
  const { error } = await supabase.from('products')
    .update({
      sale_mode: 'preorder',
      expected_dispatch_date: input.expectedDate,
      preorder_limit: input.maxQuantity,
      updated_at: new Date().toISOString(),
    })
    .eq('id', input.productId);
  if (error) throw error;
}

export async function fulfillPreorderCampaign(productId: string, variantId: string, reservedQty: number) {
  const { error: prodErr } = await supabase.from('products')
    .update({ is_available: false, updated_at: new Date().toISOString() })
    .eq('id', productId);
  if (prodErr) throw prodErr;

  const { data: variant, error: variantError } = await supabase.from('product_variants')
    .select('stock')
    .eq('id', variantId)
    .single();
  if (variantError) throw variantError;
  if (variant) {
    const { error } = await supabase.from('product_variants')
      .update({ stock: (variant.stock || 0) + reservedQty, is_available: true })
      .eq('id', variantId);
    if (error) throw error;
  }
}

export function getCampaignVariant(campaign: any) {
  return campaign.product_variants;
}
