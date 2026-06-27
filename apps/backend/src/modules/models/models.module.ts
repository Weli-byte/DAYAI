import { Module } from '@nestjs/common';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { ModelRepository } from './repositories/model.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ModelsController],
  providers: [ModelsService, ModelRepository],
  exports: [ModelsService],
})
export class ModelsModule {}
