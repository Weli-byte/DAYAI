/**
 * @file deploy.ts
 * @description Main deployment script for the Decentralized AI Marketplace contracts.
 *
 * Usage:
 *   pnpm deploy:local      → Hardhat local network (no .env required)
 *   pnpm deploy:testnet    → Monad Testnet (requires PRIVATE_KEY in .env)
 *
 * This script will deploy contracts in the correct dependency order:
 *   1. Libraries (if any standalone libraries)
 *   2. Core contracts (ModelNFT, DataContribution, DAOGovernance)
 *   3. Save deployment addresses to deployments/<network>.json
 *
 * NOTE: Business logic contracts have not been written yet (Sprint 5).
 *       This script is a production-ready scaffold — add deployments as
 *       contracts are implemented.
 */

import { ethers, network } from 'hardhat';
import {
  getDeployer,
  printDeployerInfo,
  writeDeployment,
  assertEnvVar,
  type DeploymentRecord,
} from './helpers';

async function main(): Promise<void> {
  console.log('\n🚀 Starting deployment — Decentralized AI Marketplace');
  console.log(`   Network: ${network.name}`);

  // ── Pre-flight checks ─────────────────────────────────────────────────────
  if (network.name === 'monad-testnet') {
    assertEnvVar('PRIVATE_KEY');
    assertEnvVar('MONAD_RPC_URL');
    console.log('✅ Environment variables validated');
  }

  // ── Deployer info ─────────────────────────────────────────────────────────
  const deployer = await getDeployer();
  await printDeployerInfo(deployer);

  const startBlock = await ethers.provider.getBlockNumber();
  const chainId = (await ethers.provider.getNetwork()).chainId;
  const deployerAddress = await deployer.getAddress();

  // ── Deployment record ─────────────────────────────────────────────────────
  const record: DeploymentRecord = {
    network: network.name,
    chainId: Number(chainId),
    deployer: deployerAddress,
    timestamp: new Date().toISOString(),
    blockNumber: startBlock,
    contracts: {},
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CONTRACT DEPLOYMENTS
  // ─────────────────────────────────────────────────────────────────────────
  //
  // Sprint 5 will add the actual contract deployments here. Example pattern:
  //
  // ── Step 1: Deploy ModelNFT (UUPS Upgradeable) ──
  // console.log('\n📦 Deploying ModelNFT...');
  // const ModelNFT = await ethers.getContractFactory('ModelNFT');
  // const modelNFT = await upgrades.deployProxy(
  //   ModelNFT,
  //   [deployer.address],           // initializer args
  //   { kind: 'uups', initializer: 'initialize' },
  // );
  // await modelNFT.waitForDeployment();
  // const modelNFTAddress = await modelNFT.getAddress();
  // const modelNFTImpl = await upgrades.erc1967.getImplementationAddress(modelNFTAddress);
  // await waitForConfirmations((await modelNFT.deploymentTransaction())!.hash);
  //
  // record.contracts['ModelNFT'] = {
  //   name: 'ModelNFT',
  //   address: modelNFTAddress,
  //   txHash: (await modelNFT.deploymentTransaction())!.hash,
  //   blockNumber: await ethers.provider.getBlockNumber(),
  //   isProxy: true,
  //   implementationAddress: modelNFTImpl,
  // };
  // console.log(`✅ ModelNFT proxy  → ${explorerUrl(modelNFTAddress)}`);
  // console.log(`   Implementation  → ${explorerUrl(modelNFTImpl)}`);
  //
  // ── Step 2: Deploy DataContribution ──
  // ── Step 3: Deploy DAOGovernance ──
  //
  // ─────────────────────────────────────────────────────────────────────────

  console.log('\n⚠️  No contracts deployed yet — placeholder script (Sprint 5 will add contracts)');

  // ── Save deployment record ────────────────────────────────────────────────
  writeDeployment(record);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n─────────────────── DEPLOYMENT SUMMARY ───────────────────');
  console.log(`Network   : ${record.network} (chainId: ${record.chainId})`);
  console.log(`Deployer  : ${record.deployer}`);
  console.log(`Timestamp : ${record.timestamp}`);
  console.log(`Contracts : ${Object.keys(record.contracts).length} deployed`);
  console.log('──────────────────────────────────────────────────────────\n');
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  });
