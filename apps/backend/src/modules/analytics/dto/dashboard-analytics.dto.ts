import { ApiProperty } from '@nestjs/swagger';

export class DashboardAnalyticsDto {
  @ApiProperty({ example: 42, description: 'Total models registered' })
  totalModels!: number;

  @ApiProperty({ example: 38, description: 'Total models minted as NFT' })
  totalNftModels!: number;

  @ApiProperty({ example: 120, description: 'Total users registered' })
  totalUsers!: number;

  @ApiProperty({ example: 1450, description: 'Total inferences run' })
  totalInferences!: number;

  @ApiProperty({ example: 4.6, description: 'Average rating across all models' })
  averageRating!: number;
}
