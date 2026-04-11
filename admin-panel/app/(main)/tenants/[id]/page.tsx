/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  ShieldCheck,
  CreditCard,
  Activity,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Car,
  MoreVertical,
  Plus,
  FileText,
  AlertCircle,
  History,
  Key,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
// import { Separator } from "@/shared/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

export default function TenantProfessionalDetail() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-white min-h-screen">
      {/* --- HEADER: Context & Primary Actions --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="flex items-start gap-5">
          <button className="mt-1 h-12 w-12 flex items-center justify-center rounded-xl hover:bg-slate-900 hover:text-white transition-all border border-slate-200 text-slate-500 shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                trần bình an
              </h1>
              <Badge className="bg-emerald-500 hover:bg-emerald-600 rounded-full px-3 py-0.5 text-[10px] uppercase font-bold border-none">
                Đang cư trú
              </Badge>
              <Badge
                variant="outline"
                className="text-red-500 border-red-200 bg-red-50 font-bold text-[10px]"
              >
                Nợ phí: 1.200.000đ
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-2 text-slate-500">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" /> P.101 - Danjin Tower
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                <Key className="w-3.5 h-3.5" /> Mã cư dân: RES-8802
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            className="rounded-lg border-slate-200 font-bold text-xs h-11 px-5 shadow-sm hover:bg-slate-50"
          >
            Sửa hồ sơ
          </Button>
          <Button className="rounded-lg bg-slate-900 text-white font-bold text-xs h-11 px-6 shadow-lg shadow-slate-200 hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" /> Tạo hóa đơn / Phiếu thu
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* --- LEFT SIDEBAR: Vital Stats & Contact --- */}
        <div className="lg:col-span-4 space-y-8">
          <div className="relative group w-fit">
            <Avatar className="w-40 h-40 rounded-2xl border-4 border-white shadow-xl">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="text-4xl font-black bg-slate-100">
                NV
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-lg shadow-lg border-2 border-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-1 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">
              Thông tin liên lạc
            </h3>
            <InfoItem
              icon={<Phone />}
              label="Số điện thoại"
              value="0987 654 321"
              isCopyable
            />
            <InfoItem
              icon={<Mail />}
              label="Email cá nhân"
              value="anhnv@gmail.com"
            />
            <InfoItem
              icon={<FileText />}
              label="Số định danh (CCCD)"
              value="001092003xxx"
            />
          </div>

          <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl space-y-4">
            <h3 className="text-[11px] font-black uppercase text-slate-900 tracking-widest">
              Tài liệu đính kèm
            </h3>
            <div className="space-y-2">
              <FileCard name="HopDongThue_P101.pdf" size="2.4MB" />
              <FileCard name="CCCD_MatTruoc.jpg" size="1.1MB" />
              <Button
                variant="ghost"
                className="w-full text-xs font-bold text-blue-600 hover:bg-blue-50"
              >
                + Thêm tài liệu
              </Button>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT: Operations & Data --- */}
        <div className="lg:col-span-8 space-y-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              label="Tiền cọc"
              value="4.500.000"
              unit="VND"
              color="text-slate-900"
            />
            <MetricCard
              label="Dư nợ hiện tại"
              value="0"
              unit="VND"
              color="text-emerald-600"
            />
            <MetricCard
              label="Thời hạn HĐ"
              value="245"
              unit="Ngày"
              color="text-orange-600"
            />
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-transparent border-b border-slate-100 w-full justify-start rounded-none h-auto p-0 gap-8">
              <TabsTrigger value="overview" className="tab-style">
                Tổng quan
              </TabsTrigger>
              <TabsTrigger value="finance" className="tab-style">
                Lịch sử tài chính
              </TabsTrigger>
              <TabsTrigger value="requests" className="tab-style">
                Yêu cầu hỗ trợ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="pt-8 space-y-10">
              {/* Nhân khẩu & Phương tiện */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase text-slate-900 tracking-tight">
                      Nhân khẩu đi kèm
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px] font-bold"
                    >
                      Thêm mới
                    </Button>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
                    <PeopleItem name="Lê Thị Bảo" role="Vợ" />
                    <PeopleItem name="Nguyễn Văn C" role="Con" />
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase text-slate-900 tracking-tight">
                      Phương tiện
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px] font-bold"
                    >
                      Cấp thẻ
                    </Button>
                  </div>
                  <div className="p-4 border border-slate-100 bg-white rounded-xl shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-900 rounded-lg">
                        <Car className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          29-G1 123.45
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          Honda Vision • Thẻ #991
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </section>
              </div>

              {/* Timeline tóm tắt */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
                    <History className="w-4 h-4" /> Nhật ký hoạt động gần đây
                  </h3>
                </div>
                <div className="relative space-y-4 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  <TimelineNode
                    date="Hôm nay"
                    title="Thanh toán tiền điện tháng 03"
                    type="finance"
                  />
                  <TimelineNode
                    date="24/02/2026"
                    title="Báo cáo sự cố: Hỏng vòi sen"
                    type="incident"
                  />
                  <TimelineNode
                    date="15/01/2026"
                    title="Cập nhật thông tin phương tiện"
                    type="system"
                  />
                </div>
              </section>
            </TabsContent>

            <TabsContent value="finance">
              <div className="py-20 text-center text-slate-400 text-sm font-medium">
                Dữ liệu tài chính đang được tải...
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <style jsx global>{`
        .tab-style {
          @apply relative pb-4 px-0 rounded-none border-b-2 border-transparent font-bold text-slate-400 transition-all data-[state=active]:border-slate-900 data-[state=active]:text-slate-900 text-xs uppercase tracking-widest;
        }
      `}</style>
    </div>
  );
}

// --- Tối ưu các Sub-components ---

function MetricCard({ label, value, unit, color }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-black tracking-tight ${color}`}>
          {value}
        </span>
        <span className="text-[10px] font-bold text-slate-400 uppercase">
          {unit}
        </span>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value, isCopyable }: any) {
  return (
    <div className="flex items-center gap-4 py-3 group">
      <div className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400 group-hover:text-slate-900 transition-colors shadow-sm">
        {React.cloneElement(icon as React.ReactElement, {
          className: "w-4 h-4",
        })}
      </div>
      <div className="flex-1">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function PeopleItem({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
          {name.charAt(0)}
        </div>
        <span className="text-xs font-bold text-slate-700">{name}</span>
      </div>
      <Badge
        variant="secondary"
        className="bg-slate-100 text-slate-500 text-[9px] font-black border-none uppercase px-2"
      >
        {role}
      </Badge>
    </div>
  );
}

function FileCard({ name, size }: { name: string; size: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
      <div className="flex items-center gap-3 overflow-hidden">
        <FileText className="w-4 h-4 text-blue-500 shrink-0" />
        <span className="text-[11px] font-bold text-slate-700 truncate">
          {name}
        </span>
      </div>
      <span className="text-[9px] font-bold text-slate-400 uppercase">
        {size}
      </span>
    </div>
  );
}

function TimelineNode({ date, title, type }: any) {
  const icons: any = {
    finance: <CreditCard className="w-3 h-3" />,
    incident: <AlertCircle className="w-3 h-3 text-red-500" />,
    system: <Activity className="w-3 h-3" />,
  };

  return (
    <div className="relative pl-8 pb-2">
      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center z-10 shadow-sm">
        {icons[type]}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-300 uppercase mb-0.5">
          {date}
        </p>
        <p className="text-xs font-bold text-slate-700">{title}</p>
      </div>
    </div>
  );
}
