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
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Map as MapIcon,
  ChevronRight
} from 'lucide-react';

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
}

export const AddressMapPicker: React.FC<AddressMapPickerProps> = ({
  onSave,
  onCancel,
  defaultPhone = '',
  defaultName = '',
  existingLabels = [],
}) => {
  // 2-Step Flow: 'map' (Confirm Google Pin Location) -> 'details' (Fill House & Contact Details)
  const [pickerStep, setPickerStep] = useState<'map' | 'details'>('map');

  const [lat, setLat] = useState(17.4483);
  const [lng, setLng] = useState(78.3742);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [labelError, setLabelError] = useState('');
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  const [detectedAddress, setDetectedAddress] = useState({
    area: 'Hitech City, Madhapur',
    city: 'Hyderabad',
    pincode: '500081',
    fullAddress: 'Hitech City, Madhapur, Hyderabad, Telangana - 500081',
  });

  const isHomeUsed = useMemo(() => existingLabels.some(l => l.toUpperCase().trim() === 'HOME'), [existingLabels]);
  const isWorkUsed = useMemo(() => existingLabels.some(l => l.toUpperCase().trim() === 'WORK'), [existingLabels]);

  const defaultType = !isHomeUsed ? 'home' : (!isWorkUsed ? 'work' : 'other');

  const [form, setForm] = useState({
    fullName: defaultName,
    mobile: defaultPhone,
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
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDwr-cKcQ4nQFEVWwk7UI3cdRbEdLIcc4g';
    if (!apiKey) return;

    if (typeof window !== 'undefined' && (window as any).google?.maps?.Map) {
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=gmapsCallback`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // Initialize Native Google Map
  useEffect(() => {
    if (!googleMapsLoaded || typeof window === 'undefined' || !mapContainerRef.current || pickerStep !== 'map') return;

    try {
      const google = (window as any).google;
      if (!google?.maps?.Map) return;

      if (!googleMapRef.current) {
        const map = new google.maps.Map(mapContainerRef.current, {
          center: { lat, lng },
          zoom: 17,
          disableDefaultUI: true,
          zoomControl: false,
          gestureHandling: 'greedy',
        });

        // Continuous center tracking when map stops moving
        map.addListener('idle', () => {
          const center = map.getCenter();
          if (center) {
            setLat(center.lat());
            setLng(center.lng());
          }
        });

        googleMapRef.current = map;
      } else {
        googleMapRef.current.setCenter({ lat, lng });
      }
    } catch (err) {
      console.error('Google Map init error:', err);
    }
  }, [googleMapsLoaded, pickerStep]);

  // Google Geocoder Place Search
  useEffect(() => {
    if (!googleMapsLoaded || !searchQuery || searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    let active = true;

    const searchGooglePlace = async () => {
      setIsSearching(true);
      try {
        const google = (window as any).google;
        if (!google?.maps) return;

        let GeocoderClass = google.maps.Geocoder;
        if (!GeocoderClass && typeof google.maps.importLibrary === 'function') {
          const geocodingLib = await google.maps.importLibrary("geocoding");
          GeocoderClass = geocodingLib.Geocoder;
        }

        if (!active || !GeocoderClass) {
          setIsSearching(false);
          return;
        }

        const geocoder = new GeocoderClass();
        geocoder.geocode({ address: searchQuery, componentRestrictions: { country: 'IN' } }, (results: any, status: any) => {
          if (!active) return;
          setIsSearching(false);
          if (status === 'OK' && results) {
            setSuggestions(results.slice(0, 5));
          } else {
            setSuggestions([]);
          }
        });
      } catch (err) {
        if (active) setIsSearching(false);
        console.error('Google Geocoder Search Error:', err);
      }
    };

    const timer = setTimeout(searchGooglePlace, 350);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchQuery, googleMapsLoaded]);

  const handleSelectGooglePlace = (item: any) => {
    if (item.geometry && item.geometry.location) {
      const placeLat = item.geometry.location.lat();
      const placeLng = item.geometry.location.lng();

      setLat(placeLat);
      setLng(placeLng);
      setSuggestions([]);
      setSearchQuery('');

      if (googleMapRef.current) {
        googleMapRef.current.setCenter({ lat: placeLat, lng: placeLng });
        googleMapRef.current.setZoom(17);
      }
    }
  };

  // Google Geocoder Reverse Geocoding when Lat/Lng changes
  useEffect(() => {
    if (!googleMapsLoaded || typeof window === 'undefined') return;

    let active = true;
    const geocodeWithGoogle = async () => {
      setIsGeocoding(true);
      try {
        const google = (window as any).google;
        if (!google?.maps) return;

        let GeocoderClass = google.maps.Geocoder;
        if (!GeocoderClass && typeof google.maps.importLibrary === 'function') {
          const geocodingLib = await google.maps.importLibrary("geocoding");
          GeocoderClass = geocodingLib.Geocoder;
        }

        if (!active || !GeocoderClass) {
          if (active) setIsGeocoding(false);
          return;
        }

        const geocoder = new GeocoderClass();
        geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
          if (!active) return;
          setIsGeocoding(false);

          if (status === 'OK' && results?.[0]) {
            const result = results[0];
            const fullAddress = result.formatted_address;

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

            setDetectedAddress({
              area: area || result.address_components?.[0]?.long_name || 'Selected Location',
              city: city || 'Hyderabad',
              pincode: pincode || '500081',
              fullAddress: fullAddress || `${area}, ${city}`,
            });
          }
        });
      } catch (err) {
        console.error('Google Geocoder Error:', err);
        if (active) setIsGeocoding(false);
      }
    };

    const timer = setTimeout(geocodeWithGoogle, 400);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [lat, lng, googleMapsLoaded]);

  const handleGPSClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetectingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const gpsLat = pos.coords.latitude;
        const gpsLng = pos.coords.longitude;

        setLat(gpsLat);
        setLng(gpsLng);
        setIsDetectingGPS(false);

        if (googleMapRef.current) {
          googleMapRef.current.setCenter({ lat: gpsLat, lng: gpsLng });
          googleMapRef.current.setZoom(17);
        }
      },
      (err) => {
        console.error("GPS Error:", err);
        alert("Unable to fetch GPS location. Please check location permissions.");
        setIsDetectingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCustomLabelChange = (text: string) => {
    const uppercaseText = text.toUpperCase();
    setForm({ ...form, customLabel: text });

    if (existingLabels.some(l => l.toUpperCase().trim() === uppercaseText.trim())) {
      setLabelError(`Label '${uppercaseText.trim()}' is already in use. Please enter a unique label.`);
    } else {
      setLabelError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLabelError('');

    let targetLabel = form.addressType.toUpperCase();
    if (form.addressType === 'other') {
      const custom = form.customLabel.trim().toUpperCase();
      if (!custom) return alert("Please enter a custom address label (e.g. PARENTS, FARMHOUSE).");
      targetLabel = custom;
    }

    const isLabelAlreadyUsed = existingLabels.some(
      l => l.toUpperCase().trim() === targetLabel
    );

    if (isLabelAlreadyUsed) {
      setLabelError(`Label '${targetLabel}' is already used by a saved address. Please enter a unique label.`);
      return;
    }

    if (!form.floorHouseNo) return alert("Please enter Flat / House No / Floor.");
    if (!form.fullName || !form.mobile) return alert("Please enter Recipient Name & Phone.");

    setIsSubmitting(true);
    try {
      const fullHouseBuilding = form.buildingName
        ? `${form.floorHouseNo}, ${form.buildingName}`
        : form.floorHouseNo;

      await onSave({
        fullName: form.fullName,
        mobile: form.mobile,
        houseNo: fullHouseBuilding,
        buildingName: form.buildingName,
        area: detectedAddress.area,
        landmark: form.landmark,
        city: detectedAddress.city,
        pincode: detectedAddress.pincode,
        latitude: lat,
        longitude: lng,
        addressType: targetLabel,
      });
    } catch (err) {
      console.error(err);
      alert("Error saving address");
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
          <div className="px-4 py-3 bg-emerald-950 text-white flex items-center justify-between z-20 border-b border-amber-400/30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black">
                <MapIcon size={18} />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase text-amber-300 tracking-tight">Step 1: Search & Pin Location</h2>
                <p className="text-[10px] text-emerald-200">Google Maps Geocoding & Pinning</p>
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
                placeholder="Search Google Maps for place, colony, building..."
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

            {/* Google Geocoder Search Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute left-4 right-4 top-14 bg-white border border-amber-200 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-gray-100 max-h-60 overflow-y-auto">
                {suggestions.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectGooglePlace(item)}
                    className="p-3.5 hover:bg-emerald-50 cursor-pointer flex items-center gap-3 transition-colors text-xs"
                  >
                    <MapPin size={16} className="text-amber-500 shrink-0" />
                    <p className="font-bold text-gray-800 truncate">{item.formatted_address}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Native Google Map View */}
          <div className="relative flex-1 w-full bg-gray-100 overflow-hidden min-h-[350px]">
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" style={{ minHeight: '350px', height: '100%' }} />

            {/* Clean Native Location Pin Marker */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 -translate-y-8">
              <div className="bg-[#022c22] text-amber-300 font-bold text-[10px] px-3 py-1 rounded-full border border-amber-400/80 shadow-lg mb-1">
                Pin Location
              </div>

              {/* Clean Standard Location Pin SVG */}
              <div className="relative flex flex-col items-center">
                <svg width="38" height="48" viewBox="0 0 38 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                  <path d="M19 0C8.50659 0 0 8.50659 0 19C0 31.5 19 48 19 48C19 48 38 31.5 38 19C38 8.50659 29.4934 0 19 0Z" fill="#022c22" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="19" cy="18" r="8" fill="#fbbf24" />
                </svg>
                <div className="w-3 h-1.5 bg-black/40 rounded-full blur-[1px] -mt-1" />
              </div>
            </div>

            {/* GPS Locate Me Button */}
            <button
              onClick={handleGPSClick}
              disabled={isDetectingGPS}
              className="absolute bottom-4 right-4 z-20 bg-white border border-amber-300 text-emerald-950 font-extrabold p-3 rounded-2xl shadow-xl flex items-center gap-2 hover:bg-emerald-50 active:scale-95 transition-all text-xs uppercase tracking-wider"
            >
              {isDetectingGPS ? <Loader2 size={16} className="animate-spin text-emerald-800" /> : <Navigation size={16} className="fill-amber-400 text-emerald-900" />}
              <span>Use my current location</span>
            </button>
          </div>

          {/* Bottom Confirmation Bar */}
          <div className="p-4 bg-white border-t border-amber-200 shadow-2xl z-30 space-y-3">
            <div className="flex items-center gap-3 bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
              <div className="p-2 rounded-xl bg-emerald-800 text-amber-300 shrink-0">
                <MapPin size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-950 uppercase truncate">{detectedAddress.area}</span>
                  {isGeocoding && <Loader2 size={12} className="animate-spin text-amber-600 shrink-0" />}
                </div>
                <p className="text-[10px] text-gray-500 font-medium truncate">
                  {detectedAddress.fullAddress}
                </p>
              </div>
            </div>

            <button
              onClick={() => setPickerStep('details')}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black py-4 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>Confirm Location & Proceed</span> <ChevronRight size={16} />
            </button>
          </div>

        </div>
      ) : (
        /* STEP 2: FILL HOUSE & RECIPIENT DETAILS */
        <div className="relative flex-1 flex flex-col w-full h-full bg-gray-50 overflow-y-auto no-scrollbar">

          {/* Top Header Bar */}
          <div className="px-4 py-3 bg-emerald-950 text-white flex items-center justify-between z-20 border-b border-amber-400/30 sticky top-0">
            <button
              onClick={() => setPickerStep('map')}
              className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-300 hover:text-amber-200 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Map
            </button>

            <span className="text-xs font-black uppercase tracking-wider text-amber-400">Step 2: Add Address Details</span>

            <button onClick={onCancel} className="p-2 text-emerald-200 hover:text-white rounded-full">
              <X size={20} />
            </button>
          </div>

          <div className="max-w-xl mx-auto p-4 sm:p-6 w-full space-y-4">

            {/* Confirmed Location Summary Card */}
            <div className="p-4 rounded-2xl bg-white border border-amber-300 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-800 text-amber-300 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-xs font-black text-emerald-950 uppercase block">{detectedAddress.area}</span>
                  <p className="text-[10px] text-gray-500 font-medium truncate max-w-[200px] sm:max-w-[300px]">
                    {detectedAddress.city} - {detectedAddress.pincode}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPickerStep('map')}
                className="text-[10px] font-black uppercase text-emerald-800 hover:underline bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0"
              >
                Change Pin
              </button>
            </div>

            {/* Form Sheet */}
            <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-[28px] border border-gray-200 shadow-sm space-y-4">

              {/* Label Error Warning */}
              {labelError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{labelError}</span>
                </div>
              )}

              {/* Address Label Selector (HOME / WORK Greyed Out if Used) */}
              <div>
                <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Save Address Label</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={isHomeUsed}
                    onClick={() => {
                      setForm({ ...form, addressType: 'home' });
                      setLabelError('');
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-all ${
                      form.addressType === 'home'
                        ? 'bg-emerald-800 text-amber-300 border-amber-400 shadow-md'
                        : isHomeUsed
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50 line-through'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Home size={12} /> HOME {isHomeUsed && '(Saved)'}
                  </button>

                  <button
                    type="button"
                    disabled={isWorkUsed}
                    onClick={() => {
                      setForm({ ...form, addressType: 'work' });
                      setLabelError('');
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-all ${
                      form.addressType === 'work'
                        ? 'bg-emerald-800 text-amber-300 border-amber-400 shadow-md'
                        : isWorkUsed
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50 line-through'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Briefcase size={12} /> WORK {isWorkUsed && '(Saved)'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setForm({ ...form, addressType: 'other' });
                      setLabelError('');
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-all ${
                      form.addressType === 'other'
                        ? 'bg-emerald-800 text-amber-300 border-amber-400 shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Building size={12} /> OTHER
                  </button>
                </div>
              </div>

              {/* Custom Label Input when OTHER is selected */}
              {form.addressType === 'other' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Custom Label Name (e.g. PARENTS, GYM, FARMHOUSE)</label>
                  <input
                    required
                    type="text"
                    placeholder="Enter unique custom label (e.g. PARENTS)"
                    value={form.customLabel}
                    onChange={e => handleCustomLabelChange(e.target.value)}
                    className="w-full bg-gray-50 border border-amber-300 rounded-xl p-3 text-xs font-black uppercase tracking-wider text-gray-900 outline-none focus:bg-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black uppercase text-gray-400">Recipient Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-amber-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase text-gray-400">Mobile Phone *</label>
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile"
                    value={form.mobile}
                    onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-amber-400 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black uppercase text-gray-400">Flat / House No / Floor *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Flat 402, 4th Floor"
                    value={form.floorHouseNo}
                    onChange={e => setForm({ ...form, floorHouseNo: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-amber-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase text-gray-400">Building / Apartment Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sunshine Heights"
                    value={form.buildingName}
                    onChange={e => setForm({ ...form, buildingName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-amber-400 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-gray-400">Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Opposite Cyber Towers"
                  value={form.landmark}
                  onChange={e => setForm({ ...form, landmark: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-amber-400 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !!labelError}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-amber-300 border border-amber-400/80 font-black py-4 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle2 size={16} /> Save Address</>}
              </button>
            </form>

          </div>

        </div>
      )}

    </div>
  );
};
