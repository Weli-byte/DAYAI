# Güvenlik Politikası

## Kapsam

| Bileşen | Kritiklik |
|---|---|
| Smart Contracts (`contracts/`) | Kritik — kullanıcı fonlarını etkiler |
| Backend API (`services/api`) | Yüksek |
| AI Servisi (`services/ai`) | Orta |
| Frontend (`apps/web`) | Orta |

## Bildirme

**Güvenlik açıkları için genel GitHub issue açmayın.**

E-posta: `security@decentralized-ai-marketplace.dev`

Lütfen şunları ekleyin:
- Etkilenen bileşen ve versiyon
- Açıklama ve potansiyel etki
- Yeniden üretme adımları
- Varsa proof-of-concept

## Yanıt Süreci

| Adım | Süre |
|---|---|
| Alındı onayı | 48 saat |
| İlk değerlendirme | 7 gün |
| Düzeltme & deploy | Ciddiyete göre |
| Kamuya açıklama | Düzeltmeden 90 gün sonra |

## Geliştirici Güvenlik Kuralları

- Private key, seed phrase veya API anahtarı asla commit edilmez.
- Smart contract'larda OpenZeppelin kütüphaneleri dışında kriptografi yazılmaz.
- Fon işleyen her fonksiyon `ReentrancyGuard` kullanır.
- `tx.origin` yetkilendirme için kullanılmaz.
