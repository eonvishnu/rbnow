"use client";

import React, { useEffect, useRef, useState } from 'react';
import type { AdminOrder } from '@/features/orders/types/order';
import { MapPin, Phone, User, ExternalLink, Loader2 } from 'lucide-react';

interface OrdersMapViewProps {
  orders: AdminOrder[];
  onSelectOrder: (orderId: string) => void;
}

const STORE_HUB_LAT = 17.351452;
const STORE_HUB_LNG = 78.391039;

export const OrdersMapView: React.FC<OrdersMapViewProps> = ({ orders, onSelectOrder }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [selectedOrderPin, setSelectedOrderPin] = useState<AdminOrder | null>(null);

  // Load Google Maps JS SDK dynamically
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDwr-cKcQ4nQFEVWwk7UI3cdRbEdLIcc4g';
    if (!apiKey) return;

    if (typeof window !== 'undefined' && (window as any).google?.maps?.Map) {
      setMapsLoaded(true);
      return;
    }

    (window as any).gmapsOrdersCallback = () => setMapsLoaded(true);

    const scriptId = 'google-maps-orders-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=gmapsOrdersCallback`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // Initialize Native Google Map & Render Accurate Order Markers
  useEffect(() => {
    if (!mapsLoaded || typeof window === 'undefined' || !mapRef.current) return;

    try {
      const google = (window as any).google;
      if (!google?.maps?.Map) return;

      if (!googleMapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: STORE_HUB_LAT, lng: STORE_HUB_LNG },
          zoom: 13,
          disableDefaultUI: false,
          zoomControl: true,
          gestureHandling: 'greedy',
        });
        googleMapRef.current = map;
      }

      const map = googleMapRef.current;

      // Clear existing markers
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];

      // Add Store Hub Marker
      const storeMarker = new google.maps.Marker({
        position: { lat: STORE_HUB_LAT, lng: STORE_HUB_LNG },
        map: map,
        title: 'Royal Bengal Dark Store Hub',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#004d3b',
          fillOpacity: 1,
          strokeWeight: 3,
          strokeColor: '#ffc400',
        },
      });
      markersRef.current.push(storeMarker);

      // Render Order Markers with Accurate Geocoding
      orders.forEach((order) => {
        const addr = order.shipping as any;
        let lat = Number(addr?.lat ?? addr?.latitude);
        let lng = Number(addr?.lng ?? addr?.longitude);

        const isDelivered = order.status === 'delivered';
        const isOut = order.status === 'out_for_delivery';
        const pinColor = isDelivered ? '#2563eb' : isOut ? '#006b50' : '#f59e0b';

        const createMarkerAtPos = (pLat: number, pLng: number) => {
          const marker = new google.maps.Marker({
            position: { lat: pLat, lng: pLng },
            map: map,
            title: `Order #${order.orderId}`,
            icon: {
              path: 'M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12zm0 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z',
              fillColor: pinColor,
              fillOpacity: 1,
              strokeWeight: 1.5,
              strokeColor: '#ffffff',
              scale: 1.1,
              anchor: new google.maps.Point(12, 24),
            },
          });

          marker.addListener('click', () => {
            setSelectedOrderPin(order);
          });

          markersRef.current.push(marker);
        };

        const isStaticDefault = lat === 17.351452 && lng === 78.391039;

        if (lat && lng && !isNaN(lat) && !isNaN(lng) && lat !== 0 && !isStaticDefault) {
          createMarkerAtPos(lat, lng);
        } else {
          // Geocode full street address using Google Geocoder for 100% pin accuracy
          const fullAddressString = [
            addr?.houseNo || addr?.houseNumber,
            addr?.address,
            addr?.area,
            addr?.city || 'Hyderabad',
            addr?.pincode,
          ].filter(Boolean).join(', ');

          if (fullAddressString && google.maps.Geocoder) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: fullAddressString, componentRestrictions: { country: 'IN' } }, (results: any, status: any) => {
              if (status === 'OK' && results?.[0]?.geometry?.location) {
                const geoLat = results[0].geometry.location.lat();
                const geoLng = results[0].geometry.location.lng();
                createMarkerAtPos(geoLat, geoLng);
              }
            });
          }
        }
      });

    } catch (err) {
      console.error('Google Maps Orders View Error:', err);
    }
  }, [mapsLoaded, orders]);

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 flex flex-col">
      {!mapsLoaded && (
        <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex items-center justify-center space-y-2 flex-col">
          <Loader2 size={24} className="animate-spin text-[#004d3b]" />
          <p className="text-xs font-semibold text-[#616161]">Loading Google Maps Fleet View...</p>
        </div>
      )}

      {/* Map Element */}
      <div ref={mapRef} className="w-full h-full z-0" />

      {/* Map Legend Bar */}
      <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-gray-200 shadow-md flex items-center gap-3 text-[11px] font-semibold text-[#1a1a1a]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#004d3b] border border-amber-400" />
          <span>Dark Store Hub</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
          <span>Processing ({orders.filter(o => o.status !== 'delivered' && o.status !== 'out_for_delivery').length})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#006b50]" />
          <span>Out for Delivery ({orders.filter(o => o.status === 'out_for_delivery').length})</span>
        </div>
      </div>

      {/* Selected Order Summary Card Overlay */}
      {selectedOrderPin && (
        <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-80 z-20 bg-white rounded-xl border border-amber-300 shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#1a1a1a]">#{selectedOrderPin.orderId}</span>
              <span className="bg-[#e5f5ef] text-[#006b50] text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-[#bce2d3]">
                {selectedOrderPin.status}
              </span>
            </div>
            <button onClick={() => setSelectedOrderPin(null)} className="text-gray-400 hover:text-gray-600 text-xs font-bold">✕</button>
          </div>

          <div className="space-y-1 text-xs">
            <p className="font-semibold text-[#1a1a1a] flex items-center gap-1.5">
              <User size={13} className="text-[#616161]" /> {selectedOrderPin.shipping?.name || selectedOrderPin.userName || 'Customer'}
            </p>
            <p className="text-[#616161] flex items-center gap-1.5">
              <Phone size={13} className="text-[#616161]" /> {selectedOrderPin.shipping?.phone || selectedOrderPin.userPhone || '—'}
            </p>
            <p className="text-[#303030] text-[11px] truncate pt-1">
              📍 {selectedOrderPin.shipping?.address || `${selectedOrderPin.shipping?.city || 'Hyderabad'}`}
            </p>
            {(() => {
              const s = selectedOrderPin.shipping as any;
              const pLat = s?.lat ?? s?.latitude;
              const pLng = s?.lng ?? s?.longitude;
              if (!pLat || !pLng) return null;

              return (
                <p className="text-[10px] text-[#006b50] font-mono font-semibold pt-0.5">
                  GPS: {pLat}, {pLng}
                </p>
              );
            })()}
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm font-black text-[#004d3b]">₹{selectedOrderPin.total}</span>
            <button
              onClick={() => onSelectOrder(selectedOrderPin.id)}
              className="bg-[#303030] hover:bg-[#1a1a1a] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 shadow-xs transition-colors"
            >
              <span>View Order Details</span> <ExternalLink size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
