/**
 * @file verify.ts
 * @description Verifies deployed contracts on the Monad Testnet block explorer.
 *
 * Usage:
 *   pnpm verify    → Reads deployments/monad-testnet.json and verifies all contracts
 *
 * Notes:
 * - Requires ETHERSCAN_API_KEY in .env (even if the explorer doesn't enforce it)
 * - Must be run after a successful `pnpm deploy:testnet`
 * - UUPS proxy implementation addresses are verified separately
 * - Verification may fail for a few blocks after deployment — retry if needed
 */

import { run, network } from 'hardhat';
import { readDeployment, type ContractDeployment } from './helpers';

async function verifyContract(deployment: ContractDeployment): Promise<void> {
  const addressToVerify = deployment.implementationAddress ?? deployment.address;
  const label = deployment.isProxy ? `${deployment.name} (implementation)` : deployment.name;

  console.log(`\n🔍 Verifying ${label}...`);
  console.log(`   Address: ${addressToVerify}`);

  try {
    await run('verify:verify', {
      address: addressToVerify,
      constructorArguments: deployment.constructorArgs ?? [],
    });
    console.log(`✅ ${label} verified`);
  } catch (err: unknown) {
    const error = err as Error;
    // "Already Verified" is a non-fatal error — contract is already on explorer
    if (error.message.includes('Already Verified') || error.message.includes('already verified')) {
      console.log(`ℹ️  ${label} already verified — skipping`);
    } else {
      console.warn(`⚠️  ${label} verification failed: ${error.message}`);
      // Don't exit — continue with remaining contracts
    }
  }
}

async function main(): Promise<void> {
  if (network.name === 'hardhat' || network.name === 'localhost') {
    console.error('❌ Verification is not available on local networks.');
    process.exit(1);
  }

  console.log(`\n🔍 Starting contract verification on ${network.name}`);

  const deployment = readDeployment(network.name);
  if (deployment == null) {
    console.error(`❌ No deployment found for network: ${network.name}`);
    console.error(`   Run 'pnpm deploy:testnet' first.`);
    process.exit(1);
    return;
  }

  const contracts = Object.values(deployment.contracts);
  if (contracts.length === 0) {
    console.log('⚠️  No contracts in deployment record — nothing to verify.');
    process.exit(0);
  }

  console.log(`   Found ${contracts.length} contract(s) to verify`);
  console.log(`   Deployed at: ${deployment.timestamp}`);

  for (const contract of contracts) {
    await verifyContract(contract);
  }

  console.log('\n✅ Verification complete\n');
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error('\n❌ Verification script failed:', error.message);
    process.exit(1);
  });
