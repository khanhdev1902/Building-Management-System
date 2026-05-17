"use client";

import React from "react";
import {
  MoreVertical,
  Settings2,
  Edit3,
  PauseCircle,
  History,
  ArrowUpRight,
  Home,
  Car,
  Wifi,
  ShieldCheck,
  Zap,
  Droplets,
  Trash2,
  Wrench,
  Info,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { ServiceResponse } from "../types/service.type";

const ICON_MAP: Record<string, React.ElementType> = {
  home: Home,
  car: Car,
  wifi: Wifi,
  security: ShieldCheck,
  electricity: Zap,
  water: Droplets,
  trash: Trash2,
  repair: Wrench,
  default: Settings2,
};

export const ServiceCard = ({
  service,
  onEdit,
}: {
  service: ServiceResponse;
  onEdit: () => void;
}) => {
  const IconComponent = ICON_MAP[service.iconKey] || ICON_MAP.default;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active":
        return {
          dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]",
          text: "text-emerald-700 bg-emerald-50/50 border-emerald-100/50",
          label: "Đang chạy",
        };
      case "warning":
        return {
          dot: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]",
          text: "text-amber-700 bg-amber-50/50 border-amber-100/50",
          label: "Bảo trì",
        };
      default:
        return {
          dot: "bg-slate-400",
          text: "text-slate-600 bg-slate-50 border-slate-200/60",
          label: "Tạm ngưng",
        };
    }
  };

  const currentStatus = getStatusStyle(service.status);

  return (
    <Card className="group relative border border-slate-200/80 bg-white p-4.5 rounded-xl transition-all duration-300 ease-out select-none flex flex-col justify-between min-h-47.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 hover:border-slate-300/90 hover:shadow-[0_12px_24px_-4px_rgba(15,23,42,0.05),0_4px_12px_-2px_rgba(15,23,42,0.02)]">
      <div>
        {/* 1. Tuyến đầu: Icon box & Hệ thống điều khiển điều hướng */}
        <div className="flex justify-between items-start mb-3.5">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100/80 text-slate-500 transition-all duration-300 group-hover:text-slate-800 group-hover:bg-slate-100/60">
            <IconComponent className="w-4 h-4 stroke-[1.75] transition-transform duration-500 group-hover:scale-105" />
          </div>

          <div className="flex items-center gap-1">
            {/* Badge trạng thái phẳng thay vì dấu chấm to nổi lơ lửng */}
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold border ${currentStatus.text}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`}
              />
              {currentStatus.label}
            </span>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
                >
                  <Info className="h-3.5 w-3.5 stroke-[1.75]" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-white/95 backdrop-blur-md border-l border-slate-200">
                <SheetHeader>
                  <SheetTitle className="text-base font-bold text-slate-900">
                    Chi tiết dịch vụ tiện ích
                  </SheetTitle>
                </SheetHeader>
                {/* Thêm thông tin chi tiết cấu hình tại đây */}
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-400 hover:text-slate-700 rounded-md"
                >
                  <MoreVertical className="h-3.5 w-3.5 stroke-[1.75]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-44 p-1 rounded-lg shadow-md border border-slate-200/70 bg-white"
              >
                <DropdownMenuItem
                  onClick={onEdit}
                  className="gap-2 rounded cursor-pointer py-2 text-slate-600 focus:bg-slate-50 focus:text-slate-900 text-xs font-medium"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" /> Chỉnh sửa cấu
                  hình
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 rounded cursor-pointer py-2 text-slate-600 focus:bg-slate-50 focus:text-slate-900 text-xs font-medium">
                  <History className="w-3.5 h-3.5 text-slate-400" /> Nhật ký sử
                  dụng
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 border-slate-100" />
                <DropdownMenuItem className="gap-2 rounded text-rose-600 focus:bg-rose-50/50 focus:text-rose-700 cursor-pointer py-2 text-xs font-medium">
                  <PauseCircle className="w-3.5 h-3.5" /> Tạm dừng vận hành
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 2. Tuyến giữa: Tiêu đề & Mô tả dịch vụ */}
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors duration-300">
            {service.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed h-8 font-normal">
            {service.description ||
              "Chưa có mô tả chi tiết cho gói dịch vụ tiện ích này."}
          </p>
        </div>
      </div>

      {/* 3. Tuyến dưới: Đơn giá và Nút hành động */}
      <div className="flex items-end justify-between pt-3 border-t border-dashed border-slate-100 mt-4">
        <div className="space-y-0.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Đơn giá mặc định
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-slate-900 font-mono tracking-tight">
              {Number(service.price).toLocaleString("vi-VN")}đ
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              /{service.unit}
            </span>

            {/* Tích hợp tag xu hướng cố định vào đây, tránh hiệu ứng bay tự do làm nhiễu loạn thị giác */}
            <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[9px] font-semibold text-emerald-600 bg-emerald-50/60 ml-1">
              <ArrowUpRight className="w-2.5 h-2.5 stroke-2" /> 12%
            </span>
          </div>
        </div>

        <Button
          onClick={onEdit}
          variant="secondary"
          className="h-8 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-all shadow-2xs active:scale-[0.99]"
        >
          Cấu hình
        </Button>
      </div>
    </Card>
  );
};
