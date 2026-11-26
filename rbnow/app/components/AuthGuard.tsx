"use client";

import { useAuth } from "@/context/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/login") {
      router.push("/login");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em] animate-pulse">
          Verifying Credentials
        </p>
      </div>
    );
  }

  // If we are on login page or user is authenticated, show the app
  return (user || pathname === "/login") ? <>{children}</> : null;
};