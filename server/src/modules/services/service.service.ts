import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        ...data,
        price: data.price.toString(),
      },
    });
  }

  async findAll() {
    return this.prisma.service.findMany();
  }

  async findOne(id: string) {
    return this.prisma.service.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateServiceDto) {
    return this.prisma.service.update({
      where: { id },
      data: {
        ...data,
        price: data.price ? data.price.toString() : undefined,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.service.delete({ where: { id } });
  }
}
