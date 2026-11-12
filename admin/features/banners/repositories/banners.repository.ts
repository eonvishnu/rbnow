import { supabase } from '@/lib/supabase';
import { bannerCategoryOptionSchema, bannerRowSchema } from '../schemas/banner.schema';

export async function listBanners() {
  const { data, error } = await supabase.from('banners').select('*').order('order_index');
  if (error) throw error;
  return bannerRowSchema.array().parse(data);
}

export async function listBannerCategories() {
  const { data, error } = await supabase.from('categories').select('id, name, parent_id').order('name');
  if (error) throw error;
  return bannerCategoryOptionSchema.array().parse(data);
}

export async function uploadBannerImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'png';
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
  const filePath = `banner_${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('banners')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('banners').getPublicUrl(filePath);
  return data.publicUrl;
}

export async function createBanner(input: {
  title: string;
  imageUrl: string;
  categoryLink: string;
  order: number;
}) {
  const { error } = await supabase.from('banners').insert({
    title: input.title,
    image_url: input.imageUrl,
    link: input.categoryLink,
    order_index: input.order,
    status: 'active',
  });
  if (error) throw error;
}

export async function deleteBanner(bannerId: string) {
  const { error } = await supabase.from('banners').delete().eq('id', bannerId);
  if (error) throw error;
}
