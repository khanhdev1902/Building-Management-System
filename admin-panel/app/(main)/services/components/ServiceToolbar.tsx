"use client";

import { Search, SlidersHorizontal, X, Check } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/utils/cn";

interface ToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export const ServiceToolbar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}: ToolbarProps) => {
  const filterOptions = [
    { label: "Tất cả trạng thái", value: "all" },
    { label: "Đang hoạt động", value: "active" },
    { label: "Cần kiểm tra", value: "warning" },
    { label: "Tạm dừng", value: "maintenance" },
  ];

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Search Box: Flat & Minimalist */}
      <div className="relative flex-1 group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
          <Search className="h-4 w-4" />
        </div>

        <Input
          placeholder="Tìm tên dịch vụ, mã..."
          className={cn(
            "pl-9 h-9 w-full bg-white border-slate-200 rounded-lg shadow-none",
            "focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500",
            "text-xs placeholder:text-slate-400 transition-all",
          )}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Filter Dropdown: Thực tế và chuyên nghiệp */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-9 px-3 rounded-lg border-slate-200 bg-white text-slate-600 font-bold text-[11px] uppercase tracking-wider transition-all shadow-none",
              statusFilter !== "all" &&
                "border-indigo-500 text-indigo-600 bg-indigo-50/30",
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-2" />
            {statusFilter === "all"
              ? "Lọc"
              : filterOptions.find((o) => o.value === statusFilter)?.label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 p-1.5 rounded-xl shadow-xl border-slate-200"
        >
          <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1.5">
            Trạng thái vận hành
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-100" />
          {filterOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg cursor-pointer text-xs font-medium"
              onClick={() => setStatusFilter(option.value)}
            >
              {option.label}
              {statusFilter === option.value && (
                <Check className="h-3.5 w-3.5 text-indigo-600" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
