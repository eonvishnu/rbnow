"use client";

import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const ADMIN_ROLES = new Set(["super_admin", "admin", "operations_staff", "support_agent", "read_only"]);

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const hasAdminRole = ADMIN_ROLES.has(userData?.role || '');

  useEffect(() => {
    if (!loading && !user && !isLogin) router.replace("/login");
    if (!loading && user && hasAdminRole && isLogin) router.replace("/");
  }, [user, loading, isLogin, hasAdminRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f1f1] flex flex-col items-center justify-center gap-3">
        <div className="w-7 h-7 border-[3px] border-gray-300 border-t-[#303030] rounded-full animate-spin" />
        <p className="text-[13px] text-[#616161]">Verifying access…</p>
      </div>
    );
  }

  if (isLogin && !user) return <>{children}</>;
  if (!user) return null;
  if (!hasAdminRole) {
    return (
      <main className="min-h-screen grid place-items-center bg-[#f1f1f1] p-6 text-center text-[#303030]">
        <section className="max-w-md space-y-3 rounded-xl bg-white p-8 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.06)]">
          <h1 className="text-xl font-semibold text-[#1a1a1a]">Admin access required</h1>
          <p className="text-[13px] text-[#616161]">This account does not have an authorized staff role.</p>
          <button className="h-9 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] px-4 text-[13px] font-medium text-white" onClick={async () => {
            await supabase.auth.signOut();
            router.replace("/login");
          }}>
            Log out
          </button>
        </section>
      </main>
    );
  }
  if (isLogin) return null;
  return <>{children}</>;
};
