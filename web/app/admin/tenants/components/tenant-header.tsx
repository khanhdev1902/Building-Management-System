"use client";

import React from "react";
import { UserPlus, Download, Users } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface TenantHeaderProps {
  totalTenants?: number;
  onExport?: () => void;
  onAddTenant?: () => void;
}

export function TenantHeader({
  totalTenants = 112,
  onExport = () => {},
  onAddTenant = () => {},
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
          onClick={onExport}
          className="h-9 px-3 text-xs font-medium border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-2xs rounded-lg transition-colors"
        >
          <Download className="mr-1.5 h-3.5 w-3.5 text-slate-400 stroke-[1.75]" />
          <span>Xuất Excel</span>
        </Button>

        <Button
          onClick={onAddTenant}
          className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-2xs flex gap-1.5 active:scale-[0.99] transition-all"
        >
          <UserPlus className="h-4 w-4 stroke-2" />
          <span>Thêm cư dân mới</span>
        </Button>
      </div>
    </div>
  );
}
