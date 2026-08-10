# 🚀 Find My Car - Codemagic CI/CD & TestFlight / App Store Release Guide

> **Project:** Find My Car (`com.findmycar.parkedlocation`)  
> **Framework:** React + Vite + TypeScript + Capacitor (iOS Native)  
> **Target Store:** Apple App Store Connect & TestFlight  

---

## 🛠️ 1. GitHub & Codemagic Bağlantı Adımları

1. Bu projeyi (`app3`) GitHub hesabı üzerine yeni bir repository olarak push edin:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Find My Car complete App Store release"
   git remote add origin https://github.com/USERNAME/find-my-car.git
   git push -u origin main
   ```
2. [Codemagic.io](https://codemagic.io) adresine giriş yapın.
3. **"Add application"** butonuna basıp GitHub repository'nizi seçin.
4. Codemagic projedeki `codemagic.yaml` dosyasını otomatik olarak algılayacaktır.

---

## 🔑 2. Codemagic Ortam Değişkenleri (App Store Credentials)

Codemagic panelinde **Environment variables** bölümüne girip `appstore_credentials` adlı bir grup oluşturun ve şu değişkenleri ekleyin:

- `CERTIFICATE_PRIVATE_KEY`: Apple Developer hesabınızdan aldığınız `.p12` sertifikasının private key metni.
- `APP_STORE_CONNECT_ISSUER_ID`: App Store Connect > Users and Access > Keys kısmındaki Issuer ID.
- `APP_STORE_CONNECT_KEY_IDENTIFIER`: Key ID (örn: `2X985A...`).
- `APP_STORE_CONNECT_PRIVATE_KEY`: `.p8` API Key dosyasının içeriği.

---

## 🏎️ 3. Otomatik Derleme ve TestFlight Gönderimi

1. Codemagic panelinden **"Start new build"** butonuna basın.
2. `ios-release` workflow'unu seçin.
3. **Mac Mini M2** sunucularında derleme otomatik başlayacaktır:
   - Node.js bağımlılıkları kurulur (`npm install`).
   - Web çıktıları derlenir (`npm run build`).
   - Native iOS projesi senkronize edilir (`npx cap sync ios`).
   - Apple Sertifikaları otomatik imzalanır.
   - `.ipa` dosyası üretilir ve doğrudan **App Store Connect / TestFlight**'a otomatik yüklenir!

---

## 📱 4. TestFlight & App Store Gönderimi

- Derleme bittiğinde TestFlight'a otomatik olarak yüklenen sürüm test kullanıcılarınıza bildirim gönderir.
- App Store Connect paneline girip **"Submit for Review"** butonuna basarak uygulamayı yayınlayabilirsiniz!
