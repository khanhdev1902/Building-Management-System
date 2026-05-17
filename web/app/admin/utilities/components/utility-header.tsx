"use client";

import React from "react";
import { FileDown, Save, Calendar, Clock3, LayoutGrid } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

interface UtilityHeaderProps {
  currentMonth: string;
  deadline: string;
  onExport: () => void;
  onSaveAll: () => void;
}

export const UtilityHeader = ({
  currentMonth = "T03/2026",
  deadline = "30/03",
  onExport,
  onSaveAll,
}: UtilityHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-slate-200/60 mb-3 w-full selection:bg-indigo-50">
      {/* Khối bên trái: Tiêu đề & Thông tin tiến trình chốt sổ */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          {/* Icon Box tinh xảo h-7 gọn gàng */}
          <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 shadow-2xs">
            <LayoutGrid className="w-3.5 h-3.5 stroke-[1.75]" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            Ghi chỉ số dịch vụ định kỳ
          </h1>
          <Badge
            variant="outline"
            className="border-slate-200 text-slate-400 font-medium text-[10px] h-4.5 px-1.5 rounded"
          >
            Danjin BMS
          </Badge>
        </div>

        {/* Khối meta-data chỉ số phẳng, dịu mắt */}
        <div className="flex items-center gap-3.5 text-slate-400">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />
            <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wider">
              Kỳ vận hành:
            </span>
            <span className="font-semibold text-indigo-600 font-mono bg-indigo-50/50 border border-indigo-100/30 px-1.5 py-0.2 rounded">
              {currentMonth}
            </span>
          </div>

          <div className="w-[3px] h-[3px] bg-slate-200 rounded-full" />

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock3 className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />
            <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wider">
              Hạn khóa sổ:
            </span>
            {/* Tag hạn chốt đỏ pastel cao cấp */}
            <span className="font-semibold text-rose-700 font-mono bg-rose-50 border border-rose-100/60 px-1.5 py-0.2 rounded">
              {deadline}
            </span>
          </div>
        </div>
      </div>

      {/* Khối bên phải: Cụm nút tác vụ đồng bộ chiều cao h-9 tinh xảo */}
      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
        <Button
          variant="outline"
          onClick={onExport}
          className="h-9 px-3 rounded-lg border-slate-200/80 bg-white text-slate-600 hover:text-slate-900 text-xs font-medium gap-1.5 shadow-2xs hover:bg-slate-50/50 transition-colors"
        >
          <FileDown className="w-3.5 h-3.5 text-slate-400 stroke-[1.75]" />
          <span>Xuất báo cáo Excel</span>
        </Button>

        <Button
          onClick={onSaveAll}
          className="h-9 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium gap-1.5 shadow-2xs transition-all active:scale-[0.99]"
        >
          <Save className="w-3.5 h-3.5 stroke-[1.75]" />
          <span>Lưu lại kết quả</span>
        </Button>
      </div>
    </div>
  );
};
