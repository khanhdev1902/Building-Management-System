import { IsInt, Max, Min } from 'class-validator';

export class CreateSettingDto {
  @IsInt()
  @Min(1)
  @Max(31)
  invoiceGenerateDay!: number;

  @IsInt()
  @Min(0)
  @Max(23)
  invoiceGenerateHour!: number;

  @IsInt()
  @Min(0)
  @Max(59)
  invoiceGenerateMinute!: number;
}
