import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { VehicleType } from 'src/generated/prisma/enums';

export class VehicleDto {
  @IsString()
  @IsNotEmpty()
  licensePlate!: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @IsEnum(VehicleType)
  type!: VehicleType;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  color?: string;
}

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone!: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @IsDateString({}, { message: 'Ngày sinh không hợp lệ' })
  birthday!: string;

  @IsString()
  @IsNotEmpty()
  gender!: string;

  @IsString()
  @IsNotEmpty()
  occupation!: string;

  @IsString()
  @IsNotEmpty()
  cccd!: string;

  @IsOptional()
  @IsString()
  cccdFrontImage?: string;

  @IsOptional()
  @IsString()
  cccdBackImage?: string;

  @IsString()
  @IsNotEmpty()
  province!: string;

  @IsString()
  @IsNotEmpty()
  district!: string;

  @IsString()
  @IsNotEmpty()
  ward!: string;

  @IsString()
  @IsNotEmpty()
  addressDetail!: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VehicleDto)
  vehicles!: VehicleDto[];
}
