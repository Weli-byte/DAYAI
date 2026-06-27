# apps/

Bu klasör kullanıcıya doğrudan dönük uygulamaları barındırır.

## İçerik Planı

| Uygulama | Teknoloji | Sprint | Açıklama |
|---|---|---|---|
| `web` | Next.js 15, React 19 | Sprint 2 | Ana marketplace arayüzü — model listeleme, NFT satın alma, cüzdan bağlantısı, DAO oylaması |
| `docs-site` | Next.js + Fumadocs | İleride | Geliştirici dokümantasyon sitesi |

## Kurallar

- Her uygulama kendi `package.json` dosyasına sahiptir.
- `@marketplace/` scope'u ile diğer workspace paketlerini import edebilir.
- Uygulama seviyesi bağımlılıklar root'a değil buraya eklenir.
- Her uygulamanın kendi `README.md` dosyası bulunur.
