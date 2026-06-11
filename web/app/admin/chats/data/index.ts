// Mock Data danh sách hội thoại thực tế ở chung cư
export const INITIAL_ROOMS = [
  {
    id: "CHANNEL-ALL",
    roomName: "Kênh Thông Báo Chung",
    lastMessage:
      "Ban quản lý: Vui lòng không để xe chắn lối thoát hiểm tầng hầm.",
    time: "Trưa nay",
    unreadCount: 0,
    category: "channel", // Kênh phát thanh toàn tòa
    residentName: "Hệ thống",
    status: "broadcast",
  },
  {
    id: "CHAT-P202",
    roomName: "P.202",
    lastMessage:
      "Dạ ban quản lý kiểm tra hộ em hóa đơn nước tăng bất thường với ạ!",
    time: "18:32",
    unreadCount: 2,
    category: "support", // Hỗ trợ cư dân 1-1
    residentName: "Trần Thế Anh",
    status: "pending", // Đang chờ xử lý
  },
  {
    id: "CHAT-P104",
    roomName: "P.104",
    lastMessage: "Đã chuyển khoản tiền cọc xe máy tháng này rồi nhé.",
    time: "15:45",
    unreadCount: 0,
    category: "support",
    residentName: "Nguyễn Văn Anh",
    status: "resolved", // Đã xử lý xong
  },
];

// Mock Data nội dung tin nhắn chi tiết của Phòng 202
export const INITIAL_MESSAGES: Record<string, any[]> = {
  "CHAT-P202": [
    {
      id: "m1",
      sender: "resident",
      text: "Chào ban quản lý, cho em hỏi chút ạ.",
      time: "18:28",
      status: "read",
    },
    {
      id: "m2",
      sender: "resident",
      text: "Tháng này phòng em đi làm suốt mà sao hóa đơn nước lên tới 450.000đ lận?",
      time: "18:29",
      status: "read",
    },
    {
      id: "m3",
      sender: "admin",
      text: "Chào Thế Anh, dạ để bên kỹ thuật kiểm tra lại đồng hồ đo nước ở đầu tầng 2 của phòng mình liền nha.",
      time: "18:30",
      status: "read",
    },
    {
      id: "m4",
      sender: "resident",
      text: "Dạ ban quản lý kiểm tra hộ em hóa đơn nước tăng bất thường với ạ!",
      time: "18:32",
      status: "sent",
    },
  ],
  "CHAT-P104": [
    {
      id: "m5",
      sender: "resident",
      text: "Đã chuyển khoản tiền cọc xe máy tháng này rồi nhé.",
      time: "15:45",
      status: "read",
    },
  ],
  "CHANNEL-ALL": [
    {
      id: "m6",
      sender: "admin",
      text: "Thông báo bảo trì hệ thống PCCC định kỳ vào sáng Thứ 7 tuần này.",
      time: "Hôm qua",
      status: "read",
    },
    {
      id: "m7",
      sender: "admin",
      text: "Yêu cầu cư dân không để xe chắn lối thoát hiểm tầng hầm.",
      time: "Trưa nay",
      status: "read",
    },
  ],
};
