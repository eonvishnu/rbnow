import { supabase } from '@/lib/supabase';
import { preorderRows } from '../schemas/preorder.schema';
import type { PreorderCampaign } from '../types/preorder';

export async function listPreorderWorkspace() {
  const [campaignResult, productResult] = await Promise.all([
    supabase.from('preorder_campaigns')
      .select('*, product_variants(*, products(*))')
      .order('created_at', { ascending: false }),
    supabase.from('products').select('id, name, product_variants(id, unit, price, stock)').order('name'),
  ]);
  if (campaignResult.error) throw campaignResult.error;
  if (productResult.error) throw productResult.error;
  return {
    campaigns: preorderRows.campaigns.parse(campaignResult.data),
    products: preorderRows.products.parse(productResult.data),
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
  const { error } = await supabase.from('preorder_campaigns').insert({
    name: input.name || 'Special Harvest Pre-Order',
    product_id: input.productId,
    product_variant_id: input.variantId,
    status: 'active',
    expected_available_at: new Date(input.expectedDate).toISOString(),
    max_quantity: input.maxQuantity,
    reserved_quantity: 0,
    price: input.price,
  });
  if (error) throw error;
}

export async function fulfillPreorderCampaign(campaignId: string, variantId: string, reservedQty: number) {
  const { error: campaignError } = await supabase.from('preorder_campaigns')
    .update({ status: 'fulfilled', updated_at: new Date().toISOString() })
    .eq('id', campaignId);
  if (campaignError) throw campaignError;

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

export function getCampaignVariant(campaign: PreorderCampaign) {
  return campaign.product_variants;
}
