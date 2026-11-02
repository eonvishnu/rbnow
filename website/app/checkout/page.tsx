"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/cart');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#022c22] flex flex-col items-center justify-center text-white space-y-4">
      <div className="w-10 h-10 border-4 border-amber-400 border-t-emerald-800 rounded-full animate-spin" />
      <p className="text-xs font-black uppercase tracking-widest text-amber-300">Redirecting to 1-Page Express Checkout...</p>
    </div>
  );
}
