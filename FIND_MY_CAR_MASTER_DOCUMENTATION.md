# 🚗 Find My Car — Master Technical & App Store Documentation

> **Application Name:** Find My Car: Parked Location Pin & GPS Parking Tracker  
> **Bundle Identifier:** `com.findmycar.parkedlocation`  
> **Repository:** [https://github.com/mustafrontend/findmycar.git](https://github.com/mustafrontend/findmycar.git)  
> **Technology Stack:** React 19 + TypeScript (Strict) + Tailwind CSS v4 + Zustand + Leaflet + Capacitor 7 (Swift Package Manager)  
> **Architecture & Philosophy:** "Light Mode First" & "Kinetic Lithography Architecture"  
> **Infrastructure Cost:** $0 / Month (100% Device-Side LocalStorage & CoreData Persistence)  
> **Monetization Price:** $2.99 Lifetime Pro Unlock  

---

## 📸 Generated 3D App Icon Logo

![Find My Car Logo](/app_logo.jpg)

---

## 📌 1. Ürün Vizyonu ve Kullanıcı Akışı (Screen 1 & Screen 2)

Uygulamanın temel felsefesi **0 saniye gecikme** ile araç konumunu hafızaya almaktır. Kullanıcı AVM otoparkında veya yoğun caddede acelesi varken karmaşık menülerle vakit kaybetmez.

### 🔴 Ekran 1: Konum Henüz Kaydedilmediğinde
- **Baskın Kırmızı Buton:** `BURAYA PARK ETTİM`
- **Tetiklendiğinde:**
  1. Haptik titreşim ve özel kayıt ses efekti çalar.
  2. Cihazın GPS koordinatlarını alıp `findmycar_current_spot` olarak kaydeder.
  3. Yerleşimi anında Ekran 2'ye dönüştürür.

### 🟢 Ekran 2: Konum Kaydedildiğinde
- **Baskın Yeşil Buton:** `ARABAMA GÖTÜR`
- **Tetiklendiğinde:**
  1. Haritayı canlı modda açar ve 360° dönen Jiroskop Pusula Radarı (`CompassOverlay`) aktif eder.
  2. Tek tıkla **Google Maps** veya **Apple Maps** yürüme navigasyonunu başlatır.
- **Alt Araçlar:**
  - **Kat / Kolon Notu:** Örn: `-2. Kat / Sarı B-12`.
  - **Kolon Fotoğrafı:** Kameradan kolon numarasını çekip bağlama.
  - **🎙️ Hızlı Sesli Not (Voice Memo):** Tek tıkla 5 saniyelik ses kaydetme ve dinleme.
  - **🧾 Otopark Fişi & Bilet Barkodu:** Giriş biletini fotoğraflama ve çıkış otomatiğine okutma.

---

## 🛠️ 2. Ekstra Yüksek Değerli Süper Uygulama Özellikleri

1. **🧭 Canlı 360° Pusula Radar (`CompassOverlay.tsx`):**
   - Telefondaki jiroskop sensörü ile aracın açı derecesini hesaplar, etrafta döndükçe arabanın yönünü gösteren canlı ok çizer.
2. **🔦 Gece Otopark Fener Modu (`FlashlightModal.tsx`):**
   - Zifiri karanlık kapalı otoparklarda kolon numaralarını okumak için yüksek parlaklıkta acil durum ekran feneri.
3. **📜 Geçmiş Park Konumları Ajandası (`ParkingHistoryDrawer.tsx`):**
   - Sahte/mock veri barındırmaz. %100 kullanıcının kaydettiği son 10 park lokasyonunu saklar.
   - Tek tıkla *"Haritada Aç"*, tekli silme ve tüm geçmişi temizleme işlevleri sunar.
4. **📲 1-Tıkla Park Konumu Paylaşımı (`locationService.ts`):**
   - Park konumunu URL parametrelerine kodlar (`?lat=...&lng=...&floor=...`).
   - WhatsApp veya SMS ile gönderilen bağlantıya arkadaşı tıkladığında *"🔗 Paylaşılan Park Konumu Yüklendi!"* uyarısı ile haritada açılır.

---

## 💎 3. $2.99 Pro Monetizasyon Modülü

- **Park Süresi Sayacı & Alarm (`ParkingTimerCard.tsx`):**
  - Otopark süresi bitmeden 15 dakika önce yüksek sesli alarm beepi ve bildirim gönderir.
- **Canlı Otopark Ücret Hesaplayıcı:**
  - İçeride kalınan dakikaya göre anlık biriken otopark ücretini hesaplar.
- **Bluetooth Otomatik Kayıt Simülatörü (`BluetoothSimulatorCard.tsx`):**
  - Aracın Bluetooth bağlantısı kesildiği an konumu arka planda sessizce saklar.
- **iOS Kilit Ekranı & Dynamic Island Simülatörü (`LockScreenWidgetPreview.tsx`):**
  - Kilit ekranında ve Dinamik Ada'da canlı aktivite gösterimi.

---

## 🌍 4. 12 Küresel Dil & İlk Giriş Onboarding Motoru

### Desteklenen 12 Dil:
1. 🇹🇷 **Türkçe (`tr`)**
2. 🇺🇸 **English (`en`)**
3. 🇩🇪 **Deutsch (`de`)**
4. 🇪🇸 **Español (`es`)**
5. 🇫🇷 **Français (`fr`)**
6. 🇮🇹 **Italiano (`it`)**
7. 🇵🇹 **Português (`pt`)**
8. 🇷🇺 **Русский (`ru`)**
9. 🇯🇵 **日本語 (`ja`)**
10. 🇰🇷 **한국어 (`ko`)**
11. 🇨🇳 **中文 (`zh`)**
12. 🇸🇦 **العربية (`ar`) — Dinamik Sağdan Sola (RTL) Düzeni**

### İlk Giriş Onboarding Modalı (`FirstLaunchLanguageModal.tsx`):
- Uygulama ilk kez açıldığında kullanıcıya şık bir dil seçim kartı sunar. Seçim yapıldığı an tercihi kaydedip ana ekrana yönlendirir.

---

## 📱 5. iOS Native Safe Area & Swift Package Manager (SPM) Yapısı

- **Status Bar Çakışma Düzeltmesi:**
  - iPhone çentik (notch) ve Dinamik Ada çakışmalarını önlemek için `paddingTop: calc(env(safe-area-inset-top, 0px) + 0.75rem)` entegre edildi.
- **Swift Package Manager (`CapApp-SPM`):**
  - CocoaPods bağımlılığı tamamen kaldırılıp TarotEdu projesindeki gibi native SPM paket mimarisi kuruldu.
  - Codemagic sunucularında CocoaPods hatası almadan sorunsuz `.ipa` üretir.

---

## 🏎️ 6. Codemagic CI/CD & App Store Connect Pipeline

### `codemagic.yaml` Dosya Yapısı:
```yaml
workflows:
  ios-release:
    name: Find My Car iOS App Store Release
    max_build_duration: 60
    instance_type: mac_mini_m2
    integrations:
      app_store_connect: reelcraft
    environment:
      groups:
        - appstore_credentials
      node: latest
      xcode: latest
    scripts:
      - name: Install Node.js dependencies
        script: |
          npm install --legacy-peer-deps
      - name: Build Web Assets & Capacitor Sync
        script: |
          npm run build
          npx cap sync ios
      - name: Set up code signing
        script: |
          keychain initialize
          app-store-connect fetch-signing-files "com.findmycar.parkedlocation" \
            --type IOS_APP_STORE \
            --certificate-key @env:CERTIFICATE_PRIVATE_KEY \
            --create
          keychain add-certificates
          xcode-project use-profiles
      - name: Set build number
        script: |
          cd ios/App
          agvtool new-version -all $PROJECT_BUILD_NUMBER
      - name: Build iOS Xcode App
        script: |
          xcode-project build-ipa \
            --project "ios/App/App.xcodeproj" \
            --scheme "App"
    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
```

---

## 🍏 7. App Store Developer Profile Modal (`AppStoreProfileModal.tsx`)

Üst barda yer alan **Apple (``)** butonuna tıklandığında açılan profil penceresi:
- **Bundle ID:** `com.findmycar.parkedlocation`
- **Yaş Sınırı:** 4+ (Her Yaş İçin Uygun)
- **Kategori:** Navigasyon & Araçlar
- **Gizlilik Politikası:** `https://findmycar.app/privacy`
- **Destek URL:** `https://findmycar.app/support`
- **Gönderim Kontrol Listesi:** 6/6 Maddelik Yayın Hazırlığı

---

## 🌐 8. GitHub Reposu & Sürüm Bilgileri

- **GitHub Linki:** [https://github.com/mustafrontend/findmycar.git](https://github.com/mustafrontend/findmycar.git)
- **Son Commit:** `Generate 3D emerald app icon logo and update iOS AppIcon, splash, favicons and header logo`
- **Build Durumu:** Production derlemesi 688ms'de **0 hata** ile tamamlandı.
