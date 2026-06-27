# contracts/

Solidity smart contracts for the **Decentralized AI Marketplace** on Monad blockchain.

Built with Hardhat + TypeScript + OpenZeppelin Upgradeable Contracts.

---

## Stack

| Tool                                                                                     | Purpose                                                  |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [Hardhat](https://hardhat.org)                                                           | Compilation, testing, deployment, verification           |
| [OpenZeppelin Contracts v5](https://docs.openzeppelin.com/contracts/5.x/)                | Audited base contracts (ERC-721, ERC-20, Access Control) |
| [OpenZeppelin Upgrades](https://docs.openzeppelin.com/upgrades-plugins/hardhat-upgrades) | UUPS proxy deployment & upgrade management               |
| [TypeChain](https://github.com/dethcrypto/TypeChain)                                     | Auto-generated TypeScript bindings for ethers v6         |
| [solidity-coverage](https://github.com/sc-forks/solidity-coverage)                       | Istanbul coverage reports                                |
| [hardhat-gas-reporter](https://github.com/cgewecke/hardhat-gas-reporter)                 | Per-function gas cost table                              |
| [solhint](https://protofire.github.io/solhint/)                                          | Solidity linter                                          |

**Target network:** Monad Testnet — Chain ID `10143`, ~1s block time, EVM-compatible

---

## Directory Structure

```
contracts/
├── contracts/             Solidity source files
│   ├── core/              Primary business-logic contracts (Sprint 5)
│   ├── interfaces/        Abstract interfaces (IModelNFT, IMarketplace, …)
│   ├── libraries/         Reusable Solidity libraries (PriceLib, MetadataLib, …)
│   ├── errors/            Custom error definitions (shared across contracts)
│   ├── events/            Event definitions (shared across contracts)
│   └── mocks/             Test-only mock contracts (not deployed to mainnet)
├── scripts/               Deployment & tooling scripts (TypeScript)
│   ├── deploy.ts          Main deployment orchestrator
│   ├── verify.ts          Block-explorer verification
│   ├── export-abi.ts      Export ABIs → packages/sdk
│   ├── clean.ts           Remove generated artifacts
│   └── helpers/           Shared utilities (deployment records, signer helpers)
├── test/                  Hardhat/Mocha test suites
│   ├── helpers/           Shared test utilities, fixtures, signers
│   └── placeholder.test.ts Infrastructure smoke test (Sprint 5 replaces this)
├── deployments/           JSON deployment records (committed) — one file per network
├── typechain-types/       Auto-generated TypeScript contract bindings (git-ignored)
├── artifacts/             Compiled bytecode + ABI (git-ignored)
├── cache/                 Solidity compilation cache (git-ignored)
├── hardhat.config.ts      Hardhat configuration (networks, plugins, compiler)
├── tsconfig.json          TypeScript config for scripts and tests
├── .env.example           Required environment variables template
├── .solhint.json          Solidity linter rules
└── package.json           Package scripts and dependencies
```

---

## Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# → Fill in PRIVATE_KEY (testnet-only wallet) and other values

# Compile contracts (none yet — Sprint 5)
pnpm compile
```

---

## Scripts

| Command               | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `pnpm compile`        | Compile all Solidity files + generate TypeChain types |
| `pnpm clean`          | Remove artifacts, cache, typechain-types, coverage    |
| `pnpm test`           | Run all test suites against local Hardhat network     |
| `pnpm coverage`       | Istanbul coverage report (HTML in `coverage/`)        |
| `pnpm deploy:local`   | Deploy to local Hardhat node                          |
| `pnpm deploy:testnet` | Deploy to Monad Testnet (requires `.env`)             |
| `pnpm verify`         | Verify deployed contracts on block explorer           |
| `pnpm export-abi`     | Copy ABIs + addresses to `packages/sdk`               |
| `pnpm lint`           | Run Solhint on all `.sol` files                       |
| `pnpm lint:fix`       | Auto-fix Solhint issues where possible                |
| `pnpm typecheck`      | TypeScript type check (no emit)                       |
| `pnpm size`           | Print contract bytecode size vs 24KB limit            |
| `pnpm gas-report`     | Run tests with gas cost table                         |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```dotenv
PRIVATE_KEY=           # Testnet-only wallet private key (no 0x prefix)
MONAD_RPC_URL=         # Default: https://10143.rpc.thirdweb.com
CHAIN_ID=10143
BLOCK_EXPLORER=        # Default: https://monad-testnet.socialscan.io
ETHERSCAN_API_KEY=     # For contract verification (may not be required)
REPORT_GAS=false       # Set to true to enable gas reporter
COINMARKETCAP_API_KEY= # For USD gas cost conversion
```

> **Security:** Never commit `.env`. The file is git-ignored.
> Use a dedicated testnet wallet — never your main wallet.

---

## Network Configuration

| Parameter      | Value                                 |
| -------------- | ------------------------------------- |
| Network name   | `monad-testnet`                       |
| Chain ID       | `10143`                               |
| RPC URL        | `https://10143.rpc.thirdweb.com`      |
| Block Explorer | `https://monad-testnet.socialscan.io` |
| Block Time     | ~1 second                             |
| Gas            | Near-zero (testnet)                   |
| Faucet         | `https://faucet.monad.xyz`            |

---

## Contract Architecture (Sprint 5 Preview)

All contracts use the **UUPS Upgradeable Proxy** pattern via OpenZeppelin Upgrades:

```
Proxy (ERC-1967)          Implementation (logic)
  ModelNFT Proxy    ───→  ModelNFT V1
  DataContrib Proxy ───→  DataContribution V1
  Governance Proxy  ───→  DAOGovernance V1
```

Upgrade authority is controlled by a Governance multisig — not a single EOA.

---

## Güvenlik Gereksinimleri

- Tüm public/external fonksiyonlar NatSpec dokümantasyonuna sahip olmalıdır.
- Fon işleyen fonksiyonlarda `ReentrancyGuard` kullanılır.
- Test coverage ≥ %95 zorunludur.
- Her PR için en az iki Solidity reviewer gerekir.

---

## Sprint Roadmap

| Sprint          | Contracts                                  |
| --------------- | ------------------------------------------ |
| Sprint 1 (this) | Infrastructure only — no contracts         |
| Sprint 5        | ModelNFT, DataContribution, DAOGovernance  |
| Sprint 6        | Marketplace, Treasury, Royalty distributor |
| Sprint 7        | Security audit, mainnet preparation        |
