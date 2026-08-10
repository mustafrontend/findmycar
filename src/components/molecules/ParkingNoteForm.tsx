import React, { useState } from 'react';
import { useParkingStore } from '../../store/parkingStore';
import { translations } from '../../i18n/translations';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { VoiceMemoRecorder } from './VoiceMemoRecorder';
import { ParkingTicketModal } from './ParkingTicketModal';
import { AlertTriangle, Camera, Check, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export const ParkingNoteForm: React.FC = () => {
  const { currentSpot, updateFloorNote, setCameraModalOpen, language } = useParkingStore();
  const t = translations[language];
  
  const [note, setNote] = useState(currentSpot?.floorNote || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!currentSpot) return null;

  const handleBlurOrSave = () => {
    updateFloorNote(note);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <Card className="mt-4 border-slate-200/90 bg-white">
      {/* Low GPS Signal Warning */}
      {currentSpot.isLowGpsSignal && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3.5 p-3 rounded-2xl bg-amber-50/90 border-[0.5px] border-amber-200 text-amber-900 flex items-start gap-2.5"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-extrabold text-amber-950">{t.lowGpsWarningTitle}</p>
            <p className="font-medium text-amber-800/90 mt-0.5">{t.lowGpsWarningSub}</p>
          </div>
        </motion.div>
      )}

      {/* Floor / Column Quick Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>{t.floorNoteLabel}</span>
          </label>
          {isSaved && (
            <Badge variant="emerald" size="sm" icon={<Check className="w-3 h-3" />}>
              Kaydedildi
            </Badge>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={handleBlurOrSave}
            placeholder={t.floorNotePlaceholder}
            className="w-full px-3.5 py-2.5 text-sm font-semibold rounded-2xl bg-slate-50 border-[0.5px] border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-slate-800 transition-all"
          />
        </div>

        {/* Quick Floor Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {['-3. Kat', '-2. Kat', '-1. Kat', 'Sarı B-12', 'Mavi A-05', 'Açık Otopark'].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                const newNote = note ? `${note} (${chip})` : chip;
                setNote(newNote);
                updateFloorNote(newNote);
              }}
              className="px-2.5 py-1 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all shrink-0 active:scale-95"
            >
              + {chip}
            </button>
          ))}
        </div>

        {/* Voice Memo Recorder */}
        <VoiceMemoRecorder />

        {/* Parking Ticket Snapshot */}
        <ParkingTicketModal />

        {/* Camera Photo Attachment Button / Preview */}
        <div className="pt-2 border-t border-slate-100">
          {currentSpot.photoUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 group">
              <img
                src={currentSpot.photoUrl}
                alt="Parking Column"
                className="w-full h-36 object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                <button
                  onClick={() => setCameraModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-white text-xs font-bold text-slate-900 shadow-md active:scale-95"
                >
                  {t.changePhotoBtn}
                </button>
              </div>
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-1">
                <span>{t.photoCaptured}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setCameraModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-2xl border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100/80 text-slate-700 font-extrabold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>{t.addPhotoBtn}</span>
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};
