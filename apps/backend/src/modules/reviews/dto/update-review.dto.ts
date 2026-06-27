import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiProperty({
    example: '0x1234567890123456789012345678901234567890',
    description: 'User wallet address',
  })
  @IsString()
  @IsNotEmpty()
  walletAddress!: string;

  @ApiProperty({ example: 'This is an updated review comment.', description: 'Review content' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(1000)
  content!: string;
}
