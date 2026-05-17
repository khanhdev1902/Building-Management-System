"use client";

import React from "react";
import { Box, PenTool, AlertOctagon, Activity } from "lucide-react";
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
  const stats = [
    {
      label: "Tổng tài sản",
      value: total,
      unit: "T.Bị",
      icon: <Box className="w-3.5 h-3.5" />,
      color: "text-slate-900",
      borderHover: "hover:border-slate-900/30",
      barColor: "bg-slate-900",
      accent: "bg-slate-50",
      progress: 100,
      trend: "+12.5%",
    },
    {
      label: "Đang vận hành",
      value: active,
      unit: "Live",
      icon: <Activity className="w-3.5 h-3.5" />,
      color: "text-emerald-600",
      borderHover: "hover:border-emerald-500/30",
      barColor: "bg-emerald-500",
      accent: "bg-emerald-50",
      progress: 95,
      trend: "98.2%",
    },
    {
      label: "Đang bảo trì",
      value: fixxing,
      unit: "Sửa",
      icon: <PenTool className="w-3.5 h-3.5" />,
      color: "text-amber-600",
      borderHover: "hover:border-amber-500/30",
      barColor: "bg-amber-500",
      accent: "bg-amber-50",
      progress: 15,
      trend: "08 P",
    },
    {
      label: "Cần thay thế",
      value: repair,
      unit: "Alert",
      icon: <AlertOctagon className="w-3.5 h-3.5" />,
      color: "text-red-600",
      borderHover: "hover:border-red-500/30",
      barColor: "bg-red-500",
      accent: "bg-red-50",
      progress: 8,
      trend: "Critical",
      isAlert: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <Card
          key={i}
          className={`group relative border border-slate-100 bg-white p-3 rounded-lg transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.1)] ${s.borderHover} overflow-hidden`}
        >
          {/* Shine effect cực nhanh khi hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent z-20" />

          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div
                className={`p-1.5 rounded-md ${s.accent} ${s.color} ring-1 ring-inset ring-black/5`}
              >
                {s.icon}
              </div>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${s.isAlert ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"}`}
              >
                {s.trend}
              </span>
            </div>

            <div className="space-y-0">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight">
                {s.label}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-slate-900 tabular-nums">
                  {s.value}
                </span>
                <span className="text-[9px] font-bold text-slate-400">
                  {s.unit}
                </span>
              </div>
            </div>

            {/* Thanh tiến độ siêu mảnh nằm dưới cùng */}
            <div className="mt-1 h-[3px] w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${s.barColor}`}
                style={{ width: `${s.progress}%` }}
              />
            </div>
          </div>

          {/* Overlay rọi sáng nhẹ ở góc khi hover */}
          <div className="absolute -right-4 -top-4 w-12 h-12 bg-slate-400/5 rounded-full blur-2xl group-hover:bg-current transition-colors opacity-0 group-hover:opacity-100" />
        </Card>
      ))}

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};
