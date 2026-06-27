# Katkı Rehberi

## Gereksinimler

| Araç | Minimum |
|---|---|
| Node.js | 20.x |
| pnpm | 9.x |
| Git | 2.40+ |

## Kurulum

```bash
git clone https://github.com/your-org/decentralized-ai-marketplace.git
cd decentralized-ai-marketplace
pnpm install
pnpm prepare   # Husky hook'larını etkinleştirir
```

## Dal Stratejisi

| Dal Adı | Kullanım |
|---|---|
| `main` | Korumalı — her zaman production-ready |
| `feat/<kısa-açıklama>` | Yeni özellik |
| `fix/<kısa-açıklama>` | Hata düzeltme |
| `chore/<kısa-açıklama>` | Araç, bağımlılık, konfigürasyon |
| `docs/<kısa-açıklama>` | Sadece dokümantasyon |
| `contract/<kısa-açıklama>` | Solidity sözleşme değişikliği |

## Commit Formatı

Tüm commit'ler [Conventional Commits](https://www.conventionalcommits.org/) formatına uymalıdır.

```
<type>(<scope>): <kısa açıklama>
```

**Tip örnekleri:** `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`

```bash
feat(contracts): add DataContribution deposit mechanism
fix(api): handle IPFS timeout in model upload
docs: update Monad testnet RPC configuration
```

## PR Süreci

1. `main`'den dal aç.
2. Değişiklikleri küçük ve odaklı tut.
3. `pnpm lint && pnpm typecheck && pnpm test` geçmeli.
4. PR şablonunu eksiksiz doldur.
5. En az bir reviewer onayı gerekir.
6. **Squash and Merge** ile birleştir.

## Akıllı Sözleşme PR'ları

- İki Solidity reviewer gerekir.
- NatSpec dokümantasyonu zorunlu.
- Test coverage ≥ %95.
- Fon işleyen fonksiyonlarda `ReentrancyGuard` kullanılır.

## Güvenlik

Güvenlik açıkları için genel issue açmak yerine [SECURITY.md](SECURITY.md) dosyasındaki
süreci izleyin.
