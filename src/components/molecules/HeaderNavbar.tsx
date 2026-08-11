import React from 'react';
import { useParkingStore } from '../../store/parkingStore';
import { translations } from '../../i18n/translations';
import { Badge } from '../atoms/Badge';
import { Globe, Sparkles, Smartphone, History, Zap, Apple } from 'lucide-react';
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
    setLanguageModalOpen,
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
    <header
      className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md border-b-[0.5px] border-slate-200/80 px-4 pb-3"
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)' }}
    >
      <div className="max-w-md mx-auto space-y-2.5">
        {/* Main Row: Logo, Brand Name, Pro Upgrade, Language Switcher */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2 shrink-0">
            <img
              src="/app_logo.jpg"
              alt="Find My Car Logo"
              className="w-9 h-9 rounded-2xl object-cover shadow-md border border-slate-200 shrink-0"
            />
            <div>
              <h1 className="text-sm font-black tracking-tight text-slate-900 leading-tight">
                {t.appName}
              </h1>
              <p className="text-[10px] font-medium text-slate-500 line-clamp-1 max-w-[130px] sm:max-w-none">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Right Top Actions: Pro Badge & Language Dropdown */}
          <div className="flex items-center gap-1.5 shrink-0">
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
                <span>$3.99</span>
              </button>
            )}

            {/* Language Selector Button (Opens Onboarding / Dropdown) */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => setLanguageModalOpen(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-xl border-[0.5px] border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{languages.find((l) => l.code === language)?.flag}</span>
                <span className="text-[11px]">{language.toUpperCase()}</span>
              </button>
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

        {/* Quick Action Bar Subrow */}
        <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-200/50">
          <button
            onClick={() => setHistoryOpen(true)}
            className="flex-1 py-1.5 px-2 rounded-xl border-[0.5px] border-slate-200 bg-white hover:bg-slate-100/80 text-slate-700 text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-2xs"
          >
            <History className="w-3.5 h-3.5 text-indigo-600" />
            <span>Geçmiş Ajanda</span>
          </button>

          <button
            onClick={() => setFlashlightOpen(true)}
            className="flex-1 py-1.5 px-2 rounded-xl border-[0.5px] border-slate-200 bg-white hover:bg-slate-100/80 text-slate-700 text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
            <span>Fener Modu</span>
          </button>

          <button
            onClick={() => setWidgetPreviewOpen(!isWidgetPreviewOpen)}
            className="py-1.5 px-2.5 rounded-xl border-[0.5px] border-slate-200 bg-white hover:bg-slate-100/80 text-slate-700 text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-2xs"
            title={t.lockScreenWidgetTitle}
          >
            <Smartphone className="w-3.5 h-3.5 text-sky-600" />
            <span>Widget</span>
          </button>

          <button
            onClick={() => setAppStoreProfileOpen(true)}
            className="py-1.5 px-2.5 rounded-xl border-[0.5px] border-slate-200 bg-white hover:bg-slate-100/80 text-slate-700 text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-2xs"
            title="App Store Geliştirici Profili"
          >
            <Apple className="w-3.5 h-3.5 text-slate-900" />
            <span>Profil</span>
          </button>
        </div>
      </div>
    </header>
  );
};
