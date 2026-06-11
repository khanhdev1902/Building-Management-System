import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TypeFilter = "ALL" | "FINANCE" | "MAINTENANCE" | "LIFE";
export type StatusFilter = "all" | "sent" | "scheduled" | "draft";

interface NotificationFilterBarProps {
  searchQuery: string;
  typeFilter: TypeFilter;
  statusFilter: StatusFilter;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: TypeFilter) => void;
  onStatusChange: (value: StatusFilter) => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const TYPE_TABS: { value: TypeFilter; label: string; activeClass: string }[] = [
  { value: "ALL", label: "Tất cả mục", activeClass: "text-slate-900" },
  { value: "FINANCE", label: "Tài chính", activeClass: "text-blue-600" },
  { value: "MAINTENANCE", label: "Kỹ thuật", activeClass: "text-amber-600" },
  { value: "LIFE", label: "Đời sống", activeClass: "text-emerald-600" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function NotificationFilterBar({
  searchQuery,
  typeFilter,
  statusFilter,
  onSearchChange,
  onTypeChange,
  onStatusChange,
}: NotificationFilterBarProps) {
  return (
    <section className="bg-white border-b border-slate-200/60 px-6 py-3 flex flex-col sm:flex-row items-center gap-3 justify-between select-none">
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        {/* Search */}
        <div className="relative w-full sm:w-64 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <Input
            placeholder="Tìm nội dung, đối tượng..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8.5 bg-slate-50 border-slate-200 text-xs h-8.5 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/10 focus-visible:border-blue-500 transition-all w-full"
          />
        </div>

        {/* Type tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/30 text-[11px] font-semibold">
          {TYPE_TABS.map(({ value, label, activeClass }) => (
            <button
              key={value}
              onClick={() => onTypeChange(value)}
              className={`px-3 py-1 rounded-lg transition-all ${
                typeFilter === value
                  ? `bg-white ${activeClass} shadow-3xs`
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
        <Select
          value={statusFilter}
          onValueChange={(val) => onStatusChange(val as StatusFilter)}
        >
          <SelectTrigger className="h-8.5 w-36 border-slate-200 bg-white rounded-xl text-[11px] font-semibold px-2.5 shadow-3xs focus:ring-0">
            <SelectValue placeholder="Trạng thái gửi" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 text-xs">
            <SelectItem value="all" className="text-xs font-semibold">
              Mọi trạng thái
            </SelectItem>
            <SelectItem
              value="sent"
              className="text-xs text-emerald-600 font-semibold"
            >
              ✓ Đã phát thanh
            </SelectItem>
            <SelectItem
              value="scheduled"
              className="text-xs text-blue-600 font-semibold"
            >
              Lên lịch gửi
            </SelectItem>
            <SelectItem
              value="draft"
              className="text-xs text-slate-400 font-semibold"
            >
              Bản lưu nháp
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
