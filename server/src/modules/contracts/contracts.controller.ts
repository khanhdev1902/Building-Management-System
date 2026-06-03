// src/modules/contracts/contracts.controller.ts

import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';

import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { ApiResponse } from 'src/common/responses/api-response';
import { type Response } from 'express';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  async createContract(@Body() createContractDto: CreateContractDto) {
    const newContract =
      await this.contractsService.createContract(createContractDto);
    return ApiResponse.success(newContract, 'Tạo hợp đồng thành công!', 201);
  }

  @Get()
  async getAllContracts() {
    const contracts = await this.contractsService.getAllContracts();
    return ApiResponse.success(
      contracts,
      'Lấy dánh ách hợp đồng thành công!',
      200,
    );
  }

  //   @Get(':id')
  //   async getContractById(@Param('id') id: string) {
  //     return this.contractsService.getContractById(id);
  //   }

  //   @Patch(':id')
  //   async updateContract(
  //     @Param('id') id: string,
  //     @Body() updateData: Partial<CreateContractDto>,
  //   ) {
  //     return this.contractsService.updateContract(id, updateData);
  //   }

  //   @Delete(':id')
  //   async deleteContract(@Param('id') id: string) {
  //     return this.contractsService.deleteContract(id);
  //   }

  @Get(':id/export-pdf')
  async exportInvoicePdf(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.contractsService.exportContractPdf(id);

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
