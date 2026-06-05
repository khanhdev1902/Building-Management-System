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

  @Get(':id')
  async getContractById(@Param('id') id: string) {
    const contract = await this.contractsService.getContractById(id);
    return ApiResponse.success(contract, 'lấy data contract thành công', 200);
  }

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

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=invoice.pdf',
    });
    res.end(buffer);
  }
}
