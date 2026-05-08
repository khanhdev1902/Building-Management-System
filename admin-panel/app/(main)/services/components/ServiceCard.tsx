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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: any;
  onEdit: () => void;
}) => {
  const IconComponent = ICON_MAP[service.iconKey] || ICON_MAP.default;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500";
      case "warning":
        return "bg-amber-500";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <Card className="group relative border-slate-200 bg-white p-4 rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-slate-300">
      {/* Top Section: Icon & Actions */}
      <div className="flex justify-between items-start mb-4">
        <div className="relative">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 transition-colors duration-300 group-hover:border-slate-200">
            <IconComponent className="w-6 h-6 text-slate-500 transition-transform duration-500 group-hover:scale-110" />
          </div>
          <span
            className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${getStatusColor(service.status)} ${service.status === "active" ? "animate-pulse" : ""}`}
          />
        </div>

        <div className="flex items-center gap-1">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-900 rounded-full transition-colors"
              >
                <Info className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Chi tiết dịch vụ</SheetTitle>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-900 rounded-full"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 p-1.5 rounded-xl shadow-xl border-slate-100"
            >
              <DropdownMenuItem
                onClick={onEdit}
                className="gap-2 rounded-lg cursor-pointer py-2.5"
              >
                <Edit3 className="w-4 h-4" /> Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer py-2.5">
                <History className="w-4 h-4" /> Nhật ký
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 rounded-lg text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer py-2.5">
                <PauseCircle className="w-4 h-4" /> Tạm dừng
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Middle Section: Info */}
      <div className="space-y-1 mb-5">
        <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">
          {service.name}
        </h3>
        <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed h-8 font-medium">
          {service.description}
        </p>
      </div>

      {/* Bottom Section: Stats & Action */}
      <div className="flex items-end justify-between pt-4 border-t border-slate-50">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Đơn giá
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900 tracking-tighter">
              {typeof service.price === "number"
                ? service.price.toLocaleString("vi-VN")
                : service.price}
            </span>
            <span className="text-[10px] font-bold text-slate-500 lowercase">
              /{service.unit}
            </span>
          </div>
        </div>

        <Button
          onClick={onEdit}
          className="h-9 px-5 rounded-xl bg-slate-900 text-[11px] font-bold text-white shadow-sm transition-all duration-300 hover:bg-slate-800 hover:shadow-indigo-500/20 active:scale-95"
        >
          Cấu hình
        </Button>
      </div>

      {/* Floating Trend Indicator - Chỉ hiện thị nhẹ nhàng */}
      <div className="absolute top-16 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
        <ArrowUpRight className="w-2.5 h-2.5 stroke-[3px]" /> 12%
      </div>
    </Card>
  );
};
