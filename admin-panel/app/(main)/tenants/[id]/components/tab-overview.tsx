/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Car, MoreVertical } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

export function TabOverview() {
  return (
    <div className="p-0 animate-in fade-in duration-500 font-sans">
      {/* 1. SECTION: NHÂN KHẨU (Chuyển sang Table để cân được nhiều người) */}
      <section className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
              Hành chính cư dân
            </h3>
            <Badge className="bg-slate-100 text-slate-500 border-none font-bold text-[10px]">
              02 NGƯỜI
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[10px] font-black uppercase border-slate-200"
          >
            + THÊM THÀNH VIÊN
          </Button>
        </div>

        <div className="rounded-md border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-2">Thành viên</th>
                <th className="px-4 py-2">Quan hệ</th>
                <th className="px-4 py-2">Định danh (CCCD)</th>
                <th className="px-4 py-2">Tạm trú</th>
                <th className="px-4 py-2 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <ResidentRow
                name="Lê Thị Bảo"
                role="Vợ"
                id="00109200xxxx"
                status="Đã khai báo"
              />
              <ResidentRow
                name="Nguyễn Văn C"
                role="Con"
                id="Chưa có"
                status="Dưới 14 tuổi"
              />
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. SECTION: PHƯƠNG TIỆN (Làm phẳng, gọn gàng) */}
      <section className="p-6 border-b border-slate-100">
        <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-4">
          Quản lý phương tiện
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VehicleItem
            plate="29-G1 123.45"
            type="Honda Vision"
            card="#99120"
            status="active"
          />
          <VehicleItem
            plate="30-A2 555.88"
            type="Mazda CX-5"
            card="#88201"
            status="locked"
          />
        </div>
      </section>

      {/* 3. SECTION: TIMELINE (Minimalist - Chống rối mắt) */}
      <section className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
            Nhật ký tác nghiệp gần đây
          </h3>
          <Button
            variant="link"
            className="h-auto p-0 text-[10px] font-bold text-indigo-600 uppercase"
          >
            Tất cả lịch sử
          </Button>
        </div>

        <div className="space-y-0 relative before:absolute before:left-2.75 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
          <TimelineItem
            title="Đã thanh toán hóa đơn điện tháng 03"
            user="Linh Nguyễn (Kế toán)"
            time="Hôm nay, 10:30"
            type="finance"
          />
          <TimelineItem
            title="Báo cáo hỏng vòi sen"
            user="Trần Bình An (Cư dân)"
            time="Hôm qua, 14:20"
            type="incident"
          />
          <TimelineItem
            title="Gia hạn hợp đồng thuê nhà"
            user="Lê Minh (Quản lý)"
            time="15/01/2026"
            type="system"
          />
        </div>
      </section>
    </div>
  );
}

// --- SUB-COMPONENTS NÂNG CẤP ---

function ResidentRow({ name, role, id, status }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-4 py-3 text-[13px] font-bold text-slate-700">{name}</td>
      <td className="px-4 py-3">
        <Badge
          variant="outline"
          className="text-[9px] font-bold border-slate-200 text-slate-500"
        >
          {role}
        </Badge>
      </td>
      <td className="px-4 py-3 text-[12px] font-medium text-slate-400 font-mono">
        {id}
      </td>
      <td className="px-4 py-3 text-[12px] font-medium text-slate-500 italic">
        {status}
      </td>
      <td className="px-4 py-3 text-right">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-slate-300 opacity-0 group-hover:opacity-100"
        >
          <MoreVertical size={14} />
        </Button>
      </td>
    </tr>
  );
}

function VehicleItem({ plate, type, card, status }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white group hover:border-slate-300 transition-all">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-50 rounded group-hover:bg-slate-900 group-hover:text-white transition-colors">
          <Car size={16} />
        </div>
        <div>
          <p className="text-[13px] font-bold text-slate-800 tracking-tight">
            {plate}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">
            {type} • Thẻ {card}
          </p>
        </div>
      </div>
      <Badge
        className={`${status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"} border-none text-[9px] font-black uppercase`}
      >
        {status === "active" ? "Đang chạy" : "Đã khóa"}
      </Badge>
    </div>
  );
}

function TimelineItem({ title, user, time, type }: any) {
  const dotColor: any = {
    finance: "bg-emerald-500",
    incident: "bg-red-500",
    system: "bg-indigo-500",
  };
  return (
    <div className="relative pl-8 pb-6 last:pb-0">
      <div
        className={`absolute left-2 top-1.5 w-2 h-2 rounded-full ${dotColor[type]} ring-4 ring-white z-10`}
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
        <p className="text-[13px] font-semibold text-slate-700">{title}</p>
        <span className="text-[10px] font-medium text-slate-300">{time}</span>
      </div>
      <p className="text-[11px] text-slate-400 font-medium">
        Thực hiện: <span className="text-slate-500">{user}</span>
      </p>
    </div>
  );
}
