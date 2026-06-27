import { IsOptional, IsString, MaxLength, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Alice Smith', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @ApiPropertyOptional({ example: 'https://alice.dev' })
  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(200)
  website?: string;

  @ApiPropertyOptional({ example: 'https://twitter.com/alice' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  twitter?: string;

  @ApiPropertyOptional({ example: 'https://github.com/alice' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  github?: string;
}
