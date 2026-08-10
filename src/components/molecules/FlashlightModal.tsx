import React, { useState } from 'react';
import { useParkingStore } from '../../store/parkingStore';
import { Button } from '../atoms/Button';
import { Sun, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FlashlightModal: React.FC = () => {
  const { isFlashlightOpen, setFlashlightOpen } = useParkingStore();
  const [flashlightColor, setFlashlightColor] = useState<'white' | 'amber'>('white');

  if (!isFlashlightOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 transition-colors duration-300 ${
          flashlightColor === 'white' ? 'bg-white text-slate-900' : 'bg-amber-400 text-slate-950'
        }`}
      >
        {/* Top bar controls */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-sm">
            <Zap className="w-5 h-5 fill-current" />
            <span>Otopark Acil Durum Feneri 🔦</span>
          </div>

          <button
            onClick={() => setFlashlightOpen(false)}
            className="p-3 rounded-full bg-black/10 hover:bg-black/20 text-current transition-all active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Center Flashlight Icon */}
        <div className="text-center space-y-4">
          <div className="w-32 h-32 rounded-full bg-white/40 backdrop-blur-md border-4 border-current mx-auto flex items-center justify-center animate-pulse">
            <Sun className="w-16 h-16 fill-current" />
          </div>
          <p className="text-sm font-extrabold max-w-xs">
            Karanlık kapalı otoparkta kolon numarasını okumak veya kapı kilidini bulmak için maksimum parlaklık!
          </p>
        </div>

        {/* Bottom controls */}
        <div className="w-full max-w-xs space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => setFlashlightColor('white')}
              className={`flex-1 py-2.5 rounded-2xl font-bold text-xs border transition-all ${
                flashlightColor === 'white' ? 'bg-slate-900 text-white' : 'bg-white/40 text-slate-900'
              }`}
            >
              Beyaz Işık ⚪
            </button>
            <button
              onClick={() => setFlashlightColor('amber')}
              className={`flex-1 py-2.5 rounded-2xl font-bold text-xs border transition-all ${
                flashlightColor === 'amber' ? 'bg-slate-900 text-white' : 'bg-white/40 text-slate-900'
              }`}
            >
              Sarı Işık 🟡
            </button>
          </div>

          <Button fullWidth onClick={() => setFlashlightOpen(false)} variant="secondary" size="lg">
            Feneri Kapat
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
