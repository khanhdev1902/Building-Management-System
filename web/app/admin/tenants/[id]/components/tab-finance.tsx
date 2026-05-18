"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Receipt,
  AlertCircle,
  Clock,
  CreditCard,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ReceiptText,
  // ReceiptX,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { billingHistory } from "./data-finance";

const ITEMS_PER_PAGE = 5;

export function TabFinance() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập hiệu ứng fetch dữ liệu từ API Server năm 2026
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [currentPage]);

  // Thuật toán cắt lát phân trang
  const totalPages = Math.ceil(billingHistory.length / ITEMS_PER_PAGE);
  const paginatedBills = useMemo(() => {
    return billingHistory.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );
  }, [currentPage]);

  return (
    <div className="divide-y divide-slate-100/70 font-sans animate-in fade-in duration-300">
      {/* SECTION 1: THANH ĐIỀU ĐỘNG TÁC VỤ & NHẮC NỢ PHẲNG */}
      <section className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Receipt size={14} className="text-slate-400" /> Sổ gốc đối soát
            công nợ hóa đơn
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">
            Ghi nhận luồng tiền thực thu, công nợ lũy kế và lịch sử khớp lệnh
            chứng từ ngân hàng.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[10px] font-semibold border-dashed border-rose-200 bg-rose-50/20 text-rose-700 hover:bg-rose-50 rounded-md"
          >
            <AlertCircle size={12} className="mr-1 stroke-[2.5]" /> Gửi nhắc nợ
            (Zalo/SMS)
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[10px] font-semibold border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md"
          >
            <FileSpreadsheet size={12} className="mr-1 text-slate-400" /> Xuất
            phôi Excel
          </Button>
        </div>
      </section>

      {/* SECTION 2: BẢNG KÊ SỐ LIỆU DOANH THU & PHÂN TÁCH LÕI CHỨNG TỪ */}
      <section className="p-5 space-y-4">
        <div className="rounded-xl border border-slate-200/60 overflow-hidden bg-white flex flex-col min-h-[280px]">
          <Table>
            <TableHeader className="bg-slate-50/30 border-b border-slate-100 select-none">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-4 py-2 w-[12%]">
                  Kỳ chu kỳ
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 w-[12%]">
                  Mã hóa đơn
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 w-[28%]">
                  Cấu phần chi phí bóc tách
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 text-right w-[12%]">
                  Tổng tiền nhà
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 text-right w-[12%]">
                  Đã thực thu
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 text-right w-[12%]">
                  Dư nợ đọng
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 text-center w-[12%]">
                  Trạng thái tiền
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-50 text-xs">
              {/* TRẠNG THÁI 1: ĐANG LOAD DATA (SKELETON ANIMATION SHIMMER) */}
              {isLoading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <TableRow
                    key={i}
                    className="hover:bg-transparent border-none"
                  >
                    <TableCell className="pl-4 py-4.5">
                      <div className="h-3.5 bg-slate-100 rounded-sm w-16 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-3 bg-slate-100 rounded-sm w-20 animate-pulse font-mono" />
                    </TableCell>
                    <TableCell className="py-4.5">
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-100 rounded-sm w-full max-w-[220px] animate-pulse" />
                        <div className="h-2.5 bg-slate-50 rounded-sm w-36 animate-pulse" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-3.5 bg-slate-100 rounded-sm w-16 ml-auto animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-3.5 bg-slate-100 rounded-sm w-16 ml-auto animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-3.5 bg-slate-100 rounded-sm w-12 ml-auto animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4.5 bg-slate-100 rounded-md w-16 mx-auto animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : billingHistory.length === 0 ? (
                /* TRẠNG THÁI 2: DATA RỖNG (EMPTY STATE CHUẨN SAAS) */
                <TableRow className="hover:bg-transparent border-none">
                  <TableCell colSpan={7} className="h-[280px] text-center">
                    <div className="flex flex-col items-center justify-center max-w-xs mx-auto text-slate-400 space-y-2 select-none">
                      <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 mb-1">
                        <ReceiptText size={18} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xs font-semibold text-slate-800">
                        Chưa phát sinh lịch sử tài chính
                      </h3>
                      <p className="text-[11px] text-slate-400 text-center leading-normal">
                        Cư dân phòng này mới ký bàn giao mặt bằng, hệ thống chưa
                        khởi tạo kỳ hóa đơn đầu kỳ.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                /* TRẠNG THÁI 3: CÓ DATA - ĐỔ DỮ LIỆU PHÂN TRANG THỰC TẾ */
                paginatedBills.map((bill, idx) => (
                  <TableRow
                    key={idx}
                    className="hover:bg-slate-50/30 border-none group"
                  >
                    <TableCell className="font-bold text-slate-800 pl-4 py-3">
                      {bill.period}
                    </TableCell>
                    <TableCell className="font-mono font-semibold text-slate-400">
                      {bill.invoiceId}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-medium text-slate-400 font-sans">
                        <span>
                          Tiền nhà:{" "}
                          <strong className="text-slate-600 font-mono">
                            {(bill.breakdown.rent / 1000).toLocaleString()}k
                          </strong>
                        </span>
                        <span>
                          Điện:{" "}
                          <strong className="text-slate-600 font-mono">
                            {bill.breakdown.electric / 1000}k
                          </strong>
                        </span>
                        <span>
                          Nước:{" "}
                          <strong className="text-slate-600 font-mono">
                            {bill.breakdown.water / 1000}k
                          </strong>
                        </span>
                        <span>
                          Phí DV:{" "}
                          <strong className="text-slate-600 font-mono">
                            {bill.breakdown.service / 1000}k
                          </strong>
                        </span>
                      </div>
                      <div className="text-[9px] text-slate-400 mt-1 font-sans flex items-center gap-1 font-medium">
                        <CreditCard size={10} />
                        <span>
                          {bill.method} •{" "}
                          <span className="font-mono">{bill.payDate}</span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-slate-900">
                      {bill.total.toLocaleString("vi-VN")}đ
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-emerald-600">
                      {bill.paidAmount.toLocaleString("vi-VN")}đ
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono font-bold ${bill.debt > 0 ? "text-rose-600" : "text-slate-300"}`}
                    >
                      {bill.debt > 0
                        ? `${bill.debt.toLocaleString("vi-VN")}đ`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-center py-3">
                      <Badge
                        variant="outline"
                        className={`border-none text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          bill.status === "paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {bill.status === "paid"
                          ? "Đã tất toán"
                          : "Thu một phần"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* CHÂN ĐIỀU HƯỚNG PHÂN TRANG (PAGINATION PANEL) */}
          {!isLoading && billingHistory.length > 0 && totalPages > 1 && (
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/20 flex items-center justify-between select-none shrink-0 border-none mt-auto">
              <p className="text-[11px] font-medium text-slate-400">
                Hiển thị{" "}
                <span className="text-slate-700 font-bold font-mono">
                  {paginatedBills.length}
                </span>{" "}
                trên {billingHistory.length} hóa đơn kỳ
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-slate-400">
                  Trang{" "}
                  <span className="text-slate-800 font-bold font-mono">
                    {currentPage}
                  </span>{" "}
                  / {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6.5 w-6.5 rounded-md border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all disabled:opacity-40"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                  >
                    <ChevronLeft className="w-3.5 h-3.5 stroke-[1.8]" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6.5 w-6.5 rounded-md border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all disabled:opacity-40"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                  >
                    <ChevronRight className="w-3.5 h-3.5 stroke-[1.8]" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Khối cảnh báo rủi ro thất thoát tiền mặt */}
        <div className="flex items-start gap-1.5 text-[10px] text-slate-400 font-medium leading-normal bg-slate-50/60 p-2.5 rounded-lg border border-dashed border-slate-200 select-none">
          <Clock size={12} className="text-slate-400 mt-0.5 shrink-0" />
          <span>
            Mọi lịch sử chuyển khoản đều được tự động đối soát qua webhook
            Iban/VietQR của hệ thống Danjin BMS. Trực ban quản lý tòa nhà tuyệt
            đối không tự ý gạch nợ thủ công bằng tiền mặt nếu không có lệnh phê
            duyệt từ ban tài chính nội bộ.
          </span>
        </div>
      </section>
    </div>
  );
}
