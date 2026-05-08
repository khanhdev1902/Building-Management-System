"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { Badge } from "@/shared/components/ui/badge";
import {
  ReceiptText,
  Calendar,
  ArrowUpRight,
  User2,
  Hash,
  ArrowRightLeft,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface Invoice {
  id: string;
  month: string;
  year: string;
  totalAmount: number;
  status: "paid" | "pending" | "overdue" | string;
  paidBy?: string; // Người thanh toán
  paymentMethod?: string; // Chuyển khoản / Tiền mặt
  paymentDate?: string; // Ngày trả tiền
  transactionId?: string; // Mã tham chiếu (mã giao dịch bank)
}

interface InvoiceHistorySheetProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
}

export const InvoiceHistorySheet = ({
  isOpen,
  onClose,
  invoices,
}: InvoiceHistorySheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className=" sm:max-w-lg border-l border-slate-100 p-0 overflow-hidden flex flex-col">
        {/* Header - Tối giản & Chuyên nghiệp */}
        <div className=" pb-6 border-b border-slate-50 bg-white">
          <SheetHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                <ReceiptText className="w-5 h-5 text-white" />
              </div>
              <SheetTitle className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                Lịch sử hóa đơn
              </SheetTitle>
            </div>
            <SheetDescription className="text-slate-500 text-sm">
              Chi tiết các khoản thu và lịch sử thanh toán hàng tháng của căn
              hộ.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Nội dung danh sách */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className={cn(
                  "group bg-white border rounded-xl overflow-hidden transition-all duration-200",
                  invoice.status === "paid"
                    ? "border-slate-200"
                    : "border-amber-200 shadow-sm shadow-amber-50",
                )}
              >
                {/* Phần Header của Card */}
                <div className="p-4 flex items-center justify-between border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-1">
                        Kỳ thanh toán
                      </p>
                      <p className="text-sm font-bold text-slate-900 leading-none">
                        Tháng {invoice.month}/{invoice.year}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase shadow-none border",
                      invoice.status === "paid"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : invoice.status === "pending"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : "bg-red-50 text-red-600 border-red-100",
                    )}
                  >
                    {invoice.status === "paid"
                      ? "Đã thu"
                      : invoice.status === "pending"
                        ? "Chờ thu"
                        : "Quá hạn"}
                  </Badge>
                </div>

                {/* Phần Thông tin chi tiết */}
                <div className="p-4 space-y-4">
                  {invoice.status === "paid" ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <InfoItem
                          icon={<User2 size={12} />}
                          label="Người thanh toán"
                          value={invoice.paidBy || "--"}
                        />
                        <InfoItem
                          icon={<ArrowRightLeft size={12} />}
                          label="Phương thức"
                          value={invoice.paymentMethod || "--"}
                        />
                      </div>
                      <div className="space-y-3">
                        <InfoItem
                          icon={<Clock size={12} />}
                          label="Ngày trả"
                          value={invoice.paymentDate || "--"}
                        />
                        <InfoItem
                          icon={<Hash size={12} />}
                          label="Mã giao dịch"
                          value={invoice.transactionId || "--"}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <AlertTriangle
                        className="text-amber-500 shrink-0 mt-0.5"
                        size={14}
                      />
                      <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                        Hóa đơn này đang đợi xác nhận thanh toán hoặc chưa có
                        giao dịch phát sinh.
                      </p>
                    </div>
                  )}

                  {/* Phần Tổng tiền & Action */}
                  <div className="pt-3 border-t border-slate-50 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">
                        Tổng tiền thu
                      </p>
                      <p className="text-xl font-black text-slate-900 tracking-tight">
                        {invoice.totalAmount.toLocaleString()}{" "}
                        <span className="text-xs font-normal">đ</span>
                      </p>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 transition-colors uppercase">
                      Xem chi tiết <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Sub-component cho gọn
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
        <span className="text-slate-300">{icon}</span> {label}
      </p>
      <p className="text-xs font-bold text-slate-700 truncate">{value}</p>
    </div>
  );
}
