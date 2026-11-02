export interface ProductVariant {
  id: string;
  product_id: string;
  unit: string;
  price: number;
  original_price: number | null;
  stock: number | null;
  sku: string | null;
  is_available: boolean | null;
}

export interface AdminProduct {
  id: string;
  name: string;
  category_id: string | null;
  category: string | null;
  description: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
  variants: ProductVariant[];
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface ProductVariantInput {
  unit: string;
  price: number;
  original_price?: number;
  stock: number;
  sku?: string;
}

export interface ProductDraft {
  name: string;
  category: string;
  description: string;
}

export interface EditableProductVariant {
  id: string;
  unit: string;
  price: string;
  stock: string;
}

export interface ProductEditDraft {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  newImageFile: File | null;
  newImagePreview: string;
  removed: string[];
  variants: EditableProductVariant[];
}

export interface ProductVariantQuickUpdate {
  id: string;
  price: number;
  stock: number;
}
