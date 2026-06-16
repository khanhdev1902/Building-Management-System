/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Wrench,
  Plus,
  ChevronRight,
  UploadCloud,
  Calendar,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { TicketDetailModal } from "./components/ticket-detail-modal";

interface TicketItem {
  id: string;
  category: "ELECTRICAL" | "PLUMBING" | "FURNITURE";
  title: string;
  description: string;
  status: "PENDING" | "PROCESSING" | "RESOLVED" | "CANCELLED";
  urgency: "NORMAL" | "URGENT" | "EMERGENCY";
  createdAt: string;
  worker: string | null;
  billResponsibility: "LESSOR" | "LESSEE" | "UNDETERMINED";
  estimatedCost: number;
  materialsDetails?: { name: string; price: number }[];
  notes?: string;
  appointmentTime?: string;
  resident: string;
  room: string;
  phone: string;
}

// Bổ sung thêm data mẫu để test tính năng phân trang thực tế
const MOCK_TICKETS: TicketItem[] = [
  {
    id: "TCK-2026-089",
    category: "ELECTRICAL",
    title: "Aptomat phòng ngủ tự động sập khi bật bình nóng lạnh",
    description:
      "Cứ bật bình nóng lạnh lên được tầm 5 phút là aptomat tổng của phòng tự nhảy, sập toàn bộ điện.",
    status: "PROCESSING",
    urgency: "EMERGENCY",
    createdAt: "24/05/2026 14:20",
    worker: "Thợ điện tòa nhà (Chú Ba)",
    billResponsibility: "LESSOR",
    estimatedCost: 150000,
    materialsDetails: [{ name: "Thay Aptomat khối 32A", price: 150000 }],
    resident: "Nguyễn Văn Khanh",
    room: "201",
    phone: "0987654321",
  },
  {
    id: "TCK-2026-054",
    category: "PLUMBING",
    title: "Gãy vòi sen nhà tắm do bất cẩn kéo mạnh",
    description:
      "Em vô tình vấp té giật mạnh làm gãy khấc củ sen, xin lỗi ban quản lý, nhờ thợ qua thay mới giúp em.",
    status: "RESOLVED",
    urgency: "NORMAL",
    createdAt: "12/04/2026 09:00",
    worker: "Điện nước Thành Công",
    billResponsibility: "LESSEE",
    estimatedCost: 350000,
    materialsDetails: [
      { name: "Củ sen tắm Viglacera", price: 300000 },
      { name: "Băng tan & gioăng cao su phụ trợ", price: 5000 },
    ],
    resident: "Nguyễn Văn Khanh",
    room: "201",
    phone: "0987654321",
  },
  {
    id: "TCK-2026-032",
    category: "FURNITURE",
    title: "Bản lề cánh tủ quần áo bị rơ ốc vít bung ra ngoài",
    description:
      "Cánh tủ gỗ ép bên phải bị xệ xuống, đóng vào mở ra kêu kèn kẹt kẹt do bung hết chân ren vít.",
    status: "RESOLVED",
    urgency: "NORMAL",
    createdAt: "05/04/2026 16:30",
    worker: "Thợ mộc Thạch Thất",
    billResponsibility: "LESSOR",
    estimatedCost: 0,
    materialsDetails: [],
    resident: "Nguyễn Văn Khanh",
    room: "201",
    phone: "0987654321",
  },
];

const ITEMS_PER_PAGE = 5; // Cấu hình mỗi trang 2 bản ghi để thấy rõ luồng phân trang

export default function TenantTicketsPage() {
  const [tickets, setTickets] = useState<TicketItem[]>(MOCK_TICKETS);
  const [evidenceImage, setEvidenceImage] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);

  // States quản lý phân trang phẳng
  const [currentPage, setCurrentPage] = useState(1);

  // Form states tạo sự cố mới
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<any>("PLUMBING");
  const [urgency, setUrgency] = useState<any>("NORMAL");
  const [description, setDescription] = useState("");

  // Xử lý phân tách mảng data theo trang hiện tại
  const totalPages = Math.ceil(tickets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTickets = tickets.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleUploadMock = () => {
    setEvidenceImage("issue_evidence_01.jpg");
    toast.success("Đã nhận diện tệp hình ảnh minh chứng hiện trạng.");
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newTicket: TicketItem = {
      id: `TCK-2026-${Math.floor(Math.random() * 900) + 100}`,
      category,
      title,
      description,
      status: "PENDING",
      urgency,
      createdAt: "15/06/2026 11:15",
      worker: null,
      billResponsibility: "UNDETERMINED",
      estimatedCost: 0,
      materialsDetails: [],
      resident: "Nguyễn Văn Khanh",
      room: "201",
      phone: "0987654321",
    };

    setTickets([newTicket, ...tickets]);
    toast.success("Đã đẩy lệnh báo hỏng lên Dashboard điều phối hệ thống.");
    setCurrentPage(1); // Tự động đẩy cư dân về trang đầu để thấy ticket mới tạo
    setTitle("");
    setDescription("");
    setEvidenceImage(null);
    setIsCreateOpen(false);
  };

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case "EMERGENCY":
        return "bg-slate-900 text-white border-transparent text-[9px] font-bold";
      case "URGENT":
        return "bg-slate-100 text-slate-900 border-slate-300 text-[9px] font-medium";
      default:
        return "bg-white text-slate-400 border-slate-200 text-[9px] font-normal";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "● Chờ tiếp nhận";
      case "PROCESSING":
        return "● Đang sửa chữa";
      case "RESOLVED":
        return "✓ Đã nghiệm thu";
      case "CANCELLED":
        return "✕ Đã hủy bỏ";
      default:
        return status;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white min-h-screen flex flex-col justify-between antialiased font-sans text-slate-900 selection:bg-slate-100">
      <div className="space-y-6 flex-1">
        {/* 1. TOP BAR CONTROL PANEL */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-6 mb-6">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Wrench className="w-3.5 h-3.5" />
              <span>Trung tâm kỹ thuật Danjin</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Nhật ký & Khắc phục sự cố nội khu
            </h1>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="h-9 w-full sm:w-auto bg-slate-900 text-white font-medium text-xs rounded-lg hover:bg-slate-800 gap-1.5 px-4 shadow-sm active:scale-98 transition-all"
          >
            <Plus size={14} className="stroke-[2.5]" /> Khai báo sự cố mới
          </Button>
        </div>

        {/* 2. FLAT LIST SỰ CỐ - ĐỒNG BỘ RESPONSIVE MOBILE */}
        <div className="border border-slate-200/70 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white shadow-2xs">
          {paginatedTickets.length > 0 ? (
            paginatedTickets.map((tck) => (
              <div
                key={tck.id}
                onClick={() => setSelectedTicket(tck)}
                className="p-4 md:p-5 hover:bg-slate-50/50 transition-colors cursor-pointer flex flex-col gap-3 relative group"
              >
                {/* Dòng 1: Header Badge dạng cụm phẳng */}
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded border font-mono font-bold tracking-tight ${getUrgencyStyle(tck.urgency)}`}
                    >
                      {tck.urgency}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-slate-400">
                      {tck.id}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`text-xs font-semibold ${
                        tck.status === "PENDING"
                          ? "text-slate-400"
                          : tck.status === "PROCESSING"
                            ? "text-slate-900 font-bold"
                            : tck.status === "CANCELLED"
                              ? "text-red-500 line-through opacity-60"
                              : "text-slate-500 font-medium"
                      }`}
                    >
                      {getStatusText(tck.status)}
                    </span>
                  </div>
                </div>

                {/* Dòng 2: Nội dung cốt lõi */}
                <div>
                  <h3 className="text-sm font-bold tracking-tight leading-snug text-slate-800 group-hover:text-slate-900">
                    {tck.title}
                  </h3>
                  <p className="text-xs text-slate-400 truncate mt-1 font-medium">
                    {tck.description}
                  </p>
                </div>

                {/* Dòng 3: Footer meta dạng Flex-wrap tự động xuống hàng khi màn hình hẹp */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400 font-medium font-mono">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />{" "}
                      {tck.createdAt.split(" ")[0]}
                    </span>
                    {tck.billResponsibility !== "UNDETERMINED" && (
                      <span
                        className={
                          tck.billResponsibility === "LESSOR"
                            ? "text-slate-400"
                            : "text-slate-900 font-semibold"
                        }
                      >
                        {tck.billResponsibility === "LESSOR"
                          ? "• Chủ nhà bảo trì"
                          : `• Tiền vật tư: ${tck.estimatedCost.toLocaleString()}đ`}
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 font-sans font-semibold flex items-center gap-0.5 group-hover:text-slate-900 transition-colors justify-end sm:justify-start">
                    Chi tiết xử lý <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm font-medium">
              Chưa ghi nhận bất kỳ lịch sử sự cố nào tại phòng này.
            </div>
          )}
        </div>
      </div>

      {/* 3. PAGINATION BAR - ĐƯỜNG KẺ MẢNH PHẲNG CHUẨN SAAS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6 select-none shrink-0 text-xs">
          <span className="text-slate-400 font-medium font-mono">
            Hiển thị {startIndex + 1}-
            {Math.min(startIndex + ITEMS_PER_PAGE, tickets.length)} /{" "}
            {tickets.length} kết quả
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 rounded-lg border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 shadow-none cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </Button>
            <span className="font-mono font-bold text-slate-700 px-2 bg-slate-100 h-8 flex items-center rounded-lg border border-slate-200/50">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="h-8 w-8 rounded-lg border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 shadow-none cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </Button>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: FORM KHAI BÁO SỰ CỐ MỚI (RESPONSIVE CHẶT) ================= */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md bg-white rounded-xl border border-slate-200 p-4 md:p-6 flex flex-col shadow-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader className="border-b border-slate-100 pb-3 text-left">
            <DialogTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-slate-900" /> Tạo phiếu báo
              hỏng thiết bị
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleCreateTicket}
            className="space-y-4 pt-3 text-xs text-slate-700 font-medium"
          >
            {/* Chuyển grid thành 1 cột trên Mobile để Input không bị méo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Hạng mục thiết bị
                </label>
                <Select
                  defaultValue={category}
                  onValueChange={(val: any) => setCategory(val)}
                >
                  <SelectTrigger className="h-9 border border-slate-200 bg-white rounded-lg text-xs font-medium px-3 focus:ring-0 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="p-1 rounded-lg bg-white text-xs font-medium border-slate-200 shadow-md">
                    <SelectItem value="PLUMBING">
                      💧 Hệ thống nước sinh hoạt
                    </SelectItem>
                    <SelectItem value="ELECTRICAL">
                      🔌 Hệ thống điện tử / nguồn
                    </SelectItem>
                    <SelectItem value="FURNITURE">
                      🛋️ Kết cấu đồ gỗ / Nội thất
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Mức độ ưu tiên
                </label>
                <Select
                  defaultValue={urgency}
                  onValueChange={(val: any) => setUrgency(val)}
                >
                  <SelectTrigger className="h-9 border border-slate-200 bg-white rounded-lg text-xs font-medium px-3 focus:ring-0 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="p-1 rounded-lg bg-white text-xs font-medium border-slate-200 shadow-md">
                    <SelectItem value="NORMAL">● Thông thường</SelectItem>
                    <SelectItem value="URGENT">● Cần xử lý sớm</SelectItem>
                    <SelectItem
                      value="EMERGENCY"
                      className="text-slate-900 font-bold"
                    >
                      ● Khẩn cấp trục kỹ thuật
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Tiêu đề vắn tắt sự cố *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Nứt đường ống mềm chậu rửa bát mặt bếp"
                className="h-9 text-xs border-slate-200 bg-white rounded-lg focus-visible:ring-0 focus-visible:border-slate-400 w-full"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Mô tả chi tiết hiện trạng & Khung giờ hẹn *
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả kỹ hiện tượng rò rỉ, chập cháy và ghi chú thời gian có thể ở phòng tiếp thợ kỹ thuật..."
                className="text-xs border-slate-200 bg-white rounded-lg min-h-20 resize-none focus-visible:ring-0 focus-visible:border-slate-400 w-full"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                Hình ảnh / Bằng chứng hiện trạng
              </label>
              <div
                onClick={handleUploadMock}
                className={`border border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center transition-colors ${
                  evidenceImage
                    ? "border-slate-400 bg-slate-50 text-slate-800"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
                }`}
              >
                {evidenceImage ? (
                  <span className="text-[11px] font-mono font-bold">
                    ✓ live_captured_evidence.jpg
                  </span>
                ) : (
                  <>
                    <UploadCloud size={16} className="text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                      Tải ảnh chụp thực tế lên máy chủ
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Bộ nút chân Modal tự động co giãn / đổi thứ tự bấm khi ở Mobile */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="w-full sm:flex-1 h-9.5 text-xs font-semibold border-slate-200 text-slate-400 bg-white rounded-lg"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                className="w-full sm:flex-1 h-9.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm uppercase tracking-wider"
              >
                Phát lệnh báo hỏng
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 2: CHI TIẾT NGHIỆM THU PHẲNG ĐƠN CỘT (READONLY) ================= */}
      <TicketDetailModal
        selectedTicket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
}
