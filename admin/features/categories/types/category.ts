export type CategoryStatus = string | boolean | number | null;

export interface AdminCategory {
  id: string;
  name: string;
  parent_id?: string | null;
  image_url?: string | null;
  status?: CategoryStatus;
  order_index?: number | null;
  created_at?: string | null;
}

export interface CategoryStatusValues {
  on: CategoryStatus;
  off: CategoryStatus;
}
