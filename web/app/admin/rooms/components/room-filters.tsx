"use client";

import React from "react";
import { Search, Layers, ListFilter, X, SlidersHorizontal } from "lucide-react";
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
  const hasFilter =
    searchTerm || statusFilter !== "all" || floorFilter !== "all";

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full bg-slate-100/50 p-2 rounded-2xl border border-slate-200/60 backdrop-blur-sm sticky top-4 z-20">
      {/* 1. Search Box - Chiếm trọn không gian chính */}
      <div className="relative flex-1 w-full group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        <Input
          placeholder="Nhấn '/' để tìm kiếm nhanh..."
          className="w-full pl-10 pr-4 h-11 bg-white border-none shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500/20 rounded-xl text-sm font-medium placeholder:text-slate-400 placeholder:font-normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-md text-slate-400"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* 2. Filters Group */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        {/* Floor Select */}
        <Select value={floorFilter} onValueChange={setFloorFilter}>
          <SelectTrigger className="w-full md:w-32.5 h-11 border-none bg-white shadow-sm rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <div className="flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              <SelectValue placeholder="Tất cả tầng" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-100 shadow-xl">
            <SelectItem value="all" className="text-xs font-medium">
              Toàn bộ tòa nhà
            </SelectItem>
            {[1, 2, 3, 4, 5].map((f) => (
              <SelectItem key={f} value={f.toString()} className="text-xs">
                Tầng {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Select */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-35 h-11 border-none bg-white shadow-sm rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <div className="flex items-center gap-2">
              <ListFilter className="h-3.5 w-3.5 text-slate-400" />
              <SelectValue placeholder="Trạng thái" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-100 shadow-xl">
            <SelectItem value="all" className="text-xs font-medium">
              Mọi trạng thái
            </SelectItem>
            <SelectItem value="available" className="text-xs text-emerald-600">
              ● Sẵn sàng
            </SelectItem>
            <SelectItem value="occupied" className="text-xs text-amber-600">
              ● Đã thuê
            </SelectItem>
            <SelectItem value="maintenance" className="text-xs text-rose-600">
              ● Bảo trì
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters Badge */}
        {hasFilter && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm("");
              setFloorFilter("all");
              setStatusFilter("all");
            }}
            className="h-11 px-3 hover:bg-rose-50 text-rose-500 rounded-xl transition-all group"
          >
            <SlidersHorizontal className="h-4 w-4 md:mr-2 group-hover:rotate-180 transition-transform duration-500" />
            <span className="hidden md:inline text-xs font-black uppercase tracking-tighter">
              Xóa lọc
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
