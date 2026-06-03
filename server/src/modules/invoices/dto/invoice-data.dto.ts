import { InvoiceItemDto } from './invoice-item.dto';

export class InvoiceDataDto {
  roomId!: string;
  roomNumber!: string | number;
  contractId!: string;
  tenantName!: string;
  totalAmount!: number;
  billingPeriod!: string;
  items!: InvoiceItemDto[];

  meterIds!: {
    electric?: number;
    water?: number;
  };
}
