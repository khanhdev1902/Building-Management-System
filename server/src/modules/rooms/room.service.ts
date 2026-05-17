import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateRoomDto } from './dto';

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

        services: room.roomServices.reduce(
          (acc, rs) => {
            acc[rs.service.name] = Number(rs.service.price);
            return acc;
          },
          {} as Record<string, number>,
        ),

        amenities: room.roomAssets.map((ra) => ra.asset.name),

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

  async update(id: string, data: Prisma.RoomUpdateInput) {
    return this.prisma.room.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const deleteRoom = await this.prisma.room.delete({ where: { id } });
    return deleteRoom;
  }
}
