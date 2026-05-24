/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import {
  FileSpreadsheet,
  Search,
  Printer,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Building,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { CreateExpenseDialog } from "./components/CreateExpenseDialog";
// 🛠️ IMPORT COMPONENT MỚI VÀO ĐÂY ÔNG NHÉ
import { ExpenseDetailDialog } from "./components/ExpenseDetailDialog";

// Khởi tạo phôi dữ liệu Sổ cái phiếu chi thực tế hệ thống Danjin BMS 2026
const MOCK_EXPENSES = [
  {
    id: "PAY-2026-0410",
    room: "201",
    category: "MAINTENANCE", // Sửa chữa bảo trì
    title: "Thay lốc máy khóa cửa vân tay cổng chính",
    amount: 1850000,
    paymentMethod: "CASH",
    paidTo: "Thợ khóa cổng (Trần Hải)",
    createdAt: "24/05/2026 08:30",
    referenceNo: "VOUCHER-KH-201",
  },
  {
    id: "PAY-2026-0409",
    room: null, // Chi phí chung toàn tòa nhà
    category: "OPERATING", // Chi phí vận hành
    title: "Thanh toán gói cước Internet cáp quang Viettel tổng",
    amount: 880000,
    paymentMethod: "BANK_TRANSFER",
    paidTo: "Viettel Telecom",
    createdAt: "22/05/2026 14:00",
    referenceNo: "FT26142009825",
  },
  {
    id: "PAY-2026-0408",
    room: "102",
    category: "EQUIPMENT", // Mua sắm trang thiết bị
    title: "Mua thay mới vòi sen nóng lạnh và gương nhà tắm",
    amount: 1250000,
    paymentMethod: "BANK_TRANSFER",
    paidTo: "Điện nước Thành Công",
    createdAt: "19/05/2026 10:15",
    referenceNo: "FT26142004210",
  },
];

export default function ExpenseManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "MAINTENANCE" | "OPERATING" | "EQUIPMENT"
  >("all");

  // 🛠️ THÊM 2 STATE NÀY ĐỂ QUẢN LÝ DIALOG XEM CHI TIẾT
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Luồng xử lý bộ lọc dòng tiền đi ra
  const filteredExpenses = useMemo(() => {
    return MOCK_EXPENSES.filter((exp) => {
      const matchesSearch =
        (exp.room && exp.room.includes(searchTerm)) ||
        exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.paidTo.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (categoryFilter !== "all" && exp.category !== categoryFilter)
        return false;
      return true;
    });
  }, [searchTerm, categoryFilter]);

  // Hàm helper kích hoạt mở xem nhanh phiếu chi
  const handleViewDetail = (expense: any) => {
    setSelectedExpense(expense);
    setIsDetailOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-5 bg-slate-50/20 min-h-screen antialiased font-sans select-none">
      {/* 1. TOP BAR TIÊU ĐỀ & CHỨNG TỪ TÁC VỤ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-xl font-black tracking-tight text-slate-950 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-rose-600 stroke-[2.2]" />
            Sổ cái Phiếu chi & Khấu hao
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Nhật ký ghi nhận dòng tiền đi ra, chi phí bảo trì cơ sở hạ tầng và
            mua sắm thiết bị tòa nhà.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <CreateExpenseDialog />
        </div>
      </div>

      {/* 2. TOOLBAR TÌM KIẾM & TABS PHÂN LOẠI CHI PHÍ DẸT KHÍT */}
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-center pt-1">
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[1.8]" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo nội dung, tên thợ, số phòng, mã phiếu..."
            className="w-full pl-9 pr-4 h-9.5 bg-white border border-slate-200/80 focus-visible:border-slate-400 focus-visible:ring-0 rounded-lg text-xs font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
          />
        </div>

        {/* Cụm chuyển trạng thái phân loại chi phí chuẩn SaaS */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/40 w-fit h-9.5 items-center">
          {[
            { key: "all", label: "Tất cả khoản chi" },
            { key: "MAINTENANCE", label: "Bảo trì / Sửa chữa" },
            { key: "OPERATING", label: "Vận hành hệ thống" },
            { key: "EQUIPMENT", label: "Mua sắm thiết bị" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setCategoryFilter(tab.key as any)}
              className={`h-7.5 px-3.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === tab.key
                  ? "bg-white shadow-3xs text-slate-900"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. BẢNG SỔ CÁI CHI TIẾT PHIẾU CHI LÌ LỢM */}
      <div className="rounded-xl border border-slate-200/80 shadow-3xs bg-white overflow-hidden flex flex-col min-h-96">
        <Table>
          <TableHeader className="bg-slate-50/40 border-b border-slate-100/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 tracking-wider py-3 pl-5 w-[14%]">
                Mã phiếu chi
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 tracking-wider py-3 w-[15%]">
                Hạng mục chi
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 tracking-wider py-3 w-[12%]">
                Vị trí áp phí
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 tracking-wider py-3 w-[27%]">
                Nội dung diễn giải / Đối tác nhận
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 tracking-wider py-3 w-[15%]">
                Thời gian chi
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right py-3 w-[13%] pr-6">
                Số tiền chi
              </TableHead>
              <TableHead className="w-10 py-3 pr-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100/60 text-xs font-medium text-slate-600">
            {filteredExpenses.length === 0 ? (
              <TableRow className="hover:bg-transparent border-none">
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-slate-400 italic"
                >
                  Chưa ghi nhận dữ liệu xuất quỹ tiền mặt hay tài khoản nào
                  trong chu kỳ này.
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map((exp) => (
                <TableRow
                  key={exp.id}
                  className="group hover:bg-slate-50/30 border-none transition-colors"
                >
                  <TableCell className="font-mono font-bold text-slate-900 pl-5 py-3">
                    {exp.id}
                  </TableCell>
                  <TableCell className="py-3">
                    <CategoryBadge category={exp.category} />
                  </TableCell>
                  <TableCell className="py-3">
                    {exp.room ? (
                      <span className="font-bold text-slate-800 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200/50">
                        P.{exp.room}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic flex items-center gap-1">
                        <Building size={11} /> Toàn tòa nhà
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-slate-900 font-bold block truncate max-w-65">
                      {exp.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-sans mt-0.5">
                      Chi cho:{" "}
                      <strong className="text-slate-600 font-semibold">
                        {exp.paidTo}
                      </strong>{" "}
                      • Ref: {exp.referenceNo}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 font-mono text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={11} className="text-slate-400" />
                      <span>{exp.createdAt}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono font-black text-rose-600 text-right text-sm pr-6 py-3">
                    -{exp.amount.toLocaleString("vi-VN")}
                    <span className="text-[10px] font-sans font-normal text-slate-400 ml-0.5">
                      đ
                    </span>
                  </TableCell>

                  {/* NÚT HÀNH ĐỘNG ĐÃ ĐƯỢC ĐẤU NỐI ĐỂ MỞ DIALOG CHI TIẾT */}
                  <TableCell className="text-right pr-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md"
                        >
                          <EllipsisHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-44 p-1 rounded-xl border border-slate-200/80 bg-white shadow-sm select-none"
                      >
                        {/* 🛠️ THAY ĐỔI Ở ĐÂY: Thêm sự kiện onClick để gọi hàm xem chi tiết */}
                        <DropdownMenuItem
                          onClick={() => handleViewDetail(exp)}
                          className="gap-2 rounded-lg py-2 text-slate-600 text-xs font-semibold focus:bg-slate-50 cursor-pointer"
                        >
                          <Eye size={13} className="text-slate-400" /> Xem chứng
                          từ gốc
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="gap-2 rounded-lg py-2 text-slate-600 text-xs font-semibold focus:bg-slate-50 cursor-pointer"
                          onClick={() => window.print()}
                        >
                          <Printer size={13} className="text-slate-400" /> In
                          phiếu chi
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* 4. PHÂN TRANG GẮN ĐÁY SỔ CÁI */}
        <div className="px-4 py-2.5 border-t border-slate-100 bg-white flex items-center justify-between mt-auto shrink-0 select-none text-xs font-medium">
          <p className="text-[11px] text-slate-400">
            Hiển thị{" "}
            <span className="text-slate-800 font-bold font-mono">
              {filteredExpenses.length}
            </span>{" "}
            trên 45 phiếu xuất quỹ tháng này
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">
              Trang{" "}
              <strong className="text-slate-900 font-mono font-bold">1</strong>{" "}
              / 5
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                disabled
                className="h-6.5 w-6.5 rounded-md border-slate-200 text-slate-600 bg-white disabled:opacity-30"
              >
                <ChevronLeft size={13} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-6.5 w-6.5 rounded-md border-slate-200 text-slate-600 bg-white cursor-pointer"
              >
                <ChevronRight size={13} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ExpenseDetailDialog
        expense={selectedExpense}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedExpense(null);
        }}
      />
    </div>
  );
}

// COMPONENT HELPER 1: CHIP PHÂN LOẠI HẠNG MỤC CHI PHÍ DẸT MỊN
function CategoryBadge({ category }: { category: string }) {
  const map: Record<string, { label: string; class: string }> = {
    MAINTENANCE: {
      label: "Bảo trì & Sửa chữa",
      class: "bg-amber-50 text-amber-700 border-amber-100/70",
    },
    OPERATING: {
      label: "Vận hành hệ thống",
      class: "bg-blue-50 text-blue-700 border-blue-100/70",
    },
    EQUIPMENT: {
      label: "Mua sắm trang bị",
      class: "bg-purple-50 text-purple-700 border-purple-100/70",
    },
  };
  const current = map[category] || {
    label: "Chi phí khác",
    class: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <Badge
      variant="outline"
      className={`${current.class} text-[9px] font-bold rounded px-1.5 py-0.5 shadow-none uppercase tracking-tight`}
    >
      {current.label}
    </Badge>
  );
}

// Bổ sung icon giả lập MoreHorizontal cho dropdown gọn gàng
function EllipsisHorizontal({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}
