import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { type AnalyticsService } from './analytics.service';
import { DashboardAnalyticsDto } from './dto/dashboard-analytics.dto';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get marketplace dashboard metrics' })
  @ApiOkResponse({ type: DashboardAnalyticsDto })
  async getDashboardAnalytics(): Promise<DashboardAnalyticsDto> {
    return this.analyticsService.getDashboardAnalytics();
  }
}
