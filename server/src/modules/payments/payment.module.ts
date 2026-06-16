import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PrismaService } from 'src/database/prisma.service';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService],
})
export class PaymentModule {}
