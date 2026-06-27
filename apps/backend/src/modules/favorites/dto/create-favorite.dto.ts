import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
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
}
