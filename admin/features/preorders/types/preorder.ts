export interface PreorderProductVariant {
  id: string;
  unit: string;
  price: number;
  stock?: number | null;
}

export interface PreorderProduct {
  id: string;
  name: string;
  product_variants: PreorderProductVariant[] | null;
}

export interface PreorderCampaign {
  id: string;
  name: string;
  product_variant_id: string;
  status: string;
  expected_available_at: string;
  max_quantity: number;
  reserved_quantity: number;
  price: number;
  product_variants: (PreorderProductVariant & {
    products: { name: string; image_url: string | null } | null;
  }) | null;
}
