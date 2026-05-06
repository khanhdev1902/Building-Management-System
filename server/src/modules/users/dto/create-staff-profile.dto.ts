import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateStaffProfileDto {
  @IsString()
  @IsNotEmpty()
  position!: string;

  @IsString()
  @IsNotEmpty()
  workStatus!: string;

  @IsNumber()
  salary!: number;
}
