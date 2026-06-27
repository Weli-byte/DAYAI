import { ApiProperty } from '@nestjs/swagger';
import { InferenceStatus } from '@prisma/client';

export class InferenceResultDto {
  @ApiProperty({ description: 'ID of the inference log' })
  id: string;

  @ApiProperty({ description: 'Model output text', nullable: true })
  output: string | null;

  @ApiProperty({ description: 'Model ID' })
  modelId: string;

  @ApiProperty({ description: 'Model title' })
  modelTitle: string;

  @ApiProperty({ description: 'Number of tokens used', nullable: true })
  tokensUsed: number | null;

  @ApiProperty({ description: 'Inference time in milliseconds', nullable: true })
  inferenceTimeMs: number | null;

  @ApiProperty({ enum: InferenceStatus, description: 'Inference run status' })
  status: InferenceStatus;

  @ApiProperty({ description: 'Timestamp of execution' })
  createdAt: Date;
}
