/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Send,
  ShieldCheck,
  Paperclip,
  MessageSquare,
  Users,
  Info,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { toast } from "sonner";

interface MessageItem {
  id: string;
  sender: "TENANT" | "ADMIN" | "NEIGHBOR";
  senderName?: string;
  roomNo?: string;
  text: string;
  time: string;
}

// 1. KHO DỮ LIỆU CHAT 1-1 RIÊNG TƯ VỚI BQL (ĐỒNG BỘ ẢNH CHỤP MÀN HÌNH ADMIN CỦA ÔNG)
const PRIVATE_CHAT_HISTORY: MessageItem[] = [
  {
    id: "p-1",
    sender: "TENANT",
    text: "Chào ban quản lý, cho em hỏi chút ạ.",
    time: "18:28",
  },
  {
    id: "p-2",
    sender: "TENANT",
    text: "Tháng này phòng em đi làm suốt mà sao hóa đơn nước lên tới 450.000đ lận?",
    time: "18:29",
  },
  {
    id: "p-3",
    sender: "ADMIN",
    text: "Chào Thế Anh, dạ để bên kỹ thuật kiểm tra lại đồng hồ đo nước ở đầu tầng 2 của phòng mình liền nha.",
    time: "18:30",
  },
  {
    id: "p-4",
    sender: "TENANT",
    text: "Dạ ban quản lý kiểm tra hộ em hóa đơn nước tăng bất thường với ạ!",
    time: "18:32",
  },
];

// 2. KHO DỮ LIỆU GROUP CHAT CHUNG TOÀN TÒA (CỘNG ĐỒNG CƯ DÂN)
const GROUP_CHAT_HISTORY: MessageItem[] = [
  {
    id: "g-1",
    sender: "NEIGHBOR",
    senderName: "Lê Minh Hoàng",
    roomNo: "105",
    text: "Shipper để cái thùng hàng to đùng ở sảnh tầng 1 là của phòng nào xuống lấy giúp em với nha, vướng lối dắt xe quá ạ.",
    time: "08:15",
  },
  {
    id: "g-2",
    sender: "NEIGHBOR",
    senderName: "Vũ Thu Thảo",
    roomNo: "401",
    text: "Của phòng 401 đó ạ, em đang đi học tí em nhờ bạn qua khênh lên liền, em cảm ơn.",
    time: "08:20",
  },
  {
    id: "g-3",
    sender: "ADMIN",
    senderName: "BQL (Chị Quản Lý)",
    text: "Nhắc nhở chung cả tòa nhà: Tối nay 21h xe hút bể phốt qua làm việc, các phòng dưới tầng 1 đóng kín cửa ban công tránh ám mùi nhé.",
    time: "10:00",
  },
  {
    id: "g-4",
    sender: "TENANT",
    text: "Phòng 202 đã nhận thông tin từ BQL ạ.",
    time: "10:15",
  },
];

export default function TenantChatPage() {
  const searchParams = useSearchParams();

  // Đọc động tham số trên thanh URL để quyết định state ban đầu khi vào trang
  const typeParam = searchParams.get("type") === "group" ? "GROUP" : "PRIVATE";

  const [chatMode, setChatMode] = useState<"PRIVATE" | "GROUP">(typeParam);
  const [privateMsgs, setPrivateMsgs] =
    useState<MessageItem[]>(PRIVATE_CHAT_HISTORY);
  const [groupMsgs, setGroupMsgs] = useState<MessageItem[]>(GROUP_CHAT_HISTORY);
  const [typedMessage, setTypedMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lắng nghe sự kiện click thay đổi URL trực tiếp từ Sidebar để tráo đổi chế độ hiển thị
  useEffect(() => {
    const currentType =
      searchParams.get("type") === "group" ? "GROUP" : "PRIVATE";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChatMode(currentType);
  }, [searchParams]);

  // Tự động cuộn xuống đáy khi nhận/gửi tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [privateMsgs, groupMsgs, chatMode]);

  // Luồng phát hành tin nhắn
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const currentTime = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: "TENANT",
      text: typedMessage.trim(),
      time: currentTime,
    };

    if (chatMode === "PRIVATE") {
      setPrivateMsgs([...privateMsgs, newMsg]);
    } else {
      setGroupMsgs([...groupMsgs, newMsg]);
    }
    setTypedMessage("");
  };

  const currentMessages = chatMode === "PRIVATE" ? privateMsgs : groupMsgs;

  return (
    <div className="max-w-4xl mx-auto md:p-4 bg-slate-50/10 h-[calc(100vh-3.5rem)] md:h-[620px] flex flex-col antialiased font-sans overflow-hidden select-none">
      {/* 📱 BỘ TABS DẸT CHO MOBILE: Cho phép búng tay chuyển đổi nhanh nếu không bấm trên sidebar */}
      <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/30 w-full h-10 items-center shrink-0 mb-2 select-none md:hidden">
        <button
          type="button"
          onClick={() => setChatMode("PRIVATE")}
          className={`flex-1 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${chatMode === "PRIVATE" ? "bg-white shadow-3xs text-slate-900" : "text-slate-500"}`}
        >
          Hỗ trợ BQL (1-1)
        </button>
        <button
          type="button"
          onClick={() => setChatMode("GROUP")}
          className={`flex-1 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${chatMode === "GROUP" ? "bg-white shadow-3xs text-slate-900" : "text-slate-500"}`}
        >
          Cộng đồng tòa nhà
        </button>
      </div>

      {/* 1. HEADER CHAT BOX BIẾN HÌNH THEO CHẾ ĐỘ ĐĂNG KÝ */}
      <div className="p-3.5 bg-white border border-slate-100 md:rounded-t-xl flex items-center justify-between select-none shrink-0 shadow-3xs">
        <div className="flex items-center gap-3">
          <div className="h-8.5 w-8.5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
            {chatMode === "PRIVATE" ? "BQL" : "👥"}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-slate-900 tracking-wide uppercase">
              {chatMode === "PRIVATE"
                ? "Hỗ trợ cư dân trực tuyến"
                : "Cộng đồng cư dân nội bộ"}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              {chatMode === "PRIVATE"
                ? "Văn phòng điều phối Danjin"
                : "Kênh chat chung toàn tòa nhà"}
            </span>
          </div>
        </div>

        {/* 🖥️ BỘ NÚT CHUYỂN TAB ĐẸP ĐẼ CHO DESKTOP */}
        <div className="hidden md:flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/40 items-center h-8 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setChatMode("PRIVATE")}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${chatMode === "PRIVATE" ? "bg-white shadow-3xs text-slate-900" : "text-slate-400"}`}
          >
            Hỗ trợ riêng 1-1
          </button>
          <button
            type="button"
            onClick={() => setChatMode("GROUP")}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${chatMode === "GROUP" ? "bg-white shadow-3xs text-slate-900" : "text-slate-400"}`}
          >
            Group tòa nhà
          </button>
        </div>

        <Badge
          variant="outline"
          className="md:hidden bg-slate-50 text-slate-500 border-slate-200/60 font-mono text-[9px] font-bold rounded px-1.5 shadow-none"
        >
          P.202 — LuxHouse
        </Badge>
      </div>

      {/* 2. KHUNG HIỂN THỊ TIN NHẮN TƯƠNG PHẢN CAO */}
      <div className="flex-1 bg-slate-50/50 border-x border-b border-slate-100/60 p-4 overflow-y-auto space-y-4 select-text scrollbar-none pb-28 md:pb-4">
        {chatMode === "GROUP" && (
          <div className="p-2.5 bg-amber-50/40 border border-amber-100/50 rounded-xl flex items-start gap-2 max-w-md mx-auto select-none text-[10px] text-slate-400 font-medium leading-relaxed shadow-3xs">
            <Info size={13} className="text-amber-500 shrink-0 mt-0.5" />
            Vui lòng ứng xử văn minh. Không spam quảng cáo, không chia sẻ liên
            kết bậy bạ làm loãng kênh thông báo của ban quản lý.
          </div>
        )}

        <div className="flex justify-center select-none pt-1">
          <span className="text-[9px] font-extrabold font-mono uppercase tracking-widest text-slate-400 bg-slate-100/60 border border-slate-200/30 px-2.5 py-0.5 rounded-full shadow-3xs">
            {chatMode === "PRIVATE"
              ? "Lịch sử bảo mật mã hóa bởi Danjin BMS"
              : "Kênh tương tác tòa Danjin Cầu Giấy"}
          </span>
        </div>

        {/* Luồng render dữ liệu */}
        {currentMessages.map((msg) => {
          const isMe = msg.sender === "TENANT";
          const isBQL = msg.sender === "ADMIN";

          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] gap-0.5 ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}
            >
              <span className="text-[9px] font-bold text-slate-400 font-mono px-1 select-none flex items-center gap-1">
                {isMe ? (
                  `Bạn • ${msg.time}`
                ) : isBQL ? (
                  <span className="text-indigo-600 font-extrabold">
                    🏢 Ban quản lý • {msg.time}
                  </span>
                ) : (
                  <span className="text-slate-600 font-bold">
                    {msg.senderName} (P.{msg.roomNo}) • {msg.time}
                  </span>
                )}
              </span>

              <div
                className={`p-3 rounded-xl text-xs font-semibold leading-relaxed shadow-3xs ${
                  isMe
                    ? "bg-slate-900 text-white rounded-tr-none"
                    : isBQL
                      ? "bg-indigo-50/40 text-indigo-900 border border-indigo-100/30 rounded-tl-none"
                      : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. THANH NHẬP LIỆU GẮN ĐÁY DÙNG CHUNG CHUẨN UX */}
      <div className="p-3 bg-white border-x border-b border-slate-100 md:rounded-b-xl shrink-0 select-none fixed bottom-0 left-0 w-full md:relative md:bottom-auto md:left-auto shadow-md md:shadow-none z-40">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="flex gap-1 shrink-0 text-slate-400">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8.5 w-8.5 rounded-lg text-slate-400 hover:bg-slate-50 cursor-pointer shadow-none"
            >
              <Paperclip size={14} />
            </Button>
          </div>

          <Input
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            placeholder={
              chatMode === "PRIVATE"
                ? "Phản hồi nhanh tới ban quản lý tòa nhà..."
                : "Nhắn tin giao lưu với cư dân trong tòa..."
            }
            className="h-9 text-xs bg-slate-50/50 border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-slate-900 text-slate-800 font-medium placeholder:font-normal"
          />

          <Button
            type="submit"
            disabled={!typedMessage.trim()}
            className="h-9 bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-3.5 cursor-pointer shrink-0 disabled:opacity-40 transition-all shadow-xs"
          >
            <Send size={13} />
          </Button>
        </form>
      </div>
    </div>
  );
}
