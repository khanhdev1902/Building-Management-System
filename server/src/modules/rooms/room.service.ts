import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateRoomDto } from './dto';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRoomDto) {
    const existingRoom = await this.prisma.room.findFirst({
      where: { roomNumber: data.roomNumber },
    });
    if (existingRoom) {
      throw new NotFoundException(
        `Room with number ${data.roomNumber} already exists`,
      );
    }
    const newRoom = await this.prisma.room.create({ data });
    return newRoom;
  }

  async findAll() {
    return this.prisma.room.findMany({
      include: {
        _count: { select: { contracts: true } }, // Đếm số hợp đồng
      },
    });
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        contracts: true,
        meters: true,
        amenities: { include: { amenity: true } },
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
