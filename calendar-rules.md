# Blazwind Calendar Component Rules

## Genel Bakış
Blazwind.Components.Calendar projesi, Blazor, Tailwind CSS ve TypeScript kullanılarak geliştirilen, tam mobil uyumlu ve modern bir takvim bileşenidir.

## Teknoloji Yığını
- **Framework:** Blazor (Server/WASM uyumlu)
- **Stil:** Tailwind CSS
- **Build Tool:** Vite
- **Dil:** C# (Blazor), TypeScript (Frontend mantığı)

## Temel Özellikler

### 1. Görünüm ve Tasarım
- **Mobil Uyumluluk:** Tam mobil uyumlu (Responsive) tasarım.
- **Tema:** Gece (Dark) ve Gündüz (Light) modu desteği.
- **Görünümler:**
  - Ajanda (Agenda)
  - Günlük (Daily)
  - Haftalık (Weekly)
  - Aylık (Monthly)
- **Zaman Çizgisi:** Gün ve Hafta görünümlerinde aktif saati gösteren çizgi (Current Time Indicator).
- **Tasarım İlkeleri:** Blazwind genel tasarım ilkelerine tam uyum.

### 2. Yapılandırma ve Parametreler
- **Slot Aralığı:** Takvim slotlarının kaç dakika aralıklarla olacağı parametrik olarak ayarlanabilir (örn. 15dk, 30dk, 60dk).
- **Çoklu Takvim:** Birden fazla takvim oluşturma ve yönetme desteği.
- **Filtreleme:**
  - Belirtilen gündeki boş saatlerin filtrelenebilmesi.
  - Belirtilen haftadaki boş saatlerin filtrelenebilmesi.

### 3. Etkinlik (Event) Yönetimi
- **Veri Modeli:** Genişletilebilir, Türkçe isimlendirilmiş alanlara sahip etkinlik modeli.
- **Etkileşim:**
  - Etkinlikler yeniden boyutlandırılabilir (Resizable).
  - Etkinlikler taşınabilir (Draggable).

### 4. Mimari ve Entegrasyon
- **Soyutlama:** Veritabanı işlemleri ve detay dialogları gibi uygulama spesifik işlemler bileşen içine gömülmemelidir.
- **Servisler:** Takvim yönetimi için gerekli servis arayüzleri (Interfaces) ve soyut metodlar tanımlanmalıdır.
- **Genişletilebilirlik:** Uygulama içerisinde kullanılırken implemente edilecek şekilde tasarlanmalıdır.
- **Scheduler Özellikleri:** Bir Scheduler sisteminde beklenen tüm temel özellikler sağlanmalıdır.

## Dosya Yapısı ve Build
- **Frontend:** `frontend` klasörü altında Vite ve Tailwind yapılandırması.
- **Çıktı Dosyaları:**
  - JS: `wwwroot/blazwind.calendar.js`
  - CSS: `wwwroot/blazwind.calendar.css`
- **İkon Seti:** Proje genel ikon seti kullanılacaktır (harici set eklenmeyecek).

## Geliştirme Kuralları
1. Bileşen mantığı C# tarafında tutulmalı, sadece gerekli DOM manipülasyonları ve interaktivite için TypeScript kullanılmalıdır.
2. Tailwind sınıfları kullanılarak stil verilmeli, hardcoded CSS'den kaçınılmalıdır.
3. Kod okunabilirliği ve Türkçe isimlendirme kurallarına dikkat edilmelidir.
