/**
 * Placeholder test suite.
 *
 * Verifies that the test infrastructure works correctly before any contracts
 * have been written. Sprint 5 will replace this with real contract tests.
 *
 * Run: pnpm test
 */

import { expect } from 'chai';
import { ethers } from 'hardhat';
import { AMOUNTS, ZERO_ADDRESS, getTestSigners } from './helpers';

describe('Test Infrastructure', function () {
  it('should have a valid Hardhat provider', async function () {
    const network = await ethers.provider.getNetwork();
    expect(network.chainId).to.be.a('bigint');
  });

  it('should return test signers', async function () {
    const { owner, buyer, contributor, treasury } = await getTestSigners();
    expect(owner.address).to.not.equal(ZERO_ADDRESS);
    expect(buyer.address).to.not.equal(ZERO_ADDRESS);
    expect(contributor.address).to.not.equal(owner.address);
    expect(treasury.address).to.not.equal(owner.address);
  });

  it('should have test amount constants defined', function () {
    expect(AMOUNTS.ONE_MON).to.equal(ethers.parseEther('1'));
    expect(AMOUNTS.TEN_MON).to.equal(ethers.parseEther('10'));
    expect(AMOUNTS.HUNDRED_MON).to.equal(ethers.parseEther('100'));
  });

  it('should have funded test accounts on local network', async function () {
    const { owner } = await getTestSigners();
    const balance = await ethers.provider.getBalance(owner.address);
    // Local Hardhat network seeds each account with 10,000 ETH
    expect(balance).to.be.gt(0n);
  });
});
