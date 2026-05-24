/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Printer,
  User,
  CreditCard,
  Building,
  Hash,
  FileText,
  Clock,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

interface ExpenseDetailDialogProps {
  expense: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExpenseDetailDialog({
  expense,
  isOpen,
  onClose,
}: ExpenseDetailDialogProps) {
  if (!expense) return null;

  // Định dạng hiển thị danh mục
  const categoryMap: Record<string, { label: string; color: string }> = {
    MAINTENANCE: {
      label: "Bảo trì & Sửa chữa",
      color: "bg-amber-50 text-amber-700 border-amber-100",
    },
    OPERATING: {
      label: "Vận hành hệ thống",
      color: "bg-blue-50 text-blue-700 border-blue-100",
    },
    EQUIPMENT: {
      label: "Mua sắm trang bị",
      color: "bg-purple-50 text-purple-700 border-purple-100",
    },
  };

  const currentCategory = categoryMap[expense.category] || {
    label: "Chi phí khác",
    color: "bg-slate-50 text-slate-700 border-slate-100",
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-3xl bg-white rounded-xl border border-slate-100 p-0 shadow-2xl overflow-hidden flex flex-col md:flex-row md:h-130 animate-in fade-in zoom-in-95 duration-200 font-sans">
        {/* CỘT TRÁI (7 PHẦN): PHÔI CHỨNG TỪ KẾ TOÁN ẢO */}
        <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto border-r border-slate-50">
          <div className="space-y-5">
            <DialogHeader className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant="outline"
                  className={`${currentCategory.color} text-[9px] font-bold rounded px-1.5 uppercase tracking-wider shadow-none`}
                >
                  {currentCategory.label}
                </Badge>
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                  {expense.id}
                </span>
              </div>
              <DialogTitle className="text-base font-bold text-slate-900 pt-2 tracking-tight">
                {expense.title}
              </DialogTitle>
              <DialogDescription className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Clock size={11} /> Khởi tạo lúc {expense.createdAt} bởi Hệ
                thống
              </DialogDescription>
            </DialogHeader>

            {/* GRID CHI TIẾT BẢO MẬT DÒNG TIỀN */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <User size={11} /> Đối tác nhận tiền
                </span>
                <p className="font-bold text-slate-800">{expense.paidTo}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <CreditCard size={11} /> Hình thức thanh toán
                </span>
                <p className="font-bold text-slate-800 flex items-center gap-1">
                  {expense.paymentMethod === "CASH"
                    ? "💵 Tiền mặt (Két lẻ)"
                    : "💳 Chuyển khoản ngân hàng"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Building size={11} /> Phạm vi áp phí
                </span>
                <p className="font-bold text-slate-800">
                  {expense.room ? (
                    <span className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200/40">
                      Phòng {expense.room}
                    </span>
                  ) : (
                    <span className="text-slate-500 font-medium">
                      🏢 Chi phí chung tòa nhà
                    </span>
                  )}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Hash size={11} /> Số lệnh / Mã tham chiếu
                </span>
                <p className="font-mono font-bold text-slate-700 truncate max-w-37.5">
                  {expense.referenceNo || "---"}
                </p>
              </div>
            </div>

            {/* BOX TRỊ GIÁ PHIẾU CHI TO, RÕ RÀNG */}
            <div className="p-3.5 bg-rose-50/30 border border-rose-100/50 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-rose-500 block">
                  Tổng chi ròng từ quỹ
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Hạch toán trực tiếp vào giá vốn vụ
                </span>
              </div>
              <span className="text-xl font-mono font-black text-rose-600">
                -{expense.amount.toLocaleString("vi-VN")}
                <span className="text-xs font-sans font-normal text-slate-400 ml-0.5">
                  đ
                </span>
              </span>
            </div>
          </div>

          {/* HÀNG BUTTON CHỨNG TỪ ĐÁY */}
          <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-100 mt-5">
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <ShieldCheck size={13} className="stroke-[2.5]" /> Chứng từ hợp lệ
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={onClose}
                className="h-8.5 text-xs text-slate-500 hover:text-slate-700 font-semibold rounded-lg px-3"
              >
                Đóng lại
              </Button>
              <Button
                onClick={() => window.print()}
                className="h-8.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm gap-1.5 px-3.5 cursor-pointer"
              >
                <Printer size={13} /> In phiếu chi
              </Button>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (5 PHẦN): TRỰC QUAN HÓA CHỨNG TỪ HOÁ ĐƠN ĐỐI CHỨNG */}
        <div className="w-full md:w-64 bg-slate-50/50 p-5 flex flex-col justify-between shrink-0 space-y-3">
          <div className="space-y-3 flex-1 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 select-none">
              <FileText size={12} className="text-rose-500" /> Bản quét hóa đơn
              lẻ
            </span>

            {/* Khung giả lập ảnh chụp thực tế cực kỳ tinh tế */}
            <div className="flex-1 min-h-35 md:min-h-0 border border-slate-200/60 bg-white rounded-xl shadow-2xs p-3 flex flex-col items-center justify-center text-center group relative overflow-hidden">
              <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center z-10 cursor-pointer">
                <ExternalLink
                  size={16}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="w-10 h-12 border border-slate-200 rounded bg-slate-50 relative shadow-3xs flex flex-col justify-between p-1 text-[5px] text-slate-300 font-mono">
                <div className="border-b border-slate-200 pb-0.5 font-bold text-rose-400">
                  DANJIN
                </div>
                <div className="space-y-0.5">
                  <div className="w-full h-0.5 bg-slate-200" />
                  <div className="w-4/5 h-0.5 bg-slate-200" />
                </div>
                <div className="w-full h-1 bg-slate-100" />
              </div>
              <p className="text-[10px] font-bold text-slate-600 mt-2.5">
                Xem ảnh hóa đơn
              </p>
              <p className="text-[9px] text-slate-400 font-medium font-mono mt-0.5">
                receipt_evid_01.jpg
              </p>
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1 shadow-3xs">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
              Kiểm toán nội bộ
            </span>
            <p className="text-[9px] leading-relaxed text-slate-400 font-medium">
              Vết mã lệnh và tệp chứng từ đính kèm không được phép sửa đổi sau
              khi phiếu đã ký phát thành công.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
