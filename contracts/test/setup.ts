/**
 * Global Hardhat/Mocha test setup.
 *
 * Imported automatically by hardhat.config.ts via mocha's `require` option.
 * Add test-wide hooks (before/after) and shared fixtures here.
 *
 * Sprint 5 will populate this file with:
 *   - loadFixture() factory for the full contract suite
 *   - Shared signers (owner, buyer, contributor, treasury)
 *   - EVM snapshot helpers for fast test isolation
 */

import { ethers } from 'hardhat';

// ── Global test constants ─────────────────────────────────────────────────────

/** Default token amounts used across test suites (in wei). */
export const AMOUNTS = {
  ONE_MON: ethers.parseEther('1'),
  TEN_MON: ethers.parseEther('10'),
  HUNDRED_MON: ethers.parseEther('100'),
} as const;

/** Common zero address (used to assert "not set" states). */
export const ZERO_ADDRESS = ethers.ZeroAddress;

/** Common bytes32 zero value. */
export const ZERO_BYTES32 = ethers.ZeroHash;

// ── Shared signer factory ────────────────────────────────────────────────────

export interface TestSigners {
  owner: Awaited<ReturnType<typeof ethers.getSigners>>[number];
  buyer: Awaited<ReturnType<typeof ethers.getSigners>>[number];
  contributor: Awaited<ReturnType<typeof ethers.getSigners>>[number];
  treasury: Awaited<ReturnType<typeof ethers.getSigners>>[number];
}

export async function getTestSigners(): Promise<TestSigners> {
  const [owner, buyer, contributor, treasury] = await ethers.getSigners();
  return { owner, buyer, contributor, treasury };
}

// ── EVM snapshot utilities ────────────────────────────────────────────────────

/**
 * Take an EVM snapshot and return a restore function.
 * Use inside beforeEach() to reset state between tests without redeploying.
 *
 * @example
 * let restore: () => Promise<void>;
 * beforeEach(async () => { restore = await takeSnapshot(); });
 * afterEach(async () => { await restore(); });
 */
export async function takeSnapshot(): Promise<() => Promise<void>> {
  const snapshotId = await ethers.provider.send('evm_snapshot', []);
  return async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  };
}

/** Mine N blocks (useful for testing time-locked functions). */
export async function mineBlocks(count: number): Promise<void> {
  for (let i = 0; i < count; i++) {
    await ethers.provider.send('evm_mine', []);
  }
}

/** Advance EVM time by `seconds` and mine a block. */
export async function increaseTime(seconds: number): Promise<void> {
  await ethers.provider.send('evm_increaseTime', [seconds]);
  await ethers.provider.send('evm_mine', []);
}
