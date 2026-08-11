import React from 'react';
import { useParkingStore } from '../../store/parkingStore';
import { translations } from '../../i18n/translations';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { AlarmClock, Bluetooth, Calculator, Check, ShieldCheck, Sparkles, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProPaywallModal: React.FC = () => {
  const { isProModalOpen, setProModalOpen, unlockPro, language } = useParkingStore();
  const t = translations[language];

  if (!isProModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md bg-white rounded-3xl p-6 border-[0.5px] border-slate-200 shadow-2xl relative my-8"
        >
          {/* Close Button */}
          <button
            onClick={() => setProModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <Sparkles className="w-7 h-7" />
            </div>
            <Badge variant="amber" size="md">
              TEK SEFERLİK ÖDEME $3.99
            </Badge>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {t.unlockProTitle}
            </h2>
            <p className="text-xs font-semibold text-slate-500 max-w-xs mx-auto">
              {t.unlockProSub}
            </p>
          </div>

          {/* Features Bento List */}
          <div className="space-y-2.5 mb-6">
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border-[0.5px] border-amber-200/80 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0">
                <AlarmClock className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">{t.proFeatures.timerAlert}</h4>
                <p className="text-[11px] font-semibold text-slate-600">Otopark süreniz bitmeden 15 dk önce yüksek sesli alarm</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border-[0.5px] border-emerald-200/80 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
                <Calculator className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">{t.proFeatures.feeCalc}</h4>
                <p className="text-[11px] font-semibold text-slate-600">İçeride kalınan dakikaya göre anlık ücret gösterimi</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50/60 border-[0.5px] border-sky-200/80 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-sky-600 text-white shrink-0">
                <Bluetooth className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">{t.proFeatures.bluetoothAuto}</h4>
                <p className="text-[11px] font-semibold text-slate-600">Arabadan indiğin an arka planda sessiz konum kaydı</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border-[0.5px] border-indigo-200/80 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
                <Smartphone className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">{t.proFeatures.widgetSync}</h4>
                <p className="text-[11px] font-semibold text-slate-600">Uygulamayı açmadan kilit ekranı widget senkronizasyonu</p>
              </div>
            </div>
          </div>

          {/* Pricing CTA */}
          <div className="space-y-3">
            <Button
              fullWidth
              size="lg"
              variant="pro"
              onClick={unlockPro}
              leftIcon={<Sparkles className="w-5 h-5" />}
            >
              {t.unlockProBtn} ($3.99)
            </Button>

            <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Abonesiz / Ömür Boyu
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> Apple / Google Güvenli
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
