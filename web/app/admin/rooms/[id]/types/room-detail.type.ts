// 1. KIỂU DỮ LIỆU CON CHO PHÂN HỆ CƯ DÂN (TENANT)
export interface Representative {
  name: string;
  phone: string;
  email: string;
  cccd: string;
  startDate: string; // Định dạng dd/mm/yyyy
}

export interface RoomMember {
  id: number;
  name: string;
  role: string; // e.g., "Thành viên"
}

export interface TenantInfo {
  representative: Representative;
  members: RoomMember[];
}

// 2. KIỂU DỮ LIỆU CON CHO DỊCH VỤ SỬ DỤNG (SERVICES)
export interface MeteredService {
  id: string;
  name: string; // e.g., "Điện", "Nước"
  price: number;
  unit: string; // e.g., "kWh", "m3"
  lastIndex: number;
  type: "electric" | "water"; // Ép cứng kiểu thiết bị
}

export interface FixedService {
  id: string;
  name: string; // e.g., "Internet", "Gửi xe máy"
  price: number;
  unit: string; // e.g., "phòng", "xe (x2)"
}

// 3. KIỂU DỮ LIỆU CHỨNG TỪ (CONTRACT)
export interface RoomContract {
  id: string;
  duration: string; // e.g., "12 tháng"
  expiryDate: string; // Định dạng dd/mm/yyyy
  status: "active" | "expired" | "terminated"; // Trạng thái hợp đồng
}

// 4. KIỂU DỮ LIỆU CORE DATA CỦA PHÒNG
export interface RoomDetailData {
  roomNumber?: string;
  type: string; // e.g., "Studio Deluxe"
  floor: string;
  area: string; // Lượng diện tích m²
  price: number;
  deposit: number;
  status: "OCCUPIED" | "AVAIABLE" | "MAINTENANCE"; 
  tenant: TenantInfo;
  meteredServices: MeteredService[];
  fixedServices: FixedService[];
  contract: RoomContract;
}

// 5. WRAPPER NGOÀI CÙNG CHO CHUẨN API RESPONSE CHUNG CỦA HỆ THỐNG
export interface ApiResponse<T> {
  success: boolean;
  status: string; // e.g., "OK"
  code: number;
  data: T;
  message: string;
  timestamp: string; // ISO String Date
}

export type RoomDetailResponse = ApiResponse<RoomDetailData>;
