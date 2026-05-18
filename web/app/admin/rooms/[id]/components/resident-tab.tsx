"use client";

import React, { useState } from "react";
import {
  User,
  Phone,
  FileText,
  ShieldAlert,
  UserMinus,
  UserPlus,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Info,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";

interface ResidentTabProps {
  tenant: {
    representative: {
      name: string;
      phone: string;
      email: string;
      cccd: string;
      startDate: string;
    };
    members: Array<{
      id: number;
      name: string;
      role: string;
    }>;
  };
}

export function ResidentTab({ tenant }: ResidentTabProps) {
  // Gom toàn bộ nhân khẩu trong phòng về một mảng danh sách để duyệt loop thực tế
  const [residents] = useState([
    {
      id: "MAIN-01",
      name: tenant.representative.name,
      phone: tenant.representative.phone,
      email: tenant.representative.email,
      cccd: tenant.representative.cccd,
      birthday: "24/08/1996",
      gender: "Nam",
      hometown: "Xuân Trường, Nam Định",
      isRepresentative: true,
      policeStatus: "verified", // Đã nộp công an phường
      hasCccdImages: true,
    },
    ...tenant.members.map((m) => ({
      id: `SUB-${m.id}`,
      name: m.name,
      phone: m.id === 1 ? "0982.111.222" : "0345.999.888", // Mockup số phone riêng cho roommates
      email: m.id === 1 ? "theanh@gmail.com" : "minhnhat@gmail.com",
      cccd: m.id === 1 ? "037196005678" : "Chưa cập nhật",
      birthday: m.id === 1 ? "14/05/1998" : "22/11/2004",
      gender: m.id === 1 ? "Nam" : "Nam",
      hometown: m.id === 1 ? "Lục Ngạn, Bắc Giang" : "Kim Động, Hưng Yên",
      isRepresentative: false,
      policeStatus: m.id === 1 ? "pending" : "unregistered", // pending: chờ duyệt, unregistered: chưa khai báo
      hasCccdImages: m.id === 1 ? true : false,
    })),
  ]);

  return (
    <div className="p-5 space-y-5 font-sans animate-in fade-in duration-300">
      {/* 1. THANH ĐIỀU ĐỘNG TÁC VỤ ĐẦU TAB */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 select-none">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <User size={14} className="text-slate-400" /> Quản lý danh sách nhân
            khẩu cư trú
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">
            Kiểm soát hồ sơ định danh cá nhân, chứng từ ảnh CCCD và trạng thái
            khai báo cư trú pháp lý.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-[10px] font-semibold border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md shrink-0"
        >
          <UserPlus size={12} className="mr-1 stroke-[2.5]" /> Thêm nhân khẩu
          mới
        </Button>
      </div>

      {/* 2. LƯỚI THẺ MATRIX GRID CƯ DÂN ĐẬM ĐẶC SỐ LIỆU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {residents.map((res) => (
          <div
            key={res.id}
            className="border border-slate-200/80 rounded-xl p-4 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            {/* Thanh tiêu đề thẻ: Tên + Badge Vai trò */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-50 pb-2.5">
              <div className="space-y-0.5 min-w-0">
                <span className="font-bold text-slate-900 text-sm block truncate">
                  {res.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 tracking-wide block">
                  Mã định danh: {res.id}
                </span>
              </div>
              <Badge
                variant="outline"
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 select-none ${
                  res.isRepresentative
                    ? "bg-indigo-50 border-indigo-100 text-indigo-700"
                    : "bg-slate-50 border-slate-200 text-slate-500"
                }`}
              >
                {res.isRepresentative
                  ? "Đại diện ký Hợp đồng"
                  : "Thành viên lưu trú cùng"}
              </Badge>
            </div>

            {/* Khay lưới bóc tách hồ sơ nhân trắc học */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[11px] font-medium text-slate-600">
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                  Số điện thoại khẩn cấp
                </span>
                <span className="font-mono text-slate-800 font-bold flex items-center gap-1">
                  <Phone size={11} className="text-slate-400" /> {res.phone}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                  Số định danh CCCD
                </span>
                <span className="font-mono text-slate-700 font-semibold flex items-center gap-1">
                  <FileText size={11} className="text-slate-400" /> {res.cccd}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                  Giới tính / Ngày sinh
                </span>
                <span className="text-slate-700 font-sans">
                  {res.gender} •{" "}
                  <span className="font-mono">{res.birthday}</span>
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                  Nguyên quán đăng ký gốc
                </span>
                <span
                  className="text-slate-700 truncate block"
                  title={res.hometown}
                >
                  {res.hometown}
                </span>
              </div>
            </div>

            {/* Dải chứng từ số hóa ảnh căn cước */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-50/50 border border-slate-100 p-2 rounded-lg text-[11px] select-none">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mr-1">
                Hồ sơ cứng:
              </span>
              {res.hasCccdImages ? (
                <button className="inline-flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-semibold transition-colors cursor-pointer">
                  <Eye size={12} className="text-slate-400" /> Xem 2 mặt ảnh
                  chụp CCCD
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-[10px]">
                  <ShieldAlert size={12} /> Khuyết thiếu tệp tin CCCD gốc
                </span>
              )}
            </div>

            <Separator className="bg-slate-50 my-0.5" />

            {/* Thanh đáy thẻ: Quản lý luồng Công an phường & Nút xóa cấu trúc */}
            <div className="flex items-center justify-between gap-4 select-none pt-0.5">
              {/* Phân tách trạng thái Công an Phường */}
              {res.policeStatus === "verified" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">
                  <CheckCircle2 size={11} /> Đã phê duyệt tạm trú
                </span>
              )}
              {res.policeStatus === "pending" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100/50 animate-pulse">
                  <Clock size={11} /> Tờ khai chờ CAP đối soát
                </span>
              )}
              {res.policeStatus === "unregistered" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100/50">
                  <AlertCircle size={11} /> Chưa khai báo tạm trú
                </span>
              )}

              {/* Nút đuổi/Xóa nhân khẩu ra khỏi phòng nếu chủ hộ báo roommate dời đi */}
              {!res.isRepresentative && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-[10px] font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50/40 rounded-md transition-all gap-1 font-mono"
                >
                  <UserMinus size={11} /> Xóa cư trú
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 3. KHỐI THÔNG BÁO QUY TRÌNH HÀNH CHÍNH NỀN */}
      <div className="flex items-start gap-1.5 text-[10px] text-slate-400 font-medium leading-normal bg-slate-50/60 p-2.5 rounded-lg border border-dashed border-slate-200 select-none">
        <Info size={12} className="text-slate-400 mt-0.5 shrink-0" />
        <span>
          Hệ thống Danjin BMS tự động đồng bộ danh sách cư dân sang phân hệ bãi
          xe hầm và cổng kiểm soát IoT ra vào. Việc xóa nhân khẩu khỏi phòng sẽ
          tự động vô hiệu hóa toàn bộ thẻ từ gửi xe và vân tay mở cửa tòa nhà
          của nhân khẩu đó ngay lập tức.
        </span>
      </div>
    </div>
  );
}
