/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  User,
  Layers,
  MoreVertical,
  FileText,
  AlertCircle,
  PencilLine,
  Maximize2,
  Banknote,
  Calendar,
  Wind,
  Wifi,
  ShieldCheck,
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
import { Badge } from "@/shared/components/ui/badge";
import { RoomResponse } from "../types/room.type";

export function RoomCard({
  room,
  onUpdate,
}: {
  room: RoomResponse;
  onUpdate: (data: any) => void;
}) {
  return (
    <Card className="group relative border border-slate-200/70 bg-white rounded-xl overflow-hidden transition-all duration-500 flex flex-col h-full shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-[0_16px_36px_rgba(15,23,42,0.06)] hover:border-slate-300/90 hover:-translate-y-1">
      {/* 3D Depth Layer: Tạo vệt sáng mờ đổ bóng nội bộ khi hover */}
      <div className="absolute inset-0 bg-linear-to-tr from-slate-50/0 via-indigo-50/0 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <CardContent className="p-4.5 space-y-4 flex flex-col h-full relative z-10">
        {/* 1. Header Section - Phân tầng sắc nét */}
        <div className="flex items-start justify-between min-h-11">
          <div className="space-y-1.5">
            <h3 className="text-lg font-black text-slate-950 tracking-tight leading-none group-hover:text-indigo-600 transition-colors duration-300">
              Phòng {room.roomNumber}
            </h3>
            <div className="flex gap-1.5">
              <Badge
                variant="outline"
                className="bg-slate-50/60 text-slate-500 border-slate-200/60 text-[9px] px-2 py-0 rounded-md h-5 font-bold uppercase tracking-wider"
              >
                <Layers className="w-2.5 h-2.5 mr-1 text-slate-400" /> Tầng{" "}
                {room.floor}
              </Badge>
              <Badge
                variant="outline"
                className="bg-slate-50/60 text-slate-500 border-slate-200/60 text-[9px] px-2 py-0 rounded-md h-5 font-bold uppercase tracking-wider"
              >
                <Maximize2 className="w-2.5 h-2.5 mr-1 text-slate-400" />{" "}
                {room.acreage} m²
              </Badge>
            </div>
          </div>
          <div className="shrink-0 transition-transform duration-300 group-hover:scale-102">
            <StatusBadge status={room.status} />
          </div>
        </div>

        {/* 2. Operational Info - Khay chứa xếp lớp (Layered Container) */}
        <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-3 space-y-2.5 shadow-inner transition-colors duration-300 group-hover:bg-slate-50/80">
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <div className="p-1 bg-white rounded border border-slate-100 shadow-xs">
                <Banknote className="w-3.5 h-3.5 text-emerald-500 stroke-[1.8]" />
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400/90">
                Giá thuê
              </span>
            </div>
            <span className="font-extrabold text-slate-900 text-sm tabular-nums tracking-tight">
              {Number(room.roomPrice ?? 0).toLocaleString("vi-VN")} đ
            </span>
          </div>

          <div className="h-px bg-slate-200/40 w-full" />

          {/* Tenant */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <div className="p-1 bg-white rounded border border-slate-100 shadow-xs">
                <User className="w-3.5 h-3.5 text-indigo-500 stroke-[1.8]" />
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400/90">
                Cư dân
              </span>
            </div>
            <span
              className={`text-xs font-bold truncate max-w-30 text-right tracking-tight transition-colors duration-300 ${
                room.tenant
                  ? "text-slate-800"
                  : "text-slate-300 italic font-medium"
              }`}
            >
              {room.tenant?.name || "Sẵn sàng"}
            </span>
          </div>
        </div>

        {/* 3. Amenities & Contract Area - Tương tác vi mô */}
        <div className="min-h-8 flex items-center justify-between px-0.5">
          {room.tenant?.endDate ? (
            <div className="flex items-center justify-between w-full px-2.5 py-1.5 bg-indigo-50/40 border border-indigo-100/30 rounded-md text-[10px] transition-all duration-300 group-hover:bg-indigo-50/70">
              <div className="flex items-center font-black text-indigo-600 uppercase tracking-wider">
                <Calendar className="w-3 h-3 mr-1.5 text-indigo-400 animate-pulse" />
                Hạn hợp đồng
              </div>
              <span className="font-mono font-black text-indigo-700">
                {room.tenant.endDate}
              </span>
            </div>
          ) : (
            /* Tiện ích mồi khách - Nhìn sâu và chuyển màu nhẹ khi hover card */
            <div className="flex items-center gap-4 px-1">
              <div className="flex items-center gap-1.5 text-slate-400 transition-colors duration-300 group-hover:text-slate-600">
                <Wind className="w-3.5 h-3.5 stroke-[1.5] transition-transform duration-500 group-hover:rotate-12" />
                <span className="text-[9px] font-black tracking-wider">AC</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 transition-colors duration-300 group-hover:text-slate-600">
                <Wifi className="w-3.5 h-3.5 stroke-[1.5]" />
                <span className="text-[9px] font-black tracking-wider">
                  WIFI
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 transition-colors duration-300 group-hover:text-slate-600">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[1.5]" />
                <span className="text-[9px] font-black tracking-wider">
                  24/7
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 4. Actions Section - Nút bấm dẹt, lì, phản hồi lực nhấn tốt */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          <Link href={`/admin/rooms/${room.id}`} className="flex-1">
            <Button className="w-full bg-slate-950 hover:bg-indigo-600 text-white rounded-lg h-10 font-bold text-xs tracking-wider transition-all duration-300 shadow-sm hover:shadow-[0_4px_12px_rgba(79,70,229,0.25)] active:scale-[0.98]">
              Chi tiết phòng
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-lg h-10 w-10 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-xs active:scale-[0.98]"
              >
                <MoreVertical className="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-xl border border-slate-100 w-52 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white/95 backdrop-blur-md"
            >
              <RoomDialog
                mode="update"
                initialData={room}
                onSubmit={onUpdate}
                trigger={
                  <DropdownMenuItem
                    className="gap-2.5 cursor-pointer rounded-lg py-2.5 focus:bg-slate-50 font-bold text-slate-600 text-xs transition-colors"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <PencilLine className="w-4 h-4 text-slate-400" /> Chỉnh sửa
                    thông tin
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-lg py-2.5 focus:bg-slate-50 font-bold text-slate-600 text-xs transition-colors">
                <FileText className="w-4 h-4 text-slate-400" /> Lập hợp đồng mới
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 border-slate-100" />
              <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-lg py-2.5 focus:bg-rose-50 focus:text-rose-600 font-bold text-rose-500 text-xs transition-colors">
                <AlertCircle className="w-4 h-4" /> Báo hỏng / Sửa chữa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
