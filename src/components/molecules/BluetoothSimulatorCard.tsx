import React from 'react';
import { useParkingStore } from '../../store/parkingStore';
import { translations } from '../../i18n/translations';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { Bluetooth, Lock, Radio, Sparkles } from 'lucide-react';

export const BluetoothSimulatorCard: React.FC = () => {
  const {
    proState,
    bluetoothConnected,
    simulateBluetoothDisconnect,
    setProModalOpen,
    language,
  } = useParkingStore();

  const t = translations[language];

  if (!proState.isProUnlocked) {
    return (
      <Card hoverEffect className="mt-4 border-slate-200 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 font-black">
              <Bluetooth className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">{t.bluetoothAutoSaveTitle}</h4>
              <p className="text-[11px] font-semibold text-slate-500 line-clamp-1">{t.bluetoothAutoSaveSub}</p>
            </div>
          </div>
          <Badge variant="sky" icon={<Lock className="w-3 h-3" />}>
            PRO $3.99
          </Badge>
        </div>

        <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 border-[0.5px] border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">{t.proFeatures.bluetoothAuto}</span>
          <Button
            onClick={() => setProModalOpen(true)}
            variant="pro"
            size="sm"
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Aç ($3.99)
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mt-4 border-sky-200/80 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 font-black">
            <Bluetooth className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900">{t.bluetoothAutoSaveTitle}</h4>
            <p className="text-[11px] font-semibold text-slate-500">{t.bluetoothAutoSaveSub}</p>
          </div>
        </div>
        <Badge
          variant={bluetoothConnected ? 'emerald' : 'amber'}
          icon={<Radio className="w-3 h-3 animate-pulse" />}
        >
          {bluetoothConnected ? 'Bluetooth Bağlı 🚗' : 'Koptu (Kaydedildi)'}
        </Badge>
      </div>

      <div className="p-3 rounded-2xl bg-slate-50 border-[0.5px] border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">Araba Bağlantı Durumu:</span>
          <span className="font-extrabold text-slate-900">
            {bluetoothConnected ? 'BMW iX3 Bluetooth (Aktif)' : 'Bağlantı Kesildi (Konum Kaydedildi)'}
          </span>
        </div>

        <Button
          fullWidth
          onClick={simulateBluetoothDisconnect}
          variant="outline"
          size="sm"
          leftIcon={<Bluetooth className="w-4 h-4 text-sky-600" />}
        >
          {t.bluetoothDisconnectedSimulate} ⚡
        </Button>
      </div>
    </Card>
  );
};
