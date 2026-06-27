import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { InferenceController } from './inference.controller';
import { InferenceService } from './inference.service';
import { InferenceRepository } from './repositories/inference.repository';
import { AiServiceClient } from './clients/ai-service.client';

@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [InferenceController],
  providers: [InferenceService, InferenceRepository, AiServiceClient],
  exports: [InferenceService],
})
export class InferenceModule {}
