import { expect } from 'chai';
import { ethers } from 'hardhat';
import type { AIModelNFT } from '../typechain-types';
import type { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('AIModelNFT', () => {
  let nft: AIModelNFT;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  const METADATA_URI = 'ipfs://QmMetadataHash123';
  const CID = 'QmModelFileCID456';
  const VERSION = '1.0.0';

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory('AIModelNFT');
    nft = (await Factory.deploy()) as AIModelNFT;
    await nft.waitForDeployment();
  });

  // ── Deployment ──────────────────────────────────────────────────────────────

  describe('Deployment', () => {
    it('sets the correct name and symbol', async () => {
      expect(await nft.name()).to.equal('AI Model NFT');
      expect(await nft.symbol()).to.equal('AIMNFT');
    });

    it('sets deployer as owner', async () => {
      expect(await nft.owner()).to.equal(owner.address);
    });

    it('starts with zero minted tokens', async () => {
      expect(await nft.totalMinted()).to.equal(0n);
    });

    it('starts with minting unpaused', async () => {
      expect(await nft.mintingPaused()).to.equal(false);
    });
  });

  // ── Minting ─────────────────────────────────────────────────────────────────

  describe('mint', () => {
    it('mints a token and emits ModelMinted event', async () => {
      await expect(
        nft.connect(user1).mint(user1.address, user1.address, METADATA_URI, CID, VERSION),
      )
        .to.emit(nft, 'ModelMinted')
        .withArgs(1n, user1.address, METADATA_URI, CID, VERSION);
    });

    it('assigns the token to the correct owner', async () => {
      await nft.connect(user1).mint(user1.address, user1.address, METADATA_URI, CID, VERSION);
      expect(await nft.ownerOf(1n)).to.equal(user1.address);
    });

    it('sets the token URI correctly', async () => {
      await nft.connect(user1).mint(user1.address, user1.address, METADATA_URI, CID, VERSION);
      expect(await nft.tokenURI(1n)).to.equal(METADATA_URI);
    });

    it('auto-increments token IDs', async () => {
      await nft.connect(user1).mint(user1.address, user1.address, METADATA_URI, CID, '1.0.0');
      await nft.connect(user2).mint(user2.address, user2.address, METADATA_URI, CID, '2.0.0');
      expect(await nft.ownerOf(1n)).to.equal(user1.address);
      expect(await nft.ownerOf(2n)).to.equal(user2.address);
      expect(await nft.totalMinted()).to.equal(2n);
    });

    it('stores model data correctly', async () => {
      await nft.connect(user1).mint(user1.address, user1.address, METADATA_URI, CID, VERSION);
      const data = await nft.getModelData(1n);
      expect(data.metadataURI).to.equal(METADATA_URI);
      expect(data.cid).to.equal(CID);
      expect(data.creator).to.equal(user1.address);
      expect(data.version).to.equal(VERSION);
      expect(data.mintedAt).to.be.greaterThan(0n);
    });

    it('supports different creator and receiver', async () => {
      await nft.connect(owner).mint(user2.address, user1.address, METADATA_URI, CID, VERSION);
      expect(await nft.ownerOf(1n)).to.equal(user2.address);
      const data = await nft.getModelData(1n);
      expect(data.creator).to.equal(user1.address);
    });

    it('reverts on zero address for receiver', async () => {
      await expect(
        nft.mint(ethers.ZeroAddress, user1.address, METADATA_URI, CID, VERSION),
      ).to.be.revertedWithCustomError(nft, 'ZeroAddress');
    });

    it('reverts on empty metadata URI', async () => {
      await expect(
        nft.mint(user1.address, user1.address, '', CID, VERSION),
      ).to.be.revertedWithCustomError(nft, 'EmptyMetadataURI');
    });

    it('reverts on empty CID', async () => {
      await expect(
        nft.mint(user1.address, user1.address, METADATA_URI, '', VERSION),
      ).to.be.revertedWithCustomError(nft, 'EmptyCID');
    });

    it('reverts on empty version', async () => {
      await expect(
        nft.mint(user1.address, user1.address, METADATA_URI, CID, ''),
      ).to.be.revertedWithCustomError(nft, 'EmptyVersion');
    });
  });

  // ── Minting Pause ───────────────────────────────────────────────────────────

  describe('setMintingPaused', () => {
    it('allows owner to pause minting', async () => {
      await nft.setMintingPaused(true);
      expect(await nft.mintingPaused()).to.equal(true);
    });

    it('emits MintingStatusChanged event', async () => {
      await expect(nft.setMintingPaused(true)).to.emit(nft, 'MintingStatusChanged').withArgs(true);
    });

    it('reverts if non-owner tries to pause', async () => {
      await expect(nft.connect(user1).setMintingPaused(true)).to.be.revertedWithCustomError(
        nft,
        'OwnableUnauthorizedAccount',
      );
    });

    it('reverts mint for non-owner when paused', async () => {
      await nft.setMintingPaused(true);
      await expect(
        nft.connect(user1).mint(user1.address, user1.address, METADATA_URI, CID, VERSION),
      ).to.be.revertedWithCustomError(nft, 'MintingPaused');
    });

    it('owner can still mint when paused', async () => {
      await nft.setMintingPaused(true);
      await expect(
        nft.connect(owner).mint(user1.address, user1.address, METADATA_URI, CID, VERSION),
      ).to.emit(nft, 'ModelMinted');
    });
  });

  // ── getModelData ────────────────────────────────────────────────────────────

  describe('getModelData', () => {
    it('reverts for non-existent token', async () => {
      await expect(nft.getModelData(999n)).to.be.revertedWithCustomError(
        nft,
        'ERC721NonexistentToken',
      );
    });
  });
});
