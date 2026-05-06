import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateStaffProfileDto } from './create-staff-profile.dto';
import { CreateTenantProfileDto } from './create-tenant-profile.dto';
import { UserRole } from 'src/generated/prisma/enums';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải ít nhất 6 ký tự' })
  password!: string;

  @IsEnum(UserRole, { message: 'Role không hợp lệ' })
  @IsNotEmpty()
  role!: UserRole;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  // Dùng để nhận dữ liệu Tenant nếu role là TENANT
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateTenantProfileDto)
  tenantProfile?: CreateTenantProfileDto;

  // Dùng để nhận dữ liệu Staff nếu role là STAFF/MANAGER
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateStaffProfileDto)
  staffProfile?: CreateStaffProfileDto;
}
