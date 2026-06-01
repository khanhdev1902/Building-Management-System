/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  KeyRound,
  Calendar,
  FileText,
  Download,
  Coins,
  AlertCircle,
  UserCheck,
  Building,
  Clock,
  Users,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { toast } from "sonner";

// DATA PHÁP LÝ CHUẨN HÓA MỞ RỘNG MẢNG THÀNH VIÊN Ở CÙNG (ROOMMATES)
const REALITY_CONTRACT_DATA = {
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

export default function TenantContractPage() {
  const [contract] = useState(REALITY_CONTRACT_DATA);

  // Thống kê tiến độ thời hạn thuê
  const totalDays = 365;
  const daysLeft = 251;
  const progressPercent = ((totalDays - daysLeft) / totalDays) * 100;

  const handleDownloadPDF = () => {
    toast.loading("Đang khởi tạo bản sao đóng dấu số...");
    setTimeout(() => {
      toast.success("✓ Đã tải xuống file bản sao hợp đồng pháp lý (PDF)");
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 bg-slate-50/10 min-h-screen antialiased font-sans select-none">
      {/* 1. TOP BAR TIÊU ĐỀ FLAT */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-0.5">
          <h1 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-slate-900 stroke-[2.2]" />
            Hợp đồng thuê nhà điện tử
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Mã chứng từ pháp lý hệ thống:{" "}
            <span className="font-mono font-bold text-slate-600">
              {contract.contractNo}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            className="h-9 text-xs font-bold border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg shadow-none gap-1.5 cursor-pointer w-full sm:w-auto"
          >
            <Download size={13} /> Tải file PDF đóng dấu
          </Button>
        </div>
      </div>

      {/* CHÈN LƯỚI TỶ LỆ CÂN BẰNG 2:1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= CỘT TRÁI (2/3 HỆ THỐNG): THÔNG TIN PHÁP LÝ TÀI CHÍNH ================= */}
        <div className="lg:col-span-2 space-y-5">
          {/* THANH TIẾN ĐỘ THỜI HẠN THUÊ PHÒNG */}
          <div className="p-5 rounded-xl border border-slate-100 bg-white shadow-3xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Clock size={14} className="text-slate-900" /> Tiến độ thời hạn
                thuê mặt bằng
              </span>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100/40 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider shadow-none">
                ● Còn hiệu lực
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600 font-mono">
                <span>Bắt đầu: {contract.terms.startDate}</span>
                <span className="text-slate-900 font-extrabold">
                  Còn {daysLeft} ngày lưu trú
                </span>
                <span>Kết thúc: {contract.terms.endDate}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="bg-slate-900 h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>
          </div>

          {/* GRID QUẢN LÝ BÊN A & BÊN B */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                Bên cho thuê (BÊN A)
              </span>
              <div className="space-y-1.5 text-xs font-semibold text-slate-700">
                <p className="text-slate-900 font-bold">
                  {contract.lessor.name}
                </p>
                <div className="text-slate-500 font-medium">
                  Đại diện pháp nhân: {contract.lessor.representative}
                </div>
                <div className="text-slate-500 font-medium font-mono">
                  Hotline: {contract.lessor.phone}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                Chủ hộ đại diện thuê (BÊN B)
              </span>
              <div className="space-y-1.5 text-xs font-semibold text-slate-700">
                <p className="text-slate-900 font-bold">
                  {contract.lessee.name}
                </p>
                <div className="text-slate-500 font-medium font-mono">
                  Số CCCD: {contract.lessee.idNo}
                </div>
                <div className="text-slate-500 font-medium font-mono">
                  SĐT đăng ký: {contract.lessee.phone}
                </div>
              </div>
            </div>
          </div>

          {/* 💡 MỤC MỚI CẬP NHẬT: THÀNH VIÊN LƯU TRÚ CÙNG PHÒNG ĐÃ KHÓA BẢO MẬT MASKING */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-3xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Users size={14} className="text-slate-900" /> Thành viên đăng
                ký lưu trú cùng phòng
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                Hạn ngạch: 02 người
              </span>
            </div>

            <div className="space-y-3">
              {contract.roommates.map((member, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/70 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs font-semibold"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">
                        {member.name}
                      </span>
                      <span className="text-[9px] bg-slate-200/50 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
                        {member.relationship}
                      </span>
                    </div>
                    {/* Render thông tin mặt nạ bảo mật an toàn dữ liệu */}
                    <div className="text-slate-400 font-medium flex gap-4 font-mono text-[11px] pt-0.5">
                      <span>SĐT: {member.phoneMasked}</span>
                      <span>CCCD: {member.idNoMasked}</span>
                    </div>
                  </div>

                  {/* Cụm trạng thái đồng bộ ban quản lý */}
                  <div>
                    {member.status === "ACTIVE" ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/40">
                        ● Đã duyệt tạm trú
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100/40 animate-pulse">
                        ◷ Đang chờ duyệt
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHI TIẾT ĐIỀU KHOẢN TÀI CHÍNH CỐ ĐỊNH */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-3xs overflow-hidden">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileText size={14} className="text-slate-900" /> Tóm lược nghĩa
                vụ tài chính cố định
              </span>
            </div>
            <div className="divide-y divide-slate-50 text-xs font-semibold text-slate-600">
              <div className="flex justify-between p-3 px-4 items-center">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Building size={13} /> Địa chỉ mặt bằng
                </span>
                <span className="text-slate-900 font-bold">
                  Phòng {contract.terms.room} ({contract.terms.building})
                </span>
              </div>
              <div className="flex justify-between p-3 px-4 items-center">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Coins size={13} /> Đơn giá thuê hằng tháng
                </span>
                <span className="text-slate-900 font-mono font-black text-sm">
                  {contract.terms.monthlyRent.toLocaleString()}đ / tháng
                </span>
              </div>
              <div className="flex justify-between p-3 px-4 items-center bg-slate-50/40">
                <span className="text-slate-900 font-bold flex items-center gap-1">
                  🔒 Tiền ký cọc giữ phòng (Bảo lưu)
                </span>
                <span className="text-slate-900 font-mono font-black text-sm">
                  {contract.terms.depositAmount.toLocaleString()}đ
                </span>
              </div>
              <div className="flex justify-between p-3 px-4 items-center">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Calendar size={13} /> Chu kỳ thanh toán lập hóa đơn
                </span>
                <span className="text-slate-900 font-medium">
                  {contract.terms.paymentCycle}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CỘT PHẢI (1/3 HỆ THỐNG): CHỨNG THỰC & QUY ĐỊNH VẬN HÀNH ================= */}
        <div className="space-y-5">
          {/* CHỨNG THỰC CHỮ KÝ SỐ BAO MẬT */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
              Hệ thống chứng thực số
            </span>
            <div className="p-3 bg-emerald-50/40 border border-emerald-100/40 rounded-xl space-y-2 flex flex-col items-center text-center">
              <div className="h-9 w-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-3xs">
                <UserCheck size={16} className="stroke-[2.5]" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-emerald-800">
                  Đã ký số SMS OTP
                </p>
                <p className="text-[10px] font-medium text-slate-400">
                  Thời gian xác thực: {contract.signedAt}
                </p>
              </div>
            </div>
            <p className="text-[10px] leading-relaxed text-slate-400 font-medium text-center px-1">
              Hợp đồng số hóa có đầy đủ chứng cứ pháp lý ràng buộc nghĩa vụ hai
              bên theo quy định pháp luật Việt Nam.
            </p>
          </div>

          {/* QUY CHẾ ĐIỀU KHOẢN VẬN HÀNH TÒA NHÀ ĐỌC NHANH */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs space-y-3.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block flex items-center gap-1.5">
              <AlertCircle size={13} className="text-slate-900" /> Lưu ý quy chế
              tòa nhà
            </span>

            <div className="space-y-3.5 text-xs font-semibold">
              {contract.rules.map((rule, idx) => (
                <div key={idx} className="space-y-1">
                  <strong className="text-slate-900 font-bold block">
                    • {rule.title}
                  </strong>
                  <p className="text-[11px] text-slate-500 font-medium leading-normal pl-2.5">
                    {rule.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
