"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { getOrCreateBrowserId } from '@/lib/browserId';
import { localCartSchema } from '@/features/carts/schemas/cart.schema';
import { syncCustomerCart } from '@/features/carts/services/cart-sync.service';
import type { CartContextValue, CartItem } from '@/features/carts/types/cart';

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeCartId, setActiveCartId] = useState<string | null>(null);

  // 1. Load cart from LocalStorage on boot
  useEffect(() => {
    const savedCart = localStorage.getItem('royal_bengal_cart');
    if (savedCart) {
      try {
        setCart(localCartSchema.parse(JSON.parse(savedCart)));
      } catch (error) {
        console.error("Cart recovery failed", error);
      }
    }
    setIsInitialized(true);
  }, []);

  // 2. Sync and merge cart with Supabase `carts` & `cart_items` tables ONLY when cart has items
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem('royal_bengal_cart', JSON.stringify(cart));

    const syncRelationalCart = async () => {
      try {
        const cartId = await syncCustomerCart(cart, user?.id ?? null, getOrCreateBrowserId());
        if (cartId) setActiveCartId(cartId);
      } catch (error) {
        console.error('Error syncing relational cart:', error);
      }
    };

    syncRelationalCart();
  }, [cart, isInitialized, user]);

  // 3. Add to Cart with Stock Logic
  const addToCart = (item: CartItem, availableStock: number) => {
    setCart((prev) => {
      const currentQty = prev.filter(i => i.id === item.id).length;
      if (currentQty < availableStock) {
        return [...prev, item];
      }
      return prev;
    });
  };

  // 4. Remove from Cart
  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const index = prev.findLastIndex(i => i.id === itemId);
      if (index > -1) {
        const newCart = [...prev];
        newCart.splice(index, 1);
        return newCart;
      }
      return prev;
    });
  };

  // 5. Clear Cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('royal_bengal_cart');
  };

  // 6. Global Totals
  const totalAmount = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <CartContext.Provider value={{
      cart,
      activeCartId,
      addToCart,
      removeFromCart, 
      clearCart, 
      totalAmount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
