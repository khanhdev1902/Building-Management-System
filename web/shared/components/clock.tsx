"use client";

import { useRealTime } from "@/shared/hooks/useTime";
import { Clock3 } from "lucide-react";

export default function Clock() {
  const { dateString, timeString } = useRealTime();

  return (
    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium select-none bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg h-7 shadow-2xs">
      {/* Icon đồng hồ mini mảnh làm điểm tựa thị giác */}
      <Clock3 className="w-3 h-3 text-slate-400 stroke-[1.75]" />

      {/* Ngày tháng chữ thường tinh tế */}
      <span className="text-slate-600 capitalize tracking-tight">
        {dateString}
      </span>

      {/* Dấu gạch phân cách mảnh hạt cát */}
      <span className="text-slate-200">|</span>

      {/* Giờ phút giây font Mono đứng im tuyệt đối khi nhảy số */}
      <span className="font-mono font-semibold text-slate-700 tracking-normal tabular-nums">
        {timeString}
      </span>
    </div>
  );
}
