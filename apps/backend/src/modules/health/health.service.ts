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
    const aiUrl = this.config.get<string>('app.aiServiceUrl') ?? 'http://localhost:8000';
    const rpcUrl = this.config.get<string>('MONAD_RPC_URL') ?? 'https://10143.rpc.thirdweb.com';

    const [dbOk, redisOk, aiOk, rpcOk] = await Promise.allSettled([
      this.prisma.healthCheck(),
      this.redis.healthCheck(),
      // Check AI Service
      fetch(`${aiUrl}/health`, { signal: AbortSignal.timeout(3000) })
        .then((res) => res.ok)
        .catch(() =>
          // Fallback check to main / endpoint
          fetch(aiUrl, { signal: AbortSignal.timeout(3000) })
            .then((res) => res.status < 500)
            .catch(() => false),
        ),
      // Check Monad RPC block number query
      fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
        signal: AbortSignal.timeout(3000),
      })
        .then(async (res) => {
          if (!res.ok) return false;
          const json = await res.json();
          return !!json?.result;
        })
        .catch(() => false),
    ]);

    const dbStatus = dbOk.status === 'fulfilled' && dbOk.value;
    const redisStatus = redisOk.status === 'fulfilled' && redisOk.value;
    const aiStatus = aiOk.status === 'fulfilled' && aiOk.value;
    const rpcStatus = rpcOk.status === 'fulfilled' && rpcOk.value;

    const allOk = dbStatus && redisStatus && aiStatus && rpcStatus;

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
        aiService: {
          status: aiStatus ? 'up' : 'down',
          message: aiStatus ? 'FastAPI service reachable' : 'FastAPI service unreachable',
        },
        monadRpc: {
          status: rpcStatus ? 'up' : 'down',
          message: rpcStatus ? 'Monad RPC endpoint reachable' : 'Monad RPC endpoint unreachable',
        },
      },
    };
  }
}
