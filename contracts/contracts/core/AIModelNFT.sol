// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AIModelNFT
 * @notice ERC-721 token representing ownership of an AI model on the
 *         Decentralized AI Model Marketplace, deployed on Monad Testnet.
 * @dev Each token stores an IPFS metadata URI, the raw IPFS CID of the
 *      model file, the original creator address, and a semantic version
 *      string.  The contract owner can pause minting if needed; individual
 *      token URIs are set once at mint time and cannot be changed.
 */
contract AIModelNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    // ── Errors ────────────────────────────────────────────────────────────────

    error ZeroAddress();
    error EmptyMetadataURI();
    error EmptyCID();
    error EmptyVersion();
    error MintingPaused();

    // ── Events ────────────────────────────────────────────────────────────────

    /**
     * @notice Emitted when a new AI model NFT is minted.
     * @param tokenId   The newly assigned token ID.
     * @param creator   The address that created the model (may differ from minter).
     * @param metadataURI IPFS URI pointing to the JSON metadata file.
     * @param cid       Raw IPFS content identifier of the model binary.
     * @param version   Semantic version string of the model (e.g. "1.0.0").
     */
    event ModelMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string metadataURI,
        string cid,
        string version
    );

    /**
     * @notice Emitted when minting is paused or unpaused by the owner.
     */
    event MintingStatusChanged(bool paused);

    // ── State ─────────────────────────────────────────────────────────────────

    /// @notice Auto-incrementing token ID counter (starts at 1).
    uint256 private _nextTokenId;

    /// @notice When true, only the contract owner can mint.
    bool public mintingPaused;

    /**
     * @notice On-chain data stored for every minted model NFT.
     * @param metadataURI IPFS URI for the off-chain JSON metadata.
     * @param cid         IPFS CID of the raw model file.
     * @param creator     Original creator address at the time of mint.
     * @param version     Semantic version string.
     * @param mintedAt    Block timestamp when the token was minted.
     */
    struct ModelData {
        string metadataURI;
        string cid;
        address creator;
        string version;
        uint256 mintedAt;
    }

    /// @notice tokenId => ModelData
    mapping(uint256 => ModelData) private _modelData;

    // ── Constructor ───────────────────────────────────────────────────────────

    constructor() ERC721("AI Model NFT", "AIMNFT") Ownable(msg.sender) {
        _nextTokenId = 1;
    }

    // ── External: Minting ─────────────────────────────────────────────────────

    /**
     * @notice Mint a new AI Model NFT.
     * @dev    The caller becomes the token owner; `creator` is stored
     *         separately so a backend signer can mint on behalf of a user.
     * @param  to          Address that will receive the token.
     * @param  creator     Address of the actual AI model author.
     * @param  metadataURI Full IPFS URI (e.g. "ipfs://Qm…") pointing to metadata JSON.
     * @param  cid         Raw IPFS CID of the model file.
     * @param  version     Semantic version string (e.g. "1.0.0").
     * @return tokenId     The ID of the newly minted token.
     */
    function mint(
        address to,
        address creator,
        string calldata metadataURI,
        string calldata cid,
        string calldata version
    ) external nonReentrant returns (uint256 tokenId) {
        if (mintingPaused && msg.sender != owner()) revert MintingPaused();
        if (to == address(0)) revert ZeroAddress();
        if (creator == address(0)) revert ZeroAddress();
        if (bytes(metadataURI).length == 0) revert EmptyMetadataURI();
        if (bytes(cid).length == 0) revert EmptyCID();
        if (bytes(version).length == 0) revert EmptyVersion();

        tokenId = _nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);

        _modelData[tokenId] = ModelData({
            metadataURI: metadataURI,
            cid: cid,
            creator: creator,
            version: version,
            mintedAt: block.timestamp
        });

        emit ModelMinted(tokenId, creator, metadataURI, cid, version);
    }

    // ── External: Views ───────────────────────────────────────────────────────

    /**
     * @notice Returns the on-chain model data for a given token ID.
     * @dev    Reverts with ERC721NonexistentToken if `tokenId` has not been minted.
     */
    function getModelData(uint256 tokenId) external view returns (ModelData memory) {
        // ERC721URIStorage._requireOwned reverts if the token does not exist
        _requireOwned(tokenId);
        return _modelData[tokenId];
    }

    /// @notice Returns the total number of tokens minted so far.
    function totalMinted() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    // ── Owner: Admin ──────────────────────────────────────────────────────────

    /**
     * @notice Pause or unpause public minting.
     * @dev    When paused, only the contract owner can call `mint`.
     */
    function setMintingPaused(bool paused) external onlyOwner {
        mintingPaused = paused;
        emit MintingStatusChanged(paused);
    }
}
