import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { type RatingsService } from './ratings.service';
import { type CreateRatingDto } from './dto/create-rating.dto';
import { RatingSummaryDto } from './dto/rating-summary.dto';

@ApiTags('ratings')
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit or update a rating for a model' })
  @ApiOkResponse({ description: 'Rating submitted successfully' })
  @ApiNotFoundResponse({ description: 'Model not found' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async rateModel(@Body() dto: CreateRatingDto) {
    return this.ratingsService.rateModel(dto);
  }

  @Get('model/:modelId')
  @ApiOperation({ summary: 'Get rating summary for a model' })
  @ApiOkResponse({ type: RatingSummaryDto })
  @ApiNotFoundResponse({ description: 'Model not found' })
  async getRatingSummary(@Param('modelId') modelId: string): Promise<RatingSummaryDto> {
    return this.ratingsService.getRatingSummary(modelId);
  }

  @Get('model/:modelId/user/:walletAddress')
  @ApiOperation({ summary: 'Get a specific user rating for a model' })
  @ApiOkResponse({ description: 'User rating found' })
  async getUserRating(
    @Param('modelId') modelId: string,
    @Param('walletAddress') walletAddress: string,
  ) {
    return this.ratingsService.getUserRating(modelId, walletAddress);
  }
}
