/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Card } from "@/shared/components/ui/card";
import { Home, DoorOpen, Layers, Wrench, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendLabel?: string;
  // Giữ lại hệ màu cũ nhưng map sang style mới sang trọng hơn
  statusType: "primary" | "success" | "info" | "warning";
}

const QuickStatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
  statusType,
}: StatCardProps) => {
  // Định nghĩa màu sắc tối giản, chuyên nghiệp (Chỉ nhấn bằng 1 chấm nhỏ hoặc màu chữ trend)
  const statusStyles = {
    primary: { dot: "bg-indigo-500", trend: "text-indigo-600 bg-indigo-50/50" },
    success: {
      dot: "bg-emerald-500",
      trend: "text-emerald-600 bg-emerald-50/50",
    },
    info: { dot: "bg-blue-500", trend: "text-blue-600 bg-blue-50/50" },
    warning: { dot: "bg-amber-500", trend: "text-amber-600 bg-amber-50/50" },
  };

  const currentStyle = statusStyles[statusType];

  return (
    <Card className="group relative border-slate-200/80 bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.04),0_4px_12px_-2px_rgba(0,0,0,0.02)] transition-all duration-300 rounded-xl overflow-hidden flex flex-col justify-between min-h-32">
      {/* Top Row: Icon & Chấm trạng thái tinh tế */}
      <div className="flex items-center justify-between w-full mb-3">
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 group-hover:text-slate-900 group-hover:bg-slate-100/80 transition-colors duration-300">
          <Icon className="w-4 h-4 stroke-[1.75]" />
        </div>

        {/* Chấm chỉ báo trạng thái nhỏ gọn, chuyên nghiệp thay vì bọc cả mảng màu lớn */}
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${currentStyle.dot}`} />
          <span className="text-[11px] font-medium text-slate-400 capitalize">
            Active
          </span>
        </div>
      </div>

      {/* Bottom Row: Số liệu lớn nằm trên, label nằm dưới theo chuẩn Dashboard B2B */}
      <div className="space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="text-2xl font-semibold text-slate-900 tracking-tight tabular-nums font-mono">
            {value}
          </h4>

          {/* Xu hướng thiết kế tối giản */}
          {trend && (
            <div
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium border border-transparent ${currentStyle.trend}`}
            >
              {trend.startsWith("+") && (
                <ArrowUpRight className="w-2.5 h-2.5 inline" />
              )}
              <span>{trend}</span>
              {trendLabel && (
                <span className="text-slate-400 font-normal ml-0.5">
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>

        <p className="text-xs font-medium text-slate-500 tracking-normal">
          {label}
        </p>
      </div>

      {/* Hiệu ứng chiều sâu ngầm (Subtle Linear Line ở top khi hover) */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </Card>
  );
};

export function RoomStats({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
      <QuickStatCard
        label="Tổng số căn hộ quản lý"
        value={stats.total}
        icon={Home}
        statusType="primary"
      />
      <QuickStatCard
        label="Căn hộ trống hiện tại"
        value={stats.available}
        icon={DoorOpen}
        trend="+2"
        trendLabel="tuần này"
        statusType="success"
      />
      <QuickStatCard
        label="Tỷ lệ lấp đầy bình quân"
        value={`${stats.occupancyRate}%`}
        icon={Layers}
        trend="Ổn định"
        statusType="info"
      />
      <QuickStatCard
        label="Yêu cầu bảo trì tồn đọng"
        value={stats.maintenance}
        icon={Wrench}
        trend="Dự kiến"
        statusType="warning"
      />
    </div>
  );
}
