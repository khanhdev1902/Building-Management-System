"use client";

import React from "react";
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

interface TenantHeaderProps {
  name: string;
  id: string;
  room: string;
  building: string;
  status: string;
  metrics: {
    deposit: string;
    debt: string;
    expiryDays: string;
  };
}

export function TenantHeader({
  name,
  id,
  room,
  building,
  status,
  metrics,
}: TenantHeaderProps) {
  return (
    <div className="border-b border-slate-200/80 pb-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 select-none">
      {/* Khối bên trái: Lý lịch tóm tắt */}
      <div className="flex items-center gap-4">
        <Link href="/admin/tenants">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 cursor-pointer hover:bg-slate-50 text-slate-500 rounded-lg shrink-0"
          >
            <ArrowLeft className="w-4 h-4 stroke-2" />
          </Button>
        </Link>

        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-base font-bold tracking-tight text-slate-900">
              {name}
            </h1>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100/60 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
              <CheckCircle2 size={11} />{" "}
              {status === "active" ? "Đang cư trú" : status}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1 text-slate-800 font-mono font-bold">
              <MapPin size={13} className="text-slate-400" /> Phòng {room}
            </div>
            <span className="text-slate-200 font-light">|</span>
            <span className="text-slate-400 font-sans">{building}</span>
            <span className="text-slate-200 font-light">|</span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
              ID: {id}
            </span>
          </div>
        </div>
      </div>

      {/* Khối bên phải: Quy hoạch 3 ô Stats nén chặt kề cạnh nút tác vụ */}
      <div className="flex flex-wrap items-center gap-5 lg:gap-6 border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0">
        {/* Ô 1: Tiền cọc */}
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Tiền đặt cọc quỹ phòng
          </span>
          <span className="text-sm font-bold text-slate-900 font-mono">
            {metrics.deposit}{" "}
            <span className="text-[10px] text-slate-400 font-sans font-normal">
              đ
            </span>
          </span>
        </div>

        <div className="h-6 w-px bg-slate-100 hidden sm:block" />

        {/* Ô 2: Dư nợ */}
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Số dư công nợ chưa thu
          </span>
          <span className="text-sm font-bold text-rose-600 font-mono">
            {metrics.debt}{" "}
            <span className="text-[10px] text-slate-400 font-sans font-normal">
              đ
            </span>
          </span>
        </div>

        <div className="h-6 w-px bg-slate-100 hidden sm:block" />

        {/* Ô 3: Thời hạn */}
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Thời hạn hợp đồng còn lại
          </span>
          <span className="text-sm font-bold text-amber-600 font-mono">
            {metrics.expiryDays}{" "}
            <span className="text-[10px] text-slate-400 font-sans font-normal">
              ngày
            </span>
          </span>
        </div>

        <div className="h-8 w-px bg-slate-200/80 hidden lg:block mx-1" />

        {/* Cụm nút tác vụ hệ thống */}
        <div className="flex items-center gap-1.5 ml-auto lg:ml-0">
          <Button
            variant="outline"
            className="h-8.5 px-3 text-xs font-semibold border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 shadow-2xs bg-white"
          >
            Sửa hồ sơ
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8.5 w-8.5 text-slate-400 hover:text-slate-700 border border-slate-100 rounded-lg bg-white"
          >
            <MoreHorizontal size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
