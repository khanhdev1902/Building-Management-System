// src/app/revenue/components/collection-rate-chart.tsx
"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface CollectionRateChartProps {
  rate: number;
  paidTotal: number;
  overdueTotal: number;
  periodLabel: string;
}

// Helper định dạng tiền tệ nội bộ
const fmt = (n: number) =>
  (n / 1_000_000).toLocaleString("vi-VN", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }) + "M đ";

export default function CollectionRateChart({
  rate,
  paidTotal,
  overdueTotal,
  periodLabel,
}: CollectionRateChartProps) {
  // ⚡ Định nghĩa dải màu sắc thái động chuẩn SaaS luxury
  const getStrokeColor = (currentRate: number) => {
    if (currentRate >= 95) return "#10b981"; // Emerald 500 (Đạt chỉ tiêu tài khóa)
    if (currentRate >= 85) return "#4f46e5"; // Indigo 600 (Ổn định)
    return "#f43f5e"; // Rose 500 (Cảnh báo dòng tiền nghẽn)
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5 flex flex-col justify-between gap-4 h-full">
      {/* TIÊU ĐỀ */}
      <div>
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Hiệu suất thu hồi công nợ
        </h3>
        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
          Phân tích dòng tiền thực tế kỳ {periodLabel}
        </p>
      </div>

      {/* BIỂU ĐỒ DONUT TRUNG TÂM */}
      <div className="flex items-center justify-center h-40 relative">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={[{ v: rate }, { v: Math.max(0, 100 - rate) }]}
              cx="50%"
              cy="50%"
              innerRadius={54}
              outerRadius={72}
              startAngle={90}
              endAngle={-270}
              dataKey="v"
              paddingAngle={2}
            >
              <Cell fill={getStrokeColor(rate)} />
              <Cell fill="#e2e8f0" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* TEXT GIỮA VÒNG TRÒN */}
        <div className="absolute text-center pointer-events-none">
          <div className="text-2xl font-black text-slate-900 font-mono">
            {rate}%
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
            Thu hồi
          </div>
        </div>
      </div>

      {/* KHỐI HIỂN THỊ CHI TIẾT SỐ TIỀN */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
          <p className="text-[10px] text-slate-400 font-semibold">Đã thu</p>
          <p className="text-sm font-black text-slate-900 font-mono mt-0.5">
            {fmt(paidTotal)}
          </p>
        </div>
        <div className="bg-rose-50 border border-rose-100/60 rounded-xl p-3">
          <p className="text-[10px] text-rose-400 font-semibold">Tồn đọng</p>
          <p className="text-sm font-black text-rose-700 font-mono mt-0.5">
            {fmt(overdueTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}
