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

// Interface map khớp 100% với Schema của Page tổng
interface FilterValues {
  floor: string;
  roomNumber: string;
  province: string;
  gender: string;
  identityVerified: string;
  hasVehicle: string;
}

interface TenantFilterToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: FilterValues;
  onFiltersChange: (newFilters: FilterValues) => void;
}

export function TenantFilterToolbar({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
}: TenantFilterToolbarProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Kích hoạt cập nhật động trường lọc tương ứng
  const handleUpdateFilter = (key: keyof FilterValues, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  // Reset toàn bộ khay lọc nâng cao về trạng thái ban đầu
  const handleResetFilters = () => {
    onFiltersChange({
      floor: "all",
      roomNumber: "all",
      province: "all",
      gender: "all",
      identityVerified: "all",
      hasVehicle: "all",
    });
    setPopoverOpen(false);
  };

  // Kiểm tra xem hệ thống có đang kích hoạt bất kỳ bộ lọc chuyên sâu nào không
  const hasActiveFilters =
    filters.floor !== "all" ||
    filters.roomNumber !== "all" ||
    filters.province !== "all" ||
    filters.gender !== "all" ||
    filters.identityVerified !== "all" ||
    filters.hasVehicle !== "all";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 w-full select-none">
      {/* 1. Ô Tìm kiếm văn bản phẳng sắc nét */}
      <div className="relative flex-1 w-full group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-800 transition-colors stroke-[1.5]" />
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm nhanh theo mã số định danh TEN, họ tên cư dân hoặc số điện thoại..."
          className="w-full pl-9 pr-4 h-10 bg-white border border-slate-200/80 focus-visible:border-slate-400 focus-visible:ring-0 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal transition-all"
        />
      </div>

      {/* 2. Nút Popover điều phối ma trận lọc */}
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
            className="w-80 p-4 rounded-xl border border-slate-200/80 bg-white shadow-lg space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
              <SlidersHorizontal
                size={13}
                className="text-slate-500 stroke-[1.8]"
              />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Cấu hình bộ lọc nhân khẩu
              </h4>
            </div>

            {/* LƯỚI KHAY LỌC PHÂN RÃ CHI TIẾT */}
            <div className="space-y-3.5">
              {/* Cụm 1: Vị trí phòng ốc (Gồm Tầng và đích danh Số phòng) */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Vị trí Tầng
                  </label>
                  <Select
                    value={filters.floor}
                    onValueChange={(val) => handleUpdateFilter("floor", val)}
                  >
                    <SelectTrigger className="h-8.5 text-xs font-medium border-slate-200/80 bg-slate-50/30 focus:ring-0">
                      <SelectValue placeholder="Tầng" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg text-xs">
                      <SelectItem value="all">Tất cả tầng</SelectItem>
                      <SelectItem value="1">Tầng 1</SelectItem>
                      <SelectItem value="2">Tầng 2</SelectItem>
                      <SelectItem value="3">Tầng 3</SelectItem>
                      <SelectItem value="4">Tầng 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Số phòng căn hộ
                  </label>
                  <Select
                    value={filters.roomNumber}
                    onValueChange={(val) =>
                      handleUpdateFilter("roomNumber", val)
                    }
                  >
                    <SelectTrigger className="h-8.5 text-xs font-medium border-slate-200/80 bg-slate-50/30 focus:ring-0">
                      <SelectValue placeholder="Số phòng" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg text-xs">
                      <SelectItem value="all">Mọi phòng</SelectItem>
                      <SelectItem value="101">Phòng 101</SelectItem>
                      <SelectItem value="104">Phòng 104</SelectItem>
                      <SelectItem value="202">Phòng 202</SelectItem>
                      <SelectItem value="302">Phòng 302</SelectItem>
                      <SelectItem value="405">Phòng 405</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Cụm 2: Địa lý quê quán đăng ký gốc */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Nguyên quán (Tỉnh / Thành)
                </label>
                <Select
                  value={filters.province}
                  onValueChange={(val) => handleUpdateFilter("province", val)}
                >
                  <SelectTrigger className="h-8.5 text-xs font-medium border-slate-200/80 bg-slate-50/30 focus:ring-0">
                    <SelectValue placeholder="Chọn Tỉnh / Thành" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg text-xs">
                    <SelectItem value="all">Tất cả các tỉnh thành</SelectItem>
                    <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                    <SelectItem value="Hưng Yên">Hưng Yên</SelectItem>
                    <SelectItem value="Hải Phòng">Hải Phòng</SelectItem>
                    <SelectItem value="Thanh Hóa">Thanh Hóa</SelectItem>
                    <SelectItem value="Nghệ An">Nghệ An</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cụm 3: Giới tính trắc học */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Giới tính
                </label>
                <Select
                  value={filters.gender}
                  onValueChange={(val) => handleUpdateFilter("gender", val)}
                >
                  <SelectTrigger className="h-8.5 text-xs font-medium border-slate-200/80 bg-slate-50/30 focus:ring-0">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg text-xs">
                    <SelectItem value="all">Mọi giới tính</SelectItem>
                    <SelectItem value="Nam">Nam giới</SelectItem>
                    <SelectItem value="Nữ">Nữ giới</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cụm 4: Hồ sơ pháp lý CCCD */}
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
                  <SelectTrigger className="h-8.5 text-xs font-medium border-slate-200/80 bg-slate-50/30 focus:ring-0">
                    <SelectValue placeholder="Tình trạng hồ sơ" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg text-xs">
                    <SelectItem value="all">Tất cả tình trạng</SelectItem>
                    <SelectItem value="verified">
                      Đã đối chiếu xác minh
                    </SelectItem>
                    <SelectItem value="unverified">
                      Chưa nộp ảnh CCCD gốc
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cụm 5: Chiếm dụng bãi giữ xe */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Phương tiện gửi tại hầm
                </label>
                <Select
                  value={filters.hasVehicle}
                  onValueChange={(val) => handleUpdateFilter("hasVehicle", val)}
                >
                  <SelectTrigger className="h-8.5 text-xs font-medium border-slate-200/80 bg-slate-50/30 focus:ring-0">
                    <SelectValue placeholder="Chọn trạng thái xe" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg text-xs">
                    <SelectItem value="all">Tất cả danh sách</SelectItem>
                    <SelectItem value="yes">Có đăng ký biển số xe</SelectItem>
                    <SelectItem value="no">Không sử dụng bãi xe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Nút Clear toàn bộ ma trận lọc */}
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
