import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Framework, ModelStatus } from '../../common/types/enums';

export class CreateModelDto {
  @ApiProperty({ example: 'CIFAR-10 ResNet Classifier', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ example: 'A lightweight ResNet-20 for image classification.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: Framework, default: Framework.OTHER })
  @IsOptional()
  @IsEnum(Framework)
  framework?: Framework;

  @ApiPropertyOptional({ enum: ModelStatus, default: ModelStatus.DRAFT })
  @IsOptional()
  @IsEnum(ModelStatus)
  status?: ModelStatus;

  @ApiPropertyOptional({ example: 'MIT', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  license?: string;

  @ApiProperty({ example: 'clt1abc123', description: 'Owner user ID' })
  @IsString()
  @IsNotEmpty()
  ownerId!: string;

  @ApiPropertyOptional({ example: 'clt2xyz456', description: 'Category ID' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ type: [String], example: ['clt3tag001', 'clt3tag002'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];
}
