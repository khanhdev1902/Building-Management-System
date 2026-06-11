"use client";

import React from "react";
import {
  ArrowLeft,
  CheckCircle2,
  MoreHorizontal,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

interface RoomHeaderProps {
  roomNumber?: string;
  floor?: string;
  area?: string;
  type?: string;
  statusLabel?: string;
  metrics?: {
    price?: number;
    deposit?: number;
    expiryDate?: string;
  };
}

export const RoomHeader = ({
  roomNumber,
  floor,
  area,
  type,
  statusLabel,
  metrics,
}: RoomHeaderProps) => {
  // 1. Kiểm tra trạng thái an toàn để hiển thị màu sắc tương ứng
  const hasStatus = !!statusLabel;

  return (
    <div className="flex flex-col gap-3.5 select-none pb-1 animate-in fade-in duration-200">
      {/* HÀNG TRÊN: Định danh căn hộ & Nút tác vụ hệ thống phẳng */}
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/admin/rooms" className="shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 border border-slate-200/60 bg-white hover:bg-slate-50 text-slate-500 rounded-lg shadow-3xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-base font-bold tracking-tight text-slate-900 font-mono truncate">
              Căn hộ {roomNumber ?? "—"}
            </h1>

            {/* Render Badge động: Nếu có trạng thái thì hiện, không có thì báo Trống để Admin biết */}
            {hasStatus ? (
              <span className="inline-flex items-center gap-1 shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-100/60 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide">
                <CheckCircle2 size={11} className="stroke-[2.5]" />{" "}
                {statusLabel}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 shrink-0 bg-slate-50 text-slate-400 border border-slate-200/40 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide">
                <HelpCircle size={11} /> Chưa thiết lập
              </span>
            )}
          </div>
        </div>

        {/* Nút tùy chọn nâng cao phẳng */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-slate-700 border border-slate-200/60 bg-white rounded-lg shadow-3xs transition-colors cursor-pointer"
        >
          <MoreHorizontal size={14} />
        </Button>
      </div>

      {/* HÀNG DƯỚI: Gom toàn bộ hạ tầng và Metrics tài chính về một dải đồng trục ngang */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 w-full border-t border-slate-200/60 pt-3">
        {/* Chỉ số hạ tầng phòng */}
        <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1 text-slate-800 font-mono font-bold">
            Tầng {floor ?? "—"}
          </span>
          <span className="text-slate-200 font-light select-none">|</span>
          <span className="text-slate-700 font-mono font-semibold">
            {area ? `${area} m²` : "— m²"}
          </span>
          <span className="text-slate-200 font-light select-none">|</span>
          <span className="text-[11px] font-sans font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/50 uppercase tracking-tight">
            {type ?? "Chưa phân loại"}
          </span>
        </div>

        {/* Khối dải số liệu tài chính nén chặt inline phẳng lì */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 sm:gap-x-6 text-xs font-medium">
          {/* GIÁ NIÊM YẾT */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Giá niêm yết:
            </span>
            <span className="font-bold text-slate-900 font-mono">
              {metrics?.price
                ? Number(metrics.price).toLocaleString("vi-VN")
                : "0"}
              <span className="text-[10px] text-slate-400 font-sans font-normal ml-0.5">
                đ
              </span>
            </span>
          </div>

          <div className="h-3 w-px bg-slate-200 hidden sm:block select-none" />

          {/* QUỸ CỌC GIỮ */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Quỹ cọc giữ:
            </span>
            <span
              className={`font-bold font-mono ${metrics?.deposit ? "text-indigo-600" : "text-slate-400"}`}
            >
              {metrics?.deposit ? metrics.deposit.toLocaleString("vi-VN") : "0"}
              <span className="text-[10px] text-slate-400 font-sans font-normal ml-0.5">
                đ
              </span>
            </span>
          </div>

          <div className="h-3 w-px bg-slate-200 hidden sm:block select-none" />

          {/* ĐÁO HẠN HỢP ĐỒNG */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Đáo hạn HĐ:
            </span>
            <span
              className={`font-bold font-mono ${metrics?.expiryDate ? "text-amber-600" : "text-slate-400"}`}
            >
              {metrics?.expiryDate ?? "Chưa ký kết"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
