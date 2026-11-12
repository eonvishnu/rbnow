import { z } from 'zod';

export const bannerRowSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  image_url: z.string(),
  link: z.string().nullable(),
  status: z.string().nullable(),
  order_index: z.number().nullable(),
  created_at: z.string().nullable(),
});

export const bannerCategoryOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  parent_id: z.string().nullable().optional(),
});

export const createBannerSchema = z.object({
  title: z.string().trim().min(1, 'Banner title is required.'),
  imageUrl: z.string().url('Enter a valid image URL.'),
  categoryLink: z.string(),
  order: z.number().int().min(0),
});
