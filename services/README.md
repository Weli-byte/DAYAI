# services/

Bu klasör backend mikro servislerini barındırır.

## İçerik Planı

| Servis | Teknoloji | Sprint | Açıklama |
|---|---|---|---|
| `api` | NestJS, TypeScript, Prisma | Sprint 3 | Ana REST/GraphQL API — kimlik doğrulama, model kayıt defteri, ödeme, blockchain event indexer |
| `ai` | Python 3.12, FastAPI, PyTorch | Sprint 4 | AI model inference servisi — IPFS'ten model yükleme, tahmin endpoint'leri, federated learning koordinasyonu |

## Mimari Not

Servisler birbirleriyle doğrudan import yerine HTTP veya mesaj kuyruğu (RabbitMQ/Redis) üzerinden
haberleşir. Bu, her servisin bağımsız olarak ölçeklenmesini ve deploy edilmesini sağlar.

## Kurallar

- Her servis kendi `Dockerfile`'ına sahiptir (`docker/` klasöründe tanımlanır).
- Python servisi TypeScript workspace'ten ayrı yönetilir; pnpm bağımlılığı yoktur.
- NestJS servisi `@marketplace/` scope'lu paketleri kullanabilir.
