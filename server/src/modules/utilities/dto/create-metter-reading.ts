import { Type } from 'class-transformer';
import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateMeterReadingDto {
  @IsUUID()
  roomId!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  electricCurrent!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  waterCurrent!: number;
}
