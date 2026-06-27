import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { type ReviewsService } from './reviews.service';
import { type CreateReviewDto } from './dto/create-review.dto';
import { type UpdateReviewDto } from './dto/update-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new review for a model' })
  @ApiCreatedResponse({ type: ReviewResponseDto, description: 'Review submitted successfully' })
  @ApiNotFoundResponse({ description: 'Model not found' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() dto: CreateReviewDto): Promise<ReviewResponseDto> {
    return this.reviewsService.create(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing review' })
  @ApiOkResponse({ type: ReviewResponseDto, description: 'Review updated successfully' })
  @ApiNotFoundResponse({ description: 'Review not found' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(@Param('id') id: string, @Body() dto: UpdateReviewDto): Promise<ReviewResponseDto> {
    return this.reviewsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a review' })
  @ApiOkResponse({ description: 'Review deleted successfully' })
  @ApiNotFoundResponse({ description: 'Review not found' })
  async delete(@Param('id') id: string, @Query('walletAddress') walletAddress: string) {
    return this.reviewsService.delete(id, walletAddress);
  }

  @Get('model/:modelId')
  @ApiOperation({ summary: 'Get paginated reviews for a model' })
  @ApiOkResponse({ description: 'Reviews retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Model not found' })
  async getByModel(
    @Param('modelId') modelId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const p = page ? parseInt(page as any, 10) : 1;
    const l = limit ? parseInt(limit as any, 10) : 20;
    return this.reviewsService.findManyByModel(modelId, p, l);
  }
}
