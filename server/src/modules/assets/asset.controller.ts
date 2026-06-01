// asset/asset.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto, CreateRoomAssetDto } from './dto/create-asset.dto';
import { ApiResponse } from 'src/common/responses/api-response';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  // =========================
  // Asset
  // =========================

  @Get()
  async getAllAssets() {
    const assets = await this.assetService.getAllAssets();
    return ApiResponse.success(
      assets,
      'Lấy data danh sách tài sản thành công!',
      200,
    );
  }

  @Get(':id')
  async getAssetById(@Param('id') id: string) {
    const asset = await this.assetService.getAssetById(id);
    return ApiResponse.success(asset, 'Lấy data tài sản thành công!', 200);
  }

  @Post()
  async createAsset(@Body() dto: CreateAssetDto) {
    const newAsset = await this.assetService.createAsset(dto);
    return ApiResponse.success(newAsset, 'Thêm mới asset thành công!', 201);
  }

  @Patch(':id')
  updateAsset(@Param('id') id: string, @Body() dto: Partial<CreateAssetDto>) {
    return this.assetService.updateAsset(id, dto);
  }

  @Delete(':id')
  deleteAsset(@Param('id') id: string) {
    return this.assetService.deleteAsset(id);
  }

  // =========================
  // Room Asset
  // =========================

  @Get('room-assets/all')
  async getAllRoomAssets() {
    console.log('room-assets');
    const roomAssets = await this.assetService.getAllRoomAssets();
    return ApiResponse.success(
      roomAssets,
      'Lấy danh sách thiết bị theo phòng thành công!',
      200,
    );
  }

  @Get('room-assets/:assetId/:roomId')
  getRoomAssetById(
    @Param('assetId') assetId: string,
    @Param('roomId') roomId: string,
  ) {
    return this.assetService.getRoomAssetById(assetId, roomId);
  }

  @Post('room-assets')
  createRoomAsset(@Body() dto: CreateRoomAssetDto) {
    return this.assetService.createRoomAsset(dto);
  }

  @Patch('room-assets')
  updateRoomAsset(@Body() dto: Partial<CreateRoomAssetDto>) {
    return this.assetService.updateRoomAsset(dto);
  }

  @Delete('room-assets/:assetId/:roomId')
  deleteRoomAsset(
    @Param('assetId') assetId: string,
    @Param('roomId') roomId: string,
  ) {
    return this.assetService.deleteRoomAsset(assetId, roomId);
  }
}
