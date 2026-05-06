import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RoomModule } from './modules/rooms/room.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // used for read env
      isGlobal: true,
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    UserModule,
    RoomModule,
  ],
})
export class AppModule {}
