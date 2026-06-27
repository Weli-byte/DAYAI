import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { RatingRepository } from './repositories/rating.repository';

@Module({
  imports: [DatabaseModule, ProfilesModule],
  controllers: [RatingsController],
  providers: [RatingsService, RatingRepository],
  exports: [RatingsService, RatingRepository],
})
export class RatingsModule {}
