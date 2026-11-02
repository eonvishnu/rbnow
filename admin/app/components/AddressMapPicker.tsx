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
  Sparkles,
  AlertCircle
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
  const leafletMapRef = useRef<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load Google Maps API script dynamically if API key is present
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    if (typeof window !== 'undefined' && (window as any).google?.maps) {
      setGoogleMapsLoaded(true);
      return;
    }

    const scriptId = 'google-maps-js-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = () => setGoogleMapsLoaded(true);
      document.head.appendChild(script);
    }
  }, []);

  // Attach Google Places Autocomplete if Google Maps JS is loaded
  useEffect(() => {
    if (!googleMapsLoaded || !searchInputRef.current || typeof window === 'undefined') return;

    try {
      const google = (window as any).google;
      if (!google?.maps?.places) return;

      const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
        componentRestrictions: { country: 'in' },
        fields: ['address_components', 'geometry', 'formatted_address', 'name'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const placeLat = place.geometry.location.lat();
          const placeLng = place.geometry.location.lng();

          setLat(placeLat);
          setLng(placeLng);

          if (leafletMapRef.current) {
            leafletMapRef.current.setView([placeLat, placeLng], 17);
          }
        }
      });
    } catch (err) {
      console.error('Google Places Autocomplete init error:', err);
    }
  }, [googleMapsLoaded]);

  // Initialize Leaflet Map dynamically
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix Leaflet Default Icon Path
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!leafletMapRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [lat, lng],
          zoom: 15,
          zoomControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap',
          maxZoom: 19,
        }).addTo(map);

        map.on('moveend', () => {
          const center = map.getCenter();
          setLat(center.lat);
          setLng(center.lng);
        });

        leafletMapRef.current = map;
      }
    });

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Reverse Geocode when Lat/Lng changes
  useEffect(() => {
    let active = true;
    const reverseGeocode = async () => {
      setIsGeocoding(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();

        if (active && data) {
          const area = data.address?.suburb || data.address?.neighbourhood || data.address?.residential || data.address?.road || 'Current Area';
          const city = data.address?.city || data.address?.state_district || 'Hyderabad';
          const pincode = data.address?.postcode || '500081';
          const fullAddress = data.display_name || `${area}, ${city} - ${pincode}`;

          setDetectedAddress({ area, city, pincode, fullAddress });
        }
      } catch (err) {
        console.error('Reverse Geocode Error:', err);
      } finally {
        if (active) setIsGeocoding(false);
      }
    };

    const timer = setTimeout(reverseGeocode, 500);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [lat, lng]);

  // Fallback OpenStreetMap Autocomplete if Google Places is not active
  useEffect(() => {
    if (googleMapsLoaded) return; // Skip if Google Places Autocomplete is active
    if (!searchQuery || searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&limit=5`);
        const data = await res.json();
        setSuggestions(data || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, googleMapsLoaded]);

  const handleSelectSuggestion = (item: any) => {
    const itemLat = parseFloat(item.lat);
    const itemLng = parseFloat(item.lon);

    setLat(itemLat);
    setLng(itemLng);
    setSuggestions([]);
    setSearchQuery('');

    if (leafletMapRef.current) {
      leafletMapRef.current.setView([itemLat, itemLng], 16);
    }
  };

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

        if (leafletMapRef.current) {
          leafletMapRef.current.setView([gpsLat, gpsLng], 17);
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

    // UNIQUE LABEL VALIDATION RULE
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

      {/* Top Header Bar */}
      <div className="px-4 py-3 bg-emerald-950 text-white flex items-center justify-between z-20 border-b border-amber-400/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black">
            <MapPin size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase text-amber-300 tracking-tight">Select Location on Map</h2>
            <p className="text-[10px] text-emerald-200">Search place or confirm pin position</p>
          </div>
        </div>

        <button onClick={onCancel} className="p-2 text-emerald-200 hover:text-white rounded-full">
          <X size={20} />
        </button>
      </div>

      {/* Floating Location Search Bar */}
      <div className="relative z-30 px-4 pt-3 pb-2 bg-white/95 backdrop-blur-md shadow-md">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search locality, street, building or pincode..."
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

        {/* OpenStreetMap Fallback Search Suggestions Dropdown */}
        {!googleMapsLoaded && suggestions.length > 0 && (
          <div className="absolute left-4 right-4 top-14 bg-white border border-amber-200 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-gray-100 max-h-60 overflow-y-auto">
            {suggestions.map((item, i) => (
              <div
                key={i}
                onClick={() => handleSelectSuggestion(item)}
                className="p-3.5 hover:bg-emerald-50 cursor-pointer flex items-center gap-3 transition-colors text-xs"
              >
                <MapPin size={16} className="text-amber-500 shrink-0" />
                <p className="font-bold text-gray-800 truncate">{item.display_name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Map View */}
      <div className="relative flex-1 w-full bg-gray-100 overflow-hidden">

        {/* Leaflet Map Container */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Central Floating Marker Pin */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 -mt-8">
          <div className="bg-emerald-950 text-amber-300 font-black text-[9px] px-3 py-1 rounded-full border border-amber-400 shadow-xl mb-1 flex items-center gap-1 uppercase tracking-wider animate-bounce">
            <Sparkles size={10} /> Confirm Delivery Pin
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center shadow-2xl border-2 border-amber-400">
            <MapPin size={22} className="fill-amber-300 text-emerald-950" />
          </div>
          <div className="w-2.5 h-2.5 bg-black/40 rounded-full blur-[2px] mt-0.5" />
        </div>

        {/* GPS Locate Me Button */}
        <button
          onClick={handleGPSClick}
          disabled={isDetectingGPS}
          className="absolute bottom-4 right-4 z-20 bg-white border border-amber-300 text-emerald-950 font-extrabold p-3 rounded-2xl shadow-xl flex items-center gap-2 hover:bg-emerald-50 active:scale-95 transition-all text-xs uppercase tracking-wider"
        >
          {isDetectingGPS ? <Loader2 size={16} className="animate-spin text-emerald-800" /> : <Navigation size={16} className="fill-amber-400 text-emerald-900" />}
          <span>Locate Me</span>
        </button>
      </div>

      {/* Bottom Form Sheet */}
      <div className="relative z-30 bg-white border-t border-amber-200 shadow-2xl p-4 sm:p-6 space-y-4 max-h-[55vh] overflow-y-auto no-scrollbar rounded-t-[28px]">

        {/* Detected Location Card */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-800 text-amber-300 shrink-0">
              <MapPin size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-950 uppercase">{detectedAddress.area}</span>
                {isGeocoding && <Loader2 size={12} className="animate-spin text-amber-600" />}
              </div>
              <p className="text-[10px] text-gray-500 font-medium truncate max-w-[220px] sm:max-w-[340px]">
                {detectedAddress.city} - {detectedAddress.pincode}
              </p>
            </div>
          </div>

          <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
            Confirmed Pin
          </span>
        </div>

        {/* Address Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3">

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
                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-all ${
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
                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-all ${
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
                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-all ${
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
                className="w-full bg-gray-50 border border-amber-300 rounded-xl p-2.5 text-xs font-black uppercase tracking-wider text-gray-900 outline-none focus:bg-white"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-black uppercase text-gray-400">Recipient Name</label>
              <input
                required
                type="text"
                placeholder="Full Name"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-amber-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[9px] font-black uppercase text-gray-400">Mobile Phone</label>
              <input
                required
                type="tel"
                maxLength={10}
                placeholder="10-digit mobile"
                value={form.mobile}
                onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-amber-400 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-black uppercase text-gray-400">Flat / House No / Floor</label>
              <input
                required
                type="text"
                placeholder="e.g. Flat 402, 4th Floor"
                value={form.floorHouseNo}
                onChange={e => setForm({ ...form, floorHouseNo: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-amber-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[9px] font-black uppercase text-gray-400">Building / Apartment Name</label>
              <input
                type="text"
                placeholder="e.g. Sunshine Heights"
                value={form.buildingName}
                onChange={e => setForm({ ...form, buildingName: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-amber-400 focus:bg-white"
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
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-amber-400 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !!labelError}
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-amber-300 border border-amber-400/80 font-black py-3.5 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle2 size={16} /> Confirm & Save Address</>}
          </button>
        </form>

      </div>

    </div>
  );
};
