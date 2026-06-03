export class InvoiceItemDto {
  type!: string;
  itemName!: string;
  quantity!: number;
  unit!: string;
  unitPrice!: number;
  subTotal!: number;
  previousReading!: number | null;
  currentReading!: number | null;
  meterId?: number;
}
