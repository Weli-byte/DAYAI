import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ example: 'clp123abc' })
  id!: string;

  @ApiPropertyOptional({ example: 'Alice Smith' })
  fullName?: string | null;

  @ApiPropertyOptional({ example: 'https://alice.dev' })
  website?: string | null;

  @ApiPropertyOptional({ example: 'https://twitter.com/alice' })
  twitter?: string | null;

  @ApiPropertyOptional({ example: 'https://github.com/alice' })
  github?: string | null;

  @ApiPropertyOptional({ example: '0x1234567890123456789012345678901234567890' })
  walletAddress?: string | null;
}

export class ProfileResponseDto {
  @ApiProperty({ example: 'usr123xyz' })
  id!: string;

  @ApiProperty({ example: 'alice' })
  username!: string;

  @ApiPropertyOptional({ example: 'alice@dev.com' })
  email?: string | null;

  @ApiPropertyOptional({ example: 'AI researcher and open-source contributor.' })
  bio?: string | null;

  @ApiPropertyOptional({ example: 'https://api.dicebear.com/7.x/bottts/svg?seed=alice' })
  avatar?: string | null;

  @ApiPropertyOptional({ type: UserProfileDto })
  profile?: UserProfileDto | null;

  @ApiProperty({ example: '2026-06-27T11:00:00Z' })
  createdAt!: Date;
}
