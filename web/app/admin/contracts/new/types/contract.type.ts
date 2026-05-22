// app/admin/contracts/types/contract.type.ts
import { VehicleType } from "@/app/admin/tenants/types/tenant.type";
// ==============================
// ENUM / TYPE
// ==============================
export type ContractStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "TERMINATED";
// ==============================
// SERVICE
// ==============================
export interface ContractService {
  serviceId?: string;
  quantity?: number;
  name?: string;
  price?: number;
  unit?: string;
}

// ==============================
// OCCUPANT
// ==============================
export interface ContractOccupant {
  name: string;
  phone?: string;
  cccd?: string;
  birthday?: string;
  gender?: string;
  occupation?: string;
  licensePlate?: string;
}
// ==============================
// VEHICLE
// ==============================
export interface ContractVehicle {
  type: VehicleType | string;
  licensePlate: string;
}
// ==============================
// CONTRACT
// ==============================

export interface Contract {
  id: string;
  contractCode: string;
  tenantName: string;
  phone: string;
  email?: string;
  roomNumber: string;
  rentPrice: number;
  deposit: number;
  startDate: string;
  endDate: string;
  duration: number;
  paymentCycle: string;
  status: ContractStatus;
  createdAt: string;
  updatedAt: string;
}

// ==============================
// RESPONSE
// ==============================

export interface GetAllContractsResponse {
  success: boolean;
  status: string;
  code: number;
  data: Contract[];

  error?: {
    message: string;
  };
  message: string;
  timestamp: string;
}

// ==============================
// CREATE REQUEST
// ==============================

export interface CreateContractRequest {
  tenantName: string;
  phone: string;
  email?: string;
  cccd: string;
  birthday: string;
  gender: string;
  occupation: string;
  hometown: string;
  roomNumber: string;
  startDate: string;
  duration: number;
  rentPrice: number;
  deposit: number;
  paymentCycle: string;
  electricStart: number;
  waterStart: number;
  services: ContractService[];
  occupants: ContractOccupant[];
  tenantVehicles: ContractVehicle[];
}

// export interface UpdateContractRequest
//   extends Partial<CreateContractRequest> {}
