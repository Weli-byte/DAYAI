import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { FavoriteRepository } from './repositories/favorite.repository';

@Module({
  imports: [DatabaseModule, ProfilesModule],
  controllers: [FavoritesController],
  providers: [FavoritesService, FavoriteRepository],
  exports: [FavoritesService, FavoriteRepository],
})
export class FavoritesModule {}
