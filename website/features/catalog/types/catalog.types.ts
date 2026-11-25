export interface SubCategory {
  name: string;
  subSubCategories: string[];
}

export interface Category {
  id: string;
  name: string;
  subCategories: (string | SubCategory)[];
}

export interface ProductVariantOption {
  id: string;
  unit: string;
  price: number;
  originalPrice?: number;
  discountPercent: number;
  stockCount: number;
  sku?: string;
  preorderCampaign?: any | null;
}

export interface CatalogProduct {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  categoryName?: string;
  categoryId?: string;
  isAvailable?: boolean;
  saleMode?: string;
  expectedDispatchDate?: string;
  preorderDescription?: string;
  options: ProductVariantOption[];
  raw: any;
}
