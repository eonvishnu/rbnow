"use client";
import React, { useState } from 'react';
import { useCart } from "../../context/CartProvider";
import { X, Sparkles, ShieldCheck, Calendar } from 'lucide-react';

export const ProductModal = ({ product, onClose }: any) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const { cart, addToCart, removeFromCart } = useCart();

  const currentOption = product.options[selectedIdx] || product.options[0];
  const variantId = currentOption?.id || `${product.id}-${selectedIdx}`;
  const quantity = cart.filter((item: any) => item.id === variantId).length;
  const availableStock = currentOption?.stockCount || 0;
  const isPreorder = !!currentOption?.preorderCampaign;

  const hasDiscount = product.discount > 0;
  const finalPrice = hasDiscount 
    ? Math.round(currentOption.price * (1 - (product.discount / 100))) 
    : currentOption.price;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-emerald-950/70 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose} 
      />
      
      <div className="relative w-full sm:max-w-lg max-h-[90vh] sm:max-h-[85vh] bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300 shadow-2xl border border-amber-200/80 z-10">
        
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        <button
          onClick={onClose} 
          className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur-md p-2 rounded-full text-gray-800 hover:bg-white shadow-md border border-gray-100 transition-all active:scale-90"
        >
          <X size={20} />
        </button>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-28 bg-gray-50">
           
           <div className="relative h-56 sm:h-64 w-full shrink-0 bg-white border-b border-gray-100 flex items-center justify-center p-6">
              <img 
                src={product.img} 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                alt={product.name} 
              />
              
              {isPreorder ? (
                <div className="absolute bottom-4 left-4 bg-emerald-950 text-amber-300 font-black text-xs px-3 py-1.5 rounded-xl shadow-lg border border-amber-300 flex items-center gap-1">
                  <Sparkles size={12} /> PRE-ORDER CAMPAIGN
                </div>
              ) : (
                hasDiscount && (
                  <div className="absolute bottom-4 left-4 bg-amber-400 text-emerald-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-lg border border-amber-300 flex items-center gap-1">
                    <Sparkles size={12} /> {product.discount}% OFF
                  </div>
                )
              )}
           </div>

           <div className="bg-white p-5 sm:p-6 space-y-6">
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <span className="text-[9px] font-black bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-200">
                    {product.category || 'Specialty'}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-900 leading-tight">
                  {product.name}
                </h2>
                <div className="h-1.5 w-12 bg-amber-400 rounded-full" />

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium pt-2">
                  {product.description || "Freshly sourced authentic delicacy prepared with traditional quality controls."}
                </p>
              </div>

              {isPreorder && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs font-bold text-amber-900 space-y-1">
                  <span className="flex items-center gap-1.5 uppercase font-black text-amber-950">
                    <Calendar size={14} className="text-amber-600" /> Promised Delivery Date
                  </span>
                  <p>Delivery expected from {new Date(currentOption.preorderCampaign.expected_available_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>
                </div>
              )}

              <div className="space-y-3 pt-2 border-t border-gray-100">
                <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Select Weight / Portion</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {product.options.map((opt: any, i: number) => {
                    const isSelected = selectedIdx === i;

                    return (
                      <button
                        key={i}
                        disabled={opt.stockCount === 0}
                        onClick={() => setSelectedIdx(i)}
                        className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-amber-400 bg-emerald-900 text-white shadow-md'
                            : 'border-gray-200 bg-white text-gray-900 hover:border-emerald-300'
                        } ${opt.stockCount === 0 ? 'opacity-40 bg-gray-100 cursor-not-allowed' : ''}`}
                      >
                        <span className={`text-xs font-black uppercase ${isSelected ? 'text-amber-300' : 'text-gray-900'}`}>
                          {opt.unit}
                        </span>
                        <span className={`text-[11px] font-bold mt-1 ${isSelected ? 'text-emerald-100' : 'text-emerald-800'}`}>
                          ₹{opt.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-3 text-xs text-emerald-900 font-medium">
                <ShieldCheck size={18} className="text-emerald-700 shrink-0" />
                <span>100% Quality & Freshness Guarantee on all Royal Bengal cuts.</span>
              </div>

           </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-white/95 backdrop-blur-xl border-t border-gray-100 flex items-center justify-between z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                ₹{finalPrice}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                {isPreorder ? 'Pre-Order Open' : 'In Stock'}
              </span>
            </div>

            {quantity > 0 ? (
              <div className="flex items-center bg-emerald-800 text-amber-300 rounded-2xl h-12 sm:h-14 overflow-hidden px-1 shadow-lg shadow-emerald-900/20">
                <button onClick={() => removeFromCart(variantId)} className="w-12 sm:w-14 h-full font-black text-2xl active:bg-black/10 transition-colors">−</button>
                <span className="w-8 text-center text-sm sm:text-base font-black text-white">{quantity}</span>
                <button 
                  onClick={() => addToCart({ id: variantId, product_id: product.id, name: product.name, price: finalPrice, unit: currentOption.unit, img: product.img }, availableStock)}
                  disabled={quantity >= availableStock}
                  className="w-12 sm:w-14 h-full font-black text-2xl active:bg-black/10 transition-colors disabled:opacity-50"
                >
                  +
                </button>
              </div>
            ) : (
              <button 
                disabled={availableStock === 0}
                onClick={() => addToCart({ id: variantId, product_id: product.id, name: product.name, price: finalPrice, unit: currentOption.unit, img: product.img }, availableStock)}
                className={`border border-amber-400/80 px-8 sm:px-10 h-12 sm:h-14 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 disabled:opacity-50 ${
                  isPreorder
                    ? 'bg-amber-400 text-emerald-950 hover:bg-amber-300'
                    : 'bg-emerald-800 text-amber-300 hover:bg-emerald-900'
                }`}
              >
                {isPreorder ? 'PRE-ORDER NOW' : (availableStock === 0 ? 'NO STOCK' : 'ADD TO CART')}
              </button>
            )}
        </div>

      </div>
    </div>
  );
};
