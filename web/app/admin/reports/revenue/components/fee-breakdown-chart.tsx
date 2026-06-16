/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/revenue/components/fee-breakdown-chart.tsx
"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { FEE_BREAKDOWN, FEE_COLORS } from "../data";

export default function FeeBreakdownChart() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5 h-full flex flex-col justify-between">
      {/* TIÊU ĐỀ */}
      <div className="mb-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Phân rã cơ cấu phí
        </h3>
        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
          Nguồn thu lũy kế (Triệu VND)
        </p>
      </div>

      {/* ĐỒ THỊ VÀ CHÚ THÍCH */}
      <div className="flex gap-4 items-center justify-between">
        {/* Biểu đồ Donut */}
        <div className="h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={FEE_BREAKDOWN}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={68}
                paddingAngle={2}
                dataKey="value"
              >
                {FEE_BREAKDOWN.map((_, i) => (
                  <Cell key={i} fill={FEE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                formatter={(v: any) => {
                  if (v === undefined || v === null) return ["0M đ", ""];
                  return [`${v}M đ`, ""];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Danh sách nhãn danh mục phí */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-2">
          {FEE_BREAKDOWN.map((f, i) => (
            <div key={f.name} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-sm shrink-0"
                style={{ background: FEE_COLORS[i] }}
              />
              <span className="text-[10px] text-slate-500 truncate flex-1 font-medium">
                {f.name}
              </span>
              <span className="text-[10px] font-bold text-slate-800 font-mono">
                {f.value}M
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
