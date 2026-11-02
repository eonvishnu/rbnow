import { z } from 'zod';

const productVariantSchema = z.object({
  id: z.string(),
  unit: z.string(),
  price: z.coerce.number(),
  stock: z.coerce.number().nullable().optional(),
});

export const preorderRows = {
  campaigns: z.array(z.object({
    id: z.string(),
    name: z.string(),
    product_variant_id: z.string(),
    status: z.string(),
    expected_available_at: z.string(),
    max_quantity: z.coerce.number(),
    reserved_quantity: z.coerce.number(),
    price: z.coerce.number(),
    product_variants: productVariantSchema.extend({
      products: z.object({ name: z.string(), image_url: z.string().nullable() }).nullable(),
    }).nullable(),
  })),
  products: z.array(z.object({
    id: z.string(),
    name: z.string(),
    product_variants: z.array(productVariantSchema).nullable(),
  })),
};

export const createPreorderSchema = z.object({
  name: z.string(),
  productId: z.string().min(1),
  variantId: z.string().min(1, 'Please select a valid product variant.'),
  price: z.number().finite().min(0),
  maxQuantity: z.number().int().positive(),
  expectedDate: z.string().min(1, 'Please set expected availability date.'),
});
