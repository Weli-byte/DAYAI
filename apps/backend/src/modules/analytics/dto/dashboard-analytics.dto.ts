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

  @ApiProperty({ example: 25, description: 'Active developers' })
  activeCreators!: number;

  @ApiProperty({
    example: [{ name: 'NLP', count: 12 }],
    description: 'Categories distribution by models count',
  })
  topCategories!: Array<{ name: string; count: number }>;

  @ApiProperty({
    example: [
      {
        modelId: 'cifar-10',
        title: 'CIFAR Classifier',
        version: '1.0.0',
        creator: 'alice',
        createdAt: '2026-06-27T12:00:00Z',
      },
    ],
    description: 'Latest uploaded model versions',
  })
  recentUploads!: Array<{
    modelId: string;
    title: string;
    version: string;
    creator: string;
    createdAt: string;
  }>;
}
