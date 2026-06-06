// Mock Data chuẩn quy trình Ticket bảo trì thực tế tại chung cư mini
export const INITIAL_TICKETS = [
  {
    id: "TK-4420",
    room: "Phòng 202",
    resident: "Trần Thế Anh",
    phone: "0934567890",
    category: "plumbing", // plumbing | electrical | appliance | infrastructure
    title: "Rò rỉ đường ống bồn rửa mặt, thấm tường sàn",
    description:
      "Nước rò rỉ từ khớp nối dưới bồn rửa mặt làm ướt hết sàn nhà vệ sinh và có dấu hiệu ngấm xuống trần phòng 102 phía dưới. Cần xử lý gấp.",
    priority: "high", // low | medium | high
    status: "pending", // pending | processing | completed | canceled
    assignedTo: "",
    createdAt: "21/05/2026 06:15",
    cost: 0,
    notes: "",
  },
  {
    id: "TK-4418",
    room: "Phòng 104",
    resident: "Nguyễn Văn Anh",
    phone: "0356789123",
    category: "electrical",
    title: "Chập hỏng Aptomat điều hòa",
    description:
      "Bật điều hòa lên khoảng 5 phút là aptomat tự nhảy, sờ vào thấy rất nóng. Nghi ngờ bị chập dây nguồn hoặc hỏng át.",
    priority: "high",
    status: "processing",
    assignedTo: "Thợ điện Nguyễn Văn Hùng",
    createdAt: "20/05/2026 14:30",
    cost: 150000,
    notes: "Đang mua aptomat 32A mới để thay thế.",
  },
  {
    id: "TK-4415",
    room: "Phòng 405",
    resident: "Lê Văn Nam",
    phone: "0789123456",
    category: "appliance",
    title: "Tủ lạnh đóng tuyết dày, không mát ngăn dưới",
    description:
      "Tủ lạnh mini trang bị sẵn trong phòng đóng tuyết quá dày ở ngăn đông, dẫn đến ngăn mát phía dưới không có hơi lạnh làm hỏng đồ ăn.",
    priority: "medium",
    status: "completed",
    assignedTo: "Kỹ thuật Lê Minh Đức",
    createdAt: "19/05/2026 09:15",
    cost: 200000,
    notes: "Đã xả tuyết, thông ống thoát nước thải và nạp thêm gas điều hòa.",
  },
  {
    id: "TK-4410",
    room: "Khu vực chung",
    resident: "Bảo vệ tòa nhà",
    phone: "BQL",
    category: "infrastructure",
    title: "Cháy bóng đèn LED hành lang tầng 3",
    description:
      "Bóng tuýp LED ở lối đi hành lang trước cửa phòng 301 bị nhấp nháy liên tục rồi tắt hẳn, gây tối lối đi chung.",
    priority: "low",
    status: "completed",
    assignedTo: "Kỹ thuật Lê Minh Đức",
    createdAt: "18/05/2026 10:00",
    cost: 65000,
    notes: "Đã thay bóng tuýp LED 1m2 mới.",
  },
];

// Danh sách đội thợ nội bộ của tòa nhà
export const TECHNICIANS = [
  "Kỹ thuật Lê Minh Đức (Nội bộ)",
  "Thợ điện Nguyễn Văn Hùng (Đối tác)",
  "Thợ nước Trần Văn thạch (Đối tác)",
];
