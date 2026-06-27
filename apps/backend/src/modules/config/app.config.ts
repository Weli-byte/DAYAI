import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '4000', 10),
  apiVersion: process.env.API_VERSION ?? 'v1',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  swaggerEnabled: process.env.SWAGGER_ENABLED !== 'false',
  aiServiceUrl: process.env.AI_SERVICE_URL ?? 'http://localhost:8000',
  aiServiceTimeout: parseInt(process.env.AI_SERVICE_TIMEOUT ?? '30000', 10),
}));
