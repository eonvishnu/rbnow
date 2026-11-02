import { fetchStoreSettingsRow, upsertStoreSettingsRow } from '../repositories/store-settings.repository';
import { saveStoreSettingsSchema, storeSettingsRowSchema } from '../schemas/store-settings.schema';
import type { AdminStoreSettings, SaveStoreSettingsInput } from '../types/store-settings';

export async function getAdminStoreSettings(): Promise<AdminStoreSettings> {
  const row = storeSettingsRowSchema.parse(await fetchStoreSettingsRow());
  return {
    isStoreOpen: row.is_store_open ?? true,
    storeName: row.store_name || 'Royal Bengal',
    storeAddress: row.store_address || 'Madhapur, Hyderabad',
    latitude: row.store_latitude,
    longitude: row.store_longitude,
  };
}

export async function saveAdminStoreSettings(input: SaveStoreSettingsInput) {
  const validatedInput = saveStoreSettingsSchema.parse(input);
  await upsertStoreSettingsRow(validatedInput);
}
