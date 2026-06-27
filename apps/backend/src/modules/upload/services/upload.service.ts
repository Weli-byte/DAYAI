import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { type PrismaService } from '../../database/prisma.service';
import { type IPFSService } from './ipfs.service';
import { type MetadataService } from './metadata.service';
import { type BlockchainService } from './blockchain.service';
import type { UploadModelDto } from '../dto/upload-model.dto';
import type { MintResponseDto, UploadJobResponseDto } from '../dto/upload-response.dto';

// 500 MB max
const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set(['.pt', '.pth', '.onnx', '.gguf', '.safetensors']);

const MIME_TO_EXT: Record<string, string> = {
  'application/octet-stream': '.bin',
  'application/x-pytorch': '.pt',
  'application/onnx': '.onnx',
};

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ipfs: IPFSService,
    private readonly metadata: MetadataService,
    private readonly blockchain: BlockchainService,
  ) {}

  // ── Validation ─────────────────────────────────────────────────────────────

  validateFile(file: Express.Multer.File): void {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        `File too large. Maximum allowed size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB.`,
      );
    }

    const ext = this.getExtension(file.originalname);
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      throw new BadRequestException(
        `Unsupported file type "${ext}". Allowed: ${[...ALLOWED_EXTENSIONS].join(', ')}.`,
      );
    }
  }

  private getExtension(filename: string): string {
    const parts = filename.toLowerCase().split('.');
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
  }

  private computeSha256(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  private getMimeType(file: Express.Multer.File): string {
    // Prefer detected MIME; fall back to octet-stream
    if (file.mimetype && file.mimetype !== 'application/octet-stream') return file.mimetype;
    const ext = this.getExtension(file.originalname);
    const mime = Object.entries(MIME_TO_EXT).find(([, e]) => e === ext)?.[0];
    return mime ?? 'application/octet-stream';
  }

  // ── Upload + Mint pipeline ─────────────────────────────────────────────────

  async uploadAndMint(file: Express.Multer.File, dto: UploadModelDto): Promise<MintResponseDto> {
    // Validate file
    this.validateFile(file);

    // Verify model exists
    const model = await this.prisma.aIModel.findFirst({
      where: { id: dto.modelId, deletedAt: null },
      include: {
        owner: { select: { username: true } },
        tags: { include: { tag: { select: { name: true } } } },
      },
    });
    if (!model) throw new NotFoundException(`Model "${dto.modelId}" not found.`);

    // Create job record
    const job = await this.prisma.uploadJob.create({
      data: { modelId: dto.modelId, status: 'PENDING', stage: 'VALIDATING' },
    });
    this.logger.log(`Upload job created: ${job.id}`);

    try {
      // ── Step 1: Compute SHA256 ───────────────────────────────────────────
      await this.updateJob(job.id, { status: 'UPLOADING_FILE', stage: 'COMPUTING_HASH' });
      const sha256 = this.computeSha256(file.buffer);
      const fileSize = file.size;
      this.logger.log(`SHA256: ${sha256}`);

      // ── Step 2: Upload model file to IPFS ───────────────────────────────
      await this.updateJob(job.id, { stage: 'UPLOADING_FILE_TO_IPFS' });
      const mimeType = this.getMimeType(file);
      const fileCid = await this.ipfs.uploadFile(file.buffer, file.originalname, mimeType);
      await this.updateJob(job.id, { fileCid, stage: 'FILE_UPLOADED' });

      // ── Step 3: Build + upload metadata JSON ────────────────────────────
      await this.updateJob(job.id, { status: 'UPLOADING_METADATA', stage: 'BUILDING_METADATA' });
      const metadataObj = this.metadata.build({
        name: model.title,
        description: model.description,
        framework: model.framework,
        version: dto.version,
        author: dto.walletAddress,
        license: model.license,
        tags: model.tags.map((t) => t.tag.name),
        fileCid,
        fileSize,
        sha256,
      });

      const metadataCid = await this.ipfs.uploadJson(metadataObj, `${model.title}_v${dto.version}`);
      const metadataUri = this.ipfs.buildIpfsUri(metadataCid);
      await this.updateJob(job.id, { metadataCid, stage: 'METADATA_UPLOADED' });

      // ── Step 4: Mint NFT ─────────────────────────────────────────────────
      await this.updateJob(job.id, { status: 'MINTING', stage: 'MINTING_NFT' });
      const { tokenId, txHash } = await this.blockchain.mintNFT({
        toAddress: dto.walletAddress,
        creatorAddress: dto.walletAddress,
        metadataUri,
        cid: fileCid,
        version: dto.version,
      });
      await this.updateJob(job.id, { nftTokenId: tokenId, txHash });

      // ── Step 5: Persist version record ───────────────────────────────────
      await this.updateJob(job.id, { stage: 'SAVING_VERSION' });

      // Unset previous latest
      await this.prisma.modelVersion.updateMany({
        where: { modelId: dto.modelId, isLatest: true },
        data: { isLatest: false },
      });

      const version = await this.prisma.modelVersion.create({
        data: {
          modelId: dto.modelId,
          version: dto.version,
          changelog: dto.changelog,
          fileCid,
          metadataCid,
          ipfsHash: fileCid, // backward compat alias
          fileSize: BigInt(fileSize),
          sha256,
          nftTokenId: tokenId,
          txHash,
          ownerAddress: dto.walletAddress,
          isLatest: true,
        },
      });

      // Mark model as published
      await this.prisma.aIModel.update({
        where: { id: dto.modelId },
        data: { status: 'PUBLISHED' },
      });

      await this.updateJob(job.id, { status: 'COMPLETED', stage: 'DONE', versionId: version.id });

      return {
        jobId: job.id,
        modelId: dto.modelId,
        versionId: version.id,
        fileCid,
        metadataCid,
        metadataUri,
        nftTokenId: tokenId,
        txHash,
        sha256,
        fileSize,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      await this.updateJob(job.id, { status: 'FAILED', errorMessage });
      throw err;
    }
  }

  async getJobStatus(jobId: string): Promise<UploadJobResponseDto> {
    const job = await this.prisma.uploadJob.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException(`Upload job "${jobId}" not found.`);

    return {
      jobId: job.id,
      status: job.status,
      stage: job.stage,
      fileCid: job.fileCid,
      metadataCid: job.metadataCid,
      nftTokenId: job.nftTokenId,
      txHash: job.txHash,
      errorMessage: job.errorMessage,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }

  private async updateJob(
    id: string,
    data: {
      status?: string;
      stage?: string;
      fileCid?: string;
      metadataCid?: string;
      nftTokenId?: string;
      txHash?: string;
      errorMessage?: string;
      versionId?: string;
    },
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.prisma.uploadJob.update({ where: { id }, data: data as any });
  }
}
