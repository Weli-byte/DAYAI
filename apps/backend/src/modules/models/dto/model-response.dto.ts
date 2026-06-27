import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Framework, ModelStatus } from '../../common/types/enums';

export class TagDto {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() slug!: string;
}

export class CategoryDto {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() slug!: string;
}

export class OwnerDto {
  @ApiProperty() id!: string;
  @ApiProperty() username!: string;
  @ApiPropertyOptional() avatar?: string | null;
}

export class ModelVersionDto {
  @ApiProperty() id!: string;
  @ApiProperty() version!: string;
  @ApiPropertyOptional() changelog?: string | null;
  @ApiProperty() isLatest!: boolean;
  @ApiProperty() createdAt!: Date;
}

export class ModelResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() title!: string;
  @ApiPropertyOptional() description?: string | null;
  @ApiProperty({ enum: Framework }) framework!: Framework;
  @ApiProperty({ enum: ModelStatus }) status!: ModelStatus;
  @ApiPropertyOptional() license?: string | null;
  @ApiPropertyOptional({ type: () => OwnerDto }) owner?: OwnerDto;
  @ApiPropertyOptional({ type: () => CategoryDto }) category?: CategoryDto | null;
  @ApiProperty({ type: () => [TagDto] }) tags!: TagDto[];
  @ApiPropertyOptional({ type: () => ModelVersionDto }) latestVersion?: ModelVersionDto | null;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
}

export class PaginatedModelResponseDto {
  @ApiProperty({ type: () => [ModelResponseDto] }) data!: ModelResponseDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
  @ApiProperty() totalPages!: number;
}
