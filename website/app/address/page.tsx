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
  CheckCircle2,
  Navigation,
  Building,
  Check
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
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAddresses(data.map(a => ({
          id: a.id,
          fullName: a.name,
          mobile: a.phone,
          addressLine1: a.house_no,
          buildingName: a.building_name,
          addressLine2: a.area,
          landmark: a.landmark,
          city: a.city,
          pincode: a.pincode,
          latitude: a.latitude,
          longitude: a.longitude,
          type: a.address_type || 'home',
          isDefault: a.is_default || false,
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
    buildingName: string;
    area: string;
    landmark: string;
    city: string;
    pincode: string;
    latitude: number;
    longitude: number;
    addressType: string;
    isDefault: boolean;
  }) => {
    if (!user) return;

    try {
      if (addressData.isDefault || addresses.length === 0) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { error } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          name: addressData.fullName,
          phone: addressData.mobile,
          house_no: addressData.houseNo,
          building_name: addressData.buildingName,
          area: addressData.area,
          landmark: addressData.landmark,
          city: addressData.city,
          pincode: addressData.pincode,
          latitude: addressData.latitude,
          longitude: addressData.longitude,
          address_type: addressData.addressType,
          is_default: addressData.isDefault || addresses.length === 0,
        });

      if (error) throw error;

      setShowMapPicker(false);
      fetchAddresses();
    } catch (error) {
      console.error("Error saving address from map:", error);
      alert("Failed to save address");
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    try {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);

      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (!error) fetchAddresses();
    } catch (err) {
      console.error('Failed to set default address:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (!error) fetchAddresses();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7F6] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-[#004D3B] rounded-full animate-spin" />
        <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Loading Saved Addresses...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7F6] pb-28 text-gray-900 font-sans">
      
      {/* Header Banner */}
      <header className="sticky top-0 z-30 bg-[#004D3B] text-white px-6 py-5 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Link href="/" className="p-2 -ml-2 text-amber-300 hover:text-white hover:bg-white/10 rounded-full transition-all">
                    <ArrowLeft size={22} />
                </Link>
                <div>
                  <h1 className="text-lg sm:text-xl font-serif font-black uppercase tracking-wider text-white">Saved Addresses</h1>
                  <p className="text-[10px] text-amber-200/90 font-bold uppercase tracking-widest hidden sm:block">Manage your express delivery locations</p>
                </div>
            </div>
            {!showMapPicker && (
                <button 
                  onClick={() => setShowMapPicker(true)}
                  className="bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-amber-300 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md border border-amber-400/40 inline-flex items-center gap-2 cursor-pointer"
                >
                    <Plus size={16} /> <span>Add New</span>
                </button>
            )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* VIEW MODE: List Addresses */}
        {!showMapPicker ? (
            <div className="space-y-4">

                {addresses.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-[#E3EAE6] rounded-3xl p-8 shadow-sm space-y-5">
                        <div className="w-20 h-20 bg-[#F5F7F6] rounded-3xl border border-[#E3EAE6] flex items-center justify-center mx-auto text-[#004D3B]">
                            <MapPin size={40} />
                        </div>
                        <div>
                          <h3 className="text-gray-900 font-black text-lg uppercase tracking-tight">No Saved Addresses Found</h3>
                          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1 max-w-sm mx-auto">Pin your location on map for instant 1-click express checkout</p>
                        </div>
                        <button 
                            onClick={() => setShowMapPicker(true)}
                            className="bg-[#004D3B] hover:bg-[#00382B] text-amber-300 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
                        >
                            <Plus size={16} /> Add Delivery Address
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div key={addr.id} className={`bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative ${addr.isDefault ? 'border-[#004D3B] ring-2 ring-[#004D3B]/10' : 'border-[#E3EAE6]'}`}>
                            
                            {/* Badges Header */}
                            <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                                    addr.type === 'work' 
                                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                    : addr.type === 'home'
                                    ? 'bg-emerald-50 text-[#004D3B] border border-emerald-200'
                                    : 'bg-purple-50 text-purple-800 border border-purple-200'
                                }`}>
                                    {addr.type === 'work' ? <Briefcase size={11} /> : addr.type === 'home' ? <Home size={11} /> : <Building size={11} />}
                                    {addr.type}
                                </span>
                                {addr.isDefault && (
                                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
                                    <Sparkles size={10} /> Default
                                  </span>
                                )}
                              </div>

                              <button
                                  onClick={() => handleDelete(addr.id)}
                                  className="text-gray-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                                  title="Delete address"
                              >
                                  <Trash2 size={16} />
                              </button>
                            </div>

                            {/* Address Details */}
                            <div className="space-y-2 flex-1">
                              <h3 className="font-black text-gray-900 text-base">{addr.fullName}</h3>
                              <p className="text-gray-700 text-xs font-medium leading-relaxed">
                                <span className="font-bold text-gray-900">{addr.addressLine1}</span>
                                {addr.buildingName ? `, ${addr.buildingName}` : ''}
                                {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                                {addr.landmark ? ` (Near ${addr.landmark})` : ''}
                                <br />
                                {addr.city} - <span className="font-black text-gray-900">{addr.pincode}</span>
                              </p>

                              {addr.latitude && addr.longitude && (
                                <p className="text-[10px] font-bold text-[#004D3B] bg-emerald-50 px-2.5 py-1 rounded-lg inline-flex items-center gap-1 border border-emerald-200">
                                  <Navigation size={10} /> GPS Pinned: {addr.latitude.toFixed(4)}, {addr.longitude.toFixed(4)}
                                </p>
                              )}

                              <p className="text-xs font-bold text-gray-500 flex items-center gap-1 pt-1">
                                  <Phone size={12} className="text-emerald-800" /> +91 {addr.mobile}
                              </p>
                            </div>

                            {/* Footer Action: Set Default */}
                            {!addr.isDefault && (
                              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                                <button
                                  onClick={() => handleSetDefault(addr.id)}
                                  className="text-xs font-bold text-[#004D3B] hover:text-[#00382B] hover:underline inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Check size={13} /> Set as default address
                                </button>
                              </div>
                            )}

                        </div>
                      ))}
                    </div>
                )}
            </div>
        ) : (
            /* INTERACTIVE MAP PICKER MODE */
            <AddressMapPicker
              onSave={handleSaveFromMap}
              onCancel={() => setShowMapPicker(false)}
              defaultName={(userData?.display_name && !userData.display_name.toLowerCase().startsWith('member')) ? userData.display_name : ''}
              defaultPhone={userData?.phone_number || ''}
              existingLabels={addresses.map(a => (a.type || '').toUpperCase())}
            />
        )}

      </div>
    </main>
  );
}
