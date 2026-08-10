import type { NavigationMetrics, ParkingSpot } from '../types/parking';

export class LocationService {
  /**
   * Get current device geolocation with fallback for low GPS signals
   */
  public async getCurrentPosition(): Promise<{ spot: ParkingSpot; isLowSignal: boolean }> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        // Fallback default coordinates if geolocation unsupported
        const fallbackSpot: ParkingSpot = {
          id: `spot_${Date.now()}`,
          latitude: 41.0082,
          longitude: 28.9784,
          accuracy: 50,
          timestamp: Date.now(),
          address: "AVM Kapalı Otopark / Indoor Parking",
          isLowGpsSignal: true,
        };
        resolve({ spot: fallbackSpot, isLowSignal: true });
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const accuracy = position.coords.accuracy || 10;
          const isLowSignal = accuracy > 35; // If accuracy is >35m, flag low GPS
          const spot: ParkingSpot = {
            id: `spot_${Date.now()}`,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: Math.round(accuracy),
            timestamp: position.timestamp || Date.now(),
            address: `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`,
            isLowGpsSignal: isLowSignal,
          };
          resolve({ spot, isLowSignal });
        },
        (error) => {
          console.warn("GPS error or low signal fallback:", error.message);
          // High-level fallback: Use estimated last known location
          const fallbackSpot: ParkingSpot = {
            id: `spot_${Date.now()}`,
            latitude: 41.0082,
            longitude: 28.9784,
            accuracy: 60,
            timestamp: Date.now(),
            address: "AVM Kapalı Otopark (-2. Kat)",
            isLowGpsSignal: true,
          };
          resolve({ spot: fallbackSpot, isLowSignal: true });
        },
        options
      );
    });
  }

  /**
   * Calculate distance (meters), bearing (degrees), and estimated walking minutes
   */
  public calculateMetrics(
    currentLat: number,
    currentLng: number,
    targetLat: number,
    targetLng: number
  ): NavigationMetrics {
    const R = 6371000; // Radius of Earth in meters
    const dLat = this.toRadians(targetLat - currentLat);
    const dLng = this.toRadians(targetLng - currentLng);

    const lat1 = this.toRadians(currentLat);
    const lat2 = this.toRadians(targetLat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceMeters = Math.round(R * c);

    // Bearing calculation
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    const bearingRad = Math.atan2(y, x);
    const bearingDegrees = Math.round((this.toDegrees(bearingRad) + 360) % 360);

    // Average walking speed: ~80 meters per minute (4.8 km/h)
    const estimatedWalkingMinutes = Math.max(1, Math.ceil(distanceMeters / 80));

    return {
      distanceMeters,
      bearingDegrees,
      estimatedWalkingMinutes,
    };
  }

  /**
   * Open Apple Maps walking navigation
   */
  public getAppleMapsUrl(lat: number, lng: number): string {
    return `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=w`;
  }

  /**
   * Open Google Maps walking navigation
   */
  public getGoogleMapsUrl(lat: number, lng: number): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
  }

  /**
   * Generate shareable URL with encoded parking coordinates and floor note
   */
  public generateShareUrl(spot: ParkingSpot): string {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
    const params = new URLSearchParams();
    params.set('lat', spot.latitude.toString());
    params.set('lng', spot.longitude.toString());
    if (spot.floorNote) params.set('floor', spot.floorNote);
    params.set('t', spot.timestamp.toString());
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Parse shared spot from window URL parameters if present
   */
  public parseShareUrl(): ParkingSpot | null {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const latStr = params.get('lat');
    const lngStr = params.get('lng');
    
    if (!latStr || !lngStr) return null;

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (isNaN(lat) || isNaN(lng)) return null;

    const floor = params.get('floor') || undefined;
    const t = params.get('t') ? parseInt(params.get('t')!, 10) : Date.now();

    return {
      id: `shared_${Date.now()}`,
      latitude: lat,
      longitude: lng,
      accuracy: 10,
      timestamp: t,
      address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      floorNote: floor,
      isSharedLocation: true,
    };
  }

  private toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  private toDegrees(radians: number): number {
    return (radians * 180) / Math.PI;
  }
}

export const locationService = new LocationService();
