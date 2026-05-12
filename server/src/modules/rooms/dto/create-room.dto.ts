import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
  IsEnum,
} from 'class-validator';

import { Type } from 'class-transformer';
import { RoomStatus as RoomStatusEnum } from 'src/generated/prisma/enums';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty({ message: 'Số phòng không được để trống' })
  roomNumber!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Tầng không hợp lệ' })
  floor!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Diện tích không hợp lệ' })
  acreage!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Giá phòng không hợp lệ' })
  roomPrice!: number;

  @IsEnum(RoomStatusEnum, {
    message: 'Trạng thái phòng không hợp lệ',
  })
  @IsOptional()
  status?: RoomStatusEnum;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'Số người tối đa phải lớn hơn 0' })
  maxOccupants!: number;

  @IsString()
  @IsOptional()
  type?: string;
}
