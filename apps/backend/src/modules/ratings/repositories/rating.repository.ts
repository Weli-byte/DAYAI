import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class RatingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(modelId: string, userId: string, value: number) {
    return this.prisma.rating.upsert({
      where: {
        modelId_userId: {
          modelId,
          userId,
        },
      },
      update: {
        value,
      },
      create: {
        modelId,
        userId,
        value,
      },
    });
  }

  async getSummary(modelId: string) {
    const aggregate = await this.prisma.rating.aggregate({
      where: { modelId },
      _avg: {
        value: true,
      },
      _count: {
        value: true,
      },
    });

    return {
      average: aggregate._avg.value ? parseFloat(aggregate._avg.value.toFixed(1)) : 0,
      count: aggregate._count.value,
    };
  }

  async getUserRating(modelId: string, userId: string) {
    return this.prisma.rating.findUnique({
      where: {
        modelId_userId: {
          modelId,
          userId,
        },
      },
    });
  }
}
