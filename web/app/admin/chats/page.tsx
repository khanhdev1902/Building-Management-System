"use client";

import React, { useState } from "react";
import {
  Send,
  Paperclip,
  MoreVertical,
  Search,
  User,
  Phone,
  Video,
  Info,
  CheckCheck,
  Smile,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";

const MESSAGES = [
  {
    id: 1,
    sender: "BQL",
    text: "Chào anh Khánh, vòi sen phòng 101 đã được sửa xong rồi nhé ạ!",
    time: "09:00",
    isMe: false,
  },
  {
    id: 2,
    sender: "Me",
    text: "Cảm ơn team kỹ thuật nhé. Nhanh quá!",
    time: "09:05",
    isMe: true,
  },
  {
    id: 3,
    sender: "BQL",
    text: "Dạ không có gì ạ. Nếu có vấn đề gì anh cứ nhắn tin trên App nhé.",
    time: "09:06",
    isMe: false,
  },
  {
    id: 4,
    sender: "Me",
    text: "Ok mình đã nhận được thông báo rồi.",
    time: "09:10",
    isMe: true,
  },
];

export default function ResidentChat() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="flex h-[calc(100vh-2rem)] w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm m-4">
      {/* 1. Sidebar bên trái - Danh sách hội thoại */}
      <div className="w-[320px] border-r border-slate-100 hidden lg:flex flex-col bg-slate-50/20">
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              Hỗ trợ cư dân
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8"
            >
              <MoreVertical size={16} />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Tìm tin nhắn..."
              className="pl-9 h-9 bg-slate-100/50 border-none text-xs"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-3 space-y-1">
            <div className="p-3 bg-white border border-slate-100 rounded-xl flex gap-3 cursor-pointer shadow-sm">
              <Avatar className="h-10 w-10 border border-slate-100">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>BQL</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-bold text-slate-800">
                    Ban Quản Lý
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    09:06
                  </span>
                </div>
                <p className="text-[12px] text-slate-500 truncate mt-0.5">
                  Dạ không có gì ạ. Nếu có...
                </p>
              </div>
            </div>
            {/* Thêm các item khác ở đây */}
          </div>
        </ScrollArea>
      </div>

      {/* 2. Chat Window - Khu vực chính */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header Chat */}
        <div className="h-16 px-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-slate-200">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>BQL</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">
                  Ban Quản Lý
                </h3>
                <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] px-1.5 py-0">
                  Online
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none mt-1">
                Hỗ trợ kỹ thuật & Tiện ích
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-slate-400 hover:text-blue-600"
            >
              <Phone size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-slate-400 hover:text-blue-600"
            >
              <Video size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-slate-400 hover:text-blue-600 lg:hidden"
            >
              <Info size={18} />
            </Button>
          </div>
        </div>

        {/* Nội dung tin nhắn */}
        <ScrollArea className="flex-1 p-6 bg-slate-50/10">
          <div className="space-y-6">
            <div className="flex justify-center">
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-widest">
                Hôm nay
              </span>
            </div>

            {MESSAGES.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isMe ? "justify-end" : "justify-start"} items-end gap-2`}
              >
                {!msg.isMe && (
                  <Avatar className="h-7 w-7 border border-slate-200 mb-1">
                    <AvatarFallback className="text-[10px]">BQL</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col space-y-1 max-w-[70%]">
                  <div
                    className={`px-4 py-2.5 text-sm shadow-sm transition-all ${
                      msg.isMe
                        ? "bg-slate-900 text-white rounded-2xl rounded-br-none"
                        : "bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div
                    className={`flex items-center gap-1 ${msg.isMe ? "justify-end" : "justify-start"}`}
                  >
                    <span className="text-[10px] text-slate-400 font-medium">
                      {msg.time}
                    </span>
                    {msg.isMe && (
                      <CheckCheck size={12} className="text-blue-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area - Tối ưu UX */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex items-end gap-2 max-w-5xl mx-auto bg-slate-50 rounded-2xl p-2 border border-slate-100 focus-within:border-slate-300 transition-all">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-slate-400 hover:text-blue-600 rounded-xl"
              >
                <Paperclip size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-slate-400 hover:text-blue-600 rounded-xl hidden sm:flex"
              >
                <ImageIcon size={18} />
              </Button>
            </div>

            <textarea
              rows={1}
              placeholder="Nhập tin nhắn hỗ trợ..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2 resize-none max-h-32 min-h-[40px] placeholder:text-slate-400"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />

            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-slate-400 hover:text-amber-500 rounded-xl hidden sm:flex"
              >
                <Smile size={18} />
              </Button>
              <Button
                size="icon"
                className={`h-9 w-9 rounded-xl transition-all shadow-md ${
                  inputValue.trim()
                    ? "bg-slate-900 hover:bg-black scale-100"
                    : "bg-slate-200 text-slate-400 scale-90"
                }`}
                disabled={!inputValue.trim()}
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2 font-medium italic">
            Mọi thông tin chat đều được bảo mật bởi hệ thống quản lý LuxHouse
          </p>
        </div>
      </div>

      {/* 3. Right Sidebar - Thông tin chi tiết (Chỉ hiện trên màn hình lớn) */}
      <div className="w-[300px] border-l border-slate-100 hidden xl:flex flex-col bg-white">
        <div className="p-8 flex flex-col items-center text-center space-y-4">
          <Avatar className="h-20 w-20 border-2 border-slate-50 shadow-sm">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>BQL</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Ban Quản Lý Tòa Nhà
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Phản hồi thường trong 5-10 phút
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full pt-4">
            <Button
              variant="outline"
              className="text-xs h-9 rounded-xl border-slate-200"
            >
              Hồ sơ
            </Button>
            <Button
              variant="outline"
              className="text-xs h-9 rounded-xl border-slate-200 text-red-500"
            >
              Báo cáo
            </Button>
          </div>
        </div>
        <div className="px-6 space-y-6">
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Tiện ích nhanh
            </h4>
            <div className="space-y-1">
              {[
                "Xem hợp đồng",
                "Thanh toán hóa đơn",
                "Gửi phản ánh kỹ thuật",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-all"
                >
                  <span className="text-xs font-semibold text-slate-600">
                    {item}
                  </span>
                  <Info size={14} className="text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
