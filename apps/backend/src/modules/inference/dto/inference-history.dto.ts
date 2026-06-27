import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { InferenceStatus } from '@prisma/client';

export class QueryInferenceHistoryDto {
  @ApiProperty({ description: 'User wallet address' })
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @ApiPropertyOptional({ description: 'Filter by model ID' })
  @IsOptional()
  @IsString()
  modelId?: string;

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class InferenceHistoryItemDto {
  @ApiProperty({ description: 'Inference log ID' })
  id: string;

  @ApiProperty({ description: 'Model ID' })
  modelId: string;

  @ApiProperty({ description: 'Model title' })
  modelTitle: string;

  @ApiProperty({ description: 'Input prompt (first 100 characters)' })
  prompt: string;

  @ApiProperty({ description: 'Model output (first 200 characters)', nullable: true })
  output: string | null;

  @ApiProperty({ enum: InferenceStatus, description: 'Inference status' })
  status: InferenceStatus;

  @ApiProperty({ description: 'Tokens used', nullable: true })
  tokensUsed: number | null;

  @ApiProperty({ description: 'Inference time in ms', nullable: true })
  inferenceTimeMs: number | null;

  @ApiProperty({ description: 'Execution timestamp' })
  createdAt: Date;
}

export class PaginatedInferenceHistoryDto {
  @ApiProperty({ type: [InferenceHistoryItemDto], description: 'List of history items' })
  items: InferenceHistoryItemDto[];

  @ApiProperty({ description: 'Total number of items' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}
