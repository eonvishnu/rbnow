"use client";
import React, { useState, useEffect } from 'react';
import { useStore } from './StoreGuard';
import { Lock, Sparkles, Heart, ShoppingCart, Star } from 'lucide-react';

export const ProductCard = ({ 
  id,
  name,
  img,
  options = [],
  onAdd,
  onRemove,
  onAddToCart,
  onRemoveFromCart,
  quantity = 0,
  selectedIdx,
  selectedOptionIndex,
  setSelectedIdx,
  onSelectOption,
  discount = 0,
  discountPercent = 0,
  rating = 4.8,
  reviewCount = 186,
  tag
}: any) => {
  
  const { isOpen } = useStore();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const activeIdx = selectedIdx ?? selectedOptionIndex ?? 0;
  const setOptionIdx = setSelectedIdx || onSelectOption;
  const handleAdd = onAdd || onAddToCart || (() => {});
  const handleRemove = onRemove || onRemoveFromCart || (() => {});
  const effectiveDiscount = discount || discountPercent || 0;

  useEffect(() => {
    if (typeof setOptionIdx !== 'function' || !options || options.length === 0) return;
    const firstAvailable = options.findIndex((opt: any) => opt.stockCount > 0);
    if (firstAvailable !== -1 && (!options[activeIdx] || options[activeIdx].stockCount === 0)) {
      setOptionIdx(firstAvailable);
    }
  }, [options, setOptionIdx, activeIdx]);

  const currentOption = options[activeIdx] || options[0] || {};
  const variantId = currentOption?.id || `${id}-${activeIdx}`;
  const availableStock = currentOption?.stockCount ?? 0;
  const isPreorder = !!currentOption?.preorderCampaign;

  const originalPrice = currentOption?.price || 0;
  const hasDiscount = effectiveDiscount > 0;
  const finalPrice = hasDiscount 
    ? Math.round(originalPrice * (1 - (effectiveDiscount / 100)))
    : originalPrice;

  const tagLabel = isPreorder
    ? 'PRE-ORDER'
    : tag
    ? tag
    : effectiveDiscount > 0
    ? `${effectiveDiscount}% OFF`
    : null;

  return (
    <div className={`bg-white p-3.5 rounded-[24px] border shadow-sm flex flex-col h-full transition-all active:scale-[0.98] hover:shadow-md relative overflow-hidden ${isPreorder ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-gray-200/90'}`}>
      
      {!isOpen && <div className="absolute inset-0 bg-gray-50/30 z-[5] pointer-events-none" />}

      {/* Product Image Area */}
      <div className="relative h-36 w-full mb-3 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
        <img
          src={img} 
          alt={name} 
          className={`object-cover w-full h-full hover:scale-105 transition-all duration-300 ${!isOpen ? 'grayscale' : ''}`}
        />
        
        {/* Top-Left Meaningful Badge Pill (Only rendered when tagLabel exists) */}
        {tagLabel && (
          <div className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest z-10 shadow-sm flex items-center gap-1 ${
            isPreorder
              ? 'bg-amber-400 text-emerald-950 border border-amber-300'
              : effectiveDiscount > 0
              ? 'bg-amber-500 text-emerald-950 border border-amber-300'
              : 'bg-emerald-900 text-white'
          }`}>
            {isPreorder && <Sparkles size={10} />} {tagLabel}
          </div>
        )}

        {/* Top-Right Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-700 hover:text-rose-600 shadow-sm z-10 transition-transform active:scale-90"
        >
          <Heart size={14} className={isWishlisted ? "fill-rose-600 text-rose-600" : ""} />
        </button>

        {availableStock === 0 && !isPreorder && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="text-gray-600 text-[10px] font-black tracking-widest border border-gray-300 bg-white px-3 py-1 rounded-full shadow-sm uppercase">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Name */}
      <h3 className="text-xs sm:text-sm font-extrabold leading-tight h-10 mb-1 text-gray-900 tracking-tight">
        {name}
      </h3>

      {/* Price & Weight Unit */}
      <div className="flex items-baseline gap-1.5 mb-1.5">
        <span className="font-black text-base sm:text-lg text-gray-900 tracking-tight">
          ₹{finalPrice}
        </span>
        <span className="text-[11px] font-bold text-gray-400">
          / {currentOption.unit || 'pack'}
        </span>
        {hasDiscount && (
          <span className="text-[10px] text-gray-400 line-through">
            ₹{originalPrice}
          </span>
        )}
      </div>

      {/* Unit Selection Pills */}
      <div className="flex gap-1.5 mb-3 overflow-x-auto no-scrollbar relative z-10">
        {options.map((opt: any, i: number) => (
          <button 
            key={i}
            disabled={opt.stockCount === 0}
            onClick={(e) => {
              e.stopPropagation(); 
              if (typeof setOptionIdx === 'function') setOptionIdx(i);
            }}
            className={`text-[9px] px-2.5 py-1 rounded-lg border transition-all duration-200 whitespace-nowrap ${
              activeIdx === i
                ? 'border-amber-400 bg-emerald-800 text-amber-300 font-black shadow-sm'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            } ${opt.stockCount === 0 ? 'opacity-40 line-through bg-gray-100' : ''}`}
          >
            {opt.unit}
          </button>
        ))}
      </div>

      {/* Footer Area: CTA Button */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 relative z-10">
        {(isPreorder || availableStock === 0) ? (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
            isPreorder ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {isPreorder ? 'Pre-Order Only' : 'Out of stock'}
          </span>
        ) : <div />}

        {!isOpen ? (
          <button
            disabled 
            className="bg-gray-100 text-gray-400 border border-gray-200 px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-not-allowed"
          >
            <Lock size={10} /> Closed
          </button>
        ) : (
          quantity > 0 ? (
            <div className="flex items-center bg-emerald-800 text-amber-300 rounded-xl h-8 overflow-hidden shadow-md">
              <button 
                onClick={(e) => { e.stopPropagation(); handleRemove(variantId); }}
                className="px-2.5 h-full font-black text-lg hover:bg-black/10 transition-colors"
              >
                −
              </button>
              <span className="px-1 text-xs font-black w-4 text-center text-white">{quantity}</span>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handleAdd({ id: variantId, product_id: id, name, price: finalPrice, unit: currentOption.unit, img }, availableStock);
                }} 
                disabled={quantity >= availableStock}
                className={`px-2.5 h-full font-black text-lg hover:bg-black/10 transition-colors ${quantity >= availableStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                +
              </button>
            </div>
          ) : (
            <button 
              disabled={availableStock === 0}
              onClick={(e) => { 
                e.stopPropagation(); 
                handleAdd({ id: variantId, product_id: id, name, price: finalPrice, unit: currentOption.unit, img }, availableStock);
              }}
              className={`font-black px-3.5 py-1.5 rounded-xl text-[10px] uppercase tracking-wider active:scale-95 transition-all shadow-sm flex items-center gap-1 ${
                isPreorder
                  ? 'bg-emerald-900 text-amber-300 hover:bg-emerald-950'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-800 hover:text-amber-300'
              }`}
            >
              {isPreorder ? 'Pre-Order Now' : <><ShoppingCart size={11} /> Add to Cart</>}
            </button>
          )
        )}
      </div>
    </div>
  );
};
