import { Test, type TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ModelsService } from './models.service';
import { ModelRepository } from './repositories/model.repository';

// ── Test factory ──────────────────────────────────────────────────────────────

function makeModel(overrides: Record<string, unknown> = {}) {
  return {
    id: 'model_1',
    title: 'Test Model',
    description: 'A test model',
    framework: 'PYTORCH',
    status: 'PUBLISHED',
    license: 'MIT',
    ownerId: 'user_1',
    categoryId: 'cat_1',
    owner: { id: 'user_1', username: 'alice', avatar: null },
    category: { id: 'cat_1', name: 'Classification', slug: 'classification' },
    tags: [{ tag: { id: 'tag_1', name: 'pytorch', slug: 'pytorch' } }],
    versions: [
      { id: 'v1', version: '1.0.0', changelog: 'Init', isLatest: true, createdAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ModelsService', () => {
  let service: ModelsService;

  const mockRepo = {
    findMany: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelsService, { provide: ModelRepository, useValue: mockRepo }],
    }).compile();

    service = module.get<ModelsService>(ModelsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns paginated models', async () => {
      mockRepo.findMany.mockResolvedValue({ data: [makeModel()], total: 1, page: 1, limit: 20 });

      const result = await service.findAll({});

      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Test Model');
    });

    it('calculates totalPages correctly', async () => {
      mockRepo.findMany.mockResolvedValue({ data: [], total: 45, page: 1, limit: 20 });

      const result = await service.findAll({ limit: 20 });

      expect(result.totalPages).toBe(3);
    });
  });

  describe('findOne', () => {
    it('returns a model DTO when found', async () => {
      mockRepo.findById.mockResolvedValue(makeModel());

      const result = await service.findOne('model_1');

      expect(result.id).toBe('model_1');
      expect(result.framework).toBe('PYTORCH');
    });

    it('throws NotFoundException when not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.findOne('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('creates a model and returns DTO', async () => {
      mockRepo.create.mockResolvedValue(makeModel());

      const result = await service.create({ title: 'Test Model', ownerId: 'user_1' });

      expect(result.title).toBe('Test Model');
      expect(mockRepo.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('updates a model and returns DTO', async () => {
      mockRepo.findById.mockResolvedValue(makeModel());
      mockRepo.update.mockResolvedValue(makeModel({ title: 'Updated Model' }));

      const result = await service.update('model_1', { title: 'Updated Model' });

      expect(result.title).toBe('Updated Model');
    });

    it('throws NotFoundException when model does not exist', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.update('missing', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('soft-deletes a model', async () => {
      mockRepo.findById.mockResolvedValue(makeModel());
      mockRepo.softDelete.mockResolvedValue(undefined);

      await expect(service.remove('model_1')).resolves.toBeUndefined();
      expect(mockRepo.softDelete).toHaveBeenCalledWith('model_1');
    });

    it('throws NotFoundException when model does not exist', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
