import { NotFoundException, ConflictException } from '@nestjs/common';
import { TagsService } from './tags.service';

const mockPrisma = {
  tag: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

function makeTag(overrides: Record<string, unknown> = {}) {
  return {
    id: 'tag_1',
    name: 'pytorch',
    slug: 'pytorch',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('TagsService', () => {
  let service: TagsService;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new TagsService(mockPrisma as any);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns all tags', async () => {
      mockPrisma.tag.findMany.mockResolvedValue([
        makeTag(),
        makeTag({ id: 'tag_2', name: 'bert', slug: 'bert' }),
      ]);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('returns the tag when found', async () => {
      mockPrisma.tag.findUnique.mockResolvedValue(makeTag());

      const result = await service.findOne('tag_1');

      expect(result.slug).toBe('pytorch');
    });

    it('throws NotFoundException when not found', async () => {
      mockPrisma.tag.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('creates a tag', async () => {
      mockPrisma.tag.findUnique.mockResolvedValue(null);
      mockPrisma.tag.create.mockResolvedValue(makeTag());

      const result = await service.create({ name: 'pytorch', slug: 'pytorch' });

      expect(result.name).toBe('pytorch');
    });

    it('throws ConflictException when slug exists', async () => {
      mockPrisma.tag.findUnique.mockResolvedValue(makeTag());

      await expect(service.create({ name: 'pytorch', slug: 'pytorch' })).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
