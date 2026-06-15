export const REALITY_CONTRACT_DATA = {
  contractNo: "HD-2026-0201-CAUGIAY",
  status: "ACTIVE",
  createdAt: "15/01/2026",
  signedAt: "15/01/2026",

  // Thông tin hai bên ký kết
  lessor: {
    name: "Công ty Cổ phần Vận hành Bất động sản Danjin",
    representative: "Lê Cao Nguyên",
    phone: "0912.345.678",
  },
  lessee: {
    name: "Nguyễn Văn Khanh",
    idNo: "001096001234",
    phone: "0987.654.321",
  },

  // Chi tiết phòng ở và kinh tế
  terms: {
    building: "Danjin Cầu Giấy (Số 12 Ngõ 86)",
    room: "201",
    durationMonths: 12,
    startDate: "01/02/2026",
    endDate: "01/02/2027",
    monthlyRent: 3500000,
    depositAmount: 3500000,
    paymentCycle: "Hằng tháng (Từ ngày 25 đến mùng 5)",
  },

  // 💡 MẢNG THÀNH VIÊN Ở CÙNG: ÁP DỤNG DATA MASKING BẢO MẬT TUYỆT ĐỐI KHÔNG LỘ DỮ LIỆU
  roommates: [
    {
      name: "Trần Trung Hải",
      phoneMasked: "0912.***.222",
      idNoMasked: "001******999",
      status: "ACTIVE", // ACTIVE (Đã duyệt)
      relationship: "Bạn cùng phòng",
    },
    {
      name: "Lê Văn Nam",
      phoneMasked: "0934.***.666",
      idNoMasked: "001******888",
      status: "PENDING", // PENDING (Chờ duyệt tạm trú)
      relationship: "Em trai",
    },
  ],

  // Điều khoản vận hành
  rules: [
    {
      title: "Quy định hoàn cọc",
      content:
        "Cư dân cần thông báo trước cho Ban quản lý ít nhất 30 ngày trước khi chấm dứt hợp đồng để được hoàn trả 100% tiền cọc.",
    },
    {
      title: "Số lượng thành viên",
      content:
        "Phòng giới hạn tối đa 02 người ở cố định. Thành viên mới hoặc khách vãng lai ở qua đêm cần khai báo tạm trú qua cổng hệ thống.",
    },
    {
      title: "Sử dụng thiết bị",
      content:
        "Bảo quản các trang thiết bị nội thất đi kèm (Điều hòa, Bình nóng lạnh). Các hư hỏng do lỗi sử dụng cá nhân sẽ bị trích từ tiền cọc.",
    },
  ],
};
