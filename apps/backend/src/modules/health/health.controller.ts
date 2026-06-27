import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { type HealthService } from './health.service';
import { HealthResponseDto } from './dto/health-response.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Health check',
    description:
      'Returns the operational status of the backend and its dependencies (PostgreSQL, Redis).',
  })
  @ApiResponse({ status: 200, description: 'Service is healthy', type: HealthResponseDto })
  @ApiResponse({ status: 503, description: 'One or more dependencies are unhealthy' })
  async check(): Promise<HealthResponseDto> {
    const result = await this.health.check();
    return result;
  }
}
