import { useEffect } from 'react';
import { HeaderNavbar } from './components/molecules/HeaderNavbar';
import { LockScreenWidgetPreview } from './components/molecules/LockScreenWidgetPreview';
import { MainParkingActionArea } from './components/organisms/MainParkingActionArea';
import { ParkingNoteForm } from './components/molecules/ParkingNoteForm';
import { CompassOverlay } from './components/molecules/CompassOverlay';
import { InteractiveMapRadar } from './components/organisms/InteractiveMapRadar';
import { ParkingTimerCard } from './components/molecules/ParkingTimerCard';
import { BluetoothSimulatorCard } from './components/molecules/BluetoothSimulatorCard';
import { CameraModal } from './components/molecules/CameraModal';
import { FlashlightModal } from './components/molecules/FlashlightModal';
import { ParkingHistoryDrawer } from './components/organisms/ParkingHistoryDrawer';
import { ProPaywallModal } from './components/organisms/ProPaywallModal';
import { AppStoreProfileModal } from './components/organisms/AppStoreProfileModal';
import { FirstLaunchLanguageModal } from './components/organisms/FirstLaunchLanguageModal';
import { useParkingStore } from './store/parkingStore';
import { ShieldCheck, HardDrive } from 'lucide-react';

export function App() {
  const { currentSpot, language } = useParkingStore();

  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans pb-12 selection:bg-slate-900 selection:text-white">
      {/* Top Bar Header */}
      <HeaderNavbar />

      {/* Main Container Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-4 space-y-4">
        {/* iOS Lockscreen / Dynamic Island Simulator */}
        <LockScreenWidgetPreview />

        {/* Screen 1 / Screen 2 Dominant Action Button */}
        <MainParkingActionArea />

        {/* Map, Floor Note & Live Compass Section when Location Saved */}
        {currentSpot && (
          <>
            <ParkingNoteForm />
            <CompassOverlay />
            <InteractiveMapRadar />
          </>
        )}

        {/* $2.99 Pro Feature Modules */}
        <ParkingTimerCard />
        <BluetoothSimulatorCard />
      </main>

      {/* Modals & Drawers */}
      <FirstLaunchLanguageModal />
      <CameraModal />
      <FlashlightModal />
      <ParkingHistoryDrawer />
      <ProPaywallModal />
      <AppStoreProfileModal />

      {/* Footer Zero Infrastructure Banner */}
      <footer className="max-w-md w-full mx-auto px-4 pt-6 text-center text-xs font-semibold text-slate-400 space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-slate-500">
          <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero Server Cost — %100 Cihaz İçi CoreData / LocalStorage Kalıcılık</span>
        </div>
        <p className="flex items-center justify-center gap-1 text-[11px]">
          <ShieldCheck className="w-3 h-3 text-sky-500" />
          <span>Kinetic Lithography Architecture & Strict TypeScript</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
