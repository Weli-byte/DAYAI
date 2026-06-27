import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';
import { type PrismaService } from '../../database/prisma.service';
import type { QueryModelDto } from '../dto/query-model.dto';
import type { Framework, ModelStatus } from '../../common/types/enums';

// Shape of model data returned from every query (relations included)
export interface ModelWithRelations {
  id: string;
  title: string;
  description: string | null;
  framework: string;
  status: string;
  license: string | null;
  ownerId: string;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  owner: { id: string; username: string; avatar: string | null };
  category: { id: string; name: string; slug: string } | null;
  tags: Array<{ tag: { id: string; name: string; slug: string } }>;
  versions: Array<{
    id: string;
    version: string;
    changelog: string | null;
    isLatest: boolean;
    createdAt: Date;
  }>;
}

const MODEL_INCLUDE = {
  owner: { select: { id: true, username: true, avatar: true } },
  category: { select: { id: true, name: true, slug: true } },
  tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
  versions: {
    where: { isLatest: true },
    select: { id: true, version: true, changelog: true, isLatest: true, createdAt: true },
    take: 1,
  },
} as const;

@Injectable()
export class ModelRepository {
  constructor(private readonly prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildWhere(query: QueryModelDto): Record<string, any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = { deletedAt: null };

    if (query.search) {
      where['OR'] = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.framework) where['framework'] = query.framework;
    if (query.status) where['status'] = query.status;
    if (query.categoryId) where['categoryId'] = query.categoryId;
    if (query.tagId) where['tags'] = { some: { tagId: query.tagId } };

    return where;
  }

  async findMany(query: QueryModelDto): Promise<{
    data: ModelWithRelations[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const orderBy = { [query.sortBy ?? 'createdAt']: query.sortOrder ?? 'desc' };
    const where = this.buildWhere(query);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.aIModel.findMany({
        where,
        include: MODEL_INCLUDE,
        orderBy,
        skip,
        take: limit,
      }) as Prisma.PrismaPromise<ModelWithRelations[]>,
      this.prisma.aIModel.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<ModelWithRelations | null> {
    return (await this.prisma.aIModel.findFirst({
      where: { id, deletedAt: null },
      include: MODEL_INCLUDE,
    })) as ModelWithRelations | null;
  }

  async create(data: {
    title: string;
    description?: string;
    framework?: string;
    status?: string;
    license?: string;
    ownerId: string;
    categoryId?: string;
    tagIds?: string[];
  }): Promise<ModelWithRelations> {
    const { tagIds, framework, status, ...rest } = data;

    return (await this.prisma.aIModel.create({
      data: {
        ...rest,
        ...(framework && { framework: framework as Framework }),
        ...(status && { status: status as ModelStatus }),
        tags: tagIds?.length ? { create: tagIds.map((tagId) => ({ tagId })) } : undefined,
      },
      include: MODEL_INCLUDE,
    })) as ModelWithRelations;
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      framework?: string;
      status?: string;
      license?: string;
      categoryId?: string | null;
      tagIds?: string[];
    },
  ): Promise<ModelWithRelations> {
    const { tagIds, framework, status, categoryId, ...rest } = data;

    return (await this.prisma.aIModel.update({
      where: { id },
      data: {
        ...rest,
        ...(framework !== undefined && { framework: framework as Framework }),
        ...(status !== undefined && { status: status as ModelStatus }),
        ...(categoryId !== undefined && { categoryId }),
        ...(tagIds !== undefined && {
          tags: {
            deleteMany: {},
            create: tagIds.map((tagId) => ({ tagId })),
          },
        }),
      },
      include: MODEL_INCLUDE,
    })) as ModelWithRelations;
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.aIModel.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
