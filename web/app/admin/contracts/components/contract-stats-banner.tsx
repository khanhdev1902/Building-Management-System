"use client";

import React from "react";
import { FileText, AlertCircle, Clock, ShieldCheck } from "lucide-react";

interface ContractStatsProps {
  activeCount?: number;
  expiringCount?: number;
  pendingCount?: number;
  totalDeposit?: string;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export function ContractStatsBanner({
  activeCount = 38,
  expiringCount = 5,
  pendingCount = 2,
  totalDeposit = "185.5M",
  activeFilter = "all",
  onFilterChange = () => {},
}: ContractStatsProps) {
  const stats = [
    {
      key: "ACTIVE",
      label: "Hợp đồng hiệu lực",
      value: activeCount,
      trend: "+2 tháng này",
      icon: <ShieldCheck size={14} className="stroke-[1.75]" />,
      style: "border-slate-200/80 hover:border-emerald-300",
      activeStyle:
        "border-emerald-500 bg-emerald-50/10 ring-1 ring-emerald-500",
      trendStyle: "text-emerald-700 bg-emerald-50 border-emerald-100/50",
    },
    {
      key: "EXPIRING",
      label: "Sắp hết hạn (30 ngày)",
      value: expiringCount,
      trend: "Cần xử lý",
      icon: <Clock size={14} className="stroke-[1.75]" />,
      style: "border-slate-200/80 hover:border-amber-300",
      activeStyle: "border-amber-500 bg-amber-50/10 ring-1 ring-amber-500",
      trendStyle: "text-amber-700 bg-amber-50 border-amber-100/50",
    },
    {
      key: "EXPIRED",
      label: "Đã kết thúc",
      value: pendingCount, // Bạn nhớ check lại biến này nhé, thường EXPIRED thì biến tên kiểu expiredCount sẽ tường minh hơn :v
      trend: "Trong tuần",
      icon: <FileText size={14} className="stroke-[1.75]" />,
      style: "border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/40",
      activeStyle:
        "border-slate-400 bg-slate-50 ring-1 ring-slate-400/80 text-slate-800",
      trendStyle: "text-slate-600 bg-slate-100 border-slate-200/60",
    },
    {
      key: "all", // Mặc định click vào ô tiền cọc sẽ reset về hiển thị tất cả
      label: "Tổng tiền cọc quỹ",
      value: totalDeposit,
      trend: "VND giữ hộ",
      icon: <AlertCircle size={14} className="stroke-[1.75]" />,
      style: "border-slate-200/80 hover:border-slate-400",
      activeStyle: "border-slate-900 bg-slate-50/50 ring-1 ring-slate-900",
      trendStyle: "text-slate-700 bg-slate-100 border-slate-200/60",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full select-none">
      {stats.map((stat) => {
        const isSelected = activeFilter === stat.key;
        return (
          <div
            key={stat.key}
            onClick={() => onFilterChange(isSelected ? "all" : stat.key)}
            className={`p-4 bg-white border rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-between min-h-19 shadow-[0_1px_2px_rgba(0,0,0,0.01)] ${
              isSelected ? stat.activeStyle : stat.style
            }`}
          >
            {/* Khối text thông số nằm bên trái */}
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-slate-400">{stat.label}</p>
              <h4 className="text-xl font-bold text-slate-900 font-sans tracking-tight leading-none">
                {stat.value}
              </h4>
            </div>

            {/* Khối nhãn Badge trạng thái bên phải */}
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded border font-mono ${stat.trendStyle}`}
            >
              {stat.trend}
            </span>
          </div>
        );
      })}
    </div>
  );
}
