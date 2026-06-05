import { Module } from '@nestjs/common';
import { ReceiptController } from './receipt.controller';
import { PrismaService } from 'src/database/prisma.service';
import { ReceiptService } from './receipt.service';

@Module({
  imports: [],
  controllers: [ReceiptController],
  providers: [PrismaService, ReceiptService],
})
export class ReceiptModule {}
