import { Test, type TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../database/redis.service';

const mockPrismaService = {
  aIModel: { count: jest.fn() },
  modelVersion: { count: jest.fn(), findMany: jest.fn() },
  user: { count: jest.fn() },
  inferenceLog: { count: jest.fn() },
  rating: { aggregate: jest.fn() },
  category: { findMany: jest.fn() },
};

const mockRedisService = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  del: jest.fn().mockResolvedValue(undefined),
};

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
      ],
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
      mockPrismaService.user.count.mockResolvedValue(5); // Active creators check will also return 5
      mockPrismaService.inferenceLog.count.mockResolvedValue(100);
      mockPrismaService.rating.aggregate.mockResolvedValue({
        _avg: { value: 4.56 },
      });
      mockPrismaService.category.findMany.mockResolvedValue([
        { name: 'NLP', models: [{}, {}] },
        { name: 'Vision', models: [{}] },
      ]);
      mockPrismaService.modelVersion.findMany.mockResolvedValue([
        {
          version: '1.0.0',
          createdAt: new Date('2026-06-27T12:00:00.000Z'),
          model: {
            id: 'm1',
            title: 'Model 1',
            owner: { username: 'user1' },
          },
        },
      ]);

      const result = await service.getDashboardAnalytics();
      expect(result).toEqual({
        totalModels: 10,
        totalNftModels: 8,
        totalUsers: 5,
        totalInferences: 100,
        averageRating: 4.6,
        activeCreators: 5,
        topCategories: [
          { name: 'NLP', count: 2 },
          { name: 'Vision', count: 1 },
        ],
        recentUploads: [
          {
            modelId: 'm1',
            title: 'Model 1',
            version: '1.0.0',
            creator: 'user1',
            createdAt: '2026-06-27T12:00:00.000Z',
          },
        ],
      });
    });
  });
});
