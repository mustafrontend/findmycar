import React, { useRef, useState } from 'react';
import { useParkingStore } from '../../store/parkingStore';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { Camera, Image as ImageIcon, Ticket, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ParkingTicketModal: React.FC = () => {
  const { currentSpot, updateTicketPhotoUrl } = useParkingStore();
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentSpot) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateTicketPhotoUrl(reader.result);
          setIsOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pt-2 border-t border-slate-100">
      {currentSpot.ticketPhotoUrl ? (
        <Card hoverEffect className="p-3 bg-slate-900 text-white border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-amber-400" />
              <div>
                <h4 className="text-xs font-black">Otopark Bilet Fişi Kaydedildi 🧾</h4>
                <p className="text-[10px] text-slate-400">Çıkışta ödeme otomatına okutmak için tıklayın</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md"
            >
              Fişi Gör 🔍
            </button>
          </div>
        </Card>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-2 px-3 rounded-2xl border border-dashed border-amber-300 hover:border-amber-400 bg-amber-50/50 hover:bg-amber-50 text-amber-900 font-extrabold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <Ticket className="w-4 h-4 text-amber-600" />
          <span>Otopark Fişi / Bilet Fotoğrafı Ekle 🧾</span>
        </button>
      )}

      {/* Fullscreen Ticket View / Upload Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-3xl p-5 border-[0.5px] border-slate-200 shadow-2xl relative"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-amber-600" />
                <span>Otopark Bilet Fişi Kaydı</span>
              </h3>
              <p className="text-xs font-semibold text-slate-500 mb-4">
                Çıkışta ödeme yaparken barkodu okutmak için kullanabilirsiniz.
              </p>

              {currentSpot.ticketPhotoUrl ? (
                <div className="space-y-3">
                  <div className="rounded-2xl overflow-hidden border border-slate-300 max-h-72 bg-black">
                    <img src={currentSpot.ticketPhotoUrl} alt="Otopark Fişi" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex gap-2">
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    <Button fullWidth onClick={() => fileInputRef.current?.click()} variant="outline">
                      Yeniden Çek
                    </Button>
                    <Button fullWidth onClick={() => setIsOpen(false)} variant="secondary">
                      Tamam
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  <Button
                    fullWidth
                    onClick={() => fileInputRef.current?.click()}
                    variant="primary-emerald"
                    size="lg"
                    leftIcon={<Camera className="w-5 h-5" />}
                  >
                    Fişin Fotoğrafını Çek
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="lg"
                    leftIcon={<ImageIcon className="w-5 h-5 text-slate-600" />}
                  >
                    Galeriden Bilet Seç
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
