// src/modules/contracts/contracts.service.ts

import { Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ContractsService {
  constructor(private prismaService: PrismaService) {}

  async createContract(dto: CreateContractDto) {
    // await this.prismaService.contract.findMany();
    // return { dto };
    return await this.prismaService.$transaction(async (tx) => {
      const existTenant = await tx.tenant.findUnique({
        where: { id: dto.tenantId },
      });
      if (!existTenant) {
        console.log('haha');
      }
      // const newContract = await tx.contract.create({
      //   data: {},
      // });
      return { existTenant };
    });
    console.log(dto);
    return {
      data: dto,
    };
  }

  //   async getAllContracts() {
  //     // TODO: Logic lấy danh sách hợp đồng
  //     return [];
  //   }

  //   async getContractById(id: string) {
  //     // TODO: Logic lấy chi tiết hợp đồng
  //     return {
  //       id,
  //     };
  //   }

  //   async updateContract(id: string, updateData: Partial<CreateContractDto>) {
  //     // TODO: Logic cập nhật hợp đồng
  //     return {
  //       id,
  //       ...updateData,
  //     };
  //   }

  //   async deleteContract(id: string) {
  //     // TODO: Logic xoá hợp đồng
  //     return {
  //       message: `Đã xoá hợp đồng ${id}`,
  //     };
  //   }
}
