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
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&limit=6`);
        const data = await res.json();
        setSearchResults(data || []);
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
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);

    const parts = item.display_name.split(',');
    const area = parts[0]?.trim() || 'Selected Area';
    const city = parts[1]?.trim() || parts[2]?.trim() || '';
    const postcode = item.address?.postcode || '';

    const newLoc: LocationData = {
      label: area,
      address: item.display_name,
      area,
      city,
      pincode: postcode,
      lat,
      lng,
    };

    setLocation(newLoc);
    setIsModalOpen(false);
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
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-emerald-950/70 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={() => setIsModalOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl border border-amber-200/80 animate-in slide-in-from-bottom duration-300 z-10">

        {/* Top Handle for mobile */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3 sm:hidden" />

        {/* Modal Header */}
        <div className="px-6 pt-3 pb-4 border-b border-gray-100 flex items-center justify-between bg-emerald-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black shrink-0 shadow-md">
              <MapPin size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-amber-300 uppercase">Delivery Location</h2>
                <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-800 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                  <Sparkles size={10} /> 20-30 MINS
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 font-medium">Select address for express fresh delivery</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-2 rounded-full hover:bg-emerald-900 text-emerald-200 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto no-scrollbar space-y-5">

          {/* Action Row: Use GPS + Add New Address on Map */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* GPS Auto Detect Button */}
            <button
              onClick={handleGPSClick}
              disabled={isDetectingGPS}
              className="bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 rounded-2xl p-3.5 flex items-center gap-3 transition-all active:scale-[0.98] text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 shadow-sm">
                {isDetectingGPS ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} className="fill-amber-300" />}
              </div>
              <div>
                <p className="text-xs font-black text-emerald-950 uppercase tracking-wide">Use GPS Location</p>
                <p className="text-[10px] text-emerald-700 font-medium">Auto-detect pin</p>
              </div>
            </button>

            {/* Add New Address on Map Button */}
            <button
              onClick={() => setShowMapPicker(true)}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 border border-amber-500 rounded-2xl p-3.5 flex items-center gap-3 transition-all active:scale-[0.98] text-left shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-950 text-amber-300 flex items-center justify-center shrink-0 shadow-sm">
                <Map size={18} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-emerald-950">+ Add New Address</p>
                <p className="text-[10px] font-bold text-emerald-900">Pin location on map</p>
              </div>
            </button>
          </div>

          {/* Search Location Bar */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search area, landmark, colony, or pincode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-amber-400 focus:bg-white rounded-2xl py-3.5 pl-11 pr-10 text-xs font-bold outline-none transition-all placeholder:font-medium placeholder:text-gray-400"
            />
            {isSearching ? (
              <Loader2 size={16} className="absolute right-3.5 top-3.5 text-emerald-800 animate-spin" />
            ) : searchQuery ? (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-3.5 text-gray-400">
                <X size={16} />
              </button>
            ) : null}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Search Results</h3>
              <div className="space-y-1.5 border border-amber-200/80 rounded-2xl overflow-hidden divide-y divide-gray-100">
                {searchResults.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectSearchResult(item)}
                    className="p-3.5 hover:bg-emerald-50 cursor-pointer flex items-center gap-3 transition-colors text-xs"
                  >
                    <MapPin size={16} className="text-amber-500 shrink-0" />
                    <p className="font-bold text-gray-800 truncate">{item.display_name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Customer Addresses */}
          {savedAddresses.length > 0 && !searchQuery && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Saved Addresses</h3>
                <button
                  onClick={() => setShowMapPicker(true)}
                  className="text-[10px] font-black text-emerald-800 hover:text-emerald-950 uppercase tracking-wider flex items-center gap-1"
                >
                  <Plus size={12} /> Add Address
                </button>
              </div>

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
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-900 text-white border-amber-400 shadow-md'
                          : 'bg-white border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
                          {addr.label === 'WORK' ? <Briefcase size={16} /> : <Home size={16} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-black uppercase ${isSelected ? 'text-amber-300' : 'text-gray-900'}`}>{addr.label}</span>
                          </div>
                          <p className={`text-[11px] truncate max-w-[240px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-gray-600'}`}>{addr.address}</p>
                        </div>
                      </div>
                      {isSelected && <Check size={18} className="text-amber-300 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Delivery Assurance */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center gap-3">
            <ShieldCheck size={20} className="text-amber-600 shrink-0" />
            <p className="text-[11px] font-bold text-amber-900 leading-tight">
              Fresh items are temperature-packed & delivered in insulated bags directly to your selected location.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
