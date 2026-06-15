/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Wrench,
  CreditCard,
  Receipt,
  FileText,
  Calendar,
  User,
  Clock,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface TicketDetailModalProps {
  selectedTicket: any | null;
  onClose: () => void;
}

export function TicketDetailModal({
  selectedTicket,
  onClose,
}: TicketDetailModalProps) {
  if (!selectedTicket) return null;

  // Tính tổng tiền vật tư ban quản lý kê khai kê từ backend trả về
  const totalCost = (selectedTicket.materialsDetails || []).reduce(
    (sum: number, item: any) => sum + (Number(item?.price) || 0),
    0,
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-md">
            ● Chờ Ban quản lý tiếp nhận
          </span>
        );
      case "PROCESSING":
        return (
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
            ● Đang tiến hành sửa chữa
          </span>
        );
      case "RESOLVED":
        return (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
            ✓ Đã nghiệm thu hoàn thành
          </span>
        );
      case "CANCELLED":
        return (
          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-md">
            ✕ Phiếu đã hủy bỏ
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl bg-white rounded-xl p-0 border border-slate-200 shadow-2xl overflow-hidden font-sans flex flex-col max-h-[85vh]">
        {/* TOP COMPACT HEADER */}
        <DialogHeader className="px-6 py-4 border-b border-slate-100 flex flex-row justify-between items-center bg-white shrink-0">
          <div className="space-y-0.5">
            <DialogTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <div className="p-1 bg-slate-900 rounded text-white">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              Chi tiết tiến độ khắc phục sự cố
            </DialogTitle>
            <DialogDescription className="text-[11px] text-slate-400 font-medium">
              Mã tra cứu:{" "}
              <span className="font-mono font-bold text-slate-700">
                {selectedTicket.id}
              </span>
            </DialogDescription>
          </div>
          <div className="mr-6 select-none">
            {getStatusBadge(selectedTicket.status)}
          </div>
        </DialogHeader>

        {/* MAIN INTERFACE - readonly VIEW */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 font-medium bg-white flex-1">
          {/* 1. KHỐI KHAI BÁO BAN ĐẦU CỦA CƯ DÂN */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-slate-400 text-[11px]">
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold font-mono">
                P.{selectedTicket.room}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {selectedTicket.createdAt}
              </span>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm leading-snug">
                {selectedTicket.title}
              </h4>
              <p className="text-slate-500 bg-slate-50/60 p-3 rounded-lg border border-slate-200/50 text-[11.5px] leading-relaxed">
                {selectedTicket.description}
              </p>
            </div>
          </div>

          {/* 2. THÔNG TIN TIẾP NHẬN & NHÂN SỰ ĐIỀU PHỐI (READONLY) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3" /> Kỹ thuật viên phụ trách
              </span>
              <p className="text-xs font-bold text-slate-800 pt-0.5">
                {selectedTicket.worker || "--- Đang đợi điều phối thợ ---"}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Lịch hẹn sửa chữa
              </span>
              <p className="text-xs font-bold text-slate-800 pt-0.5">
                {selectedTicket.appointmentTime ||
                  "--- Ban quản lý đang xếp lịch ---"}
              </p>
            </div>
          </div>

          {/* 3. MINH BẠCH VẬT TƯ THỰC TẾ PHÁT SINH */}
          <div className="space-y-2.5 pt-1">
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Receipt className="w-3.5 h-3.5" /> Bảng kê khai linh kiện & vật
              tư thay thế
            </label>

            {selectedTicket.materialsDetails &&
            selectedTicket.materialsDetails.length > 0 ? (
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <div className="divide-y divide-slate-50 text-xs bg-white">
                  {selectedTicket.materialsDetails.map(
                    (item: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 px-4 hover:bg-slate-50/30 transition-colors"
                      >
                        <span className="text-slate-600 font-medium">
                          • {item.name}
                        </span>
                        <span className="font-mono font-bold text-slate-900">
                          {item.price.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 bg-slate-50/40 border border-dashed border-slate-200 rounded-lg text-slate-400 text-[11px]">
                Phiếu sửa chữa chưa phát sinh phụ tùng tính phí.
              </div>
            )}
          </div>

          {/* 4. KHỐI TRÁCH NHIỆM TÀI CHÍNH LIỀN KHỐI ĐEN LÌ */}
          <div className="p-4 bg-slate-900 text-white rounded-lg flex justify-between items-center font-mono shadow-inner">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> Phân định chi phí
              </span>
              <span className="text-xs font-bold block pt-0.5">
                {selectedTicket.billResponsibility === "LESSEE"
                  ? "✨ TÍNH VÀO HÓA ĐƠN PHÒNG CƯ DÂN"
                  : "🛡️ BAN QUẢN LÝ / CHỦ NHÀ CHI TRẢ"}
              </span>
            </div>
            <div className="text-right space-y-0.5">
              <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider block">
                Tổng chi phí phát sinh
              </span>
              <span className="text-base font-bold font-mono text-white">
                {selectedTicket.billResponsibility === "LESSEE"
                  ? `${totalCost.toLocaleString("vi-VN")}đ`
                  : "0đ (Miễn phí)"}
              </span>
            </div>
          </div>

          {/* 5. VĂN BẢN GHI CHÚ / BIÊN BẢN NGHIỆM THU TỪ BAN QUẢN LÝ */}
          {selectedTicket.notes && (
            <div className="space-y-1.5 pt-3 border-t border-slate-100">
              <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Phản hồi từ Ban quản lý tòa
                nhà
              </label>
              <div className="rounded-lg bg-slate-50 p-3 text-slate-600 font-medium leading-relaxed border border-slate-100 text-[11px]">
                {selectedTicket.notes}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BAR - CHỈ ĐÓNG CỬA SỔ */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end shrink-0 select-none">
          <Button
            type="button"
            onClick={onClose}
            className="h-9 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg px-6 transition-all active:scale-98 shadow-sm"
          >
            Đóng cửa sổ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
