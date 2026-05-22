// src/modules/contracts/contracts.controller.ts

import { Body, Controller, Post } from '@nestjs/common';

import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { ApiResponse } from 'src/common/responses/api-response';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  async createContract(@Body() createContractDto: CreateContractDto) {
    const newContract =
      await this.contractsService.createContract(createContractDto);
    return ApiResponse.success(newContract, 'Tạo hợp đồng thành công!', 201);
  }

  //   @Get()
  //   async getAllContracts() {
  //     return this.contractsService.getAllContracts();
  //   }

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
}
