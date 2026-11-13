"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabase';
import "./globals.css";
import {
  Home,
  ShoppingBag,
  Package,
  Users,
  Layers,
  Menu,
  X,
  Megaphone,
  Tag,
  Clock,
  Plus,
  Search,
  Bell,
  ExternalLink,
  PlusCircle,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Settings,
  CalendarClock,
  Hourglass,
  LogOut
} from 'lucide-react';

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const role = userData?.role || 'customer';
  const isSuperAdmin = role === 'super_admin' || role === 'admin';
  const isOpsStaff = role === 'operations_staff';
  const isSupportAgent = role === 'support_agent';
  const isReadOnly = role === 'read_only';

  // Auth & Admin Guard
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        const validAdminRoles = ['super_admin', 'admin', 'operations_staff', 'support_agent', 'read_only'];
        if (!validAdminRoles.includes(userData?.role || '')) {
          router.push('/');
        } else {
          setIsAuthorized(true);
        }
      }
    }
  }, [user, userData, loading, router]);

  // Live badge: pending orders
  useEffect(() => {
    if (!isAuthorized) return;
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')
      .then(({ count }) => setPendingCount(count ?? 0));
  }, [isAuthorized]);

  // Handle login page rendering without admin shell
  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#f1f1f1] flex flex-col items-center justify-center gap-3">
        <div className="w-7 h-7 border-[3px] border-gray-300 border-t-[#303030] rounded-full animate-spin" />
        <p className="text-[13px] text-[#616161]">Verifying staff access…</p>
      </div>
    );
  }

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/orders?q=${encodeURIComponent(q)}` : '/orders');
  };

  return (
    <div className="h-dvh flex flex-col bg-[#f1f1f1] text-[#303030] font-sans antialiased">
      {/* TOP BAR */}
      <header className="min-h-14 py-2 bg-[#1a1a1a] flex items-center gap-2 sm:gap-3 px-3 lg:px-4 shrink-0 z-40">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 text-gray-300 hover:bg-white/10 rounded-lg"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <Link href="/" className="flex items-center gap-2.5 lg:w-56 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center p-1">
            <img src="/logo.png" alt="Royal Bengal" className="w-full h-full object-contain" />
          </div>
          <span className="text-sm font-semibold text-white hidden sm:block">Royal Bengal</span>
        </Link>

        <form onSubmit={submitSearch} className="flex-1 max-w-xl mx-auto relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search orders"
            className="w-full min-h-10 py-2 bg-white/10 hover:bg-white/15 focus:bg-white focus:text-[#303030] text-base sm:text-sm text-white placeholder:text-gray-400 focus:placeholder:text-gray-500 rounded-lg pl-9 pr-3 outline-none transition-colors"
          />
        </form>

        <div className="flex items-center gap-1 ml-auto">
          <a
            href="https://rbnowin.web.app"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-1.5 text-[13px] text-gray-300 hover:text-white hover:bg-white/10 px-3 h-9 rounded-lg transition-colors font-medium"
          >
            <ExternalLink size={14} /> View Store
          </a>
          <button className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors" aria-label="Notifications">
            <Bell size={18} />
            {!!pendingCount && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#e22c38] ring-2 ring-[#1a1a1a]" />}
          </button>
          <div className="flex items-center gap-2 pl-2 ml-1 h-9 border-l border-white/10">
            <div className="w-7 h-7 rounded-full bg-[#fbbf24] text-[#1a1a1a] text-xs font-semibold flex items-center justify-center">
              {userData?.display_name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span className="hidden lg:block text-[13px] text-gray-200 max-w-[120px] truncate">{userData?.display_name || 'Admin'}</span>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-gray-300 hover:text-white hover:bg-rose-500/20 rounded-lg transition-colors ml-1"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}

        {/* ADMIN SIDEBAR */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50 w-60 bg-[#ebebeb] flex flex-col shrink-0 border-r border-black/5
            transform transition-transform duration-200 ease-out
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="lg:hidden h-14 px-4 flex items-center justify-between border-b border-black/5">
            <span className="text-sm font-semibold">Menu</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-black/5" aria-label="Close menu">
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-5" onClick={() => setMobileMenuOpen(false)}>
            <div className="space-y-0.5">
              <SidebarLink href="/" label="Home" icon={<Home size={17} />} exact />

              {(isSuperAdmin || isOpsStaff || isSupportAgent || isReadOnly) && (
                <SidebarLink
                  href="/orders"
                  label="Orders"
                  icon={<ShoppingBag size={17} />}
                  badge={pendingCount ? String(pendingCount) : undefined}
                />
              )}

              {(isSuperAdmin || isOpsStaff || isReadOnly) && (
                <SidebarLink href="/batches" label="Batches" icon={<CalendarClock size={17} />} />
              )}

              {(isSuperAdmin || isOpsStaff || isReadOnly) && (
                <SidebarLink href="/backorders" label="Backorders" icon={<Hourglass size={17} />} />
              )}

              {(isSuperAdmin || isSupportAgent || isReadOnly) && (
                <SidebarLink href="/checkouts" label="Checkouts" icon={<Clock size={17} />} />
              )}

              {(isSuperAdmin || isSupportAgent || isReadOnly) && (
                <SidebarLink href="/carts" label="Abandoned carts" icon={<ShoppingCart size={17} />} />
              )}

              {(isSuperAdmin || isOpsStaff || isReadOnly) && (
                <SidebarLink href="/products" label="Products" icon={<Package size={17} />} />
              )}

              {(isSuperAdmin || isSupportAgent || isReadOnly) && (
                <SidebarLink href="/customers" label="Customers" icon={<Users size={17} />} />
              )}

              {(isSuperAdmin || isOpsStaff || isReadOnly) && (
                <SidebarLink href="/preorders" label="Pre-orders" icon={<Clock size={17} />} />
              )}
            </div>

            {(isSuperAdmin || isOpsStaff || isReadOnly) && (
              <div className="space-y-0.5">
                <SectionLabel>Catalog & inventory</SectionLabel>
                <SidebarLink href="/categories" label="Categories" icon={<Layers size={17} />} />
                <SidebarLink href="/procurement" label="Procurement" icon={<Truck size={17} />} />
                {isSuperAdmin && <SidebarLink href="/products/add" label="Add product" icon={<PlusCircle size={17} />} exact />}
              </div>
            )}

            {isSuperAdmin && (
              <div className="space-y-0.5">
                <SectionLabel>Settings</SectionLabel>
                <SidebarLink href="/settings" label="Store settings" icon={<Settings size={17} />} />
                <SidebarLink href="/coupons" label="Discounts" icon={<Tag size={17} />} />
                <SidebarLink href="/banner" label="Banners" icon={<Megaphone size={17} />} />
                <SidebarLink href="/staff" label="Staff & access" icon={<ShieldCheck size={17} />} />
              </div>
            )}

            {(isSuperAdmin || isSupportAgent) && (
              <div className="space-y-0.5">
                <SectionLabel>Sales channels</SectionLabel>
                <SidebarLink href="/orders/create" label="Create order" icon={<Plus size={17} />} exact />
              </div>
            )}
          </nav>

          <div className="px-4 py-3 border-t border-black/5 text-[12px] text-[#616161] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="capitalize">{role.replace(/_/g, ' ')}</span>
            </span>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </aside>

        {/* MAIN WORKSPACE */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 space-y-5">{children}</div>
        </main>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="px-3 pb-1 pt-1 text-xs font-medium text-[#616161]">{children}</p>;
}

function SidebarLink({
  href,
  label,
  icon,
  badge,
  exact,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href ||
      (href !== '/' &&
        pathname.startsWith(href + '/') &&
        // keep Orders / Products from staying highlighted on their create / add sub-pages
        pathname !== '/orders/create' &&
        pathname !== '/products/add');

  return (
    <Link
      href={href}
      className={`
        flex items-center justify-between gap-2 px-3 min-h-10 sm:min-h-8 py-1.5 rounded-lg text-sm sm:text-[13px] transition-colors
        ${isActive ? 'bg-white text-[#1a1a1a] font-semibold shadow-[0_1px_0_rgba(26,26,26,0.07)]' : 'text-[#303030] hover:bg-black/5 font-medium'}
      `}
    >
      <span className="flex items-center gap-2.5 min-w-0">
        <span className={isActive ? 'text-[#1a1a1a]' : 'text-[#616161]'}>{icon}</span>
        <span className="truncate">{label}</span>
      </span>
      {badge && (
        <span className="bg-[#303030] text-white text-[11px] font-semibold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AdminShell>{children}</AdminShell>
        </AuthProvider>
      </body>
    </html>
  );
}