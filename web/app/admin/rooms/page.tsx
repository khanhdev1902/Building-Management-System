"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useMemo, useEffect } from "react";
import {
  FilterX,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
import { roomApi } from "./apis/room.api";
import { RoomResponse } from "./types/room.type";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 8;

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [floorFilter, setFloorFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // SỬA LỖI: Chỉ gọi API một lần duy nhất khi Mount vì hệ thống đang filter ở Client-side
  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const res = await roomApi.getAllRooms();
        setRooms(res.data);
      } catch (error: any) {
        toast.error(error?.message || "Không thể tải danh sách căn hộ!");
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []); // Đã dọn dẹp các dependencies thừa để tránh spam API

  // Reset trang về 1 khi người dùng thay đổi tiêu chí lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, floorFilter, sortBy]);

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
      return b.id.localeCompare(a.id); // Mới nhất dựa trên ID chuỗi (UUID/String)
    });
  }, [searchTerm, statusFilter, floorFilter, sortBy, rooms]);

  // --- Logic Phân trang mượt ---
  const totalPages = Math.ceil(filteredAndSortedRooms.length / ITEMS_PER_PAGE);
  const paginatedRooms = useMemo(() => {
    return filteredAndSortedRooms.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );
  }, [filteredAndSortedRooms, currentPage]);

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
    <div className="min-h-screen bg-slate-50/30 p-6 space-y-7 max-w-7xl mx-auto w-full antialiased selection:bg-indigo-50">
      {/* 1. Header cao cấp & Thống kê tích hợp */}
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Quản lý phòng
            </h1>
            <p className="text-slate-500 text-xs font-medium">
              Tìm thấy{" "}
              <span className="text-slate-900 font-semibold font-mono">
                {filteredAndSortedRooms.length}
              </span>{" "}
              phòng phù hợp theo bộ lọc của bạn
            </p>
          </div>
          <div className="shrink-0">
            <RoomDialog mode="create" onSubmit={handleCreateRoom} />
          </div>
        </div>

        <RoomStats stats={stats} />
      </div>

      {/* 2. Unified Control Bar: Hợp nhất Filter và Sort trên cùng 1 hàng */}
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

        {/* Khối sắp xếp thiết kế phẳng, đồng bộ độ cao 40px (h-10) với thanh lọc */}
        <div className="flex items-center gap-2 h-10 px-3 bg-white rounded-xl border border-slate-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.02)] shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none shrink-0 border-r border-slate-100 pr-2.5">
            Sắp xếp
          </span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-36 h-full border-none bg-transparent shadow-none focus:ring-0 text-xs font-semibold text-slate-700 p-0 hover:text-slate-900 transition-colors">
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3 h-3 text-slate-400 stroke-[1.8]" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-lg border-slate-200 shadow-md p-1">
              <SelectItem value="newest" className="text-xs rounded-md">
                Mới cập nhật
              </SelectItem>
              <SelectItem value="price-up" className="text-xs rounded-md">
                Giá: Thấp đến Cao
              </SelectItem>
              <SelectItem value="price-down" className="text-xs rounded-md">
                Giá: Cao đến Thấp
              </SelectItem>
              <SelectItem value="area-down" className="text-xs rounded-md">
                Diện tích: Lớn nhất
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 3. Grid Căn hộ & Hiệu ứng Shimmer Skeleton cao cấp */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <div
                key={i}
                className="border border-slate-200/60 bg-white rounded-xl p-4 space-y-4 h-55 flex flex-col justify-between animate-pulse"
              >
                <div className="space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
                <div className="h-16 bg-slate-50/60 border border-slate-100 rounded-lg" />
                <div className="flex items-center gap-2">
                  <div className="h-9 bg-slate-100 rounded-lg flex-1" />
                  <div className="h-9 bg-slate-100 rounded-lg w-9" />
                </div>
              </div>
            ))
          : paginatedRooms.map((room) => (
              <RoomCard key={room.id} room={room} onUpdate={handleUpdateRoom} />
            ))}
      </div>

      {/* 4. Thanh Điều Hướng Phân Trang (Pagination) Tinh Gọn chuẩn SaaS */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200/60 pt-5 mt-4">
          <p className="text-xs font-medium text-slate-500">
            Trang{" "}
            <span className="text-slate-900 font-semibold font-mono">
              {currentPage}
            </span>{" "}
            / {totalPages}
          </p>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-slate-200 text-slate-600 h-8 px-2.5 text-xs font-medium bg-white hover:bg-slate-50 transition-all disabled:opacity-40"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1 stroke-[1.8]" />
              Trước
            </Button>

            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                // Chỉ hiển thị các trang gần kề để giao diện sạch sẽ
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(currentPage - pageNum) <= 1
                ) {
                  return (
                    <Button
                      key={i}
                      variant={currentPage === pageNum ? "secondary" : "ghost"}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold p-0 font-mono ${
                        currentPage === pageNum
                          ? "bg-slate-900 text-white hover:bg-slate-800"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                }
                if (pageNum === 2 || pageNum === totalPages - 1) {
                  return (
                    <span
                      key={i}
                      className="text-slate-300 text-xs px-1 select-none"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-slate-200 text-slate-600 h-8 px-2.5 text-xs font-medium bg-white hover:bg-slate-50 transition-all disabled:opacity-40"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Sau
              <ChevronRight className="w-3.5 h-3.5 ml-1 stroke-[1.8]" />
            </Button>
          </div>
        </div>
      )}

      {/* 5. Khối Empty State đã được tinh chỉnh thanh nhã */}
      {!isLoading && filteredAndSortedRooms.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 max-w-xl mx-auto shadow-2xs">
          <div className="p-3 bg-slate-50 rounded-full border border-slate-100 text-slate-400 mb-4 animate-bounce duration-1000">
            <FilterX className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            Không tìm thấy căn hộ
          </h3>
          <p className="text-xs text-slate-400 max-w-xs text-center mb-4 leading-normal">
            Không tìm thấy phòng nào khớp với từ khóa hoặc cấu hình bộ lọc hiện
            tại của bạn.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg text-xs font-medium border-slate-200 shadow-2xs"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setFloorFilter("all");
            }}
          >
            Xóa toàn bộ bộ lọc
          </Button>
        </div>
      )}
    </div>
  );
}
