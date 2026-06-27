# scripts/

Bu klasör geliştirme, deploy ve bakım süreçleri için otomasyon scriptlerini barındırır.

## İçerik Planı

| Script | Sprint | Açıklama |
|---|---|---|
| `deploy-contracts.ts` | Sprint 5 | Monad Testnet'e akıllı sözleşme deploy eder |
| `seed-testnet.ts` | Sprint 5 | Testnet'e örnek model NFT'leri mint eder |
| `verify-contracts.ts` | Sprint 5 | Blok gezgini üzerinde sözleşme kaynak kodunu doğrular |
| `generate-types.ts` | Sprint 5 | Contract ABI'larından TypeScript tipleri üretir |
| `health-check.ts` | Sprint 7 | Tüm servislerin çalışır durumda olduğunu kontrol eder |

## Kurallar

- Tüm scriptler `ts-node` veya `tsx` ile çalıştırılır.
- Scriptler bağımsız olarak çalışabilir olmalıdır (servis ayakta olmak zorunda değil).
- Gizli bilgiler (private key, API key) script içine yazılmaz — `.env` dosyasından okunur.
- Her script `--help` flag'ini desteklemelidir.

## Kullanım Örneği (Sprint 5 sonrası)

```bash
pnpm tsx scripts/deploy-contracts.ts --network monad-testnet
pnpm tsx scripts/seed-testnet.ts --count 5
```
