import React from 'react';
import { useParkingStore } from '../../store/parkingStore';
import { Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LanguageCode } from '../../types/parking';

export const FirstLaunchLanguageModal: React.FC = () => {
  const { isLanguageModalOpen, language, setLanguage } = useParkingStore();

  if (!isLanguageModalOpen) return null;

  const languages: { code: LanguageCode; name: string; nativeName: string; flag: string }[] = [
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية (RTL)', flag: '🇸🇦' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md bg-white rounded-3xl p-6 border-[0.5px] border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          {/* Top Icon */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-14 h-14 rounded-3xl bg-slate-900 text-white mx-auto flex items-center justify-center shadow-lg shadow-slate-900/20">
              <Globe className="w-7 h-7 text-emerald-400" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Dilinizi Seçin / Select Language
            </h2>
            <p className="text-xs font-semibold text-slate-500 max-w-xs mx-auto">
              Find My Car uygulamasını kullanmak istediğiniz dili seçiniz
            </p>
          </div>

          {/* 12 Language Selection Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {languages.map((l) => {
              const isSelected = language === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-95 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{l.flag}</span>
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                        {l.nativeName}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {l.name}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
