"use client";

import React from "react";
import {
  Zap,
  Droplets,
  AlertCircle,
  ReceiptText,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";

interface StatsProps {
  totalRooms: number;
  electricDone: number;
  waterDone: number;
  issueCount: number;
  estimatedRevenue: string;
}

export const UtilityStatsBanner = ({
  totalRooms = 120,
  electricDone = 45,
  waterDone = 38,
  issueCount = 8,
  estimatedRevenue = "142.5",
}: StatsProps) => {
  const stats = [
    {
      label: "Chỉ số điện",
      value: electricDone,
      total: totalRooms,
      icon: <Zap className="w-3.5 h-3.5" />,
      color: "bg-amber-500",
      textColor: "text-amber-500",
      accent: "bg-amber-500/10",
    },
    {
      label: "Chỉ số nước",
      value: waterDone,
      total: totalRooms,
      icon: <Droplets className="w-3.5 h-3.5" />,
      color: "bg-blue-500",
      textColor: "text-blue-500",
      accent: "bg-blue-500/10",
    },
    {
      label: "Bất thường",
      value: issueCount,
      total: null,
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      color: "bg-red-500",
      textColor: "text-red-500",
      accent: "bg-red-500/10",
      isAlert: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-1">
      {stats.map((s, i) => (
        <Card
          key={i}
          className="group relative border border-slate-200/60 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-xl transition-all duration-200 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden"
        >
          <div className="p-3.5">
            <div className="flex justify-between items-center mb-2.5">
              <div className={`flex items-center gap-2`}>
                <span className={`${s.textColor}`}>{s.icon}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  {s.label}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full ${s.color} opacity-75`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-1.5 w-1.5 ${s.color}`}
                  ></span>
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span
                className={`text-xl font-black tabular-nums tracking-tight ${s.isAlert ? "text-red-600" : "text-slate-900"}`}
              >
                {s.value}
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase">
                {s.total ? `/ ${s.total} phòng` : "phòng cần kiểm tra"}
              </span>
            </div>

            {s.total && (
              <div className="mt-3">
                <div className="flex gap-0.5 h-1">
                  {[...Array(20)].map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-full flex-1 rounded-sm transition-colors duration-500 ${
                        idx < (s.value / s.total) * 20
                          ? s.color
                          : "bg-slate-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}

      {/* Thẻ Doanh Thu - Dark Mode Pro */}
      <Card className="group relative border-none bg-[#09090b] rounded-xl shadow-lg overflow-hidden transition-all hover:bg-[#121217]">
        <div className="p-3.5 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <ReceiptText className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                Doanh thu
              </span>
            </div>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
              <span className="text-[8px] font-bold text-emerald-500">
                +12.5%
              </span>
            </div>
          </div>

          <div className="my-1.5">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white tracking-tighter tabular-nums leading-none">
                {estimatedRevenue}
              </span>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">
                Triệu VNĐ
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5">
            <div className="flex justify-between items-center h-1 gap-0.5">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 rounded-sm ${i < 8 ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" : "bg-white/5"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
