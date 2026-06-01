/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import {
  Megaphone,
  Bell,
  AlertTriangle,
  Clock,
  ChevronRight,
  Search,
  Eye,
  Building,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
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

interface NoticeItem {
  id: string;
  type: "EMERGENCY" | "MAINTENANCE" | "GENERAL"; // KHẨN CẤP | BẢO TRÌ | TIN CHUNG
  title: string;
  sender: string;
  createdAt: string;
  content: string;
  isRead: boolean; // Trạng thái đọc (kết nối WebSocket xử lý realtime)
}

const MOCK_NOTICES: NoticeItem[] = [
  {
    id: "NTC-891",
    type: "EMERGENCY",
    title: "Diễn tập phương án PCCC và test còi báo động hầm xe",
    sender: "Ban Quản Lý Tòa Nhà",
    createdAt: "25/05/2026 09:00",
    isRead: false, // Chưa đọc -> Hiển thị chấm thông báo hồng
    content: "Vào lúc 15h00 chiều nay, đội kỹ thuật Danjin BMS sẽ phối hợp với cơ quan chức năng tiến hành chạy thử nghiệm hệ thống còi hú báo cháy tại tầng hầm và các hành lang trục đứng. Thời gian test kéo dài khoảng 15 phút, yêu cầu cư dân giữ bình tĩnh, không hoảng loạn khi nghe thấy âm thanh còi báo.",
  },
  {
    id: "NTC-890",
    type: "MAINTENANCE",
    title: "Tạm dừng vận hành Thang máy trục A để bảo trì định kỳ",
    sender: "Đội Kỹ Thuật Danjin",
    createdAt: "24/05/2026 14:00",
    isRead: true, // Đã đọc
    content: "Để phục vụ công tác kiểm định và tra dầu cáp tời trục kỹ thuật, Thang máy số 1 tòa nhà sẽ tạm dừng hoạt động từ 09h00 đến 11h30 ngày 26/05/2026. Cư dân vui lòng di chuyển bằng thang bộ hoặc thang máy số 2 trong khung giờ trên. Xin cảm ơn!",
  },
  {
    id: "NTC-889",
    type: "GENERAL",
    title: "Nhắc nhở phân loại rác thải tại khu vực thu gom chung",
    sender: "Bộ Phận Vệ Sinh",
    createdAt: "22/05/2026 08:30",
    isRead: true,
    content: "Hiện nay tình trạng cư dân để rác cồng kềnh, không phân loại rác hữu cơ và rác tái chế tại phòng gom rác tầng 1 đang gây quá tải. Xin cư dân lưu ý bọc chặt túi rác và đổ đúng giờ quy định nhằm giữ gìn vệ sinh chung, tránh mùi hôi lan vào thang máy.",
  }
];

export default function TenantNotificationsPage() {
  const [notices, setNotices] = useState<NoticeItem[]>(MOCK_NOTICES);
  const [filterType, setFilterType] = useState<"ALL" | "EMERGENCY" | "MAINTENANCE">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  // Bộ lọc dữ liệu bảng tin
  const filteredNotices = useMemo(() => {
    return notices.filter((ntc) => {
      const matchesSearch = ntc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            ntc.content.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (filterType === "ALL") return true;
      return ntc.type === filterType;
    });
  }, [notices, filterType, searchQuery]);

  // Luồng xử lý khi cư dân bấm mở xem thông báo chi tiết
  const handleOpenNotice = (notice: NoticeItem) => {
    setSelectedNotice(notice);
    
    // Nếu tin nhắn chưa đọc, thực hiện gạch nợ trạng thái "Đã đọc" ngay lập tức
    if (!notice.isRead) {
      setNotices(prev => 
        prev.map(n => n.id === notice.id ? { ...n, isRead: true } : n)
      );
      toast.success("✓ Đã đánh dấu đã đọc thông báo.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-5 bg-slate-50/10 min-h-screen antialiased font-sans select-none pb-24 md:pb-6">
      
      {/* 1. TOP BAR TIÊU ĐỀ FLAT LUXURY */}
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-slate-900 stroke-[2.2]" />
          Bảng tin tòa nhà nội bộ
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Cập nhật các chỉ thị, lịch bảo trì hệ thống và thông báo khẩn cấp từ Ban quản lý chung cư Danjin.
        </p>
      </div>

      {/* 2. THANH CÔNG CỤ TÌM KIẾM VÀ TABS LỌC CHO MOBILE (ONE TOUCH) */}
      <div className="space-y-3 select-none">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Tìm nội dung thông báo, lịch cắt điện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-8 w-full text-xs bg-white rounded-lg border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-900 font-semibold text-slate-800"
          />
        </div>

        {/* Khối Tabs trượt ngang full width */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/30 w-full h-10 items-center">
          {[
            { key: "ALL", label: "Tất cả tin" },
            { key: "EMERGENCY", label: "🔴 Khẩn cấp" },
            { key: "MAINTENANCE", label: "⚙️ Bảo trì" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterType(tab.key as any)}
              className={`flex-1 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === tab.key
                  ? "bg-white shadow-3xs text-slate-900"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. LƯỚI CARD THÔNG BÁO DẸT MỊN LUXURY */}
      <div className="space-y-3">
        {filteredNotices.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 italic bg-white border border-slate-100 rounded-xl shadow-3xs">
            Hiện tại không có thông báo nào trong danh mục lọc.
          </div>
        ) : (
          filteredNotices.map((ntc) => (
            <div
              key={ntc.id}
              onClick={() => handleOpenNotice(ntc)}
              className={`p-4 rounded-xl border bg-white shadow-3xs hover:border-slate-300 transition-all cursor-pointer flex flex-col gap-2.5 group relative overflow-hidden ${
                ntc.type === "EMERGENCY" && !ntc.isRead ? "border-rose-100/60 bg-rose-50/5" : "border-slate-100"
              }`}
            >
              {/* Vết chấm thông báo chưa đọc hồng neon sang chảnh */}
              {!ntc.isRead && (
                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-rose-500 rounded-full ring-4 ring-rose-100 animate-pulse" />
              )}

              {/* Hàng 1: Badge Phân Loại Cấp Độ Tin & Mã số */}
              <div className="flex justify-between items-center pl-1">
                <div className="flex items-center gap-1.5">
                  {ntc.type === "EMERGENCY" && (
                    <Badge className="bg-rose-50 text-rose-600 border border-rose-100 font-bold px-1.5 py-0 rounded text-[9px] uppercase tracking-tight shadow-none">
                      🚨 Nguy hiểm khẩn cấp
                    </Badge>
                  )}
                  {ntc.type === "MAINTENANCE" && (
                    <Badge className="bg-amber-50 text-amber-700 border border-amber-100 font-bold px-1.5 py-0 rounded text-[9px] uppercase tracking-tight shadow-none">
                      ⚙️ Lịch bảo trì
                    </Badge>
                  )}
                  {ntc.type === "GENERAL" && (
                    <Badge className="bg-slate-100 text-slate-600 border border-transparent font-bold px-1.5 py-0 rounded text-[9px] uppercase tracking-tight shadow-none">
                      📢 Thông báo chung
                    </Badge>
                  )}
                  <span className="font-mono text-[9px] font-bold text-slate-400 bg-slate-50 px-1 py-0.5 rounded border border-slate-100">
                    {ntc.id}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">{ntc.sender}</span>
              </div>

              {/* Hàng 2: Tiêu đề bản tin & Mô tả rút gọn */}
              <div className="space-y-1 pl-1">
                <h3 className={`text-xs font-black tracking-tight leading-snug group-hover:text-slate-900 transition-colors ${
                  !ntc.isRead ? "text-slate-950 font-black" : "text-slate-800"
                }`}>
                  {ntc.title}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed truncate max-w-[280px] sm:max-w-none">
                  {ntc.content}
                </p>
              </div>

              {/* Hàng 3: Thời gian gửi lệnh thông báo */}
              <div className="flex justify-between items-center border-t border-slate-50 pt-2 pl-1 text-[10px] font-medium text-slate-400 font-mono">
                <div className="flex items-center gap-1">
                  <Clock size={11} /> <span>Phát hành: {ntc.createdAt}</span>
                </div>
                <span className="text-slate-400 text-[11px] font-sans font-bold flex items-center gap-0.5 group-hover:text-slate-900 transition-colors">
                  Đọc toàn văn <ChevronRight size={13} />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL DIALOG XEM TOÀN VĂN BẢN TIN ĐÓNG DẤU SỐ ================= */}
      <Dialog open={!!selectedNotice} onOpenChange={(open) => { if (!open) setSelectedNotice(null); }}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md bg-white rounded-xl border border-slate-100 p-5 shadow-2xl flex flex-col font-sans overflow-hidden focus-visible:outline-none animate-in fade-in zoom-in-95 duration-200">
          <DialogHeader className="border-b border-slate-50 pb-2 text-left">
            <div className="flex justify-between items-center pr-6 w-full">
              <DialogTitle className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Bell size={14} className="text-slate-900 stroke-[2.5]" /> Công văn thông báo số
              </DialogTitle>
              <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border">{selectedNotice?.id}</span>
            </div>
          </DialogHeader>

          {/* Nội dung chi tiết văn bản */}
          <div className="py-2.5 space-y-3.5 text-xs font-semibold text-slate-700 select-text">
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase text-slate-400 block">Tiêu đề công văn</span>
              <p className="text-slate-900 font-bold text-sm leading-snug">{selectedNotice?.title}</p>
            </div>

            <div className="space-y-1 border-t border-slate-50 pt-2">
              <span className="text-[9px] font-extrabold uppercase text-slate-400 block">Nội dung văn bản chi tiết</span>
              <p className="text-[11.5px] text-slate-500 font-medium leading-relaxed font-sans bg-slate-50/50 border border-slate-100/60 p-3 rounded-xl">
                {selectedNotice?.content}
              </p>
            </div>

            {/* Khối ký tên đóng dấu ảo bảo an */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center font-mono select-none">
              <div className="space-y-0.5">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Cơ quan ký phát lệnh</span>
                <span className="text-slate-800 font-bold">{selectedNotice?.sender}</span>
              </div>
              <div className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100/50 flex items-center gap-0.5">
                <CheckCircle2 size={11} className="stroke-[2.5]" /> ĐÃ CHỨNG THỰC
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-50 mt-1 flex justify-end select-none">
            <Button variant="ghost" onClick={() => setSelectedNotice(null)} className="h-9 text-xs text-slate-500 font-bold rounded-lg w-full sm:w-auto cursor-pointer">
              Đóng lại văn bản
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}