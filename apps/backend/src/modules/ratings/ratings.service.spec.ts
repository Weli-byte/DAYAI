import { Test, type TestingModule } from '@nestjs/testing';
import { RatingsService } from './ratings.service';
import { RatingRepository } from './repositories/rating.repository';
import { ProfilesService } from '../profiles/profiles.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockRatingRepository = {
  upsert: jest.fn(),
  getSummary: jest.fn(),
  getUserRating: jest.fn(),
};

const mockProfilesService = {
  getOrCreateUserByWallet: jest.fn(),
};

const mockPrismaService = {
  aIModel: {
    findUnique: jest.fn(),
  },
};

describe('RatingsService', () => {
  let service: RatingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingsService,
        { provide: RatingRepository, useValue: mockRatingRepository },
        { provide: ProfilesService, useValue: mockProfilesService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<RatingsService>(RatingsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('rateModel', () => {
    it('rates model successfully when model exists', async () => {
      const dto = { modelId: 'm1', walletAddress: '0x123', value: 5 };
      mockPrismaService.aIModel.findUnique.mockResolvedValue({ id: 'm1' });
      mockProfilesService.getOrCreateUserByWallet.mockResolvedValue({ id: 'u1' });
      mockRatingRepository.upsert.mockResolvedValue({ id: 'r1', value: 5 });

      const result = await service.rateModel(dto);
      expect(result).toEqual({ id: 'r1', value: 5 });
      expect(mockRatingRepository.upsert).toHaveBeenCalledWith('m1', 'u1', 5);
    });

    it('throws NotFoundException when model does not exist', async () => {
      mockPrismaService.aIModel.findUnique.mockResolvedValue(null);
      await expect(
        service.rateModel({ modelId: 'm1', walletAddress: '0x123', value: 5 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getRatingSummary', () => {
    it('returns rating summary when model exists', async () => {
      mockPrismaService.aIModel.findUnique.mockResolvedValue({ id: 'm1' });
      mockRatingRepository.getSummary.mockResolvedValue({ average: 4.5, count: 10 });

      const result = await service.getRatingSummary('m1');
      expect(result).toEqual({ average: 4.5, count: 10 });
    });
  });
});
