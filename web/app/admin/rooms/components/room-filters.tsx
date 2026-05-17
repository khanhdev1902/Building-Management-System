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

  // Tính năng cao cấp: Bấm phím '/' tự động focus ô tìm kiếm
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
    <div className="flex flex-col md:flex-row items-center gap-2.5 w-full bg-white/80 backdrop-blur-md p-2 rounded-xl border border-slate-200/70 shadow-[0_2px_8px_-3px_rgba(15,23,42,0.05)] sticky top-4 z-20 transition-all duration-300">
      {/* 1. Thanh tìm kiếm thông minh */}
      <div className="relative flex-1 w-full group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-800 transition-colors stroke-[1.5]" />
        <Input
          ref={inputRef}
          placeholder="Tìm kiếm số phòng, tên khách thuê..."
          className="w-full pl-9 pr-12 h-10 bg-slate-50/50 border border-slate-200/60 focus-visible:border-slate-400 focus-visible:ring-0 focus-visible:bg-white rounded-lg text-sm font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Chỉ báo phím tắt hoặc nút Xóa nhanh */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm("")}
              className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex h-5 select-none pointer-events-none items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-400 shadow-2xs">
              <span className="text-[9px]">/</span>
            </kbd>
          )}
        </div>
      </div>

      {/* 2. Cụm bộ lọc Dropdown phân lớp */}
      <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
        {/* Bộ lọc Tầng */}
        <Select value={floorFilter} onValueChange={setFloorFilter}>
          <SelectTrigger className="w-full md:w-32 h-10 border border-slate-200/80 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50 rounded-lg text-xs font-semibold tracking-tight transition-all shadow-2xs">
            <div className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-slate-400 stroke-[1.5]" />
              <SelectValue placeholder="Chọn vị trí tầng" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-lg border-slate-200 shadow-lg p-1">
            <SelectItem
              value="all"
              className="text-xs font-medium rounded-md focus:bg-slate-50 focus:text-slate-900"
            >
              Toàn bộ tòa nhà
            </SelectItem>
            {[1, 2, 3, 4, 5].map((f) => (
              <SelectItem
                key={f}
                value={f.toString()}
                className="text-xs rounded-md focus:bg-slate-50 focus:text-slate-900"
              >
                Tầng trung tâm {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Bộ lọc Trạng thái phòng */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-34 h-10 border border-slate-200/80 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50 rounded-lg text-xs font-semibold tracking-tight transition-all shadow-2xs">
            <div className="flex items-center gap-1.5">
              <ListFilter className="h-3.5 w-3.5 text-slate-400 stroke-[1.5]" />
              <SelectValue placeholder="Trạng thái" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-lg border-slate-200 shadow-lg p-1">
            <SelectItem value="all" className="text-xs font-medium rounded-md">
              Mọi trạng thái
            </SelectItem>
            <SelectItem
              value="AVAILABLE"
              className="text-xs rounded-md focus:bg-emerald-50/50 focus:text-emerald-700"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
              Căn hộ trống
            </SelectItem>
            <SelectItem
              value="OCCUPIED"
              className="text-xs rounded-md focus:bg-blue-50/50 focus:text-blue-700"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
              Đang vận hành
            </SelectItem>
            <SelectItem
              value="MAINTENACE"
              className="text-xs rounded-md focus:bg-amber-50/50 focus:text-amber-700"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-2" />
              Đang bảo trì
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Nút Reset bộ lọc tối giản hiệu ứng Smooth */}
        {hasFilter && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm("");
              setFloorFilter("all");
              setStatusFilter("all");
            }}
            className="h-10 px-3 hover:bg-rose-50/60 text-rose-600 hover:text-rose-700 rounded-lg transition-all text-xs font-bold shrink-0 border border-dashed border-rose-200 hover:border-rose-300 bg-rose-50/20"
          >
            <X className="h-3.5 w-3.5 mr-1 stroke-2" />
            <span className="hidden md:inline uppercase tracking-wider text-[10px]">
              Xóa lọc
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
