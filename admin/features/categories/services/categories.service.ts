import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategoryImage,
  updateCategoryStatus,
  uploadCategoryImage,
} from '../repositories/categories.repository';
import {
  categoryImageFileSchema,
  categoryNameSchema,
} from '../schemas/category.schema';
import { convertImageToWebp } from '@/lib/image-processing';
import type { AdminCategory, CategoryStatusValues } from '../types/category';

const OFF_WORDS = ['inactive', 'disabled', 'disable', 'hidden', 'draft', 'archived', 'off', 'false', '0'];
const DEFAULT_ON = 'active';
const DEFAULT_OFF = 'inactive';
const CATEGORY_IMAGE_MAX_DIMENSION = 512;
const CATEGORY_IMAGE_QUALITY = 0.75;

export function isCategoryEnabled(category: AdminCategory) {
  const value = category.status;
  if (value === false || value === 0) return false;
  return typeof value === 'string' ? !OFF_WORDS.includes(value.trim().toLowerCase()) : true;
}

export function learnCategoryStatusValues(categories: AdminCategory[]): CategoryStatusValues {
  if (categories.some((category) => typeof category.status === 'boolean')) return { on: true, off: false };
  const strings = categories
    .map((category) => category.status)
    .filter((status): status is string => typeof status === 'string' && status.trim() !== '');
  const off = strings.find((status) => OFF_WORDS.includes(status.trim().toLowerCase()));
  const on = strings.find((status) => !OFF_WORDS.includes(status.trim().toLowerCase()));
  return { on: on ?? DEFAULT_ON, off: off ?? DEFAULT_OFF };
}

export async function createCategoryWithImage(nameInput: string, file: File, parentId?: string | null) {
  const nameResult = categoryNameSchema.safeParse(nameInput);
  if (!nameResult.success) throw new Error(nameResult.error.issues[0]?.message);
  const fileResult = categoryImageFileSchema.safeParse(file);
  if (!fileResult.success) throw new Error(fileResult.error.issues[0]?.message);
  const imageUrl = await uploadCategoryImage(await convertImageToWebp(fileResult.data, CATEGORY_IMAGE_MAX_DIMENSION, CATEGORY_IMAGE_QUALITY, 'category'));
  await createCategory(nameResult.data, imageUrl, parentId);
}

export async function replaceCategoryImage(categoryId: string, file: File) {
  const fileResult = categoryImageFileSchema.safeParse(file);
  if (!fileResult.success) throw new Error(fileResult.error.issues[0]?.message);
  const imageUrl = await uploadCategoryImage(await convertImageToWebp(fileResult.data, CATEGORY_IMAGE_MAX_DIMENSION, CATEGORY_IMAGE_QUALITY, 'category'));
  await updateCategoryImage(categoryId, imageUrl);
  return imageUrl;
}

export async function setCategoryEnabled(category: AdminCategory, enabled: boolean, values: CategoryStatusValues) {
  if (enabled && !category.image_url) throw new Error('Add an image before enabling this category.');
  await updateCategoryStatus(category.id, enabled ? values.on : values.off);
}

export async function removeCategory(categoryId: string) {
  await deleteCategory(categoryId);
}

export { listCategories };
