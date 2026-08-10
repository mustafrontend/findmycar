export type LanguageCode = 'tr' | 'en' | 'de' | 'es' | 'fr' | 'it' | 'pt' | 'ru' | 'ja' | 'ko' | 'zh' | 'ar';

export interface ParkingSpot {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
  floorNote?: string;
  photoUrl?: string;
  isLowGpsSignal?: boolean;
  isSharedLocation?: boolean;
  audioUrl?: string;
  ticketPhotoUrl?: string;
}

export interface ParkingTimerState {
  enabled: boolean;
  startTime: number | null;
  durationMinutes: number;
  alert15MinFired: boolean;
  isExpired: boolean;
}

export interface ParkingMeterState {
  enabled: boolean;
  hourlyRate: number;
  currency: string;
}

export interface ProState {
  isProUnlocked: boolean;
  unlockedAt: number | null;
  autoSaveBluetoothEnabled: boolean;
}

export interface NavigationMetrics {
  distanceMeters: number;
  bearingDegrees: number;
  estimatedWalkingMinutes: number;
}
