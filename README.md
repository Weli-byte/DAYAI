# Decentralized AI Model Marketplace

> A production-grade, community-driven AI model marketplace built on the **Monad blockchain** —
> combining NFT-based model ownership, IPFS decentralized storage, on-chain incentive mechanisms
> inspired by Microsoft SUM, and DAO governance.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Architecture Overview](#architecture-overview)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

---

## Project Overview

Traditional AI model marketplaces are controlled by centralized authorities (OpenAI, Anthropic,
Google). This platform eliminates that dependency by:

- **Tokenizing AI models as NFTs (ERC-721)** on the Monad blockchain, giving creators verifiable
  ownership and transfer rights.
- **Storing model weights on IPFS**, with only the content hash recorded on-chain — keeping
  storage costs near zero while ensuring integrity.
- **Incentivizing data contributions** via an on-chain deposit/reward mechanism inspired by
  Microsoft Research's _Sharing Updatable Models (SUM)_ framework — contributors stake tokens,
  and quality data earns rewards.
- **Enabling DAO governance** so token holders vote on model updates, fee structures, and platform
  rules without any central authority.
- **Leveraging Monad's parallel EVM** (~10,000 TPS, ~1s block time, near-zero gas) to handle
  high-throughput AI workloads that would be impractical on Ethereum mainnet.

### Why Monad?

Monad is a 100% EVM-compatible Layer-1 blockchain with parallel transaction execution. This means:

- All Ethereum tooling works out-of-the-box (MetaMask, OpenZeppelin, Hardhat, ethers.js).
- Transactions finalize in ~1 second vs. ~12 seconds on Ethereum.
- Gas fees are negligible on testnet (~0.01 MON per block).
- **Chain ID:** `10143` | **RPC:** `https://10143.rpc.thirdweb.com`

### Inspiration & Research Basis

| Source                    | Contribution to This Project                                          |
| ------------------------- | --------------------------------------------------------------------- |
| Microsoft Research (SUM)  | On-chain deposit/reward incentive mechanism for data contributors     |
| Pluralis Research         | Collective, community-owned model training without centralized weight |
| OpenAI / Paradigm EVMbench| Smart contract security testing with AI                               |
| Cambridge / Insilico      | Blockchain-based health data marketplace with privacy guarantees      |
| MIT Federated Learning    | Efficient distributed learning across heterogeneous devices           |

---

## Technology Stack

| Layer            | Technology                              |
| ---------------- | --------------------------------------- |
| Frontend         | Next.js 15, React 19, TypeScript        |
| Backend API      | NestJS, TypeScript, Prisma              |
| AI Service       | Python 3.12, FastAPI, PyTorch           |
| Smart Contracts  | Solidity ^0.8.24, Hardhat, OpenZeppelin |
| Blockchain       | Monad (EVM-compatible Layer-1)          |
| Storage          | IPFS / Pinata                           |
| Monorepo         | TurboRepo, pnpm workspaces             |
| Package Manager  | pnpm 9+                                 |
| Language         | TypeScript 5+                           |
| Code Quality     | ESLint 9, Prettier 3, Husky, Commitlint |
| CI/CD            | GitHub Actions                          |
| Infrastructure   | Docker, Docker Compose                  |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                   │
│   Model Gallery · Wallet Connect · NFT Purchase · DAO Vote  │
└────────────────────────┬────────────────────────────────────┘
                         │ REST / GraphQL / WebSocket
┌────────────────────────▼────────────────────────────────────┐
│                     Backend API (NestJS)                    │
│    Auth · Model Registry · Payment · Events · Indexer       │
└──────────┬──────────────────────────────────────────────────┘
           │                           │
┌──────────▼──────────┐    ┌───────────▼────────────────────┐
│  AI Service (FastAPI)│    │   Monad Blockchain (EVM)       │
│  Model Inference     │    │   ModelNFT.sol (ERC-721)       │
│  IPFS Upload/Download│    │   DataContribution.sol         │
│  Federated Learning  │    │   DAOGovernance.sol            │
└──────────────────────┘    └────────────┬───────────────────┘
                                         │
                            ┌────────────▼───────────────────┐
                            │          IPFS / Pinata         │
                            │   Model Weights · Datasets     │
                            └────────────────────────────────┘
```

### Core On-Chain Flow

1. **Publish Model** → Developer uploads weights to IPFS → receives `contentHash` → calls
   `mintNFT(contentHash, metadata)` → model NFT is minted.
2. **Buy / Transfer** → User calls `purchaseModel(nftId)` → ownership transferred on-chain →
   user can call inference API.
3. **Contribute Data** → Contributor calls `addData(nftId, dataHash)` + deposits MON tokens →
   incentive mechanism verifies quality → deposit returned + reward paid.
4. **Update Model** → After re-training, developer calls `updateModel(nftId, newContentHash)` →
   version history permanently recorded on-chain.
5. **DAO Vote** → Token holders propose and vote on governance changes via `DAOGovernance.sol`.

---

## Repository Structure

```
decentralized-ai-marketplace/
├── apps/                        # End-user applications
│   ├── web/                     # Next.js frontend (to be created in Sprint 2)
│   └── docs-site/               # Documentation website (future)
│
├── packages/                    # Shared internal libraries
│   ├── ui/                      # Shared React component library (future)
│   ├── config/                  # Shared ESLint, TypeScript, Prettier configs (future)
│   ├── types/                   # Shared TypeScript type definitions (future)
│   └── utils/                   # Shared utility functions (future)
│
├── services/                    # Backend microservices
│   ├── api/                     # NestJS REST/GraphQL API (to be created in Sprint 3)
│   └── ai/                      # Python FastAPI AI inference service (Sprint 4)
│
├── contracts/                   # Solidity smart contracts
│   └── marketplace/             # Hardhat project: ModelNFT, DataContribution, DAO (Sprint 5)
│
├── docker/                      # Docker Compose & service Dockerfiles (Sprint 6)
├── docs/                        # Architecture docs, ADRs, API references
├── scripts/                     # Deployment, migration, and utility scripts
├── infrastructure/              # Terraform / Pulumi IaC (future)
│
├── .github/                     # GitHub configuration
│   ├── ISSUE_TEMPLATE/          # Bug report & feature request templates
│   ├── workflows/               # GitHub Actions CI/CD pipelines (future)
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CODE_OF_CONDUCT.md
│   ├── CONTRIBUTING.md
│   └── SECURITY.md
│
├── .vscode/                     # VSCode workspace settings & extensions
├── .husky/                      # Git hooks (pre-commit, commit-msg)
│
├── package.json                 # Root workspace package (scripts + devDependencies)
├── pnpm-workspace.yaml          # pnpm workspace package globs
├── turbo.json                   # TurboRepo pipeline configuration
├── eslint.config.js             # Root ESLint flat config
├── .prettierrc                  # Prettier formatting rules
├── .editorconfig                # Cross-editor coding style consistency
├── .gitignore                   # Comprehensive ignore rules
└── LICENSE                      # MIT License
```

---

## Getting Started

> **Prerequisites:** Node.js ≥ 20, pnpm ≥ 9

### 1. Clone the repository

```bash
git clone https://github.com/your-org/decentralized-ai-marketplace.git
cd decentralized-ai-marketplace
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
# Fill in the required values (RPC URLs, API keys, IPFS credentials, etc.)
```

### 4. Start development

```bash
pnpm dev
```

> Individual workspace packages can also be started with TurboRepo filters:
> `pnpm dev --filter=@marketplace/web`

---

## Available Scripts

All scripts are run from the repository root and orchestrated by TurboRepo across all workspaces.

| Script                    | Description                                                        |
| ------------------------- | ------------------------------------------------------------------ |
| `pnpm dev`                | Start all services in development mode (with hot-reload)           |
| `pnpm build`              | Build all packages and applications for production                 |
| `pnpm lint`               | Run ESLint across the entire monorepo                              |
| `pnpm lint:fix`           | Auto-fix ESLint issues where possible                              |
| `pnpm format`             | Format all files with Prettier                                     |
| `pnpm format:check`       | Check formatting without modifying files (used in CI)             |
| `pnpm typecheck`          | Run TypeScript type-checking across all packages                   |
| `pnpm test`               | Run all test suites (unit + integration)                           |
| `pnpm test:coverage`      | Run tests and generate coverage reports                            |
| `pnpm clean`              | Delete all build outputs, caches, and `node_modules`              |
| `pnpm clean:cache`        | Clear only the TurboRepo build cache                               |

---

## Contributing

We welcome contributions! Please read our [Contributing Guide](.github/CONTRIBUTING.md) and
[Code of Conduct](.github/CODE_OF_CONDUCT.md) before submitting pull requests.

Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) format,
enforced automatically by Commitlint + Husky.

---

## Roadmap

| Sprint | Focus                          | Status     |
| ------ | ------------------------------ | ---------- |
| 1      | Repository & Monorepo Foundation | ✅ Complete |
| 2      | Next.js Frontend Scaffold      | 🔜 Planned  |
| 3      | NestJS Backend API             | 🔜 Planned  |
| 4      | Python FastAPI AI Service      | 🔜 Planned  |
| 5      | Solidity Smart Contracts       | 🔜 Planned  |
| 6      | Docker Infrastructure          | 🔜 Planned  |
| 7      | CI/CD & GitHub Actions         | 🔜 Planned  |
| 8      | Monad Testnet Deployment       | 🔜 Planned  |
| 9      | Integration & E2E Testing      | 🔜 Planned  |
| 10     | Production Hardening & Launch  | 🔜 Planned  |

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.
