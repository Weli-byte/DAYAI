import { Module, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './modules/logger/logger.module';
import { DatabaseModule } from './modules/database/database.module';
import { HealthModule } from './modules/health/health.module';
import { RequestIdMiddleware } from './modules/common/middleware/request-id.middleware';
import { appConfig } from './modules/config/app.config';
import { databaseConfig } from './modules/config/database.config';
import { redisConfig } from './modules/config/redis.config';

@Module({
  imports: [
    // ── Configuration ─────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [appConfig, databaseConfig, redisConfig],
    }),

    // ── Infrastructure ────────────────────────────────────────────────────────
    LoggerModule,
    DatabaseModule,

    // ── Feature modules ───────────────────────────────────────────────────────
    HealthModule,

    // Sprint 2+ will add:
    //   AuthModule, UserModule, ModelModule, MarketplaceModule, DaoModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
