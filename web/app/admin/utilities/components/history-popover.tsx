"use client";

import React from "react";
import { History } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

// Mock history data mẫu chuẩn hóa cấu trúc
const MOCK_HISTORY = [
  { month: "Kỳ 02/2026", index: 1250, usage: 140, amount: "490.000" },
  { month: "Kỳ 01/2026", index: 1110, usage: 135, amount: "472.500" },
];

export const HistoryPopover = ({
  label,
  unit,
}: {
  label: string;
  unit: string;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-slate-400 hover:text-slate-800 hover:bg-slate-100/80 rounded-md transition-colors shrink-0"
      >
        <History className="w-3.5 h-3.5 stroke-[1.75]" />
      </Button>
    </PopoverTrigger>

    <PopoverContent
      className="w-64 p-0 rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-md shadow-[0_12px_32px_-8px_rgba(15,23,42,0.12)] overflow-hidden"
      align="end"
      sideOffset={6}
    >
      {/* 1. Header Popover: Tinh giản, loại bỏ mảng đen thô cứng */}
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
        <h4 className="font-semibold text-xs text-slate-800 tracking-tight">
          {label}
        </h4>
        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mt-0.5">
          Lịch sử 2 kỳ gần nhất
        </p>
      </div>

      {/* 2. Danh sách dữ liệu phẳng, thoáng đãng không dùng Separator cắt vụn */}
      <div className="p-4 space-y-3.5">
        {MOCK_HISTORY.map((h, i) => (
          <div key={i} className="flex flex-col space-y-1 text-xs">
            {/* Hàng 1: Tháng & Khối lượng tiêu thụ */}
            <div className="flex justify-between items-baseline w-full">
              <span className="text-slate-400 font-medium text-[11px]">
                {h.month}
              </span>
              <span className="font-bold text-indigo-600 font-mono">
                +{h.usage}{" "}
                <span className="text-[10px] font-medium text-slate-400 font-sans">
                  {unit}
                </span>
              </span>
            </div>

            {/* Hàng 2: Chỉ số chốt & Số tiền tương ứng */}
            <div className="flex justify-between items-center w-full text-[11px]">
              <span className="text-slate-400 font-mono">
                Chỉ số chốt:{" "}
                <span className="text-slate-600 font-medium">{h.index}</span>
              </span>
              <span className="font-semibold text-slate-700 font-mono">
                {h.amount}đ
              </span>
            </div>
          </div>
        ))}
      </div>
    </PopoverContent>
  </Popover>
);
