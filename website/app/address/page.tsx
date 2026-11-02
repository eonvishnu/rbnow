"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import { AddressMapPicker } from '@/app/components/AddressMapPicker';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Plus, 
  Trash2, 
  Home, 
  Briefcase, 
  Phone,
  Sparkles,
  Map
} from 'lucide-react';

export default function AddressesPage() {
  const { user, userData } = useAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const fetchAddresses = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAddresses(data.map(a => ({
          id: a.id,
          fullName: a.name,
          mobile: a.phone,
          addressLine1: a.house_no,
          addressLine2: a.area,
          landmark: a.landmark,
          city: a.city,
          pincode: a.pincode,
          latitude: a.latitude,
          longitude: a.longitude,
          type: a.address_type,
        })));
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleSaveFromMap = async (addressData: {
    fullName: string;
    mobile: string;
    houseNo: string;
    area: string;
    landmark: string;
    city: string;
    pincode: string;
    latitude: number;
    longitude: number;
    addressType: string;
  }) => {
    if (!user) return;

    try {
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

      if (error) throw error;

      setShowMapPicker(false);
      fetchAddresses();
    } catch (error) {
      console.error("Error saving address from map:", error);
      alert("Failed to save address");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this address?")) {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (!error) fetchAddresses();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-emerald-800 rounded-full animate-spin" />
        <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Loading Addresses...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-28 text-gray-900">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-100 px-6 py-4 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Link href="/" className="p-2 -ml-2 text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-full transition-all">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-emerald-950">Saved Addresses</h1>
            </div>
            {addresses.length > 0 && !showMapPicker && (
                <button 
                  onClick={() => setShowMapPicker(true)}
                  className="w-9 h-9 bg-emerald-800 text-amber-300 rounded-2xl flex items-center justify-center hover:bg-emerald-900 transition-colors shadow-md border border-amber-400/40"
                >
                    <Plus size={18} />
                </button>
            )}
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        
        {/* VIEW MODE: List Addresses */}
        {!showMapPicker ? (
            <div className="space-y-4">

                {/* Big Zepto-style Map Add Button */}
                <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 border-2 border-amber-400/80 rounded-[28px] p-6 text-white shadow-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Sparkles size={10} /> Express Pinning
                    </span>
                    <h2 className="text-lg font-black uppercase text-amber-300 tracking-tight">Select Location on Map</h2>
                    <p className="text-xs text-emerald-200 font-medium">Search place & set exact delivery pin</p>
                  </div>

                  <button
                    onClick={() => setShowMapPicker(true)}
                    className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-5 py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all active:scale-95 shrink-0"
                  >
                    <Map size={16} /> Open Map
                  </button>
                </div>

                {addresses.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm">
                        <div className="w-20 h-20 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-center mx-auto mb-6">
                            <MapPin className="text-emerald-700" size={40} />
                        </div>
                        <h3 className="text-gray-900 font-black text-xl uppercase tracking-tight">No Saved Addresses</h3>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-2 mb-8">Pin delivery location on map for express checkout</p>
                        <button 
                            onClick={() => setShowMapPicker(true)}
                            className="bg-emerald-800 text-amber-300 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/20 hover:bg-emerald-900 transition-all flex items-center gap-2 mx-auto"
                        >
                            <Map size={16} /> Pin Address on Map
                        </button>
                    </div>
                ) : (
                    addresses.map((addr) => (
                        <div key={addr.id} className="bg-white border border-amber-200/80 rounded-[28px] p-5 shadow-sm hover:shadow-md transition-all group relative">
                            
                            {/* Type Badge */}
                            <div className="absolute top-5 right-5 flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${
                                    addr.type === 'work' 
                                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                    : 'bg-emerald-50 text-emerald-800 border border-amber-200'
                                }`}>
                                    {addr.type === 'work' ? <Briefcase size={10} /> : <Home size={10} />}
                                    {addr.type}
                                </span>
                            </div>

                            <div className="flex items-start gap-4 pr-20">
                                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-800 border border-amber-200 shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 text-base">{addr.fullName}</h3>
                                    <p className="text-gray-600 text-xs font-medium mt-1 leading-relaxed">
                                        {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}
                                        {addr.landmark && `${addr.landmark}, `} <br />
                                        {addr.city} - <span className="font-extrabold text-gray-900">{addr.pincode}</span>
                                    </p>

                                    {addr.latitude && addr.longitude && (
                                      <p className="text-[10px] font-bold text-emerald-800 bg-emerald-50/80 px-2.5 py-0.5 rounded-md inline-block mt-2 border border-emerald-200">
                                        📍 Map Coordinates: {addr.latitude.toFixed(4)}, {addr.longitude.toFixed(4)}
                                      </p>
                                    )}

                                    <p className="text-xs font-bold text-gray-400 mt-3 flex items-center gap-1">
                                        <Phone size={12} /> {addr.mobile}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                                <button 
                                    onClick={() => handleDelete(addr.id)}
                                    className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        ) : (
            // INTERACTIVE MAP PICKER MODE
            <AddressMapPicker
              onSave={handleSaveFromMap}
              onCancel={() => setShowMapPicker(false)}
              defaultName={userData?.display_name || user?.email || ''}
              defaultPhone={userData?.phone_number || ''}
              existingLabels={addresses.map(a => a.type.toUpperCase())}
            />
        )}

      </div>
    </main>
  );
}
