import { supabase } from '@/lib/supabase';
import { bannerCategoryOptionSchema, bannerRowSchema } from '../schemas/banner.schema';

export async function listBanners() {
  const { data, error } = await supabase.from('banners').select('*').order('order_index');
  if (error) throw error;
  return bannerRowSchema.array().parse(data);
}

export async function listBannerCategories() {
  const { data, error } = await supabase.from('categories').select('id, name').order('name');
  if (error) throw error;
  return bannerCategoryOptionSchema.array().parse(data);
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
