"use client";

import React, { useState, useEffect } from "react";
import { Bell, Clock, CheckCircle2, Zap, ArrowRight, Info } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { toast } from "sonner";

const INITIAL_NOTIFICATIONS = [
  {
    id: "NTF-01",
    type: "BILL",
    title: "Đối soát thành công",
    desc: "Hệ thống vừa khớp lệnh tự động gạch nợ hóa đơn tiền nhà Phòng 302.",
    time: "3 phút trước",
    isNew: true,
  },
  {
    id: "NTF-02",
    type: "IOT",
    title: "Cảnh báo ngắt nguồn",
    desc: "Rơ-le điện Aptomat Phòng 202 tự động ngắt do phát hiện dòng tải vượt ngưỡng.",
    time: "1 giờ trước",
    isNew: false,
  },
  {
    id: "NTF-03",
    type: "SYSTEM",
    title: "Phê duyệt tạm trú",
    desc: "Quản lý tòa A vừa duyệt hồ sơ nhân khẩu cho cư dân mới dọn vào Phòng 101.",
    time: "4 giờ trước",
    isNew: false,
  },
];

const EVENT_POOL = [
  {
    type: "IOT",
    title: "Cảnh báo hệ thống IoT Auto",
    desc: "Cảm biến khói vừa ghi nhận tín hiệu kiểm tra định kỳ tại khu vực hành lang tầng 2 Tòa Danjin.",
  },
  {
    type: "BILL",
    title: "Giao dịch gạch nợ mới",
    desc: "Cư dân Nguyễn Văn Khanh (Phòng 202) vừa tất toán thành công công nợ dịch vụ tháng 5.",
  },
  {
    type: "SYSTEM",
    title: "Yêu cầu sửa chữa thiết bị",
    desc: "Cư dân phòng 101 vừa gửi một phản ánh khẩn cấp: 'Điều hòa chảy nước cần kỹ thuật xử lý'.",
  },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // GIẢ LẬP LUỒNG REAL-TIME NGẦM: Chỉ nháy chấm đỏ và thêm vào lịch sử
  useEffect(() => {
    const triggerLiveEvent = () => {
      const randomEvent =
        EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
      const newId = `NTF-${Date.now()}`;

      const incomingNotification = {
        id: newId,
        type: randomEvent.type,
        title: randomEvent.title,
        desc: randomEvent.desc,
        time: "Vừa xong",
        isNew: true,
      };

      // Đẩy ngầm thông báo mới lên đầu danh sách
      setNotifications((prev) => [incomingNotification, ...prev.slice(0, 5)]);

      // Bắn một toast nhỏ gọn dịu dàng ở góc màn hình, không làm phiền trải nghiệm chính
      toast.info(randomEvent.title, {
        description: randomEvent.desc,
      });
    };

    // Tạo khoảng thời gian ngẫu nhiên để robot bắn thông báo ngầm
    const timer = setTimeout(triggerLiveEvent, 300000);
    return () => clearTimeout(timer);
  }, [notifications]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isNew: false })));
    toast.success("Đã đánh dấu đọc tất cả thông báo");
  };

  const hasUnread = notifications.some((n) => n.isNew);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg relative hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer focus-visible:ring-0"
        >
          <Bell className="h-4 w-4 stroke-[1.75]" />
          {/* Chấm đỏ nhỏ gọn, nhấp nháy nhẹ báo hiệu có đồ mới chưa đọc */}
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 ring-1 ring-white animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-80 p-0 rounded-xl border border-slate-200/80 bg-white shadow-xl overflow-hidden select-none animate-in fade-in slide-in-from-top-2 duration-150"
      >
        {/* Header */}
        <div className="px-4 py-2.5 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 tracking-tight">
            Trung tâm thông báo
          </span>
          {hasUnread && (
            <button
              onClick={handleMarkAllRead}
              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer focus:outline-none"
            >
              Đánh dấu đã đọc
            </button>
          )}
        </div>

        {/* Danh sách thông báo */}
        <div className="divide-y divide-slate-100/70 max-h-64 overflow-y-auto">
          {notifications.map((ntf) => (
            <div
              key={ntf.id}
              className={`p-3.5 flex gap-3 transition-colors hover:bg-slate-50/40 relative ${ntf.isNew ? "bg-indigo-50/5" : ""}`}
            >
              {/* Vạch kẻ chỉ thị chưa đọc */}
              {ntf.isNew && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500" />
              )}

              {/* Icon cụm nghiệp vụ */}
              <div
                className={`p-1.5 h-7 w-7 rounded-lg border shrink-0 flex items-center justify-center ${
                  ntf.type === "BILL"
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                    : ntf.type === "IOT"
                      ? "bg-amber-50 border-amber-100 text-amber-600"
                      : "bg-slate-50 border-slate-100 text-slate-500"
                }`}
              >
                {ntf.type === "BILL" ? (
                  <CheckCircle2 size={13} />
                ) : ntf.type === "IOT" ? (
                  <Zap size={13} />
                ) : (
                  <Info size={13} />
                )}
              </div>

              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-xs tracking-tight truncate ${ntf.isNew ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}
                  >
                    {ntf.title}
                  </p>
                  <span className="text-[9px] font-medium text-slate-400 font-mono flex items-center gap-1 shrink-0">
                    <Clock size={10} /> {ntf.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                  {ntf.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chân trang */}
        <div className="border-t border-slate-100 p-1.5 bg-slate-50/30 text-center">
          <Button
            variant="ghost"
            className="w-full h-8 text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 gap-1 rounded-lg cursor-pointer"
            onClick={() => setPopoverOpen(false)}
          >
            <span>Xem tất cả nhật ký hệ thống</span>
            <ArrowRight size={12} />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
