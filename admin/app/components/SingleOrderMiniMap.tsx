"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';

interface SingleOrderMiniMapProps {
  lat?: number | null;
  lng?: number | null;
  address?: string | null;
  orderId: string;
}

export const SingleOrderMiniMap: React.FC<SingleOrderMiniMapProps> = ({ lat, lng, address, orderId }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(
    lat && lng && !isNaN(lat) && !isNaN(lng) && lat !== 0 ? { lat, lng } : null
  );

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDwr-cKcQ4nQFEVWwk7UI3cdRbEdLIcc4g';
    if (!apiKey) return;

    if (typeof window !== 'undefined' && (window as any).google?.maps?.Map) {
      setMapsLoaded(true);
      return;
    }

    (window as any).gmapsMiniCallback = () => setMapsLoaded(true);

    const scriptId = 'google-maps-mini-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=gmapsMiniCallback`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // Geocode address string if GPS coordinates are default or missing
  useEffect(() => {
    const isStaticDefault = lat === 17.4483 && lng === 78.3742;
    if (lat && lng && !isNaN(lat) && !isNaN(lng) && lat !== 0 && !isStaticDefault) {
      setMarkerPos({ lat, lng });
      return;
    }

    if (!mapsLoaded || !address || typeof window === 'undefined') {
      if (lat && lng) setMarkerPos({ lat, lng });
      return;
    }

    try {
      const google = (window as any).google;
      if (!google?.maps?.Geocoder) return;

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: address, componentRestrictions: { country: 'IN' } }, (results: any, status: any) => {
        if (status === 'OK' && results?.[0]?.geometry?.location) {
          const gLat = results[0].geometry.location.lat();
          const gLng = results[0].geometry.location.lng();
          setMarkerPos({ lat: gLat, lng: gLng });
        }
      });
    } catch (err) {
      console.error('Geocoder MiniMap error:', err);
    }
  }, [mapsLoaded, lat, lng, address]);

  useEffect(() => {
    if (!mapsLoaded || typeof window === 'undefined' || !mapRef.current || !markerPos) return;

    try {
      const google = (window as any).google;
      if (!google?.maps?.Map) return;

      const map = new google.maps.Map(mapRef.current, {
        center: markerPos,
        zoom: 16,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'greedy',
      });

      googleMapRef.current = map;

      // Add Custom Customer Order Pin
      new google.maps.Marker({
        position: markerPos,
        map: map,
        title: `Customer Delivery Pin #${orderId}`,
        icon: {
          path: 'M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12zm0 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z',
          fillColor: '#004d3b',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffc400',
          scale: 1.2,
          anchor: new google.maps.Point(12, 24),
        },
      });
    } catch (err) {
      console.error('Mini Map error:', err);
    }
  }, [mapsLoaded, markerPos, orderId]);

  if (!markerPos) return null;

  return (
    <div className="relative w-full h-[180px] rounded-xl overflow-hidden border border-gray-200 shadow-xs bg-gray-50 mt-2">
      {!mapsLoaded && (
        <div className="absolute inset-0 z-10 bg-white/90 flex items-center justify-center space-x-2 text-xs font-medium text-gray-500">
          <Loader2 size={16} className="animate-spin text-[#004d3b]" />
          <span>Loading Map Location...</span>
        </div>
      )}

      <div ref={mapRef} className="w-full h-full z-0" />

      <a
        href={`https://www.google.com/maps/search/?api=1&query=${markerPos.lat},${markerPos.lng}`}
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-2.5 right-2.5 z-10 bg-white/95 hover:bg-white text-[#004d3b] font-extrabold text-[10px] px-3 py-1.5 rounded-lg border border-amber-300 shadow-md inline-flex items-center gap-1 transition-all"
      >
        <span>Open Navigation</span> <ExternalLink size={11} />
      </a>
    </div>
  );
};
