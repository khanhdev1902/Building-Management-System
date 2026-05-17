"use client";

import React from "react";
import { Box, Wrench, AlertTriangle, Activity } from "lucide-react";
import { Card } from "@/shared/components/ui/card";

export const AssetStats = ({
  total = 0,
  active = 0,
  fixxing = 0,
  repair = 0,
}: {
  total?: number;
  active?: number;
  fixxing?: number;
  repair?: number;
}) => {
  // Tính toán phần trăm thực tế từ API để dải thanh tiến độ không bị "ảo"
  const calculateProgress = (value: number) => {
    if (total === 0) return 0;
    return Math.min((value / total) * 100, 100);
  };

  const stats = [
    {
      label: "Tổng tài sản hệ thống",
      value: total,
      unit: "Thiết bị",
      icon: <Box className="w-3.5 h-3.5 stroke-[1.75]" />,
      color: "text-slate-900",
      barColor: "bg-slate-900",
      accent: "bg-slate-50 border-slate-100",
      progress: 100,
      trend: "+12.5%",
      trendClass: "bg-slate-50 text-slate-500 border-slate-200/60",
    },
    {
      label: "Thiết bị đang vận hành",
      value: active,
      unit: "Live",
      icon: <Activity className="w-3.5 h-3.5 stroke-[1.75]" />,
      color: "text-emerald-600",
      barColor: "bg-emerald-500",
      accent: "bg-emerald-50/50 border-emerald-100/50",
      progress: calculateProgress(active),
      trend: "98.2%",
      trendClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      label: "Thiết bị đang bảo trì",
      value: fixxing,
      unit: "Sửa chữa",
      icon: <Wrench className="w-3.5 h-3.5 stroke-[1.75]" />,
      color: "text-amber-600",
      barColor: "bg-amber-500",
      accent: "bg-amber-50/50 border-amber-100/50",
      progress: calculateProgress(fixxing),
      trend: "08 Phòng",
      trendClass: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      label: "Thiết bị cần thay thế",
      value: repair,
      unit: "Cảnh báo",
      icon: <AlertTriangle className="w-3.5 h-3.5 stroke-[1.75]" />,
      color: "text-rose-600",
      barColor: "bg-rose-500",
      accent: "bg-rose-50/50 border-rose-100/50",
      progress: calculateProgress(repair),
      trend: "Critical",
      trendClass: "bg-rose-50 text-rose-600 border-rose-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
      {stats.map((s, i) => (
        <Card
          key={i}
          className="group relative border border-slate-200/70 bg-white p-4 rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_24px_-8px_rgba(15,23,42,0.04)] overflow-hidden flex flex-col justify-between min-h-27.5"
        >
          {/* Lớp phủ sáng mờ góc nền mềm mại */}
          <div className="absolute inset-0 bg-radial from-slate-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative z-10 space-y-3.5 w-full">
            {/* Tuyến đầu: Icon box dẹt phẳng & Tag chỉ số bổ trợ */}
            <div className="flex justify-between items-center w-full">
              <div
                className={`p-1.5 rounded-lg border text-slate-500 transition-colors duration-300 group-hover:text-slate-900 bg-slate-50 border-slate-100 shadow-2xs`}
              >
                {s.icon}
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded border font-mono ${s.trendClass}`}
              >
                {s.trend}
              </span>
            </div>

            {/* Tuyến hai: Con số dữ liệu lớn nằm TRÊN, nhãn nằm DƯỚI */}
            <div className="space-y-0.5 w-full">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900 font-sans tracking-tight leading-none">
                  {s.value}
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  {s.unit}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-400 tracking-tight">
                {s.label}
              </p>
            </div>

            {/* Thanh tiến độ động siêu mịn */}
            <div className="h-0.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ease-out ${s.barColor}`}
                style={{ width: `${s.progress}%` }}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
