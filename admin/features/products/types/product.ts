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
  sale_mode: 'regular' | 'preorder';
  expected_dispatch_date: string | null;
  preorder_limit: number | null;
  preorder_description: string | null;
  variants: ProductVariant[];
}

export interface ProductCategory {
  id: string;
  name: string;
  parent_id: string | null;
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
  sale_mode?: 'regular' | 'preorder';
  expected_dispatch_date?: string;
  preorder_limit?: number | null;
  preorder_description?: string | null;
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
  sale_mode: 'regular' | 'preorder';
  expected_dispatch_date: string;
  preorder_limit: string;
  preorder_description: string;
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
