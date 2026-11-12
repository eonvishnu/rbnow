import {
  createBanner,
  deleteBanner,
  listBannerCategories,
  listBanners,
  uploadBannerImage,
} from '../repositories/banners.repository';
import { createBannerSchema } from '../schemas/banner.schema';

export async function getBannerWorkspace() {
  const [banners, categories] = await Promise.all([listBanners(), listBannerCategories()]);
  return { banners, categories };
}

export async function createPromoBannerWithImage(input: {
  title: string;
  imageFile: File;
  categoryLink: string;
  order: number;
}) {
  const imageUrl = await uploadBannerImage(input.imageFile);
  const result = createBannerSchema.safeParse({
    title: input.title,
    imageUrl,
    categoryLink: input.categoryLink,
    order: input.order,
  });
  if (!result.success) throw new Error(result.error.issues[0]?.message || 'Banner details are invalid.');
  await createBanner(result.data);
}

export async function removePromoBanner(bannerId: string) {
  await deleteBanner(bannerId);
}
