import { Injectable } from '@nestjs/common';
import { type PrismaService } from '../database/prisma.service';
import { type RedisService } from '../database/redis.service';
import type { DashboardAnalyticsDto } from './dto/dashboard-analytics.dto';

@Injectable()
export class AnalyticsService {
  private readonly CACHE_KEY = 'dashboard:analytics';
  private readonly CACHE_TTL = 30; // 30 seconds cache for dashboard

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getDashboardAnalytics(): Promise<DashboardAnalyticsDto> {
    // 1. Try to fetch from Redis cache
    try {
      const cached = await this.redis.get<DashboardAnalyticsDto>(this.CACHE_KEY);
      if (cached) {
        return cached;
      }
    } catch {
      // Ignore cache retrieval errors
    }

    // 2. Fetch fresh data from DB
    const [
      totalModels,
      totalNftModels,
      totalUsers,
      totalInferences,
      avgRating,
      activeCreators,
      categoriesData,
      recentUploadsData,
    ] = await Promise.all([
      this.prisma.aIModel.count({
        where: { deletedAt: null },
      }),
      this.prisma.modelVersion.count({
        where: {
          nftTokenId: {
            not: null,
          },
        },
      }),
      this.prisma.user.count({
        where: { deletedAt: null },
      }),
      this.prisma.inferenceLog.count(),
      this.prisma.rating.aggregate({
        _avg: {
          value: true,
        },
      }),
      // Active creators: users who published at least one model
      this.prisma.user.count({
        where: {
          deletedAt: null,
          models: {
            some: {
              status: 'PUBLISHED',
              deletedAt: null,
            },
          },
        },
      }),
      // Top categories
      this.prisma.category.findMany({
        select: {
          name: true,
          models: {
            where: { deletedAt: null },
          },
        },
      }),
      // Recent uploads
      this.prisma.modelVersion.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          version: true,
          createdAt: true,
          model: {
            select: {
              id: true,
              title: true,
              owner: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const averageRating = avgRating._avg.value ? parseFloat(avgRating._avg.value.toFixed(1)) : 0;

    const topCategories = categoriesData
      .map((c) => ({
        name: c.name,
        count: c.models.length,
      }))
      .sort((a, b) => b.count - a.count);

    const recentUploads = recentUploadsData.map((v) => ({
      modelId: v.model.id,
      title: v.model.title,
      version: v.version,
      creator: v.model.owner.username,
      createdAt: v.createdAt.toISOString(),
    }));

    const result: DashboardAnalyticsDto = {
      totalModels,
      totalNftModels,
      totalUsers,
      totalInferences,
      averageRating,
      activeCreators,
      topCategories,
      recentUploads,
    };

    // 3. Cache the result in Redis
    try {
      await this.redis.set(this.CACHE_KEY, result, this.CACHE_TTL);
    } catch {
      // Ignore cache write errors
    }

    return result;
  }

  async logEvent(eventType: string, modelId?: string, userId?: string) {
    // Invalidate dashboard cache on new events
    try {
      await this.redis.del(this.CACHE_KEY);
    } catch {
      // Ignore cache invalidation errors
    }

    return this.prisma.analyticsEvent.create({
      data: {
        eventType,
        modelId,
        userId,
      },
    });
  }
}
