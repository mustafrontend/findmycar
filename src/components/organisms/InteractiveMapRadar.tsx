import React, { useEffect, useRef } from 'react';
import { useParkingStore } from '../../store/parkingStore';
import { Card } from '../atoms/Card';
import L from 'leaflet';
import { Compass, Locate, MapPin } from 'lucide-react';

export const InteractiveMapRadar: React.FC = () => {
  const { currentSpot, userPosition, updateUserPosition } = useParkingStore();
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const targetLat = currentSpot?.latitude || 41.0082;
  const targetLng = currentSpot?.longitude || 28.9784;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([targetLat, targetLng], 17);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapRef.current = map;
    }

    // Geolocation watcher for user's live walking position
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          updateUserPosition(pos.coords.latitude, pos.coords.longitude);
        },
        () => {},
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [targetLat, targetLng, updateUserPosition]);

  // Update map markers when spot or user position changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Car pin marker
    const carIcon = L.divIcon({
      className: 'custom-car-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-12 h-12 rounded-full bg-rose-500/20 radar-ring"></div>
          <div class="w-10 h-10 rounded-2xl bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center text-white font-black text-lg">
            🚗
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    L.marker([targetLat, targetLng], { icon: carIcon })
      .addTo(map)
      .bindPopup(currentSpot?.floorNote || 'Arabanızın Konumu')
      .openPopup();

    // User position marker
    const userLat = userPosition?.lat || targetLat + 0.0003;
    const userLng = userPosition?.lng || targetLng + 0.0003;

    const userIcon = L.divIcon({
      className: 'custom-user-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
            🚶
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    L.marker([userLat, userLng], { icon: userIcon }).addTo(map);

    // Dotted polyline connecting user to car
    L.polyline(
      [
        [userLat, userLng],
        [targetLat, targetLng],
      ],
      {
        color: '#16a34a',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.8,
      }
    ).addTo(map);

    // Fit bounds to show both user and car
    const bounds = L.latLngBounds([
      [userLat, userLng],
      [targetLat, targetLng],
    ]);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [targetLat, targetLng, userPosition, currentSpot]);

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.setView([targetLat, targetLng], 17);
    }
  };

  return (
    <Card className="mt-4 border-slate-200 p-0 overflow-hidden relative">
      <div className="h-64 w-full" ref={containerRef} />

      {/* Recenter Button Overlay */}
      <button
        onClick={handleRecenter}
        className="absolute top-3 right-3 z-20 p-2.5 rounded-2xl bg-white/90 backdrop-blur-md text-slate-800 border-[0.5px] border-slate-300 shadow-md hover:bg-white active:scale-95 transition-all"
        title="Haritayı Merkezle"
      >
        <Locate className="w-4 h-4 text-emerald-600" />
      </button>

      {/* Map Footer Bar */}
      <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-extrabold text-slate-900">
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>Canlı Yön & Radar Haritası</span>
        </div>
        <span className="font-semibold text-slate-500 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-rose-500" />
          {targetLat.toFixed(4)}, {targetLng.toFixed(4)}
        </span>
      </div>
    </Card>
  );
};
