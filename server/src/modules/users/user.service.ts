import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, UserRole } from 'src/generated/prisma/client';
import { CreateUserDto, FindAllUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const { tenantProfile, staffProfile, password, ...userData } = dto;

    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { phone: dto.phone }] },
    });
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { citizenId: tenantProfile?.citizenId },
    });
    if (existingUser)
      throw new ConflictException('Email hoặc số điện thoại đã tồn tại');
    if (tenantProfile?.citizenId && existingTenant)
      throw new ConflictException('Citizen ID đã tồn tại');

    const passwordHash = await bcrypt.hash(password, 10);

    const createData: Prisma.UserCreateInput = {
      ...userData,
      passwordHash,
    };

    if (dto.role === UserRole.TENANT && tenantProfile) {
      createData.tenantProfile = {
        create: {
          ...tenantProfile,
          dateOfBirth: new Date(tenantProfile.dateOfBirth), // Ép kiểu Date
        },
      };
    } else if (
      (dto.role === UserRole.STAFF || dto.role === UserRole.MANAGER) &&
      staffProfile
    ) {
      createData.staffProfile = { create: staffProfile };
    }

    return this.prisma.user.create({
      data: createData,
      include: { tenantProfile: true, staffProfile: true },
    });
  }

  async findAll(query: FindAllUserDto) {
    const { role, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Xây dựng điều kiện lọc động
    const where: {
      isActive: boolean;
      role?: UserRole;
      OR?: Prisma.UserWhereInput['OR'];
    } = {
      isActive: true, // Chỉ lấy những user đang hoạt động
      ...(role && { role }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          {
            tenantProfile: {
              citizenId: { contains: search, mode: 'insensitive' },
            },
          },
          {
            staffProfile: {
              position: { contains: search, mode: 'insensitive' },
            },
          },
        ],
      }),
    };

    // Chạy song song để tối ưu tốc độ: vừa lấy data vừa đếm tổng số bản ghi
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          tenantProfile: true,
          staffProfile: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users: data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        staffProfile: true,
        tenantProfile: true,
      },
    });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const { tenantProfile, staffProfile, ...userData } = dto;

    // Nếu có update password thì mới hash lại
    // if (userData.password) {
    //   userData.passwordHash = await bcrypt.hash(userData.password, 10);
    //   delete userData.password;
    // }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        ...(tenantProfile ? { tenantProfile: { update: tenantProfile } } : {}),
        ...(staffProfile ? { staffProfile: { update: staffProfile } } : {}),
      },
      include: { tenantProfile: true, staffProfile: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }

  // --- CÁC PHƯƠNG THỨC BỔ SUNG CẦN THIẾT ---

  // Tìm bằng email (Phục vụ cho tính năng Login/Auth sau này)
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Đổi trạng thái hoạt động (Khóa tài khoản cư dân khi họ dọn đi)
  async toggleStatus(id: string) {
    const user = await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });
  }
}
