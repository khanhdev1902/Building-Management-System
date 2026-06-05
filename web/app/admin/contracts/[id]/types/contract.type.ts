export interface ContractDetailResponse {
  success: boolean;
  status: string;
  code: number;
  data: ContractDetail;
  message: string;
  timestamp: string;
}

export interface ContractDetail {
  id: string;
  roomNumber: string;
  tower: string;
  rentPrice: number;
  deposit: number;
  startDate: Date;
  endDate: Date;
  paymentCycle: string;
  status: ContractStatus;

  initialCounters: InitialCounters;
  primaryTenant: PrimaryTenant;

  occupants: Occupant[];
  services: Service[];
  billingHistory: BillingHistory[];
  assets: Asset[];
  timeline: TimelineItem[];
}

export type ContractStatus = "ACTIVE" | "INACTIVE" | "EXPIRED" | "TERMINATED";

export interface InitialCounters {
  electric: number;
  water: number;
}

export interface PrimaryTenant {
  name: string;
  phone: string;
  email: string;
  cccd: string;
  dateOfBirth: string;
  occupation: string;
  avatar: string;
  hometown: string;
  identityVerified: boolean;
}

export interface Occupant {
  name: string;
  cccd: string;
  relation?: string;
  licensePlate?: string;
  dateOfBirth: string;
  hometownAddress: string;
  gender: string;
  phone: string;
  occupation: string;
}

export interface Service {
  name: string;
  price: number;
  unit: string;
}

export interface BillingHistory {
  invoiceId: string;
  month: string;
  amount: number;
  status: InvoiceStatus;
  paidDate: string;
}

export type InvoiceStatus = "paid" | "unpaid" | "partial" | "overdue";

export interface Asset {
  name: string;
  quantity: number;
  status: string;
}

export interface TimelineItem {
  date: string;
  action: string;
  user: string;
}
