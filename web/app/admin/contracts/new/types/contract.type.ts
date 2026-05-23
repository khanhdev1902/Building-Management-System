// app/admin/contracts/types/contract.type.ts
import { VehicleType } from "@/app/admin/tenants/types/tenant.type";

export type ContractStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "TERMINATED";
export type DepositStatus = "PAID" | "UNPAID" | "PARTIAL";

// SERVICE
export interface ContractService {
  serviceId?: string;
  quantity?: number;
  name?: string;
  price?: number;
  unit?: string;
}

// OCCUPANT
export interface ContractOccupant {
  name: string;
  phone?: string;
  cccd?: string;
  birthday?: string;
  gender?: string;
  occupation?: string;
  licensePlate?: string;
}

// VEHICLE
export interface ContractVehicle {
  type: VehicleType | string;
  licensePlate: string;
}

// CONTRACT
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

// RESPONSE
// export interface GetAllContractsResponse {
//   success: boolean;
//   status: string;
//   code: number;
//   data: Contract[];

//   error?: {
//     message: string;
//   };
//   message: string;
//   timestamp: string;
// }

// CREATE REQUEST
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

export interface ContractTenant {
  id: string;
  userId: string;
  isHost: boolean;
  citizenId: string;
  dateOfBirth: string;
  permanentAddress: string | null;
  hometownProvince: string;
  hometownDistrict: string;
  hometownWard: string;
  hometownAddress: string;
  occupation: string;
  updatedAt: string;
}

export interface ContractRoom {
  id: string;
  roomNumber: string;
  floor: number;
  acreage: number;
  roomPrice: string;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  description: string;
  maxOccupants: number;
  createdAt: string;
}

export interface ContractResponse {
  id: string;
  room: string;
  tower: string;
  tenant: string;
  avatar: string | null;
  startDate: string | Date;
  endDate: string | Date;
  deposit: number;
  rent: number;
  status: ContractStatus | string;
  paymentStatus: DepositStatus | string;
}

export interface GetAllContractsResponse {
  success: boolean;
  status: string;
  code: number;
  data: ContractResponse[];
  error?: {
    message: string;
  };
  message: string;
  timestamp: string;
}
