# docs/

Bu klasör projenin teknik dokümantasyonunu barındırır.

## Yapı Planı

```
docs/
├── adr/                    → Architecture Decision Records
│   └── 0001-monad-blockchain.md
├── api/                    → API referans dokümantasyonu
├── contracts/              → Akıllı sözleşme arayüz dokümantasyonu
├── guides/                 → Geliştirici rehberleri
│   ├── getting-started.md
│   ├── monad-testnet-setup.md
│   └── ipfs-integration.md
└── diagrams/               → Mimari diyagramlar (C4, sequence vb.)
```

## ADR (Architecture Decision Records)

Önemli mimari kararlar ADR formatında belgelenir:

```markdown
# ADR-NNNN: Başlık

## Durum
Kabul edildi / Reddedildi / Kullanım dışı

## Bağlam
Karar neden gerekti?

## Karar
Ne yapıldı?

## Sonuçlar
Pozitif ve negatif etkileri neler?
```

## Kural

Kod değişikliklerini etkileyen her önemli mimari karar bir ADR ile belgelenmelidir.
