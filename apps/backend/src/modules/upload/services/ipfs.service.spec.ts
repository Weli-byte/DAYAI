import { Test, type TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { IPFSService } from './ipfs.service';

// ── Mock fetch ────────────────────────────────────────────────────────────────

const mockFetch = jest.fn();
global.fetch = mockFetch;

function okResponse(body: object) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);
}

function errorResponse(status: number, body: string) {
  return Promise.resolve({
    ok: false,
    status,
    text: () => Promise.resolve(body),
  } as Response);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('IPFSService', () => {
  let service: IPFSService;

  const mockConfig = {
    getOrThrow: jest.fn().mockReturnValue('test-jwt-token'),
    get: jest.fn().mockReturnValue('https://gateway.pinata.cloud/ipfs'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IPFSService, { provide: ConfigService, useValue: mockConfig }],
    }).compile();

    service = module.get<IPFSService>(IPFSService);
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('returns the IPFS CID on success', async () => {
      mockFetch.mockReturnValueOnce(
        okResponse({ IpfsHash: 'QmTestCID', PinSize: 1024, Timestamp: '2024-01-01' }),
      );

      const cid = await service.uploadFile(
        Buffer.from('test'),
        'model.pt',
        'application/octet-stream',
      );
      expect(cid).toBe('QmTestCID');
    });

    it('throws InternalServerErrorException on Pinata error', async () => {
      mockFetch.mockReturnValueOnce(errorResponse(500, 'Internal Server Error'));

      await expect(
        service.uploadFile(Buffer.from('test'), 'model.pt', 'application/octet-stream'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('uploadJson', () => {
    it('returns the IPFS CID on success', async () => {
      mockFetch.mockReturnValueOnce(
        okResponse({ IpfsHash: 'QmMetaCID', PinSize: 256, Timestamp: '2024-01-01' }),
      );

      const cid = await service.uploadJson({ name: 'test' }, 'metadata');
      expect(cid).toBe('QmMetaCID');
    });

    it('throws InternalServerErrorException on Pinata error', async () => {
      mockFetch.mockReturnValueOnce(errorResponse(401, 'Unauthorized'));

      await expect(service.uploadJson({ name: 'test' }, 'metadata')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('buildIpfsUri', () => {
    it('returns ipfs:// URI', () => {
      expect(service.buildIpfsUri('QmABC')).toBe('ipfs://QmABC');
    });
  });

  describe('buildGatewayUrl', () => {
    it('returns gateway URL', () => {
      const url = service.buildGatewayUrl('QmABC');
      expect(url).toContain('QmABC');
    });
  });
});
