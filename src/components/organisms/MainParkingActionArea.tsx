import React from 'react';
import { useParkingStore } from '../../store/parkingStore';
import { translations } from '../../i18n/translations';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { locationService } from '../../services/locationService';
import { soundService } from '../../services/soundService';
import { Car, MapPin, Navigation, Trash2, Footprints, ExternalLink, ShieldCheck, Share2, Link2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const MainParkingActionArea: React.FC = () => {
  const {
    currentSpot,
    saveCurrentLocation,
    clearSavedLocation,
    isLocating,
    navigationMetrics,
    language,
  } = useParkingStore();

  const t = translations[language];

  const handleClear = () => {
    if (confirm(t.clearConfirm)) {
      clearSavedLocation();
    }
  };

  const handleShare = async () => {
    if (!currentSpot) return;
    soundService.playClickSound();

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${currentSpot.latitude},${currentSpot.longitude}`;
    const floorInfo = currentSpot.floorNote ? ` (${currentSpot.floorNote})` : '';
    const shareText = `🚗 Arabamın Park Konumu${floorInfo}:\n${googleMapsUrl}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Arabamın Konumu',
          text: shareText,
          url: googleMapsUrl,
        });
        return;
      } catch {
        // Fallback to direct WhatsApp
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
      }
    } else {
      // Direct WhatsApp fallback
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      {/* Shared Location Incoming Banner */}
      {currentSpot?.isSharedLocation && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-emerald-50 border-[0.5px] border-emerald-300 text-emerald-950 flex items-start gap-3 shadow-xs"
        >
          <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
            <Link2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-emerald-950">{t.sharedBannerTitle}</h4>
            <p className="text-[11px] font-semibold text-emerald-800 mt-0.5">{t.sharedBannerSub}</p>
          </div>
        </motion.div>
      )}

      {/* Primary Focal Action Button */}
      <div className="text-center">
        {!currentSpot ? (
          /* SCREEN 1: "BURAYA PARK ETTİM" */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-3"
          >
            <Button
              fullWidth
              size="hero"
              variant="primary-rose"
              isLoading={isLocating}
              onClick={saveCurrentLocation}
              leftIcon={<Car className="w-8 h-8 animate-bounce" />}
              className="shadow-glow-red hover:shadow-2xl hover:scale-[1.01] py-8"
            >
              {t.parkHereBtn}
            </Button>
            <p className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>0 Saniye Gecikme ile GPS Hafızaya Alınır</span>
            </p>
          </motion.div>
        ) : (
          /* SCREEN 2: "ARABAMA GÖTÜR" */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-3"
          >
            <Button
              fullWidth
              size="hero"
              variant="primary-emerald"
              onClick={() => {
                const url = locationService.getGoogleMapsUrl(
                  currentSpot.latitude,
                  currentSpot.longitude
                );
                window.open(url, '_blank');
              }}
              leftIcon={<Navigation className="w-8 h-8 animate-pulse" />}
              className="shadow-glow-green hover:shadow-2xl hover:scale-[1.01] py-8"
            >
              {t.takeMeToCarBtn}
            </Button>
            <p className="text-xs font-bold text-slate-600">
              Yürüme Navigasyonu Başlatılır (Walking Navigation)
            </p>
          </motion.div>
        )}
      </div>

      {/* Saved Location Summary Card */}
      {currentSpot && (
        <Card className="border-emerald-200/80 bg-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900">
                    {currentSpot.floorNote || 'Park Edildi'}
                  </h3>
                  {currentSpot.isLowGpsSignal && (
                    <Badge variant="amber" size="sm">
                      Düşük GPS
                    </Badge>
                  )}
                  {currentSpot.isSharedLocation && (
                    <Badge variant="sky" size="sm">
                      Paylaşıldı 📲
                    </Badge>
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {new Date(currentSpot.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  tarihinde kaydedildi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleShare}
                className="p-2 rounded-xl text-sky-600 hover:bg-sky-50 transition-all flex items-center gap-1 text-xs font-extrabold"
                title={t.shareLocationBtn}
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleClear}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                title={t.clearLocationBtn}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
            <div className="p-2.5 rounded-2xl bg-slate-50 border-[0.5px] border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">{t.distanceToCar}</span>
              <span className="text-base font-black text-slate-900 font-mono">
                {navigationMetrics ? `${navigationMetrics.distanceMeters} Metre` : '15 Metre'}
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50 border-[0.5px] border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block flex items-center gap-1">
                <Footprints className="w-3 h-3 text-emerald-600" />
                {t.walkingTime}
              </span>
              <span className="text-base font-black text-slate-900 font-mono">
                {navigationMetrics ? `~${navigationMetrics.estimatedWalkingMinutes} Dk` : '~1 Dk'}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons Row */}
          <div className="space-y-2 mt-3">
            <Button
              fullWidth
              onClick={handleShare}
              variant="outline"
              size="md"
              leftIcon={<Share2 className="w-4 h-4 text-sky-600" />}
              className="border-sky-200 bg-sky-50/50 hover:bg-sky-50 text-sky-900 font-black"
            >
              {t.shareLocationBtn} (WhatsApp / SMS)
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={locationService.getGoogleMapsUrl(currentSpot.latitude, currentSpot.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{t.openGoogleMaps}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={locationService.getAppleMapsUrl(currentSpot.latitude, currentSpot.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{t.openAppleMaps}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
