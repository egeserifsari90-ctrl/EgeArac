# Ege Atölye

Tarayıcıdan şablon seçerek tek dosyalık uygulamalar hazırlayan Türkçe editör. Odak sayacı, görev listesi ve puan sayacı şablonlarının her birinin taslağı bu tarayıcıda ayrı saklanır. Tasarım sekmesinde ad, açıklama, renk ve sayaç süresi değiştirilebilir. Kod sekmesinde önizlemeyi oluşturan HTML, CSS ve JavaScript düzenlenebilir. Önizlemeyi yenilemek çalışma durumunu sıfırlar.

## Editör

Canlı stüdyoyu açmak için bu klasördeki proje bağlantısını kullanabilir veya `studyo` klasörünü bir statik sunucuda açabilirsin. Yerel kullanım için bu klasörde `python3 -m http.server 8000 --directory studyo` komutunu çalıştır ve tarayıcından `http://localhost:8000` adresini aç.

## Kendi uygulaman

**Dışa aktar → HTML indir** ile aldığın `index.html` tek başına açılır. **Android projesini indir** ise kendi uygulamanın kodunu ve APK derleme dosyalarını bir ZIP içinde verir.

Bu depoda APK oluşturmak için `uygulama-atolyesi` dalında `uygulama-atolyesi/girdi/index.html` dosyasını kendi çıktınla değiştirip kaydet. GitHub Actions içindeki **Atölye APK** çalıştırmasının **Artifacts** bölümünden `atolye-apk` arşivini indirip içindeki `app-debug.apk` dosyasını çıkar. Bu bir test APK’sıdır. Depoya göndermediğin taslaklar cihazındaki tarayıcıda kalır.

Android projesi gömülü HTML, CSS ve JavaScript'i çevrimdışı çalıştırır. Android 7.0 ve üzerini hedefler. Test derlemeleri geçici imza kullanır. Mağazaya dağıtım ve kalıcı güncelleme imzası ayrıca yapılandırılmalıdır.
