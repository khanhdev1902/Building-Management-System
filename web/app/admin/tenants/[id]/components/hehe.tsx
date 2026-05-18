"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Phone,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Home,
  MapPin,
  Calendar,
  Bike,
  Fingerprint,
  MessageSquare,
  AlertTriangle,
  History,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileText,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import Link from "next/link";

// Mockup dữ liệu chi tiết tuyệt đối của một cư dân hệ thống Danjin BMS năm 2026
const MOCK_TENANT_DETAIL = {
  id: "TEN-1025",
  name: "Trần Thị Bảo",
  email: "baott@yahoo.com",
  phone: "0912 333 444",
  room: "102",
  tower: "Danjin Block A",
  joinDate: "2026-02-10",
  contractEnd: "2026-06-15",
  status: "expiring",
  avatar: "",
  identityVerified: false, // Hồ sơ chưa xác minh xong CCCD

  // Chi tiết lý lịch pháp lý
  legalInfo: {
    cccdNumber: "037196001234",
    dob: "1996-08-24",
    gender: "Nữ",
    hometown: "Xuân Trường, Nam Định",
    temporaryResidenceRegistered: true, // Đã khai báo tạm trú với CA phường
  },

  // Phương tiện đăng ký tại hầm
  vehicles: [
    {
      type: "Xe máy",
      brand: "Vespa Primavera",
      licensePlate: "18B1-888.88",
      cardId: "CARD-XE-0982",
    },
  ],

  // Khối mở rộng 1: Nhật ký quét vân tay/thẻ từ cửa ra vào tòa nhà (IoT Gateway)
  accessLogs: [
    {
      time: "2026-05-18 08:15",
      device: "Cửa chính hầm B1",
      method: "Vân tay",
      status: "success",
    },
    {
      time: "2026-05-17 19:40",
      device: "Cổng chính Tầng 1",
      method: "Thẻ từ",
      status: "success",
    },
    {
      time: "2026-05-17 12:05",
      device: "Cửa chính hầm B1",
      method: "Vân tay",
      status: "success",
    },
    {
      time: "2026-05-16 23:15",
      device: "Cổng chính Tầng 1",
      method: "Thẻ từ",
      status: "failed",
      notes: "Sai định dạng thẻ",
    },
  ],

  // Khối mở rộng 2: Lịch sử phản ánh sự cố/khiếu nại của cư dân này
  tickets: [
    {
      id: "TK-8821",
      title: "Nước sinh hoạt chảy yếu và có cặn vàng",
      date: "2026-05-02",
      severity: "medium",
      status: "resolved",
    },
    {
      id: "TK-8410",
      title: "Bóng đèn hành lang tầng 1 đối diện phòng bị nhấp nháy",
      date: "2026-04-12",
      severity: "low",
      status: "resolved",
    },
  ],
};

export default function TenantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [activeTab, setActiveTab] = useState<"identity" | "iot" | "tickets">(
    "identity",
  );
  const data = MOCK_TENANT_DETAIL;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-5 bg-slate-50/20 min-h-screen antialiased selection:bg-indigo-50">
      {/* 1. THANH TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 select-none">
        <div className="flex items-center gap-3">
          <Link href="/admin/tenants">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-500 border border-slate-200/60 bg-white hover:bg-slate-50"
            >
              <ArrowLeft size={14} className="stroke-[2]" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400">
              {data.id}
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-800">
              Lý lịch cư dân: {data.name}
            </span>
          </div>
        </div>

        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200/60 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"
        >
          <span className="h-1.2 w-1.2 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
          Sắp hết hạn hợp đồng
        </Badge>
      </div>

      {/* ASYMMETRIC SPLIT LAYOUT (4:8 HOẶC 3:9) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* CỘT TRÁI (4 PHẦN): PROFILE CARD CỐ ĐỊNH TỐI GIẢN */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900" />

            <Avatar className="h-16 w-16 border-2 border-slate-100 rounded-2xl shadow-sm mt-2">
              <AvatarImage src={data.avatar} />
              <AvatarFallback className="bg-slate-950 text-white text-sm font-bold rounded-2xl">
                {data.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <h2 className="text-sm font-bold text-slate-900 mt-3 flex items-center gap-1.5">
              {data.name}
            </h2>
            <p className="text-[10px] font-mono font-semibold text-slate-400 mt-0.5">
              {data.id}
            </p>

            <Separator className="my-4 bg-slate-100" />

            {/* Thông tin liên hệ nhanh phẳng dẹt */}
            <div className="w-full space-y-2.5 text-xs text-slate-600 font-medium text-left">
              <div className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg border border-slate-100">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Phone size={13} /> Số điện thoại
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {data.phone}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg border border-slate-100">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Mail size={13} /> Hòm thư
                </span>
                <span className="text-slate-700 truncate max-w-[180px]">
                  {data.email}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg border border-slate-100">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Home size={13} /> Vị trí phòng
                </span>
                <span className="font-mono font-bold text-slate-800">
                  P.{data.room}{" "}
                  <span className="font-sans font-normal text-[10px] text-slate-400">
                    (Block A)
                  </span>
                </span>
              </div>
            </div>

            <Separator className="my-4 bg-slate-100" />

            {/* Cụm tác vụ quản trị hồ sơ cư dân */}
            <div className="w-full space-y-1.5">
              <Button
                variant="outline"
                className="w-full h-8.5 text-xs font-semibold text-slate-700 border-slate-200 shadow-2xs gap-1.5 rounded-lg hover:bg-slate-50"
              >
                Phê duyệt xác minh hồ sơ
              </Button>
              <Button
                variant="ghost"
                className="w-full h-8.5 text-xs font-semibold text-rose-600 gap-1.5 border border-dashed border-rose-100 bg-rose-50/20 rounded-lg hover:bg-rose-50/60"
              >
                Kích hoạt quy trình rời đi
              </Button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}

        {/* CỘT PHẢI (8 PHẦN): WORKSPACE WORKFLOW CHIA TAB */}
        <div className="lg:col-span-8 space-y-4">
          {/* Thanh Tab dẹt lì cao 36px (h-9) */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/40 w-fit h-9 items-center select-none">
            <button
              onClick={() => setActiveTab("identity")}
              className={`h-7 px-4 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${activeTab === "identity" ? "bg-white shadow-2xs text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
            >
              <FileText size={13} className="stroke-[1.8]" /> Định danh & Xe máy
            </button>
            <button
              onClick={() => setActiveTab("iot")}
              className={`h-7 px-4 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${activeTab === "iot" ? "bg-white shadow-2xs text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
            >
              <Fingerprint size={13} className="stroke-[1.8]" /> Lịch sử Ra/Vào
              (IoT)
            </button>
            <button
              onClick={() => setActiveTab("tickets")}
              className={`h-7 px-4 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${activeTab === "tickets" ? "bg-white shadow-2xs text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
            >
              <MessageSquare size={13} className="stroke-[1.8]" /> Phản ánh sự
              cố
            </button>
          </div>

          {/* TAB 1: LÝ LỊCH PHÁP LÝ & QUẢN LÝ PHƯƠNG TIỆN */}
          {activeTab === "identity" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-200">
              {/* Khối định danh căn cước công dân */}
              <div className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    Thông tin căn cước công dân
                  </h3>
                  {!data.identityVerified && (
                    <span className="text-[10px] text-rose-600 font-bold bg-rose-50 border border-rose-100 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                      <ShieldAlert size={12} /> Hồ sơ thiếu ảnh CCCD gốc
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-5 text-xs font-sans">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-tight">
                      Số định danh cá nhân
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {data.legalInfo.cccdNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-tight">
                      Ngày tháng năm sinh
                    </span>
                    <span className="font-mono font-semibold text-slate-800">
                      {data.legalInfo.dob.split("-").reverse().join("/")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-tight">
                      Giới tính sinh học
                    </span>
                    <span className="font-semibold text-slate-800">
                      {data.legalInfo.gender}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-tight">
                      Hộ khẩu thường trú gốc
                    </span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-slate-400" />{" "}
                      {data.legalInfo.hometown}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-tight">
                      Khai báo Công an phường
                    </span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 size={12} /> Đã nộp tờ khai
                    </span>
                  </div>
                </div>
              </div>

              {/* Khối quản lý Thẻ xe máy dưới hầm */}
              <div className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
                  <Bike size={14} className="text-slate-400" /> Phương tiện &
                  Thẻ từ gửi xe đã cấp phát
                </h3>
                <Table>
                  <TableHeader className="bg-slate-50/50 border-b border-slate-100/60">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-3 py-2">
                        Loại xe
                      </TableHead>
                      <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2">
                        Tên dòng xe / Thương hiệu
                      </TableHead>
                      <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 font-mono">
                        Biển số kiểm soát
                      </TableHead>
                      <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 font-mono">
                        Mã vật lý Thẻ xe
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-100/60 text-xs">
                    {data.vehicles.map((v, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-slate-50/30 border-none"
                      >
                        <TableCell className="font-semibold text-slate-800 pl-3 py-3">
                          {v.type}
                        </TableCell>
                        <TableCell className="text-slate-600 font-medium py-3">
                          {v.brand}
                        </TableCell>
                        <TableCell className="py-3">
                          <span className="font-mono bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-bold border shadow-2xs">
                            {v.licensePlate}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono font-bold text-slate-500 py-3">
                          {v.cardId}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* TAB 2: LỊCH SỬ RA VÀO TOÀ NHÀ (IOT GATEWAY LOGS) */}
          {activeTab === "iot" && (
            <div className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-3 animate-in fade-in slide-in-from-bottom-1 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <History size={14} className="text-slate-400" /> Nhật ký quét
                  cổng Vân tay / Thẻ từ kiểm soát ra vào
                </h3>
                <span className="text-[10px] text-slate-400 font-medium font-mono flex items-center gap-1">
                  <Fingerprint size={12} /> Cập nhật thời gian thực
                </span>
              </div>
              <Table>
                <TableHeader className="bg-slate-50/50 border-b border-slate-100/60">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-3 py-2">
                      Mốc thời gian
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2">
                      Thiết bị kiểm soát
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2">
                      Phương thức xác thực
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-center py-2">
                      Kết quả quét
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100/60 text-xs font-mono">
                  {data.accessLogs.map((log, index) => (
                    <TableRow key={index} className="hover:bg-slate-50/30">
                      <TableCell className="text-slate-500 font-medium pl-3 py-3">
                        {log.time}
                      </TableCell>
                      <TableCell className="font-sans font-bold text-slate-800 py-3">
                        {log.device}
                      </TableCell>
                      <TableCell className="font-sans font-medium text-slate-600 py-3">
                        {log.method}
                      </TableCell>
                      <TableCell className="text-center py-3">
                        <Badge
                          variant="outline"
                          className={`rounded text-[10px] font-semibold font-sans px-2 py-0.5 shadow-none border cursor-default ${
                            log.status === "success"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-rose-50 text-rose-700 border-rose-100"
                          }`}
                        >
                          {log.status === "success"
                            ? "Hợp lệ (Mở cửa)"
                            : `Từ chối ${log.notes ? `(${log.notes})` : ""}`}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* TAB 3: LỊCH SỬ PHẢN ÁNH SỰ CỐ / TICKET CỦA PHÒNG */}
          {activeTab === "tickets" && (
            <div className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-3 animate-in fade-in slide-in-from-bottom-1 duration-200">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2.5">
                Danh sách phiếu phản ánh kỹ thuật & Góp ý vận hành
              </h3>
              <Table>
                <TableHeader className="bg-slate-50/50 border-b border-slate-100/60">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-3 py-2 w-[15%]">
                      Mã Ticket
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 w-[55%]">
                      Nội dung cư dân phản ánh
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 font-mono">
                      Ngày tiếp nhận
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-center py-2">
                      Trạng thái xử lý
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100/60 text-xs">
                  {data.tickets.map((ticket, index) => (
                    <TableRow key={index} className="hover:bg-slate-50/30">
                      <TableCell className="font-mono font-bold text-slate-400 pl-3 py-3">
                        {ticket.id}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-800 py-3">
                        {ticket.title}
                      </TableCell>
                      <TableCell className="font-mono text-slate-500 py-3">
                        {ticket.date.split("-").reverse().join("/")}
                      </TableCell>
                      <TableCell className="text-center py-3">
                        <Badge
                          variant="outline"
                          className="bg-slate-50 text-slate-600 border-slate-200/60 px-2 py-0.5 rounded text-[10px] font-medium cursor-default"
                        >
                          Đã khắc phục xong
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        {/* HẾT WORKSPACE GRID */}
      </div>
    </div>
  );
}
