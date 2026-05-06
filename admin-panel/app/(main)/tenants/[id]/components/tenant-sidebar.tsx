"use client";

import React, { useState, useRef } from "react";
import {
  Phone,
  Mail,
  FileText,
  Plus,
  ShieldCheck,
  Download,
  Copy,
  ExternalLink,
  Camera,
  Loader2,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

// --- Sub-components ---

function SidebarInfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="group space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-[13px] font-semibold text-slate-700">
          <span className="text-slate-400 group-hover:text-indigo-600 transition-colors">
            {icon}
          </span>
          {value}
        </div>
        <button
          className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-slate-600 transition-all"
          onClick={() => navigator.clipboard.writeText(value)}
        >
          <Copy size={12} />
        </button>
      </div>
    </div>
  );
}

function FileCard({ name, size }: { name: string; size: string }) {
  return (
    <div className="flex items-center justify-between p-2 border border-slate-100 rounded bg-white hover:border-slate-300 hover:bg-slate-50 transition-all group">
      <div className="flex items-center gap-2.5 overflow-hidden">
        <div className="p-1.5 bg-slate-50 group-hover:bg-white rounded border border-slate-100">
          <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
        </div>
        <span className="text-[12px] font-bold text-slate-600 truncate tracking-tight">
          {name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase">
          {size}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-slate-400 hover:text-slate-900"
        >
          <Download size={14} />
        </Button>
      </div>
    </div>
  );
}

// --- Main Component ---

export function TenantSidebar() {
  const [avatarUrl, setAvatarUrl] = useState("https://github.com/shadcn.png");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 1. Tạo preview cục bộ ngay lập tức để UX mượt
    const localUrl = URL.createObjectURL(file);
    setAvatarUrl(localUrl);

    // 2. Giả lập quá trình upload lên Server
    setIsUploading(true);

    try {
      // Giả sử gọi API upload ở đây
      // const formData = new FormData();
      // formData.append('file', file);
      // await uploadApi(formData);

      await new Promise((resolve) => setTimeout(resolve, 1500)); // Giả lập delay 1.5s
      console.log("Upload thành công file:", file.name);
    } catch (error) {
      console.error("Lỗi upload:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="lg:col-span-3 space-y-5 font-sans">
      {/* Profile Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-6 text-center md:text-left">
          {/* Avatar Section with Hover Edit */}
          <div className="relative mx-auto md:mx-auto w-28 h-28 mb-6 group">
            <div
              className="relative w-full h-full rounded-full overflow-hidden border border-slate-100 shadow-sm cursor-pointer"
              onClick={handleAvatarClick}
            >
              <Avatar className="w-full h-full rounded-none">
                <AvatarImage src={avatarUrl} className="object-cover" />
                <AvatarFallback className="text-xl font-bold bg-slate-50 text-slate-400">
                  TA
                </AvatarFallback>
              </Avatar>

              {/* Overlay Overlay */}
              <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                {isUploading ? (
                  <Loader2 className="text-white w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Camera className="text-white w-6 h-6 mb-1" />
                    <span className="text-[10px] text-white font-bold uppercase tracking-tight">
                      Thay ảnh
                    </span>
                  </>
                )}
              </div>

              {/* Input ẩn */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Trạng thái xác thực */}
            <div className="absolute -bottom-2 right-0 bg-green-800 text-white p-1.5 rounded-full shadow-lg border-2 border-white z-10">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <SidebarInfoItem
              icon={<Phone size={14} strokeWidth={2.5} />}
              label="Số điện thoại"
              value="0987 654 321"
            />
            <SidebarInfoItem
              icon={<Mail size={14} strokeWidth={2.5} />}
              label="Email cá nhân"
              value="anhnv@gmail.com"
            />
            <SidebarInfoItem
              icon={<FileText size={14} strokeWidth={2.5} />}
              label="CCCD/Passport"
              value="001092003xxx"
            />
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-center">
          <Button
            variant="link"
            className="text-[11px] font-bold text-indigo-600 h-auto p-0 uppercase tracking-tighter hover:no-underline"
          >
            Xem chi tiết lịch sử cư trú{" "}
            <ExternalLink size={10} className="ml-1" />
          </Button>
        </div>
      </div>

      {/* Documents Card */}
      <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
            Hồ sơ pháp lý
          </h3>
          <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none text-[9px] font-bold">
            2 FILES
          </Badge>
        </div>

        <div className="space-y-2">
          <FileCard name="HopDongThue_P101.pdf" size="2.4 MB" />
          <FileCard name="CCCD_MatTruoc.jpg" size="1.1 MB" />

          <Button
            variant="outline"
            className="w-full h-9 justify-center text-[11px] font-black uppercase tracking-tighter border-dashed border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 mt-2 bg-slate-50/30 transition-all"
          >
            <Plus className="w-3 h-3 mr-2" /> Tải lên tài liệu
          </Button>
        </div>
      </div>
    </div>
  );
}
