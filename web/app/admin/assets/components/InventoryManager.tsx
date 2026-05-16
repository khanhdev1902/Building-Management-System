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
  ChevronsUpDown,
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

// Status Style Mapping - Nhìn chuyên nghiệp và phẳng hơn
const statusStyles: Record<string, string> = {
  "Ổn định": "bg-emerald-50 text-emerald-600 border-emerald-100",
  "Bảo trì": "bg-amber-50 text-amber-600 border-amber-100",
  "Lỗi kỹ thuật": "bg-red-50 text-red-600 border-red-100",
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
    <div className="bg-white border border-slate-200 flex flex-col min-h-[600px] rounded-sm">
      {/* 1. Header Filter - Tối giản & Phẳng */}
      <div className="flex flex-col md:flex-row items-center gap-2 p-3 border-b border-slate-100 bg-slate-50/30">
        <div className="relative flex-1 min-w-[300px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={14}
          />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 h-9 bg-white border-slate-200 rounded-md text-xs font-medium focus-visible:ring-1 focus-visible:ring-slate-400 transition-all placeholder:text-slate-400"
            placeholder="Tìm theo ID hoặc tên thiết bị..."
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[150px] text-[11px] font-bold uppercase tracking-tight border-slate-200 bg-white">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                MỌI TRẠNG THÁI
              </SelectItem>
              <SelectItem value="Ổn định" className="text-xs">
                ỔN ĐỊNH
              </SelectItem>
              <SelectItem value="Bảo trì" className="text-xs">
                BẢO TRÌ
              </SelectItem>
              <SelectItem value="Lỗi kỹ thuật" className="text-xs">
                LỖI KỸ THUẬT
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={roomFilter} onValueChange={setRoomFilter}>
            <SelectTrigger className="h-9 w-[130px] text-[11px] font-bold uppercase tracking-tight border-slate-200 bg-white">
              <SelectValue placeholder="Phòng" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((r) => (
                <SelectItem key={r} value={r} className="text-xs uppercase">
                  {r === "all" ? "Tất cả phòng" : `Phòng ${r}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(search || statusFilter !== "all" || roomFilter !== "all") && (
            <Button
              onClick={resetFilters}
              variant="ghost"
              className="h-9 w-9 p-0 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* 2. Table Section - Phẳng & Thoáng */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="py-3 px-6 text-[10px] font-bold uppercase text-slate-500 tracking-widest">
                Serial
              </th>
              <th className="py-3 px-6 text-[10px] font-bold uppercase text-slate-500 tracking-widest">
                Thiết bị
              </th>
              <th className="py-3 px-6 text-[10px] font-bold uppercase text-slate-500 tracking-widest text-center">
                Vị trí
              </th>
              <th className="py-3 px-6 text-[10px] font-bold uppercase text-slate-500 tracking-widest text-center">
                Trạng thái
              </th>
              <th className="py-3 px-6 text-[10px] font-bold uppercase text-slate-500 tracking-widest text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-4 px-6 font-mono text-[11px] text-slate-400">
                    #{item.id}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-slate-900 leading-tight">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">
                        {item.category}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block px-2 py-0.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded">
                      {item.room}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${statusStyles[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal
                            size={14}
                            className="text-slate-400"
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 border-slate-100 shadow-md rounded-md"
                      >
                        <DropdownMenuItem className="text-xs font-medium gap-2 py-2 cursor-pointer">
                          <History size={14} /> Lịch sử
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs font-medium gap-2 py-2 cursor-pointer">
                          <LayoutGrid size={14} /> Chi tiết
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-32 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-40">
                    <FilterX size={40} strokeWidth={1} />
                    <p className="text-[11px] font-bold uppercase tracking-widest">
                      Không tìm thấy thiết bị
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Footer - Gọn gàng */}
      <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-white">
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
          Hiển thị{" "}
          <span className="text-slate-900 font-bold">{currentData.length}</span>{" "}
          / {filteredData.length} kết quả
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 px-3 text-[10px] font-bold uppercase border-slate-200 hover:bg-slate-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={14} className="mr-1" /> Trước
          </Button>
          <div className="text-[11px] font-bold w-8 text-center text-slate-600">
            {currentPage}
          </div>
          <Button
            variant="outline"
            className="h-8 px-3 text-[10px] font-bold uppercase border-slate-200 hover:bg-slate-50"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Sau <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
