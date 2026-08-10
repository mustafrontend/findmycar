import React, { useState } from 'react';
import { useParkingStore } from '../../store/parkingStore';
import { storageService } from '../../services/storageService';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { Calendar, History, MapPin, Navigation, Trash2, Camera, Mic, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ParkingSpot } from '../../types/parking';

export const ParkingHistoryDrawer: React.FC = () => {
  const { isHistoryOpen, setHistoryOpen, loadSpotFromHistory } = useParkingStore();
  const [historyList, setHistoryList] = useState<ParkingSpot[]>(storageService.getSpotHistory());

  if (!isHistoryOpen) return null;

  const handleClearAll = () => {
    if (confirm("Tüm geçmiş park kayıtlarını silmek istediğinize emin misiniz?")) {
      storageService.clearSpotHistory();
      setHistoryList([]);
    }
  };

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = historyList.filter((s) => s.id !== id);
    localStorage.setItem('findmycar_spot_history', JSON.stringify(updated));
    setHistoryList(updated);
  };

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
            onClick={() => setHistoryOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center justify-between mb-4 pr-8">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-2xl bg-indigo-100 text-indigo-700">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Geçmiş Park Konumları Ajandası</h3>
                <p className="text-xs font-semibold text-slate-500">Cihazınızda saklanan gerçek park kayıtları</p>
              </div>
            </div>

            {historyList.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-2.5 py-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Temizle</span>
              </button>
            )}
          </div>

          {historyList.length === 0 ? (
            <div className="text-center py-10 space-y-2.5 text-slate-400">
              <Calendar className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
              <p className="text-xs font-bold text-slate-500">Henüz kaydedilmiş park geçmişiniz yok.</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Ana ekrandaki "BURAYA PARK ETTİM" butonuna dokunduğunuzda park kayıtlarınız otomatik olarak burada listelenecektir.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {historyList.map((spot, idx) => (
                <Card
                  key={spot.id + idx}
                  hoverEffect
                  onClick={() => {
                    loadSpotFromHistory(spot);
                    setHistoryOpen(false);
                  }}
                  className="cursor-pointer border-slate-200 hover:border-indigo-300 bg-slate-50/70 hover:bg-white transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {spot.photoUrl ? (
                        <img
                          src={spot.photoUrl}
                          alt="Parked Spot"
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 border border-indigo-200/80 flex items-center justify-center text-indigo-700 font-black shrink-0">
                          <MapPin className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-black text-slate-900">
                            {spot.floorNote || 'Park Konumu'}
                          </h4>
                          {spot.isLowGpsSignal && (
                            <Badge variant="amber" size="sm">
                              Düşük GPS
                            </Badge>
                          )}
                          {spot.audioUrl && (
                            <Badge variant="indigo" size="sm" icon={<Mic className="w-2.5 h-2.5" />}>
                              Sesli Not
                            </Badge>
                          )}
                          {spot.photoUrl && (
                            <Badge variant="emerald" size="sm" icon={<Camera className="w-2.5 h-2.5" />}>
                              Fotoğraflı
                            </Badge>
                          )}
                        </div>

                        <p className="text-[11px] font-semibold text-slate-500">
                          {new Date(spot.timestamp).toLocaleDateString([], {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}{' '}
                          • {new Date(spot.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleDeleteItem(e, spot.id)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 transition-all active:scale-95"
                        title="Kaydı Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          loadSpotFromHistory(spot);
                          setHistoryOpen(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                      >
                        <span>Haritada Aç</span>
                        <Navigation className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
