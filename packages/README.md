# packages/

Bu klasör monorepo genelinde paylaşılan dahili TypeScript kütüphanelerini barındırır.

## İçerik Planı

| Paket | Kapsam | Sprint | Açıklama |
|---|---|---|---|
| `ui` | `@marketplace/ui` | Sprint 2 | Paylaşılan React bileşen kütüphanesi (Button, Card, Modal vb.) |
| `types` | `@marketplace/types` | Sprint 2 | Paylaşılan TypeScript tip tanımları (contract ABI tipleri, API DTO'ları) |
| `config` | `@marketplace/config` | Sprint 2 | Paylaşılan ESLint, TypeScript ve Tailwind konfigürasyonları |
| `utils` | `@marketplace/utils` | Sprint 3 | Paylaşılan yardımcı fonksiyonlar (IPFS yardımcıları, adres formatlama) |
| `sdk` | `@marketplace/sdk` | Sprint 5 | Akıllı sözleşme etkileşimi için istemci SDK'sı (ethers.js tabanlı) |

## Kurallar

- Bu paketler hiçbir zaman kullanıcıya dönük uygulama kodu içermez.
- Her paket bağımsız olarak derlenebilir (`tsup` veya `tsc`).
- Paketler arası döngüsel bağımlılık yasaktır.
- Dışarıya açık her sembol TypeScript tipiyle belgelenmiş olmalıdır.
