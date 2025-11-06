# 📝 Müşteri Yorum Sistemi - Kurulum Kılavuzu

Skywalkers Tours için eksiksiz müşteri yorum sistemi kurulumu.

## ✅ Sistem Özellikleri

### Müşteri Tarafı:
- ⭐ 5 yıldız değerlendirme sistemi
- 📝 Yorum formu (ad, email, ülke, başlık, yorum)
- 🎯 Tur seçimi
- ✅ Onay sonrası yayınlanma
- 💬 Admin yanıtları görüntüleme

### Admin Tarafı:
- 📊 Yorum istatistikleri
- ⏳ Onay bekleyen yorumlar
- ✓ Onayla/Reddet
- ⭐ Öne çıkan yorumlar belirleme
- 💬 Admin yanıtı ekleme
- 🗑️ Yorum silme

### Web Sitesi:
- 🌟 Öne çıkan yorumlar bölümü
- 📱 Mobile responsive
- 🎨 Modern tasarım
- 💬 Quote ikonu ile görsel zenginlik

## 🚀 Kurulum Adımları

### 1. Supabase Tablosunu Oluştur

**Supabase Dashboard > SQL Editor'de çalıştırın:**

```sql
-- SETUP_REVIEWS.sql dosyasındaki SQL kodunu çalıştırın
```

Veya direkt olarak `SETUP_REVIEWS.sql` dosyasını açıp SQL Editor'e yapıştırın.

Bu şunları oluşturur:
- ✅ `reviews` tablosu
- ✅ Gerekli index'ler
- ✅ RLS politikaları (disabled)
- ✅ Permissions
- ✅ `review_stats` view (istatistikler için)

### 2. Sistemi Test Et

#### Adım 1: Dev server'ı çalıştır
```bash
cd oludeniz-crm
npm run dev
```

#### Adım 2: Ana sayfaya git
http://localhost:5173/

Sayfayı aşağı kaydır - **"Müşterilerimiz Ne Diyor?"** bölümünü göreceksin (henüz yorum yoksa görünmez)

#### Adım 3: Yorum formu doldur
En altta **"Deneyiminizi Paylaşın"** formu var:
- ⭐ Yıldız puanı seç (1-5)
- 🎯 Tur seç
- 👤 Adını yaz
- 📧 Email (opsiyonel)
- 🌍 Ülke (opsiyonel)
- 📝 Başlık (opsiyonel)
- 💬 Yorumunu yaz (minimum 20 karakter)
- ✅ **"Yorumu Gönder"** tıkla

#### Adım 4: Admin paneline git
1. http://localhost:5173/admin
2. Şifre: `admin2025`
3. **"Yorumlar"** butonuna tıkla

#### Adım 5: Yorumu onayla
- 📋 "Onay Bekleyen" tab'inde yorumunu göreceksin
- ✅ **"Onayla"** butonuna tıkla
- 💬 İsteğe bağlı: Admin yanıtı ekle (örn: "Teşekkür ederiz! 🙏")
- ✓ **"Onayla ve Yayınla"**

#### Adım 6: Web sitesinde gör
- Ana sayfaya dön: http://localhost:5173/
- Yorumunuz **"Müşterilerimiz Ne Diyor?"** bölümünde görünecek!

### 3. Müşteriye Link Gönder

Rezervasyon tamamlanınca müşteriye şu linki gönder:
```
https://[YOUR_URL]/review/[BOOKING_ID]
```
Müşteri bu linke tıklayarak yorum yapabilir.

### 4. Yorumları Yönet

Admin > Yorumlar sayfasında:
1. Onay bekleyen yorumları gör
2. ✅ **"Onayla"** veya ❌ **"Reddet"**
3. ⭐ **"Öne Çıkar"** (Ana sayfada göster)

## 📍 Sayfalar ve URL'ler

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Ana Sayfa | `/` | Yorumlar ve form burada |
| Admin Dashboard | `/admin` | Ana admin paneli |
| Admin Yorumlar | `/admin/reviews` | Yorum onaylama |
| Admin Turlar | `/admin/tours` | Tur yönetimi |
| Admin Takvim | `/admin/calendar` | Rezervasyon takvimi |
| Yorum Sayfası | `/review/:bookingId` | Müşteri yorum sayfası |

## 🎯 Özellikler Detayı

### Yorum Formu Validasyonu:
- ⭐ Yıldız puanı: Zorunlu (1-5)
- 🎯 Tur: Zorunlu
- 👤 Ad: Zorunlu
- 💬 Yorum: Zorunlu, minimum 20 karakter
- 📧 Email: Opsiyonel
- 🌍 Ülke: Opsiyonel
- 📝 Başlık: Opsiyonel, max 100 karakter

### Admin Özellikleri:
- 📊 **İstatistikler**: Toplam, Bekleyen, Onaylı
- 🔍 **Filtreler**: Tümü / Bekleyen / Onaylı
- ✅ **Onaylama**: Tek tık ile onayla
- ❌ **Reddetme**: Sil
- ⭐ **Öne Çıkarma**: 6'ya kadar öne çıkan
- 💬 **Yanıt**: Müşteriye teşekkür mesajı
- 🗑️ **Silme**: Kalıcı olarak sil

### Web Sitesi Görünümü:
- 🎨 Modern kart tasarımı
- 💬 Quote ikonu
- ⭐ Yıldız değerlendirmesi
- 👤 Müşteri bilgileri (ad, ülke)
- 🎯 Tur adı
- 💬 Admin yanıtı (varsa mavi kutuda)
- 📱 Tam responsive

## 🔄 İş Akışı

```
1. Müşteri web sitesinde yorum formu doldurur
   ↓
2. Yorum Supabase'e kaydedilir (is_approved: false)
   ↓
3. Admin panelde "Onay Bekleyen" olarak görünür
   ↓
4. Admin yorumu okur:
   - İstenirse admin yanıtı ekler
   - Onayla veya Reddet
   ↓
5. Onaylanırsa (is_approved: true):
   - Web sitesinde yayınlanır
   - "Müşterilerimiz Ne Diyor?" bölümünde görünür
   ↓
6. Admin isterse "Öne Çıkar" işaretler (is_featured: true):
   - En üstte ve öncelikle gösterilir
```

## 📦 Oluşturulan Dosyalar

### Components:
- ✅ `src/components/StarRating.tsx` - Yıldız rating component
- ✅ `src/components/ReviewForm.tsx` - Yorum formu
- ✅ `src/components/ReviewsSection.tsx` - Ana sayfa yorumlar

### Pages:
- ✅ `src/pages/AdminReviews.tsx` - Admin yorum yönetimi

### Hooks:
- ✅ `src/hooks/useReviews.ts` - Review CRUD işlemleri

### Types:
- ✅ `src/types/index.ts` - Review ve ReviewStats interface'leri

### SQL:
- ✅ `SETUP_REVIEWS.sql` - Database kurulum scripti

## 🎨 Renk Kodları

- **Bekleyen**: 🟡 Yellow (border-yellow-500)
- **Onaylı**: 🟢 Green (bg-green-100)
- **Öne Çıkan**: 🟣 Purple (border-purple-500)
- **5 Yıldız**: ⭐ Yellow (fill-yellow-400)

## 💡 İpuçları

### Test İçin Hızlı Yorumlar Ekle:
```sql
INSERT INTO reviews (customer_name, tour_name, rating, comment, is_approved, customer_country, title)
VALUES 
  ('John Doe', 'Tandem Paragliding', 5, 'Amazing experience! The views were breathtaking and the instructor was very professional. Highly recommend!', true, 'USA', 'Best Experience Ever!'),
  ('Maria Garcia', 'ATV Safari', 5, 'So much fun! We explored beautiful landscapes and had an amazing adventure. Thank you Skywalkers!', true, 'Spain', 'Unforgettable Adventure'),
  ('Hans Mueller', 'Jeep Safari', 4, 'Great tour with stunning views. The guide was knowledgeable and friendly. Would do it again!', true, 'Germany', 'Great Tour'),
  ('Emma Wilson', 'Scuba Diving', 5, 'Crystal clear waters and amazing marine life. Professional staff and great equipment. Perfect!', true, 'UK', 'Crystal Clear!'),
  ('Ali Yılmaz', 'Horse Safari', 5, 'Harika bir deneyimdi! Atlar çok sakin ve rehber çok ilgiliydi. Kesinlikle tavsiye ederim!', true, 'Turkey', 'Muhteşem deneyim'),
  ('Sophie Martin', 'Ölüdeniz Boat Tour', 5, 'Beautiful blue lagoon and delicious lunch. The crew was amazing. Best day of our holiday!', true, 'France', 'Perfect Day!');
```

### Öne Çıkan Yapma:
```sql
UPDATE reviews SET is_featured = true WHERE rating = 5 LIMIT 6;
```

### İstatistikleri Görüntüle:
```sql
SELECT * FROM review_stats;
```

## ❓ Sorun Giderme

### Yorumlar görünmüyor:
1. ✅ Supabase'de reviews tablosu var mı kontrol et
2. ✅ En az 1 yorum is_approved = true olmalı
3. ✅ Browser console'da hata var mı bak (F12)
4. ✅ Supabase bağlantısı çalışıyor mu test et

### Yorum gönderemiyorum:
1. ✅ Tüm zorunlu alanları doldurdun mu?
2. ✅ Yıldız puanı seçtin mi?
3. ✅ Yorum minimum 20 karakter mi?
4. ✅ Tur seçtin mi?

### Admin panelde göremiyorum:
1. ✅ Admin şifresi: `admin2025`
2. ✅ `/admin/reviews` URL'sine git
3. ✅ "Onay Bekleyen" tab'ine bak

## 🎉 Başarılı Kurulum!

Artık tam fonksiyonel bir müşteri yorum sisteminiz var:
- ✅ Müşteriler yorum yapabilir
- ✅ Admin onaylayabilir/reddedebilir
- ✅ Yorumlar web sitesinde görüntülenir
- ✅ Öne çıkan yorumlar sistemi
- ✅ 5 yıldız değerlendirme
- ✅ Admin yanıtları

**Sorularınız için:**
- 📧 support@skywalkers-tours.com
- 💬 WhatsApp: +90 536 461 6674
