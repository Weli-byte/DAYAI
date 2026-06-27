import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { type ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { AI_MODEL_NFT_ABI } from '../../../shared/abis/AIModelNFT';

export interface MintResult {
  tokenId: string;
  txHash: string;
}

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);

  constructor(private readonly config: ConfigService) {}

  private buildProvider(): ethers.JsonRpcProvider {
    const rpcUrl = this.config.getOrThrow<string>('MONAD_RPC_URL');
    return new ethers.JsonRpcProvider(rpcUrl);
  }

  private buildSigner(): ethers.Wallet {
    const privateKey = this.config.getOrThrow<string>('BACKEND_PRIVATE_KEY');
    const provider = this.buildProvider();
    return new ethers.Wallet(privateKey, provider);
  }

  private getContractAddress(): string {
    return this.config.getOrThrow<string>('NFT_CONTRACT_ADDRESS');
  }

  /**
   * Mint a new AIModelNFT on-chain.
   * The backend signer calls the contract; `toAddress` receives the token.
   */
  async mintNFT(params: {
    toAddress: string;
    creatorAddress: string;
    metadataUri: string;
    cid: string;
    version: string;
  }): Promise<MintResult> {
    this.logger.log(
      `Minting NFT for creator=${params.creatorAddress} to=${params.toAddress} version=${params.version}`,
    );

    const signer = this.buildSigner();
    const contract = new ethers.Contract(this.getContractAddress(), AI_MODEL_NFT_ABI, signer);

    try {
      const tx: ethers.ContractTransactionResponse = await contract.mint(
        params.toAddress,
        params.creatorAddress,
        params.metadataUri,
        params.cid,
        params.version,
      );

      this.logger.log(`Mint tx submitted: ${tx.hash}`);
      const receipt = await tx.wait();

      if (!receipt) {
        throw new InternalServerErrorException('Mint transaction receipt is null');
      }

      // Parse the ModelMinted event to extract the tokenId
      const iface = new ethers.Interface(AI_MODEL_NFT_ABI as ethers.InterfaceAbi);
      let tokenId = '0';

      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog({ topics: [...log.topics], data: log.data });
          if (parsed?.name === 'ModelMinted') {
            tokenId = parsed.args[0].toString() as string;
            break;
          }
        } catch {
          // skip unparsable logs
        }
      }

      this.logger.log(`NFT minted — tokenId=${tokenId}, txHash=${receipt.hash}`);
      return { tokenId, txHash: receipt.hash };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Mint failed: ${message}`);
      throw new InternalServerErrorException(`Blockchain mint failed: ${message}`);
    }
  }

  /** Fetch on-chain data for a given tokenId. */
  async getModelData(tokenId: string) {
    const provider = this.buildProvider();
    const contract = new ethers.Contract(this.getContractAddress(), AI_MODEL_NFT_ABI, provider);

    const data = await contract.getModelData(BigInt(tokenId));
    return {
      metadataURI: data.metadataURI as string,
      cid: data.cid as string,
      creator: data.creator as string,
      version: data.version as string,
      mintedAt: new Date(Number(data.mintedAt) * 1000),
    };
  }
}
