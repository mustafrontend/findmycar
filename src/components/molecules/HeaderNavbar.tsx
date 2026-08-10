import React from 'react';
import { useParkingStore } from '../../store/parkingStore';
import { translations } from '../../i18n/translations';
import { Badge } from '../atoms/Badge';
import { Car, Globe, Sparkles, Smartphone, History, Zap, Apple } from 'lucide-react';
import type { LanguageCode } from '../../types/parking';

export const HeaderNavbar: React.FC = () => {
  const {
    language,
    setLanguage,
    proState,
    setProModalOpen,
    setAppStoreProfileOpen,
    setWidgetPreviewOpen,
    isWidgetPreviewOpen,
    setHistoryOpen,
    setFlashlightOpen,
  } = useParkingStore();

  const t = translations[language];

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'tr', label: 'TR', flag: '🇹🇷' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'de', label: 'DE', flag: '🇩🇪' },
    { code: 'es', label: 'ES', flag: '🇪🇸' },
    { code: 'fr', label: 'FR', flag: '🇫🇷' },
    { code: 'it', label: 'IT', flag: '🇮🇹' },
    { code: 'pt', label: 'PT', flag: '🇵🇹' },
    { code: 'ru', label: 'RU', flag: '🇷🇺' },
    { code: 'ja', label: 'JA', flag: '🇯🇵' },
    { code: 'ko', label: 'KO', flag: '🇰🇷' },
    { code: 'zh', label: 'ZH', flag: '🇨🇳' },
    { code: 'ar', label: 'AR', flag: '🇸🇦' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-50/90 backdrop-blur-md border-b-[0.5px] border-slate-200/80 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-md">
            <Car className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-900 leading-tight">
              {t.appName}
            </h1>
            <p className="text-[11px] font-medium text-slate-500 line-clamp-1">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* History Agenda */}
          <button
            onClick={() => setHistoryOpen(true)}
            className="p-2 rounded-xl border-[0.5px] border-slate-200 bg-white hover:bg-slate-100/80 text-slate-700 transition-all active:scale-95"
            title="Park Geçmişi Ajandası"
          >
            <History className="w-4 h-4 text-indigo-600" />
          </button>

          {/* Flashlight */}
          <button
            onClick={() => setFlashlightOpen(true)}
            className="p-2 rounded-xl border-[0.5px] border-slate-200 bg-white hover:bg-slate-100/80 text-slate-700 transition-all active:scale-95"
            title="Gece Otopark Feneri"
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          </button>

          {/* Lock Screen Widget Toggle */}
          <button
            onClick={() => setWidgetPreviewOpen(!isWidgetPreviewOpen)}
            className="p-2 rounded-xl border-[0.5px] border-slate-200 bg-white hover:bg-slate-100/80 text-slate-700 transition-all active:scale-95"
            title={t.lockScreenWidgetTitle}
          >
            <Smartphone className="w-4 h-4 text-sky-600" />
          </button>

          {/* App Store Developer Profile */}
          <button
            onClick={() => setAppStoreProfileOpen(true)}
            className="p-2 rounded-xl border-[0.5px] border-slate-200 bg-white hover:bg-slate-100/80 text-slate-700 transition-all active:scale-95"
            title="App Store Geliştirici Profili"
          >
            <Apple className="w-4 h-4 text-slate-900" />
          </button>

          {/* Pro Status / Upgrade Badge */}
          {proState.isProUnlocked ? (
            <Badge variant="emerald" icon={<Sparkles className="w-3 h-3 text-emerald-600" />}>
              PRO
            </Badge>
          ) : (
            <button
              onClick={() => setProModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black shadow-xs hover:brightness-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-3 h-3" />
              <span>$2.99</span>
            </button>
          )}

          {/* Language Selector */}
          <div className="relative group">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border-[0.5px] border-slate-200 bg-white text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition-all">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{languages.find((l) => l.code === language)?.flag}</span>
              <span>{language.toUpperCase()}</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
