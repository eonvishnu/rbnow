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

  // Real-time Autocomplete Location Search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDwr-cKcQ4nQFEVWwk7UI3cdRbEdLIcc4g';
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&components=country:IN&key=${apiKey}`);
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (err) {
        console.error("Location search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isModalOpen) return null;

  const handleGPSClick = async () => {
    const loc = await detectGPSLocation();
    if (loc) {
      setIsModalOpen(false);
    }
  };

  const handleSelectSearchResult = (item: any) => {
    if (item.geometry && item.geometry.location) {
      const lat = item.geometry.location.lat;
      const lng = item.geometry.location.lng;
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
        label: area || 'Selected Location',
        address: fullAddress,
        area: area || 'Selected Area',
        city: city || 'Hyderabad',
        pincode: pincode || '500081',
        lat,
        lng,
      };

      setLocation(newLoc);
      setIsModalOpen(false);
    }
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
        defaultName={userData?.display_name || user?.email || ''}
        defaultPhone={userData?.phone_number || ''}
        existingLabels={savedAddresses.map(a => a.label)}
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

        {/* Modal Header Bar matching rbnow.in screenshot */}
        <div className="px-6 py-4 border-b border-emerald-900 bg-[#022c22] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#ffc400] text-[#004d3b] flex items-center justify-center font-black shrink-0 shadow-md">
              <MapPin size={22} className="fill-[#004d3b]" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wider text-[#ffc400] uppercase">DELIVERY LOCATION</h2>
              <p className="text-[11px] text-emerald-200/90 font-medium">Select address for fresh scheduled delivery</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-2 rounded-full hover:bg-emerald-900/80 text-emerald-200 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto no-scrollbar space-y-4">

          {/* Action 1: USE MY CURRENT LOCATION (Mint Card) */}
          <button
            onClick={handleGPSClick}
            disabled={isDetectingGPS}
            className="w-full bg-[#e5f5ef] hover:bg-[#d5efe5] border border-[#bce2d3] rounded-2xl p-3.5 flex items-center gap-3.5 transition-all active:scale-[0.98] text-left shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#004d3b] text-[#ffc400] flex items-center justify-center shrink-0 shadow-sm">
              {isDetectingGPS ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} className="fill-[#ffc400]" />}
            </div>
            <div>
              <p className="text-xs font-black text-[#004d3b] uppercase tracking-wider">USE MY CURRENT LOCATION</p>
              <p className="text-[10px] text-[#006b50] font-bold">GPS location</p>
            </div>
          </button>

          {/* Action 2: + ADD NEW ADDRESS (Bright Gold Button) */}
          <button
            onClick={() => setShowMapPicker(true)}
            className="w-full bg-[#ffc400] hover:bg-[#f5b800] text-[#004d3b] rounded-2xl p-3.5 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-md border border-amber-300"
          >
            <div className="w-7 h-7 rounded-full bg-[#004d3b] text-[#ffc400] flex items-center justify-center shrink-0 shadow-xs font-black">
              <Plus size={16} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">+ ADD NEW ADDRESS</span>
          </button>

          {/* Search Location Bar */}
          <div className="relative pt-1">
            <Search size={16} className="absolute left-4 top-4.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search colony, street, landmark..."
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

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Search Results</h3>
              <div className="space-y-1.5 border border-amber-200/80 rounded-2xl overflow-hidden divide-y divide-gray-100">
                {searchResults.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectSearchResult(item)}
                    className="p-3.5 hover:bg-emerald-50 cursor-pointer flex items-center gap-3 transition-colors text-xs"
                  >
                    <MapPin size={16} className="text-[#ffc400] shrink-0 fill-[#ffc400]/40" />
                    <p className="font-bold text-gray-800 truncate">{item.formatted_address}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Customer Addresses */}
          {savedAddresses.length > 0 && !searchQuery && (
            <div className="space-y-2.5 pt-1">
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Saved Addresses</h3>

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
            </div>
          )}

          {/* Delivery Assurance Banner matching rbnow.in screenshot */}
          <div className="p-3.5 rounded-2xl bg-[#fefce8] border border-[#fef08a] flex items-center gap-3">
            <ShieldCheck size={20} className="text-[#854d0e] shrink-0" />
            <p className="text-[11px] font-bold text-[#854d0e] leading-tight">
              Fresh items are temperature-packed & delivered in insulated bags directly to your selected location.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
