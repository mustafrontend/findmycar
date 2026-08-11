import React from 'react';
import { useParkingStore } from '../../store/parkingStore';
import { translations } from '../../i18n/translations';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { Car, Clock, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LockScreenWidgetPreview: React.FC = () => {
  const { currentSpot, timerState, isWidgetPreviewOpen, setWidgetPreviewOpen, language } = useParkingStore();
  const t = translations[language];

  if (!isWidgetPreviewOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-4"
      >
        <Card className="bg-slate-900 text-white border-slate-800 shadow-2xl relative overflow-hidden">
          <button
            onClick={() => setWidgetPreviewOpen(false)}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <Badge variant="sky" size="sm">
              iOS Lock Screen Widget & Dynamic Island Live Activity
            </Badge>
          </div>

          {/* Dynamic Island Bar */}
          <div className="mx-auto w-48 h-8 rounded-full bg-black border border-slate-700/80 flex items-center justify-between px-3 text-xs mb-4 shadow-inner">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Car className="w-3.5 h-3.5" />
              <span className="font-extrabold text-[10px]">PARKED</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-300 font-bold">
              {currentSpot?.floorNote || 'B-12 (-2.Kat)'}
            </span>
          </div>

          {/* iOS Lockscreen Widget Card */}
          <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black">{t.appName} Widget</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Live Activity</span>
            </div>

            {currentSpot ? (
              <div className="flex items-center justify-between text-xs pt-1">
                <div>
                  <p className="font-extrabold text-white">{currentSpot.floorNote || 'Park Edildi'}</p>
                  <p className="text-[11px] text-slate-400">{currentSpot.address || 'GPS Koordinatı Alındı'}</p>
                </div>
                {timerState.enabled && (
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3 text-amber-400" /> Kalan
                    </span>
                    <span className="font-mono font-bold text-amber-400">Sayaç Aktif</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs font-semibold text-slate-400 text-center py-1">
                Tek dokunuşla kilit ekranından araç konumu kaydedilir.
              </p>
            )}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
