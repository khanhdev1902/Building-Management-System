/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  User,
  Phone,
  Mail,
  CreditCard,
  UserPlus,
  MoreHorizontal,
  Trash2,
  UserCog,
  ShieldCheck,
  FileText,
  MapPin,
  CalendarDays,
  Plus,
  CheckCircle2,
  CircleEllipsis,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export function ResidentTab({ tenant }: any) {
  const { representative, members } = tenant;

  // Giả lập thêm dữ liệu để UI nhìn "pro" hơn
  const representativeExtra = {
    dob: "15/05/1998",
    hometown: "Hà Nội",
    status: "verified",
  };

  return (
    <div className=" grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- CỘT TRÁI (4 COLS): NGƯỜI ĐẠI DIỆN PHÁP LÝ --- */}
      <div className="lg:col-span-4 space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              Đại diện pháp lý
            </h3>
          </div>
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100/50 text-[10px] font-bold">
            CHỦ HỘ
          </Badge>
        </div>

        <Card className="border-slate-200/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] bg-white rounded-2xl overflow-hidden relative group">
          {/* Subtle Texture Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

          <CardContent className="p-0 relative z-10">
            {/* Header Profile */}
            <div className="p-8 text-center bg-linear-to-b from-slate-50/80 to-white border-b border-slate-100">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-[2.5rem] bg-white border border-slate-200 p-1.5 shadow-sm group-hover:rotate-3 transition-transform duration-500">
                  <div className="w-full h-full rounded-[2rem] bg-slate-900 flex items-center justify-center text-white">
                    <User size={40} strokeWidth={1.5} />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                  <CheckCircle2
                    size={22}
                    className="text-emerald-500 fill-emerald-50"
                  />
                </div>
              </div>
              <h4 className="mt-5 text-xl font-black text-slate-900 tracking-tight leading-none">
                {representative.name}
              </h4>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Badge
                  variant="outline"
                  className="text-[10px] border-slate-200 text-slate-500 font-bold bg-white"
                >
                  {representative.cccd.slice(-4)} • ID
                </Badge>
              </div>
            </div>

            {/* Detailed Stats List */}
            <div className="p-6 space-y-1">
              <DetailRow
                icon={<Phone size={14} />}
                label="Hotline"
                value={representative.phone}
              />
              <DetailRow
                icon={<Mail size={14} />}
                label="Email"
                value={representative.email}
              />
              <DetailRow
                icon={<CalendarDays size={14} />}
                label="Ngày sinh"
                value={representativeExtra.dob}
              />
              <DetailRow
                icon={<MapPin size={14} />}
                label="Quê quán"
                value={representativeExtra.hometown}
              />
              <DetailRow
                icon={<CreditCard size={14} />}
                label="CCCD"
                value={representative.cccd}
                isMono
              />

              <div className="pt-6 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="rounded-xl border-slate-200 font-bold text-[11px] h-10 hover:bg-slate-50"
                >
                  SỬA HỒ SƠ
                </Button>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-[11px] h-10 gap-2 shadow-lg shadow-slate-200">
                  <FileText size={14} /> HỢP ĐỒNG
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- CỘT PHẢI (8 COLS): THÀNH VIÊN --- */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
              <Users size={16} className="text-slate-400" />
              Cư dân lưu trú ({members.length})
            </h3>
          </div>
          <Button className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black rounded-xl gap-2 px-5 shadow-lg shadow-indigo-100 transition-all active:scale-95">
            <UserPlus size={16} /> THÊM CƯ DÂN
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((member: any) => (
            <Card
              key={member.id}
              className="group border-slate-200/60 shadow-none hover:border-indigo-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 rounded-2xl bg-white overflow-hidden"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                        <User size={22} />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                        {member.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {member.role}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">
                          Đã khai báo
                        </span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-300 hover:bg-slate-50 rounded-full transition-colors"
                      >
                        <MoreHorizontal size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 rounded-xl border-slate-100 shadow-xl p-1.5"
                    >
                      <DropdownMenuItem className="rounded-lg text-xs font-bold gap-2 py-2.5">
                        <UserCog size={14} className="text-slate-400" /> Xem hồ
                        sơ chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg text-xs font-bold gap-2 py-2.5">
                        <CalendarDays size={14} className="text-slate-400" />{" "}
                        Lịch sử ra vào
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="rounded-lg text-xs font-bold gap-2 py-2.5 text-red-600 hover:bg-red-50 focus:bg-red-50">
                        <Trash2 size={14} /> Xóa khỏi hệ thống
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <QuickAction icon={<Phone size={12} />} />
                    <QuickAction icon={<Mail size={12} />} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    Room {representative.roomNumber || "A.101"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* New Empty Slot Design */}
          <div className="border-2 border-dashed border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 group hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:text-indigo-400 transition-all duration-500">
              <Plus size={20} strokeWidth={3} />
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] group-hover:text-indigo-600 transition-colors">
              Trống (Max 3)
            </p>
          </div>
        </div>

        {/* System Logs / Notifications Footer */}
        <div className="bg-slate-900 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.05] text-white">
            <ShieldCheck size={100} />
          </div>
          <div className="relative z-10 flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-400 shrink-0">
              <CircleEllipsis size={20} />
            </div>
            <div>
              <h5 className="text-white text-sm font-bold">Quy định lưu trú</h5>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Hệ thống tự động đồng bộ dữ liệu với cổng dịch vụ công cư trú.
                Vui lòng nhắc nhở cư dân hoàn tất thủ tục tạm trú trong vòng 24h
                kể từ khi dọn vào.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function DetailRow({ icon, label, value, isMono = false }: any) {
  return (
    <div className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-slate-50 transition-colors group/row">
      <div className="flex items-center gap-3">
        <div className="text-slate-300 group-hover/row:text-indigo-500 transition-colors">
          {icon}
        </div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span
        className={`text-sm font-bold text-slate-700 ${isMono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function QuickAction({ icon }: { icon: any }) {
  return (
    <button className="w-7 h-7 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-white hover:text-indigo-600 hover:shadow-sm border border-transparent hover:border-slate-100 transition-all">
      {icon}
    </button>
  );
}

function Users({ size, className }: any) {
  return <User size={size} className={className} />;
}
