"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Twitter, ShieldCheck, Truck, Sparkles, Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  const pathname = usePathname();

  // Hide footer on orders, cart, checkout, account, login, and admin routes
  if (
    pathname.startsWith('/orders') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/admin')
  ) {
    return null;
  }

  return (
    <footer className="bg-[#2C241D] text-[#EFE8DC] border-t border-amber-600/30 pt-16 pb-12 mt-20 relative overflow-hidden">

      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 space-y-12">
        
        {/* Trust Value Props Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-[#3E3424]">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#3E3424]/60 border border-amber-600/20">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles size={22} />
            </div>
            <div>
              <h4 className="text-[#FAF6EE] font-bold text-sm tracking-tight">Royal Heritage Quality</h4>
              <p className="text-xs text-[#EFE8DC]/70">Hand-selected fresh catch & gourmet cuts</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#3E3424]/60 border border-amber-600/20">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="text-[#FAF6EE] font-bold text-sm tracking-tight">Express Cold Delivery</h4>
              <p className="text-xs text-[#EFE8DC]/70">Temperature-controlled fast dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#3E3424]/60 border border-amber-600/20">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-[#FAF6EE] font-bold text-sm tracking-tight">Guaranteed Freshness</h4>
              <p className="text-xs text-[#EFE8DC]/70">100% satisfaction or easy replacements</p>
            </div>
          </div>
        </div>

        {/* Links & Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3E3424] border border-amber-400/40 p-1 flex items-center justify-center">
                <img src="/logo.png" alt="Royal Bengal" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-black text-amber-400 tracking-wider">ROYAL BENGAL</span>
            </div>
            <p className="text-xs leading-relaxed text-[#EFE8DC]/70">
              Boutique sourcing and premium delivery of the finest cuts, fresh catches, and artisanal Bengal delicacies.
            </p>
            <div className="flex gap-3 pt-2">
              <Link href="#" className="w-9 h-9 rounded-xl bg-[#3E3424] border border-amber-600/30 flex items-center justify-center text-[#EFE8DC] hover:text-amber-400 hover:border-amber-400/50 transition-all"><Instagram size={18} /></Link>
              <Link href="#" className="w-9 h-9 rounded-xl bg-[#3E3424] border border-amber-600/30 flex items-center justify-center text-[#EFE8DC] hover:text-amber-400 hover:border-amber-400/50 transition-all"><Twitter size={18} /></Link>
              <Link href="#" className="w-9 h-9 rounded-xl bg-[#3E3424] border border-amber-600/30 flex items-center justify-center text-[#EFE8DC] hover:text-amber-400 hover:border-amber-400/50 transition-all"><Facebook size={18} /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-amber-400 font-bold uppercase tracking-wider mb-4 text-xs">Categories</h4>
            <ul className="space-y-2.5 text-xs text-[#EFE8DC]/70">
              <li><Link href="/" className="hover:text-white transition-colors">Fresh Water Fish</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Seafood Specialties</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Premium Meat Cuts</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Traditional Pickles</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Special Offers</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-amber-400 font-bold uppercase tracking-wider mb-4 text-xs">Policy & Help</h4>
            <ul className="space-y-2.5 text-xs text-[#EFE8DC]/70">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Refund & Cancellation</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-amber-400 font-bold uppercase tracking-wider mb-4 text-xs">Concierge Contact</h4>
            <ul className="space-y-3 text-xs text-[#EFE8DC]/70">
              <li className="flex items-center gap-2.5"><MapPin size={16} className="text-amber-400 shrink-0" /> Hyderabad, Telangana, India</li>
              <li className="flex items-center gap-2.5"><Mail size={16} className="text-amber-400 shrink-0" /> support@royalbengal.com</li>
              <li className="flex items-center gap-2.5"><Phone size={16} className="text-amber-400 shrink-0" /> +91 98765 43210</li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-[#3E3424] flex flex-col sm:flex-row justify-between items-center text-xs text-[#EFE8DC]/60 gap-4">
          <p>&copy; {new Date().getFullYear()} Royal Bengal LLP. All rights reserved.</p>
          <p className="text-[11px] text-amber-400/70 font-semibold tracking-wider uppercase">Crafted for Culinary Excellence</p>
        </div>

      </div>
    </footer>
  );
};
