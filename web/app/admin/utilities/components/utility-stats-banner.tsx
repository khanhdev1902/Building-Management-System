"use client";

import React from "react";
import {
  Zap,
  Droplets,
  AlertTriangle,
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
      label: "Tiến độ chốt số điện",
      value: electricDone,
      unit: `/ ${totalRooms} phòng`,
      icon: <Zap className="w-3.5 h-3.5 stroke-[1.75]" />,
      color: "bg-amber-500",
      textColor: "text-amber-600 border-amber-100 bg-amber-50/50",
      progressRatio: totalRooms > 0 ? electricDone / totalRooms : 0,
      vacts: 16,
    },
    {
      label: "Tiến độ chốt số nước",
      value: waterDone,
      unit: `/ ${totalRooms} phòng`,
      icon: <Droplets className="w-3.5 h-3.5 stroke-[1.75]" />,
      color: "bg-blue-500",
      textColor: "text-blue-600 border-blue-100 bg-blue-50/50",
      progressRatio: totalRooms > 0 ? waterDone / totalRooms : 0,
      vacts: 16,
    },
    {
      label: "Chỉ số bất thường",
      value: issueCount,
      unit: "ca cảnh báo",
      icon: <AlertTriangle className="w-3.5 h-3.5 stroke-[1.75]" />,
      color: "bg-rose-500",
      textColor: "text-rose-600 border-rose-100 bg-rose-50/50",
      progressRatio: null, // Không dùng thanh tiến độ cho cảnh báo lỗi
      isAlert: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
      {stats.map((s, i) => (
        <Card
          key={i}
          className="group relative border border-slate-200/80 bg-white p-4 rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_24px_-8px_rgba(15,23,42,0.04)] overflow-hidden flex flex-col justify-between min-h-[115px]"
        >
          {/* Lớp phủ sáng mờ radial dịu mắt */}
          <div className="absolute inset-0 bg-radial from-slate-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full w-full space-y-3">
            {/* Tuyến một: Icon Box & Chấm trạng thái tĩnh tinh xảo */}
            <div className="flex justify-between items-center w-full">
              <div
                className={`p-1.5 rounded-lg border shadow-2xs text-slate-500 transition-colors ${s.textColor}`}
              >
                {s.icon}
              </div>
              <span className="flex h-1.5 w-1.5 rounded-full bg-slate-200 group-hover:bg-slate-400 transition-colors" />
            </div>

            {/* Tuyến hai: Số liệu lớn nằm TRÊN, diễn giải nằm DƯỚI */}
            <div className="space-y-0.5 w-full">
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-xl font-bold font-sans tracking-tight leading-none ${s.isAlert && s.value > 0 ? "text-rose-600 animate-pulse" : "text-slate-900"}`}
                >
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

            {/* Tuyến ba: Thanh vạch phân đoạn LED đặc trưng (Đã giảm số vạch xuống 16 cho đỡ rối) */}
            {s.progressRatio !== null ? (
              <div className="pt-1">
                <div className="flex gap-0.5 h-[3px] w-full">
                  {[...Array(s.vacts)].map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-full flex-1 rounded-xs transition-all duration-500 ${
                        idx < s.progressRatio! * s.vacts!
                          ? s.color
                          : "bg-slate-100/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Nếu là mục Bất thường: Thay thanh vạch bằng một dòng text note phụ tinh giản */
              <div className="text-[10px] font-medium text-slate-400 pt-1 border-t border-dashed border-slate-100">
                {s.value > 0
                  ? "Yêu cầu kiểm tra rò rỉ ngay"
                  : "Hệ thống vận hành an toàn"}
              </div>
            )}
          </div>
        </Card>
      ))}

      {/* 4. Thẻ Doanh Thu: Đã được đưa về chuẩn "Máu trắng" SaaS Enterprise */}
      <Card className="group relative border border-slate-200/80 bg-white p-4 rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_24px_-8px_rgba(15,23,42,0.04)] overflow-hidden flex flex-col justify-between min-h-[115px]">
        <div className="absolute inset-0 bg-radial from-indigo-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between h-full w-full space-y-3">
          {/* Tuyến một: Icon Doanh thu & Badge phần trăm tăng trưởng tinh xảo */}
          <div className="flex justify-between items-center w-full">
            <div className="p-1.5 rounded-lg border border-indigo-100 bg-indigo-50/50 text-indigo-600 shadow-2xs">
              <ReceiptText className="w-3.5 h-3.5 stroke-[1.75]" />
            </div>
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-emerald-100 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold">
              <TrendingUp className="w-2.5 h-2.5" />
              <span>+12.5%</span>
            </div>
          </div>

          {/* Tuyến hai: Số tiền dự thu */}
          <div className="space-y-0.5 w-full">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-sans text-slate-900 tracking-tight leading-none">
                {estimatedRevenue}
              </span>
              <span className="text-[10px] font-semibold text-indigo-600 font-mono uppercase tracking-tight">
                Triệu đ
              </span>
            </div>
            <p className="text-xs font-medium text-slate-400 tracking-tight">
              Doanh thu dịch vụ dự kiến
            </p>
          </div>

          {/* Tuyến ba: Đồng bộ thanh tiến độ vạch LED màu Indigo sang trọng */}
          <div className="pt-1">
            <div className="flex gap-0.5 h-[3px] w-full">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 rounded-xs transition-all duration-500 ${
                    i < 11
                      ? "bg-indigo-500 shadow-[0_0_4px_rgba(99,102,241,0.3)]"
                      : "bg-slate-100/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
