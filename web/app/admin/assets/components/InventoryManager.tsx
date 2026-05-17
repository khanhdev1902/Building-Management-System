"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  History,
  LayoutGrid,
  FilterX,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { RAW_DATA } from "../data";

// Định nghĩa Style Trạng thái phẳng, lì và cao cấp hơn
const statusStyles: Record<string, { dot: string; text: string }> = {
  "Ổn định": {
    dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]",
    text: "text-emerald-700 bg-emerald-50/50 border-emerald-100/50",
  },
  "Bảo trì": {
    dot: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]",
    text: "text-amber-700 bg-amber-50/50 border-amber-100/50",
  },
  "Lỗi kỹ thuật": {
    dot: "bg-rose-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]",
    text: "text-rose-700 bg-rose-50/50 border-rose-100/50",
  },
};

export function InventoryManager() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");
  const itemsPerPage = 8;

  const rooms = useMemo(
    () => ["all", ...new Set(RAW_DATA.map((d) => d.room))],
    [],
  );

  const filteredData = useMemo(() => {
    return RAW_DATA.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchRoom = roomFilter === "all" || item.room === roomFilter;
      return matchSearch && matchStatus && matchRoom;
    });
  }, [search, statusFilter, roomFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setRoomFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="bg-white border border-slate-200/80 flex flex-col min-h-145 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01),0_10px_30px_-12px_rgba(15,23,42,0.03)] transition-all">
      {/* 1. Toolbar Điều khiển: Đồng bộ chiều cao h-10 phẳng lì */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 border-b border-slate-100 bg-slate-50/30">
        <div className="relative w-full sm:flex-1 min-w-0 sm:min-w-70">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 stroke-[1.5]"
            size={14}
          />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8.5 h-9 bg-white border-slate-200 focus-visible:border-slate-400 focus-visible:ring-0 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 transition-all"
            placeholder="Tìm mã thiết bị hoặc tên linh kiện..."
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-36 text-xs font-medium border-slate-200 bg-white text-slate-600 rounded-lg shadow-2xs hover:bg-slate-50/50">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-slate-200 shadow-md">
              <SelectItem value="all" className="text-xs">
                Mọi trạng thái
              </SelectItem>
              <SelectItem value="Ổn định" className="text-xs">
                Ổn định vận hành
              </SelectItem>
              <SelectItem value="Bảo trì" className="text-xs">
                Đang bảo trì
              </SelectItem>
              <SelectItem value="Lỗi kỹ thuật" className="text-xs">
                Lỗi kỹ thuật
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={roomFilter} onValueChange={setRoomFilter}>
            <SelectTrigger className="h-9 w-32 text-xs font-medium border-slate-200 bg-white text-slate-600 rounded-lg shadow-2xs hover:bg-slate-50/50">
              <SelectValue placeholder="Vị trí phòng" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-slate-200 shadow-md">
              {rooms.map((r) => (
                <SelectItem key={r} value={r} className="text-xs">
                  {r === "all" ? "Tất cả phòng" : `Phòng ${r}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(search || statusFilter !== "all" || roomFilter !== "all") && (
            <Button
              onClick={resetFilters}
              variant="ghost"
              className="h-9 px-2.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50/60 rounded-lg transition-colors border border-dashed border-rose-200 bg-rose-50/10 text-xs font-medium"
            >
              <Trash2 size={13} className="mr-1 stroke-[1.8]" />
              Xóa lọc
            </Button>
          )}
        </div>
      </div>

      {/* 2. Khối Data Table: Phẳng, mịn và thoáng đãng */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse table-fixed min-w-162.5">
          <thead>
            <tr className="bg-slate-50/30 border-b border-slate-100/80">
              <th className="w-[12%] py-3 px-5 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Mã thiết bị
              </th>
              <th className="w-[45%] py-3 px-5 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Tên tài sản hệ thống
              </th>
              <th className="w-[18%] py-3 px-5 text-[10px] font-semibold uppercase text-slate-400 tracking-wider text-center">
                Vị trí lắp đặt
              </th>
              <th className="w-[18%] py-3 px-5 text-[10px] font-semibold uppercase text-slate-400 tracking-wider text-center">
                Tình trạng
              </th>
              <th className="w-[7%] py-3 px-5 text-[10px] font-semibold uppercase text-slate-400 tracking-wider text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60">
            {currentData.length > 0 ? (
              currentData.map((item) => {
                const currentStatus = statusStyles[item.status] || {
                  dot: "bg-slate-400",
                  text: "text-slate-600 bg-slate-50 border-slate-200",
                };
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/40 transition-colors group"
                  >
                    <td className="py-3 px-5 font-mono text-[11px] text-slate-400 font-medium">
                      #{item.id}
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-slate-800 truncate leading-tight group-hover:text-indigo-600 transition-colors">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium tracking-normal mt-0.5">
                          {item.category}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <span className="text-xs font-semibold text-slate-600 font-mono">
                        P.{item.room}
                      </span>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${currentStatus.text}`}
                        >
                          <span
                            className={`w-1.2 h-1.2 rounded-full ${currentStatus.dot}`}
                          />
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-right">
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
                          className="w-36 border-slate-200/70 shadow-sm rounded-lg p-1 bg-white"
                        >
                          <DropdownMenuItem className="text-xs font-medium gap-2 py-2 cursor-pointer text-slate-600 focus:bg-slate-50 focus:text-slate-900 rounded">
                            <History size={13} className="text-slate-400" /> Xem
                            lịch sử
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs font-medium gap-2 py-2 cursor-pointer text-slate-600 focus:bg-slate-50 focus:text-slate-900 rounded">
                            <LayoutGrid size={13} className="text-slate-400" />{" "}
                            Cấu hình chi tiết
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-24 text-center">
                  <div className="flex flex-col items-center justify-center max-w-xs mx-auto text-slate-400 space-y-2">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-full text-slate-400 mb-1">
                      <FilterX size={20} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xs font-semibold text-slate-800">
                      Không có kết quả
                    </h3>
                    <p className="text-[11px] text-slate-400 text-center leading-normal">
                      Không tìm thấy thiết bị nào trùng khớp với thông số bộ lọc
                      hiện tại.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Footer Điều hướng: Tinh gọn chuẩn SaaS Workplace */}
      <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-white shrink-0">
        <p className="text-xs font-medium text-slate-400">
          Hiển thị{" "}
          <span className="text-slate-800 font-semibold font-mono">
            {currentData.length}
          </span>{" "}
          trên {filteredData.length} thiết bị
        </p>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500">
            Trang{" "}
            <span className="text-slate-900 font-semibold font-mono">
              {currentPage}
            </span>{" "}
            / {totalPages || 1}
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-md border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all disabled:opacity-40"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={13} className="stroke-[1.8]" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-md border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all disabled:opacity-40"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight size={13} className="stroke-[1.8]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
