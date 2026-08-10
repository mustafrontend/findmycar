import { create } from 'zustand';
import type { LanguageCode, NavigationMetrics, ParkingMeterState, ParkingSpot, ParkingTimerState, ProState } from '../types/parking';
import { storageService } from '../services/storageService';
import { locationService } from '../services/locationService';
import { soundService } from '../services/soundService';
import confetti from 'canvas-confetti';

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

  unlockPro: () => {
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
  },

  setTimer: (durationMinutes: number) => {
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
  },

  cancelTimer: () => {
    const disabledTimer: ParkingTimerState = {
      enabled: false,
      startTime: null,
      durationMinutes: 60,
      alert15MinFired: false,
      isExpired: false,
    };
    storageService.saveTimerState(disabledTimer);
    set({ timerState: disabledTimer });
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
    // Simulate auto-save on disconnect
    await state.saveCurrentLocation();
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
        new Notification("⏰ Parking Timer Warning", {
          body: "Only 15 minutes left on your parking meter!",
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
        new Notification("⚠️ Parking Meter Expired!", {
          body: "Your parking time has expired. Please check your car.",
        });
      }
    }
  },
};
});

