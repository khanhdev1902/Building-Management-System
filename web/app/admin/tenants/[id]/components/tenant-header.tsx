"use client";

import React from "react";
import {
  ArrowLeft,
  MapPin,
  Copy,
  MoreHorizontal,
  Phone,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { EditTenantSheet } from "./edit-tenant-sheet";

interface TenantHeaderProps {
  name: string;
  id: string;
  room: string;
  building: string;
  status: string;
}

export function TenantHeader({
  name,
  id,
  room,
  building,
  status,
}: TenantHeaderProps) {
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  return (
    <div className="bg-white border-b border-slate-200">
      {/* 1. Thanh phụ trên cùng (Sub-header) - Giúp Header bớt lồi */}
      {/* <div className="px-6 py-2 flex items-center justify-between border-b border-slate-50 bg-slate-50/50">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
          <span>Quản lý cư dân</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900">{room}</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors">
            <History size={12} /> Nhật ký thay đổi
          </button>
        </div>
      </div> */}

      {/* 2. Nội dung chính */}
      <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Nút Back phẳng hơn */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 border border-slate-100 bg-white hover:bg-slate-50 text-slate-500 rounded-md shrink-0 shadow-none"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">
                {name}
              </h1>

              {/* Badge dạng Flat (không shadow, không bo tròn quá đà) */}
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter">
                <CheckCircle2 size={10} strokeWidth={3} /> {status}
              </div>

              <div className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter">
                <AlertTriangle size={10} strokeWidth={3} /> Nợ: 1.250k
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-[13px] font-bold text-slate-600 tracking-tight">
                  {room}
                </span>
                <span className="text-slate-300 font-light mx-1">|</span>
                <span className="text-[13px] font-medium text-slate-400">
                  {building}
                </span>
              </div>

              <div className="h-3 w-px bg-slate-200" />

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                  ID: {id}
                  <button className="hover:text-indigo-600 transition-colors">
                    <Copy size={12} />
                  </button>
                </div>

                {/* Contact Actions - Làm nhỏ và sắc sảo hơn */}
                <div className="flex items-center gap-1">
                  <button className="h-7 w-7 flex items-center justify-center rounded-md text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
                    <Phone size={14} />
                  </button>
                  <button className="h-7 w-7 flex items-center justify-center rounded-md text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-all border border-transparent hover:border-sky-100">
                    <MessageSquare size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Nhóm Action phía bên phải */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsEditOpen(true)}
            className="h-9 px-4 rounded-md border-slate-200 text-slate-600 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 shadow-none transition-all"
          >
            Sửa hồ sơ
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100 rounded-md"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52 shadow-2xl border-slate-200"
            >
              <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 p-3">
                Thao tác hệ thống
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-50" />
              <DropdownMenuItem className="p-3 text-xs font-bold text-slate-700">
                Gia hạn hợp đồng
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 text-xs font-bold text-slate-700">
                Tạm ngưng dịch vụ
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 text-xs font-black text-red-600 uppercase italic">
                Checkout (Trả phòng)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-6 bg-slate-100 mx-1" />

          {/* Primary Action Button - Solid & Deep */}
          {/* <Button className="h-10 px-6 rounded-md bg-slate-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-[0.1em] shadow-none active:scale-95 transition-all">
            + Tạo hóa đơn / Phiếu thu
          </Button> */}
        </div>
      </div>

      <EditTenantSheet
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        tenantData={{ name, room }}
      />
    </div>
  );
}
