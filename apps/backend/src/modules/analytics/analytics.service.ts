import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PrismaService } from '../database/prisma.service';
import type { DashboardAnalyticsDto } from './dto/dashboard-analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardAnalytics(): Promise<DashboardAnalyticsDto> {
    const [totalModels, totalNftModels, totalUsers, totalInferences, avgRating] = await Promise.all(
      [
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
      ],
    );

    const averageRating = avgRating._avg.value ? parseFloat(avgRating._avg.value.toFixed(1)) : 0;

    return {
      totalModels,
      totalNftModels,
      totalUsers,
      totalInferences,
      averageRating,
    };
  }

  async logEvent(eventType: string, modelId?: string, userId?: string) {
    return this.prisma.analyticsEvent.create({
      data: {
        eventType,
        modelId,
        userId,
      },
    });
  }
}
