import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PrismaService } from '../../database/prisma.service';

const MODEL_SELECT = {
  id: true,
  title: true,
  description: true,
  framework: true,
  status: true,
  license: true,
  createdAt: true,
  updatedAt: true,
  owner: {
    select: {
      id: true,
      username: true,
      avatar: true,
    },
  },
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  },
  versions: {
    where: { isLatest: true },
    select: {
      id: true,
      version: true,
      createdAt: true,
    },
  },
} as const;

@Injectable()
export class FavoriteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async add(modelId: string, userId: string) {
    return this.prisma.favorite.upsert({
      where: {
        modelId_userId: {
          modelId,
          userId,
        },
      },
      update: {},
      create: {
        modelId,
        userId,
      },
    });
  }

  async remove(modelId: string, userId: string) {
    return this.prisma.favorite.delete({
      where: {
        modelId_userId: {
          modelId,
          userId,
        },
      },
    });
  }

  async findManyByUser(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.favorite.findMany({
        where: { userId },
        include: {
          model: {
            select: MODEL_SELECT,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.favorite.count({
        where: { userId },
      }),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async isFavorite(modelId: string, userId: string): Promise<boolean> {
    const fav = await this.prisma.favorite.findUnique({
      where: {
        modelId_userId: {
          modelId,
          userId,
        },
      },
    });
    return !!fav;
  }
}
