import { Module } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { PrismaService } from 'src/database/prisma.service';
import { InvoiceModule } from '../invoices/invoice.module';

@Module({
  imports: [InvoiceModule],
  controllers: [SettingController],
  providers: [SettingService, PrismaService],
})
export class SettingModule {}
