// src/app/revenue/components/revenue-trend-chart.tsx
"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartEntry, ViewMode } from "../types/revenue.type";

interface RevenueTrendChartProps {
  chartData: ChartEntry[];
  chartTitle: string;
  periodLabel: string;
  viewMode: ViewMode;
}

export default function RevenueTrendChart({
  chartData,
  chartTitle,
  periodLabel,
  viewMode,
}: RevenueTrendChartProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5 space-y-3 h-full">
      {/* TIÊU ĐỀ ĐỒ THỊ */}
      <div>
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Xu hướng dòng tiền — {chartTitle}
        </h3>
        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
          Thực thu & nợ đọng lũy kế (Đơn vị: Triệu VND) · Bộ lọc: {periodLabel}
        </p>
      </div>

      {/* CHÚ THÍCH MÀU (LEGEND) */}
      <div className="flex gap-4 text-[10px] text-slate-500 font-bold select-none">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm bg-slate-900 inline-block" /> Thực
          thu
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm bg-rose-300 inline-block" /> Nợ
          đọng
        </span>
      </div>

      {/* VÙNG ĐỒ THỊ RECHARTS */}
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="label"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
            />
            <YAxis
              fontSize={10}
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              tickFormatter={(v) => `${v}M`}
            />
            <Tooltip
              cursor={{ fill: "rgba(241,245,249,0.5)" }}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 11,
              }}
              formatter={(value, name) => {
                return [
                  `${Number(value).toLocaleString()} M đ`,
                  name === "revenue" ? "Thực thu" : "Nợ đọng",
                ];
              }}
            />

            <Bar
              dataKey="revenue"
              fill="#0f172a"
              radius={[3, 3, 0, 0]}
              barSize={viewMode === "month" ? 10 : 18}
              name="revenue"
            />
            <Bar
              dataKey="debt"
              fill="#fca5a5"
              radius={[3, 3, 0, 0]}
              barSize={viewMode === "month" ? 10 : 18}
              name="debt"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
