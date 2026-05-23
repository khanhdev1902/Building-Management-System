/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  MoreVertical,
  AlertCircle,
  PencilLine,
  Maximize2,
  Wind,
  Wifi,
  ShieldCheck,
  FilePlus2,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { StatusBadge } from "./status-badge";
import { RoomDialog } from "./room-dialog";
import { RoomResponse } from "../types/room.type";

export function RoomCard({
  room,
  onUpdate,
}: {
  room: RoomResponse;
  onUpdate: (data: any) => void;
}) {
  const isAvailable = room.status === "AVAILABLE" || !room.tenant;

  // Tránh lỗi Hydration cho Date hiển thị trên Next.js
  const [formattedDate, setFormattedDate] = useState<string>("");
  useEffect(() => {
    if (room.tenant?.endDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormattedDate(
        new Date(room.tenant.endDate).toLocaleDateString("vi-VN"),
      );
    }
  }, [room.tenant?.endDate]);

  return (
    <Card className="group relative border border-slate-200/80 bg-white rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-full shadow-[0_1px_2px_rgba(15,23,42,0.01)] hover:shadow-[0_16px_32px_-8px_rgba(15,23,42,0.05)] hover:border-slate-300">
      <CardContent className="p-4 flex flex-col h-full justify-between relative z-10 space-y-4">
        {/* 1. KHU VỰC TIÊU ĐỀ */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors duration-200">
              Phòng {room.roomNumber}
            </h3>
            <div className="flex gap-1 select-none">
              <span className="text-[10px] font-bold text-slate-400 font-mono">
                Tầng {room.floor}
              </span>
              <span className="text-[10px] text-slate-300 font-mono">•</span>
              <span className="text-[10px] font-bold text-slate-400 font-mono">
                {room.acreage} m²
              </span>
            </div>
          </div>
          <div className="shrink-0">
            <StatusBadge status={room.status} />
          </div>
        </div>

        {/* 2. KHU VỰC THÔNG SỐ */}
        <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 space-y-2.5">
          <div className="flex items-center justify-between select-none">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Giá thuê nhà
            </span>
            <span className="font-black text-slate-900 text-sm font-mono tracking-tight">
              {Number(room.roomPrice ?? 0).toLocaleString("vi-VN")}
              <span className="text-[11px] font-sans font-normal text-slate-400 ml-1">
                đ
              </span>
            </span>
          </div>

          <div className="h-px bg-slate-200/50 w-full" />

          {/* Đã sửa đổi ngữ nghĩa Label linh hoạt theo trạng thái */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 select-none">
              {isAvailable ? "Trạng thái" : "Cư dân lưu trú"}
            </span>
            {isAvailable ? (
              <span className="text-xs font-semibold text-slate-400 italic tracking-tight select-none">
                Phòng trống sẵn sàng
              </span>
            ) : (
              <div className="flex items-center gap-1.5 max-w-35">
                <User size={12} className="text-indigo-500 shrink-0" />
                <span className="text-xs font-bold text-slate-800 truncate tracking-tight">
                  {room.tenant?.name || "Chưa cập nhật"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 3. KHU VỰC HẠN HỢP ĐỒNG / TIỆN ÍCH */}
        <div className="min-h-7 flex items-center justify-between w-full">
          {!isAvailable && formattedDate ? (
            <div className="flex items-center justify-between w-full px-2.5 py-1 bg-amber-50/50 border border-amber-100/60 rounded-lg text-[10px] font-medium text-slate-600">
              <span className="text-amber-700 font-bold uppercase tracking-wide">
                Hạn hợp đồng
              </span>
              <span className="font-mono font-bold text-amber-800">
                {formattedDate}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3 select-none opacity-60 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-1 text-slate-400 font-mono text-[9px] font-bold">
                <Wind size={12} /> AC
              </div>
              <div className="flex items-center gap-1 text-slate-400 font-mono text-[9px] font-bold">
                <Wifi size={12} /> WIFI
              </div>
              <div className="flex items-center gap-1 text-slate-400 font-mono text-[9px] font-bold">
                <ShieldCheck size={12} /> 24/7
              </div>
            </div>
          )}
        </div>

        {/* 4. KHU VỰC ĐIỀU HƯỚNG TÁC VỤ */}
        <div className="flex items-center gap-2 pt-0.5">
          {isAvailable ? (
            <Link href="/admin/contracts/new" className="flex-1">
              <Button className="w-full bg-emerald-700 hover:bg-emerald-900 text-white rounded-lg h-9 font-bold text-xs tracking-wide transition-colors shadow-2xs gap-1 cursor-pointer border-none">
                <FilePlus2 size={13} className="stroke-[2.5]" />
                <span>Lập hợp đồng</span>
              </Button>
            </Link>
          ) : (
            <Link href={`/admin/rooms/${room.id}`} className="flex-1">
              <Button className="w-full bg-slate-950 hover:bg-slate-900 text-white rounded-lg h-9 font-bold text-xs tracking-wide transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1">
                <span>Chi tiết phòng</span>
                <ArrowUpRight size={13} className="text-slate-400 stroke-2" />
              </Button>
            </Link>
          )}

          {/* DROPDOWN MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-lg h-9 w-9 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs cursor-pointer"
              >
                <MoreVertical className="h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-xl border border-slate-200/80 w-48 p-1 shadow-md bg-white select-none"
            >
              {isAvailable && (
                <DropdownMenuItem
                  asChild
                  className="gap-2 cursor-pointer rounded-lg py-2 focus:bg-slate-50 font-semibold text-slate-600 text-xs transition-colors"
                >
                  <Link href={`/admin/rooms/${room.id}`}>
                    <Maximize2 className="w-3.5 h-3.5 text-slate-400" /> Xem chi
                    tiết phòng
                  </Link>
                </DropdownMenuItem>
              )}

              <RoomDialog
                mode="update"
                initialData={room}
                onSubmit={onUpdate}
                trigger={
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer rounded-lg py-2 focus:bg-slate-50 font-semibold text-slate-600 text-xs transition-colors"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <PencilLine className="w-3.5 h-3.5 text-slate-400" /> Sửa
                    thông số vật lý
                  </DropdownMenuItem>
                }
              />

              <DropdownMenuSeparator className="my-1 border-slate-100" />
              <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg py-2 focus:bg-rose-50 focus:text-rose-600 font-semibold text-rose-500 text-xs transition-colors">
                <AlertCircle className="w-3.5 h-3.5" /> Ghi nhận sự cố hỏng
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
