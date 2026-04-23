import {
  LayoutDashboard,
  Building2,
  UserCheck,
  Bell,
  MessageSquare,
  Wrench,
  Users,
  Receipt,
  Zap,
  Settings,
  ShieldCheck,
  History,
  CreditCard,
  BarChart3, // Thống kê
  Wallet, // Chi phí
  Clock, // Ca làm việc
  Banknote, // Doanh thu
} from "lucide-react";

//   // 1. NHÓM QUẢN TRỊ CHIẾN LƯỢC (Dành cho chủ/quản lý cấp cao)
//   analytics: [
//     { title: "Tổng quan Dashboard", icon: LayoutDashboard, url: "/dashboard" },
//     {
//       title: "Báo cáo & Thống kê",
//       icon: BarChart3,
//       children: [
//         {
//           title: "Doanh thu (Revenue)",
//           icon: Banknote,
//           url: "/reports/revenue",
//         },
//         { title: "Chi phí vận hành", icon: Wallet, url: "/reports/expenses" },
//         { title: "Tỷ lệ lấp đầy phòng", url: "/reports/occupancy" },
//         { title: "Báo cáo nợ đọng", url: "/reports/debts" },
//       ],
//     },
//   ],

//   // 2. NHÓM VẬN HÀNH THƯỜNG NHẬT (Dành cho lễ tân/quản lý tòa nhà)
//   operation: [
//     {
//       title: "Quản lý hạ tầng",
//       icon: Building2,
//       children: [
//         { title: "Danh sách tòa nhà", url: "/buildings" },
//         { title: "Quản lý phòng", url: "/rooms" },
//         { title: "Dịch vụ & Tiện ích", url: "/services" },
//         { title: "Chỉ số điện nước", icon: Zap, url: "/utilities" },
//       ],
//     },
//     {
//       title: "Khách thuê & Hợp đồng",
//       icon: UserCheck,
//       children: [
//         { title: "Hợp đồng thuê", url: "/contracts" },
//         { title: "Danh sách khách thuê", url: "/tenants" },
//         { title: "Hóa đơn tháng", icon: Receipt, url: "/invoices" },
//       ],
//     },
//     {
//       title: "Dịch vụ khách hàng",
//       icon: Bell,
//       children: [
//         { title: "Thông báo (Notice)", url: "/notifications" },
//         { title: "Yêu cầu sửa chữa", icon: Wrench, url: "/maintenance" },
//         { title: "Phòng chat nội bộ", icon: MessageSquare, url: "/chats" },
//       ],
//     },
//   ],

//   // 3. NHÓM NHÂN SỰ & TÀI CHÍNH (Dành cho kế toán/HR)
//   management: [
//     {
//       title: "Quản lý nhân viên",
//       icon: Users,
//       children: [
//         { title: "Danh sách nhân viên", url: "/staffs" },
//         { title: "Phân ca làm việc", icon: Clock, url: "/staffs/shifts" },
//         { title: "Chấm công & Lương", url: "/staffs/payroll" },
//       ],
//     },
//     {
//       title: "Quản lý dòng tiền",
//       icon: CreditCard,
//       children: [
//         { title: "Phiếu thu (Thu tiền)", url: "/finance/income" },
//         { title: "Phiếu chi (Chi phí)", url: "/finance/outcome" },
//         { title: "Lịch sử giao dịch", url: "/finance/transactions" },
//       ],
//     },
//   ],

//   // 4. NHÓM CẤU HÌNH HỆ THỐNG
//   system: [
//     { title: "Cài đặt chung", icon: Settings, url: "/settings" },
//     { title: "Phân quyền (RBAC)", icon: ShieldCheck, url: "/roles" },
//     { title: "Nhật ký hệ thống", icon: History, url: "/logs" },
//   ],
// };
export const navigation = {
  // 1. QUẢN TRỊ CHIẾN LƯỢC
  analytics: [
    { title: "Tổng quan Dashboard", icon: LayoutDashboard, url: "/dashboard" },
    {
      title: "Báo cáo & Thống kê",
      icon: BarChart3,
      children: [
        {
          title: "Doanh thu",
          icon: Banknote,
          url: "/reports/revenue",
        },
        { title: "Chi phí vận hành", icon: Wallet, url: "/reports/expenses" },
        { title: "Tỷ lệ lấp đầy & Biến động", url: "/reports/occupancy" },
        { title: "Báo cáo kỹ thuật/Bảo trì", url: "/reports/maintenance" }, //Theo dõi sức khỏe tòa nhà
      ],
    },
  ],

  // 2. VẬN HÀNH & HẠ TẦNG
  operation: [
    {
      title: "Quản lý hạ tầng",
      icon: Building2,
      children: [
        // { title: "Sơ đồ tòa nhà", url: "/buildings" },
        { title: "Dịch vụ", url: "/services" },
        { title: "Căn hộ", url: "/rooms" },
        { title: "Tài sản & Thiết bị", url: "/assets" }, //Quản lý thiết bị chung
        { title: "Chỉ số điện nước", icon: Zap, url: "/utilities" },
      ],
    },
    {
      title: "Cư dân & Hợp đồng",
      icon: UserCheck,
      children: [
        { title: "Danh sách cư dân", url: "/tenants" },
        { title: "Hợp đồng", url: "/contracts" },
        // { title: "Quản lý thẻ (Xe/Thang máy)", url: "/cards" },
        // { title: "Quản lý gửi xe", url: "/parking" },
      ],
    },
  ],

  // 3. DỊCH VỤ KHÁCH HÀNG (Interaction)
  services: [
    {
      title: "Kênh tương tác",
      icon: MessageSquare,
      children: [
        { title: "Nhóm chat nội bộ", icon: MessageSquare, url: "/chats" },
        { title: "Bảng tin thông báo", icon: Bell, url: "/notifications" },
        { title: "Yêu cầu sửa chữa", icon: Wrench, url: "/maintenance" },
        //{ title: "Đặt lịch tiện ích (BBQ/Gym)", url: "/amenities" }, //Mới
        //{ title: "Phản hồi & Khiếu nại", url: "/feedback" }, //Cư dân phàn nàn
      ],
    },
    {
      title: "Tài chính cư dân",
      icon: Receipt,
      children: [
        {
          title: "Hóa đơn tháng",
          url: "/invoices",
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
        { title: "Danh sách nhân viên", url: "/staffs" },
        { title: "Lịch trực kỹ thuật/BV", icon: Clock, url: "/staffs/shifts" },
        { title: "Quản lý kho vật tư", url: "/inventory" },
      ],
    },
    {
      title: "Kế toán & Tài chính",
      icon: CreditCard,
      children: [
        { title: "Phiếu thu", url: "/finance/income" },
        { title: "Phiếu chi", url: "/finance/outcome" },
        { title: "Sổ quỹ tiền mặt/NH", url: "/finance/transactions" },
      ],
    },
  ],

  // 5. CẤU HÌNH
  system: [
    { title: "Cài đặt chung", icon: Settings, url: "/settings" },
    { title: "Phân quyền (RBAC)", icon: ShieldCheck, url: "/roles" },
    { title: "Log hệ thống", icon: History, url: "/logs" },
  ],
};
