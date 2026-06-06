import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UpdateInvoiceSettingDto } from './dto/update-invoice-setting.dto';
import { InvoiceSchedulerService } from '../invoices/invoice-scheduler-service.service';
import { CreateSettingDto } from './dto/create-setting.dto';

@Injectable()
export class SettingService {
  constructor(
    private prismaService: PrismaService,
    private invoiceSchedulerService: InvoiceSchedulerService,
  ) {}

  async getSetting() {
    return this.prismaService.systemSetting.findFirst();
  }

  async createDefaultSetting(dto: CreateSettingDto) {
    const existing = await this.prismaService.systemSetting.findFirst();

    if (!existing) {
      return this.prismaService.systemSetting.create({
        data: {
          invoiceGenerateDay: dto.invoiceGenerateDay,
          invoiceGenerateHour: dto.invoiceGenerateHour,
          invoiceGenerateMinute: dto.invoiceGenerateMinute,
        },
      });
    }

    return existing;
  }

  async updateInvoiceSetting(dto: UpdateInvoiceSettingDto) {
    const setting = await this.prismaService.systemSetting.update({
      where: { id: dto.id },
      data: {
        invoiceGenerateDay: dto.invoiceGenerateDay,
        invoiceGenerateHour: dto.invoiceGenerateHour,
        invoiceGenerateMinute: dto.invoiceGenerateMinute,
        lastInvoiceGeneratedAt: dto.lastInvoiceGeneratedAt,
      },
    });

    await this.invoiceSchedulerService.reloadInvoiceCron();

    return setting;
  }
}
