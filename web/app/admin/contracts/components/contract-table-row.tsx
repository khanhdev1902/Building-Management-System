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
  FileText,
  ArrowUpRight,
  AlertTriangle,
  MoreVertical,
} from "lucide-react";
import { StatusBadge, PaymentStatusBadge } from "./contract-table";
import Link from "next/link";
import { TerminateContractDialog } from "./terminate-contract-dialog";

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
    deposit?: number;
    status: string;
    paymentStatus: string;
  };
  onRefreshData?: () => void;
}

export function ContractTableRow({
  item,
  onRefreshData = () => {},
}: ContractItemProps) {
  // Hàm đón dữ liệu SẠCH từ Zod Form và băm API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTerminateSubmit = async (formData: any) => {
    try {
      // Ví dụ gọi API thật:
      // await contractApi.terminateEarly(formData);
      console.log(
        "Payload gửi lên API NestJS chuẩn chỉ Zod:",
        formData,
        item.id,
      );

      // Load lại grid danh sách ở màn hình lớn
      onRefreshData();
    } catch (error) {
      console.error("Lỗi khi gọi API thanh lý hợp đồng:", error);
    }
  };

  // Tính toán tiến độ chu kỳ
  const calculateTimeProgress = (start: string, end: string) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const currentDate = new Date().getTime();

    if (endDate <= startDate) return 0;
    const totalDuration = endDate - startDate;
    const elapsed = currentDate - startDate;

    return Math.min(
      Math.max(Math.round((elapsed / totalDuration) * 100), 0),
      100,
    );
  };

  const timeProgress = calculateTimeProgress(item.startDate, item.endDate);

  // const currentTime = new Date().getTime();
  // const isExpiring =
  //   new Date(item.endDate).getTime() - currentTime <= 1000 * 60 * 60 * 24 * 30;
  return (
    <TableRow className="group hover:bg-slate-50/40 transition-colors">
      <TableCell className="uppercase text-xs font-semibold text-slate-400 py-3.5 pl-5">
        {item.id.length > 12 ? `${item.id.slice(0, 12)}...` : item.id}
      </TableCell>

      <TableCell className="py-3.5">
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-xs font-mono">
            Phòng {item.room}
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase mt-0.5">
            {item.tower}
          </span>
        </div>
      </TableCell>

      <TableCell className="py-3.5">
        <div className="flex items-center gap-2.5">
          <Avatar className="w-7.5 h-7.5 border border-slate-100 shadow-2xs rounded-full">
            <AvatarImage src={item.avatar || undefined} />
            <AvatarFallback className="text-[9px] font-bold bg-slate-50 text-slate-600">
              {item.tenant ? item.tenant.substring(0, 2).toUpperCase() : "KH"}
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

      <TableCell className="py-3.5">
        <div className="flex flex-col gap-1.5 max-w-37.5">
          <div className="flex items-center justify-between text-[11px] font-medium font-mono text-slate-600">
            <span>{new Date(item.startDate).toLocaleDateString("vi-VN")}</span>
            <span className="text-slate-400 font-sans px-1">→</span>
            <span>{new Date(item.endDate).toLocaleDateString("vi-VN")}</span>
          </div>

          <div className="w-full h-0.5 bg-slate-100 rounded-full overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                item.status === "EXPIRED"
                  ? "bg-slate-300"
                  : item.status === "EXPIRING"
                    ? "bg-amber-500"
                    : "bg-slate-900"
              }`}
              style={{
                width: `${item.status === "EXPIRED" ? 100 : timeProgress}%`,
              }}
            />
          </div>
        </div>
      </TableCell>

      <TableCell className="text-right py-3.5">
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 font-mono text-xs">
            {Number(item.rent).toLocaleString("vi-VN")} đ
          </span>
          <span className="text-[9px] font-medium text-slate-400 uppercase tracking-normal mt-0.5">
            mỗi tháng
          </span>
        </div>
      </TableCell>

      <TableCell className="text-center py-3.5">
        <StatusBadge status={item.status} />
      </TableCell>

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
                className="h-7 w-7 p-0 rounded-md group-hover:opacity-100 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <MoreVertical size={14} className="stroke-[1.75]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 p-1 rounded-lg shadow-md border border-slate-200/70 bg-white select-none"
            >
              <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1.5">
                Nghiệp vụ pháp lý
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

             
              <TerminateContractDialog
                contractData={{
                  id: item.id,
                  room: item.room,
                  tenant: item.tenant,
                  deposit: item.deposit ?? item.rent,
                }}
                onSubmit={handleTerminateSubmit}
                trigger={
                  <DropdownMenuItem
                    className="text-rose-600 hover:bg-rose-50/50 focus:bg-rose-50/50 font-medium gap-2 rounded py-2 text-xs cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Thanh lý trước hạn</span>
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
