"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { getAdminProfile } from '@/features/auth/repositories/auth.repository';
import type { AdminProfile, AuthContextValue } from '@/features/auth/types/profile';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to manually refresh user profile data from Supabase
  const refreshUserData = async (uid: string) => {
    try {
      setUserData(await getAdminProfile(uid));
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  // Robust Sign Out Handler (Prevents 403 Forbidden on expired/revoked global sessions)
  const signOut = async () => {
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (err) {
      console.warn('Supabase Auth signOut warning:', err);
    } finally {
      setUser(null);
      setUserData(null);
    }
  };

  useEffect(() => {
    // Fetch initial session
    const initAuth = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await refreshUserData(currentUser.id);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error('Error initializing authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen to Auth State changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await refreshUserData(currentUser.id);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      loading,
      refreshUserData,
      signOut,
      isVerified: user?.email_confirmed_at != null || !!userData?.is_verified
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
