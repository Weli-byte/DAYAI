import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 'clt1abc123', description: 'Model ID' })
  @IsString()
  @IsNotEmpty()
  modelId!: string;

  @ApiProperty({
    example: '0x1234567890123456789012345678901234567890',
    description: 'User wallet address',
  })
  @IsString()
  @IsNotEmpty()
  walletAddress!: string;

  @ApiProperty({
    example: 'This is an excellent model! High performance.',
    description: 'Review content',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(1000)
  content!: string;
}
