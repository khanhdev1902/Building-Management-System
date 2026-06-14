export type BillingStatus = "PAID" | "UNPAID";

export type InvoiceDetailType = "BASE" | "USAGE" | "DEDUCTION";

export interface UrgentNotice {
  id: string;
  title: string;
  time: string;
  content: string;
}

export interface Vehicle {
  type: string;
  plate: string;
  cardNo: string;
}

export interface Assets {
  vehicles: Vehicle[];
  gateCard: string;
}

export interface InvoiceDetail {
  name: string;
  cost: number;
  type: InvoiceDetailType;
  unit: string;
  currentReading?: number;
  previousReading?: number;
  quantity: number;
}

export interface UsageHistory {
  month: string;
  value: number;
}

export interface ElectricityUsage {
  oldIndex: number;
  newIndex: number;
  total: number;
  checkDate: string;
  history: UsageHistory[];
}

export interface WaterUsage {
  oldIndex: number;
  newIndex: number;
  total: number;
  checkDate: string;
}

export interface InvoiceUsage {
  electricity: ElectricityUsage;
  water: WaterUsage;
}

export interface Invoice {
  id: string;
  period: string;
  dueDate: string;
  issueDate: string;
  totalAmount: number;
  details: InvoiceDetail[];
  usage: InvoiceUsage;
  rawDescription: string;
  qrUrl: string;
}

export interface TenantDashboardData {
  resident: string;
  room: string;
  building: string;
  billingStatus: BillingStatus;
  contractId: string;
  urgentNotice: UrgentNotice;
  assets: Assets;
  invoice: Invoice;
}
