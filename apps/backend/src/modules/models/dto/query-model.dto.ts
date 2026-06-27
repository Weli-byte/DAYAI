import { IsEnum, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Framework, ModelStatus } from '../../common/types/enums';

export type ModelSortField = 'title' | 'createdAt' | 'updatedAt';
export type SortOrder = 'asc' | 'desc';

export class QueryModelDto {
  @ApiPropertyOptional({ description: 'Full-text search on title and description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: Framework })
  @IsOptional()
  @IsEnum(Framework)
  framework?: Framework;

  @ApiPropertyOptional({ enum: ModelStatus })
  @IsOptional()
  @IsEnum(ModelStatus)
  status?: ModelStatus;

  @ApiPropertyOptional({ description: 'Filter by category ID' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Filter by tag ID' })
  @IsOptional()
  @IsString()
  tagId?: string;

  @ApiPropertyOptional({ description: 'Sort field', enum: ['title', 'createdAt', 'updatedAt'] })
  @IsOptional()
  @IsString()
  sortBy?: ModelSortField;

  @ApiPropertyOptional({ description: 'Sort direction', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  sortOrder?: SortOrder;

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
