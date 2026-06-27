import { Injectable } from '@nestjs/common';
import { InferenceStatus, type Prisma } from '@prisma/client';
import { type PrismaService } from '../../database/prisma.service';
import type { QueryInferenceHistoryDto } from '../dto/inference-history.dto';

export interface InferenceLogWithModel {
  id: string;
  modelId: string;
  walletAddress: string;
  prompt: string;
  output: string | null;
  status: InferenceStatus;
  tokensUsed: number | null;
  inferenceTimeMs: number | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
  model: { title: string };
}

const INFERENCE_INCLUDE = {
  model: { select: { title: true } },
} as const;

@Injectable()
export class InferenceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    modelId: string;
    walletAddress: string;
    prompt: string;
  }): Promise<InferenceLogWithModel> {
    return (await this.prisma.inferenceLog.create({
      data: {
        modelId: data.modelId,
        walletAddress: data.walletAddress,
        prompt: data.prompt,
        status: InferenceStatus.PENDING,
      },
      include: INFERENCE_INCLUDE,
    })) as InferenceLogWithModel;
  }

  async findById(id: string): Promise<InferenceLogWithModel | null> {
    return (await this.prisma.inferenceLog.findUnique({
      where: { id },
      include: INFERENCE_INCLUDE,
    })) as InferenceLogWithModel | null;
  }

  async findManyByWallet(query: QueryInferenceHistoryDto): Promise<{
    data: InferenceLogWithModel[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.InferenceLogWhereInput = {
      walletAddress: query.walletAddress,
      ...(query.modelId && { modelId: query.modelId }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.inferenceLog.findMany({
        where,
        include: INFERENCE_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }) as Prisma.PrismaPromise<InferenceLogWithModel[]>,
      this.prisma.inferenceLog.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async updateStatus(
    id: string,
    status: InferenceStatus,
    data?: {
      output?: string;
      tokensUsed?: number;
      inferenceTimeMs?: number;
      errorMessage?: string;
    },
  ): Promise<InferenceLogWithModel> {
    return (await this.prisma.inferenceLog.update({
      where: { id },
      data: {
        status,
        ...(data?.output !== undefined && { output: data.output }),
        ...(data?.tokensUsed !== undefined && { tokensUsed: data.tokensUsed }),
        ...(data?.inferenceTimeMs !== undefined && { inferenceTimeMs: data.inferenceTimeMs }),
        ...(data?.errorMessage !== undefined && { errorMessage: data.errorMessage }),
      },
      include: INFERENCE_INCLUDE,
    })) as InferenceLogWithModel;
  }
}
