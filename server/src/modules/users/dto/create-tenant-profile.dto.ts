import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTenantProfileDto {
  @IsBoolean()
  @IsOptional()
  isHost: boolean = true;

  @IsString()
  @IsNotEmpty()
  citizenId!: string; // CCCD

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth!: string;

  @IsString()
  @IsOptional()
  occupation?: string;

  @IsString()
  @IsOptional()
  permanentAddress?: string;
}
