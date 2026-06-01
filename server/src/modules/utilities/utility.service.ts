import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateMeterReadingDto } from './dto/create-metter-reading';
import { type MeterService } from 'src/generated/prisma/enums';

@Injectable()
export class UtilityService {
  constructor(private prismaService: PrismaService) {}

  async getLstUtilities() {
    const [rooms, services] = await Promise.all([
      this.prismaService.room.findMany({
        select: {
          id: true,
          roomNumber: true,
          floor: true,

          meters: {
            orderBy: {
              recordedDate: 'desc',
            },
          },

          contracts: {
            where: {
              OR: [{ status: 'ACTIVE' }, { status: 'EXPIRING' }],
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
            select: {
              tenant: {
                select: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),

      this.prismaService.service.findMany({
        where: {
          name: {
            in: ['Điện', 'Nước'],
          },
        },
        select: {
          id: true,
          name: true,
          price: true,
          unit: true,
        },
      }),
    ]);

    const electricService = services.find((s) => s.name === 'Điện');
    const waterService = services.find((s) => s.name === 'Nước');
    const now = new Date();

    return rooms.map((room) => {
      const contract = room.contracts[0];

      const tenantName = contract
        ? `${contract.tenant.user.lastName} ${contract.tenant.user.firstName}`
        : 'Chưa có khách hàng';

      const electricMeter = room.meters.find((m) => m.service === 'ELECTRIC');
      const waterMeter = room.meters.find((m) => m.service === 'WATER');

      const getPreviousReading = (meter: typeof electricMeter) => {
        if (!meter) return 0;
        const isCurrentMonth =
          meter.recordedDate.getMonth() === now.getMonth() &&
          meter.recordedDate.getFullYear() === now.getFullYear();
        return isCurrentMonth ? meter.previousValue : meter.currentValue;
      };

      const getCurrentReading = (meter: typeof electricMeter) => {
        if (!meter) return 0;
        const isCurrentMonth =
          meter.recordedDate.getMonth() === now.getMonth() &&
          meter.recordedDate.getFullYear() === now.getFullYear();
        return isCurrentMonth ? meter.currentValue : 0;
      };

      return {
        roomId: room.id,
        roomNumber: room.roomNumber,
        floor: room.floor,
        tenantName,
        electricPreviousReading: getPreviousReading(electricMeter),
        electricCurrentReading: getCurrentReading(electricMeter),
        waterPreviousReading: getPreviousReading(waterMeter),
        waterCurrentReading: getCurrentReading(waterMeter),
        electricService,
        waterService,
        isRecordedThisMonth:
          !!electricMeter &&
          electricMeter.recordedDate.getMonth() === now.getMonth() &&
          electricMeter.recordedDate.getFullYear() === now.getFullYear(),
        isLocked:
          !!electricMeter &&
          electricMeter.recordedDate.getMonth() === now.getMonth() &&
          electricMeter.recordedDate.getFullYear() === now.getFullYear(),
        isWarning: false,
      };
    });
  }

  async createMeterReading(dto: CreateMeterReadingDto) {
    const now = new Date();

    const billingPeriod = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, '0')}`;

    const room = await this.prismaService.room.findUnique({
      where: {
        id: dto.roomId,
      },
    });

    if (!room) {
      throw new BadRequestException('Không tìm thấy phòng');
    }

    await this.upsertMeterReading({
      roomId: dto.roomId,
      service: 'ELECTRIC',
      currentValue: dto.electricCurrent,
      billingPeriod,
      now,
    });

    await this.upsertMeterReading({
      roomId: dto.roomId,
      service: 'WATER',
      currentValue: dto.waterCurrent,
      billingPeriod,
      now,
    });

    return {
      success: true,
      message: 'Ghi nhận chỉ số điện nước thành công',
    };
  }

  private async upsertMeterReading({
    roomId,
    service,
    currentValue,
    billingPeriod,
    now,
  }: {
    roomId: string;
    service: MeterService;
    currentValue: number;
    billingPeriod: string;
    now: Date;
  }) {
    const currentMonthRecord = await this.prismaService.meter.findFirst({
      where: {
        roomId,
        service,
        billingPeriod,
      },
    });

    if (currentMonthRecord) {
      return this.prismaService.meter.update({
        where: {
          id: currentMonthRecord.id,
        },
        data: {
          currentValue,
          recordedDate: now,
        },
      });
    }

    const latestRecord = await this.prismaService.meter.findFirst({
      where: {
        roomId,
        service,
      },
      orderBy: {
        recordedDate: 'desc',
      },
    });

    return this.prismaService.meter.create({
      data: {
        roomId,
        service,

        previousValue: latestRecord?.currentValue ?? 0,
        currentValue,

        billingPeriod,
        recordedDate: now,
      },
    });
  }
}
