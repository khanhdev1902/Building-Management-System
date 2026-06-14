export const REALITY_TENANT_DATA = {
  resident: "Nguyễn Văn Khanh",
  room: "201",
  building: "Danjin Cầu Giấy (Số 12 Ngõ 86)",
  billingStatus: "UNPAID",
  contractId: "CTR-2025-8892",
  // Giả lập thông báo khẩn cấp hệ thống đẩy lên trên đầu trang
  urgentNotice: {
    id: "NT-992",
    title: "Bảo trì khẩn cấp trục bơm nước sinh hoạt tòa nhà Cầu Giấy",
    time: "14:00 - 17:00 Ngày mai (12/06)",
    content:
      "Tạm dừng cấp nước cục bộ để thay van áp lực. Cư dân chủ động tích trữ nước sinh hoạt trước khung giờ trên.",
  },
  assets: {
    vehicles: [
      { type: "Xe máy Vision", plate: "29M1-123.45", cardNo: "V-0892" },
    ],
    gateCard: "NFC-201A",
  },
  invoice: {
    id: "INV-2026-05",
    period: "Tháng 05/2026",
    dueDate: "05/06/2026",
    issueDate: "31/05/2026",
    totalAmount: 4850000,
    details: [
      { name: "Tiền phòng cố định", cost: 3500000, type: "BASE" },
      { name: "Tiền điện (320 kWh × 4.000đ)", cost: 1280000, type: "USAGE" },
      { name: "Phí dịch vụ & Vệ sinh chung", cost: 100000, type: "BASE" },
      { name: "Phí gửi xe máy (29M1-123.45)", cost: 70000, type: "BASE" },
      { name: "Khấu trừ tiền thừa kỳ trước", cost: -100000, type: "DEDUCTION" },
    ],
    usage: {
      electricity: {
        oldIndex: 1240,
        newIndex: 1560,
        total: 320,
        checkDate: "30/05/2026",
        history: [
          { month: "Tháng 3", value: 240 },
          { month: "Tháng 4", value: 290 },
          { month: "Tháng 5", value: 320 },
        ],
      },
      water: { oldIndex: 45, newIndex: 49, total: 4, checkDate: "30/05/2026" },
    },
  },
};
