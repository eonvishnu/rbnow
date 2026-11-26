"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartProvider';
import { useStore } from './StoreGuard';
import { Lock, ArrowRight } from 'lucide-react';

export const CartBar = () => {
  const { cart, totalAmount } = useCart();
  const { isOpen } = useStore();
  const [isNavHidden, setIsNavHidden] = React.useState(false);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsNavHidden(true);
      } else {
        setIsNavHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  if (cart.length === 0) return null;

  return (
    <div className={`fixed left-3 right-3 sm:left-4 sm:right-4 z-40 max-w-2xl mx-auto transition-all duration-300 ${
      isNavHidden ? 'bottom-3' : 'bottom-16 md:bottom-6'
    }`}>
      <div className="bg-emerald-950/95 backdrop-blur-2xl border border-amber-400/40 rounded-2xl p-3.5 sm:p-4 flex justify-between items-center shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
        
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`
            w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center relative shadow-lg transition-colors duration-300
            ${isOpen ? 'bg-amber-400 text-emerald-950 shadow-amber-400/20' : 'bg-gray-700 shadow-gray-800'}
          `}>
            <span className="text-lg sm:text-xl">🛍️</span>
            <span className="absolute -top-1 -right-1 bg-amber-400 text-emerald-950 text-[9px] w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full font-black border-2 border-emerald-950">
              {cart.length}
            </span>
          </div>
          
          <div className="flex flex-col">
            <p className="text-[9px] sm:text-[10px] text-amber-300 font-bold uppercase tracking-[0.1em]">
              Royal Selection
            </p>
            <p className="font-black text-lg sm:text-xl text-white leading-none mt-0.5 sm:mt-1 tracking-tight">
              ₹{totalAmount}
            </p>
          </div>
        </div>
        
        {isOpen ? (
          <Link
            href="/cart"
            className="bg-amber-400 text-emerald-950 font-black text-[10px] sm:text-[11px] px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl uppercase tracking-[0.2em] active:scale-95 transition-all shadow-lg shadow-amber-400/20 hover:bg-amber-300 flex items-center gap-2"
          >
            View Cart <ArrowRight size={14} />
          </Link>
        ) : (
          <button
            disabled
            className="bg-emerald-900/50 text-emerald-400 border border-emerald-800 font-black text-[10px] sm:text-[11px] px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl uppercase tracking-[0.2em] cursor-not-allowed flex items-center gap-2"
          >
            Closed <Lock size={14} />
          </button>
        )}
        
      </div>
    </div>
  );
};
