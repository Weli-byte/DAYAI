import { ApiProperty } from '@nestjs/swagger';

export class ComponentStatusDto {
  @ApiProperty({ example: 'up', enum: ['up', 'down'] })
  status!: 'up' | 'down';

  @ApiProperty({ required: false })
  message?: string;
}

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', enum: ['ok', 'error'] })
  status!: 'ok' | 'error';

  @ApiProperty({ example: '1.0.0' })
  version!: string;

  @ApiProperty({ example: 'backend' })
  service!: string;

  @ApiProperty({ example: '2026-06-27T12:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: 42 })
  uptime!: number;

  @ApiProperty({
    type: 'object',
    additionalProperties: { $ref: '#/components/schemas/ComponentStatusDto' },
  })
  components!: Record<string, ComponentStatusDto>;
}
