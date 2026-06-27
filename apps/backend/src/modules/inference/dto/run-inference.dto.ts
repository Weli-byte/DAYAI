import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RunInferenceDto {
  @ApiProperty({ description: 'Model ID to run inference on' })
  @IsString()
  @IsNotEmpty()
  modelId: string;

  @ApiProperty({ description: 'Input prompt for the model', maxLength: 5000 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  prompt: string;

  @ApiPropertyOptional({ description: 'Maximum tokens to generate', default: 200 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1024)
  maxTokens?: number;

  @ApiPropertyOptional({ description: 'Sampling temperature', default: 0.7 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @ApiProperty({ description: 'User wallet address' })
  @IsString()
  @IsNotEmpty()
  walletAddress: string;
}
