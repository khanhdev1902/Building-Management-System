"use client";

import React from "react";
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Phone,
  Mail,
  MessageCircle,
  FileText,
  UserCheck,
  UserMinus,
  ShieldCheck,
  Filter,
  Download,
  ExternalLink,
  History,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button"; // Giả định alias từ project của bạn
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
import { Card, CardContent } from "@/shared/components/ui/card";
import Link from "next/link";

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
  return (
    <div className="p-6 md:p-8 space-y-6 bg-slate-50/50 min-h-screen">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý cư dân
          </h1>
          <p className="text-sm text-slate-500">
            Xem và quản lý thông tin nhân khẩu của toàn bộ tòa nhà.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-10 bg-white shadow-sm border-slate-200"
          >
            <Download className="mr-2 h-4 w-4" /> Xuất dữ liệu
          </Button>
          <Button
            variant={"outline"}
            className="h-10 cursor-pointer shadow-sm transition-all"
          >
            <UserPlus className="mr-2 h-4 w-4" /> Thêm cư dân mới
          </Button>
        </div>
      </div>

      {/* 2. Operational Stats - Quan trọng cho quản lý chuyên nghiệp */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Đang cư trú",
            value: "142",
            trend: "+4 tháng này",
            color: "text-emerald-600",
          },
          {
            label: "Sắp hết hợp đồng",
            value: "08",
            trend: "Cần chú ý",
            color: "text-amber-600",
          },
          {
            label: "Chưa xác minh",
            value: "03",
            trend: "Yêu cầu bổ sung",
            color: "text-red-600",
          },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white">
            <CardContent className="p-4 flex justify-between items-end">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold mt-1 text-slate-900">
                  {stat.value}
                </p>
              </div>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 ${stat.color}`}
              >
                {stat.trend}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. Toolbar: Search & Advanced Filters */}
      <Card className="border-none shadow-sm bg-white">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm theo tên, ID, hoặc số điện thoại..."
              className="pl-10 h-10 border-slate-100 bg-slate-50 focus:bg-white transition-all"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 border border-transparent hover:border-slate-200"
            >
              <Filter className="w-4 h-4 mr-2" /> Bộ lọc nâng cao
            </Button>
            <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block" />
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button className="px-3 py-1.5 text-xs font-medium bg-white rounded-md shadow-sm">
                Tất cả
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">
                Đang ở
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">
                Lịch sử
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Table UI */}
      <div className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow>
              <TableHead className="w-[300px] font-semibold text-slate-700">
                Cư dân & Định danh
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Vị trí phòng
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Liên hệ & Bảo mật
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Thời hạn cư trú
              </TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">
                Trạng thái
              </TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TENANTS.map((tenant) => (
              <TableRow
                key={tenant.id}
                className="group hover:bg-slate-50/50 transition-colors"
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                      <AvatarImage src={tenant.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                        {tenant.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 leading-none">
                          {tenant.name}
                        </span>
                        {tenant.identityVerified && (
                          <ShieldCheck
                            className="w-3.5 h-3.5 text-blue-500"
                            title="Đã xác minh CMND/CCCD"
                          />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 font-mono">
                        {tenant.id}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800">
                      P.{tenant.room}
                    </span>
                    <span className="text-[11px] text-slate-500 italic">
                      Danjin Tower 01
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1.5">
                    <div className="flex items-center text-xs text-slate-600 hover:text-blue-600 cursor-pointer transition-colors group/tel">
                      <Phone className="mr-2 h-3.5 w-3.5 text-slate-300 group-hover/tel:text-blue-500" />
                      {tenant.phone}
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                      <Mail className="mr-2 h-3.5 w-3.5 text-slate-300" />
                      {tenant.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-600 font-medium">
                      Từ: {tenant.joinDate}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Đến: {tenant.contractEnd}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <StatusBadge status={tenant.status} />
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-blue-600"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-slate-100"
                        >
                          <MoreHorizontal className="h-4 w-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-56 shadow-xl border-slate-200"
                      >
                        <DropdownMenuLabel className="text-xs text-slate-400 uppercase tracking-widest">
                          Quản lý cư trú
                        </DropdownMenuLabel>
                        <DropdownMenuItem className="gap-2">
                          <Link
                            href={`/tenants/${tenant.id ?? 1}`}
                            className="flex items-center gap-2 w-full"
                          >
                            <ExternalLink className="w-4 h-4" /> Xem chi tiết
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <History className="w-4 h-4" /> Lịch sử thanh toán
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <UserCheck className="w-4 h-4" /> Xác minh thông tin
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 gap-2 font-medium">
                          <UserMinus className="w-4 h-4" /> Chấm dứt cư trú
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
  const configs: any = {
    active: {
      label: "Đang ở",
      class:
        "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100",
      dot: "bg-emerald-500",
    },
    expiring: {
      label: "Sắp hết hạn",
      class: "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100",
      dot: "bg-amber-500",
    },
    inactive: {
      label: "Đã rời đi",
      class: "bg-slate-50 text-slate-500 border-slate-100",
      dot: "bg-slate-300",
    },
  };

  const config = configs[status] || configs.active;

  return (
    <Badge
      variant="outline"
      className={`${config.class} border transition-all cursor-default flex items-center gap-1.5 w-fit mx-auto`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </Badge>
  );
}
