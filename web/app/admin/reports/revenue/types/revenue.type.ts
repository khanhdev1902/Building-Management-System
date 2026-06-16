// src/app/revenue/types/revenue.type.ts

// ─── STATUS & VIEW TYPES ──────────────────────────────────────────────────────
export type StatusType = "Paid" | "Pending" | "Overdue";
export type ViewMode = "month" | "quarter" | "year";

// ─── MAIN TRANSACTION TYPE ────────────────────────────────────────────────────
export interface Transaction {
  id: string; // Mã hóa đơn độc nhất (Ví dụ: INV-2601)
  room: string; // Số phòng vận hành (Ví dụ: P.101)
  name: string; // Tên cư dân / Chủ hộ đại diện
  amount: number; // Số tiền hóa đơn (Kiểu số nguyên để tính toán Recharts / KPI)
  status: StatusType; // Trạng thái: Đã thu | Chờ khớp | Quá hạn
  method: string; // Kênh thanh toán: VietQR, Chuyển khoản, Tiền mặt...
  date: string; // Định dạng ISO chuẩn: yyyy-mm-dd để đối soát thời gian
}

// ─── CHART STRUCTURE TYPE ─────────────────────────────────────────────────────
export interface ChartEntry {
  label: string; // Nhãn trục X (Ví dụ: T1, T2, Q1, 2026...)
  revenue: number; // Dòng tiền thực thu lũy kế (Đơn vị: Triệu VND)
  debt: number; // Công nợ quá hạn lũy kế (Đơn vị: Triệu VND)
}
