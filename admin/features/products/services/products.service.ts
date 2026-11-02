import {
  createProductRecord,
  deleteProduct,
  listProductCategories,
  listProducts,
  updateProductAvailability,
  updateProductRecord,
  updateVariantPricesAndStock,
  uploadProductImage,
} from '../repositories/products.repository';
import {
  createProductSchema,
  editProductSchema,
  quickVariantUpdateSchema,
} from '../schemas/product.schema';
import type {
  AdminProduct,
  ProductCategory,
  ProductDraft,
  ProductEditDraft,
  ProductVariantQuickUpdate,
} from '../types/product';

export const LOW_STOCK_THRESHOLD = 5;

export async function getProductCatalog(): Promise<{
  products: AdminProduct[];
  categories: ProductCategory[];
}> {
  const [rows, categories] = await Promise.all([listProducts(), listProductCategories()]);

  const products = rows.map((row): AdminProduct => ({
    id: row.id,
    name: row.name || '',
    category_id: row.category_id,
    category: row.category_name,
    description: row.description,
    imageUrl: row.image_url,
    isAvailable: row.is_available !== false,
    variants: (row.product_variants || []).slice().sort((a, b) => a.price - b.price),
  }));

  return { products, categories };
}

export async function getProductCategories() {
  return listProductCategories();
}

export function hasLowStock(product: AdminProduct) {
  return product.variants.some((variant) => Number(variant.stock) < LOW_STOCK_THRESHOLD);
}

export async function setProductAvailability(product: AdminProduct, isAvailable: boolean) {
  if (isAvailable && !product.imageUrl) {
    throw new Error('Add an image before enabling this product.');
  }

  await updateProductAvailability(product.id, isAvailable);
}

export async function saveVariantQuickUpdates(updates: ProductVariantQuickUpdate[]) {
  const results = await updateVariantPricesAndStock(updates);
  return {
    succeededIds: results.filter((result) => !result.error).map((result) => result.id),
    failedCount: results.filter((result) => Boolean(result.error)).length,
  };
}

export async function removeProduct(productId: string) {
  await deleteProduct(productId);
}

export async function createCatalogProduct(input: ProductDraft & {
  variants: Array<{
    unit: string;
    price: number;
    original_price?: number;
    stock: number;
    sku?: string;
  }>;
  imageFile: File | null;
}, categories: ProductCategory[]) {
  const result = createProductSchema.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message || 'Product details are invalid.');
  const parsed = result.data;
  const category = categories.find((candidate) => candidate.name === parsed.category);
  const imageUrl = input.imageFile ? await uploadProductImage(input.imageFile) : '';

  await createProductRecord({
    name: parsed.name,
    categoryId: category?.id ?? null,
    categoryName: parsed.category,
    description: parsed.description,
    imageUrl,
    variants: parsed.variants.map((variant) => ({
      unit: variant.unit,
      price: variant.price,
      original_price: variant.original_price ?? null,
      stock: variant.stock,
      sku: variant.sku || `${parsed.name.toUpperCase().substring(0, 4)}-${variant.unit.toUpperCase()}`,
      is_available: variant.stock > 0,
    })),
  });
}

export async function updateCatalogProduct(draft: ProductEditDraft, categories: ProductCategory[]) {
  const result = editProductSchema.safeParse({
    id: draft.id,
    name: draft.name,
    category: draft.category,
    description: draft.description,
    imageUrl: draft.imageUrl,
    hasNewImage: Boolean(draft.newImageFile),
    removed: draft.removed,
    variants: draft.variants,
  });
  if (!result.success) throw new Error(result.error.issues[0]?.message || 'Product details are invalid.');
  const parsed = result.data;
  const category = categories.find((candidate) => candidate.name === parsed.category);
  const imageUrl = draft.newImageFile ? await uploadProductImage(draft.newImageFile) : parsed.imageUrl;

  await updateProductRecord({
    id: parsed.id,
    name: parsed.name,
    categoryId: category?.id ?? null,
    categoryName: parsed.category,
    description: parsed.description,
    imageUrl,
    removedVariantIds: parsed.removed,
    variants: parsed.variants.map((variant) => ({
      id: variant.id,
      unit: variant.unit,
      price: variant.price,
      stock: variant.stock,
    })),
  });
}

export function parseQuickVariantUpdate(input: {
  id: string;
  price: string;
  stock: string;
}) {
  return quickVariantUpdateSchema.safeParse(input);
}
