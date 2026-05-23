// src/modules/contracts/contracts.service.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';

import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ContractsService {
  constructor(private prismaService: PrismaService) {}

  // Chạy mỗi ngày lúc 00:00
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncContractStatus() {
    const now = new Date();

    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(now.getDate() + 30);

    // Hết hạn
    await this.prismaService.contract.updateMany({
      where: {
        endDate: {
          lt: now,
        },
        status: {
          not: 'EXPIRED',
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    // Sắp hết hạn
    await this.prismaService.contract.updateMany({
      where: {
        endDate: {
          gte: now,
          lte: thirtyDaysLater,
        },
        status: 'ACTIVE',
      },
      data: {
        status: 'EXPIRING',
      },
    });
  }

  async createContract(dto: CreateContractDto) {
    return await this.prismaService.$transaction(async (tx) => {
      // 1. CHECK ROOM
      const room = await tx.room.findUnique({
        where: {
          id: dto.roomId,
        },
      });

      if (!room) {
        throw new BadRequestException('Phòng không tồn tại');
      }

      const activeContract = await tx.contract.findFirst({
        where: {
          roomId: dto.roomId,
          status: 'ACTIVE',
        },
      });

      if (activeContract) {
        throw new BadRequestException('Phòng hiện đang có hợp đồng hoạt động');
      }

      // 2. CHECK TENANT EXISTS
      const existTenant = await tx.tenant.findFirst({
        where: {
          user: {
            OR: [{ email: dto.email }, { phone: dto.phone }],
          },
        },
        include: {
          user: true,
        },
      });

      let tenantId = existTenant?.id;

      // 3. CREATE NEW TENANT IF NOT EXISTS
      if (!existTenant) {
        const password = '123456';
        const passwordHash = await bcrypt.hash(password, 10);
        const normalizedName = dto.tenantName.trim().replace(/\s+/g, ' ');
        const nameParts = normalizedName.split(' ');
        const firstName = nameParts.pop() || '';
        const lastName = nameParts.join(' ');
        const newUser = await tx.user.create({
          data: {
            firstName,
            lastName,
            passwordHash,
            phone: dto.phone,
            gender: dto.gender,
            email: dto.email,
            role: 'TENANT',
          },
        });

        const newTenant = await tx.tenant.create({
          data: {
            userId: newUser.id,
            citizenId: dto.cccd,
            dateOfBirth: new Date(dto.birthday),
            occupation: dto.occupation,

            hometownProvince: dto.province,
            hometownDistrict: dto.district,
            hometownWard: dto.ward,
            hometownAddress: dto.addressDetail,
          },
        });

        tenantId = newTenant.id;

        // =========================================================
        // CREATE VEHICLES
        // =========================================================

        if (dto.tenantVehicles?.length > 0) {
          await tx.vehicle.createMany({
            data: dto.tenantVehicles.map((vehicle) => ({
              tenantId: newTenant.id,
              type: vehicle.type,
              licensePlate: vehicle.licensePlate,
            })),
          });
        }
      }

      // 4. CALCULATE CONTRACT DATE
      const startDate = new Date(dto.startDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + dto.duration);

      // 5. CREATE CONTRACT
      const newContract = await tx.contract.create({
        data: {
          roomId: dto.roomId,
          tenantId: tenantId!,
          startDate,
          endDate,
          rentalPrice: dto.rentPrice,
          deposit: dto.deposit,
          status: 'ACTIVE',
          depositStatus: 'UNPAID',
          paymentCycle: Number(dto.paymentCycle),
        },
      });

      // 6. CREATE ROOMMATES
      if (dto.occupants?.length > 0) {
        await tx.roommate.createMany({
          data: dto.occupants.map((o) => ({
            contractId: newContract.id,
            tenantId: tenantId!,
            fullName: o.name,
            citizenId: o.cccd,
            phone: o.phone,
            gender: o.gender,
            occupation: o.occupation,
            dateOfBirth: new Date(o.birthday),
            hometownAddress: o.licensePlate,
          })),
        });
      }

      // 7. CREATE CONTRACT SERVICES
      // if (dto.services?.length > 0) {
      //   await tx.contractService.createMany({
      //     data: dto.services.map((service) => ({
      //       contractId: newContract.id,
      //       serviceId: service.serviceId,
      //       serviceName: service.name,
      //       price: service.price,
      //       unit: service.unit,
      //     })),
      //   });
      // }

      // 8. UPDATE ROOM STATUS
      await tx.room.update({
        where: {
          id: dto.roomId,
        },
        data: {
          status: 'OCCUPIED',
        },
      });

      // 9. RETURN RESULT
      return {
        success: true,
        message: 'Tạo hợp đồng thành công',
        data: {
          contractId: newContract.id,
          tenantId,
          roomId: dto.roomId,
        },
      };
    });
  }
  async getAllContracts() {
    // id: "HD-2026-004",
    // room: "204",
    // tower: "Danjin Block B",
    // tenant: "Hoàng Thu Thảo",
    // avatar: "",
    // startDate: "2026-05-01",
    // endDate: "2026-11-01",
    // deposit: 5000000,
    // rent: 5000000,
    // status: "active",
    // paymentStatus: "partial", // Test cọc thiếu
    const constract = await this.prismaService.contract.findMany({
      include: { tenant: { include: { user: true } }, room: true },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return constract.map((c) => ({
      id: c.id,
      room: c.room.roomNumber,
      tower: 'Danjin Building',
      avatar: c.tenant.user.avatarUrl,
      tenant: c.tenant.user.lastName + ' ' + c.tenant.user.firstName,
      startDate: c.startDate,
      endDate: c.endDate,
      deposit: c.deposit,
      rent: c.rentalPrice,
      status: c.status,
      paymentStatus: c.depositStatus,
    }));
  }

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
