import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from './dto';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRoomDto) {
    const existingRoom = await this.prisma.room.findFirst({
      where: { roomNumber: dto.roomNumber },
    });

    if (existingRoom) {
      throw new BadRequestException(
        `Room with number ${dto.roomNumber} already exists`,
      );
    }

    const newRoom = await this.prisma.room.create({
      data: {
        roomNumber: dto.roomNumber,
        roomPrice: dto.roomPrice,
        floor: dto.floor,
        acreage: dto.acreage,
        description: dto.description,
        maxOccupants: dto.maxOccupants,
      },
    });

    // room_services
    if (dto.serviceIds?.length) {
      await this.prisma.roomService.createMany({
        data: dto.serviceIds.map((serviceId) => ({
          roomId: newRoom.id,
          serviceId,
        })),
        skipDuplicates: true,
      });
    }

    // room_assets
    if (dto.amenities?.length) {
      await this.prisma.roomAsset.createMany({
        data: dto.amenities.map((assetId) => ({
          roomId: newRoom.id,
          assetId,
          status: 'Active',
        })),
        skipDuplicates: true,
      });
    }

    return this.prisma.room.findUnique({
      where: {
        id: newRoom.id,
      },
      include: {
        roomServices: {
          include: {
            service: true,
          },
        },
        roomAssets: {
          include: {
            asset: true,
          },
        },
      },
    });
  }

  async findAll() {
    const rooms = await this.prisma.room.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        roomAssets: {
          include: {
            asset: true,
          },
        },
        roomServices: {
          include: {
            service: true,
          },
        },
        contracts: {
          where: {
            status: 'ACTIVE',
          },
          take: 1,
          include: {
            tenant: {
              include: {
                user: true,
              },
            },
          },
        },
        _count: {
          select: {
            contracts: true,
          },
        },
      },
    });

    return rooms.map((room) => {
      const activeContract = room.contracts[0];
      return {
        id: room.id,
        roomNumber: room.roomNumber,
        type: '',
        status: room.status,
        roomPrice: room.roomPrice,
        floor: room.floor,
        acreage: room.acreage,
        description: room.description,
        maxOccupants: room.maxOccupants,
        tenant: activeContract
          ? {
              name:
                activeContract.tenant.user.lastName +
                activeContract.tenant.user.firstName,
              phone: activeContract.tenant.user.phone,
              startDate: activeContract.startDate,
              endDate: activeContract.endDate,
            }
          : null,

        // services: room.roomServices.reduce(
        //   (acc, rs) => {
        //     acc[rs.service.name] = Number(rs.service.price);
        //     return acc;
        //   },
        //   {} as Record<string, number>,
        // ),
        services: room.roomServices.map((rs) => ({
          id: rs.serviceId,
          name: rs.service.name,
          price: rs.service.price,
          unit: rs.service.unit,
        })),
        serviceIds: room.roomServices.map((rs) => rs.serviceId),
        amenities: room.roomAssets.map((ra) => ra.asset.id),
        totalContracts: room._count.contracts,
      };
    });
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        roomServices: {
          include: {
            service: true,
          },
        },
        contracts: {
          include: {
            roommates: true,
            tenant: {
              include: { user: true },
            },
          },
        },
        meters: true,
        // amenities: { include: { amenity: true } },
      },
    });
    if (!room) throw new NotFoundException(`Room with ID ${id} not found`);
    const contractActive = room.contracts.find((c) => c.status === 'ACTIVE');
    const tenant = contractActive?.tenant;
    const today = new Date();

    const duration = contractActive?.endDate
      ? Math.ceil(
          (new Date(contractActive.endDate).getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;
    return {
      roomNumber: room.roomNumber,
      type: 'Studio',
      floor: room.floor,
      area: room.acreage,
      price: room.roomPrice,
      deposit: contractActive?.deposit.toNumber() ?? '0',
      status: room.status,
      duration: duration,
      tenant: tenant
        ? {
            representative: {
              name: `${tenant?.user.lastName} ${tenant?.user.firstName}`,
              phone: tenant?.user.phone,
              email: tenant?.user.email,
              cccd: tenant?.citizenId,
              startDate: '20/03/2026',
              gender: tenant.user.gender,
              dateOfBirth: tenant.dateOfBirth,
              hometown: tenant.hometownProvince,
            },
            members: contractActive.roommates.map((rm) => ({
              id: rm.id,
              name: rm.fullName,
              role: 'Thành viên',
              phone: rm.phone,
            })),
          }
        : {},
      meteredServices: room.roomServices.map((rs) => ({
        id: rs.service.id,
        name: rs.service.name,
        price: rs.service.price.toNumber(),
        unit: rs.service.unit,
        type:
          rs.service.name === 'Điện'
            ? 'electric'
            : rs.service.name === 'Nước'
              ? 'water'
              : rs.service.type,
        lastIndex:
          rs.service.name === 'Điện'
            ? room.meters.filter((m) => m.service === 'ELECTRIC')[0]
                .currentValue
            : rs.service.name === 'Nước'
              ? room.meters.filter((m) => m.service === 'WATER')[0].currentValue
              : 0,
      })),

      fixedServices: [
        {
          id: 'f1',
          name: 'Internet (Gói Pro)',
          price: 200000,
          unit: 'phòng',
        },
        {
          id: 'f2',
          name: 'Quản lý & Vệ sinh',
          price: 150000,
          unit: 'phòng',
        },
        {
          id: 'f3',
          name: 'Gửi xe máy',
          price: 150000,
          unit: 'xe (x2)',
        },
      ],
      contract: {
        id: contractActive?.id,
        duration: '12 tháng',
        expiryDate: contractActive?.endDate.toLocaleDateString('vi-VN'),
        status: contractActive?.status,
      },
    };
  }

  async update(roomId: string, dto: UpdateRoomDto) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Update thông tin phòng
      await tx.room.update({
        where: { id: roomId },
        data: {
          roomNumber: dto.roomNumber,
          roomPrice: dto.roomPrice,
          floor: dto.floor,
          acreage: dto.acreage,
          description: dto.description,
          maxOccupants: dto.maxOccupants,
          // type: dto.type,
          status: dto.status,
        },
      });

      // 2. Update services
      // Xóa toàn bộ relation cũ
      await tx.roomService.deleteMany({
        where: { roomId },
      });

      // Add lại relation mới
      if (dto.serviceIds?.length) {
        await tx.roomService.createMany({
          data: dto.serviceIds.map((serviceId) => ({
            roomId,
            serviceId,
          })),
          skipDuplicates: true,
        });
      }

      // 3. Update assets / amenities
      // Xóa relation cũ
      await tx.roomAsset.deleteMany({
        where: { roomId },
      });

      // Add lại relation mới
      if (dto.amenities?.length) {
        await tx.roomAsset.createMany({
          data: dto.amenities.map((assetId) => ({
            roomId,
            assetId,
            status: 'Active',
          })),
          skipDuplicates: true,
        });
      }

      // 4. Return data mới nhất
      return await tx.room.findUnique({
        where: { id: roomId },
        include: {
          roomServices: {
            include: {
              service: true,
            },
          },

          roomAssets: {
            include: {
              asset: true,
            },
          },
        },
      });
    });
  }

  async remove(id: string) {
    const deleteRoom = await this.prisma.room.delete({ where: { id } });
    return deleteRoom;
  }
}
