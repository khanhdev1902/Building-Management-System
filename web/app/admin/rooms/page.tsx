"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useMemo, useEffect } from "react";
import { FilterX, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { RoomCard } from "./components/room-card";
import { RoomFilters } from "./components/room-filters";
import { RoomStats } from "./components/room-stats";
import { RoomDialog } from "./components/room-dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { INITIAL_ROOMS } from "./constants/room-data";
import { roomApi } from "./apis/room.api";

const ITEMS_PER_PAGE = 8;

export default function RoomsPage() {
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [floorFilter, setFloorFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập loading khi vào trang hoặc chuyển trang
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, floorFilter, sortBy, currentPage]);

  // Reset trang về 1 khi lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, floorFilter]);

  const filteredAndSortedRooms = useMemo(() => {
    const result = rooms.filter((room) => {
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        room.roomNumber.toLowerCase().includes(s) ||
        (room.tenant?.name.toLowerCase().includes(s) ?? false);
      const matchesStatus =
        statusFilter === "all" || room.status === statusFilter;
      const matchesFloor = floorFilter === "all" || room.floor.toString() === floorFilter;
      return matchesSearch && matchesStatus && matchesFloor;
    });

    return result.sort((a, b) => {
      if (sortBy === "price-up") return a.roomPrice - b.roomPrice;
      if (sortBy === "price-down") return b.roomPrice - a.roomPrice;
      if (sortBy === "area-down") return b.acreage - a.acreage;
      // Mặc định là newest dựa trên ID hoặc vị trí trong mảng
      return 0;
    });
  }, [searchTerm, statusFilter, floorFilter, sortBy, rooms]);

  // --- Logic Phân trang ---
  const totalPages = Math.ceil(filteredAndSortedRooms.length / ITEMS_PER_PAGE);
  const paginatedRooms = filteredAndSortedRooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const stats = useMemo(
    () => ({
      total: rooms.length,
      available: rooms.filter((r) => r.status === "AVAILABLE").length,
      occupied: rooms.filter((r) => r.status === "OCCUPIED").length,
      maintenance: rooms.filter((r) => r.status === "MAINTENANCE").length,
      occupancyRate:
        rooms.length > 0
          ? (
              (rooms.filter((r) => r.status === "OCCUPIED").length /
                rooms.length) *
              100
            ).toFixed(0)
          : 0,
    }),
    [rooms],
  );

  // 1. Cập nhật hàm Create để khớp với data structure của Dialog mới
  const handleCreateRoom = async (formData: any) => {
    const newRoom = {
      ...formData, // Chứa name, floor, price, area, type, services (object), amenities (array), description
      id: Math.random().toString(36).substr(2, 9),
      status: "AVAILABLE",
      tenant: null,
      // Đảm bảo có lastReading khởi tạo để không bị lỗi UI Card
      lastReading: { electric: 0, water: 0 },
    };

    setRooms([newRoom, ...rooms]);
    // Hiệu ứng tạo xong thì nhảy về trang 1 cho người ta thấy hàng mới
    console.log("Created Room:", newRoom);
    await roomApi.createRoom(newRoom);
    setCurrentPage(1);
  };

  // 2. Hàm Update giữ nguyên logic map nhưng sẽ nhận được object đầy đủ hơn
  const handleUpdateRoom = (updatedData: any) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === updatedData.id ? { ...r, ...updatedData } : r)),
    );
  };

  return (
    <div className=" space-y-8 bg-slate-50/50 min-h-screen p-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
              Quản lý phòng
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Hệ thống Danjin đang vận hành{" "}
              <span className="text-slate-900 font-bold">
                {filteredAndSortedRooms.length}
              </span>{" "}
              phòng phù hợp
            </p>
          </div>

          <RoomDialog mode="create" onSubmit={handleCreateRoom} />
        </div>

        <RoomStats stats={stats} />
      </div>

      {/* 2. Filters & Sắp xếp */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <RoomFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            floorFilter={floorFilter}
            setFloorFilter={setFloorFilter}
          />
        </div>

        <div className="flex items-center gap-3 shrink-0 bg-white p-1.5 px-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Sắp xếp
          </span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 h-8 border-none bg-transparent shadow-none focus:ring-0 text-xs font-bold text-slate-700">
              <ArrowUpDown className="w-3 h-3 mr-2 text-slate-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              <SelectItem value="newest" className="text-xs">
                Mới nhất
              </SelectItem>
              <SelectItem value="price-up" className="text-xs">
                Giá: Thấp đến Cao
              </SelectItem>
              <SelectItem value="price-down" className="text-xs">
                Giá: Cao đến Thấp
              </SelectItem>
              <SelectItem value="area-down" className="text-xs">
                Diện tích: Lớn nhất
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 3. Rooms Grid với Skeleton Loading */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-70 w-full bg-slate-200 animate-pulse rounded-2xl border border-slate-100"
              />
            ))
          : paginatedRooms.map((room) => (
              <RoomCard key={room.id} room={room} onUpdate={handleUpdateRoom} />
            ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl border-slate-200"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "ghost"}
                className={`w-10 h-10 rounded-xl font-bold ${currentPage === i + 1 ? "bg-slate-900" : "text-slate-500"}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="rounded-xl border-slate-200"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}


      {!isLoading && filteredAndSortedRooms.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-300">
          <FilterX className="w-16 h-16 opacity-10 mb-4" />
          <p className="text-xl font-bold italic">
            Không tìm thấy kết quả phù hợp
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
