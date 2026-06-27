import { Test, type TestingModule } from '@nestjs/testing';
import { MetadataService } from './metadata.service';

describe('MetadataService', () => {
  let service: MetadataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetadataService],
    }).compile();

    service = module.get<MetadataService>(MetadataService);
  });

  const INPUT = {
    name: 'ResNet-20 Classifier',
    description: 'CIFAR-10 image classifier',
    framework: 'PYTORCH',
    version: '1.0.0',
    author: '0xabc123',
    license: 'MIT',
    tags: ['pytorch', 'classification'],
    fileCid: 'QmFileCID',
    fileSize: 5 * 1024 * 1024,
    sha256: 'abc123hash',
  };

  describe('build', () => {
    it('creates metadata with all required fields', () => {
      const meta = service.build(INPUT);
      expect(meta.name).toBe(INPUT.name);
      expect(meta.framework).toBe(INPUT.framework);
      expect(meta.version).toBe(INPUT.version);
      expect(meta.fileCid).toBe(INPUT.fileCid);
      expect(meta.sha256).toBe(INPUT.sha256);
      expect(meta.fileSize).toBe(INPUT.fileSize);
      expect(meta.tags).toEqual(INPUT.tags);
    });

    it('uses default license when not provided', () => {
      const meta = service.build({ ...INPUT, license: null });
      expect(meta.license).toBe('All rights reserved');
    });

    it('uses empty string description when not provided', () => {
      const meta = service.build({ ...INPUT, description: null });
      expect(meta.description).toBe('');
    });

    it('includes a valid ISO createdAt timestamp', () => {
      const meta = service.build(INPUT);
      expect(() => new Date(meta.createdAt)).not.toThrow();
    });
  });

  describe('toBuffer', () => {
    it('serializes metadata to a UTF-8 JSON buffer', () => {
      const meta = service.build(INPUT);
      const buf = service.toBuffer(meta);
      expect(Buffer.isBuffer(buf)).toBe(true);
      const parsed = JSON.parse(buf.toString('utf-8')) as typeof meta;
      expect(parsed.name).toBe(INPUT.name);
    });
  });
});
