# 🚗 Find My Car - Parked Location & GPS Tracker: App Store Submission & Localization Guide

> **Project Name:** Find My Car: Parked Location Pin & GPS Parking Tracker  
> **Bundle ID:** `com.findmycar.parkedlocation`  
> **Target Stores:** Apple App Store (iOS/iPadOS/watchOS) & Google Play Console  
> **Framework:** React + Vite + TypeScript + Tailwind CSS + Capacitor  
> **Monetization Model:** Freemium ($2.99 Lifetime Pro Purchase for Timer Alarms, Meter Calculator & Bluetooth Auto-Save)  

---

## 📑 1. App Store Connect Ready Metadata (12 Languages)

### 🇺🇸 English (US) Metadata
- **App Name:** `Find My Car - Parked Location` (28/30 Chars)
- **Subtitle:** `GPS Parking Tracker & Timer` (27/30 Chars)
- **Promotional Text:**
  ```text
  Instantly save your parked car location with 1 tap, record floor notes, track parking meters, set countdown alarms, and direct walk back!
  ```
- **Description:**
  ```text
  Never lose your parked car or hotel in busy parking garages, shopping malls, or unfamiliar cities again! Find My Car is the ultimate minimalist 1-tap GPS parking spot saver and meter tracker.

  KEY FEATURES:
  - 1-Tap Instant Location Pinning: 0-second latency location saving with haptic audio confirmation.
  - Indoor Garage & Underground Low-GPS Protection: Automatic warning banner with quick floor and column note tagging (e.g. Level -2 / Yellow Spot B-12).
  - Column Photo & Ticket Snapshot: Attach column pillar pictures and parking garage barcode tickets for fast exit machine scanning.
  - Voice Memo Recorder: Record 5-second instant audio notes to remember exact parking spots without typing.
  - Live 360° Compass Radar & Walking Navigation: Dynamic gyroscope arrow points directly to your car along with 1-tap Google Maps & Apple Maps walking directions.
  - 15-Minute Parking Meter Early Alarm: Avoid expensive parking tickets with loud countdown alerts and lock screen notifications ($1.99 Pro).
  - Real-Time Parking Fee Calculator: Track spent time and accumulated parking fees in real-time ($1.99 Pro).
  - Bluetooth Disconnect Auto-Save: Automatically detects when you step out of your vehicle and saves position silently ($1.99 Pro).
  - Share Parked Location: Send a 1-tap WhatsApp/SMS link so your spouse or friends can navigate directly to your car.
  - Emergency Parking Flashlight: High-brightness screen light to read column numbers in dark underground lots.
  - Parking History Agenda: Keep track of your past 10 saved parking locations.

  Zero infrastructure cost — 100% device-side privacy and data storage!
  ```
- **Keywords (100 Chars):** `parked,car,finder,tracker,parking,spot,gps,locate,meter,timer,alarm,auto,where,is,my,vehicle`

---

### 🇹🇷 Türkçe Metadata
- **Uygulama Adı:** `Find My Car: Park Konum Bulucu` (30/30 Karakter)
- **Alt Başlık:** `GPS Park Takipçisi & Alarm` (26/30 Karakter)
- **Tanıtım Metni:**
  ```text
  Tek tıkla arabanızın park konumunu kaydedin, kat ve kolon notu ekleyin, park süresi alarmı kurun ve yürüme rotasıyla arabanıza ulaşın!
  ```
- **Açıklama:**
  ```text
  AVM kapalı otoparklarında veya yabancı bir şehirde arabanızı kaybetmeye son! Find My Car, 0 saniye gecikme ile konumu hafızaya alan en gelişmiş minimalist GPS park takipçisidir.

  ÖNE ÇIKAN ÖZELLİKLER:
  - Tek Dokunuşla Anında Konum Kaydı: Dokunduğunuz an GPS koordinatını haptik geri bildirimle saklar.
  - Düşük GPS & Kapalı Otopark Koruması: Kapalı katlarda (-2, -3. kat) otomatik uyarı ve hızlı Kat/Kolon Notu ekleme (Örn: -2. Kat / Sarı B-12).
  - Kolon Fotoğrafı & Otopark Fişi Kaydı: Kolon numarasını ve otopark biletini fotoğraflayıp saklayın.
  - Hızlı Sesli Not Kaydedici: Yazmakla zaman kaybetmeden 5 saniyelik sesli hafıza notu bırakın.
  - Canlı 360° Pusula Radar & Yürüme Navigasyonu: Arabanızın yönünü canlı dönen ok ile gösterir, tek tıkla Google Maps ve Apple Maps yürüme rotasını başlatır.
  - 15 Dk Önce Park Süresi Alarmı: Otopark cezasını önlemek için süre bitmeden 15 dk önce yüksek sesli uyarı verir ($1.99 Pro).
  - Canlı Otopark Ücret Hesaplayıcı: İçeride kaldığınız süreye göre ne kadar ödeyeceğinizi canlı gösterir ($1.99 Pro).
  - Bluetooth Otomatik Kayıt: Arabadan indiğinizi anlar ve konumu sessizce kaydeder ($1.99 Pro).
  - Konum Paylaş (WhatsApp / SMS): Eşinizle veya arkadaşınızla tek tıkla araç konumunu paylaşın, onların da arabayı bulmasını sağlayın.
  - Gece Otopark Fener Modu: Loş otoparklarda kolon numarasını okumak için yüksek parlaklıkta acil durum feneri.
  - Park Geçmişi Ajandası: Son 10 park lokasyonunuzu saklar ve listeler.

  Sıfır sunucu maliyeti — %100 cihaz içi gizlilik ve kalıcılık!
  ```
- **Anahtar Kelimeler:** `araba,park,konum,otopark,bulucu,gps,navigasyon,sayaç,alarm,araç,nerede,fiş,bilet,kat`

---

## 🔒 2. Privacy Policy & App Store Compliance

- **Support URL:** `https://findmycar.app/support`
- **Privacy Policy URL:** `https://findmycar.app/privacy`
- **Age Rating:** 4+ (Contains no mature content, no gambling, no violence)
- **Data Collection:** Zero Data Collected (All GPS points and photos stay on the user's local device in CoreData / LocalStorage).

---

## 🚀 3. CI/CD & Build Steps (Codemagic)

1. Push codebase to GitHub repository.
2. Connect Codemagic with `codemagic.yaml`.
3. Run automated iOS build script:
   ```bash
   npm install
   npm run build
   npx cap sync ios
   ```
4. Upload directly to App Store Connect / TestFlight!
