"use client";

import React, { useState, useMemo } from "react";
import {
  Home,
  UserMinus,
  UserPlus,
  Clock,
  ArrowUpRight,
  LayoutGrid,
  History,
  FileDown,
  TrendingUp,
  MoreHorizontal,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

// Dữ liệu biến động tỷ lệ lấp đầy thực tế chuỗi Danjin Tower 2026
const occupancyHistory = [
  { month: "Tháng 12", rate: 85 },
  { month: "Tháng 01", rate: 88 },
  { month: "Tháng 02", rate: 92 },
  { month: "Tháng 03", rate: 95 },
  { month: "Tháng 04", rate: 90 },
  { month: "Tháng 05", rate: 94 }, // Kỳ đối soát tháng 5 hiện tại
];

// Khắc phục: Đưa dữ liệu trạng thái phòng về đúng quy mô chuỗi CCMN (56 phòng tổng)
const statusData = [
  { name: "Đang cư trú", value: 48, color: "#0f172a" }, // Đen sẫm chủ đạo phẳng lì
  { name: "Phòng trống sẵn sàng", value: 6, color: "#cbd5e1" },
  { name: "Khách đã cọc giữ", value: 2, color: "#3b82f6" },
];

export default function OccupancyReport() {
  // Tính tổng số phòng để làm nhãn Donut center động
  const totalRooms = useMemo(
    () => statusData.reduce((acc, item) => acc + item.value, 0),
    [],
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-5 bg-slate-50/20 min-h-screen antialiased selection:bg-indigo-50">
      {/* 1. TOP BAR: TIÊU ĐỀ ĐIỀU HÀNH & TÁC VỤ PHẲNG */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-4 select-none">
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Hiệu suất Lấp đầy & Phân tích Biến động cư dân
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Quản lý tỷ lệ tối ưu hóa quỹ phòng, thống kê luồng
            Check-in/Check-out và dự báo điểm trống công suất.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <Button
            variant="outline"
            className="h-9 text-xs font-semibold border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-2xs rounded-lg flex-1 sm:flex-none"
          >
            <History className="mr-1.5 h-3.5 w-3.5 text-slate-400" /> Sơ đồ dòng
            thời gian trống
          </Button>
          <Button className="h-9 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-2xs flex-1 sm:flex-none">
            <LayoutGrid className="mr-1.5 h-3.5 w-3.5" /> Bản đồ trực quan mặt
            bằng
          </Button>
        </div>
      </div>

      {/* 2. KHỐI THỐNG KÊ METRIC CARDS PHẲNG LÌ, LIỀN MẠCH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        <div className="bg-white p-4 border border-slate-200/80 rounded-xl flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Tỷ lệ lấp đầy quỹ phòng
            </span>
            <h4 className="text-xl font-bold text-slate-900 font-sans tracking-tight">
              94.2%
            </h4>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <TrendingUp size={11} /> +2.4% so với chu kỳ trước
            </span>
          </div>
          <div className="p-2.5 rounded-xl border bg-slate-50 border-slate-100 text-slate-500 shrink-0">
            <Home size={15} />
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200/80 rounded-xl flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Lượt tiếp nhận (Check-in)
            </span>
            <h4 className="text-xl font-bold text-slate-900 font-sans tracking-tight">
              18 nhân khẩu
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">
              8 nhóm ở ghép, 10 cá nhân đơn lẻ
            </span>
          </div>
          <div className="p-2.5 rounded-xl border bg-slate-50 border-slate-100 text-slate-500 shrink-0">
            <UserPlus size={15} />
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200/80 rounded-xl flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Lượt rời đi (Check-out)
            </span>
            <h4 className="text-xl font-bold text-slate-900 font-sans tracking-tight">
              5 hợp đồng
            </h4>
            <span className="text-[10px] text-slate-400 font-mono font-medium">
              Tỷ lệ hao hụt (Churn rate): 1.2%
            </span>
          </div>
          <div className="p-2.5 rounded-xl border bg-slate-50 border-slate-100 text-slate-500 shrink-0">
            <UserMinus size={15} />
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200/80 rounded-xl flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Chu kỳ lưu trú trung bình
            </span>
            <h4 className="text-xl font-bold text-slate-900 font-sans tracking-tight">
              6.2 tháng
            </h4>
            <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5">
              Tốc độ tái lấp đầy phòng trống cực nhanh
            </span>
          </div>
          <div className="p-2.5 rounded-xl border bg-slate-50 border-slate-100 text-slate-500 shrink-0">
            <Clock size={15} />
          </div>
        </div>
      </div>

      {/* 3. GRID HAI CỘT ĐỐI XỨNG: ĐỒ THỊ AREA VÀ ĐỒ THỊ DONUT HIỆN TRẠNG */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
        {/* Cột trái (4 phần): Đồ thị vùng Area xu hướng 6 tháng thanh mảnh */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.01)] p-5 space-y-4">
          <div className="space-y-0.5 select-none">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Đường biên biến động công suất khai thác phòng
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">
              Biểu diễn độ ổn định lấp đầy của tòa nhà xuyên suốt chu kỳ nửa năm
              qua
            </p>
          </div>
          <div className="h-64 w-full select-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={occupancyHistory}
                margin={{ top: 10, right: 5, left: -22, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.06} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="month"
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
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "11px",
                  }}
                  formatter={(value) => [`${value}%`, "Hiệu suất lấp đầy"]}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#0f172a"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRate)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cột phải (3 phần): Đồ thị hình bánh Donut hiện trạng phẳng, dẹt lì */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.01)] p-5 flex flex-col justify-between">
          <div className="space-y-0.5 select-none border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Cơ cấu phân bổ danh mục phòng
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">
              Trạng thái thời gian thực của quỹ căn hộ nội khu
            </p>
          </div>

          <div className="h-40 w-full select-none relative flex items-center justify-center my-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={55}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(val: any) => `${val} căn hộ`}
                  contentStyle={{ borderRadius: "6px", fontSize: "11px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Tâm Donut hiển thị tổng số lượng phòng thực tế */}
            <div className="absolute flex flex-col items-center justify-center select-none pointer-events-none">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Mặt bằng
              </span>
              <span className="text-sm font-black text-slate-900 font-mono tracking-tight">
                {totalRooms} Căn
              </span>
            </div>
          </div>

          {/* Danh sách nhãn Custom phẳng mịn thay thế Legend mặc định */}
          <div className="space-y-1.5 select-none border-t border-slate-100 pt-3">
            {statusData.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-[11px] font-medium text-slate-500"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate text-slate-600">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-800 shrink-0">
                  {item.value} phòng (
                  {Math.round((item.value / totalRooms) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. CHÂN TRANG: BẢNG THEO DÕI BIẾN ĐỘNG SẮP TRỐNG (CHURN MATRIX) THỰC CHIẾN */}
      <div className="rounded-xl border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white overflow-hidden flex flex-col min-h-60">
        <div className="p-4 border-b border-slate-100 select-none">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Hợp đồng tạm trú sắp đáo hạn hành chính (30 ngày tới)
          </h3>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
            Danh sách chủ hộ cần ban quản lý liên hệ đàm phán chu kỳ gia hạn phụ
            lục mới hoặc chuẩn bị phôi tìm khách thế phòng
          </p>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/40 border-b border-slate-100/80 select-none">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider py-2 pl-4 w-[15%]">
                Vị trí phòng
              </TableHead>
              <TableHead className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider py-2 w-[20%]">
                Chủ thể đứng tên hợp đồng
              </TableHead>
              <TableHead className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider py-2 font-mono w-[15%]">
                Mã chứng từ
              </TableHead>
              <TableHead className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider py-2 w-[15%]">
                Ngày hết hiệu lực
              </TableHead>
              <TableHead className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider py-2 w-[20%]">
                Lý do & Tình trạng đàm phán
              </TableHead>
              <TableHead className="w-10 py-2 pr-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100/60 text-xs">
            {[
              {
                room: "102",
                name: "Trần Thị Bảo",
                code: "HD-2026-002",
                end: "10/05/2026",
                status: "Chờ phản hồi phụ lục",
                trend: "Có thể rời đi",
                reason: "Hết hạn kì thực tập, quay lại trường",
              },
              {
                room: "204",
                name: "Hoàng Thu Thảo",
                code: "HD-2026-014",
                end: "05/11/2026",
                status: "Đồng ý ký tiếp 6 tháng",
                trend: "Ở tiếp",
                reason: "Gia hạn chu kỳ đi làm cố định",
              },
              {
                room: "401",
                name: "Vũ Hải Đăng",
                code: "HD-2026-009",
                end: "20/06/2026",
                status: "Chưa liên hệ đối soát",
                trend: "Chưa xác định",
                reason: "Chưa kết nối đàm phán",
              },
              {
                room: "104",
                name: "Đặng Thị Mai",
                code: "HD-2025-081",
                end: "15/04/2026",
                status: "Yêu cầu thanh lý bàn giao",
                trend: "Sắp trống",
                reason: "Di chuyển công tác vào TP.HCM",
              },
            ].map((item, idx) => (
              <TableRow
                key={idx}
                className="hover:bg-slate-50/30 border-none group"
              >
                <TableCell className="font-bold text-slate-800 font-mono py-3 pl-4">
                  P.{item.room}
                </TableCell>
                <TableCell className="font-semibold text-slate-700 py-3">
                  {item.name}
                </TableCell>
                <TableCell className="font-mono text-slate-400 py-3">
                  {item.code}
                </TableCell>
                <TableCell className="text-slate-500 font-mono py-3">
                  {item.end}
                </TableCell>

                {/* Cột Lý do & Tình trạng đàm phán bọc text mờ tinh xảo */}
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 select-none ${
                        item.trend === "Ở tiếp"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.trend === "Sắp trống"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.trend}
                    </span>
                    <span
                      className="text-slate-400 font-medium truncate max-w-[190px]"
                      title={item.reason}
                    >
                      {item.reason}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-right pr-4 py-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-slate-300 opacity-0 group-hover:opacity-100 rounded-md"
                  >
                    <MoreHorizontal size={13} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
