import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}
  async getDashboardTenant(userId: string) {
    console.log(userId);
    const data = await this.prisma.tenant.findUnique({
      where: { userId },
      include: {
        user: {
          include: {
            notifications: {
              include: {
                notification: true,
              },
            },
          },
        },
        vehicles: true,
        contracts: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            room: true,
            invoices: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
              include: {
                items: true,
              },
            },
          },
        },
      },
    });
    console.log(data);
    const notifications = data?.user.notifications || [];
    const roomNumber = data?.contracts[0].room.roomNumber;
    const fullName = `${data?.user.lastName} ${data?.user.firstName}`;
    const invoice = data?.contracts[0].invoices[0];
    const amount = invoice?.totalAmount.toNumber();

    const rawDescription = `${fullName}_P${roomNumber}_Thanh Toan tien phong ky ${invoice?.billingPeriod} ${invoice?.invoiceCode}`;
    const encodedDes = encodeURIComponent(rawDescription);
    const qrUrl = `https://qr.sepay.vn/img?acc=VQRQAJEQY6518&bank=MBBank&amount=${2000}&des=${encodedDes}`;

    const latestNotification = notifications?.[0];
    return {
      resident: fullName,
      room: roomNumber,
      building: 'DANJIN BUILDING Cầu Giấy (Số 12 Ngõ 86)',
      billingStatus: data?.contracts[0].invoices[0].status,
      contractId: data?.contracts[0].id,
      // Giả lập thông báo khẩn cấp hệ thống đẩy lên trên đầu trang
      urgentNotice: latestNotification
        ? {
            id: latestNotification.id,
            title: latestNotification.notification.title,
            time: '14:00 - 17:00 Ngày mai (12/06)',
            content: latestNotification.notification.content,
          }
        : null,
      assets: {
        vehicles: [
          {
            type: data?.vehicles[0].type,
            plate: data?.vehicles[0].licensePlate,
            cardNo: 'V-0892',
          },
        ],
        gateCard: 'NFC-201A',
      },
      notifications,
      invoice: {
        id: data?.contracts[0].invoices[0].id,
        period: `Tháng ${data?.contracts[0].invoices[0].billingPeriod}`,
        dueDate: invoice?.deadline.toLocaleDateString('vi-VN'),
        issueDate: invoice?.createdAt.toLocaleDateString('vi-VN'),
        totalAmount: amount,
        qrUrl: qrUrl,
        rawDescription,
        details: data?.contracts[0].invoices[0].items.map((i) => ({
          name: i.itemName,
          cost: i.subTotal.toNumber(),
          type: i.type,
          unit: i.unit,
          currentReading: i.currentReading,
          previousReading: i.previousReading,
          quantity: i.quantity,
          unitPrice: i.unitPrice.toNumber(),
        })),

        usage: {
          electricity: {
            oldIndex: invoice?.items.find((i) => i.type === 'ELECTRIC')
              ?.previousReading,
            newIndex: invoice?.items.find((i) => i.type === 'ELECTRIC')
              ?.currentReading,
            total: invoice?.items.find((i) => i.type === 'ELECTRIC')?.quantity,
            checkDate: '30/05/2026',
            history: [
              { month: 'Tháng 3', value: 240 },
              { month: 'Tháng 4', value: 290 },
              { month: 'Tháng 5', value: 320 },
            ],
          },
          water: {
            oldIndex: invoice?.items.find((i) => i.type === 'WATER')
              ?.previousReading,
            newIndex: invoice?.items.find((i) => i.type === 'WATER')
              ?.currentReading,
            total: invoice?.items.find((i) => i.type === 'WATER')?.quantity,
            checkDate: '30/05/2026',
          },
        },
      },
    };
  }
}
