import React, { useEffect, useState } from 'react';
import { useParkingStore } from '../../store/parkingStore';
import { translations } from '../../i18n/translations';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { AlarmClock, Calculator, Lock, Play, StopCircle, Sparkles } from 'lucide-react';

export const ParkingTimerCard: React.FC = () => {
  const {
    timerState,
    meterState,
    proState,
    setTimer,
    cancelTimer,
    updateMeterRate,
    setProModalOpen,
    checkTimerAlerts,
    language,
  } = useParkingStore();

  const t = translations[language];

  const [customMinutes, setCustomMinutes] = useState(60);
  const [hourlyRate, setHourlyRate] = useState(meterState.hourlyRate);

  // Live timer tick effect
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      checkTimerAlerts();
    }, 1000);
    return () => clearInterval(interval);
  }, [checkTimerAlerts]);

  // Calculate remaining time
  let remainingSeconds = 0;
  let accumulatedFee = 0;
  if (timerState.enabled && timerState.startTime) {
    const elapsedSeconds = Math.floor((Date.now() - timerState.startTime) / 1000);
    const totalSeconds = timerState.durationMinutes * 60;
    remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

    // Fee calculation
    const elapsedHours = elapsedSeconds / 3600;
    accumulatedFee = Math.max(hourlyRate, Math.round(elapsedHours * hourlyRate));
  }

  const formatTimer = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // If Pro is locked, show attractive PRO preview teaser
  if (!proState.isProUnlocked) {
    return (
      <Card hoverEffect className="mt-4 border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-white to-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-black">
              <AlarmClock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">{t.parkingTimerTitle}</h4>
              <p className="text-[11px] font-semibold text-slate-500 line-clamp-1">{t.parkingTimerSub}</p>
            </div>
          </div>
          <Badge variant="amber" icon={<Lock className="w-3 h-3" />}>
            PRO $2.99
          </Badge>
        </div>

        <div className="mt-3.5 p-3 rounded-2xl bg-white border-[0.5px] border-slate-200 flex items-center justify-between">
          <div className="text-xs">
            <span className="font-extrabold text-slate-900 block">{t.proFeatures.timerAlert}</span>
            <span className="font-semibold text-slate-500 text-[11px]">Otopark cezasını önleyin</span>
          </div>
          <Button
            onClick={() => setProModalOpen(true)}
            variant="pro"
            size="sm"
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Aç ($2.99)
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mt-4 border-emerald-200/80 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black">
            <AlarmClock className="w-4.4 h-4.4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900">{t.parkingTimerTitle}</h4>
            <p className="text-[11px] font-semibold text-slate-500">{t.parkingTimerSub}</p>
          </div>
        </div>
        <Badge variant="emerald" icon={<Sparkles className="w-3 h-3" />}>
          PRO Aktif
        </Badge>
      </div>

      {timerState.enabled ? (
        <div className="space-y-3">
          {/* Active Countdown Box */}
          <div
            className={`p-4 rounded-2xl text-center border ${
              timerState.isExpired
                ? 'bg-rose-50 border-rose-300 text-rose-900 animate-pulse'
                : remainingSeconds <= 900
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            }`}
          >
            <span className="text-[11px] font-extrabold tracking-wider uppercase opacity-80 block mb-1">
              {t.remainingTime}
            </span>
            <span className="text-3xl font-black tracking-tight font-mono">
              {formatTimer(remainingSeconds)}
            </span>

            {timerState.isExpired && (
              <p className="text-xs font-black text-rose-600 mt-1">{t.timerExpiredAlert}</p>
            )}
            {!timerState.isExpired && remainingSeconds <= 900 && (
              <p className="text-xs font-black text-amber-700 mt-1">{t.timer15MinAlert}</p>
            )}
          </div>

          {/* Live Parking Meter Cost */}
          <div className="p-3 rounded-2xl bg-slate-50 border-[0.5px] border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-700">{t.currentFeeLabel}:</span>
            </div>
            <span className="text-sm font-black text-slate-900 font-mono">
              {accumulatedFee} {meterState.currency}
            </span>
          </div>

          <Button fullWidth onClick={cancelTimer} variant="outline" size="sm" leftIcon={<StopCircle className="w-4 h-4 text-rose-600" />}>
            Sayacı Durdur
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Preset Buttons */}
          <div className="grid grid-cols-4 gap-1.5">
            {[30, 60, 120, 180].map((mins) => (
              <button
                key={mins}
                onClick={() => setCustomMinutes(mins)}
                className={`py-2 text-xs font-black rounded-xl border transition-all ${
                  customMinutes === mins
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {mins < 60 ? `${mins} Dk` : `${mins / 60} Saat`}
              </button>
            ))}
          </div>

          {/* Hourly Rate Input */}
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 border-[0.5px] border-slate-200">
            <span className="text-xs font-bold text-slate-700">{t.hourlyRateLabel}:</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setHourlyRate(val);
                  updateMeterRate(val, meterState.currency);
                }}
                className="w-16 px-2 py-1 text-xs font-black text-right rounded-lg bg-white border border-slate-300 font-mono"
              />
              <span className="text-xs font-bold text-slate-500">{meterState.currency}</span>
            </div>
          </div>

          <Button
            fullWidth
            onClick={() => setTimer(customMinutes)}
            variant="primary-emerald"
            size="md"
            leftIcon={<Play className="w-4 h-4 fill-current" />}
          >
            {customMinutes} Dk Park Sayacı Başlat
          </Button>
        </div>
      )}
    </Card>
  );
};
