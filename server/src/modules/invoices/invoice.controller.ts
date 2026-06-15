import { Controller, Get, Param, Body, Post, Res } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { ApiResponse } from 'src/common/responses/api-response';
import type { Response } from 'express';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  async getAllInvoices() {
    const invoices = await this.invoiceService.getAllInvoices();
    return ApiResponse.success(
      invoices,
      'Lấy danh sách hóa đơn thành công',
      200,
    );
  }
  @Get('tenant/:userId')
  async getAllInvoiceTenants(@Param('userId') userId: string) {
    const invoices = await this.invoiceService.getAllInvoices(userId);
    return ApiResponse.success(
      invoices,
      'Lấy danh sách hóa đơn thành công',
      200,
    );
  }

  @Post('generate')
  async generateInvoices() {
    const invoices = await this.invoiceService.generateInvoices();
    return ApiResponse.success(
      invoices,
      'Tạo danh sách hóa đơn thành công',
      200,
    );
  }

  @Get(':id')
  async getInvoiceById(@Param('id') id: string) {
    const invoice = await this.invoiceService.getInvoiceById(id);
    return ApiResponse.success(
      invoice,
      'Lấy thông tin hóa đơn thành công!',
      200,
    );
  }

  @Get(':id/export-pdf')
  async exportInvoicePdf(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.invoiceService.exportInvoicePdf(id);

    // 1. Cấu hình Header chuẩn để báo hiệu đây là file PDF nhị phân
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=invoice.pdf', // "inline" để xem trực tiếp, "attachment" để tải về
      'Content-Length': buffer.length,
    });

    // 2. Bắt buộc dùng res.end(buffer) hoặc res.send(buffer)
    // để đẩy thẳng dữ liệu nhị phân ra, tránh bị NestJS biến thành JSON Object.
    res.end(buffer);
  }
}
