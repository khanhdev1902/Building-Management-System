/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FilterX,
  ArrowUpDown,
  LayoutGrid,
  TableProperties,
  ChevronDown,
  RefreshCw,
  User,
} from "lucide-react";
import { RoomCard } from "./components/room-card";
import { RoomFilters } from "./components/room-filters";
import { RoomStats } from "./components/room-stats";
import { RoomDialog } from "./components/room-dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { roomApi } from "./apis/room.api";
import { RoomResponse } from "./types/room.type";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";

const INITIAL_ITEMS = 8;
const LOAD_MORE_STEP = 4;

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [floorFilter, setFloorFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(INITIAL_ITEMS);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid"); // CHUYỂN ĐỔI LAYOUT THỰC CHIẾN
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch dữ liệu sổ gốc phòng duy nhất một lần
  const fetchRoomData = async () => {
    try {
      setIsLoading(true);
      const res = await roomApi.getAllRooms();
      setRooms(res.data);
    } catch (error: any) {
      toast.error(error?.message || "Không thể đồng bộ danh sách căn hộ!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, []);

  // Reset giới hạn nhìn khi người dùng đảo tiêu chí lọc
  useEffect(() => {
    setVisibleCount(INITIAL_ITEMS);
  }, [searchTerm, statusFilter, floorFilter, sortBy]);

  // 2. Thuật toán lọc và sắp xếp Client-side tập trung
  const filteredAndSortedRooms = useMemo(() => {
    const result = rooms.filter((room) => {
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        room.roomNumber.toLowerCase().includes(s) ||
        (room.tenant?.name.toLowerCase().includes(s) ?? false);
      const matchesStatus =
        statusFilter === "all" || room.status === statusFilter;
      const matchesFloor =
        floorFilter === "all" || room.floor.toString() === floorFilter;
      return matchesSearch && matchesStatus && matchesFloor;
    });

    return result.sort((a, b) => {
      if (sortBy === "price-up") return a.roomPrice - b.roomPrice;
      if (sortBy === "price-down") return b.roomPrice - a.roomPrice;
      if (sortBy === "area-down") return b.acreage - a.acreage;
      return b.id.localeCompare(a.id);
    });
  }, [searchTerm, statusFilter, floorFilter, sortBy, rooms]);

  // Cắt lát mảng theo cơ chế cuộn tải thêm (Load More) thay cho phân trang số thô cứng
  const paginatedRooms = useMemo(() => {
    return filteredAndSortedRooms.slice(0, visibleCount);
  }, [filteredAndSortedRooms, visibleCount]);

  const stats = useMemo(() => {
    const total = rooms.length;
    const occupied = rooms.filter((r) => r.status === "OCCUPIED").length;
    return {
      total,
      available: rooms.filter((r) => r.status === "AVAILABLE").length,
      occupied,
      maintenance: rooms.filter((r) => r.status === "MAINTENANCE").length,
      occupancyRate: total > 0 ? ((occupied / total) * 100).toFixed(0) : 0,
    };
  }, [rooms]);

  const handleCreateRoom = async (formData: any) => {
    try {
      const res = await roomApi.createRoom({
        ...formData,
        status: "AVAILABLE",
        tenant: null,
      });
      setRooms((prev) => [res.data, ...prev]);
      toast.success("Khởi tạo căn hộ mới thành công!");
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra khi tạo phòng!");
    }
  };

  const handleUpdateRoom = (updatedData: any) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === updatedData.id ? { ...r, ...updatedData } : r)),
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-slate-50/20 min-h-screen antialiased selection:bg-indigo-50">
      {/* 1. TOP BAR ĐIỀU HÀNH VÀ KHỐI METRICS KPI CARD TẬP TRUNG */}
      <div className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between select-none">
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              Bản đồ mặt bằng & Điều phối quỹ phòng
            </h1>
            <p className="text-slate-500 text-xs font-medium">
              Tìm thấy{" "}
              <span className="text-slate-900 font-bold font-mono">
                {filteredAndSortedRooms.length}
              </span>{" "}
              / {rooms.length} căn hộ trùng khớp bộ lọc tài khóa.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={fetchRoomData}
              variant="outline"
              size="icon"
              className="h-9 w-9 border-slate-200 text-slate-400 hover:text-slate-800 rounded-lg bg-white shadow-2xs"
            >
              <RefreshCw
                size={14}
                className={isLoading ? "animate-spin" : ""}
              />
            </Button>
            <RoomDialog mode="create" onSubmit={handleCreateRoom} />
          </div>
        </div>

        <RoomStats stats={stats} />
      </div>

      {/* 2. UNIFIED CONTROL BAR TÍNH NĂNG CAO CẤP */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
        <div className="flex-1 min-w-0">
          <RoomFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            floorFilter={floorFilter}
            setFloorFilter={setFloorFilter}
          />
        </div>

        {/* Khay sắp xếp kết hợp phím gạt Layout (Grid / Table) dẹt lì h-10 */}
        <div className="flex items-center gap-3 h-10 px-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs shrink-0 select-none">
          {/* Cụm nút gạt Layout dẹt mượt mà */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg h-7 items-center border border-slate-200/40">
            <button
              onClick={() => setViewMode("grid")}
              className={`h-6 w-7 rounded-md flex items-center justify-center transition-all cursor-pointer ${viewMode === "grid" ? "bg-white shadow-3xs text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
            >
              <LayoutGrid size={13} className="stroke-2" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`h-6 w-7 rounded-md flex items-center justify-center transition-all cursor-pointer ${viewMode === "table" ? "bg-white shadow-3xs text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
            >
              <TableProperties size={13} className="stroke-2" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Sắp xếp
          </span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 h-full border-none bg-transparent shadow-none focus:ring-0 text-xs font-semibold text-slate-700 p-0 hover:text-slate-900 transition-colors">
              <div className="flex items-center gap-1.5 ml-auto">
                <ArrowUpDown className="w-3 h-3 text-slate-400 stroke-[1.8]" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-lg border-slate-200 p-1">
              <SelectItem value="newest" className="text-xs rounded-md">
                Mới cập nhật
              </SelectItem>
              <SelectItem value="price-up" className="text-xs rounded-md">
                Giá: Thấp-Cao
              </SelectItem>
              <SelectItem value="price-down" className="text-xs rounded-md">
                Giá: Cao-Thấp
              </SelectItem>
              <SelectItem value="area-down" className="text-xs rounded-md">
                Diện tích lớn
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 3. VÙNG RENDER NỘI DUNG: THAY ĐỔI ĐỘNG THEO LAYOUT CHỌN */}
      {isLoading ? (
        /* TRẠNG THÁI SKELETON LOAD PHẲNG */
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: INITIAL_ITEMS }).map((_, i) => (
            <div
              key={i}
              className="border border-slate-200/60 bg-white rounded-xl p-4 space-y-4 h-52 flex flex-col justify-between animate-pulse"
            >
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
              <div className="h-14 bg-slate-50/60 border border-slate-100 rounded-lg" />
              <div className="flex items-center gap-2">
                <div className="h-8 bg-slate-100 rounded-lg flex-1" />
                <div className="h-8 bg-slate-100 rounded-lg w-8" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredAndSortedRooms.length === 0 ? (
        /* TRẠNG THÁI EMPTY STATE BAO TRỌN KHAY DỮ LIỆU CHỐNG LỌT THỎM */
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-slate-200 select-none">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-400 mb-3 animate-bounce duration-1000">
            <FilterX className="w-5 h-5 stroke-[1.8]" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 mb-0.5">
            Không tìm thấy căn hộ phù hợp
          </h4>
          <p className="text-[11px] text-slate-400 max-w-xs text-center mb-4.5 leading-normal">
            Hệ thống không tìm thấy phòng nào khớp với từ khóa tìm kiếm hoặc cấu
            hình bộ lọc tầng/trạng thái hiện tại.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="h-7.5 rounded-lg text-xs border-slate-200 text-slate-600 font-semibold"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setFloorFilter("all");
            }}
          >
            Làm sạch bộ lọc
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        /* LAYOUT 1: GRID CÁC THẺ PHÒNG TRỰC QUAN */
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in duration-200">
          {paginatedRooms.map((room) => (
            <RoomCard key={room.id} room={room} onUpdate={handleUpdateRoom} />
          ))}
        </div>
      ) : (
        /* LAYOUT 2: TABLE CHỨNG TỪ NÉN CHẶT MẬT ĐỘ THÔNG TIN ĐỐI SOÁT NHANH (MỚI NÂNG CẤP) */
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-3xs animate-in fade-in duration-200">
          <Table>
            <TableHeader className="bg-slate-50/50 border-b border-slate-100 select-none">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-4 py-2.5">
                  Số phòng
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2.5">
                  Vị trí
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2.5">
                  Đại diện cư dân
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2.5 text-right">
                  Giá niêm yết
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2.5 text-center">
                  Trạng thái quỹ
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-50 text-xs">
              {paginatedRooms.map((room) => (
                <TableRow
                  key={room.id}
                  className="hover:bg-slate-50/20 border-none group cursor-pointer"
                >
                  <TableCell className="font-mono font-bold text-slate-900 pl-4 py-3">
                    P.{room.roomNumber}
                  </TableCell>
                  <TableCell className="text-slate-500 py-3">
                    Tầng {room.floor} •{" "}
                    <span className="font-mono">{room.acreage}m²</span>
                  </TableCell>
                  <TableCell className="py-3">
                    {room.tenant ? (
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-slate-400" />
                        <span className="font-semibold text-slate-700">
                          {room.tenant.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-300 italic">
                        Trống • Sẵn sàng đón khách
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-slate-900 py-3">
                    {room.roomPrice.toLocaleString("vi-VN")}đ
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <Badge
                      variant="outline"
                      className={`border-none text-[9px] font-bold px-1.5 py-0.5 rounded cursor-default select-none ${
                        room.status === "OCCUPIED"
                          ? "bg-emerald-50 text-emerald-700"
                          : room.status === "AVAILABLE"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {room.status === "OCCUPIED"
                        ? "Đang ở"
                        : room.status === "AVAILABLE"
                          ? "Sẵn sàng"
                          : "Bảo trì"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* 4. THANH CUỘN TẢI THÊM PHÒNG (LOAD MORE CHUẨN FINTECH SAAS) */}
      {!isLoading && filteredAndSortedRooms.length > visibleCount && (
        <div className="flex flex-col items-center justify-center gap-2 border-t border-slate-100 pt-5 select-none">
          <p className="text-[10px] font-medium text-slate-400">
            Hiển thị{" "}
            <span className="text-slate-800 font-bold font-mono">
              {paginatedRooms.length}
            </span>{" "}
            trên {filteredAndSortedRooms.length} phòng khả dụng
          </p>
          <Button
            onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
            variant="outline"
            size="sm"
            className="h-8 text-xs border-slate-200 text-slate-700 font-semibold bg-white hover:bg-slate-50 rounded-lg shadow-2xs gap-1"
          >
            <span>Tải thêm phòng mặt bằng</span>
            <ChevronDown size={13} className="text-slate-400 stroke-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
