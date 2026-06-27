import { ApiProperty } from '@nestjs/swagger';

export class ReviewUserDto {
  @ApiProperty({ example: 'u123xyz' })
  id!: string;

  @ApiProperty({ example: 'alice' })
  username!: string;

  @ApiProperty({ example: 'https://api.dicebear.com/7.x/bottts/svg?seed=alice' })
  avatar!: string | null;

  @ApiProperty({ example: '0x1234567890123456789012345678901234567890' })
  walletAddress!: string | null;
}

export class ReviewResponseDto {
  @ApiProperty({ example: 'rev123abc' })
  id!: string;

  @ApiProperty({ example: 'm123xyz' })
  modelId!: string;

  @ApiProperty({ type: ReviewUserDto })
  user!: ReviewUserDto;

  @ApiProperty({ example: 'Great model, runs very quickly!' })
  content!: string;

  @ApiProperty({ example: '2026-06-27T11:00:00Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-06-27T11:00:00Z' })
  updatedAt!: Date;
}
