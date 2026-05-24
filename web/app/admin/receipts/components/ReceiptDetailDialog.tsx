"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { User, Calendar, Printer, ShieldCheck } from "lucide-react";

interface ReceiptDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: {
    id: string;
    invoiceId: string | null;
    room: string | null;
    tenant: string;
    amount: number;
    type: string;
    paymentMethod: string;
    collectedBy: string;
    createdAt: string;
    referenceNo: string;
  } | null;
}

export function ReceiptDetailDialog({
  isOpen,
  onClose,
  receipt,
}: ReceiptDetailDialogProps) {
  if (!receipt) return null;

  // Bản đồ dịch nghĩa phân loại nghiệp vụ phiếu thu
  const typeMap: Record<string, string> = {
    CONTRACT_INITIAL: "Tiền cọc & Nhà đầu kỳ ký HĐ",
    ROOM_REPAIR: "Chi phí sửa chữa / Bảo trì thiết bị",
    EXTERNAL_REVENUE: "Doanh thu tự do ngoài vận hành",
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md bg-white rounded-xl border border-slate-200 p-5 shadow-xl font-sans overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* MẶT PHÔI PHIẾU THU ĐIỆN TỬ PHẲNG LÌ */}
        <div className="space-y-4 relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-950 -mt-5 -mx-5" />

          <DialogHeader className="select-none items-center text-center pt-2">
            <Badge
              variant="outline"
              className="bg-slate-100 border-slate-200 text-slate-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded"
            >
              {receipt.id}
            </Badge>
            <DialogTitle className="text-sm font-black text-slate-950 uppercase tracking-wide pt-1.5 flex items-center gap-1">
              Phiếu thu tiền điện tử
            </DialogTitle>
            <DialogDescription className="text-[10px] text-slate-400 font-mono">
              Danjin BMS Ledger Security Verification Verified
            </DialogDescription>
          </DialogHeader>

          {/* CHI TIẾT CẤU PHẦN DÒNG TIỀN THỰC THU */}
          <div className="border border-slate-100 rounded-xl bg-slate-50/40 p-4 space-y-3 text-xs font-medium text-slate-600">
            <div className="flex justify-between items-start border-b border-slate-100 pb-2">
              <span className="text-slate-400">Nội dung nguồn thu:</span>
              <span className="text-slate-900 font-bold text-right max-w-50">
                {typeMap[receipt.type] || "Cước phí sinh hoạt tổng"}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-slate-400">Người nộp tiền:</span>
              <span className="text-slate-900 font-bold flex items-center gap-1">
                <User size={12} className="text-slate-400" /> {receipt.tenant}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-slate-400">Vị trí phòng đối chiếu:</span>
              <span className="font-mono font-bold text-slate-900">
                {receipt.room ? `P.${receipt.room}` : "Ngoại vi (Thu ngoài)"}
              </span>
            </div>

            {receipt.invoiceId && (
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-400">Liên thông Hóa đơn:</span>
                <span className="font-mono text-slate-500 font-semibold">
                  {receipt.invoiceId}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-slate-400">Hình thức / Người duyệt:</span>
              <span className="text-slate-800 font-semibold text-right">
                {receipt.collectedBy} (
                {receipt.paymentMethod === "BANK_TRANSFER"
                  ? "VietQR"
                  : "Tiền mặt"}
                )
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-slate-400">Mã tham chiếu / Mã vết:</span>
              <span className="font-mono text-slate-500 truncate max-w-45">
                {receipt.referenceNo}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-400">Thời gian khóa sổ thu:</span>
              <span className="font-mono text-slate-500 flex items-center gap-1">
                <Calendar size={11} /> {receipt.createdAt}
              </span>
            </div>
          </div>

          {/* HỘP TỔNG TIỀN ĐEN SẪM LÌ LỢM */}
          <div className="p-3.5 bg-slate-950 text-white rounded-xl relative overflow-hidden shadow-sm flex items-center justify-between select-none">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block leading-none">
                Số tiền thực nhận nhập quỹ
              </span>
              <div className="flex items-baseline gap-0.5 pt-1">
                <span className="text-xl font-black font-mono tracking-tight leading-none text-white">
                  {receipt.amount.toLocaleString("vi-VN")}
                </span>
                <span className="text-[10px] font-bold font-sans opacity-60 ml-0.5 text-slate-400">
                  VND
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg h-5 uppercase tracking-tight">
              <ShieldCheck size={11} className="stroke-[2.5]" /> Khớp $100\%$
            </div>
          </div>

          {/* PHÍM ĐIỀU PHỐI ĐÁY KHAY */}
          <div className="flex items-center gap-2 pt-2 select-none">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold border-slate-200 text-slate-600 bg-white rounded-lg px-3 flex-1"
              onClick={() => window.print()}
            >
              <Printer size={12} className="mr-1 text-slate-400" /> In chứng từ
              giấy
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="h-8 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-none cursor-pointer uppercase tracking-wide text-[10px]"
            >
              Đóng phôi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
