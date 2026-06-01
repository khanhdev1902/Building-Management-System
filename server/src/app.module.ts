import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RoomModule } from './modules/rooms/room.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './modules/users/user.module';
import { ServicesModule } from './modules/services/service.module';
import { AssetModule } from './modules/assets/asset.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UtilityModule } from './modules/utilities/utility.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // used for read env
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    RedisModule,
    AuthModule,
    UserModule,
    RoomModule,
    ServicesModule,
    AssetModule,
    ContractsModule,
    UtilityModule,
  ],
})
export class AppModule {}
