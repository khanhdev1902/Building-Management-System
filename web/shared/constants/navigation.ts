import {
  LayoutDashboard,
  Building2,
  UserCheck,
  MessageSquare,
  Users,
  Receipt,
  Settings,
  ShieldCheck,
  History,
  CreditCard,
  BarChart3, // Thống kê
  Clock, // Ca làm việc
} from "lucide-react";

export const navigation = {
  // 1. QUẢN TRỊ CHIẾN LƯỢC
  analytics: [
    { title: "Tổng quan chung cư", icon: LayoutDashboard, url: "/admin/dashboard" },
    {
      title: "Báo cáo & Thống kê",
      icon: BarChart3,
      children: [
        {
          title: "Báo cáo doanh thu",
          url: "/admin/reports/revenue",
        },
        { title: "Chi phí vận hành", url: "/admin/reports/expenses" },
        { title: "Tỷ lệ lấp đầy & Biến động", url: "/admin/reports/occupancy" },
        //{ title: "Báo cáo kỹ thuật/Bảo trì", url: "/admin/reports/maintenance" }, //Theo dõi sức khỏe tòa nhà
      ],
    },
  ],

  // 2. VẬN HÀNH & HẠ TẦNG
  operation: [
    {
      title: "Quản lý hạ tầng",
      icon: Building2,
      children: [
        // { title: "Sơ đồ tòa nhà", url: "/admin/buildings" },
        { title: "Quản lý phòng", url: "/admin/rooms" },
        { title: "Quản lý dịch vụ", url: "/admin/services" },
        { title: "Tài sản & Thiết bị", url: "/admin/assets" }, //Quản lý thiết bị chung
        { title: "Quản lý điện nước", url: "/admin/utilities" },
      ],
    },
    {
      title: "Cư dân & Hợp đồng",
      icon: UserCheck,
      children: [
        { title: "Quản lý cư dân", url: "/admin/tenants" },
        { title: "Quản lý hợp đồng", url: "/admin/contracts" },
        // { title: "Quản lý thẻ (Xe/Thang máy)", url: "/admin/cards" },
        // { title: "Quản lý gửi xe", url: "/admin/parking" },
      ],
    },
  ],

  // 3. DỊCH VỤ KHÁCH HÀNG (Interaction)
  services: [
    {
      title: "Kênh tương tác",
      icon: MessageSquare,
      children: [
        { title: "Nhóm chat nội bộ", url: "/admin/chats" },
        { title: "Bảng tin thông báo", url: "/admin/notifications" },
        { title: "Yêu cầu sửa chữa", url: "/admin/maintenance" },
        //{ title: "Đặt lịch tiện ích (BBQ/Gym)", url: "/admin/amenities" }, //Mới
        //{ title: "Phản hồi & Khiếu nại", url: "/admin/feedback" }, //Cư dân phàn nàn
      ],
    },
    {
      title: "Tài chính cư dân",
      icon: Receipt,
      children: [
        {
          title: "Hóa đơn tháng",
          url: "/admin/invoices",
          permission: "invoice.view",
        },
        //{ title: "Đối soát cổng thanh toán", url: "/finance/gateways" },
      ],
    },
  ],

  // 4. NHÂN SỰ & NỘI BỘ
  management: [
    {
      title: "Nhân sự & Công việc",
      icon: Users,
      children: [
        { title: "Quản lý nhân viên", url: "/admin/staffs" },
        { title: "Quản lý vị trí", url: "/admin/option" },
        { title: "Quản lý lịch trực", url: "/admin/staffs/shifts" },
        // { title: "Quản lý kho vật tư", url: "/admin/inventory" },
      ],
    },
    {
      title: "Kế toán & Tài chính",
      icon: CreditCard,
      children: [
        { title: "Phiếu thu", url: "/admin/finance/income" },
        { title: "Phiếu chi", url: "/admin/finance/outcome" },
        { title: "Sổ quỹ tiền mặt/NH", url: "/admin/finance/transactions" },
      ],
    },
  ],

  // 5. CẤU HÌNH
  system: [
    { title: "Cài đặt chung", icon: Settings, url: "/admin/settings" },
    // { title: "Phân quyền (RBAC)", icon: ShieldCheck, url: "/admin/roles" },
    { title: "Log hệ thống", icon: History, url: "/admin/logs" },
  ],
};
