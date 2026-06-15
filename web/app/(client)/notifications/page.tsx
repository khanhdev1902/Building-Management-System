/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Megaphone,
  Bell,
  Clock,
  ChevronRight,
  Search,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { toast } from "sonner";
import { notificationApi } from "@/app/admin/notifications/apis/notification.api";
import { useAuthStore } from "@/features/auth/stores/auth.store";

interface NoticeItem {
  id: string;
  type: "EMERGENCY" | "MAINTENANCE" | "GENERAL" | "LIFE";
  title: string;
  sender: string;
  createdAt: string;
  content: string;
  isRead: boolean;
}

export default function TenantNotificationsPage() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<
    "ALL" | "EMERGENCY" | "MAINTENANCE"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const auth = useAuthStore();

  const fechData = async () => {
    try {
      setIsLoading(true);
      if (!auth.user) return;
      const res = await notificationApi.getAllNotificationTenants(auth.user.id);
      setNotices(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => setIsLoading(false), 400);
    }
  };

  useEffect(() => {
    fechData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredNotices = useMemo(() => {
    if (!notices) return [];
    return notices.filter((ntc) => {
      const matchesSearch =
        ntc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ntc.content.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (filterType === "ALL") return true;
      return ntc.type === filterType;
    });
  }, [notices, filterType, searchQuery]);

  const handleOpenNotice = (notice: NoticeItem) => {
    setSelectedNotice(notice);
    if (!notice.isRead) {
      setNotices((prev) =>
        prev.map((n) => (n.id === notice.id ? { ...n, isRead: true } : n)),
      );
      toast.success("✓ Đã đánh dấu đã đọc thông báo.");
    }
  };

  // ================= 🎨 BỘ KHUNG XƯƠNG SKELETON ĐỒNG TRỤC =================
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-4 bg-[#fcfcfd] min-h-screen animate-pulse select-none">
        <div className="border-b border-slate-200/60 pb-4 space-y-2">
          <div className="h-5 bg-slate-200 rounded w-1/3" />
          <div className="h-3 bg-slate-200 rounded w-3/4" />
        </div>
        <div className="space-y-2">
          <div className="h-9 bg-white border border-slate-200 rounded-md w-full" />
          <div className="h-9 bg-slate-100/80 rounded-md w-full" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 bg-white border border-slate-100 rounded-lg h-24"
            />
          ))}
        </div>
      </div>
    );
  }

  // ================= GIAO DIỆN CHÍNH FLAT & SHARP =================
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-5 bg-[#fcfcfd] min-h-screen antialiased font-sans select-none pb-24 md:pb-6">
      {/* 1. TOP BAR TIÊU ĐỀ FLAT LUXURY */}
      <div className="border-b border-slate-200/60 pb-4">
        <h1 className="text-sm font-black tracking-tight text-slate-900 flex items-center gap-2 uppercase">
          <Megaphone className="w-4 h-4 text-slate-900 stroke-[2.5]" />
          Bảng tin tòa nhà nội bộ
        </h1>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
          Chỉ thị điều hành và lịch vận hành hạ tầng kỹ thuật Danjin BMS.
        </p>
      </div>

      {/* 2. THANH CÔNG CỤ LỌC TÍNH HỢP */}
      <div className="space-y-2.5">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Tìm kiếm nội dung bản tin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8.5 pl-8 w-full text-xs bg-white rounded-md border-slate-200 focus-visible:ring-0 focus-visible:border-slate-900 placeholder:text-slate-300"
          />
        </div>

        {/* Segmented Control Switcher */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/40 w-full h-9 items-center">
          {[
            { key: "ALL", label: "Tất cả" },
            { key: "EMERGENCY", label: "Khẩn cấp" },
            { key: "MAINTENANCE", label: "Bảo trì" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterType(tab.key as any)}
              className={`flex-1 h-7 rounded-md text-[11px] font-black uppercase tracking-tight transition-all cursor-pointer ${
                filterType === tab.key
                  ? "bg-white text-slate-900 shadow-3xs"
                  : "text-slate-400 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. DANH SÁCH BẢN TIN FLAT BLOCK */}
      <div className="space-y-2.5">
        {filteredNotices.length === 0 ? (
          <div className="py-12 text-center text-[10px] font-black uppercase tracking-widest bg-white border border-slate-100 rounded-lg text-slate-400">
            Không có thông báo phù hợp
          </div>
        ) : (
          filteredNotices.map((ntc) => (
            <div
              key={ntc.id}
              onClick={() => handleOpenNotice(ntc)}
              className={`p-4 rounded-lg border bg-white hover:border-slate-400 transition-colors cursor-pointer flex flex-col gap-2 group relative overflow-hidden ${
                ntc.type === "EMERGENCY" && !ntc.isRead
                  ? "border-rose-200/80 bg-rose-50/10"
                  : "border-slate-200/70"
              }`}
            >
              {/* Vết chấm báo chưa đọc tinh tế */}
              {!ntc.isRead && (
                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-1 bg-rose-500 rounded-full animate-pulse" />
              )}

              {/* Hàng 1: Badge Phân Loại */}
              <div className="flex justify-between items-center pl-1">
                <div className="flex items-center gap-2">
                  {ntc.type === "EMERGENCY" && (
                    <span className="bg-rose-50 text-rose-600 border border-rose-100 font-black px-1.5 py-0.2 rounded text-[9px] uppercase tracking-wider">
                      CRITICAL
                    </span>
                  )}
                  {ntc.type === "MAINTENANCE" && (
                    <span className="bg-amber-50 text-amber-600 border border-amber-100 font-black px-1.5 py-0.2 rounded text-[9px] uppercase tracking-wider">
                      MAINTENANCE
                    </span>
                  )}
                  {ntc.type === "GENERAL" && (
                    <span className="bg-slate-100 text-slate-500 font-black px-1.5 py-0.2 rounded text-[9px] uppercase tracking-wider">
                      NOTICE
                    </span>
                  )}
                  <span className="font-mono text-[9px] font-bold text-slate-400 bg-slate-50 px-1 py-0.2 rounded border border-slate-100">
                    {ntc.id}
                  </span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  {ntc.sender}
                </span>
              </div>

              {/* Hàng 2: Tiêu đề & Nội dung tóm tắt */}
              <div className="space-y-0.5 pl-1">
                <h3
                  className={`text-[12px] font-black tracking-tight leading-snug group-hover:text-slate-900 transition-colors ${
                    !ntc.isRead ? "text-slate-950" : "text-slate-800"
                  }`}
                >
                  {ntc.title}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed truncate max-w-70 sm:max-w-none">
                  {ntc.content}
                </p>
              </div>

              {/* Hàng 3: Khối chân chân trang */}
              <div className="flex justify-between items-center border-t border-slate-50 pt-2 pl-1 text-[9px] font-black text-slate-400 font-mono uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Clock size={11} /> <span>{ntc.createdAt}</span>
                </div>
                <span className="text-slate-400 font-sans text-[10px] font-black flex items-center gap-0.5 group-hover:text-slate-900 transition-colors">
                  Đọc toàn văn <ChevronRight size={12} />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL DIALOG XEM CHI TIẾT CÔNG VĂN ================= */}
      <Dialog
        open={!!selectedNotice}
        onOpenChange={(open) => {
          if (!open) setSelectedNotice(null);
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md bg-white rounded-lg border border-slate-200 p-5 flex flex-col font-sans overflow-hidden focus-visible:outline-none animate-in fade-in zoom-in-95 duration-200">
          <DialogHeader className="border-b border-slate-100 pb-2.5 text-left flex flex-row justify-between items-center">
            <div className="space-y-0.5">
              <DialogTitle className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                <Bell size={14} className="text-slate-900 stroke-[2.5]" /> Văn
                bản thông báo
              </DialogTitle>
              <DialogDescription className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                DANJIN OFFICIAL NOTICE
              </DialogDescription>
            </div>
            <span className="font-mono text-[9px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 shrink-0 mr-6">
              {selectedNotice?.id}
            </span>
          </DialogHeader>

          <div className="py-2 space-y-3.5 text-xs">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">
                Tiêu đề công văn
              </span>
              <p className="text-slate-900 font-black text-[13px] leading-snug tracking-tight">
                {selectedNotice?.title}
              </p>
            </div>

            <div className="space-y-1 border-t border-slate-100 pt-2.5">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                Nội dung văn bản chi tiết
              </span>
              <p className="text-[11.5px] text-slate-500 font-medium leading-relaxed font-sans bg-slate-50/50 border border-slate-100/70 p-3 rounded-lg whitespace-pre-wrap">
                {selectedNotice?.content}
              </p>
            </div>

            {/* Khối ký phát lệnh số */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center font-mono">
              <div className="space-y-0.5">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">
                  Cơ quan ban hành
                </span>
                <span className="text-slate-800 font-black text-[11px]">
                  {selectedNotice?.sender}
                </span>
              </div>
              <div className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center gap-0.5">
                <CheckCircle2 size={11} className="stroke-[2.5]" /> SIGNED
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 mt-1 flex justify-end">
            <Button
              variant="ghost"
              onClick={() => setSelectedNotice(null)}
              className="h-8.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 w-full sm:w-auto cursor-pointer"
            >
              Đóng cửa sổ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
