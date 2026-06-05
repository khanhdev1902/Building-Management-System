import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';

@Injectable()
export class ReceiptService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReceiptDto: CreateReceiptDto) {
    const invoice = await this.prisma.invoice.findUnique({
      where: {
        id: createReceiptDto.invoiceId,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Không tìm thấy hóa đơn');
    }

    const count = await this.prisma.receipt.count();

    return this.prisma.receipt.create({
      data: {
        ...createReceiptDto,

        receiptCode: `PT-${String(count + 1).padStart(6, '0')}`,

        status: 'COMPLETED',
      },
    });
  }

  async findAll() {
    const receipts = await this.prisma.receipt.findMany({
      include: {
        invoice: {
          include: {
            contract: {
              include: {
                room: true,
                tenant: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
        staff: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return receipts.map((r) => ({
      id: r.id.slice(0, 10).toUpperCase(),
      invoiceId: r.id.slice(0, 10).toUpperCase(),
      room: r.invoice.contract.room.roomNumber,
      tenant: `${r.invoice.contract.tenant.user.lastName} ${r.invoice.contract.tenant.user.firstName}`,
      amount: r.amount.toNumber(),
      type: 'ROOM',
      paymentMethod: 'BANK_TRANSFER',
      collectedBy: 'Hệ thống (VietQR Auto)',
      createdAt: r.createdAt.toLocaleString('vi-VN'),
      referenceNo: r.receiptCode,
    }));
  }

  async findOne(id: string) {
    const receipt = await this.prisma.receipt.findUnique({
      where: { id },
      include: {
        invoice: true,
        staff: true,
      },
    });

    if (!receipt) {
      throw new NotFoundException('Không tìm thấy phiếu thu');
    }

    return receipt;
  }

  async findByReceiptCode(receiptCode: string) {
    const receipt = await this.prisma.receipt.findUnique({
      where: {
        receiptCode,
      },
      include: {
        invoice: true,
        staff: true,
      },
    });

    if (!receipt) {
      throw new NotFoundException('Không tìm thấy phiếu thu');
    }

    return receipt;
  }

  async remove(id: string) {
    const receipt = await this.prisma.receipt.findUnique({
      where: { id },
    });

    if (!receipt) {
      throw new NotFoundException('Không tìm thấy phiếu thu');
    }

    await this.prisma.receipt.delete({
      where: { id },
    });

    return {
      message: 'Xóa phiếu thu thành công',
    };
  }
}
