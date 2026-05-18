/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Receipt,
  FileSpreadsheet,
  Search,
  SearchX,
  ChevronLeft,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

interface BillingTabProps {
  room: {
    roomNumber: string;
  };
}

const ITEMS_PER_PAGE = 4;

export function BillingTab({ room }: BillingTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "paid" | "partial" | "overdue"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập luồng API Gateway Fetching sổ phụ tài chính phòng trong 0.8s
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, statusFilter]);

  // Mockup dữ liệu Sổ gốc công nợ hóa đơn toàn kỳ của riêng phòng A.101
  const billingHistory = [
    {
      invoiceId: "INV-2026-05",
      period: "Tháng 05/2026",
      dueDate: "20/05/2026",
      breakdown: {
        rent: 4500000,
        electric: 420000,
        water: 300000,
        service: 150000,
      },
      total: 5370000,
      paidAmount: 4020000,
      debt: 1350000,
      status: "partial",
      method: "Chuyển khoản (Vietcombank)",
      payDate: "18/05/2026",
      txId: "FT26139982",
    },
    {
      invoiceId: "INV-2026-04",
      period: "Tháng 04/2026",
      dueDate: "20/04/2026",
      breakdown: {
        rent: 4500000,
        electric: 420000,
        water: 255000,
        service: 150000,
      },
      total: 5325000,
      paidAmount: 5325000,
      debt: 0,
      status: "paid",
      method: "Quét mã VietQR (MB)",
      payDate: "19/04/2026",
      txId: "QR88291042",
    },
    {
      invoiceId: "INV-2026-03",
      period: "Tháng 03/2026",
      dueDate: "20/03/2026",
      breakdown: {
        rent: 4500000,
        electric: 385000,
        water: 240000,
        service: 150000,
      },
      total: 5275000,
      paidAmount: 5275000,
      debt: 0,
      status: "paid",
      method: "Chuyển khoản (Techcombank)",
      payDate: "15/03/2026",
      txId: "FT26074192",
    },
    {
      invoiceId: "INV-2026-02",
      period: "Tháng 02/2026",
      dueDate: "20/02/2026",
      breakdown: {
        rent: 4500000,
        electric: 332500,
        water: 210000,
        service: 150000,
      },
      total: 5192500,
      paidAmount: 5192500,
      debt: 0,
      status: "paid",
      method: "Ví điện tử Momo",
      payDate: "12/02/2026",
      txId: "MM10928812",
    },
    {
      invoiceId: "INV-2026-01",
      period: "Tháng 01/2026",
      dueDate: "20/01/2026",
      breakdown: {
        rent: 4500000,
        electric: 367500,
        water: 270000,
        service: 150000,
      },
      total: 5287500,
      paidAmount: 0,
      debt: 5287500,
      status: "overdue",
      method: "Chưa thanh toán",
      payDate: "—",
      txId: "—",
    },
  ];

  // 1. Thuật toán xử lý bộ lọc tập trung (Tìm kiếm kì hạn + Bộ lọc trạng thái dòng tiền)
  const filteredBills = useMemo(() => {
    return billingHistory.filter((bill) => {
      const matchesSearch =
        bill.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || bill.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  // 2. Thuật toán phân trang mượt mà
  const totalPages = Math.ceil(filteredBills.length / ITEMS_PER_PAGE) || 1;
  const paginatedBills = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBills.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBills, currentPage]);

  // Tính tổng nợ đọng tích lũy của riêng phòng này để hiển thị nhanh
  const totalDebt = useMemo(() => {
    return billingHistory.reduce((acc, curr) => acc + curr.debt, 0);
  }, []);

  return (
    <div className="p-5 space-y-4 font-sans bg-white antialiased animate-in fade-in duration-300">
      {/* SECTION 1: TOP BAR TÁC VỤ & THỐNG KÊ CÔNG NỢ PHÒNG */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3 select-none">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Receipt size={14} className="text-slate-400" /> Sổ gốc đối soát hóa
            đơn tài chính phòng
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">
            Lưu vết luồng tiền thực thu, công nợ treo tích lũy lũy kế của căn hộ
            #{room.roomNumber}.
          </p>
        </div>

        {/* Khay hiển thị dư nợ đọng dẹt phẳng */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">
              Dư nợ đọng tích lũy
            </span>
            <span
              className={`text-xs font-mono font-bold ${totalDebt > 0 ? "text-rose-600" : "text-slate-400"}`}
            >
              {totalDebt > 0
                ? `${totalDebt.toLocaleString("vi-VN")} đ`
                : "Tất toán sạch cước"}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[10px] font-semibold border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md"
          >
            <FileSpreadsheet size={12} className="mr-1 text-slate-400" /> Xuất
            sao kê phòng
          </Button>
        </div>
      </div>

      {/* SECTION 2: TOOLBAR TÌM KIẾM & BỘ LỌC KHÍT MẢNH H-7.5 */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center select-none bg-slate-50/60 p-2.5 rounded-xl border border-slate-200/60">
        <div className="relative w-full sm:w-60 group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm mã INV, kỳ chu kỳ tháng..."
            className="pl-7.5 h-7.5 text-[11px] bg-white border-slate-200 focus-visible:border-slate-400 focus-visible:ring-0 rounded-md placeholder:font-normal"
          />
        </div>

        <div className="flex bg-slate-200/50 p-0.5 rounded-md w-full sm:w-auto h-7.5 items-center border border-slate-200/40">
          {[
            { key: "all", label: "Tất cả kỳ" },
            { key: "paid", label: "Đã tất toán" },
            { key: "partial", label: "Thu một phần" },
            { key: "overdue", label: "Quá hạn" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setStatusFilter(t.key as any);
                setCurrentPage(1);
              }}
              className={`h-6.5 px-3 rounded-sm text-[10px] font-bold transition-all cursor-pointer ${
                statusFilter === t.key
                  ? "bg-white shadow-3xs text-slate-900"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 3: BẢNG KÊ CHỨNG TỪ NÉN CHẶT MẬT ĐỘ THÔNG TIN */}
      <div className="rounded-xl border border-slate-200/60 overflow-hidden bg-white flex flex-col min-h-62.5">
        <Table>
          <TableHeader className="bg-slate-50/30 border-b border-slate-100 select-none">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-4 py-2.5 w-[14%]">
                Kỳ chu kỳ
              </TableHead>
              <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2.5 w-[30%]">
                Cấu phần chi phí bóc tách
              </TableHead>
              <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2.5 text-right w-[14%]">
                Tổng tiền nhà
              </TableHead>
              <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2.5 text-right w-[14%]">
                Đã thực thu
              </TableHead>
              <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2.5 text-right w-[14%]">
                Dư nợ treo
              </TableHead>
              <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2.5 text-center w-[14%]">
                Trạng thái
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-50 text-xs">
            {/* TRẠNG THÁI LOADING SKELETON */}
            {isLoading ? (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent border-none">
                  <TableCell className="pl-4 py-4">
                    <div className="h-3.5 bg-slate-100 rounded-sm w-16 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1.5">
                      <div className="h-3 bg-slate-100 rounded-sm w-48 animate-pulse" />
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
            ) : filteredBills.length === 0 ? (
              /* TRẠNG THÁI DATA RỖNG */
              <TableRow className="hover:bg-transparent border-none">
                <TableCell colSpan={6} className="h-47.5 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 space-y-1.5 max-w-xs mx-auto select-none">
                    <SearchX size={16} className="text-slate-300" />
                    <h4 className="text-[11px] font-bold text-slate-700">
                      Không có dữ liệu đối soát tài chính
                    </h4>
                    <p className="text-[10px] text-slate-400 text-center leading-normal">
                      Không tìm thấy kỳ hóa đơn nào trùng khớp với trạng thái
                      lọc của căn hộ.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              /* ĐỔ DATA THỰC TẾ */
              paginatedBills.map((bill, idx) => (
                <TableRow
                  key={idx}
                  className="hover:bg-slate-50/20 border-none group"
                >
                  <TableCell className="font-bold text-slate-800 pl-4 py-3">
                    <div className="space-y-0.5">
                      <span>{bill.period}</span>
                      <span className="text-[9px] font-mono font-medium text-slate-400 block tracking-tight">
                        {bill.invoiceId}
                      </span>
                    </div>
                  </TableCell>

                  {/* Khay inline bóc tách dẹt cấu phần */}
                  <TableCell className="py-3">
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-medium text-slate-400 font-sans">
                      <span>
                        Gốc:{" "}
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
                        DV:{" "}
                        <strong className="text-slate-600 font-mono">
                          {bill.breakdown.service / 1000}k
                        </strong>
                      </span>
                    </div>
                    {/* Luồng giao dịch số hóa kèm mã ngân hàng bên dưới */}
                    <div className="text-[9px] text-slate-400 mt-1 font-sans flex items-center gap-1 font-medium select-none">
                      <CreditCard size={10} className="text-slate-300" />
                      <span>
                        {bill.method}{" "}
                        {bill.txId !== "—" && (
                          <span className="font-mono text-slate-500">
                            • TxID: {bill.txId}
                          </span>
                        )}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right font-mono font-bold text-slate-900 py-3">
                    {bill.total.toLocaleString("vi-VN")}đ
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-emerald-600 py-3">
                    {bill.paidAmount.toLocaleString("vi-VN")}đ
                  </TableCell>
                  <TableCell
                    className={`text-right font-mono font-bold py-3 ${bill.debt > 0 ? "text-rose-600" : "text-slate-300"}`}
                  >
                    {bill.debt > 0
                      ? `${bill.debt.toLocaleString("vi-VN")}đ`
                      : "—"}
                  </TableCell>

                  <TableCell className="text-center py-3">
                    <Badge
                      variant="outline"
                      className={`border-none text-[9px] font-bold px-1.5 py-0.5 rounded select-none cursor-default ${
                        bill.status === "paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : bill.status === "partial"
                            ? "bg-amber-50 text-amber-700 animate-pulse"
                            : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {bill.status === "paid"
                        ? "Đã tất toán"
                        : bill.status === "partial"
                          ? "Thu một phần"
                          : "Quá hạn treo"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* CHÂN KHAY ĐIỀU HƯỚNG PHÂN TRANG DẸT */}
        {!isLoading && filteredBills.length > 0 && totalPages > 1 && (
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between select-none mt-auto">
            <span className="text-[10px] font-medium text-slate-400 font-mono">
              Trang {currentPage} / {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 rounded border-slate-200 text-slate-600 bg-white"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 rounded border-slate-200 text-slate-600 bg-white"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
