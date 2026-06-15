export type ContractStatus = "ACTIVE" | "EXPIRING" | "EXPIRED" | "TERMINATED";

export type RoommateStatus = "ACTIVE" | "PENDING" | "REJECTED";

export interface LessorInfo {
  name: string;
  representative: string;
  phone: string;
}

export interface LesseeInfo {
  name: string;
  idNo: string;
  phone: string;
}

export interface ContractTerms {
  building: string;
  room: string;
  durationMonths: number;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount: number;
  paymentCycle: string;
}

export interface Roommate {
  name: string;
  phoneMasked: string;
  idNoMasked: string;
  status: RoommateStatus;
  relationship: string;
}

export interface ContractRule {
  title: string;
  content: string;
}

export interface ContractDetail {
  id: string;
  contractNo: string;
  status: ContractStatus;
  createdAt: string;
  signedAt: string;
  lessor: LessorInfo;
  lessee: LesseeInfo;
  terms: ContractTerms;
  roommates: Roommate[];
  rules: ContractRule[];
}
