"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface FilterToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;

  // Trạng thái hệ thống lọc nâng cao truyền ra file Page tổng
  filters: {
    tower: string;
    room: string;
    status: string;
    paymentStatus: string;
    minPrice: string;
    maxPrice: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFiltersChange: (newFilters: any) => void;
}

export function ContractFilterToolbar({
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  filters,
  onFiltersChange,
}: FilterToolbarProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Hàm cập nhật cục bộ từng trường lọc
  const handleUpdateFilter = (key: string, value: string) => {
    console.log(value);
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  // Hàm làm mới toàn bộ bộ lọc về trạng thái mặc định ban đầu
  const handleResetFilters = () => {
    onFiltersChange({
      tower: "all",
      room: "all",
      status: "all",
      paymentStatus: "all",
      minPrice: "",
      maxPrice: "",
    });
    setPopoverOpen(false);
  };

  const hasActiveFilters =
    filters.tower !== "all" ||
    filters.room !== "all" ||
    filters.status !== "all" ||
    filters.paymentStatus !== "all" ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 w-full select-none">
      {/* 1. Thanh tìm kiếm dẹt lì đồng bộ viền mảnh hạt cát */}
      <div className="relative flex-1 w-full group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-800 transition-colors stroke-[1.5]" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm nhanh theo mã hợp đồng, số phòng hoặc tên cư dân ký kết..."
          className="w-full pl-9 pr-4 h-10 bg-white border border-slate-200/80 focus-visible:border-slate-400 focus-visible:ring-0 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal transition-all"
        />
      </div>

      {/* Cụm điều khiển tác vụ nâng cao bên phải */}
      <div className="flex items-center gap-2 shrink-0 justify-end w-full sm:w-auto">
        {/* 2. POPOVER BỘ LỌC NÂNG CAO: Tinh xảo, giải quyết triệt để nghiệp vụ */}
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`h-10 rounded-lg border text-xs font-semibold px-3.5 gap-1.5 bg-white shadow-2xs transition-colors ${
                hasActiveFilters
                  ? "border-indigo-200 bg-indigo-50/30 text-indigo-700 hover:bg-indigo-50/50 hover:border-indigo-300"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Filter
                className={`w-3.5 h-3.5 ${hasActiveFilters ? "text-indigo-600" : "text-slate-400"} stroke-[1.75]`}
              />
              <span>Bộ lọc chuyên sâu</span>
              {hasActiveFilters && (
                <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-600 ml-0.5 animate-pulse" />
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={6}
            className="w-85 p-4 rounded-xl border border-slate-200/80 bg-white shadow-lg space-y-4"
          >
            {/* Tiêu đề Popover */}
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
              <SlidersHorizontal
                size={13}
                className="text-slate-500 stroke-[1.8]"
              />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Cấu hình bộ lọc nâng cao
              </h4>
            </div>

            {/* Nội dung lưới form các bộ lọc chuyên sâu */}
            <div className="space-y-3.5">
              {/* Hàng 1: Lọc Block Tòa nhà & Phòng */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Block / Tòa nhà
                  </label>
                  <Select
                    value={filters.tower}
                    onValueChange={(val) => handleUpdateFilter("tower", val)}
                  >
                    <SelectTrigger className="h-8.5 text-xs font-medium border-slate-200/80 bg-slate-50/30 text-slate-700 rounded-md focus:ring-0">
                      <SelectValue placeholder="Chọn tòa" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-slate-200">
                      <SelectItem value="all" className="text-xs">
                        Tất cả
                      </SelectItem>
                      <SelectItem
                        value="Danjin Building"
                        className="text-xs uppercase"
                      >
                        Danjin Building
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Số phòng căn hộ
                  </label>
                  <Select
                    value={filters.room}
                    onValueChange={(val) => handleUpdateFilter("room", val)}
                  >
                    <SelectTrigger className="h-8.5 text-xs font-medium border-slate-200/80 bg-slate-50/30 text-slate-700 rounded-md focus:ring-0">
                      <SelectValue placeholder="Chọn phòng" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-slate-200">
                      <SelectItem value="all" className="text-xs">
                        Tất cả phòng
                      </SelectItem>
                      <SelectItem value="101" className="text-xs">
                        P.101
                      </SelectItem>
                      <SelectItem value="202" className="text-xs">
                        P.202
                      </SelectItem>
                      <SelectItem value="305" className="text-xs">
                        P.305
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Hàng 2: Lọc Tình trạng hợp đồng & Trạng thái đóng cọc */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Tình trạng pháp lý
                  </label>
                  <Select
                    value={filters.status}
                    onValueChange={(val) => handleUpdateFilter("status", val)}
                  >
                    <SelectTrigger className="h-8.5 text-xs font-medium border-slate-200/80 bg-slate-50/30 text-slate-700 rounded-md focus:ring-0">
                      <SelectValue placeholder="Chọn tình trạng" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-slate-200">
                      <SelectItem value="all" className="text-xs">
                        Mọi tình trạng
                      </SelectItem>
                      <SelectItem value="ACTIVE" className="text-xs">
                        Đang hiệu lực
                      </SelectItem>
                      <SelectItem value="EXPIRING" className="text-xs">
                        Sắp hết hạn
                      </SelectItem>
                      <SelectItem value="EXPIRED" className="text-xs">
                        Đã kết thúc
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Bảo lưu quỹ cọc
                  </label>
                  <Select
                    value={filters.paymentStatus}
                    onValueChange={(val) =>
                      handleUpdateFilter("paymentStatus", val)
                    }
                  >
                    <SelectTrigger className="h-8.5 text-xs font-medium border-slate-200/80 bg-slate-50/30 text-slate-700 rounded-md focus:ring-0">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-slate-200">
                      <SelectItem value="all" className="text-xs">
                        Tất cả trạng thái
                      </SelectItem>
                      <SelectItem value="paid" className="text-xs">
                        Đã giữ đủ cọc
                      </SelectItem>
                      <SelectItem value="partial" className="text-xs">
                        Còn nộp thiếu cọc
                      </SelectItem>
                      <SelectItem value="unpaid" className="text-xs">
                        Chưa đóng tiền cọc
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                  Khoảng đơn giá thuê / Tháng
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Từ mức tiền"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleUpdateFilter("minPrice", e.target.value)
                    }
                    className="h-8 rounded border-slate-200 bg-slate-50/30 text-xs focus-visible:border-slate-400 focus-visible:bg-white focus-visible:ring-0 w-full"
                  />
                  <span className="text-slate-300 font-sans text-xs">─</span>
                  <Input
                    type="number"
                    placeholder="Đến mức tiền"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleUpdateFilter("maxPrice", e.target.value)
                    }
                    className="h-8 rounded border-slate-200 bg-slate-50/30 text-xs focus-visible:border-slate-400 focus-visible:bg-white focus-visible:ring-0 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Cụm nút bấm điều khiển Footer Popover */}
            {hasActiveFilters && (
              <div className="flex justify-end pt-2 border-t border-slate-100">
                <Button
                  onClick={handleResetFilters}
                  variant="ghost"
                  className="h-8 px-2.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50/60 rounded-md text-xs font-medium flex items-center gap-1 w-full justify-center border border-dashed border-rose-200"
                >
                  <RotateCcw size={12} className="stroke-2" />
                  <span>Xóa toàn bộ bộ lọc đang chạy</span>
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/40 h-10 items-center shrink-0">
          <button
            onClick={() => onViewModeChange("list")}
            className={`h-8 px-2.5 rounded-md transition-all flex items-center justify-center ${
              viewMode === "list"
                ? "bg-white shadow-2xs text-slate-900"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <List className="w-3.5 h-3.5 stroke-[1.8]" />
          </button>
          <button
            onClick={() => onViewModeChange("grid")}
            className={`h-8 px-2.5 rounded-md transition-all flex items-center justify-center ${
              viewMode === "grid"
                ? "bg-white shadow-2xs text-slate-900"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 stroke-[1.8]" />
          </button>
        </div>
      </div>
    </div>
  );
}
