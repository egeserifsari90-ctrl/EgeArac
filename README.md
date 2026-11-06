# EgeAraçAPK

Android için yerel APK imzalama aracı kaynak projesi.

## Özellikler
- Android dosya seçicisinden `.apk` seçer.
- Cihazın Android Keystore alanında RSA imzalama anahtarı oluşturur.
- APK'yı v1, v2 ve v3 imzalarıyla imzalar.
- İmzalı kopyayı kullanıcının seçtiği konuma kaydeder.
- Orijinal APK dosyasına dokunmaz; dosyayı veya anahtarı sunucuya yüklemez.

## Önemli
- Bu uygulama kaynak kodundan APK derlemez; var olan APK'yı imzalar.
- İmza, bu uygulamanın oluşturduğu yeni anahtarla atılır. Bu imza Google Play'in resmî imzasıyla aynı değildir.
- Başka bir anahtarla imzalanmış mevcut uygulamanın üzerine güncelleme olarak kurulamaz. Android imza uyuşmazlığını reddeder. Orijinal uygulamayı kaldırmak gerekebilir; bu işlem uygulama verilerini silebilir.
- Gelecekte aynı anahtarla güncelleme imzalamak için aynı cihazdaki anahtarı koruyun. Uygulamayı veya cihazı sıfırlamak anahtarın kaybına yol açabilir.
- Yalnızca sahibi olduğunuz veya değiştirme yetkiniz bulunan APK'ları imzalayın. İmzalama, APK'nın güvenli olduğunu kanıtlamaz.

## GitHub üzerinden APK derleme
1. Bu klasörün içeriğini kendi GitHub deponuza yükleyin.
2. GitHub'da **Actions** sekmesini açın.
3. **Build Android APK** iş akışını seçin ve **Run workflow** düğmesine basın.
4. İşlem tamamlanınca çalıştırma sayfasındaki `EgeAracAPK-debug` artifact'ini indirin.

İş akışı Android debug APK üretir. Debug APK test amaçlıdır; Play Store yayını için uygun imzalı release paketi değildir.

## Yerel derleme
JDK 17, Android SDK Platform 35, Build Tools 35.0.0 ve Gradle 8.9 gerekir.

```bash
gradle assembleDebug
```

Çıktı:
`app/build/outputs/apk/debug/app-debug.apk`
