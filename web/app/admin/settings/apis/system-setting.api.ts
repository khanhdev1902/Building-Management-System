import { API_ENDPOINTS } from "@/services/api-endpoint";
import { apiHandler } from "@/helpers/api.helper";
import http from "@/services/http";

// Định nghĩa Type dựa chính xác trên JSON cưng vừa gửi
export interface SystemInvoiceSetting {
  id: string;
  systemName: string | null;
  systemLogo: string | null;
  supportPhone: string | null;
  supportEmail: string | null;
  defaultTenantPassword: string | null;
  invoiceGenerateDay: number; // Ngày gen hóa đơn (Ví dụ: 2)
  invoiceGenerateHour: number; // Giờ gen hóa đơn (Ví dụ: 2)
  invoiceGenerateMinute: number; // Phút gen hóa đơn (Ví dụ: 50)
  lastInvoiceGeneratedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettingResponse {
  success: boolean;
  status: string;
  code: number;
  data: SystemInvoiceSetting;
  message: string;
  timestamp: string;
}

const getServerDateTime = () =>
  apiHandler<SystemSettingResponse>(http.get(API_ENDPOINTS.SYSTEM_SETTING));

export const systemSettingApi = {
  getServerDateTime,
};
