"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { ContractTableRow } from "./contract-table-row";

interface ContractTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalRecords: number;
}

export function ContractTable({
  data,
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
}: ContractTableProps) {
  return (
    <div className="border border-slate-200/80 bg-white rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.01),0_12px_24px_-4px_rgba(15,23,42,0.03)] flex flex-col min-h-105">
      <div className="overflow-x-auto flex-1">
        <Table className="w-full min-w-225">
          <TableHeader className="bg-slate-50/40 border-b border-slate-100/80 select-none">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[12%] pl-5 py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Mã hợp đồng
              </TableHead>
              <TableHead className="w-[12%] py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Vị trí căn hộ
              </TableHead>
              <TableHead className="w-[28%] py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Cư dân ký kết / Bảo lưu cọc
              </TableHead>
              <TableHead className="w-[22%] py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Thời hạn chu kỳ thuê phòng
              </TableHead>
              <TableHead className="w-[13%] text-right py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Đơn giá thuê
              </TableHead>
              <TableHead className="w-[13%] text-center py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Tình trạng HĐ
              </TableHead>
              <TableHead className="w-[13%] text-center py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Thao tác
              </TableHead>
              {/* <TableHead className="w-[5%] text-right pr-5 py-3">Thao tác</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100/60">
            {data.length > 0 ? (
              data.map((item) => <ContractTableRow key={item.id} item={item} />)
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="h-87.5 text-center">
                  <div className="flex flex-col items-center justify-center max-w-xs mx-auto text-slate-400 space-y-2">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-full text-slate-400 mb-1">
                      <SearchX size={18} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xs font-semibold text-slate-800">
                      Không tìm thấy hợp đồng
                    </h3>
                    <p className="text-[11px] text-slate-400 text-center leading-normal">
                      Không có hồ sơ chứng từ nào trùng khớp với bộ lọc hiện
                      tại.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 5. Khối điều hướng phân trang tích hợp dưới đáy khay */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between shrink-0 select-none">
          <p className="text-xs font-medium text-slate-400">
            Hiển thị{" "}
            <span className="text-slate-800 font-semibold font-mono">
              {data.length}
            </span>{" "}
            trên {totalRecords} hồ sơ hợp đồng
          </p>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">
              Trang{" "}
              <span className="text-slate-900 font-semibold font-mono">
                {currentPage}
              </span>{" "}
              / {totalPages}
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-md border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all disabled:opacity-40"
                disabled={currentPage === 1}
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              >
                <ChevronLeft className="w-3.5 h-3.5 stroke-[1.8]" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-md border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all disabled:opacity-40"
                disabled={currentPage === totalPages}
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
              >
                <ChevronRight className="w-3.5 h-3.5 stroke-[1.8]" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- HỆ THỐNG BADGES ĐỘC LẬP TÁI SỬ DỤNG NỘI BỘ ---

export function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; class: string; dot: string }> =
    {
      active: {
        label: "Đang hiệu lực",
        class: "bg-emerald-50 text-emerald-700 border-emerald-100/70",
        dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]",
      },
      expiring: {
        label: "Sắp hết hạn",
        class: "bg-amber-50 text-amber-700 border-amber-100/70",
        dot: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]",
      },
      expired: {
        label: "Đã kết thúc",
        class: "bg-slate-50 text-slate-500 border-slate-200/60",
        dot: "bg-slate-400",
      },
    };

  const config = configs[status] || configs.active;

  return (
    <Badge
      variant="outline"
      className={`${config.class} border px-2 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1.5 w-fit mx-auto cursor-default`}
    >
      <span className={`h-1.2 w-1.2 rounded-full ${config.dot}`} />
      {config.label}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; text: string; dot: string }> =
    {
      paid: {
        label: "Đã giữ cọc",
        text: "text-emerald-600",
        dot: "bg-emerald-500",
      },
      partial: {
        label: "Cọc thiếu",
        text: "text-amber-600",
        dot: "bg-amber-500",
      },
      unpaid: {
        label: "Chưa nộp cọc",
        text: "text-rose-600",
        dot: "bg-rose-500",
      },
    };

  const current = configs[status] || configs.paid;

  return (
    <div className="flex items-center gap-1 text-[10px] font-medium select-none">
      <span className={`h-1 w-1 rounded-full ${current.dot}`} />
      <span className={current.text}>{current.label}</span>
    </div>
  );
}
