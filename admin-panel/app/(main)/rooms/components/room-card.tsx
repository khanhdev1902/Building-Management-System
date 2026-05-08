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
  Wind, // Icon Điều hòa
  Wifi, // Icon Wifi
  ShieldCheck, // Icon An ninh
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

export function RoomCard({
  room,
  onUpdate,
}: {
  room: any;
  onUpdate: (data: any) => void;
}) {
  return (
    <Card className="group relative border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500 bg-white rounded-2xl overflow-hidden border flex flex-col h-full">
      {/* Soft Glow Effect on Hover */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <CardContent className="p-5 space-y-5 relative z-10 flex flex-col h-full">
        {/* 1. Header Section */}
        <div className="flex items-start justify-between min-h-13">
          <div className="space-y-1.5">
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
              {room.name}
            </h3>
            <div className="flex gap-1.5">
              <Badge
                variant="outline"
                className="bg-slate-50/50 text-slate-500 border-slate-200/60 text-[9px] px-1.5 py-0 rounded-md h-5 font-bold"
              >
                <Layers className="w-2.5 h-2.5 mr-1 text-slate-400" /> Tầng{" "}
                {room.floor}
              </Badge>
              <Badge
                variant="outline"
                className="bg-slate-50/50 text-slate-500 border-slate-200/60 text-[9px] px-1.5 py-0 rounded-md h-5 font-bold"
              >
                <Maximize2 className="w-2.5 h-2.5 mr-1 text-slate-400" />{" "}
                {room.area}m²
              </Badge>
            </div>
          </div>
          <div className="shrink-0 pt-0.5">
            <StatusBadge status={room.status} />
          </div>
        </div>

        {/* 2. Operational Info Table */}
        <div className="bg-slate-50/80 rounded-xl p-3.5 space-y-3 border border-slate-100">
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white rounded-md shadow-sm border border-slate-100">
                <Banknote className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                Giá thuê
              </span>
            </div>
            <span className="font-extrabold text-slate-900 text-sm tabular-nums tracking-tight">
              {room.price?.toLocaleString("vi-VN")}đ
            </span>
          </div>

          <div className="h-px bg-slate-200/50 w-full" />

          {/* Tenant */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white rounded-md shadow-sm border border-slate-100">
                <User className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                Khách
              </span>
            </div>
            <span
              className={`text-sm font-bold truncate max-w-30 text-right ${room.tenant ? "text-slate-700" : "text-slate-300 italic font-medium"}`}
            >
              {room.tenant?.name || "Sẵn sàng"}
            </span>
          </div>
        </div>

        {/* 3. Amenities & Contract Area (Fixed Height 40px) */}
        <div className="min-h-10 flex items-center justify-between px-1">
          {room.tenant?.endDate ? (
            <div className="flex items-center justify-between w-full px-3 py-2 bg-indigo-50/50 rounded-lg border border-indigo-100/30 transition-all animate-in fade-in slide-in-from-bottom-1">
              <div className="flex items-center text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">
                <Calendar className="w-3 h-3 mr-2" />
                Hạn hợp đồng
              </div>
              <span className="text-[11px] font-black text-indigo-700 underline underline-offset-2 decoration-indigo-200">
                {room.tenant.endDate}
              </span>
            </div>
          ) : (
            /* Khi không có khách: Hiển thị các tiện ích có sẵn để "mồi" khách */
            <div className="flex items-center gap-4 animate-in fade-in">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Wind className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  AC
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Wifi className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  WIFI
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  24/7
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 4. Actions Section */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          <Link href={`/rooms/${room.id}`} className="flex-1">
            <Button className="w-full bg-slate-900 hover:bg-indigo-600 text-white rounded-xl h-11 font-bold text-xs shadow-sm transition-all hover:shadow-indigo-200 active:scale-95 border-b-2 border-slate-800 hover:border-indigo-700">
              Chi tiết phòng
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl h-11 w-11 border-slate-200 bg-white hover:bg-slate-50 transition-all"
              >
                <MoreVertical className="h-5 w-5 text-slate-400 group-hover:text-slate-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-2xl w-56 p-2 shadow-2xl border-slate-100 bg-white/95 backdrop-blur-md"
            >
              <RoomDialog
                mode="update"
                initialData={room}
                onSubmit={onUpdate}
                trigger={
                  <DropdownMenuItem
                    className="gap-3 cursor-pointer rounded-xl py-3 focus:bg-slate-50 font-bold text-slate-600 text-xs"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <PencilLine className="w-4 h-4 text-slate-400" /> Chỉnh sửa
                    thông tin
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuItem className="gap-3 cursor-pointer rounded-xl py-3 focus:bg-slate-50 font-bold text-slate-600 text-xs">
                <FileText className="w-4 h-4 text-slate-400" /> Lập hợp đồng mới
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1.5 opacity-50" />
              <DropdownMenuItem className="gap-3 cursor-pointer rounded-xl py-3 focus:bg-rose-50 focus:text-rose-600 font-bold text-rose-500 text-xs">
                <AlertCircle className="w-4 h-4" /> Báo hỏng / Sửa chữa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
