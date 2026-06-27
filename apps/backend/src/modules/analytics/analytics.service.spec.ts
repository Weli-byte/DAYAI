import { Test, type TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../database/prisma.service';

const mockPrismaService = {
  aIModel: { count: jest.fn() },
  modelVersion: { count: jest.fn() },
  user: { count: jest.fn() },
  inferenceLog: { count: jest.fn() },
  rating: { aggregate: jest.fn() },
};

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboardAnalytics', () => {
    it('returns formatted analytics summary', async () => {
      mockPrismaService.aIModel.count.mockResolvedValue(10);
      mockPrismaService.modelVersion.count.mockResolvedValue(8);
      mockPrismaService.user.count.mockResolvedValue(5);
      mockPrismaService.inferenceLog.count.mockResolvedValue(100);
      mockPrismaService.rating.aggregate.mockResolvedValue({
        _avg: { value: 4.56 },
      });

      const result = await service.getDashboardAnalytics();
      expect(result).toEqual({
        totalModels: 10,
        totalNftModels: 8,
        totalUsers: 5,
        totalInferences: 100,
        averageRating: 4.6,
      });
    });
  });
});
