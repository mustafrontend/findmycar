import React, { useEffect, useState } from 'react';
import { useParkingStore } from '../../store/parkingStore';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { Compass, Navigation2 } from 'lucide-react';

export const CompassOverlay: React.FC = () => {
  const { currentSpot, navigationMetrics } = useParkingStore();
  const [deviceHeading, setDeviceHeading] = useState(0);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setDeviceHeading(360 - e.alpha);
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
      return () => window.removeEventListener('deviceorientation', handleOrientation, true);
    }
  }, []);

  if (!currentSpot) return null;

  const targetBearing = navigationMetrics?.bearingDegrees || 45;
  const relativeArrowRotation = (targetBearing - deviceHeading + 360) % 360;

  return (
    <Card hoverEffect className="mt-4 border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
          <div>
            <h4 className="text-xs font-black text-white">Canlı Pusula Radar 🧭</h4>
            <p className="text-[10px] text-slate-400">Telefonu çevirdikçe arabanın yönünü gösterir</p>
          </div>
        </div>
        <Badge variant="emerald" size="sm">
          {navigationMetrics ? `${navigationMetrics.distanceMeters}m` : '15m'}
        </Badge>
      </div>

      <div className="mt-4 flex items-center justify-around">
        {/* Rotating Compass Arrow */}
        <div className="relative w-20 h-20 rounded-full border-2 border-slate-700 bg-black/40 flex items-center justify-center shadow-inner">
          <div
            className="transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${relativeArrowRotation}deg)` }}
          >
            <Navigation2 className="w-10 h-10 text-emerald-400 fill-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          </div>
        </div>

        {/* Heading details */}
        <div className="text-right space-y-1 font-mono">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Hedef Yön Açısı</span>
          <span className="text-xl font-black text-emerald-400">{targetBearing}° Açı</span>
          <span className="text-[11px] text-slate-300 block font-sans">
            Yürüyüş Süresi: <strong className="text-white">~{navigationMetrics?.estimatedWalkingMinutes || 1} Dk</strong>
          </span>
        </div>
      </div>
    </Card>
  );
};
