"use client";

import React from "react";
import {
  MoreVertical,
  Clock,
  Settings2,
  Edit3,
  PauseCircle,
  History,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { Badge } from "@/shared/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";

interface ServiceData {
  id: string;
  name: string;
  description: string;
  price: number | string;
  unit: string;
  status: "active" | "maintenance" | "warning" | string;
  icon: React.ReactNode;
}

interface ServiceProps {
  service: ServiceData;
  onEdit: () => void; // Nhận callback từ page.tsx
}

export const ServiceCard = ({ service, onEdit }: ServiceProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          badge: "bg-emerald-50 text-emerald-600 border-emerald-100",
          iconBg: "bg-emerald-500/10",
          iconText: "text-emerald-600",
          label: "Đang hoạt động",
        };
      case "warning":
      case "maintenance":
        return {
          badge: "bg-amber-50 text-amber-600 border-amber-100",
          iconBg: "bg-amber-500/10",
          iconText: "text-amber-600",
          label: "Cần kiểm tra",
        };
      default:
        return {
          badge: "bg-slate-50 text-slate-600 border-slate-100",
          iconBg: "bg-slate-500/10",
          iconText: "text-slate-600",
          label: "Tạm dừng",
        };
    }
  };

  const config = getStatusConfig(service.status);

  return (
    <Card className="group relative border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-sm">
      <div className="absolute top-0 right-0 p-8 -mr-8 -mt-8 w-32 h-32 bg-slate-50 rounded-full opacity-50 group-hover:bg-indigo-50 transition-colors duration-500" />

      <CardHeader className="pb-4 relative z-10">
        <div className="flex justify-between items-start">
          <div
            className={`p-3.5 rounded-2xl ${config.iconBg} backdrop-blur-md transition-transform duration-300 group-hover:scale-110`}
          >
            {React.isValidElement(service.icon) ? (
              React.cloneElement(
                service.icon as React.ReactElement,
                {
                  className: `w-6 h-6 ${config.iconText}`,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any,
              )
            ) : (
              <Settings2 className={`w-6 h-6 ${config.iconText}`} />
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9 hover:bg-slate-100"
              >
                <MoreVertical className="h-5 w-5 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-2xl min-w-40 p-2 shadow-2xl border-slate-100"
            >
              <DropdownMenuItem
                onClick={onEdit}
                className="rounded-xl gap-2 py-2.5 cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-slate-500" /> Chỉnh sửa nhanh
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl gap-2 py-2.5 cursor-pointer">
                <History className="w-4 h-4 text-slate-500" /> Nhật ký dịch vụ
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl gap-2 py-2.5 text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer">
                <PauseCircle className="w-4 h-4" /> Tạm dừng cung cấp
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 relative z-10">
        <div className="min-h-17.5">
          <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
            {service.name}
          </CardTitle>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">
            {service.description}
          </p>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 transition-all duration-300">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
              Đơn giá niêm yết
            </span>
            <div className="flex items-baseline">
              <span className="text-xl font-black text-slate-900 group-hover:text-indigo-600">
                {typeof service.price === "number"
                  ? service.price.toLocaleString("vi-VN")
                  : service.price}
                đ
              </span>
              <span className="text-xs font-medium text-slate-400 ml-1.5">
                /{service.unit}
              </span>
            </div>
          </div>
          <Badge
            className={`${config.badge} shadow-none px-3 py-1 rounded-xl text-[10px] border font-bold uppercase`}
          >
            {config.label}
          </Badge>
        </div>

        <div className="flex gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 rounded-2xl text-xs font-semibold h-11 border-slate-200"
              >
                <Clock className="w-4 h-4 mr-2 opacity-70" /> Nhật ký
              </Button>
            </SheetTrigger>
            <SheetContent className="rounded-l-[2rem]">
              <SheetHeader>
                <SheetTitle>Lịch sử: {service.name}</SheetTitle>
                <SheetDescription>
                  Các lần thay đổi chỉ số và bảo trì hệ thống.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="p-4 border rounded-2xl bg-slate-50">
                  <p className="text-xs text-slate-400">Hôm nay - 10:30</p>
                  <p className="text-sm font-semibold text-indigo-600">
                    Hệ thống đang vận hành ổn định
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Button
            onClick={onEdit}
            className="flex-1 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-xs font-semibold h-11 transition-all"
          >
            <Settings2 className="w-4 h-4 mr-2" /> Cấu hình
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
