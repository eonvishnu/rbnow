"use client";

import React, { useEffect, useRef, useState } from 'react';
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer';
import type { AdminOrder } from '@/features/orders/types/order';
import { Phone, User, ExternalLink, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface OrdersMapViewProps {
  orders: AdminOrder[];
  onSelectOrder: (orderId: string) => void;
}

const STORE_HUB_LAT = 17.389751719625146;
const STORE_HUB_LNG = 78.42299024706544;

export const OrdersMapView: React.FC<OrdersMapViewProps> = ({ orders, onSelectOrder }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const storeMarkerRef = useRef<any>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const orderMarkersRef = useRef<any[]>([]);

  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<AdminOrder[] | null>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);

  // Load Google Maps JS SDK dynamically with loading=async
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async&callback=gmapsOrdersCallback`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // Initialize Native Google Map & Render Clustered Order Location Markers
  useEffect(() => {
    if (!mapsLoaded || typeof window === 'undefined' || !mapRef.current) return;

    let isCancelled = false;

    try {
      const google = (window as any).google;
      if (!google?.maps?.Map) return;

      if (!googleMapRef.current) {
        googleMapRef.current = new google.maps.Map(mapRef.current, {
          center: { lat: STORE_HUB_LAT, lng: STORE_HUB_LNG },
          zoom: 12,
          disableDefaultUI: false,
          zoomControl: true,
          gestureHandling: 'greedy',
        });
      }

      const map = googleMapRef.current;

      // Add Ivory Cream Royal Bengal Store Hub Pin once (kept outside the clusterer)
      if (!storeMarkerRef.current) {
        const storeHubSvg = window.btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="52" height="60" viewBox="0 0 52 60">
            <!-- Ground contact shadow -->
            <ellipse cx="26" cy="55" rx="9" ry="3.2" fill="#000000" fill-opacity="0.22"/>
            <!-- Main teardrop pin body - Ivory Cream -->
            <path d="M26 3C14.402 3 5 12.402 5 24c0 14.2 21 30 21 30s21-15.8 21-30C47 12.402 37.598 3 26 3z" fill="#FDFBF7" stroke="#006B50" stroke-width="2.5"/>
            <!-- Crisp inner medallion -->
            <circle cx="26" cy="23.5" r="13.5" fill="#006B50" stroke="#FFC400" stroke-width="1.5"/>
            <!-- Minimalist Storefront / Hub icon -->
            <path d="M18.5 21.5l1.3-4.2h12.4l1.3 4.2" fill="none" stroke="#FFC400" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.5 21.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" fill="none" stroke="#FFC400" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20 23.8v6.2h12v-6.2M24.2 30v-3.8h3.6V30" fill="none" stroke="#ffffff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `);

        storeMarkerRef.current = new google.maps.Marker({
          position: { lat: STORE_HUB_LAT, lng: STORE_HUB_LNG },
          map: map,
          title: 'Royal Bengal Store Hub',
          zIndex: 999,
          icon: {
            url: `data:image/svg+xml;base64,${storeHubSvg}`,
            scaledSize: new google.maps.Size(28, 32),
            anchor: new google.maps.Point(14, 30),
          },
        });
      }

      // Initialize MarkerClusterer once with custom Royal Bengal badge renderer
      if (!clustererRef.current) {
        clustererRef.current = new MarkerClusterer({
          map,
          algorithm: new SuperClusterAlgorithm({
            radius: 65,
            maxZoom: 16,
          }),
          renderer: {
            render: ({ count, position, markers }) => {
              const totalOrders = (markers || []).reduce(
                (sum: number, m: any) => sum + (m.__orderCount || 1),
                0
              );

              const size = totalOrders >= 10 ? 48 : 42;
              const half = size / 2;

              const svg = window.btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                  <circle cx="${half}" cy="${half}" r="${half - 2}" fill="#006B50" stroke="#FFC400" stroke-width="3"/>
                  <text x="${half}" y="${half + 5}" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle" font-family="sans-serif">${totalOrders}</text>
                </svg>
              `);

              return new google.maps.Marker({
                position,
                title: `${totalOrders} orders in this area (click to zoom in)`,
                zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
                icon: {
                  url: `data:image/svg+xml;base64,${svg}`,
                  anchor: new google.maps.Point(half, half),
                },
              });
            },
          },
        });
      }

      const coordMap = new Map<string, { lat: number; lng: number; orders: AdminOrder[] }>();

      const rebuildClusterMarkers = () => {
        if (isCancelled || !clustererRef.current) return;

        clustererRef.current.clearMarkers();
        orderMarkersRef.current.forEach((m) => m.setMap(null));
        orderMarkersRef.current = [];

        const newMarkers: any[] = [];

        coordMap.forEach(({ lat, lng, orders: groupOrders }) => {
          const count = groupOrders.length;
          const isDelivered = groupOrders.every((o) => o.status === 'delivered');
          const isOut = groupOrders.some((o) => o.status === 'out_for_delivery');
          const pinColor = isDelivered ? '#2563eb' : isOut ? '#006B50' : '#006B50';

          const svg = window.btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
              <circle cx="19" cy="19" r="16" fill="${pinColor}" stroke="#ffffff" stroke-width="3"/>
              <text x="19" y="24" font-size="13" font-weight="900" fill="#ffffff" text-anchor="middle" font-family="sans-serif">${count}</text>
            </svg>
          `);

          const marker: any = new google.maps.Marker({
            position: { lat, lng },
            title: count > 1 ? `${count} orders at this exact address` : `Order #${groupOrders[0].orderId}`,
            icon: {
              url: `data:image/svg+xml;base64,${svg}`,
              anchor: new google.maps.Point(19, 19),
            },
          });

          marker.__orderCount = count;

          marker.addListener('click', () => {
            setSelectedGroup(groupOrders);
            setActiveIdx(0);
          });

          newMarkers.push(marker);
        });

        orderMarkersRef.current = newMarkers;
        clustererRef.current.addMarkers(newMarkers);
      };

      const addOrderToCoordMap = (lat: number, lng: number, order: AdminOrder) => {
        const key = `${lat.toFixed(4)}_${lng.toFixed(4)}`;
        const existing = coordMap.get(key);
        if (existing) {
          existing.orders.push(order);
        } else {
          coordMap.set(key, { lat, lng, orders: [order] });
        }
      };

      const geocoder = google.maps.Geocoder ? new google.maps.Geocoder() : null;

      orders.forEach((order) => {
        const addr = order.shipping as any;
        const lat = Number(addr?.lat ?? addr?.latitude ?? addr?.latLng?.lat);
        const lng = Number(addr?.lng ?? addr?.longitude ?? addr?.lon ?? addr?.latLng?.lng);

        const hasValidCoords = lat && lng && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

        if (hasValidCoords) {
          addOrderToCoordMap(lat, lng, order);
        } else if (geocoder) {
          const fullAddressString = [
            addr?.houseNo || addr?.houseNumber,
            addr?.address,
            addr?.area,
            addr?.city || 'Hyderabad',
            addr?.pincode,
          ]
            .filter(Boolean)
            .join(', ');

          if (fullAddressString) {
            geocoder.geocode(
              { address: fullAddressString, componentRestrictions: { country: 'IN' } },
              (results: any, status: any) => {
                if (!isCancelled && status === 'OK' && results?.[0]?.geometry?.location) {
                  const geoLat = results[0].geometry.location.lat();
                  const geoLng = results[0].geometry.location.lng();
                  addOrderToCoordMap(geoLat, geoLng, order);
                  rebuildClusterMarkers();
                }
              }
            );
          }
        }
      });

      rebuildClusterMarkers();
    } catch (err) {
      console.error('Google Maps Orders View Error:', err);
    }

    return () => {
      isCancelled = true;
    };
  }, [mapsLoaded, orders]);

  // Clean up clusterer and markers on unmount
  useEffect(() => {
    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current = null;
      }
      orderMarkersRef.current.forEach((m) => m.setMap(null));
      if (storeMarkerRef.current) {
        storeMarkerRef.current.setMap(null);
      }
    };
  }, []);

  const currentActiveOrder = selectedGroup ? selectedGroup[activeIdx] : null;

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
      <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-gray-200 shadow-md flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#1a1a1a]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FDFBF7] border border-[#006B50]" />
          <span>Dark Store Hub</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#006B50] ring-1 ring-[#FFC400]" />
          <span>Zoom Cluster</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#006B50]" />
          <span>Active Order(s)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
          <span>Delivered</span>
        </div>
      </div>

      {/* Selected Order Group Summary Card Overlay */}
      {currentActiveOrder && selectedGroup && (
        <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-80 z-20 bg-white rounded-xl border border-amber-300 shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-bold text-sm text-[#1a1a1a]">#{currentActiveOrder.orderId}</span>
              <span className="bg-[#e5f5ef] text-[#006b50] text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-[#bce2d3] shrink-0">
                {currentActiveOrder.status}
              </span>
            </div>
            <button
              onClick={() => setSelectedGroup(null)}
              className="text-gray-400 hover:text-gray-600 text-xs font-bold"
            >
              ✕
            </button>
          </div>

          {selectedGroup.length > 1 && (
            <div className="flex items-center justify-between bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-900">
              <span>
                Order {activeIdx + 1} of {selectedGroup.length} at this address
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={activeIdx === 0}
                  onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
                  className="p-1 rounded bg-white border border-amber-300 disabled:opacity-40 hover:bg-amber-100 transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  disabled={activeIdx === selectedGroup.length - 1}
                  onClick={() => setActiveIdx((prev) => Math.min(selectedGroup.length - 1, prev + 1))}
                  className="p-1 rounded bg-white border border-amber-300 disabled:opacity-40 hover:bg-amber-100 transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1 text-xs">
            <p className="font-semibold text-[#1a1a1a] flex items-center gap-1.5">
              <User size={13} className="text-[#616161]" />{' '}
              {currentActiveOrder.shipping?.name || currentActiveOrder.userName || 'Customer'}
            </p>
            <p className="text-[#616161] flex items-center gap-1.5">
              <Phone size={13} className="text-[#616161]" />{' '}
              {currentActiveOrder.shipping?.phone || currentActiveOrder.userPhone || '—'}
            </p>
            <p className="text-[#303030] text-[11px] truncate pt-1">
              📍 {currentActiveOrder.shipping?.address || `${currentActiveOrder.shipping?.city || 'Hyderabad'}`}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-gray-100">
            <span className="text-xs font-bold text-[#1a1a1a]">₹{currentActiveOrder.total.toFixed(2)}</span>
            <button
              onClick={() => {
                onSelectOrder(currentActiveOrder.id);
                setSelectedGroup(null);
              }}
              className="px-3 py-1.5 bg-[#006b50] hover:bg-[#004d3b] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
            >
              <span>View Order</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
