import { supabase } from '@/lib/supabase';
import { categoryRowSchema } from '../schemas/category.schema';
import type { CategoryStatus } from '../types/category';

export async function listCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return categoryRowSchema.array().parse(data);
}

export async function uploadCategoryImage(file: File) {
  const extension = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${extension}`;
  const { error } = await supabase.storage.from('categories').upload(fileName, file);
  if (error) throw error;
  return supabase.storage.from('categories').getPublicUrl(fileName).data.publicUrl;
}

export async function createCategory(name: string, imageUrl: string, parentId?: string | null) {
  const { error } = await supabase.from('categories').insert({ name, image_url: imageUrl, parent_id: parentId || null });
  if (error) throw error;
}

export async function updateCategoryImage(categoryId: string, imageUrl: string) {
  const { error } = await supabase.from('categories').update({ image_url: imageUrl }).eq('id', categoryId);
  if (error) throw error;
}

export async function updateCategoryStatus(categoryId: string, status: CategoryStatus) {
  const { error } = await supabase.from('categories').update({ status }).eq('id', categoryId);
  if (error) throw error;
}

export async function deleteCategory(categoryId: string) {
  const { error } = await supabase.from('categories').delete().eq('id', categoryId);
  if (error) throw error;
}
