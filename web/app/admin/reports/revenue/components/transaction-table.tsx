// src/app/revenue/components/transaction-table.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Eye,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Transaction, StatusType } from "../types/revenue.type";

interface TransactionTableProps {
  visibleTxns: Transaction[];
}

// ─── HELPER BADGE TRẠNG THÁI NỘI BỘ ──────────────────────────────────────────
function renderStatusBadge(status: StatusType) {
  switch (status) {
    case "Paid":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
          <CheckCircle2 size={11} /> Đã thu
        </span>
      );
    case "Pending":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
          <HelpCircle size={11} /> Chờ khớp
        </span>
      );
    case "Overdue":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
          <AlertTriangle size={11} /> Quá hạn
        </span>
      );
  }
}

export default function TransactionTable({
  visibleTxns,
}: TransactionTableProps) {
  // ⚡ Quản lý State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Thiết lập cố định 10 dòng/trang theo gu anh thích

  // Tự động nhảy về trang 1 nếu người dùng tương tác với bộ lọc ở file page.tsx ngoài
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [visibleTxns]);

  // Tính toán tổng số trang
  const totalPages = Math.ceil(visibleTxns.length / itemsPerPage) || 1;

  // Cắt mảng dữ liệu hiển thị theo vị trí trang hiện tại
  const paginatedTxns = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return visibleTxns.slice(startIndex, startIndex + itemsPerPage);
  }, [visibleTxns, currentPage]);

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5 space-y-4">
      {/* HEADER BẢNG */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Nhật ký hóa đơn & Dòng tiền chi tiết
          </h3>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
            Danh sách hóa đơn lọc động theo điều kiện đối soát ở trên
          </p>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] font-bold border-slate-200 text-slate-500 font-mono bg-slate-50 rounded px-2 py-0.5"
        >
          Khớp bộ lọc: {visibleTxns.length} chứng từ
        </Badge>
      </div>

      {/* CẤU TRÚC ĐỐI SOÁT */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider select-none border-b border-slate-100">
              <th className="py-2.5 px-3">Mã hóa đơn</th>
              <th className="py-2.5 px-2">Ngày lập</th>
              <th className="py-2.5 px-2">Phòng</th>
              <th className="py-2.5 px-2">Cư dân</th>
              <th className="py-2.5 px-2">Kênh thanh toán</th>
              <th className="py-2.5 px-2 text-right">Giá trị</th>
              <th className="py-2.5 px-3 text-center">Trạng thái</th>
              <th className="py-2.5 px-2 text-center w-12">Xem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
            {paginatedTxns.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-8 text-slate-400 italic"
                >
                  Không tìm thấy chứng từ nào khớp với bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              paginatedTxns.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-50/40 transition-colors"
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    {t.id}
                  </td>
                  <td className="py-3 px-2 text-slate-400 font-mono">
                    {t.date}
                  </td>
                  <td className="py-3 px-2 font-mono font-bold text-indigo-600">
                    P.{t.room}
                  </td>
                  <td className="py-3 px-2 text-slate-800 font-semibold">
                    {t.name}
                  </td>
                  <td className="py-3 px-2 text-slate-500 font-medium">
                    {t.method || "—"}
                  </td>
                  <td className="py-3 px-2 text-right font-mono font-bold text-slate-900">
                    {t.amount.toLocaleString("vi-VN")}đ
                  </td>
                  <td className="py-3 px-3 text-center">
                    {renderStatusBadge(t.status)}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <button className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer">
                      <Eye size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── ⚡ KHỐI PHÂN TRANG CHUẨN SAAS MINIMALIST ── */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 select-none">
        <p className="text-[11px] text-slate-400 font-medium">
          Hiển thị hóa đơn{" "}
          <span className="text-slate-700 font-mono font-bold">
            {visibleTxns.length === 0
              ? 0
              : (currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          -{" "}
          <span className="text-slate-700 font-mono font-bold">
            {Math.min(currentPage * itemsPerPage, visibleTxns.length)}
          </span>{" "}
          trên tổng số{" "}
          <span className="text-slate-700 font-mono font-bold">
            {visibleTxns.length}
          </span>{" "}
          chứng từ
        </p>

        <div className="flex items-center gap-1.5">
          {/* Nút lùi trang */}
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="h-7 w-7 rounded-lg border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 shadow-3xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>

          {/* Dãy số trang số tự động co giãn */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              size="sm"
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              className={`h-7 w-7 rounded-lg text-[11px] font-bold font-mono transition-all ${
                currentPage === page
                  ? "bg-slate-950 text-white border-none shadow-3xs"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {page}
            </Button>
          ))}

          {/* Nút tiến trang */}
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="h-7 w-7 rounded-lg border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 shadow-3xs"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
