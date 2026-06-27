# docker/

Bu klasör lokal geliştirme ve production ortamı için Docker konfigürasyonlarını barındırır.

## İçerik Planı

| Dosya / Klasör | Sprint | Açıklama |
|---|---|---|
| `docker-compose.yml` | Sprint 6 | Tüm servisleri tek komutla ayağa kaldırır |
| `docker-compose.dev.yml` | Sprint 6 | Geliştirme ortamı override'ları (hot-reload, volume mount) |
| `docker-compose.prod.yml` | Sprint 6 | Production konfigürasyonu |
| `web/Dockerfile` | Sprint 6 | Next.js frontend image'ı |
| `api/Dockerfile` | Sprint 6 | NestJS API image'ı |
| `ai/Dockerfile` | Sprint 6 | FastAPI AI servis image'ı |

## Kullanım (Sprint 6 sonrası)

```bash
# Tüm servisleri başlat
docker compose up -d

# Logları izle
docker compose logs -f

# Durdur
docker compose down
```

## Not

Bu klasör Sprint 6'ya kadar boş kalır. Servis Dockerfile'ları ilgili servis
klasörlerine (ör. `services/api/Dockerfile`) değil buraya merkezi olarak yerleştirilir.
