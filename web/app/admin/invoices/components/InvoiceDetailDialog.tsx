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
  Printer,
  Send,
  QrCode,
  CheckCircle2,
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
import { Invoice } from "../types/invoice.type";

interface InvoiceDetailProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onDownloadPdf?: (id: string) => void;
}

export function InvoiceDetailDialog({
  isOpen,
  onClose,
  invoice,
  onDownloadPdf,
}: InvoiceDetailProps) {
  if (!invoice) return null;

  const isUnpaid = invoice.status !== "Paid";

  // Phân tách dữ liệu chuẩn từ Backend gác lên UI
  const roomItem = invoice.invoiceItems.find((i) => i.type === "ROOM");
  const electricItem = invoice.invoiceItems.find((i) => i.type === "ELECTRIC");
  const waterItem = invoice.invoiceItems.find((i) => i.type === "WATER");
  const serviceItems = invoice.invoiceItems.filter((i) => i.type === "SERVICE");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-3xl bg-white rounded-2xl border border-slate-150 p-0 shadow-2xl font-sans overflow-hidden flex flex-col md:flex-row md:h-[520px] animate-in fade-in zoom-in-95 duration-200">
        {/* ================= CỘT TRÁI: BẢNG CHIẾT TÍNH (FLEXBOX CHẶN TRÔI) ================= */}
        <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
          {/* TẦNG 1: HEADER CỐ ĐỊNH KHÔNG DI DỊCH */}
          <div className="p-5.5 pb-3 border-b border-slate-100 bg-white select-none">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-slate-900 text-slate-100 border-none font-mono text-[9px] font-bold px-2 py-0.5 rounded"
                >
                  MÃ ĐỐI SOÁT: {invoice.id.substring(0, 8).toUpperCase()}
                </Badge>
                <StatusIndicator status={invoice.status} />
              </div>
              <DialogTitle className="text-[15px] font-black text-slate-900 tracking-tight pt-1 flex items-center gap-1.5">
                <Receipt size={15} className="text-indigo-600 stroke-[2.5]" />
                Phiếu kê cước & công nợ P.{invoice.roomNumber}
              </DialogTitle>
              <DialogDescription className="text-[11px] text-slate-400 font-medium">
                Kỳ hạn chốt sổ doanh thu chu kỳ tháng:{" "}
                <span className="text-slate-800 font-bold font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                  {invoice.billingPeriod}
                </span>
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* TẦNG 2: VÙNG CHỨA NỘI DUNG ĐƯỢC PHÉP CUỘN (SCROLLABLE BODY) */}
          <div className="flex-1 overflow-y-auto p-5.5 pt-3 space-y-4.5 bg-slate-50/30">
            {/* SƠ YẾU LÝ LỊCH CƯ DÂN */}
            <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200/60 rounded-xl text-[11.5px] select-none text-slate-600 shadow-3xs">
              <div className="flex items-center gap-1.5">
                <User size={13} className="text-slate-400" />
                <span>
                  Cư dân:{" "}
                  <strong className="text-slate-900 font-bold">
                    {invoice.tenantName}
                  </strong>
                </span>
              </div>
              <div className="h-3 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" />
                <span>
                  Hạn tất toán:{" "}
                  <strong className="text-slate-900 font-mono font-bold">
                    {invoice.dueDate}
                  </strong>
                </span>
              </div>
            </div>

            {/* DANH SÁCH BIỂU PHÍ BÓC TÁCH */}
            <div className="space-y-3">
              {/* PHÂN VÙNG 1: TIỀN PHÒNG GỐC */}
              {roomItem && (
                <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-center justify-between shadow-3xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-sm">
                      <Home size={14} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-[12px]">
                        Tiền thuê căn hộ cứng
                      </h5>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Giá thuê cố định tính theo chu kỳ tháng
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-black text-slate-900 text-[13px]">
                    {roomItem.subTotal.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              )}

              {/* PHÂN VÙNG 2: TIỀN ĐIỆN NƯỚC */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pl-0.5">
                  Hạng mục năng lượng tiêu thụ
                </span>
                <div className="border border-slate-150 bg-white rounded-xl divide-y divide-slate-100 shadow-3xs overflow-hidden">
                  {/* Dòng Điện */}
                  {electricItem && (
                    <div className="flex items-center justify-between p-2.5 text-[11.5px] hover:bg-slate-50/40 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <Zap
                          size={13}
                          className="text-amber-500 stroke-[2.2]"
                        />
                        <div>
                          <span className="font-bold text-slate-800">
                            Tiền điện tiêu thụ
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono ml-2">
                            ({electricItem.previousReading} ➔{" "}
                            {electricItem.currentReading})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.2 rounded font-mono font-bold">
                          +{electricItem.quantity} kWh
                        </span>
                        <span className="font-mono font-bold text-slate-900 w-20 text-right">
                          {electricItem.subTotal.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Dòng Nước */}
                  {waterItem && (
                    <div className="flex items-center justify-between p-2.5 text-[11.5px] hover:bg-slate-50/40 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <Droplets
                          size={13}
                          className="text-blue-500 stroke-[2.2]"
                        />
                        <div>
                          <span className="font-bold text-slate-800">
                            Nước sạch lưu trú
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono ml-2">
                            ({waterItem.previousReading} ➔{" "}
                            {waterItem.currentReading})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.2 rounded font-mono font-bold">
                          +{waterItem.quantity} m³
                        </span>
                        <span className="font-mono font-bold text-slate-900 w-20 text-right">
                          {waterItem.subTotal.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* PHÂN VÙNG 3: TIỀN DỊCH VỤ CỘNG THÊM */}
              {serviceItems.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pl-0.5">
                    Dịch vụ tiện ích tích hợp
                  </span>
                  <div className="border border-slate-150 bg-white rounded-xl divide-y divide-slate-100 shadow-3xs overflow-hidden">
                    {serviceItems.map((item, key) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-2.5 text-[11.5px] hover:bg-slate-50/40 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Wrench
                            size={13}
                            className="text-slate-400 stroke-[2.2]"
                          />
                          <span className="font-medium text-slate-700 truncate">
                            {item.itemName}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-slate-900 pl-2 shrink-0">
                          {item.subTotal.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TẦNG 3: FOOTER THANH CÔNG CỤ CỐ ĐỊNH Ở ĐÁY (STICKY FOOTER) */}
          <div className="p-4 px-5.5 border-t border-slate-100 bg-white flex items-center gap-2 select-none shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
            <Button
              onClick={() => onDownloadPdf && onDownloadPdf(invoice.id)}
              variant="outline"
              size="sm"
              className="h-8 text-xs font-bold border-slate-200 text-slate-600 bg-white rounded-xl px-2.5 hover:bg-slate-50 shadow-3xs cursor-pointer"
            >
              <Printer size={12} className="mr-1.5 text-slate-400" /> Xuất PDF
            </Button>
            {isUnpaid && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-bold border-slate-200 text-slate-600 bg-white rounded-xl px-2.5 hover:bg-slate-50 gap-1 shadow-3xs cursor-pointer"
              >
                <Send size={12} className="text-slate-400" /> Nhắc nợ
              </Button>
            )}
            <div className="flex-1" />
            <Button
              variant="ghost"
              onClick={onClose}
              className="h-8 text-xs text-slate-400 hover:text-slate-600 font-bold rounded-xl cursor-pointer"
            >
              Đóng lại
            </Button>
          </div>
        </div>

        {/* ================= CỘT PHẢI: KHU VỰC THỂ THAN QR CODE (GIỮ NGUYÊN TỶ LỆ) ================= */}
        <div className="w-full md:w-[240px] bg-slate-50 p-4 flex flex-col border-t md:border-t-0 md:border-l border-slate-200/60 select-none shrink-0 justify-between">
          <div className="space-y-3 flex-1 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1 pl-0.5">
              <QrCode size={12} className="text-indigo-500" /> CỔNG VIETQR CHỐT
              SỔ
            </span>

            <div className="bg-white p-3.5 shadow-xs rounded-xl border border-slate-200 flex-1 flex flex-col justify-between space-y-3">
              <div className="flex flex-col items-center justify-center space-y-2 py-1 flex-1">
                <div className="h-38 w-38 border border-slate-150 p-2 rounded-xl bg-white shadow-3xs flex items-center justify-center">
                  <img
                    src={
                      invoice.qrUrl ||
                      "https://img.vietqr.io/image/vcb-123456-compact.png"
                    }
                    alt="Mã QR Thanh toán"
                    className={`w-full h-full object-contain transition-all duration-300 ${isUnpaid ? "opacity-100" : "opacity-5 blur-xs"}`}
                  />
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight text-center leading-normal max-w-[150px]">
                  {isUnpaid
                    ? "Quét gạch nợ tự động SePay"
                    : "Hóa đơn đã khóa sổ quỹ"}
                </span>
              </div>

              <div className="space-y-2 mt-auto">
                <div className="p-3 bg-slate-950 text-white rounded-xl relative overflow-hidden shadow-md">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 block leading-none">
                    TỔNG TIỀN PHẢI THU
                  </span>
                  <div className="flex items-baseline gap-0.5 pt-1.5">
                    <span className="text-lg font-black font-mono tracking-tight leading-none text-white">
                      {invoice.totalAmount.toLocaleString("vi-VN")}
                    </span>
                    <span className="text-[9px] font-bold font-sans opacity-40 ml-1 text-slate-400">
                      VND
                    </span>
                  </div>
                </div>

                {isUnpaid ? (
                  <div className="w-full h-8 flex items-center justify-center bg-amber-500/10 border border-amber-500/20 text-amber-700 rounded-lg text-[10px] font-extrabold uppercase tracking-wider select-none animate-pulse">
                    Chờ khớp dòng tiền...
                  </div>
                ) : (
                  <div className="w-full h-8 flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-lg text-[10px] font-extrabold uppercase tracking-wider select-none">
                    <CheckCircle2 size={12} className="stroke-[2.5] mr-1" /> Đã
                    tất toán
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

function StatusIndicator({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string; dot: string }> = {
    Paid: {
      label: "Đã thu tiền",
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
      className={`${current.class} border px-2 py-0 h-4.5 rounded-full text-[9px] font-bold flex items-center gap-1.5 cursor-default select-none`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </Badge>
  );
}
