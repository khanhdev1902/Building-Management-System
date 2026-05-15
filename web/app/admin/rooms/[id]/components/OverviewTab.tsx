"use client";

import React from "react";
import {
  User2,
  LayoutGrid,
  Smartphone,
  Wallet2,
  History,
  Info,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { TabsContent } from "@/shared/components/ui/tabs";
import { cn } from "@/shared/utils/cn";
import { StatCard } from "./ui-custom/StatCard";

export const OverviewTab = ({ room }: { room: any }) => {
  return (
    <TabsContent value="overview" className="space-y-5 mt-4 outline-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* --- CỘT TRÁI (8/12) --- */}
        <div className="lg:col-span-8 space-y-5">
          {/* 1. Header Info: Người thuê & Trạng thái */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="md:col-span-2 border-slate-200 shadow-none rounded-xl bg-white overflow-hidden">
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <User2 size={24} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-base font-semibold text-slate-900 truncate">
                        {room.tenant.representative.name}
                      </h4>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-none text-[10px] h-4 px-1.5 font-bold uppercase rounded-sm">
                        Chủ HĐ
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                      <Smartphone size={12} className="text-slate-400" />
                      {room.tenant.representative.phone}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600"
                >
                  <ArrowUpRight size={18} />
                </Button>
              </div>
            </Card>

            <Card className="border-slate-200 shadow-none rounded-xl p-5 bg-white flex flex-col justify-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Vận hành
              </p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-sm font-semibold text-slate-700">
                  Đang hoạt động
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-medium border-t pt-2 border-slate-100">
                Kỳ thu:{" "}
                <span className="text-slate-600 font-bold underline">
                  Tháng 05/2026
                </span>
              </p>
            </Card>
          </div>

          {/* 2. Stat Cards - Chỉnh lại font & bo góc */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Giá thuê niêm yết"
              value={`${room.price.toLocaleString()}đ`}
              subValue="Hợp đồng 12 tháng"
              className="rounded-xl border-slate-200 shadow-none"
            />
            <StatCard
              label="Tiền cọc thực thu"
              value={`${room.deposit.toLocaleString()}đ`}
              subValue="Ủy nhiệm chi: Danjin"
              className="rounded-xl border-slate-200 shadow-none"
            />
            <StatCard
              label="Thời hạn còn lại"
              value="10 tháng"
              subValue={`Hết hạn: ${room.contract.expiryDate}`}
              className="rounded-xl border-slate-200 shadow-none"
            />
          </div>

          {/* 3. Chi tiết không gian - Sắp xếp lại theo grid-6 cho chuyên nghiệp */}
          <Card className="border-slate-200 shadow-none rounded-xl bg-white overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-slate-500" />
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Đặc điểm tài sản & Không gian
                </h3>
              </div>
              <Badge
                variant="outline"
                className="text-[9px] font-bold uppercase rounded-sm border-slate-300"
              >
                #{room.roomNumber}
              </Badge>
            </div>
            <CardContent className="p-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 mb-6">
                <InfoItem label="Diện tích sàn" value={`${room.area} m²`} />
                <InfoItem label="Hướng cửa chính" value="Đông Nam" />
                <InfoItem label="Cấu trúc" value={room.type} />
                <InfoItem label="Số người tối đa" value="03 Người" />
                <InfoItem label="Vị trí tầng" value={`Tầng ${room.floor}`} />
                <InfoItem label="View nhìn" value="Công viên nội khu" />
                <InfoItem
                  label="Phòng cháy"
                  value="Đạt chuẩn PCCC"
                  status="success"
                />
                <InfoItem
                  label="An ninh"
                  value="Camera 24/7"
                  status="success"
                />
              </div>

              <div className="space-y-3 pt-5 border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={12} /> Trang thiết bị bàn giao
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Smart Lock",
                    "Máy lạnh Inverter",
                    "Tủ lạnh 180L",
                    "Máy giặt cửa ngang",
                    "Bếp hồng ngoại",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- CỘT PHẢI (4/12) --- */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card Tài chính - Giảm bớt decor "hoạt hình" */}
          <Card className="bg-slate-900 border-none rounded-xl overflow-hidden shadow-lg shadow-slate-200">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Dòng tiền dự kiến (Tháng 05)
                  </p>
                  <p className="text-2xl font-bold text-white tracking-tight">
                    7.150.000
                    <span className="text-xs font-normal text-slate-500 ml-1.5">
                      VNĐ
                    </span>
                  </p>
                </div>
                <div className="h-8 w-8 rounded bg-white/5 flex items-center justify-center">
                  <Wallet2 className="text-white/40" size={18} />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-medium">
                    Giá thuê (Cứng)
                  </span>
                  <span className="text-white font-semibold">6.500.000đ</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-medium">
                    Phí dịch vụ & Chỉ số
                  </span>
                  <span className="text-white font-semibold">650.000đ</span>
                </div>
                <Separator className="bg-white/10 my-2" />
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Chưa quyết toán
                  </span>
                  <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase flex items-center gap-1">
                    Gửi Remind <ArrowUpRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Indices: Thay icon & màu sắc tối giản */}
          <Card className="border-slate-200 shadow-none rounded-xl bg-white p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Chỉ số kỹ thuật
              </p>
              <Zap size={14} className="text-slate-300" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                  Điện (Tháng 04)
                </p>
                <p className="text-sm font-bold text-slate-900 tracking-tight">
                  1,240{" "}
                  <span className="text-[10px] font-normal text-slate-400">
                    kWh
                  </span>
                </p>
              </div>
              <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                  Nước (Tháng 04)
                </p>
                <p className="text-sm font-bold text-slate-900 tracking-tight">
                  85{" "}
                  <span className="text-[10px] font-normal text-slate-400">
                    m³
                  </span>
                </p>
              </div>
            </div>
          </Card>

          {/* Timeline: Dùng gạch ngang nhỏ thay vì dot to */}
          <Card className="border-slate-200 shadow-none rounded-xl bg-white">
            <div className="px-5 py-3 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Lịch trình vận hành
              </h3>
              <History size={14} className="text-slate-300" />
            </div>
            <div className="p-5 space-y-5">
              <TimelineItem
                date="15/05"
                title="Kỳ chốt số điện nước"
                status="Kế hoạch"
              />
              <TimelineItem
                date="20/05"
                title="Hạn chót thanh toán"
                status="Gấp"
                isWarning
              />
              <TimelineItem
                date="01/06"
                title="Kiểm tra hệ thống lạnh"
                status="Lịch hẹn"
              />
            </div>
          </Card>

          {/* Note: Làm phẳng hoàn toàn */}
          <div className="p-4 bg-slate-100/50 rounded-xl border border-slate-200 flex gap-3">
            <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase">
                Ghi chú quan trọng
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Khách nuôi thú cưng (01 mèo). Cần lưu ý vệ sinh định kỳ máy lạnh
                để tránh bám lông.
              </p>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

// --- HELPERS CẢI TIẾN ---

function InfoItem({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: string;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {label}
      </p>
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-semibold text-slate-700">{value}</p>
        {status === "success" && (
          <div className="h-1 w-1 rounded-full bg-emerald-500" />
        )}
      </div>
    </div>
  );
}

function TimelineItem({ date, title, status, isWarning }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "text-[9px] font-bold px-1.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600",
            isWarning && "bg-red-50 text-red-600 border-red-100",
          )}
        >
          {date}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-800 leading-none mb-1">
          {title}
        </p>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">
          {status}
        </p>
      </div>
    </div>
  );
}
