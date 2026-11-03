"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { useLocation } from '@/context/LocationContext';
import { useCart } from '@/context/CartProvider';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  Wallet,
  MapPin,
  ChevronDown,
  Sparkles,
  Headphones,
  User,
  Search,
  Calendar,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Phone
} from 'lucide-react';

const STATIC_OPTS = [
  { id: 'all', name: "All", icon: "🛍️", isStatic: true },
];

interface HeaderProps {
  activeCategory: string;
  onCategoryChange: (id: string, name: string) => void;
  bottomSlot?: React.ReactNode; 
}

export const Header = ({ activeCategory, onCategoryChange, bottomSlot }: HeaderProps) => {
  const { user } = useAuth();
  const { location, setIsModalOpen } = useLocation();
  const { cart } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);
  const [preorderCampaigns, setPreorderCampaigns] = useState<any[]>([]);
  const [storeStatus, setStoreStatus] = useState({ isOpen: true, message: "" });
  const [storeCredit, setStoreCredit] = useState(0);

  useEffect(() => {
    if (!user) {
      setStoreCredit(0);
      return;
    }

    const fetchCredit = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('id', user.id)
        .single();

      if (data) {
        setStoreCredit(0);
      }
    };

    fetchCredit();
  }, [user]);

  useEffect(() => {
    const loadHeaderData = async () => {
      // 1. Fetch categories
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (catData) {
        const parentCategories = catData.filter(c => !c.parent_id);
        setDynamicCategories(parentCategories.map(c => ({ id: c.id, name: c.name, imageUrl: c.image_url })));
      }

      // 2. Fetch active pre-order campaigns dynamically
      const { data: preorders } = await supabase
        .from('preorder_campaigns')
        .select('*, product_variants(*, products(*))')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (preorders) {
        setPreorderCampaigns(preorders);
      }

      // 3. Fetch store settings
      const { data: storeData } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 'default')
        .single();

      if (storeData) {
        setStoreStatus({ isOpen: storeData.is_store_open, message: storeData.is_store_open ? "" : "Store Closed Currently" });
      }
    };

    loadHeaderData();
  }, []);

  const displayCategories = [...STATIC_OPTS, ...dynamicCategories];
  const featuredCampaign = preorderCampaigns.length > 0 ? preorderCampaigns[0] : null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
  };

  return (
    <div className="w-full bg-[#022c22] text-white relative shadow-xl">
      
      {/* Closed Banner */}
      {!storeStatus.isOpen && (
        <div className="bg-rose-700 text-white text-[10px] font-bold text-center py-1.5 px-4 uppercase tracking-wider">
          {storeStatus.message || "Store Closed Currently"}
        </div>
      )}

      {/* REGAL BRAND HEADER BAR */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-4 pt-3.5 pb-2">
        <div className="flex items-center justify-between">

          {/* Crown Logo & Regal Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 p-0.5 shadow-md shrink-0">
              <div className="w-full h-full rounded-full bg-[#022c22] flex items-center justify-center p-1 border border-amber-300/40">
                <img src="/logo.png" alt="Royal Bengal Crown" className="w-full h-full object-contain" />
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-base sm:text-xl font-serif font-black tracking-widest text-amber-400 leading-tight uppercase">
                ROYAL BENGAL
              </h1>
              <p className="text-[10px] text-amber-200 font-semibold tracking-wide flex items-center gap-1">
                <span>রুচিশীল বাঙালির রাজকীয় স্বাদ</span>
              </p>
            </div>
          </div>

          {/* Right Action: Customer Support Popover (Matching rbnow.in screenshot) */}
          <div className="relative">
            <button
              onClick={() => setIsSupportOpen(!isSupportOpen)}
              aria-label="Customer Support Concierge"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#004d3b] border-2 border-[#ffc400] flex items-center justify-center text-[#ffc400] shadow-md hover:bg-[#00382b] transition-transform active:scale-95"
            >
              <Headphones size={18} />
            </button>

            {isSupportOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsSupportOpen(false)} />
                <div className="absolute right-0 mt-3 w-64 bg-white text-gray-900 border-2 border-amber-300 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3.5 bg-[#00382b] text-white">
                    <p className="text-[9px] font-black uppercase text-[#ffc400] tracking-widest">ROYAL CONCIERGE</p>
                    <h3 className="text-xs font-black uppercase text-white mt-0.5">Customer Support</h3>
                  </div>

                  <div className="p-2 space-y-1">
                    {/* WHATSAPP US */}
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsSupportOpen(false)}
                      className="p-3 rounded-xl hover:bg-emerald-50 flex items-center gap-3 transition-colors text-left block"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#e5f5ef] text-[#006b50] flex items-center justify-center shrink-0">
                        <MessageCircle size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-gray-900 leading-tight">WHATSAPP US</p>
                        <p className="text-[10px] text-gray-500 font-medium">Instant chat support</p>
                      </div>
                    </a>

                    {/* CALL US */}
                    <a
                      href="tel:+919876543210"
                      onClick={() => setIsSupportOpen(false)}
                      className="p-3 rounded-xl hover:bg-emerald-50 flex items-center gap-3 transition-colors text-left block"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#fefce8] text-[#854d0e] flex items-center justify-center shrink-0">
                        <Phone size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-gray-900 leading-tight">CALL US</p>
                        <p className="text-[10px] text-gray-500 font-medium">Direct phone support</p>
                      </div>
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

        {/* SEARCH BAR & LOCATION STRIP */}
        <div className="mt-3 space-y-1.5">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search cuts, fresh catch & delicacies..."
              className="w-full bg-white text-gray-900 border-0 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none shadow-sm placeholder:text-gray-400 placeholder:font-medium"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 transition-colors py-0.5"
          >
            <MapPin size={14} className="text-amber-400 fill-amber-400/40 shrink-0" />
            <span className="truncate max-w-[280px] sm:max-w-md text-amber-300 font-extrabold">
              Deliver to: <span className="font-black uppercase tracking-wider text-amber-300">{location.label ? location.label.toUpperCase() : 'SELECT LOCATION'}</span>
              {(location.address || location.area) && (
                <span className="font-medium text-white/90"> - {location.address || `${location.houseNumber ? location.houseNumber + ', ' : ''}${location.area || ''}, ${location.city || ''}`}</span>
              )}
            </span>
            <ChevronDown size={12} className="text-amber-400 shrink-0" />
          </button>
        </div>

      </div>

      {/* CATEGORY CIRCLES WITH GLOWING GOLD ACTIVE RING - STICKY TOP */}
      <div className="bg-white text-gray-900 pt-3.5 pb-3 border-b border-amber-100 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex gap-3.5 sm:gap-5 overflow-x-auto no-scrollbar snap-x">
          {displayCategories.map((cat) => {
            const isActive = activeCategory === cat.id || activeCategory === cat.name;

            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id, cat.name)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 transition-transform active:scale-95 snap-start group"
              >
                <div className={`w-13 h-13 sm:w-16 sm:h-16 rounded-full flex items-center justify-center p-0.5 transition-all duration-300 relative
                  ${isActive
                    ? "bg-gradient-to-tr from-amber-300 via-amber-400 to-amber-500 shadow-md shadow-amber-400/20 scale-105"
                    : "bg-gray-100 hover:bg-gray-200"}`}
                >
                  <div className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center transition-all ${
                    isActive ? "bg-emerald-950 text-amber-300" : "bg-gray-50 text-gray-700"
                  }`}>
                    {cat.imageUrl ? (
                      <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl sm:text-2xl">{cat.icon || "🍽️"}</span>
                    )}
                  </div>
                </div>

                <span className={`text-[11px] font-bold text-center max-w-[70px] truncate transition-colors ${
                  isActive ? "text-emerald-950 font-black" : "text-gray-600"
                }`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* COMPACT & RESPONSIVE DYNAMIC HERO PRE-ORDER BANNER CARD */}
      {featuredCampaign && (
        <div className="bg-gray-50 px-3.5 py-3 border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-emerald-50 via-amber-50/50 to-emerald-50 border border-amber-300/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-sm relative overflow-hidden flex items-center justify-between gap-3 sm:gap-6">

              <div className="space-y-1.5 flex-1 min-w-0 z-10">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-900 text-amber-300 text-[8px] sm:text-[9px] font-black uppercase tracking-widest shadow-sm">
                  <Sparkles size={10} /> PRE-ORDER
                </span>

                <h2 className="text-sm sm:text-lg font-black uppercase tracking-tight text-emerald-950 truncate leading-tight">
                  {featuredCampaign.name}
                </h2>

                <p className="text-[10px] sm:text-xs font-extrabold text-emerald-800 truncate">
                  {featuredCampaign.product_variants?.products?.name} ({featuredCampaign.product_variants?.unit}) • ₹{featuredCampaign.price}
                </p>

                <div className="flex items-center gap-1.5 text-[9px] sm:text-[11px] font-black text-emerald-900 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-amber-200 inline-flex shadow-2xs">
                  <Calendar size={12} className="text-amber-500 shrink-0" />
                  <span>Expected: <strong className="text-amber-700">{new Date(featuredCampaign.expected_available_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</strong></span>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => {
                      const category = featuredCampaign.product_variants?.products?.category_name;
                      if (category) onCategoryChange(category, category);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="bg-emerald-900 hover:bg-emerald-950 text-amber-300 font-black text-[10px] sm:text-xs px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    Pre-Order Now <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              {/* Compact Banner Image */}
              <div className="relative w-24 h-24 sm:w-40 sm:h-32 shrink-0 flex items-center justify-center">
                <span className="absolute top-1 right-1 bg-amber-400 text-emerald-950 font-black text-[7px] sm:text-[8px] px-2 py-0.5 rounded-full uppercase shadow-xs z-10">
                  RESERVE
                </span>
                <img
                  src={featuredCampaign.product_variants?.products?.image_url || "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80"}
                  alt={featuredCampaign.name}
                  className="w-full h-full object-cover rounded-xl border border-amber-200 shadow-sm"
                />
              </div>

            </div>
          </div>
        </div>
      )}

      {bottomSlot && (
        <div className="w-full px-4 py-2 border-t border-emerald-100 bg-white">
          {bottomSlot}
        </div>
      )}

    </div>
  );
};
