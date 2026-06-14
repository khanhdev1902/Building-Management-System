export interface InvoiceItem {
  itemName: string;
  type: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subTotal: number;
  previousReading: number | null;
  currentReading: number | null;
}

export interface Invoice {
  id: string;
  qrUrl: string;
  roomNumber: string;
  tenantName: string;
  totalAmount: number;
  billingPeriod: string;
  status: string;
  dueDate: string;
  invoiceItems: InvoiceItem[];
}

export type GetAllInvoicesResponse = {
  success: boolean;
  data: Invoice[];
  message: string;
  statusCode: number;
};
