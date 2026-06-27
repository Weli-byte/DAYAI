# Decentralized AI Model Marketplace

Monad blockchain üzerinde topluluk tarafından yönetilen, merkeziyetsiz bir yapay zeka modeli
pazaryeri. AI modelleri NFT olarak tokenize edilir, katkılar zincir üstünde ödüllendirilir,
büyük dosyalar IPFS'te saklanır.

---

## Proje Vizyonu

Mevcut AI model pazarları (Hugging Face, OpenAI API, Replicate) merkezi kuruluşlar tarafından
kontrol edilir. Bu proje aşağıdaki soruları pratik bir ürünle yanıtlar:

- **Model sahipliği** tek bir şirkette mi yoksa toplulukta mı olmalı?
- **Veri katkısı** nasıl şeffaf ve ölçülebilir şekilde ödüllendirilebilir?
- **Model güncellemeleri** geriye dönük izlenebilir ve denetlenebilir olabilir mi?

**Çözüm:** Monad blockchain üzerinde ERC-721 NFT tabanlı model sahipliği + IPFS depolama +
on-chain teşvik mekanizması + DAO yönetişimi.

### Araştırma Temeli

| Kaynak | Katkı |
|---|---|
| Microsoft SUM | On-chain depozito/ödül mekanizması (veri katkısı) |
| Pluralis Research | Kolektif model eğitimi, ağırlıkların tek elde toplanmaması |
| OpenAI / Paradigm EVMbench | Akıllı sözleşme güvenliği + AI entegrasyonu |
| Cambridge / Insilico | Blockchain tabanlı veri pazarı modeli |
| MIT Federated Learning | Heterojen cihazlarda dağıtık öğrenme |

---

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript |
| Backend API | NestJS, TypeScript, Prisma |
| AI Servisi | Python 3.12, FastAPI, PyTorch |
| Smart Contract | Solidity ^0.8.24, Hardhat, OpenZeppelin |
| Blockchain | Monad (EVM-uyumlu Layer-1, ~10 000 TPS) |
| Depolama | IPFS / Pinata |
| Monorepo | TurboRepo + pnpm workspaces |
| Package Manager | pnpm 9+ |
| Dil | TypeScript 5+ |
| Kod Kalitesi | ESLint 9, Prettier 3, Husky, Commitlint |
| CI/CD | GitHub Actions |

---

## Monorepo Yapısı

```
decentralized-ai-marketplace/
│
├── apps/               → Kullanıcıya dönük uygulamalar (Next.js frontend)
├── services/           → Backend mikro servisler (NestJS API, FastAPI)
├── packages/           → Paylaşılan iç kütüphaneler (tipler, UI, config)
├── contracts/          → Solidity akıllı sözleşmeler (Hardhat projesi)
│
├── infra/              → Altyapı tanımları (Terraform / Pulumi — ileride)
├── docker/             → Docker Compose ve servis Dockerfile'ları
├── docs/               → Mimari kararlar (ADR), API referansları, rehberler
├── scripts/            → Deploy, migration ve yardımcı otomasyon scriptleri
│
├── .github/            → GitHub şablonları ve community health dosyaları
├── .vscode/            → VS Code workspace ayarları ve önerilen uzantılar
├── .husky/             → Git hook'ları (pre-commit, commit-msg)
│
├── package.json        → Workspace root — sadece ortak devDependencies
├── pnpm-workspace.yaml → pnpm workspace tanımı
├── turbo.json          → TurboRepo pipeline konfigürasyonu
├── eslint.config.js    → Monorepo geneli ESLint flat config
├── .prettierrc         → Prettier format kuralları
├── .editorconfig       → Editörler arası stil tutarlılığı
└── .gitignore          → Kapsamlı ignore kuralları
```

---

## Geliştirme Prensipleri

### Commit Standardı
Tüm commit mesajları [Conventional Commits](https://www.conventionalcommits.org/) formatına uyar.
Commitlint + Husky bunu otomatik olarak zorunlu kılar.

```
feat(contracts): add DataContribution deposit mechanism
fix(api): handle IPFS timeout in model upload
docs: update Monad testnet RPC instructions
```

### Tip Güvenliği
- TypeScript strict mode her pakette aktif.
- `any` türü yasak — `unknown` + type guard kullanılır.
- `pnpm typecheck` CI'da zorunlu geçiş koşuludur.

### Kod Kalitesi
- ESLint v9 flat config tüm TS/JS dosyalarını kapsar.
- Prettier format kontrolü CI'da çalışır.
- Husky pre-commit hook'u yalnızca staged dosyaları lint-staged ile işler.

### Paket Yönetimi
- Sadece **pnpm** kullanılır. `npm install` veya `yarn` kesinlikle çalıştırılmaz.
- Root `package.json` yalnızca workspace araçlarını barındırır; uygulama bağımlılıkları
  ilgili alt paketlere aittir.

---

## Geliştirme Scriptleri

Tüm scriptler repository root'undan çalıştırılır ve TurboRepo tarafından orkestre edilir.

| Script | Açıklama |
|---|---|
| `pnpm dev` | Tüm servisleri geliştirme modunda başlatır (hot-reload) |
| `pnpm build` | Tüm paket ve uygulamaları production için derler |
| `pnpm lint` | Monorepo genelinde ESLint çalıştırır |
| `pnpm lint:fix` | ESLint hatalarını otomatik düzeltir |
| `pnpm format` | Prettier ile tüm dosyaları formatlar |
| `pnpm format:check` | Format kontrolü yapar, dosyaları değiştirmez (CI) |
| `pnpm typecheck` | TypeScript tip kontrolü yapar |
| `pnpm test` | Tüm test paketlerini çalıştırır |
| `pnpm clean` | Build çıktılarını, cache'leri ve node_modules'ü siler |

---

## Kurulum

> **Gereksinimler:** Node.js ≥ 20, pnpm ≥ 9

```bash
# 1. Klonla
git clone https://github.com/your-org/decentralized-ai-marketplace.git
cd decentralized-ai-marketplace

# 2. Bağımlılıkları yükle
pnpm install

# 3. Git hook'larını kur
pnpm prepare

# 4. Ortam değişkenlerini ayarla
cp .env.example .env
```

---

## Gelecek Sprintlerde Eklenecek Bileşenler

| Sprint | Bileşen | Durum |
|---|---|---|
| Sprint 1 | Repository & Monorepo Foundation | ✅ Tamamlandı |
| Sprint 2 | Next.js Frontend Scaffold | 🔜 Planlandı |
| Sprint 3 | NestJS Backend API | 🔜 Planlandı |
| Sprint 4 | Python FastAPI AI Servisi | 🔜 Planlandı |
| Sprint 5 | Solidity Smart Contracts | 🔜 Planlandı |
| Sprint 6 | Docker Infrastructure | 🔜 Planlandı |
| Sprint 7 | GitHub Actions CI/CD | 🔜 Planlandı |
| Sprint 8 | Monad Testnet Deploy | 🔜 Planlandı |

---

## Katkı

[CONTRIBUTING.md](.github/CONTRIBUTING.md) ve [CODE_OF_CONDUCT.md](.github/CODE_OF_CONDUCT.md)
dosyalarını okuyun. Güvenlik açıkları için [SECURITY.md](.github/SECURITY.md) adresine bakın.

---

## Lisans

[MIT](./LICENSE) — 2025 Decentralized AI Marketplace Contributors
