"use client";

import React from "react";
import {
  Search,
  X,
  RotateCcw,
  ChevronDown,
  Building2,
  LayoutGrid,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

interface FilterToolbarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  activeFloor: string;
  setActiveFloor: (val: string) => void;
  activeStatus: string;
  setActiveStatus: (val: string) => void;
  onReset: () => void;
}

export const FilterToolbar = ({
  searchTerm,
  setSearchTerm,
  activeFloor,
  setActiveFloor,
  activeStatus,
  setActiveStatus,
  onReset,
}: FilterToolbarProps) => {
  // Giả sử có 100 tầng
  const floors = Array.from({ length: 100 }, (_, i) => (i + 1).toString());

  return (
    <div className="bg-white p-2 md:p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-3">
      {/* 1. Search Bar - Chiếm phần lớn diện tích */}
      <div className="relative flex-1 w-full group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        <Input
          placeholder="Số phòng, tên khách..."
          className="pl-11 max-w-96 border-none bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500/10 rounded-xl h-11 text-sm font-medium transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full"
          >
            <X className="w-3 h-3 text-slate-500" />
          </button>
        )}
      </div>

      {/* 2. Dropdown Chọn Tầng - Cân mọi số lượng tầng */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-11 rounded-xl border-slate-200 gap-2 font-bold text-slate-600 min-w-[120px] justify-between"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-500" />
              <span>
                {activeFloor === "all" ? "Tất cả tầng" : `Tầng ${activeFloor}`}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[200px] rounded-xl p-2 shadow-xl border-slate-100"
        >
          <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400">
            Chọn tầng nhanh
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => setActiveFloor("all")}
            className="rounded-lg font-bold"
          >
            Tất cả tầng
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-3 gap-1 p-1">
              {floors.map((f) => (
                <DropdownMenuItem
                  key={f}
                  onClick={() => setActiveFloor(f)}
                  className={`justify-center rounded-lg font-bold text-xs h-10 ${activeFloor === f ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-600"}`}
                >
                  {f}
                </DropdownMenuItem>
              ))}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 3. Dropdown Trạng thái - Gọn gàng */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-11 rounded-xl border-slate-200 gap-2 font-bold text-slate-600 min-w-[130px] justify-between"
          >
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-indigo-500" />
              <span>
                {activeStatus === "all"
                  ? "Mọi trạng thái"
                  : activeStatus === "done"
                    ? "Đã chốt"
                    : "Chưa chốt"}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[180px] rounded-xl p-2 shadow-xl border-slate-100"
        >
          <DropdownMenuItem
            onClick={() => setActiveStatus("all")}
            className="rounded-lg font-bold"
          >
            Tất cả
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setActiveStatus("pending")}
            className="rounded-lg font-bold text-amber-600"
          >
            Chưa chốt
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setActiveStatus("done")}
            className="rounded-lg font-bold text-emerald-600"
          >
            Đã chốt
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-6 bg-slate-100 hidden md:block" />

      {/* 4. Reset Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onReset}
        className="h-11 w-11 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
        title="Làm mới bộ lọc"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
    </div>
  );
};
