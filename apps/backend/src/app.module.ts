import { Module, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './modules/logger/logger.module';
import { DatabaseModule } from './modules/database/database.module';
import { HealthModule } from './modules/health/health.module';
import { ModelsModule } from './modules/models/models.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TagsModule } from './modules/tags/tags.module';
import { UploadModule } from './modules/upload/upload.module';
import { InferenceModule } from './modules/inference/inference.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { RequestIdMiddleware } from './modules/common/middleware/request-id.middleware';
import { appConfig } from './modules/config/app.config';
import { databaseConfig } from './modules/config/database.config';
import { redisConfig } from './modules/config/redis.config';

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    // ── Configuration ─────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [appConfig, databaseConfig, redisConfig],
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // ── Infrastructure ────────────────────────────────────────────────────────
    LoggerModule,
    DatabaseModule,

    // ── Feature modules ───────────────────────────────────────────────────────
    HealthModule,
    ModelsModule,
    CategoriesModule,
    TagsModule,
    UploadModule,
    InferenceModule,
    ProfilesModule,
    ReviewsModule,
    RatingsModule,
    FavoritesModule,
    AnalyticsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
