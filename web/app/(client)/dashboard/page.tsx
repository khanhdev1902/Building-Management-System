/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import {
  Zap,
  Droplet,
  Receipt,
  Wrench,
  Megaphone,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Copy,
  Bike,
  Calendar,
  Building2,
  ChevronRight,
  AlertTriangle,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { dashboardApi } from "@/app/admin/dashboard/apis/dashboard.api";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { TenantDashboardData } from "./types/dashboard.type";

export default function TenantDashboard() {
  const [data, setData] = useState<TenantDashboardData>();
  const [isLoading, setIsLoading] = useState<boolean>(true); // Khởi tạo trạng thái loading
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const authStore = useAuthStore();

  const fechData = async () => {
    try {
      setIsLoading(true);
      if (!authStore.user) {
        toast.info("Không tìm thấy data người dùng hiện tại!");
        return;
      }
      const res = await dashboardApi.getDashboardTenantData(authStore.user.id);
      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // Tắt loading khi đã có dữ liệu hoặc lỗi
    }
  };

  useEffect(() => {
    fechData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopyField = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${message}`);
  };

  // --- TRẠNG THÁI LOADING SKELETON CHUẨN FLAT ---
  if (isLoading) {
    return (
      <div className="bg-[#fcfcfd] min-h-screen antialiased p-4 md:p-6 space-y-6 animate-pulse">
        {/* Skeleton Header */}
        <div className="max-w-7xl mx-auto h-20 bg-white border border-slate-200/60 rounded-xl p-4 flex justify-between items-center">
          <div className="space-y-2 w-1/3">
            <div className="h-3 bg-slate-200 rounded w-1/2" />
            <div className="h-5 bg-slate-200 rounded w-full" />
          </div>
          <div className="h-8 bg-slate-200 rounded w-24" />
        </div>

        {/* Skeleton Main Content */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột trái */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-slate-200 rounded-xl h-72 bg-white p-5 space-y-4">
              <div className="h-10 bg-slate-100/80 rounded-lg w-full" />
              <div className="h-40 bg-slate-50/50 rounded-lg w-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-lg h-28 bg-white" />
              <div className="border border-slate-200 rounded-lg h-28 bg-white" />
            </div>
          </div>
          {/* Cột phải */}
          <div className="border border-slate-200 rounded-xl h-96 bg-white p-5 space-y-6">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="space-y-3">
              <div className="h-16 bg-slate-50 rounded-lg w-full" />
              <div className="h-16 bg-slate-50 rounded-lg w-full" />
              <div className="h-16 bg-slate-50 rounded-lg w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- TRẠNG THÁI RENDER DỮ LIỆU GỐC ---
  return (
    <div className="bg-[#fcfcfd] min-h-screen antialiased font-sans text-slate-900 selection:bg-slate-100">
      {/* 1. TOP HEADER FLAT */}
      <header className="border-b border-slate-200/60 bg-white sticky top-0 z-30 px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-0.5 w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-50 sm:max-w-none">
                {data?.building}
              </span>
              <ChevronRight className="w-2.5 h-2.5 shrink-0" />
              <span className="font-mono font-black text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                P.{data?.room}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-tight mt-0.5">
              Cư dân hiện tại: {data?.resident}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border-t border-slate-100 pt-2 sm:border-none sm:pt-0 w-full sm:w-auto">
            <span className="text-slate-400">
              Mã hợp đồng:{" "}
              <b className="font-mono text-slate-900 font-black">
                {data?.contractId?.slice(0, 10)}
              </b>
            </span>
            <span className="h-3 w-px bg-slate-200 hidden sm:block" />
            <span className="text-emerald-600">● Hợp đồng đang chạy</span>
          </div>
        </div>
      </header>

      {/* 2. TOP ALERT BANNER */}
      {data?.urgentNotice && showAlert && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 md:px-8 py-3">
          <div className="max-w-7xl mx-auto flex items-start justify-between gap-3">
            <div className="flex gap-2.5 min-w-0">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 min-w-0">
                <p className="text-[11px] font-black text-amber-900 uppercase tracking-tight flex flex-wrap items-center gap-1.5">
                  <span className="truncate">{data.urgentNotice.title}</span>
                  <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                    {data.urgentNotice.time}
                  </span>
                </p>
                <p className="text-xs text-amber-700 leading-normal font-medium">
                  {data.urgentNotice.content}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className="text-amber-400 hover:text-amber-600 p-1 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================= CỘT TRÁI: TÀI CHÍNH & CHỈ SỐ ================= */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            {/* THẺ TÀI CHÍNH LIỀN KHỐI */}
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/40">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
                    Nghĩa vụ tài chính định kỳ
                  </span>
                  <h2 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                    {data?.billingStatus === "UNPAID"
                      ? `Hóa đơn tổng hợp ${data?.invoice?.period}`
                      : `Khoản phí ${data?.invoice?.period} đã thanh toán`}
                  </h2>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Hạn thanh toán: Trước ngày {data?.invoice?.dueDate} • Phát
                    hành: {data?.invoice?.issueDate}
                  </p>
                </div>

                {data?.billingStatus === "UNPAID" ? (
                  <Button
                    onClick={() => setIsQrOpen(true)}
                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest h-9 rounded-md px-4 gap-1.5"
                  >
                    <Receipt className="w-3.5 h-3.5" /> Thanh toán ngay
                  </Button>
                ) : (
                  <div className="w-full sm:w-auto text-center text-emerald-600 bg-emerald-50/50 px-2.5 py-1.5 rounded border border-emerald-100 text-[10px] font-black uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> ĐÃ
                    THANH TOÁN
                  </div>
                )}
              </div>

              {/* BẢNG KÊ CHI TIẾT */}
              <div className="p-4 sm:p-5 flex flex-col gap-5">
                {/* 1. Nhóm dịch vụ đo lường */}
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                    1. Dịch vụ tiêu thụ (Theo công tơ)
                  </span>
                  <div className="border border-slate-100 rounded-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/40 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                            <th className="py-2 px-3 sm:px-4">Dịch vụ</th>
                            <th className="py-2 px-2 text-center hidden sm:table-cell">
                              Số cũ
                            </th>
                            <th className="py-2 px-2 text-center hidden sm:table-cell">
                              Số mới
                            </th>
                            <th className="py-2 px-2 text-center">Sử dụng</th>
                            <th className="py-2 px-3 text-right hidden md:table-cell">
                              Đơn giá
                            </th>
                            <th className="py-2 px-4 text-right pr-4 sm:pr-5">
                              Thành tiền
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-[12px]">
                          {data?.invoice?.details
                            ?.filter(
                              (item: any) =>
                                item.type === "WATER" ||
                                item.type === "ELECTRIC",
                            )
                            ?.map((item: any, idx: number) => {
                              const usageKey =
                                item.name.includes("Điện") ||
                                item.name.includes("điện")
                                  ? "electricity"
                                  : "water";
                              const usageInfo =
                                data?.invoice?.usage?.[usageKey];
                              return (
                                <tr
                                  key={idx}
                                  className="hover:bg-slate-50/30 transition-colors"
                                >
                                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-800">
                                    • {item.name.split(" ")[0]}
                                  </td>
                                  <td className="py-2.5 px-2 text-center font-mono text-slate-400 hidden sm:table-cell">
                                    {usageInfo?.oldIndex}
                                  </td>
                                  <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-900 hidden sm:table-cell">
                                    {usageInfo?.newIndex}
                                  </td>
                                  <td className="py-2.5 px-2 text-center">
                                    <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                                      {usageInfo?.total}{" "}
                                      {usageKey === "electricity"
                                        ? "kWh"
                                        : "m³"}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-4 text-right font-mono text-slate-400 hidden md:table-cell">
                                    {item.unitPrice?.toLocaleString("vi-VN")}đ
                                  </td>
                                  <td className="py-2.5 px-4 text-right pr-4 sm:pr-5 font-mono font-black text-slate-900">
                                    {item.cost?.toLocaleString("vi-VN")}đ
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 2. Nhóm chi phí cố định */}
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                    2. Chi phí cố định & Khấu trừ
                  </span>
                  <div className="border border-slate-100 rounded-md overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/40 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                          <th className="py-2 px-3 sm:px-4">Khoản phí</th>
                          <th className="py-2 px-4 text-center">Chu kỳ</th>
                          <th className="py-2 px-4 text-right pr-4 sm:pr-5">
                            Thành tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-[12px]">
                        {data?.invoice?.details
                          ?.filter(
                            (item: any) =>
                              item.type !== "WATER" && item.type !== "ELECTRIC",
                          )
                          ?.map((item: any, idx: number) => {
                            const isDeduction = item.type === "DEDUCTION";
                            return (
                              <tr
                                key={idx}
                                className="hover:bg-slate-50/30 transition-colors"
                              >
                                <td
                                  className={`py-2.5 px-3 sm:px-4 font-medium ${isDeduction ? "text-emerald-600 font-bold" : "text-slate-700"}`}
                                >
                                  {isDeduction ? "✨ " : "• "} {item.name}
                                </td>
                                <td className="py-2.5 px-4 text-center text-[10px] font-bold text-slate-400 uppercase">
                                  {isDeduction ? "Trừ quỹ" : "Tháng"}
                                </td>
                                <td
                                  className={`py-2.5 px-4 text-right pr-4 sm:pr-5 font-mono font-black ${isDeduction ? "text-emerald-600" : "text-slate-900"}`}
                                >
                                  {item.cost > 0 ? "" : "-"}
                                  {Math.abs(item.cost)?.toLocaleString("vi-VN")}
                                  đ
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>

                    {/* Hộp tổng kết hóa đơn dính liền đáy */}
                    <div className="flex justify-between items-center p-3.5 px-4 sm:px-5 bg-slate-900 font-black text-white">
                      <span className="text-[9px] uppercase tracking-widest opacity-70 font-medium">
                        Cư dân thực nộp kỳ này
                      </span>
                      <span className="text-xs sm:text-sm font-mono tracking-tight">
                        {data?.billingStatus === "UNPAID"
                          ? data?.invoice?.totalAmount?.toLocaleString("vi-VN")
                          : "0"}
                        đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GRID CÔNG TƠ MINI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ĐIỆN */}
              <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-white">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{" "}
                    Điện tiêu thụ
                  </p>
                  <b className="text-sm font-mono font-black text-slate-900">
                    {data?.invoice?.usage?.electricity?.total}{" "}
                    <span className="text-[9px] text-slate-400">kWh</span>
                  </b>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center bg-slate-50/50 py-1.5 rounded border border-slate-100 text-xs font-bold">
                  <div>
                    <span className="text-[8px] text-slate-400 block uppercase">
                      Cũ
                    </span>
                    {data?.invoice?.usage?.electricity?.oldIndex}
                  </div>
                  <div className="border-l border-slate-200">
                    <span className="text-[8px] text-slate-400 block uppercase">
                      Mới
                    </span>
                    {data?.invoice?.usage?.electricity?.newIndex}
                  </div>
                </div>
              </div>

              {/* NƯỚC */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white flex flex-col justify-between gap-3">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />{" "}
                    Nước sinh hoạt
                  </p>
                  <b className="text-sm font-mono font-black text-slate-900">
                    {data?.invoice?.usage?.water?.total}{" "}
                    <span className="text-[9px] text-slate-400">m³</span>
                  </b>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center bg-slate-50/50 py-1.5 rounded border border-slate-100 text-xs font-bold">
                  <div>
                    <span className="text-[8px] text-slate-400 block uppercase">
                      Cũ
                    </span>
                    {data?.invoice?.usage?.water?.oldIndex}
                  </div>
                  <div className="border-l border-slate-200">
                    <span className="text-[8px] text-slate-400 block uppercase">
                      Mới
                    </span>
                    {data?.invoice?.usage?.water?.newIndex}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= CỘT PHẢI: BẢNG TIN & HỒ SƠ ================= */}
          <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 bg-white h-fit min-w-0">
            {/* BẢNG TIN BAN QUẢN LÝ */}
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-900 tracking-wider">
                <Megaphone className="w-3.5 h-3.5" /> Bản tin tòa nhà
              </div>
              <div className="space-y-3.5 divide-y divide-slate-100 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between items-center gap-2">
                    <strong className="text-slate-900 font-black text-[11px] tracking-tight truncate">
                      Bảo trì PCCC định kỳ
                    </strong>
                    <span className="text-[8px] font-bold text-slate-400 flex items-center gap-0.5 shrink-0 uppercase">
                      <Calendar className="w-2.5 h-2.5" /> Hôm nay
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Hệ thống còi báo cháy hầm xe kiểm tra lúc 15h00 chiều nay.
                  </p>
                </div>
                <div className="space-y-1 pt-3">
                  <div className="flex justify-between items-center gap-2">
                    <strong className="text-red-600 font-black text-[11px] tracking-tight flex items-center gap-1 truncate">
                      <ShieldAlert className="w-3 h-3" /> Làn đỗ xe tầng hầm
                    </strong>
                    <span className="text-[8px] font-bold text-slate-400 flex items-center gap-0.5 shrink-0 uppercase">
                      <Calendar className="w-2.5 h-2.5" /> 24/05
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Yêu cầu cư dân đỗ xe máy đúng vạch quy định, tránh lối sạc
                    điện.
                  </p>
                </div>
              </div>
            </div>

            {/* TÁC VỤ NHANH */}
            <div className="p-4 sm:p-5 space-y-2 bg-slate-50/30">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Hỗ trợ nhanh
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button className="h-8 bg-white border border-slate-200 hover:border-slate-400 rounded text-[10px] font-bold uppercase text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                  <Wrench className="w-3 h-3 text-slate-400" /> Báo hỏng
                </button>
                <button className="h-8 bg-white border border-slate-200 hover:border-slate-400 rounded text-[10px] font-bold uppercase text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                  <Sparkles className="w-3 h-3 text-slate-400" /> Đăng ký DV
                </button>
              </div>
            </div>

            {/* HỒ SƠ PHÒNG */}
            <div className="p-4 sm:p-5 space-y-2.5">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Thông tin lưu trú
              </p>
              <div className="space-y-1 text-xs font-medium text-slate-700">
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400 text-[10px] font-bold uppercase">
                    Chủ hộ
                  </span>
                  <span className="font-black text-slate-900 text-[11px]">
                    {data?.resident}
                  </span>
                </div>
                {data?.assets?.vehicles?.map((v, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1 border-b border-slate-50"
                  >
                    <span className="text-slate-400 flex items-center gap-1 text-[10px] font-bold uppercase">
                      <Bike className="w-3 h-3" />{" "}
                      {v.type?.split(" ")?.[2] || "Xe"}
                    </span>
                    <span className="font-mono font-black text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                      {v.plate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ================= DIALOG VIETQR FLAT CHUẨN BAN KING ================= */}
      <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-sm bg-white rounded-lg border border-slate-200 p-5 flex flex-col items-center text-center shadow-2xl">
          <DialogHeader className="w-full border-b border-slate-100 pb-3 items-center">
            <DialogTitle className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-slate-900" /> Cổng thanh toán
              Napas
            </DialogTitle>
            <DialogDescription className="text-[11px] text-slate-400 font-medium mt-0.5">
              Hệ thống tự động quét đối soát qua Webhook tức thời.
            </DialogDescription>
          </DialogHeader>

          <div className="my-3 p-4 border border-slate-100 rounded-md bg-slate-50 w-full flex flex-col items-center">
            {data?.invoice?.qrUrl && (
              <img
                src={data.invoice.qrUrl}
                alt="VietQR Payment"
                className="w-full h-auto max-w-40 max-h-40 object-contain rounded bg-white p-2 border border-slate-200/60"
              />
            )}
            <p className="text-[11px] font-mono font-black text-slate-900 mt-3 bg-white px-3 py-1 rounded border border-slate-200">
              Thực nhận: {data?.invoice?.totalAmount?.toLocaleString("vi-VN")}đ
            </p>
          </div>

          <div className="w-full border border-slate-100 rounded-md p-3 text-left space-y-2 text-[11px] bg-white">
            <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
              <span className="text-slate-400 font-bold uppercase tracking-tight">
                Ngân hàng:
              </span>
              <span className="text-slate-800 font-black">
                MB BANK (Quân Đội)
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
              <span className="text-slate-400 font-bold uppercase tracking-tight">
                Số tài khoản:
              </span>
              <button
                type="button"
                onClick={() => handleCopyField("0987654321", "số tài khoản")}
                className="text-slate-900 font-black flex items-center gap-1 font-mono hover:underline"
              >
                0987654321 <Copy className="w-3 h-3 text-slate-400" />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold uppercase tracking-tight">
                Nội dung CK:
              </span>
              <button
                type="button"
                onClick={() =>
                  handleCopyField(
                    data?.invoice?.rawDescription || "",
                    "nội dung",
                  )
                }
                className="text-slate-900 font-black flex items-center gap-1 font-mono hover:underline"
              >
                {data?.invoice?.rawDescription}{" "}
                <Copy className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="w-full flex gap-2 pt-3 border-t border-slate-100 mt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsQrOpen(false)}
              className="flex-1 h-9 text-[10px] font-black uppercase border-slate-200 text-slate-400 rounded"
            >
              Hủy bỏ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
