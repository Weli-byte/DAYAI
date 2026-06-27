import { ApiProperty } from '@nestjs/swagger';

export class RatingSummaryDto {
  @ApiProperty({ example: 4.5, description: 'Average rating value' })
  average!: number;

  @ApiProperty({ example: 12, description: 'Total number of ratings' })
  count!: number;
}
