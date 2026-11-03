"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Wallet,
  ShieldCheck,
  Headphones,
  LogOut,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Crown,
  FileText
} from 'lucide-react';

export default function AccountPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const [storeCredit, setStoreCredit] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [addressesCount, setAddressesCount] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/account');
      return;
    }

    if (user) {
      const fetchAccountStats = async () => {
        try {
          // 1. Fetch Orders Count
          const { count: oCount } = await supabase
            .from('orders')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id);

          if (oCount !== null) setOrdersCount(oCount);

          // 2. Fetch Addresses Count
          const { count: aCount } = await supabase
            .from('addresses')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id);

          if (aCount !== null) setAddressesCount(aCount);
        } catch (err) {
          console.error('Error fetching account details:', err);
        }
      };

      fetchAccountStats();
    }
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-emerald-800 rounded-full animate-spin" />
        <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Loading Account...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center text-gray-900">
        <div className="w-20 h-20 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-center mb-6 shadow-md">
          <User className="text-emerald-800" size={36} />
        </div>
        <h2 className="text-2xl font-black text-emerald-950 uppercase tracking-tight">Sign In to Your Account</h2>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-2 mb-8 max-w-xs">
          Manage saved addresses, view receipts & access store credit
        </p>
        <Link
          href="/login?redirect=/account"
          className="bg-emerald-800 text-amber-300 font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/20 hover:bg-emerald-900 transition-all flex items-center gap-2"
        >
          <Crown size={16} /> Sign In / Register
        </Link>
      </main>
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
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-emerald-950">My Account</h1>
          </div>

          <span className="text-[9px] font-black uppercase tracking-widest bg-amber-400 text-emerald-950 px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
            <Crown size={12} /> Member
          </span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">

        {/* User Identity Card */}
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 rounded-[32px] border-2 border-amber-400/80 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-emerald-950 font-black text-2xl flex items-center justify-center shrink-0 shadow-lg border-2 border-amber-300">
              {userData?.display_name?.charAt(0).toUpperCase() || 'M'}
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black uppercase text-amber-300 tracking-tight truncate">
                  {userData?.display_name || 'Royal Member'}
                </h2>
                {userData?.role === 'admin' && (
                  <span className="bg-amber-400 text-emerald-950 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                    Admin
                  </span>
                )}
              </div>

              <p className="text-xs text-emerald-200 font-medium truncate mt-0.5 flex items-center gap-1.5">
                <Mail size={12} className="text-amber-400 shrink-0" /> {user.email}
              </p>

              {userData?.phone_number && (
                <p className="text-xs text-emerald-200 font-medium truncate mt-1 flex items-center gap-1.5">
                  <Phone size={12} className="text-amber-400 shrink-0" /> +91 {userData.phone_number}
                </p>
              )}
            </div>
          </div>

          {/* Quick Wallet Bar */}
          <div className="mt-5 pt-4 border-t border-emerald-800/80 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-amber-400" />
              <span className="font-bold text-emerald-200">Store Credit:</span>
              <span className="font-black text-amber-300 text-sm">₹{storeCredit}</span>
            </div>

            <button onClick={() => alert("Store credit balance is updated automatically on order returns and cashbacks.")} className="text-[10px] font-black uppercase text-amber-300 bg-emerald-800/80 hover:bg-emerald-800 px-3 py-1.5 rounded-xl border border-amber-400/30">
              Wallet Details
            </button>
          </div>
        </div>

        {/* Account Action Cards List */}
        <div className="bg-white border border-amber-200/80 rounded-[32px] shadow-sm overflow-hidden divide-y divide-gray-100">

          {/* Orders Link */}
          <Link href="/orders" className="p-4 sm:p-5 hover:bg-emerald-50/50 flex items-center justify-between transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0">
                <Package size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-gray-900 text-sm uppercase">My Orders & Receipts</h3>
                  {ordersCount > 0 && (
                    <span className="bg-emerald-800 text-amber-300 text-[9px] font-black px-2 py-0.5 rounded-full">
                      {ordersCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-medium">Track active dispatches and order history</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Saved Addresses Link */}
          <Link href="/address" className="p-4 sm:p-5 hover:bg-emerald-50/50 flex items-center justify-between transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-gray-900 text-sm uppercase">Saved Addresses</h3>
                  {addressesCount > 0 && (
                    <span className="bg-amber-400 text-emerald-950 text-[9px] font-black px-2 py-0.5 rounded-full">
                      {addressesCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-medium">Manage home, work & map pin locations</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Admin Workspace Link (If Admin) */}
          {userData?.role === 'admin' && (
            <Link href="/admin" className="p-4 sm:p-5 hover:bg-emerald-50/50 flex items-center justify-between transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-950 text-amber-300 border border-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                  <Crown size={22} />
                </div>
                <div>
                  <h3 className="font-black text-emerald-950 text-sm uppercase">Super Admin Workspace</h3>
                  <p className="text-xs text-amber-700 font-bold">Manage store products, orders & pricing</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-amber-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}

          {/* Support Concierge */}
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 sm:p-5 hover:bg-emerald-50/50 flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                <Headphones size={22} />
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-sm uppercase">Concierge Customer Support</h3>
                <p className="text-xs text-gray-500 font-medium">Direct WhatsApp & Phone assistance</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Privacy Policy */}
          <Link href="/privacy" className="p-4 sm:p-5 hover:bg-emerald-50/50 flex items-center justify-between transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0">
                <FileText size={22} />
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-sm uppercase">Privacy & Terms</h3>
                <p className="text-xs text-gray-500 font-medium">Data safety and delivery terms</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>

        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-black py-4 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <LogOut size={16} /> Sign Out
        </button>

      </div>
    </main>
  );
}
