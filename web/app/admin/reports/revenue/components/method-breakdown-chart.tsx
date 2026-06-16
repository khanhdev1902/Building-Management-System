/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/revenue/components/method-breakdown-chart.tsx
"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { METHOD_COLORS } from "../data";

interface MethodPieEntry {
  name: string;
  value: number;
}

interface MethodBreakdownChartProps {
  methodPie: MethodPieEntry[];
}

export default function MethodBreakdownChart({
  methodPie,
}: MethodBreakdownChartProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5 h-full flex flex-col justify-between">
      {/* TIÊU ĐỀ */}
      <div className="mb-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Phương thức thanh toán
        </h3>
        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
          Phân rã theo kênh thu thực tế
        </p>
      </div>

      {/* BIỂU ĐỒ & DANH SÁCH CHÚ THÍCH */}
      {methodPie.length === 0 ? (
        <p className="text-xs text-slate-400 py-12 text-center italic">
          Không có dòng tiền đã thu trong kỳ này
        </p>
      ) : (
        <div className="flex gap-4 items-center justify-between">
          {/* Biểu đồ Donut nhỏ */}
          <div className="h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={methodPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {methodPie.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={METHOD_COLORS[entry.name] ?? "#94a3b8"}
                    />
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

          {/* Cột chú thích danh mục bên phải */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-2">
            {methodPie.map((f) => (
              <div key={f.name} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-sm shrink-0"
                  style={{ background: METHOD_COLORS[f.name] ?? "#94a3b8" }}
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
      )}
    </div>
  );
}
