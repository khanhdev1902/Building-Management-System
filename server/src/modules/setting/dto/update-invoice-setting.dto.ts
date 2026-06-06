import { IsInt, Min, Max, IsNotEmpty, IsString } from 'class-validator';

export class UpdateInvoiceSettingDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

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

  lastInvoiceGeneratedAt?: string | null;
}
