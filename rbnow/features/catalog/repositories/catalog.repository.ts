import { supabase } from '@/lib/supabase';

export async function fetchCategoriesFromDb() {
  return await supabase
    .from("categories")
    .select("*")
    .or("status.eq.active,status.is.null,is_active.eq.true")
    .order("name", { ascending: true });
}

export async function fetchPreorderProductsFromDb() {
  return await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("sale_mode", "preorder")
    .eq("is_available", true);
}

export async function fetchActiveDiscountsFromDb() {
  return await supabase
    .from("discounts")
    .select("*, discount_variants(*)")
    .eq("is_active", true);
}

export async function fetchSubCategoriesFromDb(parentId: string) {
  return await supabase
    .from("categories")
    .select("id, name")
    .eq("parent_id", parentId)
    .or("status.eq.active,status.is.null,is_active.eq.true");
}
