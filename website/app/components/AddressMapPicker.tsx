"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MapPin,
  Search,
  X,
  Navigation,
  Home,
  Briefcase,
  Building,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Map as MapIcon,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

interface AddressMapPickerProps {
  onSave: (addressData: {
    fullName: string;
    mobile: string;
    houseNo: string;
    buildingName: string;
    area: string;
    landmark: string;
    city: string;
    pincode: string;
    latitude: number;
    longitude: number;
    addressType: string;
  }) => Promise<void>;
  onCancel: () => void;
  defaultPhone?: string;
  defaultName?: string;
  existingLabels?: string[];
  initialLat?: number;
  initialLng?: number;
}

// Default map center only (Hyderabad center) — never saved as address text
const DEFAULT_CENTER = { lat: 17.3850, lng: 78.4867 };

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const AddressMapPicker: React.FC<AddressMapPickerProps> = ({
  onSave,
  onCancel,
  defaultPhone = '',
  defaultName = '',
  existingLabels = [],
  initialLat,
  initialLng,
}) => {
  const [pickerStep, setPickerStep] = useState<'map' | 'details'>('map');

  const [lat, setLat] = useState(initialLat || DEFAULT_CENTER.lat);
  const [lng, setLng] = useState(initialLng || DEFAULT_CENTER.lng);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [labelError, setLabelError] = useState('');
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [liveLocality, setLiveLocality] = useState('Detecting address...');

  // Start empty—never pre-populate fake neighborhood or pincode strings
  const [detectedAddress, setDetectedAddress] = useState<{
    area: string;
    city: string;
    pincode: string;
    state: string;
    fullAddress: string;
    isVerified: boolean;
  }>({
    area: '',
    city: '',
    pincode: '',
    state: '',
    fullAddress: '',
    isVerified: false,
  });

  const { userData } = useAuth();

  const isHomeUsed = useMemo(
    () => existingLabels.some(l => l.toUpperCase().trim() === 'HOME'),
    [existingLabels]
  );
  const isWorkUsed = useMemo(
    () => existingLabels.some(l => l.toUpperCase().trim() === 'WORK'),
    [existingLabels]
  );

  const defaultType = !isHomeUsed ? 'home' : (!isWorkUsed ? 'work' : 'other');

  const profileName = (userData?.display_name && !userData.display_name.toLowerCase().startsWith('member')) ? userData.display_name : (defaultName && !defaultName.toLowerCase().startsWith('member') ? defaultName : '');
  const profilePhone = userData?.phone_number || defaultPhone;

  const [form, setForm] = useState({
    fullName: profileName,
    mobile: profilePhone,
    floorHouseNo: '',
    buildingName: '',
    landmark: '',
    addressType: defaultType,
    customLabel: '',
  });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);

  // Load Google Maps API Script dynamically
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
      return;
    }

    if (typeof window !== 'undefined' && (window as any).google?.maps?.places) {
      setGoogleMapsLoaded(true);
      return;
    }

    (window as any).gmapsCallback = () => {
      setGoogleMapsLoaded(true);
    };

    const scriptId = 'google-maps-js-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async&callback=gmapsCallback`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // Initialize Native Google Map
  useEffect(() => {
    if (!googleMapsLoaded || typeof window === 'undefined' || !mapContainerRef.current || pickerStep !== 'map') return;

    let mapInstance: any = null;

    try {
      const google = (window as any).google;
      if (!google?.maps?.Map) return;

      mapInstance = new google.maps.Map(mapContainerRef.current, {
        center: { lat, lng },
        zoom: 17,
        disableDefaultUI: true,
        zoomControl: false,
        gestureHandling: 'greedy',
        keyboardShortcuts: false,
      });

      mapInstance.addListener('idle', () => {
        const center = mapInstance.getCenter();
        if (center) {
          setLat(center.lat());
          setLng(center.lng());
          setDetectedAddress(prev => ({ ...prev, isVerified: false }));
          setLocationError('');
        }
      });

      googleMapRef.current = mapInstance;

      // Trigger resize after mount to ensure tiles render properly when returning from Step 2 ("Change pin")
      setTimeout(() => {
        if (mapInstance && google?.maps?.event) {
          google.maps.event.trigger(mapInstance, 'resize');
          mapInstance.setCenter({ lat, lng });
        }
      }, 50);
    } catch (err) {
      console.error('Google Map init error:', err);
    }
  }, [googleMapsLoaded, pickerStep]);

  // Auto-detect precise GPS on mount if no initial coordinates are passed or if using default center
  useEffect(() => {
    if ((!initialLat || initialLat === DEFAULT_CENTER.lat) && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const curLat = position.coords.latitude;
          const curLng = position.coords.longitude;
          setLat(curLat);
          setLng(curLng);
          if (googleMapRef.current) {
            googleMapRef.current.setCenter({ lat: curLat, lng: curLng });
            googleMapRef.current.setZoom(18);
          }
        },
        (err) => {
          console.warn('Auto GPS detection on map picker mount skipped:', err);
        },
        { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
      );
    }
  }, [initialLat]);

  const [searchedPlaceName, setSearchedPlaceName] = useState('');
  const [searchedPlaceCoords, setSearchedPlaceCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Live reverse geocoding on map idle for address preview card
  useEffect(() => {
    if (!googleMapsLoaded || pickerStep !== 'map') return;
    const google = (window as any).google;
    if (!google?.maps?.Geocoder) return;

    let active = true;
    const timer = setTimeout(() => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (res: any, status: string) => {
        if (!active) return;
        if (status === 'OK' && res && res[0]) {
          let addr = res[0].formatted_address || 'Selected location';
          addr = addr.replace(/^[A-Z0-9]{4}\+[A-Z0-9]{2,3},\s*/i, '');

          let finalAddr = addr;
          if (searchedPlaceName && searchedPlaceCoords) {
            const dist = getDistanceFromLatLonInKm(lat, lng, searchedPlaceCoords.lat, searchedPlaceCoords.lng);
            if (dist < 0.2 && !addr.toLowerCase().includes(searchedPlaceName.toLowerCase())) {
              finalAddr = `${searchedPlaceName}, ${addr}`;
            }
          }
          setLiveLocality(finalAddr);
        } else {
          setLiveLocality(searchedPlaceName ? `${searchedPlaceName}, Selected location` : 'Selected location');
        }
      });
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [lat, lng, googleMapsLoaded, pickerStep, searchedPlaceName, searchedPlaceCoords]);

  // 1. Google Places Autocomplete Search (Strictly Telangana)
  useEffect(() => {
    if (!googleMapsLoaded || !searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    let active = true;

    const searchGooglePlace = async () => {
      setIsSearching(true);
      try {
        const google = (window as any).google;
        if (!google?.maps) return;

        let AutocompleteServiceClass = google.maps.places?.AutocompleteService;
        if (!AutocompleteServiceClass && typeof google.maps.importLibrary === 'function') {
          const placesLib = await google.maps.importLibrary('places');
          AutocompleteServiceClass = placesLib.AutocompleteService;
        }

        if (!active || !AutocompleteServiceClass) {
          if (active) setIsSearching(false);
          return;
        }

        const autocompleteService = new AutocompleteServiceClass();

        const telanganaBounds = new google.maps.LatLngBounds(
          { lat: 15.8300, lng: 77.2300 },
          { lat: 19.9200, lng: 81.3200 }
        );

        autocompleteService.getPlacePredictions(
          {
            input: searchQuery.trim(),
            componentRestrictions: { country: 'in' },
            locationRestriction: telanganaBounds,
          },
          (predictions: any[] | null, status: string) => {
            if (!active) return;
            setIsSearching(false);

            if (status === 'OK' && predictions) {
              const telanganaOnly = predictions.filter((item) => {
                const desc = (item.description || '').toLowerCase();
                return (
                  desc.includes('telangana') ||
                  desc.includes('hyderabad') ||
                  desc.includes('secunderabad')
                );
              });
              setSuggestions(telanganaOnly.slice(0, 5));
            } else {
              setSuggestions([]);
            }
          }
        );
      } catch (err) {
        if (active) setIsSearching(false);
        console.error('Google Places Autocomplete Error:', err);
      }
    };

    const timer = setTimeout(searchGooglePlace, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchQuery, googleMapsLoaded]);

  // 2. Resolve selected prediction's place_id to Lat/Lng
  const handleSelectGooglePlace = async (item: any) => {
    if (!item?.place_id) return;
    const mainTitle = item.structured_formatting?.main_text || item.description?.split(',')[0] || '';
    const fullDesc = item.description || '';

    try {
      const google = (window as any).google;
      let GeocoderClass = google.maps.Geocoder;
      if (!GeocoderClass && typeof google.maps.importLibrary === 'function') {
        const geocodingLib = await google.maps.importLibrary('geocoding');
        GeocoderClass = geocodingLib.Geocoder;
      }

      const geocoder = new GeocoderClass();
      geocoder.geocode({ placeId: item.place_id }, (results: any, status: string) => {
        if (status === 'OK' && results?.[0]?.geometry?.location) {
          const placeLat = results[0].geometry.location.lat();
          const placeLng = results[0].geometry.location.lng();

          setLat(placeLat);
          setLng(placeLng);
          setSuggestions([]);
          setSearchQuery('');
          setLocationError('');
          setSearchedPlaceName(mainTitle);
          setSearchedPlaceCoords({ lat: placeLat, lng: placeLng });
          if (fullDesc) setLiveLocality(fullDesc);

          if (mainTitle) {
            setForm(prev => ({ ...prev, buildingName: mainTitle }));
          }

          if (googleMapRef.current) {
            googleMapRef.current.setCenter({ lat: placeLat, lng: placeLng });
            googleMapRef.current.setZoom(17);
          }
        }
      });
    } catch (err) {
      console.error('Place ID Geocode Error:', err);
    }
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGPS(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const curLat = position.coords.latitude;
        const curLng = position.coords.longitude;
        setLat(curLat);
        setLng(curLng);
        if (googleMapRef.current) {
          googleMapRef.current.setCenter({ lat: curLat, lng: curLng });
          googleMapRef.current.setZoom(18);
        }
        setIsDetectingGPS(false);
      },
      (error) => {
        console.error('GPS error:', error);
        setIsDetectingGPS(false);
        setLocationError('Unable to retrieve GPS location. Please enable location permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Properly awaited Reverse Geocoding before transitioning to Step 2
  const handleProceedToDetails = async () => {
    setIsGeocoding(true);
    setLocationError('');

    try {
      const google = (window as any).google;
      if (!google?.maps) {
        throw new Error('Google Maps is not loaded yet.');
      }

      let GeocoderClass = google.maps.Geocoder;
      if (!GeocoderClass && typeof google.maps.importLibrary === 'function') {
        const geocodingLib = await google.maps.importLibrary('geocoding');
        GeocoderClass = geocodingLib.Geocoder;
      }

      const geocoder = new GeocoderClass();

      const results: any[] = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (res: any, status: string) => {
          if (status === 'OK' && res && res.length > 0) {
            resolve(res);
          } else {
            reject(new Error(`Geocoding failed with status: ${status}`));
          }
        });
      });

      const primary = results[0];
      const fullAddress = primary.formatted_address || '';

      let area = '';
      let city = '';
      let pincode = '';
      let state = '';

      for (const result of results) {
        for (const comp of result.address_components || []) {
          if (!area && (comp.types.includes('sublocality_level_1') || comp.types.includes('sublocality') || comp.types.includes('neighborhood'))) {
            area = comp.long_name;
          }
          if (!city && comp.types.includes('locality')) {
            city = comp.long_name;
          }
          if (!state && comp.types.includes('administrative_area_level_1')) {
            state = comp.long_name;
          }
          if (!pincode && comp.types.includes('postal_code')) {
            pincode = comp.long_name;
          }
        }
        if (area && city && pincode && state) break;
      }

      if (state && state.toLowerCase() !== 'telangana') {
        setLocationError(`Delivery is currently available only in Telangana (Selected: ${state}).`);
        return;
      }

      if (!city || !pincode) {
        setLocationError('Could not detect a valid city/pincode for this pin. Please adjust the pin slightly.');
        return;
      }

      setDetectedAddress({
        area: area || city,
        city,
        pincode,
        state,
        fullAddress,
        isVerified: true,
      });

      setPickerStep('details');
    } catch (err) {
      console.error('Reverse geocode error:', err);
      setLocationError('Unable to verify pinned address. Please check your connection and try again.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleCustomLabelChange = (text: string) => {
    const uppercaseText = text.toUpperCase();
    setForm({ ...form, customLabel: text });

    if (existingLabels.some(l => l.toUpperCase().trim() === uppercaseText.trim())) {
      setLabelError(`Label '${uppercaseText.trim()}' is already in use.`);
    } else {
      setLabelError('');
    }
  };

  const handleSaveAddressFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLabelError('');

    if (!detectedAddress.isVerified || !detectedAddress.city || !detectedAddress.pincode) {
      alert('Please confirm a valid location on the map first.');
      setPickerStep('map');
      return;
    }

    if (!form.fullName.trim()) {
      alert('Please enter recipient full name');
      return;
    }

    const cleanPhone = form.mobile.trim().replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      alert('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    if (!form.floorHouseNo.trim()) {
      alert('Please enter House / Flat / Block No.');
      return;
    }

    if (!form.buildingName.trim()) {
      alert('Please enter Apartment / Building name.');
      return;
    }

    let targetLabel = form.addressType.toUpperCase();
    if (form.addressType === 'other') {
      const custom = form.customLabel.trim().toUpperCase();
      if (!custom) {
        alert('Please enter a custom address label (e.g. PARENTS, OFFICE).');
        return;
      }
      targetLabel = custom;
    }

    if (existingLabels.some(l => l.toUpperCase().trim() === targetLabel)) {
      setLabelError(`Label '${targetLabel}' is already saved. Choose a unique label.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        fullName: form.fullName.trim(),
        mobile: cleanPhone,
        houseNo: form.floorHouseNo.trim(),
        buildingName: form.buildingName.trim(),
        area: detectedAddress.area,
        landmark: form.landmark.trim(),
        city: detectedAddress.city,
        pincode: detectedAddress.pincode,
        latitude: lat,
        longitude: lng,
        addressType: targetLabel,
      });
    } catch (err) {
      console.error(err);
      alert('Error saving address');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col overflow-hidden">
      {/* STEP 1: NATIVE GOOGLE MAP & PIN CONFIRMATION */}
      {pickerStep === 'map' ? (
        <div className="relative flex-1 flex flex-col w-full h-full overflow-hidden">
          {/* Top Header Bar */}
          <div className="px-4 py-3 bg-[#022c22] text-white flex items-center justify-between z-20 border-b border-amber-400/30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-[#022c22] flex items-center justify-center font-black">
                <MapIcon size={18} />
              </div>
              <div>
                <h2 className="text-sm font-black text-amber-300 tracking-tight">Select delivery location</h2>
                <p className="text-[10px] text-emerald-200">Delivering across Hyderabad</p>
              </div>
            </div>

            <button onClick={onCancel} className="p-2 text-emerald-200 hover:text-white rounded-full">
              <X size={20} />
            </button>
          </div>

          {/* Google Places Search Bar */}
          <div className="relative z-30 px-4 pt-3 pb-2 bg-white/95 backdrop-blur-md shadow-md">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search apartment, colony, street in Telangana..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-amber-400 focus:bg-white rounded-2xl py-2.5 pl-10 pr-10 text-xs font-bold outline-none transition-all"
              />
              {isSearching ? (
                <Loader2 size={16} className="absolute right-3.5 top-3 text-emerald-800 animate-spin" />
              ) : searchQuery ? (
                <button onClick={() => { setSearchQuery(''); setSuggestions([]); }} className="absolute right-3.5 top-3 text-gray-400">
                  <X size={16} />
                </button>
              ) : null}
            </div>

            {/* Autocomplete Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute left-4 right-4 top-14 bg-white border border-amber-200 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-dashed divide-gray-200 max-h-60 overflow-y-auto">
                {suggestions.map((item, i) => {
                  const mainTitle =
                    item.structured_formatting?.main_text ||
                    item.description?.split(',')[0] ||
                    'Location';
                  const subTitle =
                    item.structured_formatting?.secondary_text ||
                    item.description ||
                    '';

                  return (
                    <div
                      key={item.place_id || i}
                      onClick={() => handleSelectGooglePlace(item)}
                      className="p-3.5 hover:bg-emerald-50/60 cursor-pointer flex items-start gap-3 transition-colors text-xs"
                    >
                      <MapPin size={18} className="text-gray-700 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="font-extrabold text-gray-900 text-xs sm:text-sm truncate">{mainTitle}</p>
                        <p className="text-[11px] text-gray-500 font-medium line-clamp-1 mt-0.5">{subTitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Native Google Map View */}
          <div className="relative flex-1 w-full bg-gray-100 overflow-hidden min-h-[350px]">
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" style={{ minHeight: '350px', height: '100%' }} />

            {/* Floating GPS Target Button (Bottom Right) */}
            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={isDetectingGPS}
              aria-label="Use current location"
              className="absolute bottom-5 right-4 z-20 w-12 h-12 bg-white rounded-full shadow-2xl border border-gray-200 flex items-center justify-center text-[#022c22] hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
            >
              {isDetectingGPS ? <Loader2 size={20} className="animate-spin text-[#022c22]" /> : <Navigation size={20} className="fill-[#022c22]" />}
            </button>

            {/* Pin Instruction Tooltip & Marker */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 -translate-y-8">
              <div className="bg-[#022c22] text-amber-300 font-bold text-xs px-3.5 py-1.5 rounded-xl border border-amber-400/80 shadow-xl mb-1">
                Your order will be delivered here
              </div>
              <div className="relative flex flex-col items-center">
                <svg width="38" height="48" viewBox="0 0 38 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                  <path d="M19 0C8.50659 0 0 8.50659 0 19C0 31.5 19 48 19 48C19 48 38 31.5 38 19C38 8.50659 29.4934 0 19 0Z" fill="#022c22" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="19" cy="18" r="8" fill="#fbbf24" />
                </svg>
                <div className="w-3 h-1.5 bg-black/40 rounded-full blur-[1px] -mt-1" />
              </div>
            </div>
          </div>

          {/* Bottom Floating Card & Live Address Preview */}
          <div className="p-4 bg-white border-t border-gray-200 z-20 space-y-3 shadow-2xl">
            {locationError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{locationError}</span>
              </div>
            )}

            {/* Live Address Preview Card */}
            <div className="p-3.5 bg-emerald-50/90 border border-emerald-200/90 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#022c22] text-amber-300 flex items-center justify-center shrink-0">
                <MapPin size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Live Pin Location</p>
                <p className="text-xs font-extrabold text-gray-900 truncate mt-0.5">{liveLocality}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceedToDetails}
              disabled={isGeocoding}
              className="w-full bg-[#022c22] hover:bg-[#033c30] text-amber-300 font-black text-sm py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] border border-amber-400/40 disabled:opacity-50 cursor-pointer"
            >
              {isGeocoding ? <Loader2 size={18} className="animate-spin" /> : <>Confirm location <ChevronRight size={16} /></>}
            </button>
          </div>
        </div>
      ) : (
        /* STEP 2: ADDRESS DETAILS FORM */
        <div className="flex-1 flex flex-col w-full h-full bg-[#f8fafc] overflow-y-auto">
          <div className="px-4 py-3 bg-[#022c22] text-white flex items-center justify-between z-20 border-b border-amber-400/30 sticky top-0">
            <div className="flex items-center gap-2">
              <button onClick={() => setPickerStep('map')} className="p-1 text-emerald-200 hover:text-white mr-1 cursor-pointer">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-sm font-black text-amber-300 tracking-tight">Enter address details</h2>
                <p className="text-[10px] text-emerald-200 truncate max-w-[240px]">
                  {detectedAddress.area}, {detectedAddress.city} - {detectedAddress.pincode}
                </p>
              </div>
            </div>

            <button onClick={onCancel} className="p-2 text-emerald-200 hover:text-white rounded-full cursor-pointer">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSaveAddressFinal} className="p-5 sm:p-6 max-w-lg mx-auto w-full space-y-5">
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-[#022c22] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                    {detectedAddress.area} ({detectedAddress.pincode})
                  </p>
                  <p className="text-xs text-gray-700 font-medium mt-0.5 line-clamp-2">
                    {detectedAddress.fullAddress}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPickerStep('map')}
                className="text-xs font-black text-[#004d3b] hover:underline whitespace-nowrap shrink-0 pt-0.5"
              >
                Change pin
              </button>
            </div>

            <div className="space-y-4 bg-white p-5 sm:p-6 rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-500">Contact &amp; Address Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Recipient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-amber-400 focus:bg-white rounded-xl py-2.5 px-3.5 text-xs font-bold outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">10-Digit Mobile Number *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-gray-500">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      inputMode="numeric"
                      placeholder="9876543210"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-amber-400 focus:bg-white rounded-xl py-2.5 pl-12 pr-3.5 text-xs font-bold outline-none transition-all tracking-wider"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">House / Flat / Block No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 402, Block B"
                    value={form.floorHouseNo}
                    onChange={(e) => setForm({ ...form, floorHouseNo: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-amber-400 focus:bg-white rounded-xl py-2.5 px-3.5 text-xs font-bold outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Apartment / Building *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My Home Bhooja"
                    value={form.buildingName}
                    onChange={(e) => setForm({ ...form, buildingName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-amber-400 focus:bg-white rounded-xl py-2.5 px-3.5 text-xs font-bold outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nearby Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Behind Dmart, near Metro Station"
                  value={form.landmark}
                  onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-amber-400 focus:bg-white rounded-xl py-2.5 px-3.5 text-xs font-bold outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-3 bg-white p-5 sm:p-6 rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-500">Save As</h3>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, addressType: 'home' })}
                  className={`py-3 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                    form.addressType === 'home'
                      ? 'border-[#022c22] bg-emerald-50/70 text-[#022c22] shadow-xs'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Home size={18} />
                  <span>Home</span>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, addressType: 'work' })}
                  className={`py-3 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                    form.addressType === 'work'
                      ? 'border-[#022c22] bg-emerald-50/70 text-[#022c22] shadow-xs'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Briefcase size={18} />
                  <span>Work</span>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, addressType: 'other' })}
                  className={`py-3 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                    form.addressType === 'other'
                      ? 'border-[#022c22] bg-emerald-50/70 text-[#022c22] shadow-xs'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Building size={18} />
                  <span>Other</span>
                </button>
              </div>

              {form.addressType === 'other' && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Custom Label Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PARENTS, FRIENDS"
                    value={form.customLabel}
                    onChange={(e) => handleCustomLabelChange(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-amber-400 focus:bg-white rounded-2xl py-2.5 px-3.5 text-xs font-bold outline-none transition-all uppercase"
                  />
                  {labelError && <p className="text-[11px] text-rose-600 font-bold mt-1">{labelError}</p>}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#022c22] hover:bg-[#033c30] text-amber-300 font-black text-sm py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] border border-amber-400/40 disabled:opacity-50 cursor-pointer uppercase tracking-widest"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Save Address'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
