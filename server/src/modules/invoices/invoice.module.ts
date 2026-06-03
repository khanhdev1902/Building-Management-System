import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { PrismaService } from 'src/database/prisma.service';
import { InvoiceSchedulerService } from './invoice-scheduler-service.service';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService, PrismaService, InvoiceSchedulerService],
  exports: [InvoiceService, InvoiceSchedulerService],
})
export class InvoiceModule {}
