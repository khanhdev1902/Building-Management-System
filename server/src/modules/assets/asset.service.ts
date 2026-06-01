// asset/asset.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAssetDto, CreateRoomAssetDto } from './dto/create-asset.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AssetService {
  constructor(private prismaService: PrismaService) {}

  async getAllAssets() {
    const [assets, aggregate] = await Promise.all([
      this.prismaService.asset.findMany(),
      this.prismaService.asset.aggregate({
        _sum: {
          total: true,
          active: true,
        },
      }),
    ]);

    const totalAsset = aggregate._sum.total || 0;
    const activeAsset = aggregate._sum.active || 0;

    return {
      totalAsset,
      activeAsset,
      availabeAsset: totalAsset - activeAsset,
      assets,
    };
  }

  async getAssetById(id: string) {
    const asset = await this.prismaService.asset.findUnique({
      where: { id },
    });
    if (!asset) throw new NotFoundException('Không tìm thấy tài sản này');
    return asset;
  }

  async createAsset(dto: CreateAssetDto) {
    const newCategory = await this.prismaService.asset.create({
      data: {
        name: dto.name,
        total: dto.total,
        active: dto.active,
        available: dto.total - dto.active,
        description: dto.description,
      },
    });
    return newCategory;
  }

  async updateAsset(id: string, dto: Partial<CreateAssetDto>) {
    console.log(dto);
    const asset = await this.prismaService.asset.findUnique({
      where: { id },
    });
    if (!asset) throw new NotFoundException('Không tìm thấy tài sản này');
    if (asset.active > (dto.total ?? asset.active))
      throw new BadRequestException(
        'Số lượng không được nhỏ hơn số lượng đang hoạt động!',
      );
    const updatedAsset = await this.prismaService.asset.update({
      where: { id },
      data: {
        name: dto.name ?? asset.name,
        total: dto.total ?? asset.total,
        active: dto.active ?? asset.active,
        available: dto.available ?? dto.total ?? asset.total - asset.active,
        description: dto.description ?? asset.description,
      },
    });
    return updatedAsset;
  }

  async deleteAsset(id: string) {
    const asset = await this.prismaService.asset.findUnique({
      where: { id },
    });
    if (!asset) throw new NotFoundException('Không tìm thấy tài sản này');

    // Kiểm tra xem danh mục có đang chứa thiết bị nào không
    const hasAssets = await this.prismaService.asset.count({
      where: { id, roomAssets: { some: {} } },
    });
    if (hasAssets > 0) {
      throw new BadRequestException(
        'Không thể xóa tài sản đang có chứa thiết bị',
      );
    }

    return this.prismaService.asset.delete({
      where: { id },
    });
  }

  async getAllRoomAssets() {
    const roomAssets = await this.prismaService.roomAsset.findMany({
      include: {
        room: { select: { roomNumber: true } },
        asset: { select: { name: true } },
      },
    });
    return roomAssets.map((ra) => ({
      assetId: ra.assetId,
      roomId: ra.roomId,
      roomNumber: ra.room.roomNumber,
      assetName: ra.asset.name,
      assetQuantity: ra.quantity,
      assetStatus: ra.status,
    }));
  }

  async getRoomAssetById(assetId: string, roomId: string) {
    const roomAsset = await this.prismaService.roomAsset.findUnique({
      where: { assetId_roomId: { assetId, roomId } },
    });
    if (!roomAsset)
      throw new NotFoundException(
        'Không tìm thấy thiết bị (Serial Number) này',
      );
    return roomAsset;
  }

  async createRoomAsset(dto: CreateRoomAssetDto) {
    const newRoomAsset = await this.prismaService.roomAsset.create({
      data: {
        roomId: dto.roomId,
        assetId: dto.assetId,
        quantity: dto.quantity ? parseInt(dto.quantity) : 1,
        status: dto.status ?? 'Ổn định',
      },
    });

    return newRoomAsset;
  }

  async updateRoomAsset(dto: Partial<CreateRoomAssetDto>) {
    if (!dto.roomId || !dto.assetId) {
      throw new BadRequestException(
        'roomId và assetId là bắt buộc để cập nhật',
      );
    }
    const roomAsset = await this.prismaService.roomAsset.findUnique({
      where: {
        assetId_roomId: { assetId: dto.assetId, roomId: dto.roomId },
      },
    });
    if (!roomAsset)
      throw new NotFoundException(
        'Không tìm thấy thiết bị (Serial Number) này',
      );
    const updatedRoomAsset = await this.prismaService.roomAsset.update({
      where: {
        assetId_roomId: { assetId: dto.assetId, roomId: dto.roomId },
      },
      data: {
        quantity: dto.quantity ? parseInt(dto.quantity) : roomAsset.quantity,
        status: dto.status ?? roomAsset.status,
      },
    });
    return updatedRoomAsset;
  }

  async deleteRoomAsset(assetId: string, roomId: string) {
    const roomAsset = await this.prismaService.roomAsset.findUnique({
      where: { assetId_roomId: { assetId, roomId } },
    });
    if (!roomAsset)
      throw new NotFoundException(
        'Không tìm thấy thiết bị (Serial Number) này',
      );
    await this.prismaService.roomAsset.delete({
      where: { assetId_roomId: { assetId, roomId } },
    });
    return { message: 'Xóa thiết bị thành công' };
  }
}
