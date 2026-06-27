import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadModelDto {
  @ApiProperty({ description: 'AI Model ID to attach the version to' })
  @IsString()
  @IsNotEmpty()
  modelId!: string;

  @ApiProperty({ example: '1.0.0', description: 'Semantic version string' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  version!: string;

  @ApiPropertyOptional({ example: 'Initial release with improved accuracy' })
  @IsOptional()
  @IsString()
  changelog?: string;

  @ApiProperty({ description: 'Wallet address of the uploader (for NFT mint)' })
  @IsString()
  @IsNotEmpty()
  walletAddress!: string;
}
