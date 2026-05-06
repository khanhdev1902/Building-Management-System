import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RoomModule } from './modules/rooms/room.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // used for read env
      isGlobal: true,
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    RoomModule,
  ],
})
export class AppModule {}
