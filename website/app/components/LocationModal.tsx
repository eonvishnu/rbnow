"use client";

import React, { useState, useEffect } from 'react';
import { useLocation, LocationData } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/lib/supabase';
import { AddressMapPicker } from '@/app/components/AddressMapPicker';
import { MapPin, Navigation, Search, X, Check, Home, Briefcase, Sparkles, Loader2, ShieldCheck, Plus, Map } from 'lucide-react';

export const LocationModal = () => {
  const { user, userData } = useAuth();
  const {
    location,
    setLocation,
    savedAddresses,
    isDetectingGPS,
    detectGPSLocation,
    isModalOpen,
    setIsModalOpen,
    refreshSavedAddresses,
  } = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  // Load Google Maps API Script dynamically with places library
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDwr-cKcQ4nQFEVWwk7UI3cdRbEdLIcc4g';
    if (!apiKey) return;

    if (typeof window !== 'undefined' && (window as any).google?.maps?.places) {
      setGoogleMapsLoaded(true);
      return;
    }

    (window as any).gmapsModalCallback = () => {
      setGoogleMapsLoaded(true);
    };

    const scriptId = 'google-maps-js-modal-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async&callback=gmapsModalCallback`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // Real-time Places Autocomplete Service (Zepto style)
  useEffect(() => {
    if (!googleMapsLoaded || !searchQuery || searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    let active = true;
    setIsSearching(true);

    try {
      const google = (window as any).google;
      if (!google?.maps?.places) {
        setIsSearching(false);
        return;
      }

      const service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: searchQuery,
          componentRestrictions: { country: 'in' },
          locationBias: {
            center: { lat: location.lat || 17.3850, lng: location.lng || 78.4867 },
            radius: 50000,
          },
        },
        (predictions: any, status: any) => {
          if (!active) return;
          setIsSearching(false);
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSearchResults(predictions);
          } else {
            setSearchResults([]);
          }
        }
      );
    } catch (err) {
      if (active) setIsSearching(false);
      console.error('AutocompleteService error:', err);
    }

    return () => {
      active = false;
    };
  }, [searchQuery, googleMapsLoaded, location.lat, location.lng]);

  if (!isModalOpen) return null;

  const handleGPSClick = async () => {
    const loc = await detectGPSLocation();
    if (loc) {
      setIsModalOpen(false);
    }
  };

  const handleSelectPrediction = (prediction: any) => {
    const google = (window as any).google;
    if (!google?.maps) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ placeId: prediction.place_id }, (results: any, status: any) => {
      if (status === 'OK' && results?.[0]) {
        const item = results[0];
        const lat = item.geometry.location.lat();
        const lng = item.geometry.location.lng();
        const fullAddress = item.formatted_address;

        let area = '';
        let city = '';
        let pincode = '';

        item.address_components?.forEach((comp: any) => {
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

        const newLoc: LocationData = {
          label: area || prediction.structured_formatting?.main_text || 'Selected Location',
          address: fullAddress,
          area: area || prediction.structured_formatting?.secondary_text || 'Selected Area',
          city: city || 'Hyderabad',
          pincode: pincode || '500081',
          lat,
          lng,
        };

        setLocation(newLoc);
        setIsModalOpen(false);
      }
    });
  };

  const handleSaveFromMap = async (addressData: {
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
  }) => {
    try {
      if (user) {
        const { error } = await supabase
          .from('addresses')
          .insert({
            user_id: user.id,
            name: addressData.fullName,
            phone: addressData.mobile,
            house_no: addressData.houseNo,
            area: addressData.area,
            landmark: addressData.landmark,
            city: addressData.city,
            pincode: addressData.pincode,
            latitude: addressData.latitude,
            longitude: addressData.longitude,
            address_type: addressData.addressType,
          });

        if (error) console.error("Database save error:", error);
        await refreshSavedAddresses();
      }

      const newLoc: LocationData = {
        label: addressData.addressType.toUpperCase(),
        address: `${addressData.houseNo ? addressData.houseNo + ', ' : ''}${addressData.area}, ${addressData.city}${addressData.pincode ? ' - ' + addressData.pincode : ''}`,
        houseNumber: addressData.houseNo,
        area: addressData.area,
        city: addressData.city,
        pincode: addressData.pincode,
        lat: addressData.latitude,
        lng: addressData.longitude,
      };

      setLocation(newLoc);
      setShowMapPicker(false);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving address from modal map:', err);
      alert('Error saving address');
    }
  };

  if (showMapPicker) {
    return (
      <AddressMapPicker
        onSave={handleSaveFromMap}
        onCancel={() => setShowMapPicker(false)}
        defaultName={(userData?.display_name && !userData.display_name.toLowerCase().startsWith('member')) ? userData.display_name : ''}
        defaultPhone={userData?.phone_number || ''}
        existingLabels={savedAddresses.map(a => a.label)}
        initialLat={location.lat}
        initialLng={location.lng}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4 select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#022c22]/80 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={() => setIsModalOpen(false)}
      />

      {/* Bottom Sheet Card */}
      <div className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in slide-in-from-bottom duration-300 z-10">

        {/* Top Drag Handle Bar for mobile */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3 sm:hidden" />

        {/* Modal Header Bar matching updated UX specs */}
        <div className="px-6 py-4 bg-[#022c22] text-white flex items-center justify-between border-b border-amber-400/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#ffc400] text-[#004d3b] flex items-center justify-center font-black shrink-0 shadow-md">
              <MapPin size={22} className="fill-[#004d3b]" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wide text-[#ffc400]">Delivery location</h2>
              <p className="text-[11px] text-emerald-200/90 font-medium">Select address for fresh scheduled delivery</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-2 rounded-full hover:bg-emerald-900/80 text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto no-scrollbar space-y-4">

          {/* Search Location Bar (Placed at the very top) */}
          {/* Search Location Bar (Hidden for now) */}
          {false && (
            <div className="relative">
              <Search size={16} className="absolute left-4 top-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search apartment, colony, landmark (e.g. Banjara Hills, Gachibowli)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#ffc400] focus:bg-white rounded-2xl py-3 pl-10 pr-10 text-xs font-bold outline-none transition-all placeholder:font-medium placeholder:text-gray-400"
              />
              {isSearching ? (
                <Loader2 size={16} className="absolute right-3.5 top-4 text-[#004d3b] animate-spin" />
              ) : searchQuery ? (
                <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-4 text-gray-400">
                  <X size={16} />
                </button>
              ) : null}
            </div>
          )}

          {/* Action: Use Current Location (Clean row/card) */}
          <button
            onClick={handleGPSClick}
            disabled={isDetectingGPS}
            className="w-full bg-[#e5f5ef] hover:bg-[#d5efe5] border border-[#bce2d3] rounded-2xl p-3.5 flex items-center gap-3.5 transition-all active:scale-[0.98] text-left shadow-xs cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#004d3b] text-[#ffc400] flex items-center justify-center shrink-0 shadow-sm">
              {isDetectingGPS ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} className="fill-[#ffc400]" />}
            </div>
            <div>
              <p className="text-xs font-black text-[#004d3b]">Use current location</p>
              <p className="text-[10px] text-[#006b50] font-bold">Detect using device location</p>
            </div>
          </button>

          {/* Search Results (Hidden for now) */}
          {false && searchResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Search Results</h3>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-dashed divide-gray-200">
                {searchResults.map((item, i) => {
                  const mainTitle = item.structured_formatting?.main_text || item.description?.split(',')[0] || 'Location';
                  const subTitle = item.structured_formatting?.secondary_text || item.description || '';

                  return (
                    <div
                      key={i}
                      onClick={() => handleSelectPrediction(item)}
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
            </div>
          )}

          {/* Saved Customer Addresses & Add New Address */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Saved Addresses</h3>
              <button
                onClick={() => setShowMapPicker(true)}
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#004d3b] hover:underline cursor-pointer"
              >
                <Plus size={14} /> Add new address
              </button>
            </div>

            {savedAddresses.length > 0 && !searchQuery ? (
              <div className="space-y-2">
                {savedAddresses.map((addr, i) => {
                  const isSelected = location.address === addr.address;
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setLocation(addr);
                        setIsModalOpen(false);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#004d3b] text-white border-[#ffc400] shadow-md'
                          : 'bg-white border-gray-200 hover:border-[#004d3b] hover:bg-emerald-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#ffc400] text-[#004d3b]' : 'bg-[#e5f5ef] text-[#004d3b]'}`}>
                          {addr.label === 'WORK' ? <Briefcase size={15} /> : <Home size={15} />}
                        </div>
                        <div>
                          <span className={`text-xs font-black uppercase ${isSelected ? 'text-[#ffc400]' : 'text-gray-900'}`}>{addr.label}</span>
                          <p className={`text-[11px] truncate max-w-[220px] sm:max-w-[280px] ${isSelected ? 'text-emerald-100' : 'text-gray-600'}`}>{addr.address}</p>
                        </div>
                      </div>
                      {isSelected && <Check size={18} className="text-[#ffc400] shrink-0" />}
                    </div>
                  );
                })}
              </div>
            ) : (
              !searchQuery && (
                <button
                  onClick={() => setShowMapPicker(true)}
                  className="w-full bg-[#ffc400] hover:bg-[#f5b800] text-[#004d3b] rounded-2xl p-3.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm border border-amber-300 font-black text-xs cursor-pointer"
                >
                  <Plus size={16} /> Add new address
                </button>
              )
            )}
          </div>

          {/* Delivery Assurance Banner */}
          <div className="p-3.5 rounded-2xl bg-[#fefce8] border border-[#fef08a] flex items-center gap-3">
            <ShieldCheck size={20} className="text-[#854d0e] shrink-0" />
            <p className="text-[11px] font-bold text-[#854d0e] leading-tight">
              Fresh items are temperature-packed and delivered in insulated bags.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
