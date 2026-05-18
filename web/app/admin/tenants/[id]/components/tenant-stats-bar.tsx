"use client";

import React from "react";

interface TenantStatsBarProps {
  deposit: string;
  debt: string;
  expiryDays: string;
}

export function TenantStatsBar({
  deposit,
  debt,
  expiryDays,
}: TenantStatsBarProps) {
  const metrics = [
    {
      label: "Bảo lưu đặt cọc quỹ phòng",
      value: deposit,
      unit: "VND",
      color: "text-slate-900",
    },
    {
      label: "Số dư công nợ chưa thu",
      value: debt,
      unit: "VND",
      color: "text-rose-600 font-mono",
    },
    {
      label: "Thời hạn chu kỳ thuê còn lại",
      value: expiryDays,
      unit: "Ngày",
      color: "text-amber-600 font-mono",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 select-none">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
        >
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {m.label}
          </p>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-bold tracking-tight ${m.color}`}>
              {m.value}
            </span>
            <span className="text-[10px] font-bold text-slate-400 font-sans">
              {m.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
