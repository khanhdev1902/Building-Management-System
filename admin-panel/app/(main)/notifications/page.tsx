"use client";

import React, { useState } from "react";
import {
  Bell,
  CheckCheck,
  CreditCard,
  Wrench,
  UserPlus,
  Settings,
  Search,
  Inbox,
  Clock,
  ArrowUpRight,
  Filter,
  MoreHorizontal,
  Trash2,
  ShieldAlert,
  ChevronRight,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const NOTIFICATIONS = [
  {
    id: "1",
    type: "finance",
    title: "Cảnh báo nợ cước P.202",
    content:
      "Cư dân Trần Thị Bảo đã quá hạn thanh toán hóa đơn điện nước tháng 03/2026. Tổng nợ tích lũy: 1.250.000đ. Cần gửi thông báo nhắc nợ lần 2.",
    time: "2 phút trước",
    isRead: false,
    priority: "high",
    sender: "Hệ thống tài chính",
  },
  {
    id: "2",
    type: "maintenance",
    title: "Yêu cầu kỹ thuật #442",
    content:
      "Phòng 101 báo hỏng vòi sen và thấm tường nhà vệ sinh. Mức độ: Cần xử lý trong ngày.",
    time: "45 phút trước",
    isRead: false,
    priority: "medium",
    sender: "App Cư dân",
  },
  {
    id: "3",
    type: "tenant",
    title: "Cư dân mới xác minh",
    content:
      "Hệ thống đã nhận diện thông tin CCCD của Nguyễn Văn Anh (P.104). Vui lòng phê duyệt hồ sơ tạm trú để hoàn tất thủ tục.",
    time: "3 giờ trước",
    isRead: true,
    priority: "low",
    sender: "Cổng đăng ký",
  },
];

export default function ProfessionalNotifications() {
  const [selectedId, setSelectedId] = useState(NOTIFICATIONS[0].id);
  const selectedNoti = NOTIFICATIONS.find((n) => n.id === selectedId);

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      {/* 1. Danh sách thông báo (Bên trái) */}
      <div className="w-full md:w-[380px] lg:w-[420px] border-r border-slate-200 flex flex-col bg-white shadow-sm">
        {/* Header danh sách */}
        <div className="p-5 border-b border-slate-100 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">
                Thông báo
              </h1>
            </div>
            <Badge
              variant="secondary"
              className="bg-blue-600 text-white border-none rounded-full px-2 py-0.5 text-[11px]"
            >
              02 mới
            </Badge>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              placeholder="Tìm theo nội dung, số phòng..."
              className="pl-9 bg-slate-50 border-slate-200 text-xs h-10 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
            <Button
              variant="ghost"
              size="sm"
              className="bg-slate-100 text-blue-700 text-[11px] font-semibold h-8 rounded-full px-4"
            >
              Tất cả
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 text-[11px] h-8 rounded-full px-4 hover:bg-slate-50"
            >
              Chưa đọc
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 text-[11px] h-8 rounded-full px-4 hover:bg-slate-50"
            >
              Tài chính
            </Button>
          </div>
        </div>

        {/* List Body */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-slate-50">
            {NOTIFICATIONS.map((n) => (
              <div
                key={n.id}
                onClick={() => setSelectedId(n.id)}
                className={`relative p-4 cursor-pointer transition-all duration-200 border-l-4 ${
                  selectedId === n.id
                    ? "bg-blue-50/50 border-blue-600 shadow-sm"
                    : "bg-white border-transparent hover:bg-slate-50"
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex items-center gap-2">
                    {!n.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                    )}
                    <span
                      className={`text-xs font-bold ${selectedId === n.id ? "text-blue-700" : "text-slate-700"}`}
                    >
                      {n.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {n.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed pl-4">
                  {n.content}
                </p>
                {n.priority === "high" && (
                  <div className="mt-2 pl-4">
                    <Badge className="bg-red-50 text-red-600 border-red-100 text-[9px] px-1.5 py-0">
                      Khẩn cấp
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* 2. Chi tiết thông báo (Bên phải) */}
      <div className="hidden md:flex flex-1 flex-col bg-white">
        {selectedNoti ? (
          <>
            {/* Header chi tiết */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border ${
                    selectedNoti.type === "finance"
                      ? "bg-red-50 border-red-100 text-red-600"
                      : selectedNoti.type === "maintenance"
                        ? "bg-amber-50 border-amber-100 text-amber-600"
                        : "bg-blue-50 border-blue-100 text-blue-600"
                  }`}
                >
                  {selectedNoti.type === "finance" ? (
                    <CreditCard size={24} />
                  ) : selectedNoti.type === "maintenance" ? (
                    <Wrench size={24} />
                  ) : (
                    <UserPlus size={24} />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 leading-tight">
                    {selectedNoti.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" /> 30/03/2026 - 10:24
                    </span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-xs text-blue-600 font-semibold">
                      {selectedNoti.sender}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="h-9 border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  <CheckCheck className="w-4 h-4 mr-2 text-emerald-500" /> Đã
                  đọc
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="text-xs py-2 cursor-pointer">
                      <ShieldAlert className="w-4 h-4 mr-2" /> Báo cáo sự cố
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs py-2 cursor-pointer text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" /> Xóa thông báo
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Nội dung chi tiết */}
            <ScrollArea className="flex-1 bg-slate-50/30">
              <div className="p-8 max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-6 space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                      Nội dung chính
                    </h3>
                    <p className="text-[15px] text-slate-700 leading-relaxed font-medium">
                      {selectedNoti.content}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        Vị trí / Đối tượng
                      </p>
                      <p className="text-[13px] text-slate-800 font-bold mt-1 flex items-center gap-2">
                        Phòng 202{" "}
                        <ChevronRight size={14} className="text-slate-300" />{" "}
                        LuxHouse Tower
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        Mức độ ưu tiên
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`w-2 h-2 rounded-full ${selectedNoti.priority === "high" ? "bg-red-500" : "bg-amber-500"}`}
                        />
                        <span className="text-[13px] text-slate-800 font-bold uppercase">
                          {selectedNoti.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-1">
                  <div className="flex gap-3">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                      Xử lý nghiệp vụ <ArrowUpRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-200 hover:bg-white px-6 py-6 rounded-xl text-sm font-semibold text-slate-600 transition-all"
                    >
                      Chuyển tiếp cho kỹ thuật
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-slate-400 text-xs hover:text-red-500"
                  >
                    Bỏ qua thông báo này
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50/20">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner mb-4">
              <Inbox size={40} className="text-slate-200" />
            </div>
            <p className="text-sm font-medium text-slate-400 tracking-wide">
              Chọn thông báo để xem chi tiết
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
