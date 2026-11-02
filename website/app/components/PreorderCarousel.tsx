"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartProvider';
import { Calendar, Heart, Sparkles, ArrowRight } from 'lucide-react';

export const PreorderCarousel = () => {
  const { cart, addToCart, removeFromCart } = useCart();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistMap, setWishlistMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchPreorders = async () => {
      try {
        const { data, error } = await supabase
          .from('preorder_campaigns')
          .select('*, product_variants(*, products(*))')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setCampaigns(data);
        }
      } catch (err) {
        console.error('Error fetching preorder carousel:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPreorders();
  }, []);

  if (loading || campaigns.length === 0) return null;

  return (
    <section className="my-4 space-y-3">

      {/* Section Header Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-400 text-emerald-950 flex items-center justify-center font-black shadow-2xs">
            <Calendar size={16} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-gray-900 leading-none">
              Pre-Orders
            </h2>
            <p className="text-[9px] text-emerald-800 font-bold uppercase tracking-wider mt-0.5">
              Reserve seasonal catches & special harvest items
            </p>
          </div>
        </div>

        <button className="text-[11px] font-black uppercase text-emerald-800 hover:text-emerald-950 flex items-center gap-1 group">
          View All <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Horizontal Scroll Snap Container */}
      <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3 pb-2 px-1">
        {campaigns.map((c) => {
          const variant = c.product_variants;
          const product = variant?.products;
          const comboId = variant?.id;

          const quantity = cart.filter((item: any) => item.id === comboId).length;
          const remainingCap = Math.max(0, c.max_quantity - c.reserved_quantity);
          const isWishlisted = !!wishlistMap[c.id];

          return (
            <div
              key={c.id}
              className="w-[210px] sm:w-[240px] shrink-0 snap-start bg-white rounded-[24px] border border-amber-300/90 p-3 shadow-sm hover:shadow-md transition-all flex flex-col relative overflow-hidden group"
            >

              {/* Product Photo Container */}
              <div className="relative h-28 sm:h-32 w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center mb-2.5">
                <img
                  src={product?.image_url || 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80'}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top Left Pre-Order Badge */}
                <span className="absolute top-2 left-2 bg-emerald-950 text-amber-300 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-amber-400/50 shadow-xs flex items-center gap-1 z-10">
                  <Sparkles size={9} /> PRE-ORDER
                </span>

                {/* Top Right Wishlist Heart */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setWishlistMap(prev => ({ ...prev, [c.id]: !prev[c.id] }));
                  }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-700 hover:text-rose-600 shadow-2xs z-10 transition-transform active:scale-90"
                >
                  <Heart size={12} className={isWishlisted ? "fill-rose-600 text-rose-600" : ""} />
                </button>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xs font-black text-gray-900 tracking-tight leading-tight line-clamp-1 mb-0.5">
                {c.name}
              </h3>

              <p className="text-[9px] text-gray-500 font-bold uppercase truncate mb-1.5">
                {product?.name} • {variant?.unit}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-1.5">
                <span className="text-base font-black text-gray-900 tracking-tight">₹{c.price}</span>
                {variant?.original_price && (
                  <span className="text-[9px] text-gray-400 line-through">₹{variant.original_price}</span>
                )}
              </div>

              {/* Promised Availability Date */}
              <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-200 text-[9px] font-bold text-emerald-900 flex items-center gap-1 mb-2">
                <Calendar size={11} className="text-amber-500 shrink-0" />
                <span>Expected: <strong className="text-amber-700">{new Date(c.expected_available_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</strong></span>
              </div>

              {/* Remaining Cap Pill */}
              <div className="mb-2.5">
                <span className="text-[8px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block">
                  {remainingCap < 20 ? `Only ${remainingCap} left` : `Limited to ${c.max_quantity} units`}
                </span>
              </div>

              {/* Action Button */}
              <div className="mt-auto">
                {quantity > 0 ? (
                  <div className="flex items-center bg-emerald-900 text-amber-300 rounded-xl h-8 overflow-hidden shadow-sm">
                    <button
                      onClick={() => removeFromCart(comboId)}
                      className="px-2.5 h-full font-black text-lg hover:bg-black/10 transition-colors"
                    >
                      −
                    </button>
                    <span className="px-1 text-[11px] font-black flex-1 text-center text-white">{quantity}</span>
                    <button
                      onClick={() => addToCart({
                        id: comboId,
                        product_id: product?.id,
                        name: c.name,
                        price: Number(c.price),
                        unit: variant?.unit,
                        img: product?.image_url,
                      }, remainingCap)}
                      disabled={quantity >= remainingCap}
                      className="px-2.5 h-full font-black text-lg hover:bg-black/10 transition-colors disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={remainingCap === 0}
                    onClick={() => addToCart({
                      id: comboId,
                      product_id: product?.id,
                      name: c.name,
                      price: Number(c.price),
                      unit: variant?.unit,
                      img: product?.image_url,
                    }, remainingCap)}
                    className="w-full bg-emerald-900 hover:bg-emerald-950 text-amber-300 font-black py-2 rounded-xl text-[10px] uppercase tracking-wider shadow-sm transition-all active:scale-95 disabled:opacity-50"
                  >
                    Pre-Order Now
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
