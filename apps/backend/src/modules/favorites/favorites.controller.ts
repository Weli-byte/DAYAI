import {
  Controller,
  Post,
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
import { type FavoritesService } from './favorites.service';
import { type CreateFavoriteDto } from './dto/create-favorite.dto';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @ApiOperation({ summary: 'Add a model to user favorites' })
  @ApiCreatedResponse({ description: 'Model added to favorites' })
  @ApiNotFoundResponse({ description: 'Model not found' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async addFavorite(@Body() dto: CreateFavoriteDto) {
    return this.favoritesService.addFavorite(dto);
  }

  @Delete(':modelId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a model from user favorites' })
  @ApiOkResponse({ description: 'Model removed from favorites' })
  @ApiNotFoundResponse({ description: 'Favorite not found' })
  async removeFavorite(
    @Param('modelId') modelId: string,
    @Query('walletAddress') walletAddress: string,
  ) {
    return this.favoritesService.removeFavorite(modelId, walletAddress);
  }

  @Get()
  @ApiOperation({ summary: 'Get user favorited models list' })
  @ApiOkResponse({ description: 'Favorites retrieved successfully' })
  async getFavorites(
    @Query('walletAddress') walletAddress: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const p = page ? parseInt(page as any, 10) : 1;
    const l = limit ? parseInt(limit as any, 10) : 20;
    return this.favoritesService.getFavorites(walletAddress, p, l);
  }

  @Get(':modelId/status')
  @ApiOperation({ summary: 'Check if a model is in user favorites' })
  @ApiOkResponse({ description: 'Status retrieved successfully' })
  async isFavorite(
    @Param('modelId') modelId: string,
    @Query('walletAddress') walletAddress: string,
  ): Promise<{ isFavorite: boolean }> {
    return this.favoritesService.isFavorite(modelId, walletAddress);
  }
}
