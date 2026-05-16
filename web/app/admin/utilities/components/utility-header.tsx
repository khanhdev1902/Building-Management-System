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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-slate-200/60 mb-2">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-100 rounded-lg">
            <LayoutGrid className="w-4 h-4 text-slate-600" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Ghi Chỉ Số Dịch Vụ
          </h1>
          <Badge
            variant="outline"
            className="ml-2 border-slate-200 text-slate-500 font-bold text-[10px] h-5"
          >
            Danjin BMS
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-tight">
              Kỳ:
            </span>
            <span className="text-[11px] font-black text-indigo-600">
              {currentMonth}
            </span>
          </div>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <div className="flex items-center gap-1.5">
            <Clock3 className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[11px] font-bold uppercase tracking-tight">
              Hạn chốt:
            </span>
            <span className="text-[11px] font-black text-red-500">
              {deadline}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onExport}
          className="h-10 px-4 rounded-xl border-slate-200 text-slate-600 font-bold text-xs gap-2 hover:bg-slate-50 transition-all"
        >
          <FileDown className="w-4 h-4" />
          Xuất Excel
        </Button>

        <Button
          onClick={onSaveAll}
          className="h-10 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs gap-2 shadow-sm shadow-slate-200 transition-all"
        >
          <Save className="w-4 h-4" />
          LƯU KẾT QUẢ
        </Button>
      </div>
    </div>
  );
};
