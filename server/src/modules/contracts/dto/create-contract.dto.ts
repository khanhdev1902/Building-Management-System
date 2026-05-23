// src/modules/contracts/dto/create-contract.dto.ts

import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

export enum VehicleTypeEnum {
  MOTORBIKE = 'MOTORBIKE',
  ELECTRIC_BIKE = 'ELECTRIC_BIKE',
  CAR = 'CAR',
  BICYCLE = 'BICYCLE',
  OTHER = 'OTHER',
}

export class ContractVehicleDto {
  @IsEnum(VehicleTypeEnum)
  type!: VehicleTypeEnum;

  @IsString()
  licensePlate!: string;
}

export class ContractOccupantDto {
  @IsString()
  name!: string;

  @IsString()
  birthday!: string;

  @IsString()
  gender!: string;

  @IsString()
  occupation!: string;

  @IsString()
  phone!: string;

  @IsString()
  cccd!: string;

  @IsOptional()
  @IsString()
  licensePlate?: string;
}

export class ContractServiceDto {
  @IsString()
  @IsOptional()
  serviceId?: string;

  @IsString()
  name!: string;

  @IsNumber()
  price!: number;

  @IsString()
  unit!: string;
}

export class CreateContractDto {
  @IsString()
  tenantId!: string;

  @IsString()
  tenantName!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  cccd!: string;

  @IsString()
  birthday!: string;

  @IsString()
  gender!: string;

  @IsString()
  hometown!: string;

  @IsString()
  occupation!: string;

  @IsString()
  roomId!: string;

  @IsString()
  roomNumber!: string;

  @IsNumber()
  rentPrice!: number;

  @IsNumber()
  deposit!: number;

  @IsNumber()
  duration!: number;

  @IsString()
  paymentCycle!: string;

  @IsString()
  startDate!: string;

  @IsNumber()
  electricStart!: number;

  @IsNumber()
  waterStart!: number;

  @IsOptional()
  @IsString()
  province?: string;
  @IsOptional()
  @IsString()
  district?: string;
  @IsOptional()
  @IsString()
  ward?: string;
  @IsOptional()
  @IsString()
  addressDetail?: string;

  @ValidateNested({ each: true })
  @Type(() => ContractVehicleDto)
  @IsArray()
  tenantVehicles!: ContractVehicleDto[];

  @ValidateNested({ each: true })
  @Type(() => ContractOccupantDto)
  @IsArray()
  occupants!: ContractOccupantDto[];

  @ValidateNested({ each: true })
  @Type(() => ContractServiceDto)
  @IsArray()
  services!: ContractServiceDto[];
}
