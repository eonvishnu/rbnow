"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/lib/supabase';

export interface LocationData {
  id?: string;
  label: string;
  address: string;
  houseNumber?: string;
  area?: string;
  city: string;
  pincode: string;
  lat?: number;
  lng?: number;
}

interface LocationContextType {
  location: LocationData;
  setLocation: (loc: LocationData) => void;
  savedAddresses: LocationData[];
  isDetectingGPS: boolean;
  detectGPSLocation: () => Promise<LocationData | null>;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  refreshSavedAddresses: () => Promise<void>;
}

const defaultLocation: LocationData = {
  label: 'Select Location',
  address: 'Tap to select delivery address',
  city: '',
  pincode: '',
};

const LocationContext = createContext<LocationContextType>({
  location: defaultLocation,
  setLocation: () => {},
  savedAddresses: [],
  isDetectingGPS: false,
  detectGPSLocation: async () => null,
  isModalOpen: false,
  setIsModalOpen: () => {},
  refreshSavedAddresses: async () => {},
});

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [location, setLocationState] = useState<LocationData>(defaultLocation);
  const [savedAddresses, setSavedAddresses] = useState<LocationData[]>([]);
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load stored location from localStorage only if user is logged in
  useEffect(() => {
    try {
      const saved = localStorage.getItem('royal_bengal_active_location');
      if (saved && user) {
        setLocationState(JSON.parse(saved));
      } else {
        setLocationState(defaultLocation);
        localStorage.removeItem('royal_bengal_active_location');
      }
    } catch (err) {
      console.error('Error loading location from storage:', err);
    }
  }, [user]);

  const setLocation = (loc: LocationData) => {
    setLocationState(loc);
    if (user) {
      try {
        localStorage.setItem('royal_bengal_active_location', JSON.stringify(loc));
      } catch (err) {
        console.error('Error saving location to storage:', err);
      }
    }
  };

  const refreshSavedAddresses = async () => {
    if (!user) {
      setSavedAddresses([]);
      setLocationState(defaultLocation);
      localStorage.removeItem('royal_bengal_active_location');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped = data.map(a => ({
          id: a.id,
          label: a.address_type ? a.address_type.toUpperCase() : 'HOME',
          address: `${a.house_no ? a.house_no + ', ' : ''}${a.area || ''}, ${a.city}${a.pincode ? ' - ' + a.pincode : ''}`,
          houseNumber: a.house_no,
          area: a.area,
          city: a.city,
          pincode: a.pincode,
          lat: a.latitude,
          lng: a.longitude,
        }));
        setSavedAddresses(mapped);

        // If no active location set or location is default, automatically select the user's latest Supabase saved address
        const savedActive = localStorage.getItem('royal_bengal_active_location');
        if ((!savedActive || JSON.parse(savedActive).label === defaultLocation.label) && mapped.length > 0) {
          setLocation(mapped[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching user addresses:', err);
    }
  };

  useEffect(() => {
    refreshSavedAddresses();
  }, [user]);

  // GPS Auto Detection & Google Reverse Geocoding
  const detectGPSLocation = async (): Promise<LocationData | null> => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return null;
    }

    setIsDetectingGPS(true);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          try {
            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDwr-cKcQ4nQFEVWwk7UI3cdRbEdLIcc4g';
            const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
            const data = await res.json();

            if (data.status === 'OK' && data.results?.[0]) {
              const result = data.results[0];
              let area = '';
              let city = '';
              let pincode = '';

              result.address_components?.forEach((comp: any) => {
                if (comp.types.includes('sublocality') || comp.types.includes('neighborhood') || comp.types.includes('route')) {
                  if (!area) area = comp.long_name;
                }
                if (comp.types.includes('locality')) {
                  city = comp.long_name;
                }
                if (comp.types.includes('postal_code')) {
                  pincode = comp.long_name;
                }
              });

              const detectedLoc: LocationData = {
                label: area || 'GPS Location',
                address: result.formatted_address,
                area: area || 'Current Area',
                city: city || 'Hyderabad',
                pincode: pincode || '500081',
                lat,
                lng,
              };

              setLocation(detectedLoc);
              setIsDetectingGPS(false);
              resolve(detectedLoc);
              return;
            }

            throw new Error('Google Geocoding failed');
          } catch (err) {
            console.error('Google reverse geocoding error:', err);
            const fallbackLoc: LocationData = {
              label: 'GPS Location',
              address: `Madhapur, Hyderabad - 500081`,
              city: 'Hyderabad',
              pincode: '500081',
              lat,
              lng,
            };
            setLocation(fallbackLoc);
            setIsDetectingGPS(false);
            resolve(fallbackLoc);
          }
        },
        (error) => {
          console.error('GPS error:', error);
          alert('Location access denied or unavailable. Please enable GPS permissions or search for your locality.');
          setIsDetectingGPS(false);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  return (
    <LocationContext.Provider value={{
      location,
      setLocation,
      savedAddresses,
      isDetectingGPS,
      detectGPSLocation,
      isModalOpen,
      setIsModalOpen,
      refreshSavedAddresses,
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
