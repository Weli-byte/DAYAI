import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UploadJobResponseDto {
  @ApiProperty() jobId!: string;
  @ApiProperty() status!: string;
  @ApiPropertyOptional() stage?: string | null;
  @ApiPropertyOptional() fileCid?: string | null;
  @ApiPropertyOptional() metadataCid?: string | null;
  @ApiPropertyOptional() nftTokenId?: string | null;
  @ApiPropertyOptional() txHash?: string | null;
  @ApiPropertyOptional() errorMessage?: string | null;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
}

export class MintResponseDto {
  @ApiProperty() jobId!: string;
  @ApiProperty() modelId!: string;
  @ApiProperty() versionId!: string;
  @ApiProperty() fileCid!: string;
  @ApiProperty() metadataCid!: string;
  @ApiProperty() metadataUri!: string;
  @ApiProperty() nftTokenId!: string;
  @ApiProperty() txHash!: string;
  @ApiProperty() sha256!: string;
  @ApiProperty() fileSize!: number;
}
