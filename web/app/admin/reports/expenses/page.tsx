"use client";

import React from "react";
import {
  Plus,
  Search,
  FileText,
  Zap,
  Wrench,
  CalendarDays,
  Droplets,
  Wifi,
  Trash2,
  FileDown,
  ArrowUpRight,
  TrendingDown,
  Percent,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

// Cơ cấu chi phí đầu vào thực tế của chuỗi CCMN Danjin năm 2026
const opexCategoryData = [
  { name: "Điện tổng tòa nhà (EVN)", value: 62000000, color: "#0f172a" }, // Đen sẫm chủ đạo
  { name: "Nước sạch tổng", value: 18500000, color: "#3b82f6" },
  {
    name: "Hạ tầng Internet & Hệ thống Cam",
    value: 12000000,
    color: "#10b981",
  },
  { name: "Bảo trì & Khấu hao thiết bị", value: 32000000, color: "#cbd5e1" },
];

export default function ExpensesReport() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-5 bg-slate-50/20 min-h-screen antialiased selection:bg-indigo-50">
      {/* 1. TOP BAR: TIÊU ĐỀ & TÁC VỤ PHẲNG */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-4 select-none">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Quản lý & Kiểm soát Chi phí Vận hành (OPEX)
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Kiểm soát hóa đơn tổng đầu vào, quỹ bảo trì thiết bị và chi phí dịch
            vụ kỹ thuật nội khu.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <Button
            variant="outline"
            className="h-9 text-xs font-semibold border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-2xs rounded-lg flex-1 sm:flex-none"
          >
            <CalendarDays className="mr-1.5 h-3.5 w-3.5 text-slate-400" /> Kỳ
            hạn: T05/2026
          </Button>
          <Button className="h-9 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-2xs flex-1 sm:flex-none">
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Tạo phiếu chi / Hóa đơn đầu
            vào
          </Button>
        </div>
      </div>

      {/* 2. KHỐI THỐNG KÊ BA CHỈ SỐ OPEX FLAT LIỀN MẠCH */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 select-none">
        <div className="bg-white p-4 border border-slate-200/80 rounded-xl flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Tổng chi vận hành kì này
            </span>
            <h4 className="text-xl font-bold text-slate-900 font-sans tracking-tight">
              124,500,000 đ
            </h4>
            <span className="text-[10px] text-rose-600 font-semibold flex items-center gap-0.5">
              <ArrowUpRight size={11} /> Tăng 8.2% so với phụ lục tháng trước
            </span>
          </div>
          <div className="p-2.5 rounded-xl border bg-slate-50 border-slate-100 text-slate-500 shrink-0">
            <FileText size={15} />
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200/80 rounded-xl flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Hạn mức ngân sách tối ưu
            </span>
            <h4 className="text-xl font-bold text-emerald-600 font-sans tracking-tight">
              15,500,000 đ
            </h4>
            <div className="flex items-center gap-1.5 pt-1">
              <div className="w-16 bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[88%]" />
              </div>
              <span className="text-[9px] font-bold text-slate-400 font-mono">
                USED 88%
              </span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl border bg-slate-50 border-slate-100 text-slate-500 shrink-0">
            <Percent size={15} />
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200/80 rounded-xl flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Quỹ bảo trì thiết bị tích lũy
            </span>
            <h4 className="text-xl font-bold text-slate-700 font-sans tracking-tight">
              42,000,000 đ
            </h4>
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5">
              <Wrench size={11} /> 3 hạng mục bảo dưỡng thang máy tuần tới
            </span>
          </div>
          <div className="p-2.5 rounded-xl border bg-slate-50 border-slate-100 text-slate-500 shrink-0">
            <Wrench size={15} />
          </div>
        </div>
      </div>

      {/* 3. GRID HAI CỘT: DONUT BIỂU ĐỒ & SỔ GỐC CHI TIẾT TỪNG MỤC CHI */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
        {/* Cột trái (3 phần): Biểu đồ phân bổ Donut mượt mà, tinh giản */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.01)] p-5 flex flex-col justify-between">
          <div className="space-y-0.5 select-none border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Cơ cấu tỷ trọng OPEX
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">
              Bóc tách phân bổ dòng tiền chi ra trong tháng
            </p>
          </div>

          <div className="h-44 w-full select-none relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={opexCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={72}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {opexCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) =>
                    `${value.toLocaleString("vi-VN")} đ`
                  }
                  contentStyle={{
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    fontSize: "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Tâm Donut hiển thị tổng chi rút gọn */}
            <div className="absolute flex flex-col items-center justify-center select-none pointer-events-none">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Tổng chi
              </span>
              <span className="text-sm font-black text-slate-900 font-mono tracking-tight">
                124.5M
              </span>
            </div>
          </div>

          {/* Custom Legend dẹt phẳng thay thế Legend mặc định thô của Recharts */}
          <div className="space-y-1.5 select-none border-t border-slate-100 pt-3">
            {opexCategoryData.map((item, idx) => (
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
                  {Math.round((item.value / 124500000) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cột phải (4 phần): Sổ gốc chi tiết lịch sử phiếu chi đầu vào tòa nhà */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.01)] p-5 space-y-3.5 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-2.5 select-none">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Nhật ký giải ngân chứng từ
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">
                Danh sách các khoản chi thực tế ra nhà cung cấp hạ tầng
              </p>
            </div>

            <div className="relative w-full sm:w-44 group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-slate-800 stroke-[1.5]" />
              <Input
                placeholder="Tìm mã PC, mục chi..."
                className="pl-7.5 h-7.5 text-[11px] bg-slate-50/50 border-slate-200 focus-visible:border-slate-400 focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <Table>
              <TableHeader className="bg-slate-50/50 border-b border-slate-100/60 select-none">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 pl-2">
                    Hạng mục đối tác
                  </TableHead>
                  <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 font-mono">
                    Ngày chi
                  </TableHead>
                  <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 text-right">
                    Giá trị chi
                  </TableHead>
                  <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 text-center">
                    Trạng thái
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100/50 text-xs">
                {[
                  {
                    id: "PC-0501",
                    title: "Hóa đơn Điện tổng tòa nhà",
                    detail: "EVN Hà Nội • Thu 17,600 kWh tổng",
                    date: "15/05/2026",
                    amount: "62,000,000",
                    status: "Success",
                    icon: <Zap size={13} className="text-amber-500" />,
                  },
                  {
                    id: "PC-0502",
                    title: "Bảo trì định kỳ cụm Thang máy",
                    detail: "Otis Việt Nam • Bảo dưỡng cáp và motor",
                    date: "12/05/2026",
                    amount: "15,000,000",
                    status: "Success",
                    icon: <Wrench size={13} className="text-emerald-500" />,
                  },
                  {
                    id: "PC-0428",
                    title: "Hóa đơn Nước sạch tổng",
                    detail: "Viwasupco • Quét khối lượng m³ đầu vào",
                    date: "28/04/2026",
                    amount: "18,500,000",
                    status: "Success",
                    icon: <Droplets size={13} className="text-blue-500" />,
                  },
                  {
                    id: "PC-0415",
                    title: "Cước đường truyền Internet tổng",
                    detail: "VNPT Hải Âu • Gói hạ tầng Core 1Gbps",
                    date: "15/04/2026",
                    amount: "12,000,000",
                    status: "Pending",
                    icon: <Wifi size={13} className="text-sky-500" />,
                  },
                  {
                    id: "PC-0410",
                    title: "Thông hút bể phốt khối hầm",
                    detail: "Môi trường Đô thị xanh • Xử lý định kỳ",
                    date: "10/04/2026",
                    amount: "17,000,000",
                    status: "Canceled",
                    icon: <Trash2 size={13} className="text-slate-500" />,
                  },
                ].map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-slate-50/30 border-none group"
                  >
                    <TableCell className="py-2.5 pl-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-800 text-xs block truncate max-w-[180px]">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-sans font-medium mt-0.5 truncate max-w-[185px]">
                            {item.detail}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 font-mono py-2.5">
                      {item.date}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-slate-900 py-2.5">
                      {item.amount}đ
                    </TableCell>
                    <TableCell className="text-center py-2.5">
                      <Badge
                        variant="outline"
                        className={`border-none text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          item.status === "Success"
                            ? "bg-emerald-50 text-emerald-700"
                            : item.status === "Pending"
                              ? "bg-amber-50 text-amber-700 animate-pulse"
                              : "bg-slate-100 text-slate-400 line-through"
                        }`}
                      >
                        {item.status === "Success"
                          ? "Đã chi tiền"
                          : item.status === "Pending"
                            ? "Chờ duyệt chi"
                            : "Đã hủy bỏ"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* CHÂN ĐIỀU HƯỚNG PHÂN TRANG GẮN BẢNG */}
          <div className="px-1 py-2 border-t border-slate-100 bg-white flex items-center justify-between shrink-0 border-none mt-auto select-none">
            <p className="text-[10px] font-medium text-slate-400">
              Hiển thị{" "}
              <span className="text-slate-800 font-semibold font-mono">5</span>{" "}
              trên 36 phiếu chi giải ngân
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 rounded-md border-slate-200 text-slate-600 bg-white disabled:opacity-40"
                disabled
              >
                <ChevronLeft className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 rounded-md border-slate-200 text-slate-600 bg-white"
              >
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
