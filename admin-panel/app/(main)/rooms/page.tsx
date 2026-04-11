/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  User,
  CreditCard,
  Home,
  DoorOpen,
  Wrench,
  MoreVertical,
  FilterX,
  Layers,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

// Dữ liệu mẫu mở rộng
const ROOM_DATA = [
  {
    id: "101",
    name: "Phòng 101",
    type: "Studio",
    status: "occupied",
    price: "4.500.000",
    floor: "1",
    tenant: "Nguyễn Văn A",
    area: "25m²",
  },
  {
    id: "102",
    name: "Phòng 102",
    type: "1PN",
    status: "available",
    price: "5.200.000",
    floor: "1",
    tenant: null,
    area: "35m²",
  },
  {
    id: "201",
    name: "Phòng 201",
    type: "Studio",
    status: "maintenance",
    price: "4.500.000",
    floor: "2",
    tenant: null,
    area: "25m²",
  },
  {
    id: "202",
    name: "Phòng 202",
    type: "Studio",
    status: "occupied",
    price: "4.500.000",
    floor: "2",
    tenant: "Trần Thị B",
    area: "25m²",
  },
  {
    id: "301",
    name: "Phòng 301",
    type: "Penthouse",
    status: "available",
    price: "15.000.000",
    floor: "3",
    tenant: null,
    area: "100m²",
  },
];

export default function RoomsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [floorFilter, setFloorFilter] = useState("all");

  // Logic lọc dữ liệu chuyên nghiệp
  const filteredRooms = useMemo(() => {
    return ROOM_DATA.filter((room) => {
      const matchesSearch =
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (room.tenant?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false);
      const matchesStatus =
        statusFilter === "all" || room.status === statusFilter;
      const matchesFloor = floorFilter === "all" || room.floor === floorFilter;

      return matchesSearch && matchesStatus && matchesFloor;
    });
  }, [searchTerm, statusFilter, floorFilter]);

  // Thống kê nhanh
  const stats = {
    total: ROOM_DATA.length,
    available: ROOM_DATA.filter((r) => r.status === "available").length,
    occupied: ROOM_DATA.filter((r) => r.status === "occupied").length,
    occupancyRate: (
      (ROOM_DATA.filter((r) => r.status === "occupied").length /
        ROOM_DATA.length) *
      100
    ).toFixed(0),
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* 1. Header & Stats Section */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Quản lý mặt bằng
            </h1>
            <p className="text-slate-500 mt-1">
              Hệ thống quản lý {stats.total} căn hộ tại tòa nhà.
            </p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all rounded-xl h-11">
            <Plus className="mr-2 h-5 w-5" /> Thêm phòng mới
          </Button>
        </div>

        {/* Stats Cards - Điểm nhấn chuyên nghiệp */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickStatCard
            label="Tổng số phòng"
            value={stats.total}
            icon={<Home className="w-4 h-4" />}
            color="indigo"
          />
          <QuickStatCard
            label="Đang trống"
            value={stats.available}
            icon={<DoorOpen className="w-4 h-4" />}
            color="green"
          />
          <QuickStatCard
            label="Tỉ lệ lấp đầy"
            value={`${stats.occupancyRate}%`}
            icon={<Layers className="w-4 h-4" />}
            color="blue"
          />
          <QuickStatCard
            label="Cần bảo trì"
            value={ROOM_DATA.filter((r) => r.status === "maintenance").length}
            icon={<Wrench className="w-4 h-4" />}
            color="orange"
          />
        </div>
      </div>

      {/* 2. Advanced Filters Toolbar */}
      <Card className="border-none shadow-sm bg-white/80 backdrop-blur-md sticky top-4 z-10 overflow-visible">
        <CardContent className="p-3 grid gap-3 md:grid-cols-12 items-center">
          <div className="relative md:col-span-5 group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              placeholder="Tìm số phòng, tên khách thuê..."
              className="pl-9 bg-white border-slate-200 focus-visible:ring-indigo-500 rounded-xl transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="md:col-span-3">
            <Select value={floorFilter} onValueChange={setFloorFilter}>
              <SelectTrigger className="rounded-xl border-slate-200 bg-white">
                <SelectValue placeholder="Tất cả các tầng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả các tầng</SelectItem>
                <SelectItem value="1">Tầng 1</SelectItem>
                <SelectItem value="2">Tầng 2</SelectItem>
                <SelectItem value="3">Tầng 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="rounded-xl border-slate-200 bg-white">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="available">Còn trống</SelectItem>
                <SelectItem value="occupied">Đã thuê</SelectItem>
                <SelectItem value="maintenance">Bảo trì</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-1 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setFloorFilter("all");
              }}
              title="Xóa bộ lọc"
            >
              <FilterX className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 3. Rooms Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredRooms.map((room) => (
          <Card
            key={room.id}
            className="group border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white rounded-2xl overflow-hidden"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {room.name}
                  </CardTitle>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Layers className="w-3 h-3" /> Tầng {room.floor} •{" "}
                    {room.area}
                  </p>
                </div>
                <StatusBadge status={room.status} />
              </div>
            </CardHeader>

            <CardContent className="pb-4 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 transition-colors group-hover:bg-slate-100/50">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-slate-500 font-medium">
                    <CreditCard className="mr-2 h-4 w-4 text-indigo-500" /> Giá
                    thuê
                  </div>
                  <span className="font-bold text-slate-900">
                    {room.price}đ
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-slate-500 font-medium">
                    <User className="mr-2 h-4 w-4 text-indigo-500" /> Khách thuê
                  </div>
                  <span
                    className={`font-semibold ${room.tenant ? "text-slate-900" : "text-slate-400 italic"}`}
                  >
                    {room.tenant || "Còn trống"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 rounded-xl bg-slate-900 hover:bg-slate-800 h-9 text-xs">
                  Chi tiết
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-xl h-9 w-9 border-slate-200"
                    >
                      <MoreVertical className="h-4 w-4 text-slate-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl w-40">
                    <DropdownMenuItem className="cursor-pointer">
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-indigo-600">
                      Lập hợp đồng
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-red-600">
                      Báo hỏng
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
          <FilterX className="w-12 h-12 opacity-20" />
          <p className="text-lg font-medium">
            Không tìm thấy phòng nào phù hợp.
          </p>
          <Button
            variant="link"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setFloorFilter("all");
            }}
          >
            Xóa tất cả bộ lọc
          </Button>
        </div>
      )}
    </div>
  );
}

// Sub-component: Quick Stat Card
function QuickStatCard({ label, value, icon, color }: any) {
  const colorMap: any = {
    indigo: "text-indigo-600 bg-indigo-50",
    green: "text-emerald-600 bg-emerald-50",
    blue: "text-blue-600 bg-blue-50",
    orange: "text-orange-600 bg-orange-50",
  };
  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>{icon}</div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">
            {label}
          </p>
          <p className="text-xl font-black text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Sub-component: Status Badge chuyên nghiệp
function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    available: "bg-emerald-50 text-emerald-700 border-emerald-100",
    occupied: "bg-blue-50 text-blue-700 border-blue-100",
    maintenance: "bg-amber-50 text-amber-700 border-amber-100",
  };
  const labels: any = {
    available: "Trống",
    occupied: "Đã thuê",
    maintenance: "Bảo trì",
  };

  return (
    <Badge
      className={`${styles[status]} border shadow-none px-2 py-0 rounded-lg text-[10px] font-bold uppercase`}
    >
      {labels[status]}
    </Badge>
  );
}
