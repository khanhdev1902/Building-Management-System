import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsNotEmpty()
  price!: number; // Trong DTO dùng number cho dễ handle từ client

  @IsString()
  @IsNotEmpty()
  unit!: string;

  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsString()
  @IsOptional()
  iconKey?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
