"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import { getOrCreateBrowserId } from '@/lib/browserId';

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeCartId, setActiveCartId] = useState<string | null>(null);

  // 1. Load cart from LocalStorage on boot
  useEffect(() => {
    const savedCart = localStorage.getItem('royal_bengal_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart recovery failed", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // 2. Sync and merge cart with Supabase `carts` & `cart_items` tables ONLY when cart has items
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem('royal_bengal_cart', JSON.stringify(cart));

    const syncRelationalCart = async () => {
      const browserId = getOrCreateBrowserId();

      try {
        // Find existing active cart for user or guest session
        let query = supabase.from('carts').select('id, user_id').eq('status', 'active');
        if (user) {
          query = query.eq('user_id', user.id);
        } else {
          query = query.eq('session_id', browserId);
        }

        const { data: existingCarts } = await query;
        let cartId = existingCarts && existingCarts.length > 0 ? existingCarts[0].id : null;

        // IF CART IS EMPTY (0 items): Do NOT create a new cart row!
        if (cart.length === 0) {
          if (cartId) {
            // Clean up old cart_items and reset subtotal
            await supabase.from('cart_items').delete().eq('cart_id', cartId);
            await supabase.from('carts').update({ subtotal: 0, total: 0 }).eq('id', cartId);
          }
          return;
        }

        // Merge guest cart if user just logged in
        if (user && existingCarts && existingCarts.length > 0) {
          const guestQuery = await supabase
            .from('carts')
            .select('id')
            .eq('session_id', browserId)
            .eq('status', 'active');

          if (guestQuery.data && guestQuery.data.length > 0 && guestQuery.data[0].id !== cartId) {
            await supabase
              .from('carts')
              .update({ user_id: user.id, updated_at: new Date().toISOString() })
              .eq('id', guestQuery.data[0].id);
          }
        }

        // Create new active cart ONLY when customer adds at least 1 item (cart.length > 0)
        if (!cartId && cart.length > 0) {
          const { data: newCart } = await supabase
            .from('carts')
            .insert({
              user_id: user?.id || null,
              session_id: browserId,
              status: 'active',
              last_activity_at: new Date().toISOString(),
            })
            .select('id')
            .single();

          if (newCart) cartId = newCart.id;
        }

        if (cartId) {
          setActiveCartId(cartId);

          // Calculate cart subtotal
          const subtotal = cart.reduce((sum, item) => sum + (item.price || 0), 0);

          await supabase
            .from('carts')
            .update({
              subtotal,
              total: subtotal,
              last_activity_at: new Date().toISOString(),
            })
            .eq('id', cartId);

          // Group items and sync line items to cart_items table for Admin Carts Manager
          const itemGroups = cart.reduce((acc: any, item: any) => {
            const key = item.id;
            if (!acc[key]) {
              const cleanId = item.id && item.id.length >= 36 ? item.id.substring(0, 36) : item.id;
              acc[key] = {
                cart_id: cartId,
                variant_id: cleanId,
                product_id: item.product_id || cleanId,
                product_name: item.name,
                variant_unit: item.unit || 'pack',
                unit_price: item.price,
                quantity: 1,
              };
            } else {
              acc[key].quantity += 1;
            }
            return acc;
          }, {});

          const lineItems = Object.values(itemGroups);

          // Clear previous cart_items for this cart and insert new items
          await supabase.from('cart_items').delete().eq('cart_id', cartId);
          if (lineItems.length > 0) {
            await supabase.from('cart_items').insert(lineItems);
          }
        }
      } catch (err) {
        console.error('Error syncing relational cart:', err);
      }
    };

    syncRelationalCart();
  }, [cart, isInitialized, user]);

  // 3. Add to Cart with Stock Logic
  const addToCart = (item: any, availableStock: number) => {
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
