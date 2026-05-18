"use client";

import React, { useState } from "react";
import { Search, Filter, SlidersHorizontal, RotateCcw } from "lucide-react";
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

interface TenantFilterToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;

  // Cấu hình State bộ lọc nâng cao truyền ngược ra file Page tổng
  filters: {
    floor: string;
    identityVerified: string;
    hasVehicle: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFiltersChange: (newFilters: any) => void;
}

export function TenantFilterToolbar({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
}: TenantFilterToolbarProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Hàm cập nhật động từng trường lọc nội bộ
  const handleUpdateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  // Hàm xóa bộ lọc, đưa mọi thứ về trạng thái ban đầu
  const handleResetFilters = () => {
    onFiltersChange({
      floor: "all",
      identityVerified: "all",
      hasVehicle: "all",
    });
    setPopoverOpen(false);
  };

  const hasActiveFilters =
    filters.floor !== "all" ||
    filters.identityVerified !== "all" ||
    filters.hasVehicle !== "all";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 w-full select-none">
      {/* 1. Ô Input Tìm kiếm phẳng dẹt sắc nét */}
      <div className="relative flex-1 w-full group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-800 transition-colors stroke-[1.5]" />
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm nhanh theo mã số định danh TEN, họ tên cư dân hoặc số điện thoại..."
          className="w-full pl-9 pr-4 h-10 bg-white border border-slate-200/80 focus-visible:border-slate-400 focus-visible:ring-0 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal transition-all"
        />
      </div>

      {/* Cụm điều khiển Bộ Lọc Chuyên Sâu bên phải */}
      <div className="flex items-center gap-2 shrink-0 justify-end w-full sm:w-auto">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`h-10 rounded-lg border text-xs font-semibold px-3.5 gap-1.5 bg-white shadow-2xs transition-all duration-200 ${
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
            className="w-70 p-4 rounded-xl border border-slate-200/80 bg-white shadow-lg space-y-4"
          >
            {/* Tiêu đề Popover */}
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
              <SlidersHorizontal
                size={13}
                className="text-slate-500 stroke-[1.8]"
              />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Cấu hình bộ lọc nhân khẩu
              </h4>
            </div>

            {/* Các trường lọc nghiệp vụ thực tế */}
            <div className="space-y-3.5">
              {/* Lọc theo Vị trí Tầng tòa nhà */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Vị trí Tầng căn hộ
                </label>
                <Select
                  value={filters.floor}
                  onValueChange={(val) => handleUpdateFilter("floor", val)}
                >
                  <SelectTrigger className="h-8.5 text-xs font-medium border-slate-200/80 bg-slate-50/30 text-slate-700 rounded-md focus:ring-0">
                    <SelectValue placeholder="Chọn vị trí tầng" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-slate-200">
                    <SelectItem value="all" className="text-xs">
                      Tất cả các tầng
                    </SelectItem>
                    <SelectItem value="1" className="text-xs">
                      Tầng 1 (Khu 1xx)
                    </SelectItem>
                    <SelectItem value="2" className="text-xs">
                      Tầng 2 (Khu 2xx)
                    </SelectItem>
                    <SelectItem value="3" className="text-xs">
                      Tầng 3 (Khu 3xx)
                    </SelectItem>
                    <SelectItem value="4" className="text-xs">
                      Tầng 4 (Khu 4xx)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lọc theo Tình trạng Xác minh hồ sơ pháp lý */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Hồ sơ định danh (CCCD)
                </label>
                <Select
                  value={filters.identityVerified}
                  onValueChange={(val) =>
                    handleUpdateFilter("identityVerified", val)
                  }
                >
                  <SelectTrigger className="h-8.5 text-xs font-medium border-slate-200/80 bg-slate-50/30 text-slate-700 rounded-md focus:ring-0">
                    <SelectValue placeholder="Trạng thái hồ sơ" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-slate-200">
                    <SelectItem value="all" className="text-xs">
                      Tất cả tình trạng
                    </SelectItem>
                    <SelectItem value="verified" className="text-xs">
                      Đã đối chiếu xác minh
                    </SelectItem>
                    <SelectItem value="unverified" className="text-xs">
                      Chưa nộp ảnh CCCD gốc
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lọc theo Đăng ký Phương tiện (Thẻ gửi xe) */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Phương tiện gửi tại hầm
                </label>
                <Select
                  value={filters.hasVehicle}
                  onValueChange={(val) => handleUpdateFilter("hasVehicle", val)}
                >
                  <SelectTrigger className="h-8.5 text-xs font-medium border-slate-200/80 bg-slate-50/30 text-slate-700 rounded-md focus:ring-0">
                    <SelectValue placeholder="Chọn trạng thái xe" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-slate-200">
                    <SelectItem value="all" className="text-xs">
                      Tất cả danh sách
                    </SelectItem>
                    <SelectItem value="yes" className="text-xs">
                      Có đăng ký biển số xe
                    </SelectItem>
                    <SelectItem value="no" className="text-xs">
                      Không sử dụng bãi xe
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Nút Clear nhanh toàn bộ bộ lọc */}
            {hasActiveFilters && (
              <div className="flex justify-end pt-2 border-t border-slate-100">
                <Button
                  onClick={handleResetFilters}
                  variant="ghost"
                  className="h-8 px-2.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50/60 rounded-md text-xs font-medium flex items-center gap-1 w-full justify-center border border-dashed border-rose-200/80"
                >
                  <RotateCcw size={12} className="stroke-2" />
                  <span>Xóa bộ lọc nhân khẩu đang chạy</span>
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
