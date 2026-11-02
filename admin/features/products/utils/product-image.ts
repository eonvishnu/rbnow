import { convertImageToWebp } from '@/lib/image-processing';

export const PRODUCT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const PRODUCT_IMAGE_MAX_SIZE_MB = 5;
export const PRODUCT_IMAGE_MAX_SIZE = PRODUCT_IMAGE_MAX_SIZE_MB * 1024 * 1024;

export function validateProductImage(file: File): string | null {
  if (!PRODUCT_IMAGE_TYPES.includes(file.type)) return 'Use a JPG, PNG or WebP image.';
  if (file.size > PRODUCT_IMAGE_MAX_SIZE) return `Image must be under ${PRODUCT_IMAGE_MAX_SIZE_MB} MB.`;
  return null;
}

export function compressProductImage(file: File, maxWidth = 1000, quality = 0.82): Promise<File> {
  return convertImageToWebp(file, maxWidth, quality, 'product');
}
