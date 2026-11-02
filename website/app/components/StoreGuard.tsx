"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface StoreContextType {
  isOpen: boolean;
  message: string;
  loading: boolean;
}

const StoreContext = createContext<StoreContextType>({
  isOpen: true,
  message: "",
  loading: true,
});

export default function StoreGuard({ children }: { children: React.ReactNode }) {
  const [storeStatus, setStoreStatus] = useState({ 
    isOpen: true, 
    message: "" 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreStatus = async () => {
      const { data } = await supabase
        .from("store_settings")
        .select("*")
        .eq("id", "default")
        .single();

      if (data) {
        setStoreStatus({
          isOpen: data.is_store_open,
          message: data.is_store_open ? "" : "Store Closed",
        });
      }
      setLoading(false);
    };

    fetchStoreStatus();
  }, []);

  return (
    <StoreContext.Provider value={{ ...storeStatus, loading }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
