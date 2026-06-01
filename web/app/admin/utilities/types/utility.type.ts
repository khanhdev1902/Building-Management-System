export interface UtilityService {
  id: string;
  name: string;
  price: number;
  unit: string;
}

export interface Utility {
  roomId: string;
  roomNumber: string;
  floor: string | number;

  tenantName: string;

  electricPreviousReading: number;
  electricCurrentReading: number;

  waterPreviousReading: number;
  waterCurrentReading: number;

  electricService: UtilityService | null;
  waterService: UtilityService | null;

  isRecordedThisMonth: boolean;
  isLocked: boolean;
  isWarning: boolean;
}

export interface GetAllUtilitiesResponse {
  success: boolean;
  code: number;
  message: string;
  data: Utility[];
}

export interface CreateMeterReadingRequest {
  roomId: string;

  electricCurrent: number;
  waterCurrent: number;
}

export interface CreateUtilityRequest {
  roomId: string;

  electricUsage: number;
  waterUsage: number;

  month: number;
  year: number;
}
