import type { LanguageCode, ParkingMeterState, ParkingSpot, ParkingTimerState, ProState } from '../types/parking';

const STORAGE_KEYS = {
  PARKING_SPOT: 'findmycar_current_spot',
  PARKING_TIMER: 'findmycar_timer_state',
  PARKING_METER: 'findmycar_meter_state',
  PRO_STATE: 'findmycar_pro_state',
  LANGUAGE: 'findmycar_language',
  LANGUAGE_SELECTED: 'findmycar_language_selected',
  SPOT_HISTORY: 'findmycar_spot_history',
};

export class StorageService {
  public saveParkingSpot(spot: ParkingSpot | null): void {
    if (!spot) {
      localStorage.removeItem(STORAGE_KEYS.PARKING_SPOT);
      return;
    }
    localStorage.setItem(STORAGE_KEYS.PARKING_SPOT, JSON.stringify(spot));

    // Save to history array (deduplicate by id)
    let history = this.getSpotHistory();
    const existingIdx = history.findIndex((h) => h.id === spot.id);
    if (existingIdx !== -1) {
      history[existingIdx] = spot;
    } else {
      history.unshift(spot);
    }
    localStorage.setItem(STORAGE_KEYS.SPOT_HISTORY, JSON.stringify(history.slice(0, 10)));
  }

  public getParkingSpot(): ParkingSpot | null {
    const data = localStorage.getItem(STORAGE_KEYS.PARKING_SPOT);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  public getSpotHistory(): ParkingSpot[] {
    const data = localStorage.getItem(STORAGE_KEYS.SPOT_HISTORY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  public clearSpotHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.SPOT_HISTORY);
  }

  public saveTimerState(timer: ParkingTimerState): void {
    localStorage.setItem(STORAGE_KEYS.PARKING_TIMER, JSON.stringify(timer));
  }

  public getTimerState(): ParkingTimerState {
    const data = localStorage.getItem(STORAGE_KEYS.PARKING_TIMER);
    if (!data) {
      return {
        enabled: false,
        startTime: null,
        durationMinutes: 60,
        alert15MinFired: false,
        isExpired: false,
      };
    }
    try {
      return JSON.parse(data);
    } catch {
      return {
        enabled: false,
        startTime: null,
        durationMinutes: 60,
        alert15MinFired: false,
        isExpired: false,
      };
    }
  }

  public saveMeterState(meter: ParkingMeterState): void {
    localStorage.setItem(STORAGE_KEYS.PARKING_METER, JSON.stringify(meter));
  }

  public getMeterState(): ParkingMeterState {
    const data = localStorage.getItem(STORAGE_KEYS.PARKING_METER);
    if (!data) {
      return {
        enabled: false,
        hourlyRate: 50,
        currency: '₺',
      };
    }
    try {
      return JSON.parse(data);
    } catch {
      return {
        enabled: false,
        hourlyRate: 50,
        currency: '₺',
      };
    }
  }

  public saveProState(pro: ProState): void {
    localStorage.setItem(STORAGE_KEYS.PRO_STATE, JSON.stringify(pro));
  }

  public getProState(): ProState {
    const data = localStorage.getItem(STORAGE_KEYS.PRO_STATE);
    if (!data) {
      return {
        isProUnlocked: false,
        unlockedAt: null,
        autoSaveBluetoothEnabled: false,
      };
    }
    try {
      return JSON.parse(data);
    } catch {
      return {
        isProUnlocked: false,
        unlockedAt: null,
        autoSaveBluetoothEnabled: false,
      };
    }
  }

  public saveLanguage(lang: LanguageCode): void {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }

  public isLanguageSelected(): boolean {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE_SELECTED) === 'true';
  }

  public setLanguageSelected(selected: boolean = true): void {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE_SELECTED, selected ? 'true' : 'false');
  }

  public getLanguage(): LanguageCode {
    const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    const validLangs: LanguageCode[] = ['tr', 'en', 'de', 'es', 'fr', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar'];
    if (lang && validLangs.includes(lang as LanguageCode)) {
      return lang as LanguageCode;
    }
    return 'tr';
  }
}

export const storageService = new StorageService();
