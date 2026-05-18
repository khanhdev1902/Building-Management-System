"use client";

import React, { useEffect, useRef } from "react";
import { Search, Layers, ListFilter, X } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";

interface RoomFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  floorFilter: string;
  setFloorFilter: (value: string) => void;
}

export function RoomFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  floorFilter,
  setFloorFilter,
}: RoomFiltersProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFilter =
    searchTerm || statusFilter !== "all" || floorFilter !== "all";

  // Tính năng phím tắt: Bấm phím '/' tự động focus nhanh ô tìm kiếm
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full select-none animate-in fade-in duration-200">
      {/* 1. THANH TÌM KIẾM PHẲNG LÌ - Nhúng chìm vào trục gối nền */}
      <div className="relative flex-1 w-full group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
        <Input
          ref={inputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm nhanh số phòng, tên chủ hộ cư dân..."
          className="w-full pl-8.5 pr-10 h-8.5 bg-white border border-slate-200/80 focus-visible:border-slate-400 focus-visible:ring-0 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal transition-all shadow-2xs"
        />

        {/* Cụm phím xóa nhanh dẹt mượt */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm("")}
              className="p-0.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex h-4.5 select-none pointer-events-none items-center gap-0.5 rounded border border-slate-200/60 bg-slate-50 px-1.5 font-mono text-[9px] font-medium text-slate-400">
              <span>/</span>
            </kbd>
          )}
        </div>
      </div>

      {/* 2. CỤM BỘ LỌC DROPDOWN PHÂN LỚP DẸT MỊN H-8.5 */}
      <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0">
        {/* Bộ lọc Vị trí Tầng tòa nhà */}
        <Select value={floorFilter} onValueChange={setFloorFilter}>
          <SelectTrigger className="w-full sm:w-40 h-8.5 border border-slate-200/80 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 rounded-lg text-xs font-semibold tracking-tight transition-all shadow-2xs cursor-pointer px-2.5">
            <div className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-slate-400 stroke-[1.8]" />
              <SelectValue placeholder="Chọn vị trí tầng" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-lg border-slate-200/80 p-1 min-w-37.5">
            <SelectItem
              value="all"
              className="text-xs font-semibold rounded-md"
            >
              Toàn bộ nhà
            </SelectItem>
            {[1, 2, 3, 4, 5].map((f) => (
              <SelectItem
                key={f}
                value={f.toString()}
                className="text-xs rounded-md font-medium"
              >
                Tầng {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Bộ lọc Trạng thái dòng vận hành quỹ căn */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 h-8.5 border border-slate-200/80 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 rounded-lg text-xs font-semibold tracking-tight transition-all shadow-2xs cursor-pointer px-2.5">
            <div className="flex items-center gap-1.5">
              <ListFilter className="h-3.5 w-3.5 text-slate-400 stroke-[1.8]" />
              <SelectValue placeholder="Trạng thái" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-lg border-slate-200/80 p-1 min-w-33.75">
            <SelectItem
              value="all"
              className="text-xs font-semibold rounded-md"
            >
              Mọi trạng thái
            </SelectItem>
            <SelectItem
              value="AVAILABLE"
              className="text-xs rounded-md font-medium focus:bg-blue-50/40 focus:text-blue-700"
            >
              <span className="inline-block w-1.2 h-1.2 rounded-full bg-blue-500 mr-2" />
              Đang trống
            </SelectItem>
            <SelectItem
              value="OCCUPIED"
              className="text-xs rounded-md font-medium focus:bg-emerald-50/40 focus:text-emerald-700"
            >
              <span className="inline-block w-1.2 h-1.2 rounded-full bg-emerald-500 mr-2" />
              Đang cho thuê ở
            </SelectItem>
            <SelectItem
              value="MAINTENANCE"
              className="text-xs rounded-md font-medium focus:bg-amber-50/40 focus:text-amber-700"
            >
              <span className="inline-block w-1.2 h-1.2 rounded-full bg-amber-500 mr-2" />
              Đang bảo dưỡng
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Nút Xóa nhanh bộ lọc phẳng dẹt pastel màu rose */}
        {hasFilter && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm("");
              setFloorFilter("all");
              setStatusFilter("all");
            }}
            className="h-8.5 px-2.5 hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-dashed border-rose-200 hover:border-rose-300 bg-rose-50/30 rounded-lg text-xs font-bold shrink-0 shadow-none transition-all uppercase tracking-wider text-[10px]"
          >
            <X className="h-3.5 w-3.5 mr-1 stroke-[2.5]" />
            <span>Xóa lọc</span>
          </Button>
        )}
      </div>
    </div>
  );
}
