"use client";

import React, { useState, useRef } from "react";
import {
  Phone,
  Mail,
  FileText,
  Download,
  Camera,
  Loader2,
  Copy,
  Calendar,
  User,
  MapPin,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

export function TenantSidebar() {
  const [avatarUrl, setAvatarUrl] = useState("https://github.com/shadcn.png");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hàm click giả lập upload ảnh đại diện cư dân
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarUrl(URL.createObjectURL(file));
    setIsUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsUploading(false);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.02)] overflow-hidden divide-y divide-slate-100 font-sans select-none animate-in fade-in duration-300">
      {/* KHỐI 1: AVATAR & ĐỊNH DANH HÌNH ẢNH */}
      <div className="p-5 flex flex-col items-center text-center">
        <div className="relative w-22 h-22 mb-4 group">
          <div
            className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-100 shadow-3xs cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Avatar className="w-full h-full rounded-none">
              <AvatarImage src={avatarUrl} className="object-cover" />
              <AvatarFallback className="text-xs font-bold bg-slate-50 text-slate-400">
                TA
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
              {isUploading ? (
                <Loader2 className="text-white w-4 h-4 animate-spin" />
              ) : (
                <Camera className="text-white w-4 h-4" />
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div
            className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full shadow-md border-2 border-white z-10"
            title="Đã đối chiếu căn cước gốc"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
          CƯ DÂN CHÍNH THỨC
        </span>
      </div>

      {/* KHỐI 2: THÔNG TIN LIÊN HỆ PHẲNG DẸT */}
      <div className="p-4 space-y-3">
        <SidebarInfoItem
          icon={<Phone size={13} />}
          label="Số điện thoại"
          value="0912 333 444"
        />
        <SidebarInfoItem
          icon={<Mail size={13} />}
          label="Hòm thư điện tử"
          value="anhnv@gmail.com"
        />
      </div>

      {/* KHỐI 3: HỒ SƠ NHÂN TRẮC HỌC PHÁP LÝ (MỚI BỔ SUNG ĐẦY ĐỦ) */}
      <div className="p-4 space-y-3 bg-slate-50/30">
        <SidebarInfoItem
          icon={<FileText size={13} />}
          label="Số CCCD / Hộ chiếu"
          value="037196001234"
          isMono
        />
        <SidebarInfoItem
          icon={<Calendar size={13} />}
          label="Ngày tháng năm sinh"
          value="24/08/1996"
          isMono
        />
        <SidebarInfoItem
          icon={<User size={13} />}
          label="Giới tính sinh học"
          value="Nam"
        />
        <SidebarInfoItem
          icon={<MapPin size={13} />}
          label="Nguyên quán / Quê quán"
          value="Xuân Trường, Nam Định"
        />

        <div className="flex items-center gap-1.5 pt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50/50 border border-emerald-100/50 p-2 rounded-lg">
          <CheckCircle2 size={12} className="shrink-0" />
          <span>Đã khai báo tạm trú trực tuyến</span>
        </div>
      </div>

      {/* KHỐI 4: TÀI LIỆU ĐÍNH KÈM (Đã tích hợp chung khay) */}
      <div className="p-4 space-y-2.5">
        <div className="flex items-center justify-between select-none">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Hồ sơ chứng từ liên quan
          </h4>
          <Badge className="bg-slate-100 text-slate-500 border-none text-[9px] font-bold rounded-md px-1.5 h-4">
            2 files
          </Badge>
        </div>
        <div className="space-y-1.5">
          {["HopDongThue_P101.pdf", "CCCD_MatTruoc.jpg"].map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 border border-slate-100 rounded-lg bg-slate-50/30 group hover:border-slate-200 hover:bg-white transition-colors text-xs"
            >
              <span className="font-semibold text-slate-600 truncate max-w-[150px]">
                {file}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-400 hover:text-slate-800 rounded-md"
              >
                <Download size={13} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT TRỢ LÝ HIỂN THỊ TINH XẢO ---
function SidebarInfoItem({
  icon,
  label,
  value,
  isMono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isMono?: boolean;
}) {
  return (
    <div className="group space-y-0.5">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
        {label}
      </span>
      <div className="flex items-center justify-between h-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 min-w-0">
          <span className="text-slate-400 group-hover:text-slate-900 transition-colors shrink-0">
            {icon}
          </span>
          <span
            className={`truncate ${isMono ? "font-mono font-bold text-slate-800" : "font-sans"}`}
          >
            {value}
          </span>
        </div>

        {/* Nút bấm ẩn hiện mượt mà chỉ khi hover vào dòng */}
        <button
          className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-slate-600 transition-all cursor-pointer rounded hover:bg-slate-100"
          onClick={() => navigator.clipboard.writeText(value)}
          title={`Sao chép ${label}`}
        >
          <Copy size={11} />
        </button>
      </div>
    </div>
  );
}
