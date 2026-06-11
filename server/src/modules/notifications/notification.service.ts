/* eslint-disable @typescript-eslint/no-unsafe-call */
import { BadRequestException, Injectable } from '@nestjs/common';

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
    const targets = dto.targetType.split(',');

    if (targets.length === 0) {
      throw new BadRequestException('Target không hợp lệ');
    }

    return this.prisma.$transaction(async (tx) => {
      const notification = await tx.notification.create({
        data: {
          title: dto.title,
          content: dto.content,
          type: dto.type,
          priority: dto.priority,
          status: 'sent',
        },
      });

      if (targets[0] === 'all') {
        const contracts = await tx.contract.findMany({
          where: {
            OR: [{ status: 'ACTIVE' }, { status: 'EXPIRING' }],
          },
          include: {
            tenant: {
              select: {
                userId: true,
              },
            },
          },
        });

        const userNotifications = contracts.map((contract) => ({
          userId: contract.tenant.userId,
          notificationId: notification.id,
        }));

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        await tx.userNotification.createMany({
          data: userNotifications,
          skipDuplicates: true,
        });
      } else {
        //targets =[301, 302, 303, 304]
        const rooms = await tx.contract.findMany({
          where: {
            status: {
              in: ['ACTIVE', 'EXPIRING'],
            },
            room: {
              roomNumber: {
                in: targets,
              },
            },
          },
          include: {
            tenant: {
              select: {
                userId: true,
              },
            },
          },
        });
        console.log('rooms:', targets, rooms);
        const userNotifications = rooms.map((contract) => ({
          userId: contract.tenant.userId,
          notificationId: notification.id,
        }));

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        await tx.userNotification.createMany({
          data: userNotifications,
          skipDuplicates: true,
        });
      }

      return notification;
    });
  }

  // async findMyNotifications(userId: string) {
  //   return this.prisma.notification.findMany({
  //     where: {
  //       userId,
  //     },
  //     orderBy: {
  //       createdAt: 'desc',
  //     },
  //   });
  // }

  // async markAsRead(id: string) {
  //   return this.prisma.notification.update({
  //     where: { id },
  //     data: {
  //       isRead: true,
  //       readAt: new Date(),
  //     },
  //   });
  // }

  // async markAllAsRead(userId: string) {
  //   return this.prisma.notification.updateMany({
  //     where: {
  //       userId,
  //       isRead: false,
  //     },
  //     data: {
  //       isRead: true,
  //       readAt: new Date(),
  //     },
  //   });
  // }

  async delete(id: string) {
    return this.prisma.notification.delete({
      where: {
        id,
      },
    });
  }
}
