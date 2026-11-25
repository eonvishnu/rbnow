import { supabase } from '@/lib/supabase';
import {
  catalogProductRowSchema,
  productCategoryRowSchema,
} from '../schemas/product.schema';
import type {
  ProductCategory,
  ProductVariantQuickUpdate,
} from '../types/product';

export async function listProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, category_id, category_name, description, image_url, is_available, sale_mode, expected_dispatch_date, preorder_limit, preorder_description, product_variants(id, product_id, unit, price, original_price, stock, sku, is_available)')
    .order('name');

  if (error) throw error;

  return catalogProductRowSchema.array().parse(data);
}

export async function listProductCategories(): Promise<ProductCategory[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, parent_id')
    .order('name');

  if (error) throw error;

  return productCategoryRowSchema.array().parse(data);
}

export async function updateProductAvailability(productId: string, isAvailable: boolean) {
  const { data: { session } } = await supabase.auth.getSession();
  const adminId = session?.user?.id;

  const { error } = await supabase
    .from('products')
    .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
    .eq('id', productId);

  if (error) throw error;

  if (adminId) {
    try {
      await supabase.from('admin_audit_logs').insert({
        admin_id: adminId,
        action: 'UPDATE_PRODUCT_AVAILABILITY',
        details: `Updated product availability (ID: ${productId}) to ${isAvailable ? 'Active' : 'Disabled'}`,
        created_at: new Date().toISOString(),
      });
    } catch (e: any) {
      console.warn('Audit log write warning:', e?.message || e);
    }
  }
}

export async function updateVariantPricesAndStock(updates: ProductVariantQuickUpdate[]) {
  const { data: { session } } = await supabase.auth.getSession();
  const adminId = session?.user?.id;

  const results = await Promise.all(updates.map(async (update) => {
    const { error } = await supabase
      .from('product_variants')
      .update({
        price: update.price,
        stock: update.stock,
        is_available: update.stock > 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', update.id);

    return { id: update.id, error };
  }));

  if (adminId) {
    try {
      await supabase.from('admin_audit_logs').insert({
        admin_id: adminId,
        action: 'UPDATE_STOCK',
        details: `Updated stock and pricing for ${updates.length} variant(s)`,
        created_at: new Date().toISOString(),
      });
    } catch (e: any) {
      console.warn('Audit log write warning:', e?.message || e);
    }
  }

  return results;
}

export async function deleteProduct(productId: string) {
  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) throw error;
}

export async function uploadProductImage(file: File) {
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.webp`;
  const { error } = await supabase.storage
    .from('products')
    .upload(fileName, file, { contentType: 'image/webp' });

  if (error) throw error;

  return supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl;
}

export async function createProductRecord(input: {
  name: string;
  categoryId: string | null;
  categoryName: string;
  description: string;
  imageUrl: string;
  sale_mode?: string;
  expected_dispatch_date?: string | null;
  preorder_limit?: number | null;
  preorder_description?: string | null;
  variants: Array<{
    unit: string;
    price: number;
    original_price: number | null;
    stock: number;
    sku: string;
    is_available: boolean;
  }>;
}) {
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      name: input.name,
      category_id: input.categoryId,
      category_name: input.categoryName,
      description: input.description,
      image_url: input.imageUrl,
      is_available: true,
      sale_mode: input.sale_mode || 'regular',
      expected_dispatch_date: input.expected_dispatch_date || null,
      preorder_limit: input.preorder_limit || null,
      preorder_description: input.preorder_description || null,
    })
    .select('id')
    .single();

  if (productError) throw productError;

  const { error: variantsError } = await supabase.from('product_variants').insert(
    input.variants.map((variant) => ({
      ...variant,
      product_id: product.id,
    })),
  );

  if (variantsError) throw variantsError;
}

export async function updateProductRecord(input: {
  id: string;
  name: string;
  categoryId: string | null;
  categoryName: string;
  description: string;
  imageUrl: string;
  sale_mode?: string;
  expected_dispatch_date?: string | null;
  preorder_limit?: number | null;
  preorder_description?: string | null;
  removedVariantIds: string[];
  variants: Array<{
    id: string;
    unit: string;
    price: number;
    stock: number;
  }>;
}) {
  const now = new Date().toISOString();
  const { error: productError } = await supabase
    .from('products')
    .update({
      name: input.name,
      category_name: input.categoryName,
      category_id: input.categoryId,
      description: input.description,
      image_url: input.imageUrl,
      sale_mode: input.sale_mode || 'regular',
      expected_dispatch_date: input.expected_dispatch_date || null,
      preorder_limit: input.preorder_limit || null,
      preorder_description: input.preorder_description || null,
      updated_at: now,
    })
    .eq('id', input.id);

  if (productError) throw productError;

  if (input.removedVariantIds.length > 0) {
    const { error } = await supabase
      .from('product_variants')
      .delete()
      .in('id', input.removedVariantIds);
    if (error) throw error;
  }

  for (const variant of input.variants) {
    const row = {
      unit: variant.unit,
      price: variant.price,
      stock: variant.stock,
      is_available: variant.stock > 0,
      updated_at: now,
    };
    const isNew = variant.id.startsWith('temp_');
    const { error } = isNew
      ? await supabase.from('product_variants').insert({ product_id: input.id, ...row })
      : await supabase.from('product_variants').update(row).eq('id', variant.id);

    if (error) throw error;
  }
}
