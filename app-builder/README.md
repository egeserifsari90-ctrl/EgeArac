# Ege App Builder v2

Bu **uygulama yapma aracıdır**; tek bir hazır uygulama değildir. Tarayıcıda HTML, CSS ve JavaScript tabanlı çeşitli uygulamalar üretir.

## Özellikler
- Başlangıç, not defteri ve sayaç şablonları
- Kod düzenleme ve sandbox iframe önizlemesi
- Tek HTML dosyası indirme
- JSON proje dışa/içe aktarma
- Tarayıcıda yerel taslak kaydı
- Telefon ve tablet uyumlu arayüz

## Kullanım
`app-builder/index.html` dosyasını açın; şablon seçin veya kod yazın; Önizle ve HTML indir düğmelerini kullanın.

## Sınırlar
Bu sürüm tarayıcıda web uygulaması üretir, **doğrudan APK/AAB oluşturmaz**. GitHub'da otomatik depo oluşturmaz veya projeyi GitHub'a yüklemez; bunun için sunucu tarafı OAuth/GitHub App entegrasyonu gerekir. Token'ı tarayıcı koduna gömmeyin. Korumalı iframe güvenlik sınırıdır; yalnızca güvenilir kodları çalıştırın. Şablonların localStorage kullanımı önizleme sandbox koşullarına göre değişebilir.
