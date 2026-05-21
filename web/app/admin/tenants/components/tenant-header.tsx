"use client";

import { Users, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { AddResidentDialog } from "./add-resident-dialog";

interface TenantHeaderProps {
  totalTenants?: number;
  isLoading?: boolean;
  isRefreshing?: boolean;
  getTenants?: (isManualRefresh?: boolean) => void;
}

export function TenantHeader({
  totalTenants = 112,
  isLoading = false,
  isRefreshing = false,
  getTenants = () => {},
}: TenantHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-4 select-none">
      {/* Khối tiêu đề và số liệu tổng hợp nhỏ */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Hồ sơ cư dân & Nhân khẩu
        </h1>
        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
          <Users className="w-3.5 h-3.5 text-slate-400 stroke-[1.75]" />
          <span>
            Hệ thống Danjin Tower • Đang quản lý{" "}
            <span className="text-slate-700 font-semibold font-mono">
              {totalTenants}
            </span>{" "}
            nhân khẩu tạm trú
          </span>
        </div>
      </div>

      {/* Cụm nút hành động dẹt h-9 phẳng, lì */}
      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={() => getTenants(true)}
          className="h-9 text-xs font-semibold px-3 bg-white border-slate-200 text-slate-600 rounded-lg shadow-2xs gap-1.5 hover:bg-slate-50 cursor-pointer self-end sm:self-auto transition-all"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-slate-400 ${isRefreshing ? "animate-spin text-blue-600" : ""}`}
          />
          <span>Đồng bộ lại dữ liệu</span>
        </Button>
        <AddResidentDialog />
      </div>
    </div>
  );
}
