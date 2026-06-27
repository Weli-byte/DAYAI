import { type HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-contract-sizer';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import * as dotenv from 'dotenv';

dotenv.config();

// ── Environment variables ─────────────────────────────────────────────────────
// We validate required vars at deploy time (scripts/deploy.ts), not here,
// so the config can be loaded for local testing without a .env file.
const PRIVATE_KEY: string = process.env.PRIVATE_KEY ?? '';
const MONAD_RPC_URL: string = process.env.MONAD_RPC_URL ?? 'https://10143.rpc.thirdweb.com';
const ETHERSCAN_API_KEY: string = process.env.ETHERSCAN_API_KEY ?? 'placeholder';
const COINMARKETCAP_API_KEY: string = process.env.COINMARKETCAP_API_KEY ?? '';
const REPORT_GAS: boolean = process.env.REPORT_GAS === 'true';

// ── Hardhat Configuration ─────────────────────────────────────────────────────
const config: HardhatUserConfig = {
  // ── Solidity compiler ───────────────────────────────────────────────────────
  solidity: {
    compilers: [
      {
        version: '0.8.24',
        settings: {
          optimizer: {
            // Enable optimizer for production deployments.
            // runs=200 is the standard trade-off: optimized for ~200 external calls.
            // Increase to 10000 for libraries called very frequently; decrease for
            // contracts that will only be deployed once.
            enabled: true,
            runs: 200,
          },
          // viaIR enables the new Solidity IR-based code generator.
          // Produces more gas-efficient code and enables some optimizations
          // not available in the legacy pipeline — especially useful for UUPS proxies.
          viaIR: true,
          evmVersion: 'cancun', // Latest supported EVM version — matches Monad's EVM
          outputSelection: {
            '*': {
              '*': [
                'abi',
                'evm.bytecode',
                'evm.deployedBytecode',
                'evm.methodIdentifiers',
                'metadata',
              ],
            },
          },
        },
      },
    ],
  },

  // ── Networks ────────────────────────────────────────────────────────────────
  networks: {
    // Local Hardhat network — used for unit tests and rapid iteration.
    // Spins up an in-memory EVM with no real transactions.
    hardhat: {
      chainId: 31337,
      // Allow unlimited contract sizes during tests (local only)
      allowUnlimitedContractSize: false,
      mining: {
        auto: true,
        interval: 0,
      },
    },

    // Local node (Hardhat node --network localhost or Anvil)
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
    },

    // Monad Testnet
    // Chain ID: 10143
    // RPC: https://10143.rpc.thirdweb.com
    // Explorer: https://monad-testnet.socialscan.io
    // Faucet: https://faucet.monad.xyz (0.01 MON/day)
    'monad-testnet': {
      url: MONAD_RPC_URL,
      chainId: 10143,
      // Only include accounts array if a private key is set.
      // This prevents Hardhat from warning about missing accounts during
      // local development when no .env is present.
      accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY.replace(/^0x/, '')}`] : [],
      gas: 'auto',
      gasPrice: 'auto',
      gasMultiplier: 1.2, // 20% buffer over estimated gas
      timeout: 60000, // 60s — higher than default to account for testnet latency
    },
  },

  // ── Block explorer verification ─────────────────────────────────────────────
  etherscan: {
    apiKey: {
      // Monad Testnet uses a custom explorer; the API key may be unused
      // but is required by the plugin schema.
      'monad-testnet': ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: 'monad-testnet',
        chainId: 10143,
        urls: {
          apiURL: 'https://monad-testnet.socialscan.io/api',
          browserURL: 'https://monad-testnet.socialscan.io',
        },
      },
    ],
  },

  // ── Gas reporter ────────────────────────────────────────────────────────────
  gasReporter: {
    enabled: REPORT_GAS,
    currency: 'USD',
    coinmarketcap: COINMARKETCAP_API_KEY || undefined,
    // Output a readable table to stdout
    outputFile: REPORT_GAS ? 'gas-report.txt' : undefined,
    noColors: REPORT_GAS, // Disable colors when writing to file
    // Monad's near-zero gas makes gas reporting mainly useful for
    // relative comparisons between contract functions, not USD cost.
    token: 'MON',
    gasPriceApi: undefined,
  },

  // ── TypeChain ───────────────────────────────────────────────────────────────
  typechain: {
    outDir: 'typechain-types',
    target: 'ethers-v6',
    // Generate types for all abis, including external OpenZeppelin contracts
    alwaysGenerateOverloads: false,
    externalArtifacts: [],
  },

  // ── Solidity coverage ───────────────────────────────────────────────────────
  // Coverage report is generated in ./coverage/ after `pnpm coverage`
  // Configure via .solcover.js if needed.

  // ── Contract sizer ──────────────────────────────────────────────────────────
  contractSizer: {
    alphaSort: true,
    runOnCompile: false, // Only run when explicitly requested: pnpm size
    disambiguatePaths: false,
    strict: true, // Fail if any contract exceeds 24KB limit
  },

  // ── File paths ──────────────────────────────────────────────────────────────
  paths: {
    sources: './contracts', // Solidity source files
    tests: './test', // Test files
    cache: './cache', // Compilation cache (git-ignored)
    artifacts: './artifacts', // Compiled ABIs + bytecode (git-ignored)
  },

  // ── Mocha test runner ───────────────────────────────────────────────────────
  mocha: {
    timeout: 60000, // 60 seconds — accounts for async blockchain operations
    reporter: 'spec',
    // Use parallel test execution when test suite grows large:
    // parallel: true,
  },
};

export default config;
