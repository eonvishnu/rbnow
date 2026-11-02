export interface AdminStoreSettings {
  isStoreOpen: boolean;
  storeName: string;
  storeAddress: string;
  latitude: number | null;
  longitude: number | null;
}

export interface SaveStoreSettingsInput {
  isStoreOpen: boolean;
  storeName: string;
  storeAddress: string;
  latitude: number;
  longitude: number;
}
