import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PrismaService } from '../../database/prisma.service';

const REVIEW_INCLUDE = {
  user: {
    select: {
      id: true,
      username: true,
      avatar: true,
      profile: {
        select: {
          walletAddress: true,
        },
      },
    },
  },
} as const;

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(modelId: string, userId: string, content: string) {
    return this.prisma.review.create({
      data: {
        modelId,
        userId,
        content,
      },
      include: REVIEW_INCLUDE,
    });
  }

  async findById(id: string) {
    return this.prisma.review.findUnique({
      where: { id },
      include: REVIEW_INCLUDE,
    });
  }

  async update(id: string, content: string) {
    return this.prisma.review.update({
      where: { id },
      data: { content },
      include: REVIEW_INCLUDE,
    });
  }

  async delete(id: string) {
    return this.prisma.review.delete({
      where: { id },
    });
  }

  async findManyByModel(modelId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where: { modelId },
        include: REVIEW_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({
        where: { modelId },
      }),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
