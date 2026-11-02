import {
  createBanner,
  deleteBanner,
  listBannerCategories,
  listBanners,
} from '../repositories/banners.repository';
import { createBannerSchema } from '../schemas/banner.schema';

export async function getBannerWorkspace() {
  const [banners, categories] = await Promise.all([listBanners(), listBannerCategories()]);
  return { banners, categories };
}

export async function createPromoBanner(input: {
  title: string;
  imageUrl: string;
  categoryLink: string;
  order: number;
}) {
  const result = createBannerSchema.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message || 'Banner details are invalid.');
  await createBanner(result.data);
}

export async function removePromoBanner(bannerId: string) {
  await deleteBanner(bannerId);
}
