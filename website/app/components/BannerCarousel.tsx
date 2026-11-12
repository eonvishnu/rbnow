"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface BannerCarouselProps {
  onSelectCategory?: (categoryName: string) => void;
}

export const BannerCarousel = ({ onSelectCategory }: BannerCarouselProps) => {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .eq('status', 'active')
          .order('order_index', { ascending: true });

        if (!error && data && data.length > 0) {
          setBanners(data);
        }
      } catch (err) {
        console.error('Failed to load banners:', err);
      }
    };

    fetchBanners();
  }, []);

  // Auto-slide every 5 seconds if multiple banners exist
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[currentIndex] || banners[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleClick = (e: React.MouseEvent) => {
    const link = currentBanner.link;
    if (!link) return;
    if (link.startsWith('/')) {
      return; // normal routing via Link
    }
    // Treat as category name filter
    if (onSelectCategory) {
      e.preventDefault();
      onSelectCategory(link);
    }
  };

  const isExternalOrRoute = currentBanner.link && currentBanner.link.startsWith('/');

  return (
    <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 my-3">
      <Link
        href={isExternalOrRoute ? currentBanner.link : '#'}
        onClick={handleClick}
        className="block relative w-full h-40 sm:h-52 lg:h-60 rounded-[24px] overflow-hidden shadow-md border border-amber-500/30 group transition-transform active:scale-[0.99]"
      >
        <img
          src={currentBanner.image_url}
          alt={currentBanner.title || 'Promotional Banner'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Subtle Gradient Overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Bottom Banner Title */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
          <span className="text-sm sm:text-lg font-black tracking-wide uppercase drop-shadow-md">
            {currentBanner.title}
          </span>
          {currentBanner.link && !isExternalOrRoute && (
            <span className="bg-amber-400 text-emerald-950 text-[9px] sm:text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
              Shop {currentBanner.link}
            </span>
          )}
        </div>

        {/* Navigation Controls (if multiple banners) */}
        {banners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous Banner"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-emerald-950 flex items-center justify-center shadow-lg transition-all z-20 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Banner"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-emerald-950 flex items-center justify-center shadow-lg transition-all z-20 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={16} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2.5 right-4 flex items-center gap-1.5 z-20">
              {banners.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    currentIndex === idx ? 'bg-amber-400 w-4' : 'bg-white/50 w-1.5'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </Link>
    </div>
  );
};
