import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

import { PrismaService } from 'src/database/prisma.service';
import { InvoiceService } from './invoice.service';

@Injectable()
export class InvoiceSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(InvoiceSchedulerService.name);

  private readonly JOB_NAME = 'invoice-generator';

  constructor(
    private readonly prisma: PrismaService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly invoiceService: InvoiceService,
  ) {}

  async onModuleInit() {
    await this.loadInvoiceCron();
  }

  private buildCronExpression(day: number, hour: number, minute: number) {
    return `0 ${minute} ${hour} ${day} * *`;
  }

  async loadInvoiceCron() {
    const setting = await this.prisma.systemSetting.findFirst();

    if (!setting) return;

    const cronExpression = this.buildCronExpression(
      setting.invoiceGenerateDay,
      setting.invoiceGenerateHour,
      setting.invoiceGenerateMinute,
    );

    const job = new CronJob(cronExpression, async () => {
      await this.handleGenerateInvoice();
    });

    this.schedulerRegistry.addCronJob(this.JOB_NAME, job);

    job.start();

    this.logger.log(`Invoice cron started: ${cronExpression}`);
  }

  async reloadInvoiceCron() {
    try {
      const oldJob = this.schedulerRegistry.getCronJob(this.JOB_NAME);

      await oldJob.stop();

      this.schedulerRegistry.deleteCronJob(this.JOB_NAME);

      this.logger.log('Old invoice cron removed');
    } catch {
      this.logger.warn('Invoice cron not found. Creating new one...');
    }

    await this.loadInvoiceCron();
  }

  async handleGenerateInvoice() {
    try {
      const setting = await this.prisma.systemSetting.findFirst();

      if (!setting) return;

      const now = new Date();

      const alreadyGenerated =
        !!setting.lastInvoiceGeneratedAt &&
        setting.lastInvoiceGeneratedAt.getMonth() === now.getMonth() &&
        setting.lastInvoiceGeneratedAt.getFullYear() === now.getFullYear();

      if (alreadyGenerated) {
        this.logger.log('Invoices already generated this month');
        return;
      }

      this.logger.log('Generating invoices...');

      await this.invoiceService.generateInvoices();

      await this.prisma.systemSetting.update({
        where: {
          id: setting.id,
        },
        data: {
          lastInvoiceGeneratedAt: now,
        },
      });

      this.logger.log('Invoices generated successfully');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
