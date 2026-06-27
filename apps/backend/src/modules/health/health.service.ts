import { Injectable } from '@nestjs/common';
import { type ConfigService } from '@nestjs/config';
import { type PrismaService } from '../database/prisma.service';
import { type RedisService } from '../database/redis.service';
import type { HealthResponseDto } from './dto/health-response.dto';

@Injectable()
export class HealthService {
  private readonly startTime = Date.now();

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  async check(): Promise<HealthResponseDto> {
    const [dbOk, redisOk] = await Promise.allSettled([
      this.prisma.healthCheck(),
      this.redis.healthCheck(),
    ]);

    const dbStatus = dbOk.status === 'fulfilled' && dbOk.value;
    const redisStatus = redisOk.status === 'fulfilled' && redisOk.value;
    const allOk = dbStatus && redisStatus;

    return {
      status: allOk ? 'ok' : 'error',
      version: '1.0.0',
      service: 'backend',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      components: {
        database: {
          status: dbStatus ? 'up' : 'down',
          message: dbStatus ? 'PostgreSQL reachable' : 'PostgreSQL unreachable',
        },
        redis: {
          status: redisStatus ? 'up' : 'down',
          message: redisStatus ? 'Redis reachable' : 'Redis unreachable',
        },
      },
    };
  }
}
