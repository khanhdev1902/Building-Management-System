import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import 'dotenv/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  // eslint-disable-next-line @typescript-eslint/require-await
  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('REDIS_URL is not defined in environment variables');
    }
    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
    });

    this.client.on('error', (err) => {
      console.error('Redis Error: ', err);
    });

    this.client.on('connect', () => {
      console.log('Successfully connected to Redis Cloud!');
    });
  }

  // Luôn luôn ngắt kết nối khi ứng dụng tắt
  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }

  async set(key: string, value: any, ttl?: number) {
    if (ttl) {
      await this.client.set(key, JSON.stringify(value), 'EX', ttl);
    } else {
      await this.client.set(key, JSON.stringify(value));
    }
  }

  async get(key: string) {
    const data = await this.client.get(key);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return data ? JSON.parse(data) : null;
    } catch {
      return data;
    }
  }

  async del(key: string) {
    await this.client.del(key);
  }
}
