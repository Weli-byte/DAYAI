import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
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

  @ApiProperty({ example: 5, description: 'Rating value between 1 and 5', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  value!: number;
}
