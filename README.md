# NoShow Kalkanı

Yeni, mevcut projelerden bağımsız para kazanma denemesi.

## Hedef

İlk para hedefi: diş kliniği / özel sağlık merkezine 7 günlük `kaçan randevu kurtarma` pilotu satmak.

- Teklif: ₺4.900 kurulum + opsiyonel %5 başarı primi
- ICP: İstanbul'da 5+ koltuklu diş klinikleri, estetik klinikleri, özel sağlık merkezleri
- Teslimat: WhatsApp takip mesajları, manuel/Sheet tabanlı randevu kurtarma akışı, günlük rapor

## Çalıştırma

```bash
npm install
npm run build
npm run smoke
```

## Lead endpoint

`api/leads.js` Vercel serverless function olarak Telegram bildirimine hazırdır.
Gerekli env değişkenleri:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Env yoksa frontend mailto fallback açar.
