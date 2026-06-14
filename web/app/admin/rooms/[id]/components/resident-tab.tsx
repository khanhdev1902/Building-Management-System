/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  FileText,
  UserMinus,
  UserPlus,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Info,
  UserX,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";

interface ResidentTabProps {
  tenant?: {
    representative?: {
      name?: string;
      phone?: string;
      email?: string;
      cccd?: string;
      startDate?: string;
      gender?: string;
      hometown?: string;
    };
    members?: Array<{
      id: number;
      name: string;
      role: string;
    }>;
  } | null;
}

export function ResidentTab({ tenant }: ResidentTabProps) {
  const [residents, setResidents] = useState<any[]>([]);

  // Lắng nghe và xử lý gộp mảng dữ liệu an toàn thông qua useEffect để tránh crash khi tenant thay đổi hoặc undefined
  useEffect(() => {
    // Nếu phòng trống hoàn toàn (ko có tenant hoặc ko có đại diện), set mảng rỗng
    if (!tenant || !tenant.representative) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResidents([]);
      return;
    }

    const rep = tenant.representative;
    const membersList = tenant.members ?? [];

    const compiledResidents = [
      {
        id: "MAIN-01",
        name: rep.name ?? "Chưa cập nhật tên",
        phone: rep.phone ?? "Chưa cập nhật",
        email: rep.email ?? "Chưa cập nhật",
        cccd: rep.cccd ?? "Chưa cập nhật",
        birthday: "24/08/1996",
        gender: rep.gender,
        hometown: rep.hometown,
        isRepresentative: true,
        policeStatus: "verified",
        hasCccdImages: true,
      },
      ...membersList.map((m) => ({
        id: `SUB-${m.id}`,
        name: m.name ?? "Thành viên chưa rõ tên",
        phone: m.id === 1 ? "0982.111.222" : "0345.999.888",
        email: m.id === 1 ? "theanh@gmail.com" : "minhnhat@gmail.com",
        cccd: m.id === 1 ? "037196005678" : "Chưa cập nhật",
        birthday: m.id === 1 ? "14/05/1998" : "22/11/2004",
        gender: "Nam",
        hometown: m.id === 1 ? "Lục Ngạn, Bắc Giang" : "Kim Động, Hưng Yên",
        isRepresentative: false,
        policeStatus: m.id === 1 ? "pending" : "unregistered",
        hasCccdImages: m.id === 1 ? true : false,
      })),
    ];

    setResidents(compiledResidents);
  }, [tenant]);

  const hasResidents = residents.length > 0;

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
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-[10px] font-semibold border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md shrink-0 cursor-pointer"
        >
          <UserPlus size={12} className="mr-1 stroke-[2.5]" /> Thêm nhân khẩu
          mới
        </Button>
      </div>

      {/* 2. ĐIỀU KIỆN RENDER: NẾU CÓ CƯ DÂN THÌ HIỂN THỊ MATRIX GRID, NẾU PHÒNG TRỐNG THÌ BẮN EMPTY STATE */}
      {hasResidents ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {residents.map((res) => (
            <div
              key={res.id}
              className="border border-slate-200/80 rounded-xl p-4 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              {/* Tiêu đề thẻ cư dân */}
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
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 select-none shadow-none ${
                    res.isRepresentative
                      ? "bg-indigo-50 border-indigo-100 text-indigo-700"
                      : "bg-slate-50 border-slate-200 text-slate-500"
                  }`}
                >
                  {res.isRepresentative
                    ? "Đại diện ký Hợp đồng"
                    : "Thành viên lưu trú"}
                </Badge>
              </div>

              {/* Thông tin nhân khẩu học */}
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

              {/* File ảnh đính kèm */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-50/50 border border-slate-100 p-2 rounded-lg text-[11px] select-none">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mr-1">
                  Hồ sơ cứng:
                </span>
                {res.hasCccdImages ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-semibold transition-colors cursor-pointer"
                  >
                    <Eye size={12} className="text-slate-400" /> Xem 2 mặt ảnh
                    chụp CCCD
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-[10px]">
                    <span className="text-[11px]">🚨</span> Khuyết thiếu tệp tin
                    CCCD gốc
                  </span>
                )}
              </div>

              <Separator className="bg-slate-50 my-0.5" />

              {/* Trạng thái công an phường */}
              <div className="flex items-center justify-between gap-4 select-none pt-0.5">
                {res.policeStatus === "verified" && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">
                    <CheckCircle2 size={11} className="stroke-[2.5]" /> Đã phê
                    duyệt tạm trú
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

                {!res.isRepresentative && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[10px] font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50/40 rounded-md transition-all gap-1 font-mono cursor-pointer"
                  >
                    <UserMinus size={11} /> Xóa cư trú
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* GIAO DIỆN EMPTY STATE LUXURY CHO PHÒNG TRỐNG */
        <div className="border border-dashed border-slate-200 rounded-xl p-10 text-center flex flex-col items-center justify-center bg-white shadow-3xs max-w-lg mx-auto select-none animate-in fade-in zoom-in-95 duration-200">
          <div className="h-10 w-10 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 mb-3 shadow-2xs">
            <UserX size={18} className="stroke-[1.8]" />
          </div>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">
            Hiện tại phòng trống
          </h4>
          <p className="text-[11px] text-slate-400 font-medium max-w-70 leading-relaxed pt-1">
            Căn hộ này chưa có thông tin hợp đồng cho thuê hoạt động hoặc chưa
            có nhân khẩu đăng ký cư trú.
          </p>
          <Button
            type="button"
            className="mt-4 h-8 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg px-4 uppercase tracking-wider shadow-xs cursor-pointer"
          >
            <UserPlus size={12} className="mr-1.5 stroke-[2.5]" /> Ghép cư dân
            vào phòng
          </Button>
        </div>
      )}

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
