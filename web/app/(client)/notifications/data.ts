export const MOCK_NOTICES = [
  {
    id: "NTC-891",
    type: "EMERGENCY",
    title: "Diễn tập phương án PCCC và test còi báo động hầm xe",
    sender: "Ban Quản Lý Tòa Nhà",
    createdAt: "25/05/2026 09:00",
    isRead: false, // Chưa đọc -> Hiển thị chấm thông báo hồng
    content:
      "Vào lúc 15h00 chiều nay, đội kỹ thuật Danjin BMS sẽ phối hợp với cơ quan chức năng tiến hành chạy thử nghiệm hệ thống còi hú báo cháy tại tầng hầm và các hành lang trục đứng. Thời gian test kéo dài khoảng 15 phút, yêu cầu cư dân giữ bình tĩnh, không hoảng loạn khi nghe thấy âm thanh còi báo.",
  },
  {
    id: "NTC-890",
    type: "MAINTENANCE",
    title: "Tạm dừng vận hành Thang máy trục A để bảo trì định kỳ",
    sender: "Đội Kỹ Thuật Danjin",
    createdAt: "24/05/2026 14:00",
    isRead: true, // Đã đọc
    content:
      "Để phục vụ công tác kiểm định và tra dầu cáp tời trục kỹ thuật, Thang máy số 1 tòa nhà sẽ tạm dừng hoạt động từ 09h00 đến 11h30 ngày 26/05/2026. Cư dân vui lòng di chuyển bằng thang bộ hoặc thang máy số 2 trong khung giờ trên. Xin cảm ơn!",
  },
  {
    id: "NTC-889",
    type: "GENERAL",
    title: "Nhắc nhở phân loại rác thải tại khu vực thu gom chung",
    sender: "Bộ Phận Vệ Sinh",
    createdAt: "22/05/2026 08:30",
    isRead: true,
    content:
      "Hiện nay tình trạng cư dân để rác cồng kềnh, không phân loại rác hữu cơ và rác tái chế tại phòng gom rác tầng 1 đang gây quá tải. Xin cư dân lưu ý bọc chặt túi rác và đổ đúng giờ quy định nhằm giữ gìn vệ sinh chung, tránh mùi hôi lan vào thang máy.",
  },
];
