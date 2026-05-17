"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Eye,
  MoreHorizontal,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  Download,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";

const CONTRACT_DATA = [
  {
    id: "HD-2026-001",
    room: "101",
    tower: "Danjin Block A",
    tenant: "Nguyễn Văn Anh",
    avatar: "https://github.com/shadcn.png",
    startDate: "2026-01-10",
    endDate: "2027-01-10",
    deposit: 4500000,
    rent: 4500000,
    status: "active",
    paymentStatus: "paid",
  },
  {
    id: "HD-2026-002",
    room: "202",
    tower: "Danjin Block A",
    tenant: "Trần Thị Bình",
    avatar: "",
    startDate: "2026-02-15",
    endDate: "2026-06-15", // Sắp hết hạn dựa trên mốc thời gian hiện tại tháng 5/2026
  },
  {
    id: "HD-2025-089",
    room: "305",
    tower: "Danjin Block B",
    tenant: "Lê Văn Cường",
    avatar: "",
    startDate: "2025-05-01",
    endDate: "2026-05-01", // Đã hết hạn
    deposit: 3500000,
    rent: 3500000,
    status: "expired",
    paymentStatus: "paid",
  },
];

export default function ContractsPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");

  // Hàm tính toán tiến độ thời gian hợp đồng thực tế từ dữ liệu ngày
  const calculateTimeProgress = (start: string, end: string) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const currentDate = new Date("2026-05-17").getTime(); // Đồng bộ theo mốc thời gian thực tế hệ thống hiện tại

    if (endDate <= startDate) return 0;
    const totalDuration = endDate - startDate;
    const elapsed = currentDate - startDate;

    return Math.min(
      Math.max(Math.round((elapsed / totalDuration) * 100), 0),
      100,
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-slate-50/20 min-h-screen antialiased selection:bg-indigo-50">
      {/* 1. Header tác vụ phẳng dẹt sang trọng */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Hợp đồng thuê & Pháp lý căn hộ
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Quản lý chu kỳ thuê, bảo lưu tiền cọc và biểu mẫu bàn giao cơ sở vật
            chất tòa nhà.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          <Button
            variant="outline"
            className="h-9 px-3 text-xs font-medium border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-2xs"
          >
            <Download className="mr-1.5 h-3.5 w-3.5 text-slate-400 stroke-[1.75]" />{" "}
            Xuất file báo cáo
          </Button>
          <Button className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-2xs flex gap-1.5 active:scale-[0.99]">
            <Plus className="h-4 w-4 stroke-[2]" />
            Khởi tạo hợp đồng
          </Button>
        </div>
      </div>

      {/* 2. Stats Row: Phẳng hoàn toàn, nén dữ liệu chặt chẽ */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Đang hiệu lực",
            value: "38",
            trend: "+2 tháng này",
            color: "text-emerald-700 bg-emerald-50/60 border-emerald-100/50",
          },
          {
            label: "Sắp hết hạn (30 ngày)",
            value: "05",
            trend: "Cần xử lý",
            color: "text-amber-700 bg-amber-50/60 border-amber-100/50",
          },
          {
            label: "Chờ bàn giao phòng",
            value: "02",
            trend: "Trong tuần",
            color: "text-blue-700 bg-blue-50/60 border-blue-100/50",
          },
          {
            label: "Tổng tiền cọc quỹ",
            value: "185.5M",
            trend: "VND giữ hộ",
            color: "text-slate-700 bg-slate-100/60 border-slate-200/50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center justify-between min-h-[76px]"
          >
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-slate-400">{stat.label}</p>
              <h4 className="text-xl font-bold text-slate-900 font-sans leading-none">
                {stat.value}
              </h4>
            </div>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${stat.color}`}
            >
              {stat.trend}
            </span>
          </div>
        ))}
      </div>

      {/* 3. Unified Control Bar: Đồng bộ chiều cao h-10 dẹt lì */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-800 transition-colors stroke-[1.5]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã HĐ, số phòng hoặc tên cư dân đại diện..."
            className="w-full pl-9 pr-4 h-10 bg-white border border-slate-200/80 focus-visible:border-slate-400 focus-visible:ring-0 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5 shrink-0 justify-end w-full sm:w-auto">
          <Button
            variant="outline"
            className="h-10 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold px-3.5 gap-1.5 bg-white shadow-2xs hover:bg-slate-50"
          >
            <Filter className="w-3.5 h-3.5 text-slate-400 stroke-[1.75]" />
            <span>Bộ lọc nâng cao</span>
          </Button>

          {/* Cụm chuyển đổi View mode tinh xảo */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/40 h-10 items-center">
            <button
              onClick={() => setViewMode("list")}
              className={`h-8 px-2.5 rounded-md transition-all flex items-center justify-center ${viewMode === "list" ? "bg-white shadow-2xs text-slate-900" : "text-slate-400 hover:text-slate-700"}`}
            >
              <List className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`h-8 px-2.5 rounded-md transition-all flex items-center justify-center ${viewMode === "grid" ? "bg-white shadow-2xs text-slate-900" : "text-slate-400 hover:text-slate-700"}`}
            >
              <LayoutGrid className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Data Table UI phẳng tràn viền */}
      <div className="rounded-xl border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.01),0_12px_24px_-4px_rgba(15,23,42,0.03)] bg-white overflow-hidden flex flex-col min-h-[420px]">
        <Table>
          <TableHeader className="bg-slate-50/40 border-b border-slate-100/80 select-none">
            <TableRow className="hover:bg-transparent">
              {/* <TableHead className="w-[5%] pl-5 py-3 text-center">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-slate-900 focus:ring-0 accent-slate-900 cursor-pointer h-3.5 w-3.5"
                />
              </TableHead> */}
              <TableHead className="w-[15%] py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Mã hợp đồng
              </TableHead>
              <TableHead className="w-[12%] py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Vị trí căn hộ
              </TableHead>
              <TableHead className="w-[28%] py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Cư dân ký kết / Bảo lưu cọc
              </TableHead>
              <TableHead className="w-[20%] py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Thời hạn chu kỳ thuê phòng
              </TableHead>
              <TableHead className="w-[12%] text-right py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Đơn giá thuê
              </TableHead>
              <TableHead className="w-[13%] text-center py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Tình trạng HĐ
              </TableHead>
              <TableHead className="w-[5%] text-right pr-5 py-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100/60">
            {CONTRACT_DATA.map((item) => {
              const timeProgress = calculateTimeProgress(
                item.startDate,
                item.endDate,
              );
              return (
                <TableRow
                  key={item.id}
                  className="group hover:bg-slate-50/40 transition-colors"
                >
                  {/* <TableCell className="pl-5 py-3.5 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-slate-900 focus:ring-0 accent-slate-900 cursor-pointer h-3.5 w-3.5"
                    />
                  </TableCell> */}

                  {/* Mã HĐ font-mono sắc nét */}
                  <TableCell className="font-mono text-xs font-semibold text-slate-400 py-3.5">
                    {item.id}
                  </TableCell>

                  {/* Vị trí phòng */}
                  <TableCell className="py-3.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-xs font-mono">
                        P.{item.room}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase mt-0.5">
                        {item.tower}
                      </span>
                    </div>
                  </TableCell>

                  {/* Cư dân & Trạng thái cọc */}
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-7.5 h-7.5 border border-slate-100 shadow-2xs rounded-md">
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback className="text-[9px] font-bold bg-slate-50 text-slate-600">
                          {item.tenant.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-800 text-xs tracking-tight truncate mb-0.5">
                          {item.tenant}
                        </span>
                        <PaymentStatusBadge status={item.paymentStatus} />
                      </div>
                    </div>
                  </TableCell>

                  {/* Thời hạn chu kỳ & Thanh tiến độ thời gian thực tế */}
                  <TableCell className="py-3.5">
                    <div className="flex flex-col gap-1.5 max-w-[150px]">
                      <div className="flex items-center justify-between text-[11px] font-medium font-mono text-slate-600">
                        <span>
                          {item.startDate.split("-").reverse().join("/")}
                        </span>
                        <span className="text-slate-400 font-sans px-1">→</span>
                        <span>
                          {item.endDate.split("-").reverse().join("/")}
                        </span>
                      </div>

                      {/* Thanh progress động dựa trên mốc thời gian thực */}
                      <div
                        className="w-full h-[2px] bg-slate-100 rounded-full overflow-hidden relative"
                        title={`Đã trôi qua ${timeProgress}%`}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            item.status === "expired"
                              ? "bg-slate-300"
                              : item.status === "expiring"
                                ? "bg-amber-500"
                                : "bg-slate-900"
                          }`}
                          style={{
                            width: `${item.status === "expired" ? 100 : timeProgress}%`,
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>

                  {/* Đơn giá thuê */}
                  <TableCell className="text-right py-3.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 font-mono text-xs">
                        {Number(item.rent ?? 0).toLocaleString("vi-VN")} đ
                      </span>
                      <span className="text-[9px] font-medium text-slate-400 uppercase tracking-normal mt-0.5">
                        mỗi tháng
                      </span>
                    </div>
                  </TableCell>

                  {/* Tình trạng hợp đồng */}
                  <TableCell className="text-center py-3.5">
                    <StatusBadge status={item.status} />
                  </TableCell>

                  {/* Cụm nút hành động dẹt gọn hàng dọc */}
                  <TableCell className="text-right pr-5 py-3.5">
                    <div className="flex justify-end items-center gap-1 h-7">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md text-xs font-medium"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 stroke-[1.75]" /> Xem
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-7 w-7 p-0 rounded-md opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                          >
                            <MoreHorizontal
                              size={14}
                              className="stroke-[1.75]"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 p-1 rounded-lg shadow-md border border-slate-200/70 bg-white"
                        >
                          <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1.5 select-none">
                            Nghiệp vụ pháp lý
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="my-1 border-slate-100" />
                          <DropdownMenuItem className="gap-2 rounded py-2 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer">
                            <FileText className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />{" "}
                            Xuất bản in hợp đồng (PDF)
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 rounded py-2 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer">
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />{" "}
                            Biên bản giao nhận căn hộ
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1 border-slate-100" />
                          <DropdownMenuItem className="text-rose-600 hover:bg-rose-50/50 font-medium gap-2 rounded py-2 text-xs cursor-pointer">
                            <AlertTriangle className="w-3.5 h-3.5 stroke-[1.5]" />{" "}
                            Thanh lý hợp đồng trước hạn
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* 5. Khối điều hướng phân trang tích hợp mượt mà dưới đáy */}
        <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between shrink-0 select-none">
          <p className="text-xs font-medium text-slate-400">
            Hiển thị{" "}
            <span className="text-slate-800 font-semibold font-mono">
              1 - 3
            </span>{" "}
            trên 45 hồ sơ hợp đồng
          </p>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">
              Trang{" "}
              <span className="text-slate-900 font-semibold font-mono">1</span>{" "}
              / 5
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-md border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all disabled:opacity-40"
                disabled
              >
                <ChevronLeft className="w-3.5 h-3.5 stroke-[1.8]" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-md border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all disabled:opacity-40"
              >
                <ChevronRight className="w-3.5 h-3.5 stroke-[1.8]" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- TINH CHỈNH SUB-COMPONENTS GỌN GÀNG ---

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; class: string; dot: string }> =
    {
      active: {
        label: "Đang hiệu lực",
        class: "bg-emerald-50 text-emerald-700 border-emerald-100/70",
        dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]",
      },
      expiring: {
        label: "Sắp hết hạn",
        class: "bg-amber-50 text-amber-700 border-amber-100/70",
        dot: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]",
      },
      expired: {
        label: "Đã kết thúc",
        class: "bg-slate-50 text-slate-500 border-slate-200/60",
        dot: "bg-slate-400",
      },
    };

  const config = configs[status] || configs.active;

  return (
    <Badge
      variant="outline"
      className={`${config.class} border px-2 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1.5 w-fit mx-auto cursor-default`}
    >
      <span className={`h-1.2 w-1.2 rounded-full ${config.dot}`} />
      {config.label}
    </Badge>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; text: string; dot: string }> =
    {
      paid: {
        label: "Đã giữ cọc",
        text: "text-emerald-600",
        dot: "bg-emerald-500",
      },
      partial: {
        label: "Cọc thiếu",
        text: "text-amber-600",
        dot: "bg-amber-500",
      },
      unpaid: {
        label: "Chưa nộp cọc",
        text: "text-rose-600",
        dot: "bg-rose-500",
      },
    };

  const current = configs[status] || configs.paid;

  return (
    <div className="flex items-center gap-1 text-[10px] font-medium">
      <span className={`h-1 w-1 rounded-full ${current.dot}`} />
      <span className={current.text}>{current.label}</span>
    </div>
  );
}
