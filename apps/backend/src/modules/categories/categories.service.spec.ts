import { NotFoundException, ConflictException } from '@nestjs/common';
import { CategoriesService } from './categories.service';

const mockPrisma = {
  category: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

function makeCategory(overrides: Record<string, unknown> = {}) {
  return {
    id: 'cat_1',
    name: 'Classification',
    slug: 'classification',
    description: 'Image and text classifiers.',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new CategoriesService(mockPrisma as any);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns an array of categories', async () => {
      mockPrisma.category.findMany.mockResolvedValue([makeCategory()]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe('classification');
    });
  });

  describe('findOne', () => {
    it('returns the category when found', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(makeCategory());

      const result = await service.findOne('cat_1');

      expect(result.id).toBe('cat_1');
    });

    it('throws NotFoundException when not found', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('creates a category', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null);
      mockPrisma.category.create.mockResolvedValue(makeCategory());

      const result = await service.create({ name: 'Classification', slug: 'classification' });

      expect(result.name).toBe('Classification');
    });

    it('throws ConflictException when slug already exists', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(makeCategory());

      await expect(
        service.create({ name: 'Classification', slug: 'classification' }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
