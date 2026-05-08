"use client";

import React from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Home, DoorOpen, Layers, Wrench, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendLabel?: string;
  color: "indigo" | "emerald" | "blue" | "orange";
}

const QuickStatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color,
}: StatCardProps) => {
  // Bảng màu chuyên nghiệp: Chỉ dùng màu nhấn cho Icon và Text, nền giữ trắng/xám cực nhẹ
  const colors = {
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
  };

  return (
    <Card className="group relative border-slate-200/60 shadow-none hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 rounded-xl bg-white overflow-hidden border">
      <CardContent className="p-4 flex items-center gap-4">
        {/* 1. Icon Box - Thiết kế tinh tế, không quá to */}
        <div
          className={`shrink-0 p-2.5 rounded-lg border ${colors[color]} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* 2. Content Section */}
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">
            {label}
          </p>

          <div className="flex items-baseline gap-2">
            <h4 className="text-xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {value}
            </h4>

            {/* Trend Indicator - Nhỏ gọn như ảnh mẫu */}
            {trend && (
              <div className="flex items-center gap-0.5 animate-in fade-in slide-in-from-left-2 duration-500">
                <span
                  className={`text-[10px] font-black ${color === "emerald" ? "text-emerald-500" : "text-blue-600"}`}
                >
                  {trend}
                </span>
                {trendLabel && (
                  <span className="text-[10px] font-medium text-slate-400">
                    {trendLabel}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 3. Hiệu ứng trang trí góc - Chỉ xuất hiện khi hover */}
        <div
          className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity`}
        />
      </CardContent>
    </Card>
  );
};

export function RoomStats({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <QuickStatCard
        label="Tổng số phòng"
        value={stats.total}
        icon={Home}
        color="indigo"
      />
      <QuickStatCard
        label="Phòng trống"
        value={stats.available}
        icon={DoorOpen}
        trend="+2"
        trendLabel="mới"
        color="emerald"
      />
      <QuickStatCard
        label="Tỉ lệ lấp đầy"
        value={`${stats.occupancyRate}%`}
        icon={Layers}
        trend="Ổn định"
        color="blue"
      />
      <QuickStatCard
        label="Cần bảo trì"
        value={stats.maintenance}
        icon={Wrench}
        trend="Dự kiến"
        color="orange"
      />
    </div>
  );
}
