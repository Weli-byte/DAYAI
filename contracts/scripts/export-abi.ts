/**
 * @file export-abi.ts
 * @description Exports compiled contract ABIs and deployment addresses to the
 * frontend and backend packages so they can interact with on-chain contracts
 * without importing the full Hardhat project.
 *
 * Usage:
 *   pnpm export-abi
 *
 * Output (created automatically):
 *   packages/sdk/src/abis/       ← ABI JSON files
 *   packages/sdk/src/addresses/  ← Network-specific address maps
 *
 * Run this script after every deployment and whenever a contract ABI changes.
 * The generated files are committed to the repository so all packages have
 * consistent, up-to-date contract interfaces.
 */

import * as fs from 'fs';
import * as path from 'path';
import { readDeployment } from './helpers';

// ── Target output directories ─────────────────────────────────────────────────
const REPO_ROOT = path.join(__dirname, '../../../');
const SDK_ABIS_DIR = path.join(REPO_ROOT, 'packages/sdk/src/abis');
const SDK_ADDRESSES_DIR = path.join(REPO_ROOT, 'packages/sdk/src/addresses');

// Contract names whose ABIs we want to export (add as contracts are written)
const EXPORT_CONTRACTS: string[] = [
  // 'ModelNFT',
  // 'DataContribution',
  // 'DAOGovernance',
];

// Networks to export addresses for
const EXPORT_NETWORKS: string[] = ['monad-testnet', 'hardhat'];

interface AbiExport {
  contractName: string;
  abi: unknown[];
  generatedAt: string;
}

interface AddressMap {
  network: string;
  chainId: number;
  generatedAt: string;
  contracts: Record<string, string>;
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

function loadArtifact(contractName: string): { abi: unknown[] } | null {
  // Hardhat stores artifacts at: artifacts/contracts/**/<Name>.sol/<Name>.json
  const artifactsDir = path.join(__dirname, '../artifacts/contracts');
  if (!fs.existsSync(artifactsDir)) {
    console.warn(`⚠️  Artifacts directory not found. Run 'pnpm compile' first.`);
    return null;
  }

  // Walk artifacts directory to find the contract
  const files = fs.readdirSync(artifactsDir, { recursive: true }) as string[];
  const artifactFile = files.find(
    (f) => f.endsWith(`${contractName}.json`) && !f.includes('.dbg.json'),
  );

  if (!artifactFile) {
    console.warn(`⚠️  Artifact not found for ${contractName}`);
    return null;
  }

  const fullPath = path.join(artifactsDir, artifactFile);
  const artifact = JSON.parse(fs.readFileSync(fullPath, 'utf8')) as { abi: unknown[] };
  return artifact;
}

async function main(): Promise<void> {
  console.log('\n📤 Exporting ABIs and addresses to packages/sdk');

  ensureDir(SDK_ABIS_DIR);
  ensureDir(SDK_ADDRESSES_DIR);

  // ── Export ABIs ──────────────────────────────────────────────────────────
  if (EXPORT_CONTRACTS.length === 0) {
    console.log('⚠️  No contracts configured for export yet (Sprint 5 will add them)');
  }

  for (const contractName of EXPORT_CONTRACTS) {
    const artifact = loadArtifact(contractName);
    if (!artifact) continue;

    const abiExport: AbiExport = {
      contractName,
      abi: artifact.abi,
      generatedAt: new Date().toISOString(),
    };

    const outputPath = path.join(SDK_ABIS_DIR, `${contractName}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(abiExport, null, 2));
    console.log(`✅ ABI exported: ${contractName} → ${outputPath}`);
  }

  // ── Export address maps ───────────────────────────────────────────────────
  for (const networkName of EXPORT_NETWORKS) {
    const deployment = readDeployment(networkName);
    if (!deployment) {
      console.log(`ℹ️  No deployment for ${networkName} — skipping address export`);
      continue;
    }

    const addressMap: AddressMap = {
      network: networkName,
      chainId: deployment.chainId,
      generatedAt: new Date().toISOString(),
      contracts: Object.fromEntries(
        Object.entries(deployment.contracts).map(([name, c]) => [name, c.address]),
      ),
    };

    const outputPath = path.join(SDK_ADDRESSES_DIR, `${networkName}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(addressMap, null, 2));
    console.log(`✅ Addresses exported: ${networkName} → ${outputPath}`);
  }

  console.log('\n✅ Export complete\n');
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error('\n❌ Export failed:', error.message);
    process.exit(1);
  });
