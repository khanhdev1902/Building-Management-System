import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateReceiptDto {
  @IsUUID()
  invoiceId!: string;

  @IsOptional()
  @IsUUID()
  staffId?: string;

  @IsString()
  paymentMethod!: string;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsString()
  note?: string;
}
