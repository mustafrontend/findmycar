import React, { useState } from 'react';
import { useParkingStore } from '../../store/parkingStore';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { ShieldCheck, CheckCircle2, Apple, Globe, ExternalLink, HardDrive, Smartphone, X, Trash2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AppStoreProfileModal: React.FC = () => {
  const {
    isAppStoreProfileOpen,
    setAppStoreProfileOpen,
    deleteAccountAndData,
    restorePurchases,
  } = useParkingStore();

  const [isLoading, setIsLoading] = useState(false);

  if (!isAppStoreProfileOpen) return null;

  const handleRestore = async () => {
    setIsLoading(true);
    await restorePurchases();
    setIsLoading(false);
  };

  const checklistItems = [
    { text: "Bundle Identifier: com.findmycar.parkedlocation", done: true },
    { text: "Age Rating: 4+ (İçerik/Şiddet Barındırmaz)", done: true },
    { text: "12 Küresel Dil Desteği & RTL Yerelleştirmesi", done: true },
    { text: "Gizlilik Politikası: %100 Cihaz İçi (Sıfır Veri Toplama)", done: true },
    { text: "In-App Purchase ($3.99 Ömür Boyu Kilit Açma)", done: true },
    { text: "Codemagic Otomatik TestFlight & IPA Build Pipeline", done: true },
    { text: "Apple Madde 5.1.1(v) Hesabımı & Verilerimi Sil Özelliği", done: true },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="w-full max-w-lg bg-white rounded-3xl p-6 border-[0.5px] border-slate-200 shadow-2xl relative max-h-[85vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={() => setAppStoreProfileOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Profile Title */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <Apple className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">App Store Geliştirici Profili</h3>
                <Badge variant="emerald" size="sm">iOS Ready</Badge>
              </div>
              <p className="text-xs font-semibold text-slate-500">App Store Connect & Yayın Gereksinimleri</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* App Identification Card */}
            <Card className="bg-slate-50 border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-slate-700" /> Uygulama Kimliği
                </span>
                <span className="font-mono text-[11px] font-bold text-slate-500">v1.0.0 (Build 1)</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700 font-medium">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block">Bundle ID</span>
                  <span className="font-mono text-xs font-bold text-slate-900">com.findmycar.parkedlocation</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block">Kategori</span>
                  <span className="text-xs font-bold text-slate-900">Navigasyon & Araçlar</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block">Yaş Sınırı</span>
                  <span className="text-xs font-bold text-emerald-700">4+ (Her Yaş İçin Uygun)</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block">Monetizasyon</span>
                  <span className="text-xs font-bold text-amber-600">$3.99 Ömür Boyu Pro</span>
                </div>
              </div>
            </Card>

            {/* Account Actions: Restore Purchases & Delete Account */}
            <Card className="bg-slate-50 border-slate-200 space-y-2">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Hesap & Satın Alma Yönetimi
              </span>
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleRestore}
                  disabled={isLoading}
                  className="w-full py-2.5 px-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <RefreshCw className={`w-4 h-4 text-emerald-600 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Satın Alımları Geri Yükle (Restore Purchases)</span>
                </button>

                {/* Apple Mandatory Account Deletion (Section 5.1.1(v)) */}
                <button
                  onClick={deleteAccountAndData}
                  className="w-full py-2.5 px-3 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-extrabold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Hesabımı ve Tüm Verilerimi Sil (Delete Account & Data)</span>
                </button>
              </div>
            </Card>

            {/* Checklist */}
            <Card className="bg-slate-50 border-slate-200 space-y-2.5">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> App Store Gönderim Kontrol Listesi
              </span>
              <div className="space-y-2 pt-1">
                {checklistItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-800 font-semibold bg-white p-2 rounded-xl border border-slate-200/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Privacy & Support Links */}
            <Card className="bg-slate-50 border-slate-200 space-y-2">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-sky-600" /> Bağlantılar & Gizlilik
              </span>
              <div className="space-y-1.5 pt-1">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Gizlilik Politikası</span>
                  <a
                    href="https://raw.githack.com/mustafrontend/findmycar/main/public/privacy.html"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <span>Gizlilik Politikası Oku</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Destek URL</span>
                  <a
                    href="https://raw.githack.com/mustafrontend/findmycar/main/public/support.html"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <span>Destek Sayfası Oku</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </Card>

            {/* Zero Infrastructure Guarantee */}
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2.5 text-xs font-semibold">
              <HardDrive className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>Sıfır Sunucu Maliyeti — Tüm park verileri kullanıcı cihazında CoreData ve LocalStorage içerisinde güvenle saklanır.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
