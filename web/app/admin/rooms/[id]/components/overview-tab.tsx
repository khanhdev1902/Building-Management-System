/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  LayoutGrid,
  Users,
  Info,
  ArrowUpRight,
  FileClock,
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { TabsContent } from "@/shared/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { StatCard } from "./ui-custom/StatCard";

export const OverviewTab = ({ room }: { room: any }) => {
  return (
    <TabsContent
      value="overview"
      className="space-y-5 mt-4 outline-none animate-in fade-in duration-350"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* --- CỘT TRÁI (8/12 phần): KHÔNG GIAN VẬN HÀNH LÕI --- */}
        <div className="lg:col-span-8 space-y-5">
          {/* 1. Ba thẻ chỉ số tài chính phẳng dẹt */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 select-none">
            <StatCard
              label="Giá thuê hợp đồng"
              value={`${room.price.toLocaleString("vi-VN")} đ`}
              subValue="Chu kỳ: 01 tháng/lần"
              className="rounded-xl border-slate-200/80 shadow-none bg-white"
            />
            <StatCard
              label="Quỹ tiền cọc giữ hộ"
              value={`${room.deposit.toLocaleString("vi-VN")} đ`}
              subValue="Ủy nhiệm chi: Danjin"
              highlight
              className="rounded-xl shadow-none"
            />
            <StatCard
              label="Thời hạn chu kỳ thuê"
              value="Còn 10 tháng"
              subValue={`Đáo hạn: ${room.contract.expiryDate}`}
              className="rounded-xl border-slate-200/80 shadow-none bg-white"
            />
          </div>

          {/* 2. BẢNG NHÂN KHẨU THỰC TẾ ĐANG LƯU TRÚ (Nâng cấp sát thực tế) */}
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.01)] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 select-none">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Users size={14} className="text-slate-400" /> Danh sách nhân
                khẩu tạm trú hiện tại
              </h3>
              <Badge
                variant="outline"
                className="bg-slate-50 text-slate-600 border-slate-200 text-[10px] font-bold rounded"
              >
                {room.tenant.members.length + 1} CƯ DÂN
              </Badge>
            </div>

            <Table>
              <TableHeader className="bg-slate-50/40 border-b border-slate-100/60 select-none">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-2 py-2">
                    Họ và tên
                  </TableHead>
                  <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2">
                    Vai trò lưu trú
                  </TableHead>
                  <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 font-mono">
                    Số điện thoại
                  </TableHead>
                  <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2">
                    Khai báo công an
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100/50 text-xs">
                {/* Chủ hộ */}
                <TableRow className="hover:bg-slate-50/20 border-none">
                  <TableCell className="font-bold text-slate-900 pl-2 py-2.5">
                    {room.tenant.representative.name}
                  </TableCell>
                  <TableCell className="py-2.5">
                    <Badge className="bg-indigo-50 text-indigo-700 border-none font-bold text-[9px] px-1.5 rounded">
                      Đại diện ký HĐ
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-slate-700 font-bold py-2.5">
                    {room.tenant.representative.phone}
                  </TableCell>
                  <TableCell className="text-emerald-600 font-medium py-2.5">
                    ✓ Đã nộp tờ khai
                  </TableCell>
                </TableRow>
                {/* Các thành viên ở ghép */}
                {room.tenant.members.map((m: any) => (
                  <TableRow
                    key={m.id}
                    className="hover:bg-slate-50/20 border-none"
                  >
                    <TableCell className="font-semibold text-slate-800 pl-2 py-2.5">
                      {m.name}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <Badge
                        variant="outline"
                        className="text-slate-500 border-slate-200 font-medium text-[9px] px-1.5 rounded"
                      >
                        Thành viên ở cùng
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-slate-400 py-2.5">
                      Đối chiếu qua App
                    </TableCell>
                    <TableCell className="text-slate-400 italic py-2.5">
                      • Chờ bổ sung CCCD
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 3. BIÊN BẢN TÀI SẢN BÀN GIAO & KHẤU HAO (Thay thế diện tích/hướng cửa bất hợp lý) */}
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.01)] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 select-none">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <LayoutGrid size={14} className="text-slate-400" /> Kiểm kê
                trang thiết bị nội thất bàn giao phòng
              </h3>
              <span className="text-[10px] font-mono text-slate-400 font-medium">
                Khóa chốt ngày: {room.tenant.representative.startDate}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-4 text-xs font-sans">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Khóa cửa
                </span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  Smart Lock Vân tay
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Hệ thống lạnh
                </span>
                <span className="font-semibold text-slate-800">
                  Điều hòa Inverter 12k
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Thiết bị bảo quản
                </span>
                <span className="font-semibold text-slate-800">
                  Tủ lạnh Toshiba 180L
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Giặt là nội khu
                </span>
                <span className="font-semibold text-slate-800">
                  Máy giặt cửa ngang 9kg
                </span>
              </div>
            </div>

            <Separator className="bg-slate-100/80" />

            <div className="space-y-2 select-none">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileClock size={12} /> Tiện ích nền tảng áp dụng riêng biệt cho
                căn hộ
              </p>
              <div className="flex flex-wrap gap-1.5">
                {room.fixedServices.map((tag: any) => (
                  <span
                    key={tag.id}
                    className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[11px] font-medium border border-slate-200/60 flex items-center gap-1"
                  >
                    {tag.icon} {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI (4/12 phần): TRUNG TÂM TÀI CHÍNH & CHỈ SỐ KỸ THUẬT --- */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Dòng tiền dự kiến (King Card đen sẫm cao cấp) */}
          <Card className="bg-slate-900 border-none rounded-xl overflow-hidden shadow-[0_10px_25px_-5px_rgba(15,23,42,0.12)] relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />
            <div className="p-5 space-y-5 relative z-10 select-none">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Dòng tiền dự kiến (Tháng 05)
                </p>
                <p className="text-2xl font-bold text-white tracking-tight font-sans">
                  7,150,000
                  <span className="text-xs font-normal text-slate-500 ml-1.5">
                    VNĐ
                  </span>
                </p>
              </div>

              <div className="space-y-2.5 text-[11px] font-sans">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">
                    Giá thuê mặt bằng (Cứng)
                  </span>
                  <span className="text-white font-semibold font-mono">
                    6,500,000đ
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">
                    Phí dịch vụ & Chỉ số phát sinh
                  </span>
                  <span className="text-white font-semibold font-mono">
                    650,000đ
                  </span>
                </div>
                <Separator className="bg-white/10 my-1" />
                <div className="flex justify-between items-center pt-0.5">
                  <span className="inline-flex items-center rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase">
                    Chưa quyết toán
                  </span>
                  <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase flex items-center gap-1 cursor-pointer">
                    Gửi Remind <ArrowUpRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Card 2: Chỉ số kỹ thuật công tơ nền điện nước phẳng lì */}
          <div className="bg-white p-5 border border-slate-200/80 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-3.5 select-none">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
              Sản lượng chỉ số điện nước chốt kỳ gần nhất
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Điện (Tháng 04)
                </span>
                <span className="text-sm font-bold font-mono text-slate-800 tracking-tight">
                  1,240{" "}
                  <span className="text-[10px] text-slate-400 font-sans font-normal">
                    kWh
                  </span>
                </span>
              </div>
              <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Nước (Tháng 04)
                </span>
                <span className="text-sm font-bold font-mono text-slate-800 tracking-tight">
                  85{" "}
                  <span className="text-[10px] text-slate-400 font-sans font-normal">
                    m³
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Lịch trình vận hành dẹt mượt mà */}
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.01)] overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/50 select-none">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Lịch trình tác nghiệp vận hành phòng
              </h3>
            </div>
            <div className="p-5 space-y-4 relative before:absolute before:left-9 before:top-6 before:bottom-6 before:w-px before:bg-slate-100 select-none">
              {[
                {
                  date: "15/05",
                  title: "Kỳ chốt số điện nước",
                  note: "Kế hoạch định kỳ",
                  color: "bg-slate-100 text-slate-600 border-slate-200",
                },
                {
                  date: "20/05",
                  title: "Hạn chót khóa hóa đơn",
                  note: "Gấp • Nhắc nợ tự động",
                  color: "bg-rose-50 text-rose-600 border-rose-100",
                },
                {
                  date: "01/06",
                  title: "Bảo dưỡng máy lạnh",
                  note: "Lịch hẹn thợ kỹ thuật",
                  color: "bg-slate-100 text-slate-600 border-slate-200",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 text-xs relative z-10"
                >
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${item.color} shrink-0 w-11 text-center bg-white`}
                  >
                    {item.date}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 tracking-tight leading-none mb-1">
                      {item.title}
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium font-sans">
                      {item.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Ghi chú vận hành quan trọng phẳng */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-dashed border-slate-200 flex gap-3 select-none">
            <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
            <div className="space-y-1 font-sans">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Ghi chú vận hành nội khu
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                Khách nuôi thú cưng (01 mèo). Nhắc nhở vệ sinh lọc gió điều hòa
                định kỳ để tránh bám lông gây tắc máng thoát nước ngưng.
              </p>
            </div>
          </div>
        </div>
        {/* HẾT SPLIT LAYOUT */}
      </div>
    </TabsContent>
  );
};
