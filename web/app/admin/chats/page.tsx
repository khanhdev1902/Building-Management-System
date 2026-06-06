/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  MessageSquare,
  Send,
  Building,
  User,
  CheckCircle2,
  Paperclip,
  MoreVertical,
  Image as ImageIcon,
  Check,
  CheckCheck,
  Megaphone,
  Trash2,
  Pin,
  Smile,
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
import { toast } from "sonner";

// Mock Data danh sách hội thoại thực tế ở chung cư
const INITIAL_ROOMS = [
  {
    id: "CHANNEL-ALL",
    roomName: "Kênh Thông Báo Chung",
    lastMessage:
      "Ban quản lý: Vui lòng không để xe chắn lối thoát hiểm tầng hầm.",
    time: "Trưa nay",
    unreadCount: 0,
    category: "channel", // Kênh phát thanh toàn tòa
    residentName: "Hệ thống",
    status: "broadcast",
  },
  {
    id: "CHAT-P202",
    roomName: "P.202",
    lastMessage:
      "Dạ ban quản lý kiểm tra hộ em hóa đơn nước tăng bất thường với ạ!",
    time: "18:32",
    unreadCount: 2,
    category: "support", // Hỗ trợ cư dân 1-1
    residentName: "Trần Thế Anh",
    status: "pending", // Đang chờ xử lý
  },
  {
    id: "CHAT-P104",
    roomName: "P.104",
    lastMessage: "Đã chuyển khoản tiền cọc xe máy tháng này rồi nhé.",
    time: "15:45",
    unreadCount: 0,
    category: "support",
    residentName: "Nguyễn Văn Anh",
    status: "resolved", // Đã xử lý xong
  },
];

// Mock Data nội dung tin nhắn chi tiết của Phòng 202
const INITIAL_MESSAGES: Record<string, any[]> = {
  "CHAT-P202": [
    {
      id: "m1",
      sender: "resident",
      text: "Chào ban quản lý, cho em hỏi chút ạ.",
      time: "18:28",
      status: "read",
    },
    {
      id: "m2",
      sender: "resident",
      text: "Tháng này phòng em đi làm suốt mà sao hóa đơn nước lên tới 450.000đ lận?",
      time: "18:29",
      status: "read",
    },
    {
      id: "m3",
      sender: "admin",
      text: "Chào Thế Anh, dạ để bên kỹ thuật kiểm tra lại đồng hồ đo nước ở đầu tầng 2 của phòng mình liền nha.",
      time: "18:30",
      status: "read",
    },
    {
      id: "m4",
      sender: "resident",
      text: "Dạ ban quản lý kiểm tra hộ em hóa đơn nước tăng bất thường với ạ!",
      time: "18:32",
      status: "sent",
    },
  ],
  "CHAT-P104": [
    {
      id: "m5",
      sender: "resident",
      text: "Đã chuyển khoản tiền cọc xe máy tháng này rồi nhé.",
      time: "15:45",
      status: "read",
    },
  ],
  "CHANNEL-ALL": [
    {
      id: "m6",
      sender: "admin",
      text: "Thông báo bảo trì hệ thống PCCC định kỳ vào sáng Thứ 7 tuần này.",
      time: "Hôm qua",
      status: "read",
    },
    {
      id: "m7",
      sender: "admin",
      text: "Yêu cầu cư dân không để xe chắn lối thoát hiểm tầng hầm.",
      time: "Trưa nay",
      status: "read",
    },
  ],
};

export default function AdminChatDashboard() {
  const [activeRoomId, setActiveRoomId] = useState("CHAT-P202");
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [typedMessage, setTypedMessage] = useState("");
  const [tabFilter, setTabFilter] = useState("all"); // all | support | channel
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống đáy khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeRoomId, messages]);

  // Bộ lọc danh sách phòng chat
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch =
        room.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.residentName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = tabFilter === "all" || room.category === tabFilter;
      return matchesSearch && matchesTab;
    });
  }, [rooms, searchQuery, tabFilter]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  // Xử lý gửi tin nhắn
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const currentTime = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: "admin",
      text: typedMessage,
      time: currentTime,
      status: "sent",
    };

    // Cập nhật mảng tin nhắn
    setMessages({
      ...messages,
      [activeRoomId]: [...(messages[activeRoomId] || []), newMsg],
    });

    // Cập nhật nội dung tin nhắn cuối cùng ngoài danh sách phòng
    setRooms(
      rooms.map((room) =>
        room.id === activeRoomId
          ? {
              ...room,
              lastMessage: typedMessage,
              time: currentTime,
              unreadCount: 0,
            }
          : room,
      ),
    );

    setTypedMessage("");
  };

  // Đánh dấu đã xử lý Ticket xong
  const toggleResolveStatus = (id: string) => {
    setRooms(
      rooms.map((room) =>
        room.id === id
          ? {
              ...room,
              status: room.status === "resolved" ? "pending" : "resolved",
            }
          : room,
      ),
    );
    const currentRoom = rooms.find((r) => r.id === id);
    if (currentRoom?.status === "resolved") {
      toast.info(`Đã mở lại luồng xử lý hỗ trợ cho ${currentRoom.roomName}`);
    } else {
      toast.success(
        `✓ Đã đánh dấu giải quyết xong sự cố cho ${currentRoom?.roomName}`,
      );
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50/50 text-slate-900 font-sans antialiased overflow-hidden select-none">
      {/* ================= CỘT TRÁI (1/3): DANH SÁCH PHÒNG CHAT / KÊNH TUYẾN TRÊN ================= */}
      <div className="w-full md:w-90 lg:w-100 bg-white border-r border-slate-200/80 flex flex-col shadow-xs">
        {/* Header tìm kiếm & Tabs */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <MessageSquare className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Tổng đài Danjin Chat
              </h1>
            </div>
            <Badge className="bg-amber-50 text-amber-600 border border-amber-200/60 rounded-md text-[10px] font-bold px-1.5 py-0.5">
              2 Phòng đang đợi
            </Badge>
          </div>

          {/* Ô Tìm kiếm thần tốc */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              placeholder="Tìm số phòng, tên cư dân..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8.5 bg-slate-50 border-slate-200 text-xs h-9 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/10 focus-visible:border-blue-500 transition-all"
            />
          </div>

          {/* Bộ lọc phân loại luồng Chat */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold text-center">
            <button
              onClick={() => setTabFilter("all")}
              className={`py-1.5 rounded-md transition-all cursor-pointer ${tabFilter === "all" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-400 hover:text-slate-600"}`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setTabFilter("support")}
              className={`py-1.5 rounded-md transition-all cursor-pointer ${tabFilter === "support" ? "bg-white text-blue-600 shadow-3xs" : "text-slate-400 hover:text-slate-600"}`}
            >
              Hỗ trợ (1-1)
            </button>
            <button
              onClick={() => setTabFilter("channel")}
              className={`py-1.5 rounded-md transition-all cursor-pointer ${tabFilter === "channel" ? "bg-white text-indigo-600 shadow-3xs" : "text-slate-400 hover:text-slate-600"}`}
            >
              Phát thanh
            </button>
          </div>
        </div>

        {/* Danh sách phòng cuộn */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-slate-50">
            {filteredRooms.map((room) => {
              const isSelected = activeRoomId === room.id;
              return (
                <div
                  key={room.id}
                  onClick={() => {
                    setActiveRoomId(room.id);
                    // Giả lập xóa unread count khi click vào
                    room.unreadCount = 0;
                  }}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all border-l-4 ${
                    isSelected
                      ? "bg-blue-50/40 border-blue-600 shadow-3xs"
                      : "bg-white border-transparent hover:bg-slate-50/80"
                  }`}
                >
                  {/* Icon đại diện theo danh mục */}
                  <div
                    className={`p-2.5 rounded-xl border shrink-0 ${
                      room.category === "channel"
                        ? "bg-indigo-50 border-indigo-100 text-indigo-600"
                        : room.status === "resolved"
                          ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                          : "bg-slate-50 border-slate-100 text-slate-600"
                    }`}
                  >
                    {room.category === "channel" ? (
                      <Megaphone className="w-4 h-4" />
                    ) : (
                      <Building className="w-4 h-4" />
                    )}
                  </div>

                  {/* Body text tóm tắt */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold truncate ${isSelected ? "text-blue-700" : "text-slate-800"}`}
                      >
                        {room.roomName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium font-mono">
                        {room.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                      <User className="w-3 h-3 shrink-0" />
                      <span className="truncate">{room.residentName}</span>
                    </div>

                    <p
                      className={`text-[11px] truncate leading-relaxed ${room.unreadCount > 0 ? "text-slate-900 font-bold" : "text-slate-400 font-medium"}`}
                    >
                      {room.lastMessage}
                    </p>
                  </div>

                  {/* Badge số tin chưa đọc hoặc chấm trạng thái */}
                  {room.unreadCount > 0 && (
                    <span className="bg-blue-600 text-white rounded-full text-[9px] font-black h-4 min-w-4 px-1 flex items-center justify-center animate-pulse shadow-xs">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* ================= CỘT PHẢI (2/3): KHUNG KHÔNG GIAN KHUNG CHAT CHI TIẾT ================= */}
      <div className="flex-1 flex flex-col bg-white">
        {activeRoom ? (
          <>
            {/* 1. Top Bar của Khung Chat */}
            <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white shadow-3xs z-10">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    {activeRoom.roomName}
                    {activeRoom.status === "resolved" && (
                      <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px] px-1.5 h-4.5 rounded">
                        Đã xử lý xong
                      </Badge>
                    )}
                  </h2>
                  <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${activeRoom.category === "channel" ? "bg-indigo-500" : "bg-emerald-500"}`}
                    />
                    Đại diện căn hộ:{" "}
                    <strong className="text-slate-600 font-semibold">
                      {activeRoom.residentName}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Nhóm nút Hành động Nghiệp vụ (Ticket Handling) */}
              <div className="flex items-center gap-1.5">
                {activeRoom.category === "support" && (
                  <Button
                    variant="outline"
                    onClick={() => toggleResolveStatus(activeRoom.id)}
                    className={`h-8 text-[11px] font-bold rounded-lg px-3 transition-colors ${
                      activeRoom.status === "resolved"
                        ? "bg-slate-50 border-slate-200 text-slate-500"
                        : "border-emerald-200 text-emerald-600 hover:bg-emerald-50/50"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    {activeRoom.status === "resolved"
                      ? "Mở lại Ticket"
                      : "Đóng Ticket (Xong)"}
                  </Button>
                )}

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
                    className="w-40 rounded-xl border-slate-200 text-xs font-medium"
                  >
                    <DropdownMenuItem className="text-xs py-2 cursor-pointer gap-2">
                      <Pin className="w-3.5 h-3.5 text-slate-400" /> Ghim hội
                      thoại
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs py-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 gap-2">
                      <Trash2 className="w-3.5 h-3.5" /> Xóa lịch sử
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* 2. Bong Bóng Tin Nhắn Khu Vực Cuộn (Chat Box Body) */}
            <ScrollArea className="flex-1 bg-slate-50/40 px-6 py-4">
              <div className="space-y-4 max-w-4xl mx-auto">
                <div className="text-center select-none py-2">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase bg-slate-100 border border-slate-200/40 px-2 py-0.5 rounded-md">
                    Lịch sử bảo mật mã hóa bởi Danjin BMS
                  </span>
                </div>

                {(messages[activeRoomId] || []).map((msg: any) => {
                  const isAdmin = msg.sender === "admin";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-1.5 max-w-[80%] group">
                        {/* Khối bong bóng text */}
                        <div
                          className={`p-3 rounded-2xl text-[12.5px] leading-relaxed shadow-3xs ${
                            isAdmin
                              ? "bg-slate-900 text-white rounded-br-none font-medium"
                              : "bg-white border border-slate-200/70 text-slate-800 rounded-bl-none font-semibold"
                          }`}
                        >
                          <p>{msg.text}</p>

                          {/* Thanh điều hướng chân bóng chat */}
                          <div
                            className={`flex items-center gap-1 mt-1 justify-end text-[9px] font-medium font-mono ${isAdmin ? "text-slate-400" : "text-slate-400"}`}
                          >
                            <span>{msg.time}</span>
                            {isAdmin &&
                              (msg.status === "read" ? (
                                <CheckCheck className="w-3 h-3 text-blue-400" />
                              ) : (
                                <Check className="w-3 h-3" />
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* 3. Khay Nhập Liệu Chân Đáy (Message Input Bar) */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form
                onSubmit={handleSendMessage}
                className="max-w-4xl mx-auto flex items-center gap-2 relative"
              >
                {/* Nút đính kèm File chứng từ nhanh */}
                <div className="flex items-center gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                </div>

                {/* Ô Input gõ văn bản */}
                <div className="flex-1 relative">
                  <Input
                    placeholder={
                      activeRoom.category === "channel"
                        ? "Bạn đang gõ với tư cách Phát thanh viên toàn tòa..."
                        : `Phản hồi nhanh phòng ${activeRoom.residentName}...`
                    }
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    className="h-9.5 rounded-xl bg-slate-50 border-slate-200/80 text-xs pr-10 font-semibold focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/10 focus-visible:border-blue-500 transition-all"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:text-slate-600 rounded-lg absolute right-1.5 top-1/2 -translate-y-1/2"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>

                {/* Nút Gửi lệnh hỏa tốc */}
                <Button
                  type="submit"
                  size="sm"
                  disabled={!typedMessage.trim()}
                  className="h-9.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs rounded-xl gap-1.5 shadow-sm cursor-pointer transition-all active:scale-[0.98]"
                >
                  <span>Gửi đi</span>
                  <Send className="w-3.5 h-3.5 stroke-[2.2]" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          /* Trường hợp chưa chọn hội thoại */
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50/30">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-inner mb-3">
              <MessageSquare size={28} className="text-slate-200" />
            </div>
            <p className="text-xs font-bold text-slate-400">
              Không có hội thoại nào được chọn
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
