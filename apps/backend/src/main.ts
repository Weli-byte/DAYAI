import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import helmet from 'helmet';
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports
const compression = require('compression') as typeof import('compression');
import { AppModule } from './app.module';
import { winstonConfig } from './modules/logger/logger.config';
import { HttpExceptionFilter } from './modules/common/filters/http-exception.filter';
import { LoggingInterceptor } from './modules/common/interceptors/logging.interceptor';
import { TransformInterceptor } from './modules/common/interceptors/transform.interceptor';
import { AppLogger } from './modules/logger/logger.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
    bufferLogs: true,
  });

  const logger = app.get(AppLogger);

  // ── Security middleware ────────────────────────────────────────────────────
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
    }),
  );
  app.use(compression());

  // ── CORS ──────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    credentials: true,
  });

  // ── API versioning (URI-based: /api/v1/...) ───────────────────────────────
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  // ── Global pipes ──────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Global filters & interceptors ─────────────────────────────────────────
  const loggingInterceptor = app.get(LoggingInterceptor, { strict: false });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    loggingInterceptor ?? new LoggingInterceptor(logger),
    new TransformInterceptor(),
  );

  // ── Swagger ───────────────────────────────────────────────────────────────
  if (process.env.SWAGGER_ENABLED !== 'false') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('AI Marketplace API')
      .setDescription(
        [
          '**Decentralized AI Model Marketplace** — REST API',
          '',
          'Base URL: `/api/v1`',
          '',
          'All responses are wrapped: `{ success, data, timestamp, path }`',
        ].join('\n'),
      )
      .setVersion('1.0.0')
      .setContact('Marketplace Team', '', 'veliparlak84@gmail.com')
      .setLicense('MIT', 'https://opensource.org/licenses/MIT')
      .addServer('/api/v1', 'Version 1 (current)')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });

    logger.log('Swagger UI available at /api/docs', 'Bootstrap');
  }

  // ── Start ─────────────────────────────────────────────────────────────────
  const port = parseInt(process.env.PORT ?? '4000', 10);
  await app.listen(port, '0.0.0.0');

  logger.log(`Backend running on http://localhost:${port}`, 'Bootstrap');
  logger.log(`Health check: http://localhost:${port}/api/v1/health`, 'Bootstrap');
}

bootstrap().catch((err: Error) => {
  console.error('Fatal error during bootstrap:', err);
  process.exit(1);
});
