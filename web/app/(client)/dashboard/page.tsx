/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Zap,
  Droplet,
  Receipt,
  Wrench,
  Megaphone,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  QrCode,
  Copy,
  Bike,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

// 1. DATA ĐÃ ĐƯỢC CHUẨN HÓA SÁT NGHIỆP VỤ (GỒM XE, KHẤU TRỪ VÀ LỊCH SỬ TIÊU THỤ)
const REALITY_TENANT_DATA = {
  resident: "Nguyễn Văn Khanh",
  room: "201",
  building: "Danjin Cầu Giấy (Số 12 Ngõ 86)",
  billingStatus: "UNPAID",
  // Quản lý tài sản định danh gắn với phòng
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
    totalAmount: 4850000, // Số tiền sau khi đã bù trừ khấu trừ
    details: [
      { name: "Tiền phòng cố định", cost: 3500000, type: "BASE" },
      { name: "Tiền điện (320 kWh × 4.000đ)", cost: 1280000, type: "USAGE" },
      { name: "Phí dịch vụ & Vệ sinh chung", cost: 100000, type: "BASE" },
      { name: "Phí gửi xe máy (29M1-123.45)", cost: 70000, type: "BASE" },
      { name: "Khấu trừ tiền thừa kỳ trước", cost: -100000, type: "DEDUCTION" }, // Dòng tiền âm thực tế
    ],
    usage: {
      electricity: {
        oldIndex: 1240,
        newIndex: 1560,
        total: 320,
        // Lịch sử 3 tháng gần nhất phục vụ vẽ biểu đồ so sánh
        history: [
          { month: "Tháng 3", value: 240 },
          { month: "Tháng 4", value: 290 },
          { month: "Tháng 5", value: 320 },
        ],
      },
      water: { oldIndex: 45, newIndex: 49, total: 4 },
    },
  },
};

export default function TenantDashboard() {
  const [data, setData] = useState(REALITY_TENANT_DATA);
  const [isQrOpen, setIsQrOpen] = useState(false);

  // Bộ xử lý copy một chạm nhanh
  const handleCopyField = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`✓ Đã sao chép ${message}`);
  };

  // Giả lập luồng nhận tín hiệu ngân hàng gạch nợ qua Webhook
  const handleSimulatePayment = () => {
    toast.loading("Hệ thống đang kiểm tra giao dịch két điện tử...");
    setTimeout(() => {
      setData((prev) => ({ ...prev, billingStatus: "PAID" }));
      setIsQrOpen(false);
      toast.success(
        "✓ Ting ting! Hệ thống Danjin đã tất toán hóa đơn Tháng 05/2026.",
      );
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 bg-slate-50/10 min-h-screen antialiased font-sans select-none">
      {/* 1. TOP BAR TIÊU ĐỀ FLAT MINI */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
            Xin chào, {data.resident}{" "}
            <span className="inline-block animate-bounce duration-1000">
              👋
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Không gian lưu trú tại{" "}
            <strong className="text-slate-600 font-semibold">
              {data.building}
            </strong>{" "}
            •{" "}
            <span className="font-mono font-bold text-slate-700">
              P.{data.room}
            </span>
          </p>
        </div>
        <Badge
          variant="outline"
          className="bg-slate-900 text-white border-slate-900 font-bold px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider select-none"
        >
          🛡️ Hợp đồng an toàn
        </Badge>
      </div>

      {/* CẤU TRÚC LƯỚI CHÍNH TỶ LỆ 2:1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= CỘT TRÁI (2 PHẦN): TÀI CHÍNH & CHỈ SỐ TIÊU THỤ ================= */}
        <div className="lg:col-span-2 space-y-5">
          {/* CARD TÀI CHÍNH BIẾN ĐỔI THEO TRẠNG THÁI NỢ */}
          <div
            className={`p-5 rounded-xl border transition-all duration-300 ${
              data.billingStatus === "UNPAID"
                ? "bg-rose-50/10 border-rose-100/70 shadow-2xs"
                : "bg-white border-slate-100 shadow-3xs"
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                  Nghĩa vụ tài chính cư dân
                </span>
                <h2 className="text-sm font-bold text-slate-900">
                  {data.billingStatus === "UNPAID"
                    ? `Hóa đơn dịch vụ tổng hợp ${data.invoice.period}`
                    : `Đã tất toán các khoản phí ${data.invoice.period}`}
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">
                  {data.billingStatus === "UNPAID"
                    ? `Hạn thanh toán quy định: Trước ngày ${data.invoice.dueDate}`
                    : `Cảm ơn bạn đã đóng tiền nhà đúng thời hạn.`}
                </p>
              </div>

              {data.billingStatus === "UNPAID" ? (
                <Button
                  onClick={() => setIsQrOpen(true)}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-9 rounded-lg px-4 gap-1.5 uppercase tracking-wider w-full sm:w-auto shadow-xs cursor-pointer transition-all"
                >
                  <QrCode size={14} /> Thanh toán một chạm
                </Button>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold px-3 py-1.5 bg-emerald-50 rounded-lg select-none border border-emerald-100/70">
                  <CheckCircle2 size={14} className="stroke-[2.5]" /> Sạch nợ
                  quỹ tháng này
                </div>
              )}
            </div>

            {/* BẢNG PHÂN TÍCH HÓA ĐƠN THỰC TẾ (CÓ DÒNG TIỀN ÂM/DƯƠNG) */}
            {data.billingStatus === "UNPAID" && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Chi tiết hạng mục cấu thành dòng tiền
                </span>
                <div className="divide-y divide-slate-50 border border-slate-100 rounded-lg bg-white overflow-hidden">
                  {data.invoice.details.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2.5 px-3"
                    >
                      <span
                        className={`font-medium ${item.type === "DEDUCTION" ? "text-emerald-600" : "text-slate-600"}`}
                      >
                        {item.type === "DEDUCTION" ? "✨ " : "• "}
                        {item.name}
                      </span>
                      <span
                        className={`font-mono font-bold ${item.type === "DEDUCTION" ? "text-emerald-600" : "text-slate-900"}`}
                      >
                        {item.cost > 0 ? "" : "-"}
                        {Math.abs(item.cost).toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 bg-slate-50/60 font-bold border-t border-slate-100">
                    <span className="text-slate-900 uppercase text-[10px] tracking-wide">
                      Số tiền thực nộp
                    </span>
                    <span className="text-sm font-mono font-black text-rose-600">
                      {data.invoice.totalAmount.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CHỈ SỐ TIÊU THỤ ĐIỆN NƯỚC MINH BẠCH */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ĐỒNG HỒ ĐIỆN + BIỂU ĐỒ LỊCH SỬ TIÊU THỤ DẸT MỊN */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-500 fill-amber-500" />{" "}
                  Công tơ Điện
                </span>
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-100 text-[10px] rounded font-bold font-mono"
                >
                  {data.invoice.usage.electricity.total} kWh
                </Badge>
              </div>

              {/* Chỉ số cơ bản */}
              <div className="grid grid-cols-2 gap-2 text-center bg-slate-50/40 py-2 rounded-lg border border-slate-100/30">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-medium block">
                    Số cũ
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    {data.invoice.usage.electricity.oldIndex}
                  </span>
                </div>
                <div className="space-y-0.5 border-l border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">
                    Số mới
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900">
                    {data.invoice.usage.electricity.newIndex}
                  </span>
                </div>
              </div>

              {/* 📊 BIỂU ĐỒ LỊCH SỬ CSS THUẦN (ĂN TIỀN NGHIỆP VỤ) */}
              <div className="pt-2 border-t border-slate-50 space-y-2">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <TrendingUp size={11} /> Xu hướng dùng điện 3 tháng
                </span>
                <div className="flex items-end justify-between h-16 pt-4 px-2">
                  {data.invoice.usage.electricity.history.map((hist, i) => {
                    const maxVal = 350; // Mốc quy đổi chiều cao thanh chart
                    const heightPercent = (hist.value / maxVal) * 100;
                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center flex-1 group/bar"
                      >
                        <span className="text-[9px] font-mono font-bold text-slate-400 mb-1 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                          {hist.value}k
                        </span>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-8 rounded-t transition-all duration-300 cursor-pointer ${
                            i === 2
                              ? "bg-amber-500 hover:bg-amber-600"
                              : "bg-slate-200 hover:bg-slate-300"
                          }`}
                        />
                        <span className="text-[9px] text-slate-400 font-semibold mt-1.5">
                          {hist.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ĐỒNG HỒ NƯỚC SINH HOẠT */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Droplet
                      size={14}
                      className="text-blue-500 fill-blue-500"
                    />{" "}
                    Chỉ số Nước
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-100 text-[10px] rounded font-bold font-mono"
                  >
                    {data.invoice.usage.water.total} m³ (Khối)
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center bg-slate-50/40 py-2 rounded-lg border border-slate-100/30">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-medium block">
                      Số cũ
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600">
                      {data.invoice.usage.water.oldIndex}
                    </span>
                  </div>
                  <div className="space-y-0.5 border-l border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium block">
                      Số mới
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900">
                      {data.invoice.usage.water.newIndex}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] leading-relaxed text-slate-400 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100 select-none">
                💧 Tiền nước được tính toán dựa trên đơn giá cố định của UBND
                thành phố áp dụng cho mô hình chung cư mini lưu trú.
              </p>
            </div>
          </div>
        </div>

        {/* ================= CỘT PHẢI (1 PHẦN): TÁC VỤ & ĐĂNG KÝ XE & BẢNG TIN ================= */}
        <div className="space-y-5">
          {/* QUẢN LÝ XE VÀ ĐỊNH DANH RA VÀO (MỚI BỔ SUNG) */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
              Tài sản & Thẻ định danh phòng
            </span>
            <div className="space-y-2 text-xs font-semibold text-slate-700">
              {data.assets.vehicles.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100/60"
                >
                  <div className="flex items-center gap-2">
                    <Bike size={14} className="text-slate-500" />
                    <span>{v.type}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {v.plate}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100/60">
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-slate-500" />
                  <span>Mã thẻ từ tòa nhà</span>
                </div>
                <span className="font-mono font-bold text-slate-500">
                  {data.assets.gateCard}
                </span>
              </div>
            </div>
          </div>

          {/* CỤM TÁC VỤ NHANH MỘT CHẠM */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
              Hỗ trợ tiện ích một chạm
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-15 flex flex-col items-center justify-center gap-1 rounded-xl border-slate-100 hover:border-slate-300 hover:bg-slate-50/40 cursor-pointer text-slate-700 transition-all shadow-none"
              >
                <Wrench size={14} className="text-rose-500 stroke-[2.2]" />
                <span className="text-[11px] font-bold tracking-tight">
                  Báo kỹ thuật
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-15 flex flex-col items-center justify-center gap-1 rounded-xl border-slate-100 hover:border-slate-300 hover:bg-slate-50/40 cursor-pointer text-slate-700 transition-all shadow-none"
              >
                <Sparkles size={14} className="text-amber-500 stroke-[2.2]" />
                <span className="text-[11px] font-bold tracking-tight">
                  Mua dịch vụ
                </span>
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full h-8.5 rounded-lg border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs gap-1 cursor-pointer shadow-none"
            >
              Gửi xe vãng lai qua đêm <ArrowUpRight size={12} />
            </Button>
          </div>

          {/* BẢNG TIN TÒA NHÀ REALTIME */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs space-y-3.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block flex items-center gap-1.5">
              <Megaphone size={13} className="text-slate-900" /> Thông báo Ban
              quản lý
            </span>
            <div className="space-y-3 divide-y divide-slate-50 text-xs">
              <div className="space-y-1 pt-0">
                <div className="flex justify-between items-center">
                  <strong className="text-slate-900 font-bold">
                    Thử nghiệm bảo trì PCCC
                  </strong>
                  <span className="text-[9px] text-slate-400 font-mono">
                    Hôm nay
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-normal">
                  Hệ thống còi báo cháy khu vực hầm xe sẽ được vận hành test thử
                  lúc 15h00 chiều nay.
                </p>
              </div>
              <div className="space-y-1 pt-2.5">
                <div className="flex justify-between items-center">
                  <strong className="text-rose-600 font-bold flex items-center gap-0.5">
                    <ShieldAlert size={12} /> Sắp xếp gọn xe máy
                  </strong>
                  <span className="text-[9px] text-slate-400 font-mono">
                    24/05
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-normal">
                  Yêu cầu cư dân tuân thủ vạch kẻ hầm xe, chừa vị trí lối sạc
                  cho xe điện.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DIALOG VIETQR KẾT NỐI KHÁCH HÀNG MỘT CHẠM ================= */}
      <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md bg-white rounded-xl border border-slate-100 p-5 shadow-2xl overflow-hidden flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
          <DialogHeader className="w-full border-b border-slate-50 pb-3 items-center">
            <DialogTitle className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Receipt size={15} className="text-rose-500 stroke-[2.5]" />
              Quét mã tất toán hóa đơn
            </DialogTitle>
            <DialogDescription className="text-[11px] text-slate-400 font-medium">
              Chuyển khoản chuẩn số tiền để cổng Webhook tự động gạch nợ lập
              phiếu thu.
            </DialogDescription>
          </DialogHeader>

          {/* Phôi VietQR giả lập */}
          <div className="my-3 p-4 border border-slate-50 bg-slate-50/50 rounded-xl relative select-none w-full flex flex-col items-center">
            <div className="w-40 h-40 bg-white border border-slate-200/60 rounded-lg p-2.5 shadow-2xs flex flex-col justify-between items-center relative">
              <div className="flex justify-between w-full">
                <div className="w-9 h-9 border-4 border-slate-900 rounded" />
                <div className="w-9 h-9 border-4 border-slate-900 rounded" />
              </div>
              <div className="w-16 h-16 border border-dashed border-slate-300 rounded flex items-center justify-center text-slate-300 font-mono text-[8px] tracking-tight">
                DANJIN CORE
              </div>
              <div className="flex justify-start w-full">
                <div className="w-9 h-9 border-4 border-slate-900 rounded" />
              </div>
            </div>
            <p className="text-xs font-mono font-black text-rose-600 mt-3 bg-white px-3 py-1 rounded-md border border-slate-100">
              Số tiền: {data.invoice.totalAmount.toLocaleString("vi-VN")} VNĐ
            </p>
          </div>

          {/* Bảng Text an toàn cho thanh toán thủ công */}
          <div className="w-full bg-slate-50/80 border border-slate-100 rounded-xl p-3 text-left space-y-1.5 text-xs font-semibold text-slate-600">
            <div className="flex justify-between items-center border-b border-white pb-1.5">
              <span className="text-slate-400 font-normal">Ngân hàng:</span>
              <span className="text-slate-800">
                MB BANK (Ngân hàng Quân Đội)
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-white pb-1.5">
              <span className="text-slate-400 font-normal">Số tài khoản:</span>
              <button
                type="button"
                onClick={() => handleCopyField("0987654321", "số tài khoản")}
                className="text-slate-800 flex items-center gap-1 font-mono hover:text-slate-900 cursor-pointer"
              >
                0987654321 <Copy size={11} className="text-slate-400" />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-normal">Nội dung ghi:</span>
              <button
                type="button"
                onClick={() =>
                  handleCopyField(
                    `DANJIN P${data.room} ${data.invoice.id}`,
                    "cú pháp chuyển khoản",
                  )
                }
                className="text-rose-600 flex items-center gap-1 font-mono font-bold hover:text-rose-700 cursor-pointer"
              >
                DANJIN P{data.room} {data.invoice.id}{" "}
                <Copy size={11} className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="w-full flex gap-2 pt-4 border-t border-slate-50 mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsQrOpen(false)}
              className="flex-1 h-9 text-xs text-slate-400 hover:text-slate-600 font-bold rounded-lg cursor-pointer"
            >
              Đóng lại
            </Button>
            <Button
              type="button"
              onClick={handleSimulatePayment}
              className="flex-1 h-9 text-xs font-black bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-xs cursor-pointer uppercase tracking-wider"
            >
              Tôi đã chuyển tiền
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
