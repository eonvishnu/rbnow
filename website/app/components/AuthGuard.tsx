"use client";

import { useAuth } from "@/context/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isProfileIncomplete = user && (!userData?.display_name || userData.display_name.trim() === '' || userData.display_name.toLowerCase().startsWith('member'));

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/login") {
        router.push("/login");
      } else if (isProfileIncomplete && pathname !== "/login") {
        router.push("/login");
      }
    }
  }, [user, userData, loading, pathname, router, isProfileIncomplete]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9E8] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-amber-400/20 border-t-emerald-800 rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-extrabold text-emerald-950 uppercase tracking-[0.3em] animate-pulse">
          Verifying Credentials
        </p>
      </div>
    );
  }

  if (!user && pathname !== "/login") return null;
  if (isProfileIncomplete && pathname !== "/login") return null;

  return <>{children}</>;
};