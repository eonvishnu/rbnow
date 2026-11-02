"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartProvider';
import { useAuth } from '@/context/AuthProvider';
import { Home, Package, ShoppingBag, User } from 'lucide-react';

export const BottomNav = () => {
  const pathname = usePathname();
  const { cart } = useCart();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  // Scroll direction listener to hide BottomNav on scroll down
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Hide BottomNav on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const totalCartItems = cart.length;

  const navItems = [
    {
      label: 'Home',
      icon: Home,
      href: '/',
      active: pathname === '/',
    },
    {
      label: 'Orders',
      icon: Package,
      href: '/orders',
      active: pathname === '/orders',
    },
    {
      label: 'Cart',
      icon: ShoppingBag,
      href: '/cart',
      active: pathname === '/cart',
      badge: totalCartItems > 0 ? totalCartItems : null,
    },
    {
      label: 'Account',
      icon: User,
      href: user ? '/account' : '/login',
      active: pathname === '/account' || pathname === '/login',
    },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 md:hidden bg-emerald-950/95 backdrop-blur-2xl border-t border-amber-400/20 px-2 py-2 shadow-[0_-10px_30px_rgba(0,0,0,0.4)] transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
    }`}>
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-all active:scale-90 ${
                isActive ? 'text-amber-400 font-extrabold' : 'text-emerald-300/70 hover:text-emerald-200'
              }`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />

                {/* Badge for Cart */}
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 bg-amber-400 text-emerald-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-emerald-950 shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] mt-1 tracking-wider uppercase ${isActive ? 'font-black text-amber-400' : 'font-semibold'}`}>
                {item.label}
              </span>

              {/* Active Golden Glow Bar */}
              {isActive && (
                <div className="absolute -top-2 w-8 h-1 bg-amber-400 rounded-full shadow-[0_0_10px_#f5d061]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
