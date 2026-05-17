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
  // Tạo mảng danh sách 100 tầng
  const floors = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
  const hasFilter =
    searchTerm || activeFloor !== "all" || activeStatus !== "all";

  return (
    <div className="bg-white/80 backdrop-blur-md p-2 rounded-xl border border-slate-200/80 flex flex-col md:flex-row items-center gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] w-full">
      {/* 1. Thanh tìm kiếm đồng bộ viền mảnh */}
      <div className="relative flex-1 w-full group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors stroke-[1.5]" />
        <Input
          placeholder="Tìm theo số phòng, tên cư dân..."
          className="w-full pl-9 pr-10 h-10 bg-slate-50/50 border border-slate-200/70 focus-visible:border-slate-400 focus-visible:bg-white focus-visible:ring-0 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Cụm điều khiển Dropdown */}
      <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
        {/* 2. Dropdown Chọn Tầng thông minh */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={`h-10 rounded-lg border text-xs font-semibold px-3 gap-2 min-w-31.25 justify-between transition-all bg-white shadow-2xs ${
                activeFloor !== "all"
                  ? "border-indigo-200 bg-indigo-50/30 text-indigo-700 hover:bg-indigo-50/50 hover:border-indigo-300"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <Building2
                  className={`w-3.5 h-3.5 stroke-[1.5] ${activeFloor !== "all" ? "text-indigo-600" : "text-slate-400"}`}
                />
                <span className="truncate">
                  {activeFloor === "all"
                    ? "Tất cả tầng"
                    : `Tầng ${activeFloor}`}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 opacity-80 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52.5 rounded-xl p-1.5 shadow-lg border border-slate-200 bg-white"
          >
            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1.5">
              Sơ đồ tầng tòa nhà
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setActiveFloor("all")}
              className="rounded-lg text-xs font-medium text-slate-700 py-1.5 focus:bg-slate-50"
            >
              Hiển thị tất cả tầng
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 border-slate-100" />
            <ScrollArea className="h-60 pr-1">
              <div className="grid grid-cols-3 gap-1 p-0.5">
                {floors.map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setActiveFloor(f);
                    }}
                    className={`flex items-center justify-center rounded-md text-xs font-mono font-semibold h-8 border transition-all ${
                      activeFloor === f
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 3. Dropdown Trạng thái tinh gọn */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={`h-10 rounded-lg border text-xs font-semibold px-3 gap-2 min-w-32.5 justify-between transition-all bg-white shadow-2xs ${
                activeStatus !== "all"
                  ? "border-indigo-200 bg-indigo-50/30 text-indigo-700 hover:bg-indigo-50/50 hover:border-indigo-300"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <LayoutGrid
                  className={`w-3.5 h-3.5 stroke-[1.5] ${activeStatus !== "all" ? "text-indigo-600" : "text-slate-400"}`}
                />
                <span>
                  {activeStatus === "all"
                    ? "Mọi trạng thái"
                    : activeStatus === "done"
                      ? "Đã chốt sổ"
                      : "Chưa chốt"}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 opacity-80 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 rounded-lg p-1 shadow-lg border border-slate-200 bg-white"
          >
            <DropdownMenuItem
              onClick={() => setActiveStatus("all")}
              className="rounded-md text-xs font-medium text-slate-700 py-2 focus:bg-slate-50"
            >
              Mọi trạng thái
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setActiveStatus("pending")}
              className="rounded-md text-xs font-medium text-amber-600 py-2 focus:bg-amber-50/50 focus:text-amber-700"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-2" />
              Chưa chốt số
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setActiveStatus("done")}
              className="rounded-md text-xs font-medium text-emerald-600 py-2 focus:bg-emerald-50/50 focus:text-emerald-700"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
              Đã chốt sổ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 4. Reset Button - Thay bằng hiệu ứng Xóa lọc dẹt phẳng tinh tế */}
        {hasFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-10 px-2.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50/60 rounded-lg transition-colors border border-dashed border-rose-200 bg-rose-50/10 text-xs font-medium shrink-0 flex items-center gap-1"
            title="Xóa tất cả bộ lọc hiện tại"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-2" />
            <span className="hidden sm:inline uppercase tracking-wider text-[10px] font-bold">
              Xóa lọc
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};
