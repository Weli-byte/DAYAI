import { Test, type TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UploadService } from './upload.service';
import { IPFSService } from './ipfs.service';
import { MetadataService } from './metadata.service';
import { BlockchainService } from './blockchain.service';
import { PrismaService } from '../../database/prisma.service';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeFile(overrides: Partial<Express.Multer.File> = {}): Express.Multer.File {
  return {
    fieldname: 'file',
    originalname: 'model.pt',
    encoding: '7bit',
    mimetype: 'application/octet-stream',
    buffer: Buffer.from('fake-model-data'),
    size: 1024,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stream: null as any,
    destination: '',
    filename: '',
    path: '',
    ...overrides,
  };
}

const DTO = {
  modelId: 'model_1',
  version: '1.0.0',
  walletAddress: '0xabc123',
};

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockPrisma = {
  aIModel: {
    findFirst: jest.fn(),
    update: jest.fn(),
  },
  modelVersion: {
    create: jest.fn(),
    updateMany: jest.fn(),
  },
  uploadJob: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
  },
};

const mockIPFS = {
  uploadFile: jest.fn().mockResolvedValue('QmFileCID'),
  uploadJson: jest.fn().mockResolvedValue('QmMetaCID'),
  buildIpfsUri: jest.fn((cid: string) => `ipfs://${cid}`),
  buildGatewayUrl: jest.fn((cid: string) => `https://gateway/ipfs/${cid}`),
};

const mockMetadata = {
  build: jest.fn().mockReturnValue({ name: 'Test', version: '1.0.0' }),
};

const mockBlockchain = {
  mintNFT: jest.fn().mockResolvedValue({ tokenId: '1', txHash: '0xabc' }),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: IPFSService, useValue: mockIPFS },
        { provide: MetadataService, useValue: mockMetadata },
        { provide: BlockchainService, useValue: mockBlockchain },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
    jest.clearAllMocks();
  });

  // ── validateFile ──────────────────────────────────────────────────────────

  describe('validateFile', () => {
    it('passes for a valid .pt file under size limit', () => {
      expect(() => service.validateFile(makeFile())).not.toThrow();
    });

    it('passes for .onnx, .gguf, .safetensors, .pth extensions', () => {
      for (const ext of ['onnx', 'gguf', 'safetensors', 'pth']) {
        expect(() =>
          service.validateFile(makeFile({ originalname: `model.${ext}` })),
        ).not.toThrow();
      }
    });

    it('rejects files larger than 500 MB', () => {
      expect(() => service.validateFile(makeFile({ size: 501 * 1024 * 1024 }))).toThrow(
        BadRequestException,
      );
    });

    it('rejects unsupported extensions', () => {
      expect(() => service.validateFile(makeFile({ originalname: 'model.zip' }))).toThrow(
        BadRequestException,
      );
    });

    it('rejects files with no extension', () => {
      expect(() => service.validateFile(makeFile({ originalname: 'modelfile' }))).toThrow(
        BadRequestException,
      );
    });
  });

  // ── uploadAndMint ─────────────────────────────────────────────────────────

  describe('uploadAndMint', () => {
    const mockModel = {
      id: 'model_1',
      title: 'Test Model',
      description: 'desc',
      framework: 'PYTORCH',
      license: 'MIT',
      owner: { username: 'alice' },
      tags: [{ tag: { name: 'pytorch' } }],
    };

    beforeEach(() => {
      mockPrisma.aIModel.findFirst.mockResolvedValue(mockModel);
      mockPrisma.uploadJob.create.mockResolvedValue({ id: 'job_1' });
      mockPrisma.uploadJob.update.mockResolvedValue({});
      mockPrisma.modelVersion.updateMany.mockResolvedValue({});
      mockPrisma.modelVersion.create.mockResolvedValue({ id: 'ver_1' });
      mockPrisma.aIModel.update.mockResolvedValue({});
    });

    it('returns MintResponseDto on success', async () => {
      const result = await service.uploadAndMint(makeFile(), DTO);

      expect(result.fileCid).toBe('QmFileCID');
      expect(result.metadataCid).toBe('QmMetaCID');
      expect(result.nftTokenId).toBe('1');
      expect(result.txHash).toBe('0xabc');
      expect(result.jobId).toBe('job_1');
    });

    it('calls IPFS uploadFile and uploadJson', async () => {
      await service.uploadAndMint(makeFile(), DTO);

      expect(mockIPFS.uploadFile).toHaveBeenCalledTimes(1);
      expect(mockIPFS.uploadJson).toHaveBeenCalledTimes(1);
    });

    it('calls blockchain mintNFT with correct params', async () => {
      await service.uploadAndMint(makeFile(), DTO);

      expect(mockBlockchain.mintNFT).toHaveBeenCalledWith({
        toAddress: DTO.walletAddress,
        creatorAddress: DTO.walletAddress,
        metadataUri: 'ipfs://QmMetaCID',
        cid: 'QmFileCID',
        version: DTO.version,
      });
    });

    it('throws NotFoundException when model does not exist', async () => {
      mockPrisma.aIModel.findFirst.mockResolvedValue(null);

      await expect(service.uploadAndMint(makeFile(), DTO)).rejects.toThrow(NotFoundException);
    });

    it('marks job as FAILED when mint throws', async () => {
      mockBlockchain.mintNFT.mockRejectedValueOnce(new Error('RPC error'));

      await expect(service.uploadAndMint(makeFile(), DTO)).rejects.toThrow('RPC error');
      expect(mockPrisma.uploadJob.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'FAILED' }),
        }),
      );
    });
  });

  // ── getJobStatus ──────────────────────────────────────────────────────────

  describe('getJobStatus', () => {
    it('returns job data for valid jobId', async () => {
      const now = new Date();
      mockPrisma.uploadJob.findUnique.mockResolvedValue({
        id: 'job_1',
        status: 'COMPLETED',
        stage: 'DONE',
        fileCid: 'QmFileCID',
        metadataCid: 'QmMetaCID',
        nftTokenId: '1',
        txHash: '0xabc',
        errorMessage: null,
        createdAt: now,
        updatedAt: now,
      });

      const result = await service.getJobStatus('job_1');
      expect(result.status).toBe('COMPLETED');
      expect(result.nftTokenId).toBe('1');
    });

    it('throws NotFoundException for unknown jobId', async () => {
      mockPrisma.uploadJob.findUnique.mockResolvedValue(null);

      await expect(service.getJobStatus('unknown')).rejects.toThrow(NotFoundException);
    });
  });
});
