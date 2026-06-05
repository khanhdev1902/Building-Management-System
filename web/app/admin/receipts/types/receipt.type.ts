export interface Receipt {
  id: string;
  receiptCode: string;

  invoiceId: string;
  staffId?: string | null;

  room: string;
  tenant: string;

  type: string;

  collectedBy: string;

  referenceNo: string;

  paymentMethod: string;
  amount: number;
  note?: string | null;

  receiptDate: string;
  status: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateReceiptDto {
  invoiceId: string;
  staffId?: string;

  paymentMethod: string;
  amount: number;
  note?: string;
}
