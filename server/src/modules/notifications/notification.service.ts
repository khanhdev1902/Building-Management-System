import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private gateway: NotificationGateway,
  ) {}

  sendToUser(userId: string) {
    console.log('đã gửi tin');
    this.gateway.sendNotification(userId, {
      title: 'Hóa đơn mới',
      content: 'Hóa đơn tháng 06 đã được phát hành',
      createdAt: new Date(),
    });
  }

  async create(dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: dto,
    });

    this.gateway.sendNotification(dto.userId, notification);

    return notification;
  }

  async findMyNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async delete(id: string) {
    return this.prisma.notification.delete({
      where: {
        id,
      },
    });
  }
}
