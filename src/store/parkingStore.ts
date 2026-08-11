import { create } from 'zustand';
import type { LanguageCode, NavigationMetrics, ParkingMeterState, ParkingSpot, ParkingTimerState, ProState } from '../types/parking';
import { storageService } from '../services/storageService';
import { locationService } from '../services/locationService';
import { soundService } from '../services/soundService';
import { revenueCatService } from '../services/revenuecatService';
import confetti from 'canvas-confetti';
import { LocalNotifications } from '@capacitor/local-notifications';

interface ParkingStoreState {
  // Core state
  currentSpot: ParkingSpot | null;
  userPosition: { lat: number; lng: number } | null;
  navigationMetrics: NavigationMetrics | null;
  isLocating: boolean;
  
  // Pro & monetization state
  proState: ProState;
  timerState: ParkingTimerState;
  meterState: ParkingMeterState;
  
  // UI & i18n
  language: LanguageCode;
  isLanguageModalOpen: boolean;
  isProModalOpen: boolean;
  isCameraModalOpen: boolean;
  isAppStoreProfileOpen: boolean;
  isWidgetPreviewOpen: boolean;
  isFlashlightOpen: boolean;
  isHistoryOpen: boolean;
  bluetoothConnected: boolean;

  // Actions
  saveCurrentLocation: () => Promise<void>;
  updateFloorNote: (note: string) => void;
  updatePhotoUrl: (photoUrl: string) => void;
  updateAudioUrl: (audioUrl: string) => void;
  updateTicketPhotoUrl: (ticketPhotoUrl: string) => void;
  loadSpotFromHistory: (spot: ParkingSpot) => void;
  clearSavedLocation: () => void;
  updateUserPosition: (lat: number, lng: number) => void;
  
  // Pro actions
  unlockPro: () => void;
  setTimer: (durationMinutes: number) => void;
  cancelTimer: () => void;
  updateMeterRate: (rate: number, currency: string) => void;
  toggleBluetoothSimulation: () => void;
  simulateBluetoothDisconnect: () => Promise<void>;

  restorePurchases: () => Promise<boolean>;
  deleteAccountAndData: () => void;

  // UI actions
  setLanguage: (lang: LanguageCode) => void;
  setLanguageModalOpen: (open: boolean) => void;
  setProModalOpen: (open: boolean) => void;
  setCameraModalOpen: (open: boolean) => void;
  setAppStoreProfileOpen: (open: boolean) => void;
  setWidgetPreviewOpen: (open: boolean) => void;
  setFlashlightOpen: (open: boolean) => void;
  setHistoryOpen: (open: boolean) => void;
  checkTimerAlerts: () => void;
}

export const useParkingStore = create<ParkingStoreState>((set, get) => {
  const initialSpot = locationService.parseShareUrl() || storageService.getParkingSpot();

  return {
    currentSpot: initialSpot,
    userPosition: null,
    navigationMetrics: null,
    isLocating: false,
  
  proState: storageService.getProState(),
  timerState: storageService.getTimerState(),
  meterState: storageService.getMeterState(),
  
  language: storageService.getLanguage(),
  isLanguageModalOpen: !storageService.isLanguageSelected(),
  isProModalOpen: false,
  isCameraModalOpen: false,
  isAppStoreProfileOpen: false,
  isWidgetPreviewOpen: false,
    isFlashlightOpen: false,
    isHistoryOpen: false,
    bluetoothConnected: true,

    saveCurrentLocation: async () => {
      set({ isLocating: true });
      soundService.playClickSound();

      const { spot, isLowSignal } = await locationService.getCurrentPosition();
      
      // Play haptic feedback sound
      if (isLowSignal) {
        soundService.playWarningSound();
      } else {
        soundService.playSaveSuccessSound();
      }

      storageService.saveParkingSpot(spot);

      const userPos = get().userPosition || { lat: spot.latitude, lng: spot.longitude };
      const metrics = locationService.calculateMetrics(
        userPos.lat,
        userPos.lng,
        spot.latitude,
        spot.longitude
      );

      set({
        currentSpot: spot,
        isLocating: false,
        navigationMetrics: metrics,
      });
    },

    updateFloorNote: (note: string) => {
      const spot = get().currentSpot;
      if (!spot) return;
      const updated = { ...spot, floorNote: note };
      storageService.saveParkingSpot(updated);
      set({ currentSpot: updated });
    },

    updatePhotoUrl: (photoUrl: string) => {
      const spot = get().currentSpot;
      if (!spot) return;
      const updated = { ...spot, photoUrl };
      storageService.saveParkingSpot(updated);
      set({ currentSpot: updated });
    },

    updateAudioUrl: (audioUrl: string) => {
      const spot = get().currentSpot;
      if (!spot) return;
      const updated = { ...spot, audioUrl };
      storageService.saveParkingSpot(updated);
      set({ currentSpot: updated });
    },

    updateTicketPhotoUrl: (ticketPhotoUrl: string) => {
      const spot = get().currentSpot;
      if (!spot) return;
      const updated = { ...spot, ticketPhotoUrl };
      storageService.saveParkingSpot(updated);
      set({ currentSpot: updated });
    },

    loadSpotFromHistory: (spot: ParkingSpot) => {
      soundService.playClickSound();
      storageService.saveParkingSpot(spot);
      const userPos = get().userPosition || { lat: spot.latitude, lng: spot.longitude };
      const metrics = locationService.calculateMetrics(
        userPos.lat,
        userPos.lng,
        spot.latitude,
        spot.longitude
      );
      set({
        currentSpot: spot,
        navigationMetrics: metrics,
        isHistoryOpen: false,
      });
    },

  clearSavedLocation: () => {
    soundService.playClickSound();
    storageService.saveParkingSpot(null);
    get().cancelTimer();
    set({
      currentSpot: null,
      navigationMetrics: null,
    });
  },

  updateUserPosition: (lat: number, lng: number) => {
    const spot = get().currentSpot;
    let metrics: NavigationMetrics | null = null;
    if (spot) {
      metrics = locationService.calculateMetrics(lat, lng, spot.latitude, spot.longitude);
    }
    set({
      userPosition: { lat, lng },
      navigationMetrics: metrics,
    });
  },

  unlockPro: async () => {
    soundService.playClickSound();
    let isSuccess = false;
    try {
      isSuccess = await revenueCatService.purchasePro();
    } catch (err) {
      console.warn("RevenueCat native purchase error:", err);
    }

    if (isSuccess) {
      soundService.playSaveSuccessSound();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      const newProState: ProState = {
        isProUnlocked: true,
        unlockedAt: Date.now(),
        autoSaveBluetoothEnabled: true,
      };
      storageService.saveProState(newProState);
      set({
        proState: newProState,
        isProModalOpen: false,
      });
    } else {
      console.log("Purchase cancelled or incomplete. Pro state locked.");
    }
  },

  restorePurchases: async (): Promise<boolean> => {
    soundService.playClickSound();
    const isRestored = await revenueCatService.restorePurchases();
    if (isRestored) {
      soundService.playSaveSuccessSound();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      const newProState: ProState = {
        isProUnlocked: true,
        unlockedAt: Date.now(),
        autoSaveBluetoothEnabled: true,
      };
      storageService.saveProState(newProState);
      set({ proState: newProState, isProModalOpen: false });
      alert("✅ Satın alımlarınız başarıyla geri yüklendi! Pro erişiminiz aktif.");
      return true;
    } else {
      alert("ℹ️ Aktif bir satın alma bulunamadı.");
      return false;
    }
  },

  deleteAccountAndData: () => {
    if (confirm("⚠️ TÜM VERİLERİ VE HESABI SİL\n\nKaydedilmiş tüm park konumlarınız, fotoğraflarınız, sesli notlarınız ve tercihleriniz silinecektir. Devam etmek istiyor musunuz?")) {
      soundService.playWarningSound();
      storageService.clearAllAccountData();
      set({
        currentSpot: null,
        userPosition: null,
        navigationMetrics: null,
        isLocating: false,
        proState: { isProUnlocked: false, unlockedAt: null, autoSaveBluetoothEnabled: false },
        timerState: { enabled: false, startTime: null, durationMinutes: 60, alert15MinFired: false, isExpired: false },
        meterState: { enabled: false, hourlyRate: 50, currency: '₺' },
        isProModalOpen: false,
        isAppStoreProfileOpen: false,
        isHistoryOpen: false,
      });
      alert("🗑️ Hesabınız ve tüm verileriniz başarıyla silindi.");
    }
  },

  setTimer: async (durationMinutes: number) => {
    soundService.playClickSound();
    const newTimer: ParkingTimerState = {
      enabled: true,
      startTime: Date.now(),
      durationMinutes,
      alert15MinFired: false,
      isExpired: false,
    };
    storageService.saveTimerState(newTimer);
    set({ timerState: newTimer });

    // Request Web Notification permissions
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted') {
      try {
        await Notification.requestPermission();
      } catch (err) {
        console.warn("Web notification permission error:", err);
      }
    }

    // Schedule Capacitor Native Local Notification
    try {
      const perm = await LocalNotifications.requestPermissions();
      if (perm.display === 'granted') {
        const triggerTime = new Date(Date.now() + durationMinutes * 60 * 1000);
        await LocalNotifications.schedule({
          notifications: [
            {
              title: "⚠️ Otopark Süreniz Bitiyor!",
              body: `${durationMinutes} dakikalık otopark süreniz doldu! Lütfen aracınızı kontrol edin.`,
              id: 1001,
              schedule: { at: triggerTime },
              sound: 'beep.wav',
            },
          ],
        });
      }
    } catch (err) {
      console.warn("Capacitor LocalNotifications schedule error:", err);
    }
  },

  cancelTimer: async () => {
    const disabledTimer: ParkingTimerState = {
      enabled: false,
      startTime: null,
      durationMinutes: 60,
      alert15MinFired: false,
      isExpired: false,
    };
    storageService.saveTimerState(disabledTimer);
    set({ timerState: disabledTimer });

    try {
      await LocalNotifications.cancel({ notifications: [{ id: 1001 }] });
    } catch (err) {
      console.warn("LocalNotifications cancel error:", err);
    }
  },

  updateMeterRate: (rate: number, currency: string) => {
    const updatedMeter: ParkingMeterState = {
      enabled: true,
      hourlyRate: rate,
      currency,
    };
    storageService.saveMeterState(updatedMeter);
    set({ meterState: updatedMeter });
  },

  toggleBluetoothSimulation: () => {
    set((state) => ({ bluetoothConnected: !state.bluetoothConnected }));
  },

  simulateBluetoothDisconnect: async () => {
    const state = get();
    soundService.playWarningSound();
    set({ bluetoothConnected: false });
    // Save location automatically on disconnect
    await state.saveCurrentLocation();

    // Trigger native or browser notification toast
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification("🚗 Bluetooth Bağlantısı Kesildi!", {
        body: "Aracınızdan uzaklaştınız — Park konumunuz otomatik olarak hafızaya alındı.",
      });
    }
  },

  setLanguage: (lang: LanguageCode) => {
    storageService.saveLanguage(lang);
    storageService.setLanguageSelected(true);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
    set({ language: lang, isLanguageModalOpen: false });
  },

  setLanguageModalOpen: (open: boolean) => set({ isLanguageModalOpen: open }),
  setProModalOpen: (open: boolean) => set({ isProModalOpen: open }),
  setCameraModalOpen: (open: boolean) => set({ isCameraModalOpen: open }),
  setAppStoreProfileOpen: (open: boolean) => set({ isAppStoreProfileOpen: open }),
  setWidgetPreviewOpen: (open: boolean) => set({ isWidgetPreviewOpen: open }),
  setFlashlightOpen: (open: boolean) => set({ isFlashlightOpen: open }),
  setHistoryOpen: (open: boolean) => set({ isHistoryOpen: open }),

  checkTimerAlerts: () => {
    const { timerState } = get();
    if (!timerState.enabled || !timerState.startTime) return;

    const elapsedSeconds = Math.floor((Date.now() - timerState.startTime) / 1000);
    const totalSeconds = timerState.durationMinutes * 60;
    const remainingSeconds = totalSeconds - elapsedSeconds;

    // Check 15 min early alert (900 seconds remaining)
    if (remainingSeconds <= 900 && remainingSeconds > 0 && !timerState.alert15MinFired) {
      soundService.playAlarmBeep();
      const updatedTimer = { ...timerState, alert15MinFired: true };
      storageService.saveTimerState(updatedTimer);
      set({ timerState: updatedTimer });

      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification("⏰ Otopark Süre Uyarısı", {
          body: "Otopark sürenizin dolmasına son 15 dakika kaldı!",
        });
      }
    }

    // Check expiration
    if (remainingSeconds <= 0 && !timerState.isExpired) {
      soundService.playAlarmBeep();
      const updatedTimer = { ...timerState, isExpired: true };
      storageService.saveTimerState(updatedTimer);
      set({ timerState: updatedTimer });

      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification("⚠️ Otopark Süreniz Doldu!", {
          body: "Otopark süreniz dolmuştur. Lütfen aracınızı kontrol edin.",
        });
      }
    }
  },
};
});

