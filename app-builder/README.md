# Ege App Builder v1.0

Mobil ve masaüstünde çalışan, bağımlılığı olmayan HTML/CSS/JavaScript web uygulaması oluşturucu.

## Kullanım
`index.html` dosyasını tarayıcıda açın veya bir statik sunucuda yayınlayın.
1. Uygulama adını girin.
2. HTML, CSS ve JavaScript sekmelerinde kodu düzenleyin.
3. **Önizle** ile uygulamayı korumalı iframe içinde çalıştırın.
4. **Kaydet** ile taslağı tarayıcıda saklayın.
5. **HTML indir** ile tek dosyalık web uygulaması indirin.

## Kapsam ve güvenlik
- Bu sürüm **APK/AAB üretmez**. Android paketi için ayrı bir WebView/Gradle derleme hattı gerekir.
- Kod önizlemesi sandbox iframe içinde çalışır; tanımadığınız kodları yapıştırmayın.
- Projeler yalnızca tarayıcı localStorage alanında saklanır; GitHub'a otomatik gönderilmez.
- İndirilen tek HTML dosyasının dış kaynakları varsa çevrimdışı çalışmayabilir.

## Geliştirme
Vanilla JS, derleme bağımlılığı yoktur. Çalıştırmak için modern bir tarayıcı yeterlidir.
