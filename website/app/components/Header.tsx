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
  MessageCircle,
  Phone,
  Package,
  ShoppingBag
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

      // 2. Fetch store settings
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
  };

  return (
    <div className="w-full bg-[#F4EFE6] text-[#2C241D] relative shadow-md border-b border-[#E3D9C6]">
      
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
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 p-0.5 shadow-md shrink-0">
              <div className="w-full h-full rounded-full bg-[#FAF6EE] flex items-center justify-center border border-amber-500/40 overflow-hidden">
                <img src="/logo.png" alt="Royal Bengal Crown" className="w-full h-full object-cover rounded-full scale-105" />
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-base sm:text-xl font-serif font-black tracking-widest text-emerald-800 leading-tight ">
                The  Royal Bengal Fresh
              </h1>
              <p className="text-[10px] text-emerald-800 font-semibold tracking-wide text-center w-full">
                <span>রুচিশীল বাঙালির রাজকীয় স্বাদ</span>
              </p>
            </div>
          </div>

          {/* Right Actions: Desktop Quick Nav & Support Popover */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Desktop Quick Nav Links (hidden on mobile, shown on md+) */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/orders"
                className="px-3 py-1.5 rounded-xl bg-[#EFE8DC] hover:bg-[#E2D7C5] border border-amber-600/30 text-amber-900 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Package size={14} /> Orders
              </Link>

              <Link
                href="/cart"
                className="px-3 py-1.5 rounded-xl bg-[#EFE8DC] hover:bg-[#E2D7C5] border border-amber-600/30 text-amber-900 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors relative"
              >
                <ShoppingBag size={14} /> Cart
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>

              <Link
                href={user ? '/account' : '/login'}
                className="px-3 py-1.5 rounded-xl bg-[#EFE8DC] hover:bg-[#E2D7C5] border border-amber-600/30 text-amber-900 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <User size={14} /> {user ? 'Account' : 'Login'}
              </Link>
            </div>

            {/* Customer Support Popover */}
            <div className="relative">
              <button
                onClick={() => setIsSupportOpen(!isSupportOpen)}
                aria-label="Customer Support Concierge"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EFE8DC] border-2 border-amber-600 flex items-center justify-center text-amber-800 shadow-md hover:bg-[#E2D7C5] transition-transform active:scale-95"
              >
                <Headphones size={18} />
              </button>

              {isSupportOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSupportOpen(false)} />
                  <div className="absolute right-0 mt-3 w-64 bg-[#FFFDF9] text-gray-900 border-2 border-amber-300 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3.5 bg-emerald-950 text-white">
                      <p className="text-[9px] font-black uppercase text-amber-300 tracking-widest">ROYAL CONCIERGE</p>
                      <h3 className="text-xs font-black uppercase text-white mt-0.5">Customer Support</h3>
                    </div>

                    <div className="p-2 space-y-1">
                      {/* WHATSAPP US */}
                      <a
                        href="https://wa.me/916304076069"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsSupportOpen(false)}
                        className="p-3 rounded-xl hover:bg-amber-50 flex items-center gap-3 transition-colors text-left block"
                      >
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          <MessageCircle size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase text-gray-900 leading-tight">WHATSAPP US</p>
                          <p className="text-[10px] text-gray-500 font-medium">Instant chat support</p>
                        </div>
                      </a>

                      {/* CALL US */}
                      <a
                        href="tel:+916304076069"
                        onClick={() => setIsSupportOpen(false)}
                        className="p-3 rounded-xl hover:bg-amber-50 flex items-center gap-3 transition-colors text-left block"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
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

        </div>

        {/* SEARCH BAR & LOCATION STRIP */}
        <div className="mt-3 space-y-1.5">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search cuts, fresh catch & delicacies..."
              className="w-full bg-[#FFFDF9] text-gray-900 border border-[#E3D9C6] rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none shadow-sm placeholder:text-gray-400 placeholder:font-medium focus:border-amber-500"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-900 hover:text-amber-950 transition-colors py-0.5"
          >
            <MapPin size={16} className="text-amber-700 fill-amber-500/20 shrink-0" />
            <span className="truncate max-w-[280px] sm:max-w-xl text-amber-800 font-extrabold">
              Deliver to: <span className="font-black uppercase tracking-wider text-emerald-950">{location.label ? location.label.toUpperCase() : 'SELECT LOCATION'}</span>
              {(location.address || location.area) && (
                <span className="font-medium text-black/90"> - {location.address || `${location.houseNumber ? location.houseNumber + ', ' : ''}${location.area || ''}, ${location.city || ''}`}</span>
              )}
            </span>
            <ChevronDown size={14} className="text-amber-400 shrink-0" />
          </button>
        </div>

      </div>

      {bottomSlot && (
        <div className="w-full px-4 py-2 border-t border-emerald-100 bg-white">
          {bottomSlot}
        </div>
      )}

    </div>
  );
};
