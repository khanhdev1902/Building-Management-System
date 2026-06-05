import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { ReceiptService } from './receipt.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';

@Controller('receipts')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  create(@Body() createReceiptDto: CreateReceiptDto) {
    return this.receiptService.create(createReceiptDto);
  }

  @Get()
  findAll() {
    return this.receiptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receiptService.findOne(id);
  }

  @Get('code/:receiptCode')
  findByReceiptCode(@Param('receiptCode') receiptCode: string) {
    return this.receiptService.findByReceiptCode(receiptCode);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.receiptService.remove(id);
  }
}
