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
  statusLabel: string; // Khắc phục: Động hóa nhãn trạng thái
  statusType: "primary" | "success" | "info" | "warning";
}

const QuickStatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
  statusLabel,
  statusType,
}: StatCardProps) => {
  const statusStyles = {
    primary: {
      dot: "bg-indigo-500",
      icon: "text-indigo-600 bg-indigo-50/40",
      hoverIcon: "group-hover:bg-indigo-600 group-hover:text-white",
    },
    success: {
      dot: "bg-emerald-500",
      icon: "text-emerald-600 bg-emerald-50/40",
      hoverIcon: "group-hover:bg-emerald-600 group-hover:text-white",
    },
    info: {
      dot: "bg-blue-500",
      icon: "text-blue-600 bg-blue-50/40",
      hoverIcon: "group-hover:bg-blue-600 group-hover:text-white",
    },
    warning: {
      dot: "bg-amber-500",
      icon: "text-amber-600 bg-amber-50/40",
      hoverIcon: "group-hover:bg-amber-600 group-hover:text-white",
    },
  };

  const currentStyle = statusStyles[statusType];

  return (
    <Card className="group relative border-slate-200/80 bg-white p-4.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_24px_rgba(15,23,42,0.04)] hover:border-slate-300 transition-all duration-300 rounded-xl overflow-hidden flex flex-col justify-between min-h-30">
      {/* HÀNG TRÊN: Icon biến đổi màu động & Chấm định vị nhãn chuyên nghiệp */}
      <div className="flex items-center justify-between w-full">
        <div
          className={`p-1.5 rounded-lg border border-transparent transition-all duration-300 ${currentStyle.icon} ${currentStyle.hoverIcon}`}
        >
          <Icon className="w-4 h-4 stroke-2" />
        </div>

        <div className="flex items-center gap-1.5 select-none">
          <span className={`h-1.2 w-1.2 rounded-full ${currentStyle.dot}`} />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {statusLabel}
          </span>
        </div>
      </div>

      {/* HÀNG DƯỚI: Đẩy số liệu font Mono lớn lên trục mắt hàng đầu */}
      <div className="space-y-0.5 mt-4">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums font-mono">
            {value}
          </h4>

          {/* Badge xu hướng phẳng mịn */}
          {trend && (
            <div
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold border-none select-none bg-slate-50 text-slate-500 font-sans`}
            >
              {trend.startsWith("+") && (
                <ArrowUpRight className="w-2.5 h-2.5 inline text-emerald-500 stroke-[2.5]" />
              )}
              <span
                className={
                  trend === "Ổn định"
                    ? "text-blue-600"
                    : trend === "Dự kiến"
                      ? "text-amber-600"
                      : "text-emerald-600"
                }
              >
                {trend}
              </span>
              {trendLabel && (
                <span className="text-slate-400 font-normal ml-0.5 font-sans lowercase">
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>

        <p className="text-[11px] font-medium text-slate-400 tracking-normal select-none">
          {label}
        </p>
      </div>
    </Card>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RoomStats({ stats }: { stats: any }) {
  return (
    /* KHẮC PHỤC: Đã đập bỏ khung xám thô bên ngoài, trả lại lưới phẳng trần thoáng đạt */
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <QuickStatCard
        label="Tổng số căn hộ quản lý"
        value={stats.total}
        icon={Home}
        statusLabel="Hệ thống"
        statusType="primary"
      />
      <QuickStatCard
        label="Căn hộ trống hiện tại"
        value={stats.available}
        icon={DoorOpen}
        trend="+2"
        trendLabel="tuần này"
        statusLabel="Sẵn sàng"
        statusType="success"
      />
      <QuickStatCard
        label="Tỷ lệ lấp đầy bình quân"
        value={`${stats.occupancyRate}%`}
        icon={Layers}
        trend="Ổn định"
        statusLabel="Vận hành"
        statusType="info"
      />
      <QuickStatCard
        label="Yêu cầu bảo trì tồn đọng"
        value={stats.maintenance}
        icon={Wrench}
        trend="Dự kiến"
        statusLabel="Bảo trì"
        statusType="warning"
      />
    </div>
  );
}
