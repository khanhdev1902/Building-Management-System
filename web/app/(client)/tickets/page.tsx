/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Wrench,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Camera,
  ChevronRight,
  User,
  Calendar,
  MessageSquare,
  DollarSign,
  Star,
  Send,
  Building,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormGroup } from "@/shared/components/FormGroup";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface TicketItem {
  id: string;
  category: "ELECTRICAL" | "PLUMBING" | "FURNITURE";
  title: string;
  description: string;
  status: "PENDING" | "PROCESSING" | "RESOLVED";
  urgency: "NORMAL" | "URGENT" | "EMERGENCY";
  createdAt: string;
  worker: string | null;
  // Các trường nghiệp vụ thực tế mở rộng
  billResponsibility: "LESSOR" | "LESSEE" | "UNDETERMINED"; // Chủ nhà chịu / Khách chịu / Chưa quyết định
  estimatedCost: number;
  chatHistory: {
    sender: "TENANT" | "ADMIN" | "WORKER";
    text: string;
    time: string;
  }[];
  rating?: number;
}

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
    billResponsibility: "LESSOR", // Hệ thống tự động phân tích: Hao mòn hạ tầng -> Chủ nhà chịu phí
    estimatedCost: 150000,
    chatHistory: [
      {
        sender: "TENANT",
        text: "Em bật bình lên là sập nguồn luôn ạ, chú qua xem sớm giúp em với.",
        time: "14:22",
      },
      {
        sender: "WORKER",
        text: "Ok cháu, tầm 15h chú cầm đồng hồ vạn năng qua đo lại dòng rò xem sao nhé.",
        time: "14:45",
      },
    ],
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
    billResponsibility: "LESSEE", // Lỗi do khách làm hỏng -> Khách chịu phí sửa, cộng tiền vào hóa đơn tháng sau
    estimatedCost: 350000,
    chatHistory: [
      {
        sender: "ADMIN",
        text: "Đã duyệt cử thợ mang củ sen Viglacera mới qua thay. Chi phí 350k sẽ cộng dồn hóa đơn tháng 5 nhé.",
        time: "09:15",
      },
      {
        sender: "TENANT",
        text: "Dạ vâng lỗi tại em, ban quản lý cứ cộng vào tiền nhà tháng tới giúp em ạ.",
        time: "09:30",
      },
    ],
    rating: 5,
  },
];

export default function TenantTicketsPage() {
  const [tickets, setTickets] = useState<TicketItem[]>(MOCK_TICKETS);
  const [activeTab, setActiveTab] = useState<"LIST" | "CREATE">("LIST");
  const [evidenceImage, setEvidenceImage] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [chatInput, setChatInput] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<any>("PLUMBING");
  const [urgency, setUrgency] = useState<any>("NORMAL");
  const [description, setDescription] = useState("");

  const handleUploadMock = () => {
    setEvidenceImage("issue_evidence_01.jpg");
    toast.success("✓ Đã tải ảnh hiện trạng.");
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Vui lòng điền đủ thông tin!");
      return;
    }

    const newTicket: TicketItem = {
      id: `TCK-2026-0${Math.floor(Math.random() * 900) + 100}`,
      category,
      title,
      description,
      status: "PENDING",
      urgency,
      createdAt: "25/05/2026 01:30",
      worker: null,
      billResponsibility: "UNDETERMINED",
      estimatedCost: 0,
      chatHistory: [],
    };

    setTickets([newTicket, ...tickets]);
    toast.success(
      "✓ Đã bắn lệnh WebSocket đẩy sự cố khẩn cấp về Telegram/Dashboard của Admin chủ nhà!",
    );
    setTitle("");
    setDescription("");
    setEvidenceImage(null);
    setActiveTab("LIST");
  };

  // Luồng bắn tin nhắn realtime ngay trong Ticket sự cố
  const handleSendChatMessage = () => {
    if (!chatInput.trim() || !selectedTicket) return;

    const newMsg = {
      sender: "TENANT" as const,
      text: chatInput,
      time: "01:35",
    };
    const updatedTicket = {
      ...selectedTicket,
      chatHistory: [...selectedTicket.chatHistory, newMsg],
    };

    setTickets(
      tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)),
    );
    setSelectedTicket(updatedTicket);
    setChatInput("");
    toast.success("Đã gửi tin nhắn cho thợ điều phối.");
  };

    function handleOpenDetails(tck: TicketItem): void {
        throw new Error("Function not implemented.");
    }

  return (
    <div className=" mx-auto p-4 md:p-6 space-y-5 bg-slate-50/10 min-h-screen antialiased font-sans select-none pb-24 md:pb-6">
      {/* 1. TOP BAR TIÊU ĐỀ */}
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-slate-900 stroke-[2.2]" />
          Hệ thống kỹ thuật & Khắc phục sự cố
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Quản lý luồng vòng đời sửa chữa, minh bạch hạch toán dòng tiền bảo trì
          thiết bị phòng.
        </p>
      </div>

      {/* 2. TABS DIỆT KHÍT */}
      <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/30 w-full h-10 items-center">
        <button
          onClick={() => setActiveTab("LIST")}
          className={`flex-1 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "LIST"
              ? "bg-white shadow-3xs text-slate-900"
              : "text-slate-500"
          }`}
        >
          Nhật ký sự cố phòng ({tickets.length})
        </button>
        <button
          onClick={() => setActiveTab("CREATE")}
          className={`flex-1 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "CREATE"
              ? "bg-white shadow-3xs text-slate-900"
              : "text-slate-500"
          }`}
        >
          🛠️ Gửi báo cáo hỏng mới
        </button>
      </div>

      {/* ================= GIAO DIỆN 1: LIST CARD THEO DÕI TIẾN ĐỘ SÁU SẮC ================= */}
      {activeTab === "LIST" && (
        <div className="space-y-3">
          {tickets.map((tck) => (
            <div
              key={tck.id}
              onClick={() => handleOpenDetails(tck)}
              className={`p-4 rounded-xl border bg-white shadow-3xs hover:border-slate-300 transition-all cursor-pointer flex flex-col gap-3 group relative overflow-hidden ${
                tck.urgency === "EMERGENCY" && tck.status !== "RESOLVED"
                  ? "border-rose-100/60 bg-rose-50/5"
                  : "border-slate-100"
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 border px-1.5 py-0.5 rounded">
                      {tck.id}
                    </span>
                    {tck.urgency === "EMERGENCY" && (
                      <Badge className="bg-rose-600 text-white shadow-none rounded px-1.5 py-0 text-[9px] font-extrabold uppercase tracking-tight">
                        🚨 Nguy hiểm
                      </Badge>
                    )}
                  </div>
                  <h4 className="text-xs font-black text-slate-900 truncate pt-0.5">
                    {tck.title}
                  </h4>
                </div>

                <div className="shrink-0">
                  {tck.status === "PENDING" && (
                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100/30 animate-pulse">
                      Chờ tiếp nhận
                    </span>
                  )}
                  {tck.status === "PROCESSING" && (
                    <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100/30">
                      ⚙️ Đang xử lý
                    </span>
                  )}
                  {tck.status === "RESOLVED" && (
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/30">
                      ✓ Hoàn thành
                    </span>
                  )}
                </div>
              </div>

              {/* Dòng hiển thị nghiệp vụ tài chính thu gọn */}
              <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500 font-mono border-t border-slate-50 pt-2.5">
                <div className="flex items-center gap-3">
                  <span>📅 {tck.createdAt}</span>
                  {tck.billResponsibility !== "UNDETERMINED" && (
                    <span
                      className={
                        tck.billResponsibility === "LESSOR"
                          ? "text-slate-400"
                          : "text-rose-600 font-bold"
                      }
                    >
                      💰{" "}
                      {tck.billResponsibility === "LESSOR"
                        ? "Chủ nhà chịu phí"
                        : `Khách chịu: ${tck.estimatedCost.toLocaleString()}đ`}
                    </span>
                  )}
                </div>
                <span className="text-slate-400 text-[11px] font-sans font-bold flex items-center gap-0.5 group-hover:text-slate-900">
                  Mở hộp thoại chat <ChevronRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= GIAO DIỆN 2: FORM BÁO HỎNG (GIỮ PHÔI CŨ CỦA ÔNG) ================= */}
      {activeTab === "CREATE" && (
        <form
          onSubmit={handleCreateTicket}
          className="bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-3xs space-y-4"
        >
          <div className="text-xs font-semibold text-slate-700 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormGroup label="Hạng mục kỹ thuật">
                <Select
                  defaultValue={category}
                  onValueChange={(val: any) => setCategory(val)}
                >
                  <SelectTrigger className="h-9 border-slate-200 bg-slate-50/40 rounded-lg text-xs font-medium px-3 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="p-1 rounded-lg border-slate-100 bg-white shadow-lg">
                    <SelectItem value="PLUMBING" className="text-xs">
                      💧 Thiết bị Đường Nước
                    </SelectItem>
                    <SelectItem value="ELECTRICAL" className="text-xs">
                      🔌 Thiết bị Mạng Điện
                    </SelectItem>
                    <SelectItem value="FURNITURE" className="text-xs">
                      🛋️ Nội thất & Cửa gỗ
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>

              <FormGroup label="Mức độ khẩn cấp">
                <Select
                  defaultValue={urgency}
                  onValueChange={(val: any) => setUrgency(val)}
                >
                  <SelectTrigger className="h-9 border-slate-200 bg-slate-50/40 rounded-lg text-xs font-medium px-3 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="p-1 rounded-lg border-slate-100 bg-white">
                    <SelectItem value="NORMAL" className="text-xs">
                      🟢 Bình thường
                    </SelectItem>
                    <SelectItem value="URGENT" className="text-xs">
                      🟡 Cần sửa sớm
                    </SelectItem>
                    <SelectItem
                      value="EMERGENCY"
                      className="text-xs text-rose-600 font-bold"
                    >
                      🔴 Nguy hiểm khẩn cấp
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>
            </div>

            <FormGroup label="Nội dung sự cố vắn tắt">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Cháy bảng mạch bếp từ, vỡ vòi xịt..."
                className="h-9 text-xs border-slate-200 bg-slate-50/10 rounded-lg font-bold"
              />
            </FormGroup>

            <FormGroup label="Mô tả chi tiết và Khung giờ hẹn thợ">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Thợ có thể vào phòng khung giờ nào, vui lòng note rõ..."
                className="text-xs border-slate-200 bg-slate-50/10 rounded-lg min-h-24 resize-none"
              />
            </FormGroup>

            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Bằng chứng hình ảnh
              </span>
              <div
                onClick={handleUploadMock}
                className={`border border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-center cursor-pointer ${evidenceImage ? "border-emerald-200 bg-emerald-50/10 text-emerald-700" : "border-slate-200 bg-white hover:bg-slate-50"}`}
              >
                {evidenceImage ? (
                  <>
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span className="text-[11px] font-mono font-bold text-slate-700">
                      captured_evidence_01.jpg
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={16} className="text-slate-400" />
                    <p className="text-[11px] font-bold text-slate-700">
                      Tải ảnh chụp lỗi thiết bị lên
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setActiveTab("LIST")}
              className="h-9 text-xs font-bold text-slate-400"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              className="h-9 px-5 bg-slate-900 text-white font-bold text-xs rounded-lg uppercase tracking-wider"
            >
              Gửi phiếu bảo hỏng
            </Button>
          </div>
        </form>
      )}

      {/* ================= 3. MODAL HỘP THOẠI CHAT CHUẨN AUDIT + HẠCH TOÁN CHI PHÍ ================= */}
      <Dialog
        open={!!selectedTicket}
        onOpenChange={(open) => {
          if (!open) setSelectedTicket(null);
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md bg-white rounded-xl border border-slate-100 p-5 shadow-2xl flex flex-col h-[520px] font-sans overflow-hidden focus-visible:outline-none">
          <DialogHeader className="border-b border-slate-50 pb-2 text-left shrink-0">
            <div className="flex justify-between items-center pr-6 w-full">
              <DialogTitle className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-1">
                <MessageSquare size={14} className="text-indigo-600" /> Trung
                tâm điều phối lệnh
              </DialogTitle>
              <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border">
                {selectedTicket?.id}
              </span>
            </div>
          </DialogHeader>

          {/* KHỐI HIỂN THỊ TRÁCH NHIỆM TÀI CHÍNH (ĂN KHỚP PHIẾU CHI) */}
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs flex justify-between items-center select-none shrink-0 mt-1">
            <div className="space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Trách nhiệm thanh toán vật tư
              </span>
              <p className="text-slate-800 font-bold">
                {selectedTicket?.billResponsibility === "LESSOR" &&
                  "🏢 Ban quản lý / Chủ nhà đài thọ"}
                {selectedTicket?.billResponsibility === "LESSEE" &&
                  "⚠️ Tính phí vào tiền phòng cư dân"}
                {selectedTicket?.billResponsibility === "UNDETERMINED" &&
                  "◷ Chờ thợ qua khảo sát báo giá"}
              </p>
            </div>
            {selectedTicket?.estimatedCost ? (
              <span className="font-mono font-black text-rose-600 text-sm bg-white border border-slate-100 px-2.5 py-1 rounded-md shadow-3xs">
                {selectedTicket.estimatedCost.toLocaleString()}đ
              </span>
            ) : null}
          </div>

          {/* KHUNG HIỂN THỊ ĐỐI THOẠI CHAT (CHATBOX REALTIME TRỰC QUAN) */}
          <div className="flex-1 my-3 overflow-y-auto p-2 bg-slate-50/40 border border-slate-100 rounded-xl space-y-2 text-xs font-semibold scrollbar-none select-text">
            <div className="bg-white p-2.5 rounded-lg border border-slate-100 space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 block">
                Sự cố diễn giải ban đầu:
              </span>
              <p className="text-slate-800 leading-relaxed font-medium">
                {selectedTicket?.description}
              </p>
            </div>

            {selectedTicket?.chatHistory.map((chat, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[85%] gap-0.5 ${chat.sender === "TENANT" ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                <span className="text-[9px] font-bold text-slate-400 font-mono px-1">
                  {chat.sender === "TENANT"
                    ? "Bạn"
                    : chat.sender === "WORKER"
                      ? "🛠️ Thợ sửa"
                      : "🏢 BQL"}{" "}
                  • {chat.time}
                </span>
                <div
                  className={`p-2.5 rounded-xl leading-normal font-medium ${
                    chat.sender === "TENANT"
                      ? "bg-slate-900 text-white rounded-tr-none"
                      : "bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-3xs"
                  }`}
                >
                  {chat.text}
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER ĐA NĂNG: NẾU SỰ CỐ CHƯA XONG THÌ CHAT, NẾU XONG THÌ CHẤM ĐIỂM RATING THỢ */}
          <div className="border-t border-slate-50 pt-2.5 mt-auto shrink-0 select-none">
            {selectedTicket?.status !== "RESOLVED" ? (
              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Nhắn tin trao đổi với thợ tòa nhà..."
                  className="h-9 text-xs bg-white border-slate-200 rounded-lg font-medium"
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSendChatMessage()
                  }
                />
                <Button
                  onClick={handleSendChatMessage}
                  className="h-9 bg-slate-900 text-white rounded-lg px-3.5 cursor-pointer shrink-0"
                >
                  <Send size={13} />
                </Button>
              </div>
            ) : (
              <div className="space-y-2.5 text-center py-1">
                <div className="text-[11px] font-bold text-emerald-700 flex items-center justify-center gap-1 bg-emerald-50 border border-emerald-100/50 py-1.5 rounded-lg">
                  <CheckCircle2 size={13} className="stroke-[2.5]" /> Công tác
                  khắc phục sự cố đã hoàn tất!
                </div>
                {/* Luồng Chấm Sao Đánh Giá Thợ Ngay Trên Mobile */}
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">
                    Đánh giá thợ:
                  </span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= (selectedTicket?.rating || 5)
                          ? "text-amber-400 fill-amber-400 cursor-pointer"
                          : "text-slate-200 cursor-pointer"
                      }
                      onClick={() =>
                        toast.success(`✓ Cảm ơn cưng đã vote thợ ${star} sao!`)
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
