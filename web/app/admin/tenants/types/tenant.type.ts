export type TenantStatus = "PENDING" | "ACTIVE" | "EXPIRING" | "MOVED_OUT";

export enum VehicleTypeEnum {
  MOTORBIKE = "MOTORBIKE",
  ELECTRIC_BIKE = "ELECTRIC_BIKE",
  CAR = "CAR",
  BICYCLE = "BICYCLE",
  OTHER = "OTHER",
}

export type VehicleType =
  | VehicleTypeEnum.MOTORBIKE
  | VehicleTypeEnum.CAR
  | VehicleTypeEnum.BICYCLE
  | VehicleTypeEnum.ELECTRIC_BIKE
  | VehicleTypeEnum.OTHER;

export interface Vehicle {
  id: string;
  tenantId: string;
  type: VehicleType;
  licensePlate: string;
  brand: string | null;
  model: string | null;
  color: string | null;
  registrationImage: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TenantHometown {
  province: string;
  district: string;
  ward: string;
  address: string;
}

export interface Tenant {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  identityVerified?: any; // Thêm trường này để hỗ trợ bộ lọc trạng thái "unverified"
  id: string;
  fullName: string;
  avataUrl: string | null;
  email: string | null;
  phone: string;
  gender: string;
  citizenId: string;
  dateOfBirth?: string;
  occupation: string;
  roomNumber: string | null;
  contractStartDate: string | null;
  contractEndDate: string | null;
  status: TenantStatus;
  hometown: TenantHometown;
  vehicles: Vehicle[];
}

export interface GetAllTenantsResponse {
  success: boolean;
  status: string;
  code: number;
  data: Tenant[];
  error?: {
    message: string;
  };
  message: string;
  timestamp: string;
}

export interface CreateTenantVehicleRequest {
  licensePlate: string;
  type: VehicleType;
  brand?: string;
  model?: string;
  color?: string;
}

export interface CreateTenantRequest {
  name: string;
  phone: string;
  email?: string;
  birthday: string;
  gender: string;
  occupation: string;
  cccd: string;
  cccdFrontImage?: string;
  cccdBackImage?: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  role?: string;
  vehicles: CreateTenantVehicleRequest[];
}

// export interface UpdateTenantRequest extends Partial<CreateTenantRequest> {}
