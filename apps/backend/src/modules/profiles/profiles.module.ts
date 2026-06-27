import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { ProfileRepository } from './repositories/profile.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [ProfilesController],
  providers: [ProfilesService, ProfileRepository],
  exports: [ProfilesService, ProfileRepository],
})
export class ProfilesModule {}
