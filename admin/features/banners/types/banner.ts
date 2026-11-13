export interface AdminBanner {
  id: string;
  title: string | null;
  image_url: string;
  link: string | null;
  status: string | null;
  order_index: number | null;
  created_at: string | null;
}

export interface BannerCategoryOption {
  id: string;
  name: string;
  parent_id?: string | null;
}
