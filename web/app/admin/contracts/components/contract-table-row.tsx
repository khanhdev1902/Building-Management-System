"use client";

import React from "react";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Eye,
  MoreHorizontal,
  FileText,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";

// Tái sử dụng các badge trạng thái nội bộ
import { StatusBadge, PaymentStatusBadge } from "./contract-table";
import Link from "next/link";

interface ContractItemProps {
  item: {
    id: string;
    room: string;
    tower: string;
    tenant: string;
    avatar: string;
    startDate: string;
    endDate: string;
    rent: number;
    status: string;
    paymentStatus: string;
  };
}

export function ContractTableRow({ item }: ContractItemProps) {
  // Hàm xử lý thuật toán tính dải tiến độ thời gian thực
  const calculateTimeProgress = (start: string, end: string) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const currentDate = new Date("2026-05-18").getTime(); // Khóa trục theo thời gian thực tế hệ thống 2026

    if (endDate <= startDate) return 0;
    const totalDuration = endDate - startDate;
    const elapsed = currentDate - startDate;

    return Math.min(
      Math.max(Math.round((elapsed / totalDuration) * 100), 0),
      100,
    );
  };

  const timeProgress = calculateTimeProgress(item.startDate, item.endDate);

  return (
    <TableRow className="group hover:bg-slate-50/40 transition-colors">
      {/* Cột 1: Mã hợp đồng */}
      <TableCell className="font-mono text-xs font-semibold text-slate-400 py-3.5 pl-5">
        {item.id}
      </TableCell>

      {/* Cột 2: Vị trí căn hộ */}
      <TableCell className="py-3.5">
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-xs font-mono">
            P.{item.room}
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase mt-0.5">
            {item.tower}
          </span>
        </div>
      </TableCell>

      {/* Cột 3: Khách thuê & Trạng thái cọc quỹ */}
      <TableCell className="py-3.5">
        <div className="flex items-center gap-2.5">
          <Avatar className="w-7.5 h-7.5 border border-slate-100 shadow-2xs rounded-md">
            <AvatarImage src={item.avatar} />
            <AvatarFallback className="text-[9px] font-bold bg-slate-50 text-slate-600">
              {item.tenant.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-slate-800 text-xs tracking-tight truncate mb-0.5">
              {item.tenant}
            </span>
            <PaymentStatusBadge status={item.paymentStatus} />
          </div>
        </div>
      </TableCell>

      {/* Cột 4: Thời hạn chu kỳ & Thanh tiến độ thời gian thực */}
      <TableCell className="py-3.5">
        <div className="flex flex-col gap-1.5 max-w-37.5">
          <div className="flex items-center justify-between text-[11px] font-medium font-mono text-slate-600">
            <span>{item.startDate.split("-").reverse().join("/")}</span>
            <span className="text-slate-400 font-sans px-1">→</span>
            <span>{item.endDate.split("-").reverse().join("/")}</span>
          </div>

          <div className="w-full h-0.5 bg-slate-100 rounded-full overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                item.status === "expired"
                  ? "bg-slate-300"
                  : item.status === "expiring"
                    ? "bg-amber-500"
                    : "bg-slate-900"
              }`}
              style={{
                width: `${item.status === "expired" ? 100 : timeProgress}%`,
              }}
            />
          </div>
        </div>
      </TableCell>

      {/* Cột 5: Đơn giá tiền nhà */}
      <TableCell className="text-right py-3.5">
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 font-mono text-xs">
            {item.rent.toLocaleString("vi-VN")} đ
          </span>
          <span className="text-[9px] font-medium text-slate-400 uppercase tracking-normal mt-0.5">
            mỗi tháng
          </span>
        </div>
      </TableCell>

      {/* Cột 6: Trạng thái pháp lý */}
      <TableCell className="text-center py-3.5">
        <StatusBadge status={item.status} />
      </TableCell>

      {/* Cột 7: Cụm dropdown tác vụ */}
      <TableCell className="text-right pr-5 py-3.5">
        <div className="flex justify-end items-center gap-1 h-7">
          <Link href={`/admin/contracts/${item.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 cursor-pointer px-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md text-xs font-medium"
            >
              <Eye className="w-3.5 h-3.5 mr-1 stroke-[1.75]" /> Xem
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-7 w-7 p-0 rounded-md opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              >
                <MoreHorizontal size={14} className="stroke-[1.75]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 p-1 rounded-lg shadow-md border border-slate-200/70 bg-white"
            >
              <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1.5 select-none">
                N Nghiệp vụ pháp lý
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 border-slate-100" />
              <DropdownMenuItem className="gap-2 rounded py-2 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer">
                <FileText className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />{" "}
                Xuất bản in PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 rounded py-2 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer">
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />{" "}
                Biên bản bàn giao phòng
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 border-slate-100" />
              <DropdownMenuItem className="text-rose-600 hover:bg-rose-50/50 font-medium gap-2 rounded py-2 text-xs cursor-pointer">
                <AlertTriangle className="w-3.5 h-3.5 stroke-[1.5]" /> Thanh lý
                trước thời hạn
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
