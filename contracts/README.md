# contracts/

Bu klasör Monad blockchain üzerinde çalışacak Solidity akıllı sözleşmelerini barındırır.

## İçerik Planı

| Proje | Sprint | Açıklama |
|---|---|---|
| `marketplace` | Sprint 5 | Ana Hardhat projesi — ModelNFT, DataContribution, DAOGovernance sözleşmeleri |

## Sözleşme Mimarisi

```
marketplace/
├── contracts/
│   ├── ModelNFT.sol           → ERC-721: AI model sahipliği ve versiyonlama
│   ├── DataContribution.sol   → Depozito/ödül teşvik mekanizması (Microsoft SUM ilhamlı)
│   └── DAOGovernance.sol      → Token sahiplerinin yönetişim oylaması
├── scripts/
│   └── deploy.ts              → Monad Testnet deploy scripti
├── test/
│   └── *.test.ts              → Hardhat + Chai test dosyaları
└── hardhat.config.ts
```

## Hedef Blockchain

- **Ağ:** Monad Testnet
- **Chain ID:** `10143`
- **RPC:** `https://10143.rpc.thirdweb.com`
- **EVM Uyumluluğu:** Tam — tüm OpenZeppelin kütüphaneleri çalışır
- **Araçlar:** Hardhat, OpenZeppelin Contracts, ethers.js, Thirdweb SDK

## Güvenlik Gereksinimleri

- Tüm public/external fonksiyonlar NatSpec dokümantasyonuna sahip olmalıdır.
- Fon işleyen fonksiyonlarda `ReentrancyGuard` kullanılır.
- Test coverage ≥ %95 zorunludur.
- Her PR için en az iki Solidity reviewer gerekir.
