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
        contracts: true,
        meters: true,
        // amenities: { include: { amenity: true } },
      },
    });
    if (!room) throw new NotFoundException(`Room with ID ${id} not found`);
    return room;
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
