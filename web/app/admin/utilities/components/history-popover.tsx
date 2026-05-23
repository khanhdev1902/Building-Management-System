"use client";

import React from "react";
import { History, CalendarDays } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";


// Định nghĩa Interface cấu trúc lịch sử động truyền từ API Server
interface HistoryItem {
  month: string;
  index: number;
  usage: number;
  amount: number;
}

interface HistoryPopoverProps {
  label: string;
  unit: "kWh" | "m³" | string;
  historyData?: HistoryItem[]; // Nhận data động từ component cha
}

export function HistoryPopover({
  label,
  unit,
  historyData = [],
}: HistoryPopoverProps) {
  // Thuật toán định vị hệ màu sắc độc bản đồng bộ theo phân loại thiết bị IoT
  const isElectric = unit.toLowerCase() === "kwh";
  const theme = isElectric
    ? { text: "text-amber-600", bg: "bg-amber-50/40 border-amber-100/30" }
    : { text: "text-blue-600", bg: "bg-blue-50/40 border-blue-100/30" };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-slate-400 hover:text-slate-800 hover:bg-slate-100/80 rounded-md transition-colors shrink-0 cursor-pointer"
          title="Xem lịch sử tiêu thụ"
        >
          <History className="w-3.5 h-3.5 stroke-[1.8]" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-68 p-0 rounded-xl border border-slate-200/70 bg-white/95 backdrop-blur-md shadow-[0_12px_28px_-8px_rgba(15,23,42,0.08)] overflow-hidden animate-in fade-in duration-150"
        align="end"
        sideOffset={6}
      >
        {/* 1. HEADER KHAY POPUP: Phẳng, dẹt, tinh gọn */}
        <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/60 select-none">
          <h4 className="font-bold text-xs text-slate-900 tracking-tight flex items-center gap-1">
            {label}
          </h4>
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
            Đối soát chỉ số tiêu thụ lịch sử
          </p>
        </div>

        {/* 2. KHU VỰC DANH SÁCH: Sắp xếp theo cấu trúc Timeline Card phẳng mượt */}
        <div className="p-3 space-y-2 select-none">
          {historyData.length === 0 ? (
            <p className="text-[11px] text-slate-400 font-medium italic p-3 text-center">
              Chưa có dữ liệu đối soát kỳ trước.
            </p>
          ) : (
            historyData.map((h, i) => (
              <div
                key={i}
                className="p-2.5 border border-slate-100 rounded-lg bg-slate-50/30 hover:bg-slate-50/70 transition-colors flex flex-col space-y-1.5"
              >
                {/* Hàng 1: Mốc thời gian định kì & Sản lượng tiêu thụ gài mỏ neo màu */}
                <div className="flex justify-between items-center w-full text-xs font-semibold">
                  <span className="text-slate-500 flex items-center gap-1 font-sans">
                    <CalendarDays size={11} className="text-slate-400" />
                    {h.month}
                  </span>

                  {/* Badge sản lượng phẳng mịn, chuyển sắc thích ứng */}
                  <span
                    className={`font-mono font-black px-1.5 py-0.5 rounded border text-[11px] ${theme.text} ${theme.bg}`}
                  >
                    +{h.usage}
                    <span className="text-[9px] font-sans font-normal ml-0.5 lowercase text-slate-400">
                      {unit}
                    </span>
                  </span>
                </div>

                {/* Hàng 2: Chỉ số công tơ chốt chìm cứng & Tổng tiền VNĐ font Mono đậm */}
                <div className="flex justify-between items-center w-full text-[11px] font-medium border-t border-slate-100/50 pt-1.5">
                  <span className="text-slate-400 font-mono">
                    Số chốt:{" "}
                    <strong className="text-slate-700 font-bold">
                      {h.index}
                    </strong>
                  </span>
                  <span className="font-black text-slate-900 font-mono">
                    {h.amount.toLocaleString("vi-VN")}
                    <span className="text-[9px] font-sans font-normal text-slate-400 ml-0.5">
                      đ
                    </span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
