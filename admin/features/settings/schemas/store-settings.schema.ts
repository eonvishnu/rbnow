import { z } from 'zod';

export const storeSettingsRowSchema = z.object({
  is_store_open: z.boolean().nullable(),
  store_name: z.string().nullable(),
  store_address: z.string().nullable(),
  store_latitude: z.coerce.number().nullable(),
  store_longitude: z.coerce.number().nullable(),
});

export const saveStoreSettingsSchema = z.object({
  isStoreOpen: z.boolean(),
  storeName: z.string(),
  storeAddress: z.string(),
  latitude: z.number().finite(),
  longitude: z.number().finite(),
});
