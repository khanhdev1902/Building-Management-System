"use client";

import React from "react";
import { Users, AlertCircle, ShieldAlert, UserCheck } from "lucide-react";

interface TenantStatsCounts {
  total: number;
  active: number;
  expiring: number;
  unverified: number;
}

interface TenantStatsBannerProps {
  statsCounts: TenantStatsCounts;
  statusFilter: string;
  onFilterChange: (status: string) => void;
}

export function TenantStatsBanner({
  statsCounts,
  statusFilter,
  onFilterChange,
}: TenantStatsBannerProps) {
  const stats = [
    {
      key: "all",
      label: "Tổng số cư dân",
      value: statsCounts.total,
      icon: <Users size={15} className="stroke-[1.75]" />,
      style: "border-slate-200/80 hover:border-slate-300",
      activeStyle: "border-slate-900 bg-slate-50/50 ring-1 ring-slate-900",
    },
    {
      key: "active",
      label: "Cư dân đang ở",
      value: statsCounts.active,
      icon: <UserCheck size={15} className="stroke-[1.75]" />,
      style: "border-slate-200/80 hover:border-emerald-300",
      activeStyle:
        "border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500",
    },
    {
      key: "expiring",
      label: "Hợp đồng sắp hết hạn",
      value: statsCounts.expiring,
      icon: <AlertCircle size={15} className="stroke-[1.75]" />,
      style: "border-slate-200/80 hover:border-amber-300",
      activeStyle: "border-amber-500 bg-amber-50/20 ring-1 ring-amber-500",
    },
    {
      key: "unverified",
      label: "Hồ sơ chưa xác minh",
      value: statsCounts.unverified,
      icon: <ShieldAlert size={15} className="stroke-[1.75]" />,
      style: "border-slate-200/80 hover:border-rose-300",
      activeStyle: "border-rose-500 bg-rose-50/20 ring-1 ring-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 w-full select-none">
      {stats.map((stat) => {
        const isSelected = statusFilter === stat.key;
        return (
          <div
            key={stat.key}
            onClick={() => onFilterChange(stat.key)}
            className={`p-4 bg-white border rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-between min-h-19 shadow-[0_1px_2px_rgba(0,0,0,0.01)] ${
              isSelected ? stat.activeStyle : stat.style
            }`}
          >
            {/* Khối text chỉ số bên trái */}
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-slate-400">{stat.label}</p>
              <h4 className="text-xl font-bold text-slate-800 font-sans leading-none">
                {stat.value}
              </h4>
            </div>

            {/* Khối bọc icon dẹt mờ bên phải */}
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100/80 text-slate-400 group-hover:text-slate-700 transition-colors">
              {stat.icon}
            </div>
          </div>
        );
      })}
    </div>
  );
}
