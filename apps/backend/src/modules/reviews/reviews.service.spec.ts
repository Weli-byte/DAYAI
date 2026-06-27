import { Test, type TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { ReviewRepository } from './repositories/review.repository';
import { ProfilesService } from '../profiles/profiles.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

const mockReviewRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findManyByModel: jest.fn(),
};

const mockProfilesService = {
  getOrCreateUserByWallet: jest.fn(),
};

const mockPrismaService = {
  aIModel: {
    findUnique: jest.fn(),
  },
};

describe('ReviewsService', () => {
  let service: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: ReviewRepository, useValue: mockReviewRepository },
        { provide: ProfilesService, useValue: mockProfilesService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates review successfully when model exists', async () => {
      const dto = { modelId: 'm1', walletAddress: '0x123', content: 'good model' };
      mockPrismaService.aIModel.findUnique.mockResolvedValue({ id: 'm1' });
      mockProfilesService.getOrCreateUserByWallet.mockResolvedValue({ id: 'u1' });
      mockReviewRepository.create.mockResolvedValue({
        id: 'r1',
        modelId: 'm1',
        content: 'good model',
        user: { id: 'u1', username: 'alice', profile: { walletAddress: '0x123' } },
      });

      const result = await service.create(dto);
      expect(result.id).toEqual('r1');
      expect(mockReviewRepository.create).toHaveBeenCalledWith('m1', 'u1', 'good model');
    });

    it('throws NotFoundException when model does not exist', async () => {
      mockPrismaService.aIModel.findUnique.mockResolvedValue(null);
      await expect(
        service.create({ modelId: 'm1', walletAddress: '0x123', content: 'good' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates review successfully when user is the author', async () => {
      const dto = { walletAddress: '0x123', content: 'updated content' };
      mockReviewRepository.findById.mockResolvedValue({ id: 'r1', userId: 'u1' });
      mockProfilesService.getOrCreateUserByWallet.mockResolvedValue({ id: 'u1' });
      mockReviewRepository.update.mockResolvedValue({
        id: 'r1',
        modelId: 'm1',
        content: 'updated content',
        user: { id: 'u1', username: 'alice', profile: { walletAddress: '0x123' } },
      });

      const result = await service.update('r1', dto);
      expect(result.content).toEqual('updated content');
    });

    it('throws ForbiddenException when user is not the author', async () => {
      const dto = { walletAddress: '0x456', content: 'updated content' };
      mockReviewRepository.findById.mockResolvedValue({ id: 'r1', userId: 'u1' });
      mockProfilesService.getOrCreateUserByWallet.mockResolvedValue({ id: 'u2' });

      await expect(service.update('r1', dto)).rejects.toThrow(ForbiddenException);
    });
  });
});
