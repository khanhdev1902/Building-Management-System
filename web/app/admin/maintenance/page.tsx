/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  User,
  MapPin,
  DollarSign,
  Calendar,
  Eye,
  UserCheck,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { toast } from "sonner";

// Mock Data chuẩn quy trình Ticket bảo trì thực tế tại chung cư mini
const INITIAL_TICKETS = [
  {
    id: "TK-4420",
    room: "Phòng 202 - LuxHouse",
    resident: "Trần Thế Anh",
    phone: "0934567890",
    category: "plumbing", // plumbing | electrical | appliance | infrastructure
    title: "Rò rỉ đường ống bồn rửa mặt, thấm tường sàn",
    description:
      "Nước rò rỉ từ khớp nối dưới bồn rửa mặt làm ướt hết sàn nhà vệ sinh và có dấu hiệu ngấm xuống trần phòng 102 phía dưới. Cần xử lý gấp.",
    priority: "high", // low | medium | high
    status: "pending", // pending | processing | completed | canceled
    assignedTo: "",
    createdAt: "21/05/2026 06:15",
    cost: 0,
    notes: "",
  },
  {
    id: "TK-4418",
    room: "Phòng 104 - LuxHouse",
    resident: "Nguyễn Văn Anh",
    phone: "0356789123",
    category: "electrical",
    title: "Chập hỏng Aptomat điều hòa",
    description:
      "Bật điều hòa lên khoảng 5 phút là aptomat tự nhảy, sờ vào thấy rất nóng. Nghi ngờ bị chập dây nguồn hoặc hỏng át.",
    priority: "high",
    status: "processing",
    assignedTo: "Thợ điện Nguyễn Văn Hùng",
    createdAt: "20/05/2026 14:30",
    cost: 150000,
    notes: "Đang mua aptomat 32A mới để thay thế.",
  },
  {
    id: "TK-4415",
    room: "Phòng 405 - LuxHouse",
    resident: "Lê Văn Nam",
    phone: "0789123456",
    category: "appliance",
    title: "Tủ lạnh đóng tuyết dày, không mát ngăn dưới",
    description:
      "Tủ lạnh mini trang bị sẵn trong phòng đóng tuyết quá dày ở ngăn đông, dẫn đến ngăn mát phía dưới không có hơi lạnh làm hỏng đồ ăn.",
    priority: "medium",
    status: "completed",
    assignedTo: "Kỹ thuật Lê Minh Đức",
    createdAt: "19/05/2026 09:15",
    cost: 200000,
    notes: "Đã xả tuyết, thông ống thoát nước thải và nạp thêm gas điều hòa.",
  },
  {
    id: "TK-4410",
    room: "Khu vực chung",
    resident: "Bảo vệ tòa nhà",
    phone: "BQL",
    category: "infrastructure",
    title: "Cháy bóng đèn LED hành lang tầng 3",
    description:
      "Bóng tuýp LED ở lối đi hành lang trước cửa phòng 301 bị nhấp nháy liên tục rồi tắt hẳn, gây tối lối đi chung.",
    priority: "low",
    status: "completed",
    assignedTo: "Kỹ thuật Lê Minh Đức",
    createdAt: "18/05/2026 10:00",
    cost: 65000,
    notes: "Đã thay bóng tuýp LED 1m2 mới.",
  },
];

// Danh sách đội thợ nội bộ của tòa nhà
const TECHNICIANS = [
  "Kỹ thuật Lê Minh Đức (Nội bộ)",
  "Thợ điện Nguyễn Văn Hùng (Đối tác)",
  "Thợ nước Trần Văn thạch (Đối tác)",
];

export default function MaintenanceTicketsManagement() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // State chi tiết ticket phục vụ luồng điều phối nghiệp vụ
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  // State phục vụ cập nhật nghiệp vụ trên Modal
  const [assignee, setAssignee] = useState("");
  const [ticketCost, setTicketCost] = useState("0");
  const [adminNotes, setAdminNotes] = useState("");

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Xử lý Lọc & Tìm kiếm dữ liệu nâng cao
  const filteredTickets = useMemo(() => {
    return tickets.filter((tk) => {
      const matchesSearch =
        tk.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tk.resident.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tk.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || tk.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || tk.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [tickets, searchQuery, statusFilter, categoryFilter]);

  // Dữ liệu cắt theo phân trang
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTickets, currentPage]);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage) || 1;

  // Mở modal và nạp dữ liệu cũ của ticket vào state điều khiển
  const openDetailDialog = (ticket: any) => {
    setSelectedTicket(ticket);
    setAssignee(ticket.assignedTo || "");
    setTicketCost(ticket.cost.toString());
    setAdminNotes(ticket.notes || "");
  };

  // Cập nhật lệnh điều phối nội bộ (Lưu Ticket)
  const handleUpdateTicket = (statusTarget?: string) => {
    if (!selectedTicket) return;

    setTickets(
      tickets.map((tk) => {
        if (tk.id === selectedTicket.id) {
          return {
            ...tk,
            assignedTo: assignee,
            cost: parseFloat(ticketCost) || 0,
            notes: adminNotes,
            status: statusTarget || tk.status,
          };
        }
        return tk;
      }),
    );

    setSelectedTicket(null);
    toast.success(
      `Đã cập nhật trạng thái xử lý cho sự cố ${selectedTicket.id}!`,
    );
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50/50 text-slate-900 font-sans antialiased overflow-hidden">
      {/* 1. TOP MAIN HEADER */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-xs select-none">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-950 text-white rounded-xl shadow-sm">
            <Wrench className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Trung tâm Quản lý Sửa chữa & Bảo trì
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Tiếp nhận sự cố, điều phối kỹ thuật viên, theo dõi vật tư hư hại
              trong căn hộ
            </p>
          </div>
        </div>
        <Badge className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-3 py-1 rounded-lg">
          {tickets.filter((t) => t.status === "pending").length} Yêu cầu chưa xử
          lý
        </Badge>
      </header>

      {/* 2. ADVANCED FILTERS BAR CONTROL */}
      <section className="bg-white border-b border-slate-200/60 px-6 py-3 flex flex-col sm:flex-row items-center gap-3 justify-between select-none">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Ô tìm kiếm thực thể hỏa tốc */}
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <Input
              placeholder="Tìm số phòng, tên cư dân, mã TK..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8.5 bg-slate-50 border-slate-200 text-xs h-8.5 rounded-xl focus-visible:ring-2 focus-visible:ring-slate-950/10 focus-visible:border-slate-800 transition-all font-medium"
            />
          </div>

          {/* Lọc theo hạng mục hư hại */}
          <Select
            value={categoryFilter}
            onValueChange={(val) => {
              setCategoryFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8.5 w-36 border-slate-200 bg-slate-50 text-[11px] font-semibold px-2.5 rounded-xl shadow-3xs">
              <SelectValue placeholder="Hạng mục sửa chữa" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 text-xs font-medium">
              <SelectItem value="all" className="font-semibold">
                Mọi hạng mục
              </SelectItem>
              <SelectItem value="plumbing">Đường nước / Vệ sinh</SelectItem>
              <SelectItem value="electrical">Hệ thống điện</SelectItem>
              <SelectItem value="appliance">Thiết bị gia dụng</SelectItem>
              <SelectItem value="infrastructure">Hạ tầng tòa nhà</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lọc theo trạng thái xử lý */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8.5 w-36 border-slate-200 bg-white rounded-xl text-[11px] font-semibold px-2.5 shadow-3xs">
              <SelectValue placeholder="Trạng thái Ticket" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 text-xs font-bold">
              <SelectItem value="all" className="text-slate-800">
                Tất cả trạng thái
              </SelectItem>
              <SelectItem value="pending" className="text-red-600">
                🔴 Tiếp nhận mới
              </SelectItem>
              <SelectItem value="processing" className="text-amber-600">
                ⏰ Đang sửa chữa
              </SelectItem>
              <SelectItem value="completed" className="text-emerald-600">
                ✓ Đã hoàn thành
              </SelectItem>
              <SelectItem value="canceled" className="text-slate-400">
                ✕ Đã hủy bỏ
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* 3. MAINTENANCE TICKETS DATA LIST TABLE */}
      <main className="flex-1 p-6 overflow-hidden flex flex-col justify-between">
        <ScrollArea className="flex-1 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <div className="w-full min-w-237.5 text-xs">
            {/* Header Column Row */}
            <div className="grid grid-cols-12 gap-4 bg-slate-50/70 p-4 border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider select-none">
              <div className="col-span-1">Mã số</div>
              <div className="col-span-2">Vị trí / Cư dân</div>
              <div className="col-span-4">Nội dung báo hỏng</div>
              <div className="col-span-2">Thợ sửa chữa</div>
              <div className="col-span-2">Trạng thái</div>
              <div className="col-span-1 text-center">Xử lý</div>
            </div>

            {/* List Body Rows */}
            {paginatedTickets.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {paginatedTickets.map((tk) => (
                  <div
                    key={tk.id}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50/40 transition-colors"
                  >
                    {/* 1. ID Ticket */}
                    <div className="col-span-1 font-mono font-bold text-slate-400 text-[11px]">
                      {tk.id}
                    </div>

                    {/* 2. Phòng & Tên cư dân */}
                    <div className="col-span-2 space-y-0.5">
                      <div className="flex items-center gap-1 font-bold text-slate-800 text-[12.5px] tracking-tight">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{tk.room}</span>
                      </div>
                      <span className="block text-[11px] text-slate-400 font-medium pl-4">
                        {tk.resident}
                      </span>
                    </div>

                    {/* 3. Nội dung báo lỗi */}
                    <div className="col-span-4 space-y-1 pr-6">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {renderCategoryBadge(tk.category)}
                        {tk.priority === "high" && (
                          <Badge className="bg-red-50 text-red-600 border border-red-100 rounded text-[9px] font-black px-1">
                            Khẩn cấp
                          </Badge>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {tk.createdAt}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 line-clamp-1 text-[13px] tracking-tight">
                        {tk.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium line-clamp-1">
                        {tk.description}
                      </p>
                    </div>

                    {/* 4. Thợ sửa chữa được gán việc */}
                    <div className="col-span-2 flex items-center gap-1.5 font-semibold text-slate-600 text-[11.5px]">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {tk.assignedTo || (
                          <span className="text-slate-300 font-medium italic">
                            Chưa điều thợ
                          </span>
                        )}
                      </span>
                    </div>

                    {/* 5. Trạng thái Ticket */}
                    <div className="col-span-2 flex flex-col gap-1 select-none">
                      {renderStatusBadge(tk.status)}
                      {tk.cost > 0 && (
                        <span className="text-[10px] text-slate-500 font-bold font-mono flex items-center gap-0.5">
                          <DollarSign className="w-3 h-3 text-slate-400" /> Vật
                          tư: {tk.cost.toLocaleString("vi-VN")}đ
                        </span>
                      )}
                    </div>

                    {/* 6. Action Button kích hoạt điều khiển */}
                    <div className="col-span-1 text-center select-none">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openDetailDialog(tk)}
                        className="h-8 w-8 rounded-xl border-slate-200 text-slate-500 hover:text-slate-900 shadow-3xs cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center select-none">
                <ClipboardList className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-400">
                  Không tìm thấy yêu cầu sửa chữa nào
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Vui lòng thay đổi cấu hình bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* 4. PAGINATION CONTROLS FOOTER */}
        <footer className="flex items-center justify-between pt-4 select-none">
          <p className="text-xs text-slate-400 font-semibold">
            Hiển thị yêu cầu{" "}
            <span className="text-slate-700 font-mono">
              {filteredTickets.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            -{" "}
            <span className="text-slate-700 font-mono">
              {Math.min(currentPage * itemsPerPage, filteredTickets.length)}
            </span>{" "}
            trên tổng số{" "}
            <span className="text-slate-700 font-mono">
              {filteredTickets.length}
            </span>{" "}
            phiếu bảo trì căn hộ
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="h-8.5 w-8.5 rounded-xl border-slate-200 text-slate-500 shadow-3xs hover:bg-white disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className={`h-8.5 w-8.5 rounded-xl text-xs font-bold font-mono transition-all ${currentPage === page ? "bg-slate-950 text-white border-none shadow-sm" : "border-slate-200 text-slate-600 hover:bg-white"}`}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="h-8.5 w-8.5 rounded-xl border-slate-200 text-slate-500 shadow-3xs hover:bg-white disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </footer>
      </main>

      {/* ================= MODAL DIALOG: ĐIỀU PHỐI VÀ CẬP NHẬT TIẾN ĐỘ SỬA CHỮA ================= */}
      <Dialog
        open={!!selectedTicket}
        onOpenChange={(open) => !open && setSelectedTicket(null)}
      >
        <DialogContent className="sm:max-w-137.5 bg-white rounded-2xl p-6 font-sans">
          <DialogHeader className="select-none">
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" /> Thẩm định & Điều phối
              lệnh sửa chữa
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Mã phiếu: {selectedTicket?.id} — Khai báo khởi tạo bởi cư dân căn
              hộ.
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4 pt-2 text-xs">
              {/* Thẻ tóm tắt thông tin báo lỗi của cư dân */}
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-2">
                <div className="flex justify-between font-bold text-slate-800 text-[13px]">
                  <span>Vị trí: {selectedTicket.room}</span>
                  <span className="text-slate-400 text-xs font-medium font-mono">
                    {selectedTicket.createdAt}
                  </span>
                </div>
                <p className="font-semibold text-slate-700 text-[12px]">
                  Sự cố:{" "}
                  <span className="text-slate-900 font-bold">
                    {selectedTicket.title}
                  </span>
                </p>
                <p className="text-slate-500 font-medium leading-relaxed bg-white p-2 rounded-lg border border-slate-200/40 text-[11.5px] max-h-24 overflow-y-auto">
                  {selectedTicket.description}
                </p>
                <div className="text-[11px] text-slate-400 font-medium font-mono">
                  Người báo: {selectedTicket.resident} — ĐT:{" "}
                  {selectedTicket.phone}
                </div>
              </div>

              {/* KHAY FORM ĐIỀU PHỐI CỦA ADMIN */}
              <div className="space-y-3.5 border-t border-slate-100 pt-3">
                {/* 1. Chọn thợ sửa chữa */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" /> Chỉ
                    định nhân sự sửa chữa
                  </label>
                  <Select value={assignee} onValueChange={setAssignee}>
                    <SelectTrigger className="h-9.5 border-slate-200 bg-slate-50/50 rounded-xl text-xs font-semibold focus:ring-0">
                      <SelectValue placeholder="--- Bấm để chọn thợ xử lý sực cố ---" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 text-xs font-medium">
                      {TECHNICIANS.map((tech) => (
                        <SelectItem key={tech} value={tech} className="text-xs">
                          {tech}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Cập nhật chi phí vật tư */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Chi
                    phí vật tư phát sinh (nếu có)
                  </label>
                  <div className="relative group">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <Input
                      type="number"
                      placeholder="Nhập số tiền mặt phụ tùng vật tư..."
                      value={ticketCost}
                      onChange={(e) => setTicketCost(e.target.value)}
                      className="h-9.5 pl-8.5 bg-slate-50/50 border-slate-200 rounded-xl font-mono font-bold text-slate-800 text-xs focus-visible:bg-white transition-all shadow-2xs"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      VND
                    </span>
                  </div>
                </div>

                {/* 3. Nhật ký nghiệm thu kỹ thuật */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">
                    Nhật ký / Ghi chú nghiệm thu của ban quản lý
                  </label>
                  <Textarea
                    placeholder="Ghi lại vật tư đã thay, nguyên nhân hỏng hoặc lý do lùi lịch sửa chữa..."
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="rounded-xl bg-slate-50/50 border-slate-200 text-xs font-medium leading-relaxed p-3 focus-visible:bg-white resize-none"
                  />
                </div>
              </div>

              {/* Điều phối luồng Button chuyển đổi trạng thái thực tế */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 select-none">
                <div className="flex gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleUpdateTicket("canceled")}
                    className="h-9 text-xs text-slate-400 border-slate-200 hover:text-red-600 hover:bg-red-50/20 font-bold rounded-xl"
                  >
                    Hủy Ticket
                  </Button>
                </div>

                <div className="flex gap-1.5">
                  {selectedTicket.status !== "completed" && (
                    <Button
                      type="button"
                      onClick={() => handleUpdateTicket("processing")}
                      className="h-9 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm"
                    >
                      Báo đang sửa
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={() => handleUpdateTicket("completed")}
                    className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm"
                  >
                    ✓ Hoàn thành nghiệm thu
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper kết xuất Badge danh mục sự cố
function renderCategoryBadge(cat: string) {
  switch (cat) {
    case "plumbing":
      return (
        <Badge
          variant="outline"
          className="border-none bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold px-1.5 py-0.5"
        >
          Đường nước
        </Badge>
      );
    case "electrical":
      return (
        <Badge
          variant="outline"
          className="border-none bg-amber-50 text-amber-700 rounded-md text-[10px] font-bold px-1.5 py-0.5"
        >
          Hệ thống điện
        </Badge>
      );
    case "appliance":
      return (
        <Badge
          variant="outline"
          className="border-none bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-bold px-1.5 py-0.5"
        >
          Gia dụng
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="border-none bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold px-1.5 py-0.5"
        >
          Hạ tầng chung
        </Badge>
      );
  }
}

// Helper kết xuất Badge trạng thái xử lý tiến độ Ticket
function renderStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] w-fit font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
          <AlertTriangle className="w-3 h-3 stroke-[2.5]" /> Tiếp nhận mới
        </span>
      );
    case "processing":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] w-fit font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
          <Clock className="w-3 h-3 stroke-[2.5]" /> Đang sửa chữa
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] w-fit font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
          <CheckCircle className="w-3 h-3 stroke-[2.5]" /> Hoàn thành
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[11px] w-fit font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
          <XCircle className="w-3 h-3" /> Đã hủy bỏ
        </span>
      );
  }
}
