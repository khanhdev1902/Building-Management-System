/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Wifi,
  Bike,
  Trash2,
  CheckCircle2,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Info,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

// 1. MOCK DATA DỊCH VỤ THỰC TẾ CỦA MỘT PHÒNG TRONG CHUNG CƯ MINI
// Dịch vụ phòng này đang sử dụng cố định (Tính vào hóa đơn hằng tháng)
const INITIAL_SERVICES_DATA = {
  activeServices: [
    { id: "srv-1", name: "Combo Mạng Internet & Vệ sinh", cost: 200000, icon: Wifi, period: "tháng" },
    { id: "srv-2", name: "Phí gửi xe máy (29M1-123.45)", cost: 70000, icon: Bike, period: "tháng" },
    { id: "srv-3", name: "Phí dịch vụ chung (Thang máy, rác, máy giặt chung)", cost: 100000, icon: Trash2, period: "tháng" },
  ],
  // Danh mục dịch vụ gia tăng có thể đăng ký thêm một chạm
  addOnCatalog: [
    { id: "cat-1", name: "Đăng ký thêm xe máy", cost: 100000, description: "Cấp thêm 01 chỗ để xe dưới hầm và 01 thẻ từ định danh mới.", icon: Bike },
    { id: "cat-2", name: "Nâng cấp Thẻ từ sang Vòng tay NFC", cost: 150000, description: "Đổi thẻ nhựa sang vòng đeo tay silicon chống nước để mở khóa cổng chính.", icon: Sparkles },
    { id: "cat-3", name: "Gói dọn vệ sinh phòng lẻ (Deep Clean)", cost: 250000, description: "Nhân viên dọn dẹp toàn bộ phòng ở, ban công và nhà tắm trong 2 giờ.", icon: Trash2 },
  ]
};

export default function TenantServicesPage() {
  const [data, setData] = useState(INITIAL_SERVICES_DATA);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOvernightOpen, setIsOvernightOpen] = useState(false);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Kích hoạt Dialog đăng ký thêm dịch vụ
  const handleOpenRegister = (service: any) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  // Xử lý gửi yêu cầu đăng ký thêm dịch vụ lên Backend NestJS
  const handleConfirmRegistration = () => {
    toast.loading("Đang gửi yêu cầu phê duyệt đến Ban quản lý...");
    setTimeout(() => {
      setIsDialogOpen(false);
      toast.success(`✓ Đăng ký thành công gói [${selectedService.name}]. Yêu cầu đang được xử lý, chi phí sẽ tính vào hóa đơn kỳ sau.`);
    }, 1200);
  };

  // Xử lý gửi xe vãng lai qua đêm nhanh
  const handleConfirmOvernightParking = () => {
    toast.loading("Đang cấp mã QR giữ xe vãng lai...");
    setTimeout(() => {
      setIsOvernightOpen(false);
      toast.success("✓ Đã kích hoạt mã gửi xe vãng lai 1 đêm thành công! Vui lòng bảo bạn quét mã tại cổng bảo vệ.");
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6 bg-slate-50/10 min-h-screen antialiased font-sans select-none pb-24 md:pb-6">
      
      {/* 1. TOP BAR TIÊU ĐỀ FLAT */}
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-slate-900 fill-slate-900 stroke-[1.5]" />
          Dịch vụ & Tiện ích mở rộng
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Quản lý các gói dịch vụ phòng đang sử dụng và đăng ký các tiện ích phát sinh một chạm.
        </p>
      </div>

      {/* 2. KHỐI TÁC VỤ NHANH QUA ĐÊM (TIỆN ÍCH KHẨN CẤP CHO MOBILE) */}
      <Card className="border border-indigo-100/80 shadow-2xs bg-linear-to-r from-indigo-50/25 to-white overflow-hidden rounded-xl">
        <CardContent className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-0.5">
            <span className="text-[9px] font-extrabold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded uppercase tracking-wider select-none">
              Tiện ích một chạm nhanh
            </span>
            <h3 className="text-xs md:text-sm font-bold text-slate-900 pt-1">Bạn bè ghé chơi gửi xe qua đêm?</h3>
            <p className="text-[11px] text-slate-400 font-medium">Kích hoạt nhanh vé xe vãng lai gạch nợ tự động vào quỹ phòng lẻ.</p>
          </div>
          <Button 
            onClick={() => setIsOvernightOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-8.5 rounded-lg px-4 gap-1 uppercase tracking-wider cursor-pointer shadow-xs"
          >
            Đăng ký xe đêm <ArrowUpRight size={13} />
          </Button>
        </CardContent>
      </Card>

      {/* 3. KHỐI 1: DỊCH VỤ ĐANG SỬ DỤNG (MINH BẠCH TÀI CHÍNH) */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block px-0.5">
          Dịch vụ phòng đang duy trì ({data.activeServices.length})
        </span>
        <div className="space-y-2">
          {data.activeServices.map((srv) => (
            <div key={srv.id} className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-3xs flex items-center justify-between gap-3 text-xs font-semibold">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                  <srv.icon size={15} className="stroke-[1.8]" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-slate-900 font-bold">{srv.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono font-medium">{formatVND(srv.cost)} / {srv.period}</p>
                </div>
              </div>
              <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100/50 shadow-none font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wide shrink-0">
                ● Active
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* 4. KHỐI 2: DANH MỤC DỊCH VỤ CÓ THỂ ĐĂNG KÝ THÊM (MARKETPLACE MINI) */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block px-0.5">
          Danh mục dịch vụ mở rộng có sẵn
        </span>
        <div className="space-y-3">
          {data.addOnCatalog.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => handleOpenRegister(cat)}
              className="p-4 rounded-xl border border-slate-100 bg-white shadow-3xs hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between gap-3 group"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-8.5 w-8.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 shrink-0 group-hover:scale-102 transition-transform">
                    <cat.icon size={16} className="stroke-[2.2]" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{cat.name}</h4>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed pr-2">{cat.description}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-black text-slate-900 shrink-0 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                  {formatVND(cat.cost)}
                </span>
              </div>
              <div className="flex justify-end pt-1 border-t border-slate-50/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-0.5 group-hover:text-slate-800 transition-colors">
                  Bấm để đăng ký nhanh <ChevronRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL XÁC NHẬN ĐĂNG KÝ DỊCH VỤ THÊM ================= */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md bg-white rounded-xl border border-slate-100 p-5 shadow-2xl overflow-hidden font-sans flex flex-col animate-in fade-in zoom-in-95 duration-200 focus-visible:outline-none">
          <DialogHeader className="border-b border-slate-50 pb-3">
            <DialogTitle className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles size={14} className="text-indigo-600 stroke-[2.5]" /> Xác nhận đăng ký gói phí
            </DialogTitle>
            <DialogDescription className="text-[11px] text-slate-400 font-medium">
              Yêu cầu sẽ được chuyển trực tiếp đến tài khoản admin chủ nhà phê duyệt.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2.5 space-y-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs font-semibold">
              <span className="text-[9px] font-extrabold uppercase text-slate-400 block">Tên gói dịch vụ đăng ký</span>
              <p className="text-slate-900 font-bold text-sm">{selectedService?.name}</p>
              <p className="text-[11px] text-slate-400 font-medium leading-normal pt-0.5">{selectedService?.description}</p>
            </div>

            <div className="flex justify-between items-center px-1 text-xs font-bold text-slate-900 uppercase tracking-wide">
              <span>Đơn giá cộng dồn kỳ sau</span>
              <span className="text-sm font-mono font-black text-slate-900">{selectedService ? formatVND(selectedService ? 0 : selectedService.cost) : "0đ"}</span>
            </div>

            <p className="text-[10px] leading-relaxed text-slate-400 font-medium bg-indigo-50/20 border border-indigo-100/20 p-2.5 rounded-lg flex items-start gap-1.5">
              <Info size={13} className="text-indigo-600 shrink-0 mt-0.5" /> Chi phí sẽ không trừ trực tiếp vào tài khoản ngân hàng của bạn ngay lúc này, hệ thống Danjin BMS sẽ tự cộng gộp mục này vào hóa đơn tổng chu kỳ tới.
            </p>
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-50">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1 h-9 text-xs text-slate-500 font-bold rounded-lg cursor-pointer">
              Hủy bỏ
            </Button>
            <Button onClick={handleConfirmRegistration} className="flex-1 h-9 text-xs font-black bg-slate-900 hover:bg-slate-800 text-white rounded-lg uppercase tracking-wider shadow-sm cursor-pointer">
              Xác nhận gửi yêu cầu
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL ĐĂNG KÝ XE VÃNG LAI QUA ĐÊM NHANH ================= */}
      <Dialog open={isOvernightOpen} onOpenChange={setIsOvernightOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md bg-white rounded-xl border border-slate-100 p-5 shadow-2xl overflow-hidden font-sans flex flex-col animate-in fade-in zoom-in-95 duration-200 focus-visible:outline-none">
          <DialogHeader className="border-b border-slate-50 pb-3">
            <DialogTitle className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Clock size={14} className="text-rose-500 stroke-[2.5]" /> Vé gửi xe vãng lai đêm
            </DialogTitle>
            <DialogDescription className="text-[11px] text-slate-400 font-medium">
              Cấp quyền ra vào hầm xe cho khách vãng lai lưu trú 01 đêm cố định.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2.5 space-y-3.5 text-xs font-semibold">
            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-normal">Định mức phí giữ xe vãng lai:</span>
              <span className="text-slate-900 font-mono font-bold">15.000đ / đêm</span>
            </div>
            <div className="p-3 bg-rose-50/20 border border-rose-100/40 rounded-xl space-y-1">
              <span className="text-[9px] text-rose-500 font-extrabold uppercase tracking-wider block">Yêu cầu an ninh hầm xe</span>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Khi bấm kích hoạt, hệ thống sẽ tự cấp một mã quét tạm thời có giá trị đến 06:00 sáng mai. Vui lòng nhắc nhở bạn bè không chắn lối sạc xe điện dưới hầm.
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-50">
            <Button variant="ghost" onClick={() => setIsOvernightOpen(false)} className="flex-1 h-9 text-xs text-slate-500 font-bold rounded-lg cursor-pointer">
              Đóng lại
            </Button>
            <Button onClick={handleConfirmOvernightParking} className="flex-1 h-9 text-xs font-black bg-rose-600 hover:bg-rose-700 text-white rounded-lg uppercase tracking-wider shadow-sm cursor-pointer">
              Kích hoạt vé xe đêm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}