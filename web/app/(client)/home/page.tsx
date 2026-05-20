"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  CreditCard,
  Zap,
  Droplets,
  Users,
  ShieldCheck,
  ArrowUpRight,
  QrCode,
  MessageSquareWarning,
  Sparkles,
  Home,
  Gauge,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/components/ui/table";

export default function CustomerHomePage() {
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập luồng nạp hồ sơ cư dân trực tuyến trong 0.8s
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Mockup Sổ gốc dữ liệu thời gian thực của phòng P.101 nơi cư dân Khanh đang lưu trú
  const customerData = {
    tenantName: "Nguyễn Văn Khanh",
    roomNumber: "101",
    buildingName: "Danjin CCMN Cầu Giấy",
    currentInvoice: {
      id: "INV-2026-05",
      period: "Tháng 05/2026",
      dueDate: "20/05/2026",
      total: 5370000,
      status: "unpaid", // unpaid: chưa đóng, paid: đã tất toán
      breakdown: [
        { name: "Tiền phòng cứng", amount: 4500000 },
        { name: "Điện năng tiêu thụ (120 kWh)", amount: 420000 },
        { name: "Nước sạch lưu trú (10 m³)", amount: 300000 },
        { name: "Combo Quản lý & Mạng Wifi", amount: 150000 },
      ],
    },
    meterReading: [
      {
        name: "Điện năng",
        type: "electric",
        lastIndex: 1240,
        newIndex: 1360,
        consumed: 120,
        unit: "kWh",
        icon: <Zap size={13} className="text-amber-500" />,
      },
      {
        name: "Nước sạch",
        type: "water",
        lastIndex: 85,
        newIndex: 95,
        consumed: 10,
        unit: "m³",
        icon: <Droplets size={13} className="text-blue-500" />,
      },
    ],
    announcements: [
      {
        id: 1,
        title: "Bảo dưỡng định kỳ hệ thống máy phát điện dự phòng tòa nhà",
        date: "Hôm nay, 14:30",
        type: "warning",
        content:
          "Ban quản lý sẽ ngắt điện lưới tổng trong vòng 15 phút từ 09:00 đến 09:15 sáng thứ 5 để tiến hành kiểm tra tải dầu. Cư dân vui lòng không sử dụng thang máy trong khung giờ trên.",
      },
      {
        id: 2,
        title: "Triển khai khai báo tạm trú trực tuyến qua ứng dụng Danjin BMS",
        date: "Gần đây",
        type: "info",
        content:
          "Yêu cầu các thành viên mới dọn vào bổ sung ngay ảnh chụp CCCD 2 mặt tại mục Nhân khẩu để ban quản lý nộp tờ khai lên Công an Phường đối soát theo quy định.",
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6 bg-slate-50/20 min-h-screen animate-pulse">
        <div className="h-10 bg-slate-100 rounded-xl w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-96 bg-slate-100 rounded-xl" />
          <div className="lg:col-span-5 h-96 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-slate-50/20 min-h-screen antialiased selection:bg-indigo-50 font-sans">
      {/* 1. KHAY CHÀO MỪNG ĐỊNH DANH SỐ HÓA PHẲNG TRẦN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-xs">
            <Sparkles size={13} />
            <span>Danjin Cư Dân Portal</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Xin chào, {customerData.tenantName}
          </h1>
          <p className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
            <Home size={11} /> Căn hộ{" "}
            <strong className="text-slate-600 font-mono font-bold">
              P.{customerData.roomNumber}
            </strong>{" "}
            • {customerData.buildingName}
          </p>
        </div>

        {/* Nút phản hồi sự cố khẩn cấp dành riêng cho khách thuê */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-bold border-rose-200 text-rose-600 bg-rose-50/30 hover:bg-rose-50 rounded-lg shadow-none gap-1.5 uppercase tracking-tight shrink-0"
        >
          <MessageSquareWarning size={13} className="stroke-[2.5]" /> Báo hỏng
          thiết bị phòng
        </Button>
      </div>

      {/* 2. BỐ CỤC PHÂN PHỐI KHÔNG GIAN BẤT ĐỐI XỨNG (7:5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= KHỐI TRÁI (7 PHẦN): TÀI CHÍNH HÓA ĐƠN & THÔNG BÁO ================= */}
        <div className="lg:col-span-7 space-y-5">
          {/* A. CARD TỔNG TIỀN PHÒNG ĐÁNG CHÚ Ý NHẤT */}
          <div className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col sm:flex-row justify-between gap-5 relative overflow-hidden group">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2 select-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Cước phí kỳ này ({customerData.currentInvoice.period})
                </span>
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-none px-1.5 py-0 rounded text-[9px] font-bold uppercase animate-pulse"
                >
                  Chờ gạch nợ
                </Badge>
              </div>

              <div className="space-y-0.5">
                <h2 className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                  {customerData.currentInvoice.total.toLocaleString("vi-VN")}
                  <span className="text-sm font-sans font-normal text-slate-400 ml-1">
                    đ
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400 font-medium select-none">
                  Hạn thanh toán định kỳ khóa sổ:{" "}
                  <span className="text-rose-600 font-mono font-bold">
                    {customerData.currentInvoice.dueDate}
                  </span>
                </p>
              </div>

              {/* Bảng chi tiết hóa đơn nhúng phẳng chìm vào lòng Card */}
              <div className="rounded-lg border border-slate-100 bg-slate-50/40 overflow-hidden max-w-md select-none">
                <Table>
                  <TableBody className="text-[11px] font-medium text-slate-500">
                    {customerData.currentInvoice.breakdown.map((item, idx) => (
                      <TableRow
                        key={idx}
                        className="hover:bg-transparent border-none"
                      >
                        <TableCell className="py-1.5 pl-3 text-slate-500">
                          {item.name}
                        </TableCell>
                        <TableCell className="py-1.5 text-right font-mono font-bold text-slate-700 pr-3">
                          {item.amount.toLocaleString()} đ
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* BÊN PHẢI CARD: KHU VỰC THAO TÁC THANH TOÁN QR NHANH SIÊU MƯỢT */}
            <div className="sm:w-44 flex flex-col justify-between items-center sm:items-end gap-3 bg-slate-50/50 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-slate-100 sm:border-none shrink-0 select-none">
              <div className="flex flex-col items-center sm:items-end gap-1">
                <div className="h-20 w-20 border border-slate-200/80 p-1.5 rounded-lg bg-white shadow-2xs flex items-center justify-center group-hover:border-indigo-400 transition-colors">
                  <QrCode size={56} className="text-slate-800" />
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1 text-center sm:text-right">
                  Quét nhanh chuyển khoản VietQR
                </span>
              </div>
              <Button className="w-full h-8 text-xs font-bold bg-slate-950 hover:bg-indigo-600 text-white rounded-lg gap-1 shadow-none transition-colors cursor-pointer uppercase tracking-tight">
                <CreditCard size={12} /> Báo đã đóng tiền
              </Button>
            </div>
          </div>

          {/* B. KHỐI DANH SÁCH THÔNG BÁO TỪ BAN QUẢN LÝ TÒA NHÀ */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 select-none pl-0.5">
              <Bell size={13} /> Bản tin & Thông báo khẩn từ tòa nhà
            </h3>

            <div className="space-y-3">
              {customerData.announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="border border-slate-200/60 rounded-xl p-4 bg-white hover:border-slate-300 transition-colors space-y-2 select-none"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-bold text-slate-800 text-xs tracking-tight leading-normal">
                      {ann.title}
                    </h4>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0 font-medium">
                      {ann.date}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed font-sans">
                    {ann.content}
                  </p>
                  <div className="pt-1">
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-bold rounded border-none px-1.5 ${ann.type === "warning" ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700"}`}
                    >
                      {ann.type === "warning"
                        ? "Cảnh báo ngắt luồng"
                        : "Tin tức hành chính"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= KHỐI PHẢI (5 PHẦN): ĐỐI SOÁT CHỈ SỐ TIÊU THỤ & HỒ SƠ PHÒNG ================= */}
        <div className="lg:col-span-5 space-y-4">
          {/* C. CHỈ SỐ CÔNG TƠ ĐIỆN NƯỚC THÁNG NÀY */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-2 select-none">
              <Gauge size={13} /> Minh bạch chỉ số công tơ tháng này
            </h3>

            <div className="space-y-2.5 select-none">
              {customerData.meterReading.map((meter, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/50 border border-slate-100/60 p-3 rounded-xl flex items-center justify-between text-xs font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-white border border-slate-100 rounded-lg shrink-0">
                      {meter.icon}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block text-[11px]">
                        Sản lượng {meter.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-medium block mt-0.5">
                        Chỉ số: {meter.lastIndex} ➔{" "}
                        <strong className="text-slate-700 font-bold">
                          {meter.newIndex}
                        </strong>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-slate-900 text-sm">
                      +{meter.consumed}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans font-normal ml-0.5">
                      {meter.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* D. KHAY THÔNG TIN NHÂN KHẨU VÀ PHÁP LÝ AN NINH */}
          <div className="bg-slate-50/50 p-4 border border-slate-200/60 rounded-xl space-y-3 select-none">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <Users size={13} /> Nhân khẩu đã khai báo phòng
              </h4>
              <button className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer flex items-center gap-0.5">
                Cập nhật <ArrowUpRight size={11} />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 bg-white border border-slate-200/40 rounded-lg">
                <span className="font-bold text-slate-800">
                  Nguyễn Văn Khanh
                </span>
                <Badge
                  variant="outline"
                  className="bg-indigo-50 border-none text-indigo-700 text-[9px] font-bold rounded"
                >
                  Chủ hộ ký HĐ
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-white border border-slate-200/40 rounded-lg text-slate-600">
                <span className="font-semibold text-slate-700">
                  Trần Thế Anh
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  Thành viên
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white border border-slate-200/40 rounded-lg text-slate-600">
                <span className="font-semibold text-slate-700">
                  Lê Minh Nhật
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  Thành viên
                </span>
              </div>
            </div>

            <p className="text-[9px] text-slate-400 font-medium leading-normal flex items-start gap-1 pt-1 border-t border-slate-100">
              <ShieldCheck
                size={11}
                className="text-emerald-500 shrink-0 mt-0.5"
              />
              <span>
                Hệ thống IoT tòa nhà tự động cấp mã QR vân tay ra vào hầm dựa
                trên danh sách nhân khẩu đã được Admin duyệt khớp ở trên.
              </span>
            </p>
          </div>
        </div>
        {/* HẾT SPLIT LAYOUT CƯ DÂN */}
      </div>
    </div>
  );
}
