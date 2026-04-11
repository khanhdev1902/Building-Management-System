/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Search,
  Plus,
  Filter,
  Monitor,
  Wind,
  Bed,
  Refrigerator,
  MoreHorizontal,
  Wrench,
  AlertCircle,
  ShieldCheck,
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
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const ASSET_DATA = [
  {
    id: "AST-001",
    name: "Điều hòa Daikin 9000BTU",
    category: "Điện lạnh",
    room: "101",
    purchaseDate: "12/05/2024",
    status: "good",
    icon: <Wind className="w-4 h-4" />,
  },
  {
    id: "AST-002",
    name: "Máy giặt LG Inverter 9kg",
    category: "Điện tử",
    room: "Khu giặt chung",
    purchaseDate: "20/06/2024",
    status: "maintenance",
    icon: <Monitor className="w-4 h-4" />,
  },
  {
    id: "AST-003",
    name: "Giường gỗ Sồi 1m8",
    category: "Nội thất",
    room: "202",
    purchaseDate: "10/01/2025",
    status: "good",
    icon: <Bed className="w-4 h-4" />,
  },
  {
    id: "AST-004",
    name: "Tủ lạnh Samsung 200L",
    category: "Điện lạnh",
    room: "305",
    purchaseDate: "15/02/2025",
    status: "broken",
    icon: <Refrigerator className="w-4 h-4" />,
  },
];

export default function AssetsContent() {
  return (
    <div className="space-y-6 p-5">
      {/* 1. Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Quản lý cơ sở vật chất
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Tổng số 128 thiết bị & tài sản
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <StatBox
            label="Đang sử dụng"
            value="122"
            icon={<ShieldCheck className="text-emerald-500" />}
          />
          <StatBox
            label="Đang báo hỏng"
            value="04"
            icon={<AlertCircle className="text-red-500" />}
            highlight
          />
          <StatBox
            label="Cần bảo trì"
            value="02"
            icon={<Wrench className="text-orange-500" />}
          />
        </div>
      </div>

      {/* 2. Toolbar */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-1 gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Tìm tên thiết bị, mã tài sản, số phòng..."
              className="pl-10 h-10 border-slate-200 focus-visible:ring-indigo-500 rounded-lg bg-white"
            />
          </div>
          <Button
            variant="outline"
            className="gap-2 h-10 border-slate-200 font-bold text-[10px] uppercase bg-white"
          >
            <Filter className="w-4 h-4" /> Loại: Tất cả
          </Button>
        </div>
        <Button className="bg-[#0f172a] hover:bg-slate-800 text-white gap-2 h-10 px-6 rounded-lg font-bold shadow-sm">
          <Plus className="w-4 h-4" /> Thêm thiết bị
        </Button>
      </div>

      {/* 3. Table Section */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-b border-slate-200">
              <TableHead className="w-30 font-bold text-slate-500 text-[10px] uppercase px-4">
                Mã tài sản
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-[10px] uppercase">
                Tên thiết bị
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-[10px] uppercase">
                Loại
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-[10px] uppercase">
                Vị trí
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-[10px] uppercase">
                Ngày mua
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-[10px] uppercase text-center">
                Tình trạng
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-[10px] uppercase text-right px-4">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ASSET_DATA.map((asset) => (
              <TableRow
                key={asset.id}
                className="hover:bg-slate-50/50 transition-colors border-b border-slate-100"
              >
                <TableCell className="font-medium text-slate-500 text-xs px-4">
                  {asset.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                      {asset.icon}
                    </div>
                    <span className="font-bold text-slate-800 text-sm">
                      {asset.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600 text-xs font-semibold">
                  {asset.category}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-indigo-50 text-indigo-700 border-indigo-100 font-black text-[10px]"
                  >
                    PHÒNG {asset.room}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500 text-xs">
                  {asset.purchaseDate}
                </TableCell>
                <TableCell className="text-center">
                  <AssetStatus status={asset.status} />
                </TableCell>
                <TableCell className="text-right px-4">
                  <div className="flex justify-end items-center gap-3">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                      <Wrench className="w-4 h-4" />
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-xl w-40"
                      >
                        <DropdownMenuItem className="font-bold text-xs uppercase">
                          Lịch sử bảo trì
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-bold text-xs uppercase text-red-600">
                          Thanh lý
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

// Sub-components
function StatBox({ label, value, icon, highlight }: any) {
  return (
    <div className="bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm min-w-30 flex items-center justify-between">
      <div>
        <p
          className={`text-[9px] font-black uppercase tracking-wider mb-0.5 ${highlight ? "text-red-500" : "text-slate-400"}`}
        >
          {label}
        </p>
        <p className="text-xl font-black text-slate-900 tracking-tight">
          {value}
        </p>
      </div>
      <div className="opacity-80">{icon}</div>
    </div>
  );
}

function AssetStatus({ status }: { status: string }) {
  const configs: any = {
    good: {
      label: "Hoạt động tốt",
      style: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    maintenance: {
      label: "Cần bảo trì",
      style: "bg-orange-50 text-orange-700 border-orange-100",
    },
    broken: {
      label: "Đang hỏng",
      style: "bg-red-50 text-red-700 border-red-100",
    },
  };
  const config = configs[status];
  return (
    <div
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase ${config.style}`}
    >
      <span className="w-1 h-1 rounded-full bg-current mr-1.5" />
      {config.label}
    </div>
  );
}
