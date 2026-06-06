"use client";

import React from "react";
import {
  Home,
  Users,
  AlertTriangle,
  TrendingUp,
  Clock,
  ShieldAlert,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

export default function DanjinDashboard() {
  // Mockup dữ liệu biểu đồ phân tích 6 tháng thực tế năm 2026
  const revenueChartData = [
    { label: "T12/25", amount: "190M", height: 50 },
    { label: "T01/26", amount: "210M", height: 60 },
    { label: "T02/26", amount: "225M", height: 70 },
    { label: "T03/26", amount: "245M", height: 85 },
    { label: "T04/26", amount: "240M", height: 80 },
    { label: "T05/26", amount: "258M", height: 95 },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-slate-50/20 min-h-screen antialiased selection:bg-indigo-50">
      {/* 1. TUYẾN ĐẦU: BANNER WELCOME & METRICS TIME */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-4 select-none">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Trung tâm điều hành Danjin BMS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Hệ thống phân tích hiệu suất lấp đầy phòng, kiểm soát dòng tiền thu
            hộ và vận hành nội khu.
          </p>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium bg-white border border-slate-200/60 px-3 py-1.5 rounded-lg shadow-2xs">
          <Clock size={13} className="text-slate-400 stroke-[1.8]" />
          <span>
            Đối soát dòng tiền:{" "}
            <span className="font-mono font-bold text-slate-700">
              16:49 - 18/05/2026
            </span>
          </span>
        </div>
      </div>

      {/* 2. TUYẾN HAI: GRID STATS CARDS LUXURY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        {/* Card 1: Tổng số phòng & Tỷ lệ lấp đầy */}
        <Card className="group relative overflow-hidden rounded-[20px] border border-slate-200/60 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all hover:shadow-md hover:-translate-y-0.5">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shadow-2xs text-slate-500">
                <Home className="w-4 h-4 stroke-[1.75]" />
              </div>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[9px] font-bold rounded"
              >
                LẤP ĐẦY 78%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Hiện trạng quỹ phòng
              </p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-bold text-slate-900 font-sans leading-none">
                  7
                </span>
                <span className="text-xs font-medium text-slate-400">
                  / 9 căn hộ
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-2">
                Còn{" "}
                <span className="text-amber-600 font-bold font-mono">08</span>{" "}
                phòng trống sẵn sàng đón khách
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Tổng số nhân khẩu/Cư dân cư trú */}
        <Card className="group relative overflow-hidden rounded-[20px] border border-slate-200/60 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all hover:shadow-md hover:-translate-y-0.5">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shadow-2xs text-slate-500">
                <Users className="w-4 h-4 stroke-[1.75]" />
              </div>
              <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp size={12} /> +4 tháng này
              </div>
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Hồ sơ nhân khẩu
              </p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-bold text-slate-900 font-sans leading-none">
                  11
                </span>
                <span className="text-xs font-medium text-slate-400">
                  cư dân
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-2">
                <span className="text-blue-500 font-bold font-mono">98%</span>{" "}
                đã hoàn tất khai báo tạm trú
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Công nợ hóa đơn tồn đọng nguy hiểm */}
        <Card className="group relative overflow-hidden rounded-[20px] border border-slate-200/60 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all hover:shadow-md hover:-translate-y-0.5">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-100/50 shadow-2xs text-rose-500">
                <ShieldAlert className="w-4 h-4 stroke-[1.75]" />
              </div>
              <Badge
                variant="outline"
                className="bg-rose-50 text-rose-700 border-rose-100 text-[9px] font-bold rounded"
              >
                TREO CÔNG NỢ
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Hóa đơn quá hạn thu
              </p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-bold text-rose-600 font-sans leading-none">
                  0
                </span>
                <span className="text-xs font-medium text-slate-400">
                  căn hộ
                </span>
              </div>
              <p className="text-[11px] text-rose-500 font-semibold mt-2 flex items-center gap-1">
                <AlertTriangle size={11} className="stroke-2" /> Cần gửi tin
                nhắn nhắc nợ ngay
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: KING CARD - DÒNG TIỀN DOANH THU THỰC THU TẬP TRUNG */}
        <Card className="group relative overflow-hidden rounded-[20px] border-none bg-slate-900 shadow-[0_10px_30px_-6px_rgba(15,23,42,0.12)] transition-all hover:scale-[1.01]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
          <CardContent className="p-5 relative z-10">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 text-indigo-300">
                <DollarSign className="w-4 h-4 stroke-2" />
              </div>
              <span className="text-[9px] font-bold tracking-wider text-indigo-300 uppercase bg-white/10 px-2 py-0.5 rounded border border-white/5">
                MỤC TIÊU THÁNG
              </span>
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Doanh thu tạm tính kì này
              </p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-white font-sans leading-none">
                  23.716.000đ
                </span>
                {/* <span className="text-xs font-bold text-indigo-400 uppercase italic">
                  triệuđ
                </span> */}
              </div>

              {/* Thanh đo lường Target tài chính thực tế */}
              <div className="mt-3 flex items-center gap-2 select-none">
                <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-linear-to-r from-indigo-500 to-violet-400 w-[78%]" />
                </div>
                <span className="text-[9px] font-bold font-mono text-indigo-400 shrink-0">
                  Target 300M
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. TUYẾN BA: GRID LAYOUT HAI CỘT ĐỐI XỨNG (BIỂU ĐỒ & LOG VẬN HÀNH) */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
        {/* Cột trái (4 phần): Biểu đồ doanh thu dẹt mượt mà */}
        <Card className="lg:col-span-4 rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <CardHeader className="border-b border-slate-100 py-3.5 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Xu hướng tăng trưởng tài chính (6 tháng)
              </CardTitle>
              <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 font-mono">
                Đơn vị: Triệu VND
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-5 select-none">
            <div className="h-64 flex items-end justify-around pb-2 pt-8 px-2 relative border-b border-slate-100">
              {revenueChartData.map((bar, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col items-center gap-2.5 w-full max-w-10 h-full justify-end"
                >
                  {/* Tooltip nhỏ hiển thị số tiền chính xác khi hover vào cột */}
                  <div className="absolute -top-4 bg-slate-900 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm pointer-events-none z-20">
                    {bar.amount}
                  </div>

                  {/* Cột bar chart phẳng mảnh dẹt */}
                  <div
                    style={{ height: `${bar.height}%` }}
                    className="w-full bg-slate-100 hover:bg-slate-900 rounded-t-md transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    {i === revenueChartData.length - 1 && (
                      <div className="absolute inset-0 bg-slate-900 animate-in fade-in duration-500" />
                    )}
                  </div>

                  <span className="text-[10px] font-medium text-slate-400 font-mono shrink-0">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cột phải (3 phần): Nhật ký sự cố biến động vận hành thời gian thực */}
        <Card className="lg:col-span-3 rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <CardHeader className="border-b border-slate-100 py-3.5 px-5">
            <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Sự cố và Luồng hoạt động nội khu
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-4">
              {[
                {
                  room: "P.201",
                  action: "Đã khớp ủy nhiệm chi tiền phòng T05",
                  time: "2 phút trước",
                  badge: (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 rounded text-[9px] font-semibold h-4.5 shadow-none cursor-default">
                      DÒNG TIỀN
                    </Badge>
                  ),
                  style: "before:bg-emerald-500",
                },
                {
                  room: "P.405",
                  action: "Yêu cầu sửa điều hòa nhảy aptomat liên tục",
                  time: "1 giờ trước",
                  badge: (
                    <Badge className="bg-rose-50 text-rose-700 border-rose-100 rounded text-[9px] font-semibold h-4.5 shadow-none cursor-default">
                      NGUY HIỂM
                    </Badge>
                  ),
                  style: "before:bg-rose-500",
                },
                {
                  room: "P.102",
                  action: "Hệ thống tự động chốt kỳ hạn hợp đồng",
                  time: "3 giờ trước",
                  badge: (
                    <Badge className="bg-slate-100 text-slate-600 border-slate-200/50 rounded text-[9px] font-semibold h-4.5 shadow-none cursor-default">
                      PHÁP LÝ
                    </Badge>
                  ),
                  style: "before:bg-slate-400",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-start justify-between gap-4 pb-3.5 border-b border-slate-100/60 last:border-0 last:pb-0 relative pl-3.5 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[2.5px] ${item.style} before:rounded-r`}
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 font-mono leading-none">
                        {item.room}
                      </span>
                      {item.badge}
                    </div>
                    <p className="text-xs font-medium text-slate-500 truncate pt-0.5">
                      {item.action}
                    </p>
                  </div>

                  <span className="text-[10px] font-medium text-slate-400 font-mono shrink-0 pt-0.5">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
