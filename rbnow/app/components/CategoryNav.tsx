"use client";

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

const STATIC_OPTS = [
  { id: 'all', name: "All", icon: "🛍️", isStatic: true },
];

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (id: string, name: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({ activeCategory, onCategoryChange }) => {
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (data) {
        const parentCategories = data.filter((c: any) => !c.parent_id);
        setDynamicCategories(parentCategories.map((c: any) => ({ id: c.id, name: c.name, imageUrl: c.image_url })));
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (activeBtnRef.current) {
      activeBtnRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeCategory]);

  const displayCategories = [...STATIC_OPTS, ...dynamicCategories];

  return (
    <div className="bg-[#F4EFE6] text-[#2C241D] pt-3.5 pb-3 border-b border-[#E3D9C6] sticky top-0 z-30 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 flex gap-3.5 sm:gap-5 overflow-x-auto no-scrollbar snap-x">
        {displayCategories.map((cat) => {
          const isActive = activeCategory === cat.id || activeCategory === cat.name;

          return (
            <button
              key={cat.id}
              ref={isActive ? activeBtnRef : undefined}
              onClick={() => onCategoryChange(cat.id, cat.name)}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 transition-transform active:scale-95 snap-start group"
            >
              <div className={`w-13 h-13 sm:w-16 sm:h-16 rounded-full flex items-center justify-center p-0.5 transition-all duration-300 relative
                ${isActive
                  ? "bg-gradient-to-tr from-amber-300 via-amber-400 to-amber-600 shadow-md shadow-amber-400/30 scale-105"
                  : "bg-[#EFE8DC] hover:bg-[#E2D7C5]"}`}
              >
                <div className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center transition-all ${
                  isActive ? "bg-[#FAF6EE] text-amber-800" : "bg-[#FFFDF9] text-gray-700"
                }`}>
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl sm:text-2xl">{cat.icon || "🍽️"}</span>
                  )}
                </div>
              </div>

              <span className={`text-xs sm:text-sm font-bold text-center max-w-[84px] line-clamp-2 leading-tight transition-colors ${
                isActive ? "text-emerald-950 font-black" : "text-emerald-900/70"
              }`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
