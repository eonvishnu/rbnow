import { z } from 'zod';

export const categoryRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  parent_id: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  status: z.union([z.string(), z.boolean(), z.number()]).nullable().optional(),
  order_index: z.number().nullable().optional(),
  created_at: z.string().nullable().optional(),
});

export const categoryNameSchema = z.string().trim().min(1, 'Category name is required.');

export const categoryImageFileSchema = z.custom<File>((value) => value instanceof File)
  .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), 'Use a JPG, PNG or WebP image.')
  .refine((file) => file.size <= 2 * 1024 * 1024, 'Image must be under 2 MB.');
