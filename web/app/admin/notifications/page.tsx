/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Send,
  FileText,
  CheckCircle,
  Clock,
  MoreVertical,
  Trash2,
  Eye,
  Megaphone,
  Building,
  Users,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Home,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { useAuthStore } from "@/features/auth/stores/auth.store";

// Mock Data chuẩn dữ liệu quản lý vận hành tòa nhà
const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTI-001",
    type: "finance",
    title: "Thông báo đóng tiền dịch vụ và tiền nước tháng 05/2026",
    content:
      "Ban quản lý thông báo hạn đóng tiền phòng, tiền nước định kỳ từ ngày 01 đến ngày 05 hàng tháng. Vui lòng thanh toán đúng hạn qua app Danjin BMS để tránh phát sinh phí phạt.",
    target: "Toàn bộ tòa nhà",
    status: "sent",
    priority: "high",
    createdAt: "20/05/2026 08:00",
    stats: { sent: 48, read: 32 },
  },
  {
    id: "NOTI-002",
    type: "maintenance",
    title: "Bảo trì định kỳ hệ thống thang máy khu tòa nhà A",
    content:
      "Tiến hành bảo dưỡng định kỳ cáp và động cơ thang máy trục chính tòa A trong khoảng thời gian từ 13:00 đến 16:00 ngày mai. Cư dân vui lòng di chuyển bằng cầu thang bộ.",
    target: "Block A (24 Phòng)",
    status: "scheduled",
    priority: "medium",
    createdAt: "19/05/2026 15:30",
    stats: { sent: 24, read: 0 },
  },
  {
    id: "NOTI-003",
    type: "life",
    title: "Nhắc nhở phân loại rác thải tại nhà rác tầng hầm",
    content:
      "Hiện tại có tình trạng một số phòng để rác không đúng nơi quy định, không phân loại rác tái chế. Yêu cầu cư dân tuân thủ nội quy chung cư mini để bảo vệ không gian chung.",
    target: "Toàn bộ tòa nhà",
    status: "draft",
    priority: "low",
    createdAt: "18/05/2026 10:15",
    stats: { sent: 0, read: 0 },
  },
  {
    id: "NOTI-004",
    type: "finance",
    title: "Cảnh báo cắt điện nước do quá hạn thanh toán - P.302",
    content:
      "Yêu cầu phòng 302 hoàn thành nghĩa vụ tài chính hóa đơn tháng 04 trước 17h00 hôm nay. Quá thời gian trên hệ thống sẽ tự động ngắt rơ-le điện của phòng.",
    target: "Phòng 302",
    status: "sent",
    priority: "high",
    createdAt: "18/05/2026 09:00",
    stats: { sent: 1, read: 1 },
  },
];

export default function NotificationManagement() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const auth = useAuthStore();
  console.log(auth.accessToken);

  useEffect(() => {
    if (!auth.accessToken) return;

    const socket = io("http://localhost:5000", {
      auth: {
        token: auth.accessToken,
      },
    });

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("notification", (data) => {
      console.log("đã nhận tin");
      console.log(data);
      toast.success(data.title);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [auth.accessToken]);

  // Phân trang đơn giản
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State Form tạo mới
  const [newNoti, setNewNoti] = useState({
    title: "",
    content: "",
    type: "life",
    priority: "low",
    targetType: "all",
    specificRoom: "",
  });

  // Xử lý bộ lọc & Tìm kiếm dữ liệu
  const filteredNotis = useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.target.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === "all" || n.type === typeFilter;
      const matchesStatus = statusFilter === "all" || n.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [notifications, searchQuery, typeFilter, statusFilter]);

  // Tính toán số trang thực tế
  const paginatedNotis = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNotis.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNotis, currentPage]);

  const totalPages = Math.ceil(filteredNotis.length / itemsPerPage) || 1;

  // Tạo thông báo mới
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoti.title || !newNoti.content) {
      toast.error("Vui lòng điền đầy đủ tiêu đề và nội dung.");
      return;
    }

    const targetText =
      newNoti.targetType === "all"
        ? "Toàn bộ tòa nhà"
        : `Phòng ${newNoti.specificRoom || "Chưa rõ"}`;

    const created: any = {
      id: `NOTI-00${notifications.length + 1}`,
      type: newNoti.type,
      title: newNoti.title,
      content: newNoti.content,
      target: targetText,
      status: "sent",
      priority: newNoti.priority,
      createdAt: "Vừa xong",
      stats: { sent: newNoti.targetType === "all" ? 48 : 1, read: 0 },
    };

    setNotifications([created, ...notifications]);
    setIsCreateOpen(false);
    toast.success("Đã gửi phát thanh thông báo thành công đến cư dân!");

    // Reset form
    setNewNoti({
      title: "",
      content: "",
      type: "life",
      priority: "low",
      targetType: "all",
      specificRoom: "",
    });
  };

  // Xóa thông báo
  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    toast.success(`Đã gỡ bỏ bản tin ${id}`);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50/50 text-slate-900 font-sans antialiased">
      {/* 1. THANH TOÀN DIỆN TOP BAR HEADER */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-xs select-none">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-sm">
            <Megaphone className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Bảng tin & Thông báo
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Quản lý nội dung phát thanh phát ra App cư dân tòa nhà Danjin BMS
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* NÚT KÍCH HOẠT FORM SOẠN THÔNG BÁO CHUẨN MINIMALIST */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer h-9 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-2xs gap-1.5 px-4 transition-all active:scale-[0.98]">
              <Plus size={14} className="stroke-[2.5]" /> Soạn thông báo mới
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-xl bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xl overflow-hidden font-sans">
            {/* Header Bản tin bóc tách không gian */}
            <div className="space-y-1 border-b border-slate-100 pb-3.5 select-none">
              <DialogTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Megaphone size={16} className="text-indigo-600 stroke-[1.8]" />
                Soạn văn bản thông điệp phát thanh
              </DialogTitle>
              <DialogDescription className="text-[11px] text-slate-400 font-medium">
                Bản tin hệ thống sẽ được gửi thông báo đẩy (Push Notification)
                tức thời đến ứng dụng di động của cư dân.
              </DialogDescription>
            </div>

            {/* Form xử lý luồng tương tác chuyên sâu */}
            <form onSubmit={handleCreate} className="space-y-4.5 pt-2 text-xs">
              {/* 1. Tiêu đề bản tin */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide">
                  Tiêu đề bản tin thông báo *
                </label>
                <div className="relative flex items-center">
                  <Input
                    placeholder="Ví dụ: Lịch cắt nước sửa chữa trục ống chính..."
                    value={newNoti.title}
                    onChange={(e) =>
                      setNewNoti({ ...newNoti, title: e.target.value })
                    }
                    className="h-9.5 pl-9 rounded-xl border-slate-200 bg-slate-50/30 text-xs font-semibold text-slate-800 focus-visible:bg-white focus-visible:border-slate-400 focus-visible:ring-0 shadow-3xs transition-all placeholder:font-normal placeholder:text-slate-400"
                  />
                  <FileText
                    size={14}
                    className="absolute left-3 text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 2. Danh mục nội dung */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">
                    Danh mục nội dung
                  </label>
                  <Select
                    value={newNoti.type}
                    onValueChange={(val) =>
                      setNewNoti({ ...newNoti, type: val })
                    }
                  >
                    <SelectTrigger className="h-9.5 border-slate-200 bg-slate-50/30 rounded-xl text-xs font-semibold px-3 text-slate-700 shadow-3xs focus:ring-0 focus:border-slate-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 p-1 bg-white shadow-md">
                      <SelectItem
                        value="finance"
                        className="text-xs cursor-pointer rounded-lg"
                      >
                        Tài chính / Công nợ hóa đơn
                      </SelectItem>
                      <SelectItem
                        value="maintenance"
                        className="text-xs cursor-pointer rounded-lg"
                      >
                        Kỹ thuật / Bảo trì hạ tầng
                      </SelectItem>
                      <SelectItem
                        value="life"
                        className="text-xs cursor-pointer rounded-lg"
                      >
                        Đời sống / Nội quy tòa nhà
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 3. Đối tượng tiếp nhận */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">
                    Phạm vi tiếp nhận
                  </label>
                  <Select
                    value={newNoti.targetType}
                    onValueChange={(val) =>
                      setNewNoti({ ...newNoti, targetType: val })
                    }
                  >
                    <SelectTrigger className="h-9.5 border-slate-200 bg-slate-50/30 rounded-xl text-xs font-semibold px-3 text-slate-700 shadow-3xs focus:ring-0 focus:border-slate-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 p-1 bg-white shadow-md">
                      <SelectItem
                        value="all"
                        className="text-xs cursor-pointer rounded-lg flex items-center gap-1.5"
                      >
                        Gửi toàn bộ tòa nhà
                      </SelectItem>
                      <SelectItem
                        value="room"
                        className="text-xs cursor-pointer rounded-lg flex items-center gap-1.5"
                      >
                        Gửi đích danh phòng
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 4. Nhập mã phòng động (Trượt xuống mượt mà khi chọn gửi đích danh) */}
              {newNoti.targetType === "room" && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2 fade-in duration-200">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">
                    Mã số phòng tiếp nhận cụ thể *
                  </label>
                  <div className="relative flex items-center">
                    <Input
                      placeholder="Ví dụ: 202, 305 (Dùng dấu phẩy nếu gửi nhiều phòng)..."
                      value={newNoti.specificRoom}
                      onChange={(e) =>
                        setNewNoti({ ...newNoti, specificRoom: e.target.value })
                      }
                      className="h-9.5 pl-9 rounded-xl bg-slate-50/30 border-slate-200 text-xs font-mono font-bold text-indigo-600 focus-visible:bg-white focus-visible:border-slate-400 focus-visible:ring-0 shadow-3xs"
                    />
                    <Home
                      size={14}
                      className="absolute left-3 text-slate-400"
                    />
                  </div>
                </div>
              )}

              {/* 5. ĐỔI UX: Mức độ khẩn cấp biến thành Card Radio Groups lì, phẳng thay vì Select */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide select-none">
                  Mức độ khẩn cấp & Độ ưu tiên
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    {
                      key: "low",
                      label: "Thông thường",
                      class:
                        "hover:border-slate-300 border-slate-200 text-slate-700",
                      activeClass:
                        "border-slate-400 bg-slate-50 ring-1 ring-slate-400 text-slate-900",
                    },
                    {
                      key: "medium",
                      label: "Quan trọng",
                      class:
                        "hover:border-amber-300 border-slate-200 text-slate-700",
                      activeClass:
                        "border-amber-400 bg-amber-50/20 ring-1 ring-amber-400 text-amber-800",
                    },
                    {
                      key: "high",
                      label: "Hỏa tốc khẩn",
                      class:
                        "hover:border-rose-300 border-slate-200 text-slate-700",
                      activeClass:
                        "border-rose-400 bg-rose-50/20 ring-1 ring-rose-400 text-rose-800",
                    },
                  ].map((priority) => {
                    const isActive = newNoti.priority === priority.key;
                    return (
                      <button
                        key={priority.key}
                        type="button"
                        onClick={() =>
                          setNewNoti({ ...newNoti, priority: priority.key })
                        }
                        className={`cursor-pointer h-9 text-[11px] font-bold rounded-xl border flex items-center justify-center transition-all select-none ${isActive ? priority.activeClass : priority.class}`}
                      >
                        {priority.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Chi tiết văn bản */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide">
                  Chi tiết nội dung phát thông báo *
                </label>
                <Textarea
                  placeholder="Nhập nội dung văn bản chi tiết gửi tới cư dân, ghi rõ mốc thời gian và hướng dẫn vận hành nếu có..."
                  rows={4}
                  value={newNoti.content}
                  onChange={(e) =>
                    setNewNoti({ ...newNoti, content: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/30 text-xs font-medium text-slate-800 leading-relaxed placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 focus:ring-0 shadow-3xs transition-all resize-none"
                />
              </div>

              {/* 7. Footer điều hướng nút bấm chân form */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 select-none">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsCreateOpen(false)}
                  className="cursor-pointer h-9 px-4 text-xs font-semibold text-slate-400 hover:text-slate-700 rounded-xl"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer h-9 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 uppercase tracking-wider text-[10px] transition-all active:scale-[0.98]"
                >
                  <Send size={12} /> Phát thanh ngay
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {/* 2. THANH PANEL ĐIỀU KHIỂN BỘ LỌC (FILTER BAR) */}
      <section className="bg-white border-b border-slate-200/60 px-6 py-3 flex flex-col sm:flex-row items-center gap-3 justify-between select-none">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Ô Tìm kiếm văn bản */}
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input
              placeholder="Tìm nội dung, đối tượng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8.5 bg-slate-50 border-slate-200 text-xs h-8.5 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/10 focus-visible:border-blue-500 transition-all w-full"
            />
          </div>

          {/* Lọc danh mục */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/30 text-[11px] font-semibold">
            <button
              onClick={() => {
                setTypeFilter("all");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg transition-all ${typeFilter === "all" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-500 hover:text-slate-800"}`}
            >
              Tất cả mục
            </button>
            <button
              onClick={() => {
                setTypeFilter("finance");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg transition-all ${typeFilter === "finance" ? "bg-white text-blue-600 shadow-3xs" : "text-slate-500 hover:text-slate-800"}`}
            >
              Tài chính
            </button>
            <button
              onClick={() => {
                setTypeFilter("maintenance");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg transition-all ${typeFilter === "maintenance" ? "bg-white text-amber-600 shadow-3xs" : "text-slate-500 hover:text-slate-800"}`}
            >
              Kỹ thuật
            </button>
            <button
              onClick={() => {
                setTypeFilter("life");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg transition-all ${typeFilter === "life" ? "bg-white text-emerald-600 shadow-3xs" : "text-slate-500 hover:text-slate-800"}`}
            >
              Đời sống
            </button>
          </div>
        </div>

        {/* Lọc theo Trạng thái gửi của hệ thống */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8.5 w-36 border-slate-200 bg-white rounded-xl text-[11px] font-semibold px-2.5 shadow-3xs focus:ring-0">
              <SelectValue placeholder="Trạng thái gửi" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 text-xs">
              <SelectItem value="all" className="text-xs font-semibold">
                Mọi trạng thái
              </SelectItem>
              <SelectItem
                value="sent"
                className="text-xs text-emerald-600 font-semibold"
              >
                ✓ Đã phát thanh
              </SelectItem>
              <SelectItem
                value="scheduled"
                className="text-xs text-blue-600 font-semibold"
              >
                Lên lịch gửi
              </SelectItem>
              <SelectItem
                value="draft"
                className="text-xs text-slate-400 font-semibold"
              >
                Bản lưu nháp
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* 3. KHU VỰC DANH SÁCH BẢNG TIN (TABLE CHUYÊN NGHIỆP) */}
      <main className="flex-1 p-6 overflow-hidden flex flex-col justify-between">
        <ScrollArea className="flex-1 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <div className="w-full min-w-200 text-xs">
            {/* Header cột bảng */}
            <div className="grid grid-cols-12 gap-4 bg-slate-50/70 p-4 border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider select-none">
              <div className="col-span-5">Nội dung thông báo</div>
              <div className="col-span-2">Phạm vi nhận</div>
              <div className="col-span-2">Trạng thái phát</div>
              <div className="col-span-2">Tỷ lệ xem app</div>
              <div className="col-span-1 text-center">Tác vụ</div>
            </div>

            {/* List dòng dữ liệu */}
            {paginatedNotis.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {paginatedNotis.map((n) => (
                  <div
                    key={n.id}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Cột tiêu đề & nội dung rút gọn */}
                    <div className="col-span-5 space-y-1 pr-4">
                      <div className="flex items-center gap-2">
                        {renderTypeBadge(n.type)}
                        {n.priority === "high" && (
                          <Badge className="bg-red-50 text-red-600 border border-red-100 rounded text-[9px] px-1 font-bold">
                            Khẩn cấp
                          </Badge>
                        )}
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {n.id}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 line-clamp-1 text-[13px] tracking-tight">
                        {n.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium line-clamp-1">
                        {n.content}
                      </p>
                    </div>

                    {/* Cột đối tượng đích danh */}
                    <div className="col-span-2 flex items-center gap-1.5 font-semibold text-slate-600">
                      {n.target.includes("Toàn bộ") ? (
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                      )}
                      <span>{n.target}</span>
                    </div>

                    {/* Cột trạng thái hệ thống */}
                    <div className="col-span-2 select-none">
                      {renderStatusBadge(n.status)}
                      <span className="block text-[10px] text-slate-400 font-medium mt-1 font-mono">
                        {n.createdAt}
                      </span>
                    </div>

                    {/* Cột thống kê lượt đọc thực tế */}
                    <div className="col-span-2 space-y-1 pr-6">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 font-mono">
                        <span>
                          Đã xem: {n.stats.read}/{n.stats.sent}
                        </span>
                        <span>
                          {n.stats.sent > 0
                            ? Math.round((n.stats.read / n.stats.sent) * 100)
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{
                            width: `${n.stats.sent > 0 ? (n.stats.read / n.stats.sent) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Menu Tác vụ */}
                    <div className="col-span-1 text-center select-none">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-40 rounded-xl border-slate-200"
                        >
                          <DropdownMenuItem className="text-xs py-2 cursor-pointer gap-2 font-medium">
                            <Eye className="w-3.5 h-3.5 text-slate-400" /> Xem
                            chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-xs py-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 gap-2 font-semibold"
                            onClick={() => handleDelete(n.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Gỡ bản tin
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center select-none">
                <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-400">
                  Không tìm thấy thông báo phù hợp
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Vui lòng thay đổi cấu hình bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* 4. THANH ĐÁY ĐIỀU HƯỚNG PHÂN TRANG (PAGINATION) */}
        <footer className="flex items-center justify-between pt-4 select-none">
          <p className="text-xs text-slate-400 font-semibold">
            Hiển thị{" "}
            <span className="text-slate-700 font-mono">
              {filteredNotis.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            -{" "}
            <span className="text-slate-700 font-mono">
              {Math.min(currentPage * itemsPerPage, filteredNotis.length)}
            </span>{" "}
            trên tổng số{" "}
            <span className="text-slate-700 font-mono">
              {filteredNotis.length}
            </span>{" "}
            bản ghi
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="h-8.5 w-8.5 rounded-xl border-slate-200 text-slate-500 shadow-3xs hover:bg-white cursor-pointer disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className={`h-8.5 w-8.5 rounded-xl text-xs font-bold font-mono transition-all ${currentPage === page ? "bg-slate-900 text-white shadow-sm border-none" : "border-slate-200 text-slate-600 hover:bg-white"}`}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="h-8.5 w-8.5 rounded-xl border-slate-200 text-slate-500 shadow-3xs hover:bg-white cursor-pointer disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </footer>
      </main>
    </div>
  );
}

// Hàm render badge Danh mục
function renderTypeBadge(type: string) {
  switch (type) {
    case "finance":
      return (
        <Badge
          variant="outline"
          className="border-none bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold px-1.5 py-0.5"
        >
          Tài chính
        </Badge>
      );
    case "maintenance":
      return (
        <Badge
          variant="outline"
          className="border-none bg-amber-50 text-amber-700 rounded-md text-[10px] font-bold px-1.5 py-0.5"
        >
          Bảo trì
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="border-none bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold px-1.5 py-0.5"
        >
          Đời sống
        </Badge>
      );
  }
}

// Hàm render badge Trạng thái
function renderStatusBadge(status: string) {
  switch (status) {
    case "sent":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50/50 border border-emerald-100 px-2 py-0.5 rounded-full">
          <CheckCircle className="w-3 h-3 stroke-[2.5]" /> Đã phát
        </span>
      );
    case "scheduled":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50/50 border border-blue-100 px-2 py-0.5 rounded-full">
          <Clock className="w-3 h-3 stroke-[2.5]" /> Hẹn giờ
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
          <FileText className="w-3 h-3" /> Bản nháp
        </span>
      );
  }
}
