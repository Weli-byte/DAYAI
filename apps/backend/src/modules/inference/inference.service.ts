import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InferenceStatus } from '@prisma/client';
import { type PrismaService } from '../database/prisma.service';
import { type AiServiceClient } from './clients/ai-service.client';
import {
  type InferenceRepository,
  type InferenceLogWithModel,
} from './repositories/inference.repository';
import { type RunInferenceDto } from './dto/run-inference.dto';
import { type InferenceResultDto } from './dto/inference-result.dto';
import {
  type QueryInferenceHistoryDto,
  type PaginatedInferenceHistoryDto,
  type InferenceHistoryItemDto,
} from './dto/inference-history.dto';

@Injectable()
export class InferenceService {
  private readonly logger = new Logger(InferenceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiServiceClient: AiServiceClient,
    private readonly inferenceRepository: InferenceRepository,
  ) {}

  async runInference(dto: RunInferenceDto): Promise<InferenceResultDto> {
    this.logger.log(`Initiating inference for model ${dto.modelId} by wallet ${dto.walletAddress}`);

    // 1. Verify model exists
    const model = await this.prisma.aIModel.findUnique({
      where: { id: dto.modelId, deletedAt: null },
    });

    if (!model) {
      this.logger.warn(`Model not found for inference: ${dto.modelId}`);
      throw new NotFoundException(`Model with ID '${dto.modelId}' not found.`);
    }

    // 2. Create PENDING log entry
    const log = await this.inferenceRepository.create({
      modelId: dto.modelId,
      walletAddress: dto.walletAddress,
      prompt: dto.prompt,
    });

    try {
      // 3. Update status to PROCESSING
      await this.inferenceRepository.updateStatus(log.id, InferenceStatus.PROCESSING);

      // 4. Call AI Service client
      const response = await this.aiServiceClient.runInference(
        dto.modelId,
        dto.prompt,
        dto.maxTokens,
        dto.temperature,
      );

      // 5. Update status to COMPLETED with output and metrics
      const updatedLog = await this.inferenceRepository.updateStatus(
        log.id,
        InferenceStatus.COMPLETED,
        {
          output: response.output,
          tokensUsed: response.tokens_used,
          inferenceTimeMs: Math.round(response.inference_time_ms),
        },
      );

      return this.mapToResultDto(updatedLog);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.logger.error(`Inference execution failed for log ${log.id}: ${error.message}`);

      // 6. Update status to FAILED
      const errorMsg =
        error instanceof HttpException ? error.message : error.message || 'Unknown error';
      await this.inferenceRepository.updateStatus(log.id, InferenceStatus.FAILED, {
        errorMessage: errorMsg,
      });

      // Rethrow http exceptions, otherwise wrap in InternalServerErrorException
      if (error.status) {
        throw error;
      }
      throw new InternalServerErrorException(`Inference execution failed: ${errorMsg}`);
    }
  }

  async getHistory(query: QueryInferenceHistoryDto): Promise<PaginatedInferenceHistoryDto> {
    this.logger.log(`Fetching inference history for wallet ${query.walletAddress}`);

    const { data, total, page, limit } = await this.inferenceRepository.findManyByWallet(query);
    const totalPages = Math.ceil(total / limit);

    const items: InferenceHistoryItemDto[] = data.map((item) => ({
      id: item.id,
      modelId: item.modelId,
      modelTitle: item.model.title,
      prompt: item.prompt.length > 100 ? `${item.prompt.substring(0, 100)}...` : item.prompt,
      output: item.output
        ? item.output.length > 200
          ? `${item.output.substring(0, 200)}...`
          : item.output
        : null,
      status: item.status,
      tokensUsed: item.tokensUsed,
      inferenceTimeMs: item.inferenceTimeMs,
      createdAt: item.createdAt,
    }));

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getById(id: string): Promise<InferenceResultDto> {
    this.logger.log(`Fetching inference log details for ID ${id}`);

    const log = await this.inferenceRepository.findById(id);
    if (!log) {
      throw new NotFoundException(`Inference log with ID '${id}' not found.`);
    }

    return this.mapToResultDto(log);
  }

  private mapToResultDto(log: InferenceLogWithModel): InferenceResultDto {
    return {
      id: log.id,
      output: log.output,
      modelId: log.modelId,
      modelTitle: log.model.title,
      tokensUsed: log.tokensUsed,
      inferenceTimeMs: log.inferenceTimeMs,
      status: log.status,
      createdAt: log.createdAt,
    };
  }
}
