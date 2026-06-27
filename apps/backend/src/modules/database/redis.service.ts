import { Injectable, type OnModuleInit, type OnModuleDestroy } from '@nestjs/common';
import { type ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { type AppLogger } from '../logger/logger.service';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;

  constructor(
    private readonly config: ConfigService,
    private readonly logger: AppLogger,
  ) {}

  onModuleInit(): void {
    this.client = new Redis({
      host: this.config.get<string>('redis.host', 'localhost'),
      port: this.config.get<number>('redis.port', 6379),
      password: this.config.get<string>('redis.password') || undefined,
      db: this.config.get<number>('redis.db', 0),
      lazyConnect: true,
      retryStrategy: (times) => Math.min(times * 100, 3000),
      enableReadyCheck: true,
    });

    this.client.on('connect', () => this.logger.log('Redis connected', RedisService.name));
    this.client.on('error', (err: Error) =>
      this.logger.error(`Redis error: ${err.message}`, undefined, RedisService.name),
    );
    this.client.on('reconnecting', () =>
      this.logger.warn('Redis reconnecting...', RedisService.name),
    );

    this.client
      .connect()
      .catch((err: Error) =>
        this.logger.warn(`Redis initial connect failed: ${err.message}`, RedisService.name),
      );
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
    this.logger.log('Redis connection closed', RedisService.name);
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (value === null) return null;
    return JSON.parse(value) as T;
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.set(key, serialized, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }

  getClient(): Redis {
    return this.client;
  }
}
