export interface DeliverySettings {
  id?: string;
  storeLatitude: number;
  storeLongitude: number;
  deliveryPricingMode: 'always_free' | 'rules' | 'distance_based';
}

export interface DeliveryFeeRule {
  id: string;
  name: string;
  minDistanceKm: number;
  maxDistanceKm: number | null;
  minOrderAmount: number;
  maxOrderAmount: number | null;
  minCheckoutSubtotal: number;
  feeType: 'free' | 'fixed' | 'per_km';
  feeAmount: number;
  priority: number;
  isActive: boolean;
}
