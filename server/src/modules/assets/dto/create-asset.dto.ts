// asset/dto/create-asset.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  total!: number;

  @IsOptional()
  active: number = 0;

  @IsOptional()
  available: number = 0;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateRoomAssetDto {
  @IsString()
  @IsNotEmpty()
  roomId!: string;

  @IsString()
  @IsNotEmpty()
  assetId!: string;

  @IsOptional()
  quantity?: string;

  @IsEnum(['Ổn định', 'Bảo trì', 'Cần sửa chữa'])
  @IsOptional()
  status?: 'Ổn định' | 'Bảo trì' | 'Cần sửa chữa';
}
