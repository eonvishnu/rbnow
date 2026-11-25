"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import { Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE = 2 * 60 * 1000; // 2 minutes warning
const ABSOLUTE_SESSION_LIMIT = 8 * 60 * 60 * 1000; // 8 hours absolute limit
const THROTTLE_MS = 30 * 1000; // Throttle activity sync to every 30 seconds

export function AdminSessionGuard({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === '/login';

  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(120);
  const lastActivityRef = useRef<number>(Date.now());

  const handleForceLogout = useCallback(async (reason: 'idle_timeout' | 'session_expired') => {
    try {
      await signOut();
    } catch (e) {
      console.warn('SignOut warning:', e);
    }
    localStorage.removeItem('rb_admin_login_ts');
    localStorage.removeItem('rb_admin_last_activity');
    router.replace(`/login?reason=${reason}`);
  }, [signOut, router]);

  // Check absolute session lifetime & idle timeout
  useEffect(() => {
    if (!user || isLogin) return;

    // Check absolute session lifetime (8 hours)
    const loginTs = localStorage.getItem('rb_admin_login_ts');
    if (loginTs) {
      const elapsed = Date.now() - Number(loginTs);
      if (elapsed > ABSOLUTE_SESSION_LIMIT) {
        handleForceLogout('session_expired');
        return;
      }
    } else {
      localStorage.setItem('rb_admin_login_ts', String(Date.now()));
    }

    // Interval to check idle timeout
    const interval = setInterval(() => {
      // Check absolute limit again
      const currentLoginTs = localStorage.getItem('rb_admin_login_ts');
      if (currentLoginTs && Date.now() - Number(currentLoginTs) > ABSOLUTE_SESSION_LIMIT) {
        handleForceLogout('session_expired');
        return;
      }

      // Check idle timeout
      const lastAct = Number(localStorage.getItem('rb_admin_last_activity') || lastActivityRef.current);
      const idleTime = Date.now() - lastAct;

      if (idleTime >= INACTIVITY_LIMIT) {
        handleForceLogout('idle_timeout');
      } else if (idleTime >= INACTIVITY_LIMIT - WARNING_BEFORE) {
        const remaining = Math.max(0, Math.ceil((INACTIVITY_LIMIT - idleTime) / 1000));
        setSecondsRemaining(remaining);
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user, isLogin, handleForceLogout]);

  // Throttled activity listener
  useEffect(() => {
    if (!user || isLogin) return;

    let lastSynced = 0;

    const recordActivity = () => {
      const now = Date.now();
      if (now - lastSynced > THROTTLE_MS) {
        lastSynced = now;
        lastActivityRef.current = now;
        localStorage.setItem('rb_admin_last_activity', String(now));
      }
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, recordActivity, { passive: true }));

    // Storage event sync across tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'rb_admin_last_activity' && e.newValue) {
        lastActivityRef.current = Number(e.newValue);
      }
      if (e.key === 'rb_admin_login_ts' && !e.newValue) {
        // Logged out in another tab
        router.replace('/login');
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      events.forEach((event) => window.removeEventListener(event, recordActivity));
      window.removeEventListener('storage', handleStorage);
    };
  }, [user, isLogin, router]);

  const resetTimer = () => {
    const now = Date.now();
    lastActivityRef.current = now;
    localStorage.setItem('rb_admin_last_activity', String(now));
    setShowWarning(false);
  };

  return (
    <>
      {children}
      {showWarning && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#17211d]">Inactivity Warning</h3>
                <p className="text-xs text-gray-500">You will be automatically signed out due to inactivity.</p>
              </div>
            </div>

            <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100 text-center space-y-1">
              <p className="text-xs font-semibold text-amber-900">Session expiring in</p>
              <p className="text-2xl font-black text-amber-700">
                {Math.floor(secondsRemaining / 60)}:{String(secondsRemaining % 60).padStart(2, '0')}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleForceLogout('idle_timeout')}
                className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors"
              >
                Sign out now
              </button>
              <button
                onClick={resetTimer}
                className="flex-1 h-11 rounded-xl bg-[#006B50] text-[#FFC400] font-black text-xs hover:bg-[#005540] transition-colors shadow-sm"
              >
                Stay signed in
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
