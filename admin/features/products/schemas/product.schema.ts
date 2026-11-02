import { z } from 'zod';

const productVariantInputSchema = z.object({
  unit: z.string().trim().min(1, 'Variant unit is required.'),
  price: z.coerce.number().finite().min(0, 'Price must be zero or more.'),
  original_price: z.coerce.number().finite().min(0).optional(),
  stock: z.coerce.number().int().min(0, 'Stock must be a whole number, zero or more.'),
  sku: z.string().optional(),
});

export const createProductSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required.'),
  category: z.string().trim().min(1, 'Choose a category.'),
  description: z.string(),
  variants: z.array(productVariantInputSchema).min(1, 'At least one product variant is required.'),
});

export const editProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, 'Product name is required.'),
  category: z.string().trim().min(1, 'Choose a category.'),
  description: z.string(),
  imageUrl: z.string(),
  hasNewImage: z.boolean(),
  removed: z.array(z.string()),
  variants: z.array(z.object({
    id: z.string(),
    unit: z.string().trim().min(1, 'Variant unit is required.'),
    price: z.string().trim().min(1).refine((value) => Number.isFinite(Number(value)) && Number(value) >= 0, 'Enter a valid price.')
      .transform(Number)
      .pipe(z.number().finite().min(0, 'Price must be zero or more.')),
    stock: z.string().trim().min(1).refine((value) => Number.isInteger(Number(value)) && Number(value) >= 0, 'Stock must be a whole number, zero or more.')
      .transform(Number).pipe(z.number().int().min(0)),
  })).min(1, 'At least one variant is required.'),
}).refine((product) => Boolean(product.imageUrl || product.hasNewImage), {
  message: 'A product image is required.',
  path: ['imageUrl'],
});

export const quickVariantUpdateSchema = z.object({
  id: z.string().min(1),
  price: z.string().trim().min(1, 'Price is required.')
    .refine((value) => Number.isFinite(Number(value)) && Number(value) >= 0, 'Enter a valid price.')
    .transform(Number).pipe(z.number().finite().min(0, 'Price must be zero or more.')),
  stock: z.string().trim().min(1, 'Stock is required.')
    .refine((value) => Number.isInteger(Number(value)) && Number(value) >= 0, 'Stock must be a whole number, zero or more.')
    .transform(Number).pipe(z.number().int().min(0)),
});

export const productCategoryRowSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const productVariantRowSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  unit: z.string(),
  price: z.coerce.number(),
  original_price: z.coerce.number().nullable(),
  stock: z.coerce.number().nullable(),
  sku: z.string().nullable(),
  is_available: z.boolean().nullable(),
});

export const catalogProductRowSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  category_id: z.string().nullable(),
  category_name: z.string().nullable(),
  description: z.string().nullable(),
  image_url: z.string().nullable(),
  is_available: z.boolean().nullable(),
  product_variants: z.array(productVariantRowSchema).nullable(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type EditProductInput = z.infer<typeof editProductSchema>;
