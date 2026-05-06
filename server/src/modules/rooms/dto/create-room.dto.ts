import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
  IsEnum,
} from 'class-validator';
import { RoomStatus as RoomStatusEnum } from 'src/generated/prisma/enums';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty({ message: 'Số phòng không được để trống' })
  roomNumber!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  floor!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  acreage!: number; // Diện tích

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  roomPrice!: number;

  @IsEnum(RoomStatusEnum, { message: 'Trạng thái phòng không hợp lệ' })
  @IsOptional()
  status?: RoomStatusEnum;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  maxOccupants!: number;
}
