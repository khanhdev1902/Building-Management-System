/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import {
  Receipt,
  User,
  Home,
  Calendar,
  Zap,
  Droplets,
  Wrench,
  FileCheck2,
  QrCode,
  Printer,
  Send,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";


// Khai báo cấu trúc Type nghiêm ngặt cho dữ liệu hóa đơn đối soát
interface InvoiceDetailProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    id: string;
    room: string;
    tenant: string;
    amount: number;
    dueDate: string;
    status: string;
    counters: {
      electric: { old: number; new: number; used: number };
      water: { old: number; new: number; used: number };
    };
    breakdown: {
      rent: number;
      electric: number;
      water: number;
      service: number;
    };
  } | null;
  onConfirmPayment?: (id: string) => void;
}

export function InvoiceDetailDialog({
  isOpen,
  onClose,
  invoice,
  onConfirmPayment,
}: InvoiceDetailProps) {
  if (!invoice) return null;

  const isUnpaid = invoice.status !== "Paid";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Nới rộng khung lên mốc 3xl thoáng đạt, phẳng trần không đệm viền thừa */}
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-3xl bg-white rounded-xl border border-slate-200 p-0 shadow-xl font-sans overflow-hidden flex flex-col md:flex-row md:h-130 animate-in fade-in zoom-in-95 duration-200">
        {/* ================= CỘT TRÁI (7 PHẦN): BẢNG CHIẾT TÍNH TIỀN PHÒNG ĐẬM NGỮ CẢNH ================= */}
        <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <DialogHeader className="select-none">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-slate-900 text-white border-none font-mono text-[10px] font-bold px-1.5 py-0 rounded"
                >
                  {invoice.id}
                </Badge>
                <StatusIndicator status={invoice.status} />
              </div>
              <DialogTitle className="text-sm font-black text-slate-950 uppercase tracking-wide pt-1 flex items-center gap-1.5">
                <Receipt size={15} className="text-slate-400 stroke-[2.5]" />
                Chi tiết bảng kê công nợ phòng {invoice.room}
              </DialogTitle>
              <DialogDescription className="text-[11px] text-slate-400 font-medium">
                Đối soát chỉ số tiêu thụ và các cấu phần cước sinh hoạt kỳ{" "}
                <strong className="text-slate-600 font-mono">05/2026</strong>.
              </DialogDescription>
            </DialogHeader>

            {/* THẺ TÓM TẮT LÝ LỊCH CHỦ HỘ */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50/60 border border-slate-100 rounded-xl text-xs select-none">
              <div className="space-y-0.5">
                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-tight block">
                  Cư dân đại diện
                </span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <User size={12} className="text-slate-400" /> {invoice.tenant}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-tight block">
                  Hạn kì tất toán
                </span>
                <span className="font-bold text-slate-800 font-mono flex items-center gap-1">
                  <Calendar size={12} className="text-slate-400" />{" "}
                  {invoice.dueDate}
                </span>
              </div>
            </div>

            {/* BẢNG KÊ KHAI CHI TIẾT DỊCH VỤ PHẲNG LÌ */}
            <div className="space-y-2 select-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pl-0.5">
                Cấu phần cước phí chi tiết
              </span>

              <div className="border border-slate-100 rounded-xl overflow-hidden text-xs">
                {/* Hàng 1: Tiền nhà */}
                <div className="flex items-center justify-between p-3 bg-white hover:bg-slate-50/40 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-slate-50 rounded-md border border-slate-100">
                      <Home size={13} className="text-slate-500" />
                    </div>
                    <span className="font-semibold text-slate-700">
                      Tiền phòng cứng định kỳ
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {invoice.breakdown.rent.toLocaleString("vi-VN")} đ
                  </span>
                </div>

                <div className="h-px bg-slate-100 w-full" />

                {/* Hàng 2: Tiền điện kèm chỉ số cũ mới */}
                <div className="flex items-center justify-between p-3 bg-white hover:bg-slate-50/40 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-amber-50 rounded-md border border-amber-100/40">
                      <Zap size={13} className="text-amber-500" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-700 block">
                        Tiện ích điện tiêu thụ
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        Chỉ số: {invoice.counters.electric.old} ➔{" "}
                        {invoice.counters.electric.new} (
                        <strong className="text-slate-600 font-bold">
                          +{invoice.counters.electric.used} kWh
                        </strong>
                        )
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {invoice.breakdown.electric.toLocaleString("vi-VN")} đ
                  </span>
                </div>

                <div className="h-px bg-slate-100 w-full" />

                {/* Hàng 3: Tiền nước kèm chỉ số */}
                <div className="flex items-center justify-between p-3 bg-white hover:bg-slate-50/40 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-blue-50 rounded-md border border-blue-100/40">
                      <Droplets size={13} className="text-blue-500" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-700 block">
                        Nước sạch lưu trú
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        Chỉ số: {invoice.counters.water.old} ➔{" "}
                        {invoice.counters.water.new} (
                        <strong className="text-slate-600 font-bold">
                          +{invoice.counters.water.used} m³
                        </strong>
                        )
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {invoice.breakdown.water.toLocaleString("vi-VN")} đ
                  </span>
                </div>

                <div className="h-px bg-slate-100 w-full" />

                {/* Hàng 4: Phí dịch vụ gộp */}
                <div className="flex items-center justify-between p-3 bg-white hover:bg-slate-50/40 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-indigo-50 rounded-md border border-indigo-100/40">
                      <Wrench size={13} className="text-indigo-500" />
                    </div>
                    <span className="font-semibold text-slate-700">
                      Combo Quản lý, Mạng Wifi & Vệ sinh
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {invoice.breakdown.service.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* THANH CÔNG CỤ CHÂN TRANG TRÁI */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-4 select-none">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold border-slate-200 text-slate-600 bg-white rounded-lg px-2.5"
            >
              <Printer size={12} className="mr-1 text-slate-400" /> In phiếu thu
            </Button>
            {isUnpaid && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold border-slate-200 text-slate-600 bg-white rounded-lg px-2.5 gap-1"
              >
                <Send size={12} className="text-slate-400" /> Nhắc nợ Zalo/SMS
              </Button>
            )}
            <div className="flex-1" />
            <Button
              variant="ghost"
              onClick={onClose}
              className="h-8 text-xs text-slate-400 hover:text-slate-700 font-bold rounded-lg cursor-pointer"
            >
              Đóng lại
            </Button>
          </div>
        </div>

        {/* ================= CỘT PHẢI (5 PHẦN): KHU VỰC QUÉT MÃ VIETQR SLATE THAN SANG TRỌNG ================= */}
        <div className="w-full md:w-72 bg-slate-50/60 p-5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 select-none shrink-0">
          <div className="space-y-4 flex-1 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
              <QrCode size={11} className="text-indigo-500" /> Cổng gạch nợ
              nhanh VietQR
            </span>

            {/* KHUNG THẺ HÓA ĐƠN ĐIỆN TỬ CHÌM GIỮA NỀN */}
            <div className="bg-white p-4 shadow-sm rounded-xl border border-slate-200/60 relative overflow-hidden flex-1 flex flex-col justify-between space-y-4">
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900" />

              {/* QR Code giả lập căn khít */}
              <div className="flex flex-col items-center justify-center space-y-2 py-2 flex-1">
                <div className="h-52 w-52 border border-slate-200 p-2 rounded-lg bg-white shadow-3xs flex items-center justify-center transition-all hover:border-slate-400">
                  <img
                    src={`https://qr.sepay.vn/img?acc=VQRQAJEQY6518&bank=MBBank&amount=2000&des=Thanh_Toan_Tien_Phong_T8`}
                    alt="Mã QR Thanh toán"
                    className={`w-full h-full object-cover ${isUnpaid ? "text-slate-900" : "text-slate-200"}`}
                  />
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight text-center">
                  {isUnpaid
                    ? "Quét để tất toán nhanh qua App Bank"
                    : "Giao dịch đã đóng số"}
                </span>
              </div>

              {/* TỔNG TIỀN PHẢI ĐÓNG SẮP XẾP ĐẰNG CHÂN BOX */}
              <div className="space-y-2 mt-auto">
                <div className="p-3 bg-slate-950 text-white rounded-xl relative overflow-hidden shadow-sm">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block leading-none">
                    Tổng cước thu kỳ này
                  </span>
                  <div className="flex items-baseline gap-0.5 pt-1.5">
                    <span className="text-xl font-black font-mono tracking-tight leading-none text-white">
                      {invoice.amount.toLocaleString("vi-VN")}
                    </span>
                    <span className="text-[10px] font-bold font-sans opacity-60 ml-0.5 text-slate-400">
                      VND
                    </span>
                  </div>
                </div>

                {/* Phím bấm Duyệt nợ thông minh dành riêng cho Admin */}
                {isUnpaid ? (
                  <Button
                    onClick={() => {
                      if (onConfirmPayment) onConfirmPayment(invoice.id);
                      onClose();
                    }}
                    className="w-full h-8 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-2xs gap-1 cursor-pointer uppercase tracking-wider transition-colors"
                  >
                    <FileCheck2 size={12} className="stroke-[2.5]" /> Xác nhận
                    khớp tiền
                  </Button>
                ) : (
                  <div className="w-full h-8 flex items-center justify-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-[11px] font-bold uppercase select-none">
                    ✓ Đã tất toán sổ gốc
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// COMPONENT HELPER 1: ĐÈN CHỈ BÁO TRẠNG THÁI TIỀN DẸT MỊN KHÍT KHÔNG GIAN
function StatusIndicator({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string; dot: string }> = {
    Paid: {
      label: "Đã thu",
      class: "bg-emerald-50 text-emerald-700 border-emerald-100",
      dot: "bg-emerald-500",
    },
    Pending: {
      label: "Chờ duyệt",
      class: "bg-amber-50 text-amber-700 border-amber-100",
      dot: "bg-amber-500",
    },
    Overdue: {
      label: "Quá hạn treo",
      class: "bg-rose-50 text-rose-700 border-rose-100",
      dot: "bg-rose-500",
    },
  };
  const current = map[status] || map.Pending;
  return (
    <Badge
      variant="outline"
      className={`${current.class} border px-2 py-0 h-4.5 rounded-full text-[9px] font-bold flex items-center gap-1 cursor-default select-none`}
    >
      <span className={`h-1 w-1 rounded-full ${current.dot}`} />
      {current.label}
    </Badge>
  );
}
