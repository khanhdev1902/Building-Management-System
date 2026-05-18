"use client";

import React from "react";
import { Plus, Download, Home } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

interface ContractHeaderProps {
  totalContracts?: number;
  onExport?: () => void;
}

export function ContractHeader({
  totalContracts = 45,
  onExport = () => {},
}: ContractHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4 select-none">
      {/* Khối tiêu đề thông tin phân hệ */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Hợp đồng thuê & Pháp lý căn hộ
        </h1>
        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
          <Home className="w-3.5 h-3.5 text-slate-400 stroke-[1.75]" />
          <span>
            Hệ thống Danjin Tower •{" "}
            <span className="text-slate-700 font-semibold font-mono">
              {totalContracts}
            </span>{" "}
            hợp đồng vận hành
          </span>
        </div>
      </div>

      {/* Cụm hành động tác vụ dẹt h-9 */}
      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
        <Button
          variant="outline"
          onClick={onExport}
          className="h-9 px-3 text-xs font-medium border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-2xs rounded-lg transition-colors"
        >
          <Download className="mr-1.5 h-3.5 w-3.5 text-slate-400 stroke-[1.75]" />
          <span>Xuất file báo cáo</span>
        </Button>

        <Link href="/admin/contracts/new">
          <Button className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-2xs flex gap-1.5 active:scale-[0.99] transition-all">
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Khởi tạo hợp đồng</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
