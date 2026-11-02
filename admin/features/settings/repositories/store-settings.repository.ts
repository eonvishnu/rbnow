import { supabase } from '@/lib/supabase';

export async function fetchStoreSettingsRow() {
  const { data, error } = await supabase.from('store_settings')
    .select('is_store_open, store_name, store_address, store_latitude, store_longitude')
    .eq('id', 'default')
    .single();
  if (error) throw error;
  return data;
}

export async function upsertStoreSettingsRow(input: {
  isStoreOpen: boolean;
  storeName: string;
  storeAddress: string;
  latitude: number;
  longitude: number;
}) {
  const { error } = await supabase.from('store_settings').upsert({
    id: 'default',
    is_store_open: input.isStoreOpen,
    store_name: input.storeName,
    store_address: input.storeAddress,
    store_latitude: input.latitude,
    store_longitude: input.longitude,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}
