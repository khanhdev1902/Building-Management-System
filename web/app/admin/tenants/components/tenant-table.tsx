/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { TenantTableRow } from "./tenant-table-row";

interface TenantTableProps {
  data: any[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalRecords: number;
}

export function TenantTable({
  data,
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
}: TenantTableProps) {
  return (
    <div className="rounded-xl border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.01),0_12px_24px_-4px_rgba(15,23,42,0.03)] bg-white overflow-hidden flex flex-col min-h-100">
      <div className="overflow-x-auto flex-1">
        <Table>
          <TableHeader className="bg-slate-50/40 border-b border-slate-100/80 select-none">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[30%] pl-5 py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Cư dân & Mã số định danh
              </TableHead>
              <TableHead className="w-[15%] py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Vị trí căn hộ
              </TableHead>
              <TableHead className="w-[25%] py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Thông tin liên hệ
              </TableHead>
              <TableHead className="w-[18%] py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Chu kỳ thời hạn trú ngụ
              </TableHead>
              <TableHead className="w-[12%] text-center py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Trạng thái
              </TableHead>
              <TableHead className="w-[12%] text-center py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100/60">
            {data.length > 0 ? (
              data.map((tenant) => (
                <TenantTableRow key={tenant.id} tenant={tenant} />
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="h-87.5 text-center">
                  <div className="flex flex-col items-center justify-center max-w-xs mx-auto text-slate-400 space-y-2">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-full text-slate-400 mb-1">
                      <SearchX size={18} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xs font-semibold text-slate-800">
                      Không tìm thấy nhân khẩu
                    </h3>
                    <p className="text-[11px] text-slate-400 text-center leading-normal">
                      Không có cư dân nào trùng khớp với từ khóa hoặc cấu hình
                      lọc chuyên sâu của bạn.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 5. Khối điều hướng phân trang cố định đồng bộ chân Table */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between shrink-0 select-none">
          <p className="text-xs font-medium text-slate-400">
            Hiển thị{" "}
            <span className="text-slate-800 font-semibold font-mono">
              {data.length}
            </span>{" "}
            trên {totalRecords} hồ sơ nhân khẩu
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

// --- SUB-COMPONENTS BADGE TRẠNG THÁI TRÚ NGỤ ---
export function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; class: string; dot: string }> =
    {
      active: {
        label: "Đang cư trú",
        class: "bg-emerald-50 text-emerald-700 border-emerald-100/70",
        dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]",
      },
      expiring: {
        label: "Sắp hết hợp đồng",
        class: "bg-amber-50 text-amber-700 border-amber-100/70",
        dot: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]",
      },
      inactive: {
        label: "Đã dời đi",
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
