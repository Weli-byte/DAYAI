import * as fs from 'fs';
import * as path from 'path';
import { ethers, network } from 'hardhat';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type Signer = Awaited<ReturnType<(typeof import('hardhat'))['ethers']['getSigner']>>;

// ── Deployment record ─────────────────────────────────────────────────────────
export interface DeploymentRecord {
  network: string;
  chainId: number;
  deployer: string;
  timestamp: string;
  blockNumber: number;
  contracts: Record<string, ContractDeployment>;
}

export interface ContractDeployment {
  name: string;
  address: string;
  txHash: string;
  blockNumber: number;
  isProxy: boolean;
  implementationAddress?: string;
  constructorArgs?: unknown[];
}

// ── File paths ────────────────────────────────────────────────────────────────
const DEPLOYMENTS_DIR = path.join(__dirname, '../../deployments');

export function getDeploymentPath(networkName: string): string {
  return path.join(DEPLOYMENTS_DIR, `${networkName}.json`);
}

// ── Read / write deployment records ──────────────────────────────────────────
export function readDeployment(networkName: string): DeploymentRecord | null {
  const filePath = getDeploymentPath(networkName);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as DeploymentRecord;
}

export function writeDeployment(record: DeploymentRecord): void {
  if (!fs.existsSync(DEPLOYMENTS_DIR)) {
    fs.mkdirSync(DEPLOYMENTS_DIR, { recursive: true });
  }
  const filePath = getDeploymentPath(record.network);
  fs.writeFileSync(filePath, JSON.stringify(record, null, 2));
  console.log(`📄 Deployment saved → ${filePath}`);
}

// ── Network helpers ───────────────────────────────────────────────────────────

export async function getDeployer(): Promise<Signer> {
  const [deployer] = await ethers.getSigners();
  if (!deployer) throw new Error('No signer available. Set PRIVATE_KEY in .env');
  return deployer;
}

export async function printDeployerInfo(deployer: Signer): Promise<void> {
  const address = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(address);
  console.log('\n─────────────────────────────────────');
  console.log(`Network   : ${network.name}`);
  console.log(`Deployer  : ${address}`);
  console.log(`Balance   : ${ethers.formatEther(balance)} ETH/MON`);
  console.log('─────────────────────────────────────\n');
}

export function assertEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

// ── Wait for confirmations (important on live networks) ───────────────────────
export async function waitForConfirmations(txHash: string, confirmations = 2): Promise<void> {
  if (network.name === 'hardhat' || network.name === 'localhost') return;
  console.log(`⏳ Waiting for ${confirmations} confirmations...`);
  const receipt = await ethers.provider.waitForTransaction(txHash, confirmations);
  if (!receipt) throw new Error(`Transaction ${txHash} not found`);
  console.log(`✅ Confirmed in block ${receipt.blockNumber}`);
}

// ── Format address for console output ────────────────────────────────────────
export function explorerUrl(address: string): string {
  const explorer = process.env.BLOCK_EXPLORER ?? 'https://monad-testnet.socialscan.io';
  return `${explorer}/address/${address}`;
}
