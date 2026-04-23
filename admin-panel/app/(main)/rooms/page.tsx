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
  Save,
  Settings2,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import Link from "next/link";

// 1. Dữ liệu khởi tạo ban đầu
const INITIAL_ROOMS = [
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
  // --- States ---
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [floorFilter, setFloorFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // State cho form thêm phòng mới
  const [newRoom, setNewRoom] = useState({
    name: "",
    floor: "1",
    price: "",
    area: "",
    type: "Studio",
  });

  // --- Logic Xử lý ---
  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();

    // Tạo object phòng mới
    const roomToAdd = {
      id: Math.random().toString(36).substr(2, 9),
      name: newRoom.name,
      type: newRoom.type,
      status: "available",
      price: Number(newRoom.price).toLocaleString("vi-VN"), // Format tiền Việt
      floor: newRoom.floor,
      tenant: null,
      area: `${newRoom.area}m²`,
    };

    setRooms([roomToAdd, ...rooms]); // Thêm lên đầu danh sách
    setIsDialogOpen(false); // Đóng modal
    setNewRoom({ name: "", floor: "1", price: "", area: "", type: "Studio" }); // Reset form
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch =
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (room.tenant?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false);
      const matchesStatus =
        statusFilter === "all" || room.status === statusFilter;
      const matchesFloor = floorFilter === "all" || room.floor === floorFilter;

      return matchesSearch && matchesStatus && matchesFloor;
    });
  }, [searchTerm, statusFilter, floorFilter, rooms]);

  const stats = useMemo(
    () => ({
      total: rooms.length,
      available: rooms.filter((r) => r.status === "available").length,
      occupied: rooms.filter((r) => r.status === "occupied").length,
      maintenance: rooms.filter((r) => r.status === "maintenance").length,
      occupancyRate:
        rooms.length > 0
          ? (
              (rooms.filter((r) => r.status === "occupied").length /
                rooms.length) *
              100
            ).toFixed(0)
          : 0,
    }),
    [rooms],
  );

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* 1. Header & Stats */}
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

          {/* Modal Thêm Phòng */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className=" cursor-pointer hover:scale-105 duration-300 shadow-lg shadow-indigo-200 transition-all rounded-xl h-11">
                <Plus className="mr-2 h-5 w-5" /> Thêm phòng mới
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Thêm căn hộ mới
                </DialogTitle>
                <DialogDescription>
                  Nhập thông tin chi tiết căn hộ mới để bắt đầu quản lý.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddRoom} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 col-span-2">
                    <Label htmlFor="name">Tên / Số phòng</Label>
                    <Input
                      id="name"
                      placeholder="VD: Phòng 402"
                      required
                      value={newRoom.name}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Tầng</Label>
                    <Select
                      value={newRoom.floor}
                      onValueChange={(v) =>
                        setNewRoom({ ...newRoom, floor: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["1", "2", "3", "4", "5"].map((f) => (
                          <SelectItem key={f} value={f}>
                            Tầng {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="area">Diện tích (m²)</Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="VD: 25"
                      required
                      value={newRoom.area}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, area: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2 col-span-2">
                    <Label htmlFor="price">Giá thuê (VNĐ/tháng)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="VD: 5500000"
                      required
                      value={newRoom.price}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, price: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 rounded-xl"
                  >
                    <Save className="mr-2 h-4 w-4" /> Lưu thông tin
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
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
            value={stats.maintenance}
            icon={<Wrench className="w-4 h-4" />}
            color="orange"
          />
        </div>
      </div>

      {/* 2. Filters Toolbar - Modern Redesign */}
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 backdrop-blur-xl sticky top-4 z-20 rounded-2xl transition-all duration-300 border border-white/20">
        <CardContent className="px-2 md:px-3 grid gap-3 md:grid-cols-12 items-center">
          {/* Search Input - Tăng cường trải nghiệm Focus */}
          <div className="relative md:col-span-7 group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 group-focus-within:scale-110 transition-all duration-300" />
            </div>
            <Input
              placeholder="Tìm nhanh: số phòng, khách thuê..."
              className="pl-10 h-11 bg-white/50 border-slate-200/60 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-xl transition-all duration-300 placeholder:text-slate-400 text-sm font-medium shadow-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Floor Filter - Kèm Icon nhận diện */}
          <div className="md:col-span-2 flex justify-end">
            <Select value={floorFilter} onValueChange={setFloorFilter}>
              <SelectTrigger className="h-11 rounded-xl border-slate-200/60 bg-white/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-600">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-slate-400" />
                  <SelectValue placeholder="Chọn tầng" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                <SelectItem
                  value="all"
                  className="focus:bg-indigo-50 focus:text-indigo-600 font-medium"
                >
                  Tất cả các tầng
                </SelectItem>
                <Separator className="my-1 opacity-50" />
                {[1, 2, 3, 4, 5].map((f) => (
                  <SelectItem
                    key={f}
                    value={f.toString()}
                    className="focus:bg-indigo-50"
                  >
                    Tầng {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter - Kèm Indicator màu sắc */}
          <div className="md:col-span-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 rounded-xl border-slate-200/60 bg-white/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-600">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      statusFilter === "available"
                        ? "bg-emerald-500"
                        : statusFilter === "occupied"
                          ? "bg-blue-500"
                          : statusFilter === "maintenance"
                            ? "bg-amber-500"
                            : "bg-slate-300"
                    }`}
                  />
                  <SelectValue placeholder="Trạng thái" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                <SelectItem value="all" className="font-medium">
                  Tất cả trạng thái
                </SelectItem>
                <SelectItem
                  value="available"
                  className="text-emerald-600 font-medium"
                >
                  ● Còn trống
                </SelectItem>
                <SelectItem
                  value="occupied"
                  className="text-blue-600 font-medium"
                >
                  ● Đã thuê
                </SelectItem>
                <SelectItem
                  value="maintenance"
                  className="text-amber-600 font-medium"
                >
                  ● Bảo trì
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button - Tinh gọn & Thông minh */}
          <div className="md:col-span-1 flex justify-end">
            {searchTerm || statusFilter !== "all" || floorFilter !== "all" ? (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl h-11 w-11 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300 animate-in zoom-in-75"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setFloorFilter("all");
                }}
                title="Xóa bộ lọc"
              >
                <FilterX className="h-5 w-5" />
              </Button>
            ) : (
              <div className="h-11 w-11 flex items-center justify-center text-slate-200">
                <Settings2 className="h-5 w-5 opacity-20" />
              </div>
            )}
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
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 group-hover:bg-slate-100/50 transition-colors">
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
                <Link href={`/rooms/${room.id}`} className="flex-1 rounded-xl bg-slate-900 hover:bg-slate-800 h-9 text-xs items-center justify-center flex">
                  <Button className="flex-1 rounded-xl bg-slate-900 hover:bg-slate-800 h-9 text-xs">
                    Chi tiết
                  </Button>
                </Link>
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
                    <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                    <DropdownMenuItem className="text-indigo-600">
                      Lập hợp đồng
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
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
        </div>
      )}
    </div>
  );
}

// --- Sub-components ---

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
