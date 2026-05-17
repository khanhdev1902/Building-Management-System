"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Phone,
  Mail,
  MessageCircle,
  UserCheck,
  UserMinus,
  ShieldCheck,
  Download,
  ExternalLink,
  History,
  AlertCircle,
  Users,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
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

const TENANTS = [
  {
    id: "TEN-1024",
    name: "Nguyễn Văn Anh",
    email: "anhnv@gmail.com",
    phone: "0987 654 321",
    room: "101",
    joinDate: "15 Jan, 2026",
    status: "active",
    avatar: "https://github.com/shadcn.png",
    identityVerified: true,
    contractEnd: "15 Jan, 2027",
  },
  {
    id: "TEN-1025",
    name: "Trần Thị Bảo",
    email: "baott@yahoo.com",
    phone: "0912 333 444",
    room: "102",
    joinDate: "10 Feb, 2026",
    status: "expiring",
    avatar: "",
    identityVerified: false,
    contractEnd: "10 May, 2026",
  },
  {
    id: "TEN-0982",
    name: "Lê Minh Công",
    email: "congl@outlook.com",
    phone: "0345 111 222",
    room: "201",
    joinDate: "01 Dec, 2025",
    status: "inactive",
    avatar: "",
    identityVerified: true,
    contractEnd: "01 Dec, 2026",
  },
];

export default function TenantsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'active' | 'expiring' | 'unverified'

  // Bộ lọc dữ liệu thông minh phối hợp search và thẻ chỉ số active
  const filteredTenants = useMemo(() => {
    return TENANTS.filter((tenant) => {
      const matchesSearch =
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.phone.includes(searchTerm);

      if (!matchesSearch) return false;

      if (statusFilter === "all") return true;
      if (statusFilter === "unverified") return !tenant.identityVerified;
      return tenant.status === statusFilter;
    });
  }, [searchTerm, statusFilter]);

  // Đếm số lượng thực tế để đẩy lên thẻ thống kê
  const statsCounts = useMemo(
    () => ({
      total: TENANTS.length,
      active: TENANTS.filter((t) => t.status === "active").length,
      expiring: TENANTS.filter((t) => t.status === "expiring").length,
      unverified: TENANTS.filter((t) => !t.identityVerified).length,
    }),
    [],
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-5.5 bg-slate-50/20 min-h-screen antialiased selection:bg-indigo-50">
      {/* 1. Header tác vụ phẳng tinh tế */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Hồ sơ cư dân & Nhân khẩu
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Quản lý thông tin định danh, hợp đồng tạm trú và liên lạc nội khu
            tòa nhà.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          <Button
            variant="outline"
            className="h-9 px-3 text-xs font-medium border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-2xs"
          >
            <Download className="mr-1.5 h-3.5 w-3.5 text-slate-400 stroke-[1.75]" />{" "}
            Xuất Excel
          </Button>
          <Button className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-2xs flex gap-1.5 active:scale-[0.99]">
            <UserPlus className="h-4 w-4 stroke-[2]" />
            Thêm cư dân mới
          </Button>
        </div>
      </div>

      {/* 2. Interactive Stats Filter Card: Thống kê tích hợp nút bấm lọc dữ liệu trực tiếp */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        {[
          {
            key: "all",
            label: "Tổng số cư dân",
            value: statsCounts.total,
            icon: Users,
            style: "border-slate-200 hover:border-slate-300",
            activeStyle:
              "border-slate-900 bg-slate-50/50 ring-1 ring-slate-900",
          },
          {
            key: "active",
            label: "Cư dân đang ở",
            value: statsCounts.active,
            icon: Users,
            style: "border-slate-200 hover:border-emerald-300",
            activeStyle:
              "border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500",
          },
          {
            key: "expiring",
            label: "Hợp đồng sắp hết hạn",
            value: statsCounts.expiring,
            icon: AlertCircle,
            style: "border-slate-200 hover:border-amber-300",
            activeStyle:
              "border-amber-500 bg-amber-50/20 ring-1 ring-amber-500",
          },
          {
            key: "unverified",
            label: "Hồ sơ chưa xác minh",
            value: statsCounts.unverified,
            icon: AlertCircle,
            style: "border-slate-200 hover:border-rose-300",
            activeStyle: "border-rose-500 bg-rose-50/20 ring-1 ring-rose-500",
          },
        ].map((stat) => {
          const isSelected = statusFilter === stat.key;
          return (
            <div
              key={stat.key}
              onClick={() => setStatusFilter(stat.key)}
              className={`p-4 bg-white border rounded-xl transition-all duration-300 cursor-pointer select-none flex items-center justify-between min-h-[76px] shadow-[0_1px_2px_rgba(0,0,0,0.01)] ${
                isSelected ? stat.activeStyle : stat.style
              }`}
            >
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-slate-400">
                  {stat.label}
                </p>
                <h4 className="text-xl font-bold text-slate-800 font-sans leading-none">
                  {stat.value}
                </h4>
              </div>
              <div
                className={`p-2 rounded-lg bg-slate-50 border border-slate-100/80 text-slate-400`}
              >
                <stat.icon size={15} className="stroke-[1.75]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Toolbar Tìm kiếm phẳng dẹt tràn viền */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-800 transition-colors stroke-[1.5]" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo ID, tên cư dân, số điện thoại chính..."
            className="w-full pl-9 pr-4 h-10 bg-white border border-slate-200/80 focus-visible:border-slate-400 focus-visible:ring-0 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal transition-all"
          />
        </div>
      </div>

      {/* 4. Table UI Danh sách tinh xảo */}
      <div className="rounded-xl border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.01),0_12px_24px_-4px_rgba(15,23,42,0.03)] bg-white overflow-hidden flex flex-col min-h-[400px]">
        <Table>
          <TableHeader className="bg-slate-50/40 border-b border-slate-100/80 select-none">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[30%] pl-5 py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Cư dân & Mã số định danh
              </TableHead>
              <TableHead className="w-[15%] py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Vị trí căn hộ
              </TableHead>
              <TableHead className="w-[25%] py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Thông tin liên hệ
              </TableHead>
              <TableHead className="w-[18%] py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Chu kỳ thời hạn trú ngụ
              </TableHead>
              <TableHead className="w-[12%] text-center py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Trạng thái
              </TableHead>
              <TableHead className="w-[5%] text-right pr-5 py-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100/60">
            {filteredTenants.map((tenant) => (
              <TableRow
                key={tenant.id}
                className="group hover:bg-slate-50/40 transition-colors"
              >
                {/* Cột 1: Profile & Identity status */}
                <TableCell className="pl-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8.5 w-8.5 border border-slate-100 shadow-2xs">
                      <AvatarImage src={tenant.avatar} />
                      <AvatarFallback className="bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {tenant.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800 text-xs tracking-tight truncate">
                          {tenant.name}
                        </span>
                        {tenant.identityVerified ? (
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        ) : (
                          <span
                            className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 shadow-[0_0_4px_rgba(244,63,94,0.4)]"
                            title="Chưa nộp CCCD"
                          />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 tracking-wide">
                        {tenant.id}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Cột 2: Căn hộ */}
                <TableCell className="py-3">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700 text-xs font-mono">
                      P.{tenant.room}
                    </span>
                    <span className="text-[10px] text-slate-400 tracking-tight mt-0.5">
                      Danjin Building
                    </span>
                  </div>
                </TableCell>

                {/* Cột 3: Liên hệ */}
                <TableCell className="py-3">
                  <div className="flex flex-col space-y-0.5 text-xs text-slate-600 font-medium">
                    <div className="flex items-center text-slate-700 font-mono">
                      <Phone className="mr-1.5 h-3 w-3 text-slate-400 stroke-[1.5]" />
                      {tenant.phone}
                    </div>
                    <div className="flex items-center text-[11px] text-slate-400 font-sans">
                      <Mail className="mr-1.5 h-3 w-3 text-slate-400 stroke-[1.5]" />
                      {tenant.email}
                    </div>
                  </div>
                </TableCell>

                {/* Cột 4: Thời hạn tạm trú */}
                <TableCell className="py-3">
                  <div className="flex flex-col text-[11px] font-medium text-slate-500 font-mono">
                    <span>Bắt đầu: {tenant.joinDate}</span>
                    <span className="text-slate-400 mt-0.5">
                      Hạn cuối: {tenant.contractEnd}
                    </span>
                  </div>
                </TableCell>

                {/* Cột 5: Trạng thái badge dẹt */}
                <TableCell className="text-center py-3">
                  <StatusBadge status={tenant.status} />
                </TableCell>

                {/* Cột 6: Dropdown tác vụ mượt mà */}
                <TableCell className="text-right pr-5 py-3">
                  <div className="flex justify-end items-center gap-1.5 h-8">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100/60 transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5 stroke-[1.75]" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-md opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5 stroke-[1.75]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 p-1 rounded-lg shadow-md border border-slate-200/70 bg-white"
                      >
                        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1.5 select-none">
                          Hồ sơ nhân khẩu
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="my-1 border-slate-100" />
                        <DropdownMenuItem className="gap-2 rounded py-2 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer">
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />{" "}
                          Xem chi tiết lý lịch
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 rounded py-2 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer">
                          <History className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />{" "}
                          Sổ gốc thanh toán
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 rounded py-2 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer">
                          <UserCheck className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />{" "}
                          Phê duyệt xác minh
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 border-slate-100" />
                        <DropdownMenuItem className="text-rose-600 hover:bg-rose-50/50 font-medium gap-2 rounded py-2 text-xs cursor-pointer">
                          <UserMinus className="w-3.5 h-3.5 stroke-[1.5]" />{" "}
                          Trục xuất / Rời đi
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; class: string; dot: string }> =
    {
      active: {
        label: "Đang cư trú",
        class: "bg-emerald-50 text-emerald-700 border-emerald-100/70",
        dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]",
      },
      expiring: {
        label: "Sắp hết hợp đồng",
        class: "bg-amber-50 text-amber-700 border-amber-100/70",
        dot: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]",
      },
      inactive: {
        label: "Đã dời đi",
        class: "bg-slate-50 text-slate-500 border-slate-200/60",
        dot: "bg-slate-400",
      },
    };

  const config = configs[status] || configs.active;

  return (
    <Badge
      variant="outline"
      className={`${config.class} border transition-all px-2 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1.5 w-fit mx-auto cursor-default`}
    >
      <span className={`h-1.2 w-1.2 rounded-full ${config.dot}`} />
      {config.label}
    </Badge>
  );
}
