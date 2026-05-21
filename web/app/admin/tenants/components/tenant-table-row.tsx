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
  Phone,
  Mail,
  MessageCircle,
  MoreHorizontal,
  ExternalLink,
  History,
  UserCheck,
  UserMinus,
  ShieldCheck,
} from "lucide-react";

// Import badge trạng thái nội khu từ file table bọc ngoài
import { StatusBadge } from "./tenant-table";
import Link from "next/link";
import { Tenant } from "../types/tenant.type";

interface TenantItemProps {
  tenant: Tenant;
}

export function TenantTableRow({ tenant }: TenantItemProps) {
  return (
    <TableRow className="group hover:bg-slate-50/40 transition-colors">
      {/* Cột 1: Thẻ hồ sơ profile cá nhân & Định danh hình ảnh */}
      <TableCell className="pl-5 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8.5 w-8.5 border border-slate-100 shadow-2xs rounded-full">
            <AvatarImage src={tenant.avataUrl ?? ""} />
            <AvatarFallback className="bg-slate-100 text-slate-700 text-[10px] font-bold">
              {tenant.fullName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-800 text-xs tracking-tight truncate">
                {tenant.fullName}
              </span>
              {tenant.identityVerified ? (
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              ) : (
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 shadow-[0_0_4px_rgba(244,63,94,0.4)]"
                  title="Chưa đối chiếu CCCD gốc"
                />
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 tracking-wide">
              {`ID:${tenant.id.substring(0, 12).toUpperCase()}`}
            </span>
          </div>
        </div>
      </TableCell>

      {/* Cột 2: Mã phòng bọc font số hóa tăm tắp */}
      <TableCell className="py-3">
        <div className="flex flex-col">
          <span className="font-bold text-slate-700 text-xs font-mono">
            {tenant.roomNumber ?? "Chưa gán phòng"}
          </span>
          <span className="text-[10px] text-slate-400 tracking-tight mt-0.5">
            Danjin Building
          </span>
        </div>
      </TableCell>

      {/* Cột 3: Luồng liên hệ đa kênh */}
      <TableCell className="py-3">
        <div className="flex flex-col space-y-0.5 text-xs text-slate-600 font-medium">
          <div className="flex items-center text-slate-700 font-mono">
            <Phone className="mr-1.5 h-3 w-3 text-slate-400 stroke-[1.5]" />
            {tenant.phone}
          </div>
          <div className="flex items-center text-[11px] text-slate-400 font-sans">
            <Mail className="mr-1.5 h-3 w-3 text-slate-400 stroke-[1.5]" />
            {tenant.email ?? "Chưa cung cấp email"}
          </div>
        </div>
      </TableCell>

      {/* Cột 4: Chu kỳ mốc thời gian tạm trú */}
      <TableCell className="py-3">
        {tenant.contractStartDate ? (
          <div className="flex flex-col text-[11px] font-medium text-slate-500 font-mono">
            <span>Bắt đầu: {tenant.contractStartDate}</span>
            <span className="text-slate-400 mt-0.5">
              {" "}
              Hạn cuối: {tenant.contractEndDate ?? "Chưa xác định"}
            </span>
          </div>
        ) : (
          <div className="flex flex-col text-xs font-medium text-slate-500">
            <span className="text-rose-500">Chưa có hợp đồng</span>
          </div>
        )}
      </TableCell>

      {/* Cột 5: Badge trạng thái cư trú dẹt */}
      <TableCell className="text-center py-3">
        <StatusBadge status={tenant.status} />
      </TableCell>

      {/* Cột 6: Dropdown tác vụ mượt mà hiện hình khi hover */}
      <TableCell className="text-right pr-5 py-3">
        <div className="flex justify-end items-center gap-1.5 h-8">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100/60 transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5 stroke-[1.75]" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              >
                <MoreHorizontal className="h-3.5 w-3.5 stroke-[1.75]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 p-1 rounded-lg shadow-md border border-slate-200/70 bg-white"
            >
              <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1.5 select-none">
                Hồ sơ nhân khẩu
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 border-slate-100" />
              <Link href={`/admin/tenants/${tenant.id}`}>
                <DropdownMenuItem className="gap-2 rounded py-2 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />{" "}
                  Xem chi tiết lý lịch
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="gap-2 rounded py-2 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer">
                <History className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />{" "}
                Sổ gốc thanh toán
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 rounded py-2 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer">
                <UserCheck className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />{" "}
                Phê duyệt xác minh
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 border-slate-100" />
              <DropdownMenuItem className="text-rose-600 hover:bg-rose-50/50 font-medium gap-2 rounded py-2 text-xs cursor-pointer">
                <UserMinus className="w-3.5 h-3.5 stroke-[1.5]" /> Trục xuất /
                Rời đi
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
