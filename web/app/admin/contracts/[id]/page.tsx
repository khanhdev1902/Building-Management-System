"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  User,
  CheckCircle2,
  Printer,
  History,
  AlertTriangle,
  Receipt,
  Package,
  ArrowUpRight,
  Users,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
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
import { contractApi } from "../new/apis/contracts.api";
import { ContractDetail } from "./types/contract.type";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function ContractDetailPage() {
  const [activeTab, setActiveTab] = useState<"legal" | "billing" | "assets">(
    "legal",
  );
  const [data, setData] = useState<ContractDetail>();
  const params2 = useParams();
  const id = params2.id as string;

  const getData = async () => {
    try {
      const res = await contractApi.getContractById(id);
      console.log(res);
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const timeProgress = useMemo(() => {
    if (!data?.startDate || !data?.endDate) return 0;

    const start = new Date(data.startDate).getTime();
    const end = new Date(data.endDate).getTime();

    if (Number.isNaN(start) || Number.isNaN(end)) return 0;

    const current = Date.now();

    return Math.min(
      Math.max(Math.round(((current - start) / (end - start)) * 100), 0),
      100,
    );
  }, [data]);

  const handleDownloadContract = async (id: string) => {
    try {
      const blob = await contractApi.exportContractPdf(id);
      console.log(blob);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contract-${id.slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success(`Đã xuất hợp đồng PDF cho chứng từ ${id.slice(0, 10)}!`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-5 bg-slate-50/20 min-h-screen antialiased selection:bg-indigo-50">
      {/* 1. Nút Back & Thanh điều hướng Top-bar */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 select-none">
        <div className="flex items-center gap-3">
          <Link href="/admin/contracts">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-500 border border-slate-200/60 bg-white hover:bg-slate-50"
            >
              <ArrowLeft size={14} className="stroke-2" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400">
              {data?.id}
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-800">
              Chi tiết hồ sơ pháp lý phòng {data?.roomNumber}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"
        >
          <span className="h-1.2 w-1.2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
          Hợp đồng đang chạy
        </Badge>
      </div>

      {/* LAYOUT CHÍNH SPLIT-GRID (8:4 hoặc 9:3 diện tích) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* CỘT TRÁI (LỚN): NỘI DUNG CHI TIẾT CHIA TAB */}
        <div className="lg:col-span-8 space-y-4">
          {/* Thanh chuyển đổi Tab dẹt cao cấp */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/40 w-fit h-9 items-center select-none">
            <button
              onClick={() => setActiveTab("legal")}
              className={`h-7 px-4 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${activeTab === "legal" ? "bg-white shadow-2xs text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
            >
              <FileText size={13} className="stroke-[1.8]" /> Hồ sơ & Nhân khẩu
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`h-7 px-4 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${activeTab === "billing" ? "bg-white shadow-2xs text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
            >
              <Receipt size={13} className="stroke-[1.8]" /> Sổ gốc hóa đơn
            </button>
            <button
              onClick={() => setActiveTab("assets")}
              className={`h-7 px-4 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${activeTab === "assets" ? "bg-white shadow-2xs text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
            >
              <Package size={13} className="stroke-[1.8]" /> Hiện trạng tài sản
            </button>
          </div>

          {/* TAB 1: HỒ SƠ PHÁP LÝ & NHÂN KHẨU */}
          {activeTab === "legal" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-200">
              {/* Khối Thông tin đại diện chủ hộ */}
              <div className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <User size={14} className="text-slate-400" /> Chủ thể đứng
                    tên hợp đồng
                  </h3>
                  {data?.primaryTenant.identityVerified && (
                    <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck size={12} /> Đã đối chiếu CCCD gốc
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <Avatar className="h-12 w-12 border border-slate-100 rounded-lg shadow-2xs shrink-0">
                    <AvatarFallback className="bg-slate-100 text-slate-700 text-xs font-bold">
                      {data?.primaryTenant.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-5 w-full text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-medium">
                        Họ và tên
                      </span>
                      <span className="font-bold text-slate-800">
                        {data?.primaryTenant.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-medium">
                        Số điện thoại
                      </span>
                      <span className="font-mono font-semibold text-slate-800">
                        {data?.primaryTenant.phone}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-medium">
                        Số định danh cá nhân
                      </span>
                      <span className="font-mono font-semibold text-slate-700">
                        {data?.primaryTenant.cccd}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-medium">
                        Hộ khẩu thường trú
                      </span>
                      <span className="font-semibold text-slate-700">
                        {data?.primaryTenant.hometown}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Khối quản lý thành viên ở cùng & Biển số xe */}
              <div className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
                  <Users size={14} className="text-slate-400" /> Nhân khẩu tạm
                  trú đi kèm ({data?.occupants.length} thành viên)
                </h3>
                <Table>
                  <TableHeader className="bg-slate-50/50 border-b border-slate-100/60">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-3 py-2">
                        Họ và tên thành viên
                      </TableHead>
                      <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2">
                        Số định danh CCCD
                      </TableHead>
                      <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2">
                        Số điện thoại
                      </TableHead>
                      <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2">
                        Ngày sinh
                      </TableHead>
                      <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 font-mono">
                        Quê quán
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-100/60 text-xs">
                    {data?.occupants.map((occ, index) => (
                      <TableRow key={index} className="hover:bg-slate-50/30">
                        <TableCell className="font-semibold text-slate-800 pl-3 py-2.5">
                          {occ.name}
                        </TableCell>
                        <TableCell className="font-mono text-slate-600 py-2.5">
                          {occ.cccd}
                        </TableCell>
                        <TableCell className="text-slate-500 font-medium py-2.5">
                          {occ.phone || "Chưa có"}
                        </TableCell>
                        <TableCell className="text-slate-500 font-medium py-2.5">
                          {occ.dateOfBirth || "Chưa có"}
                        </TableCell>
                        <TableCell className="py-2.5">
                          <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold uppercase text-[10px] border border-slate-200/40">
                            {occ.hometownAddress || "chưa có"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Khối định mức dịch vụ & Chỉ số nền công tơ gốc */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2">
                    Định mức phí dịch vụ áp dụng
                  </h3>
                  <div className="space-y-2">
                    {data?.services.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs p-2 border border-dashed border-slate-100 rounded-lg"
                      >
                        <div className="flex items-center gap-2 font-semibold text-slate-700">
                          {/* {s.icon} */}
                          <span>{s.name}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-800">
                          {s.price.toLocaleString("vi-VN")}đ
                          <span className="text-slate-400 font-sans font-normal text-[10px]">
                            /{s.unit}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-3.5">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2">
                    Chỉ số công tơ nền bàn giao
                  </h3>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Chỉ số Điện gốc
                      </span>
                      <span className="text-lg font-bold font-mono text-slate-800 tracking-tight">
                        {data?.initialCounters.electric}{" "}
                        <span className="text-xs text-slate-400 font-sans font-normal">
                          kWh
                        </span>
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Chỉ số Nước gốc
                      </span>
                      <span className="text-lg font-bold font-mono text-slate-800 tracking-tight">
                        {data?.initialCounters.water}{" "}
                        <span className="text-xs text-slate-400 font-sans font-normal">
                          m³
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5 text-[10px] text-slate-400 font-medium leading-normal">
                    <CheckCircle2
                      size={12}
                      className="text-slate-400 mt-0.5 shrink-0"
                    />
                    <span>
                      Mọi hóa đơn dịch vụ hàng tháng sẽ lấy chỉ số này làm mốc
                      nền đối trừ đầu tiên.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SỔ GỐC HOÁ ĐƠN CÔNG NỢ */}
          {activeTab === "billing" && (
            <div className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-3 animate-in fade-in slide-in-from-bottom-1 duration-200">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2.5">
                Lịch sử phát sinh hóa đơn tiền nhà & Dịch vụ liên kết
              </h3>
              <Table>
                <TableHeader className="bg-slate-50/50 border-b border-slate-100/60">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-3 py-2">
                      Mã hóa đơn
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2">
                      Kỳ chu kỳ thu
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-right py-2">
                      Tổng giá trị thu
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-center py-2">
                      Trạng thái thanh toán
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 font-mono">
                      Ngày ghi nhận tiền
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100/60 text-xs">
                  {data?.billingHistory.map((bill, index) => (
                    <TableRow key={index} className="hover:bg-slate-50/30">
                      <TableCell className="font-mono font-semibold text-slate-500 pl-3 py-3">
                        {bill.invoiceId}
                      </TableCell>
                      <TableCell className="font-bold text-slate-800 py-3">
                        {bill.month}
                      </TableCell>
                      <TableCell className="font-bold text-slate-900 text-right font-mono py-3">
                        {bill.amount.toLocaleString("vi-VN")} đ
                      </TableCell>
                      <TableCell className="text-center py-3">
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-100 rounded px-2 py-0.5 text-[10px] font-medium cursor-default"
                        >
                          Đã khớp tiền
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-slate-400 py-3">
                        {bill.paidDate.split("-").reverse().join("/")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* TAB 3: HIỆN TRẠNG TÀI SẢN BÀN GIAO */}
          {activeTab === "assets" && (
            <div className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-3 animate-in fade-in slide-in-from-bottom-1 duration-200">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2.5">
                Biên bản bàn giao kiểm kê hiện trạng đồ đạc nội thất phòng
              </h3>
              <Table>
                <TableHeader className="bg-slate-50/50 border-b border-slate-100/60">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-3 py-2">
                      Tên vật tư tài sản bàn giao
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-center py-2 w-[15%]">
                      Số lượng
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 w-[55%]">
                      Mô tả chi tiết tình trạng cơ sở vật chất
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100/60 text-xs">
                  {data?.assets.map((asset, index) => (
                    <TableRow key={index} className="hover:bg-slate-50/30">
                      <TableCell className="font-bold text-slate-800 pl-3 py-3">
                        {asset.name}
                      </TableCell>
                      <TableCell className="font-mono font-bold text-slate-700 text-center py-3">
                        {asset.quantity}
                      </TableCell>
                      <TableCell className="text-slate-500 font-medium py-3 italic">
                        {asset.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* ============================================================ */}

        {/* CỘT PHẢI (NHỎ): TRUNG TÂM NGHIỆP VỤ & LỊCH SỬ TIMELINE */}
        <div className="lg:col-span-4 space-y-4">
          {/* Hộp quản trị tác vụ pháp lý */}
          <div className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2">
              Trung tâm tác vụ hợp đồng
            </h3>

            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">
                  Giá trị tiền thuê nhà:
                </span>
                <span className="font-bold text-slate-900 font-mono">
                  {data?.rentPrice.toLocaleString("vi-VN")} đ / tháng
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">
                  Quỹ tiền đặt cọc giữ:
                </span>
                <span className="font-bold text-indigo-600 font-mono">
                  {data?.deposit.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">
                  Chu kỳ đóng tiền:
                </span>
                <span className="font-semibold text-slate-700">
                  {data?.paymentCycle}
                </span>
              </div>

              {/* Dải tiến độ thời gian thực dạng kén nhỏ */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-medium font-mono text-slate-500">
                  <span>
                    Hạn:{" "}
                    {data?.startDate.toLocaleDateString("vi-VN").split("-").reverse().slice(1).join("/")}
                  </span>
                  <span className="text-slate-800 font-bold">
                    Đã trôi qua {timeProgress}%
                  </span>
                  <span>
                    Hết: {data?.endDate.toLocaleDateString("vi-VN").split("-").reverse().slice(1).join("/")}
                  </span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-500"
                    style={{ width: `${timeProgress}%` }}
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* Hệ thống cụm nút bấm nghiệp vụ lì, phẳng h-9 */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => handleDownloadContract(id)}
                variant="outline"
                className="w-full h-9 justify-start text-xs text-slate-700 border-slate-200/80 shadow-2xs font-semibold gap-2 hover:bg-slate-50"
              >
                <Printer size={13} className="text-slate-400 stroke-[1.8]" />{" "}
                Xuất bản cứng hợp đồng (PDF)
              </Button>
              <Button
                variant="outline"
                className="w-full h-9 justify-start text-xs text-slate-700 border-slate-200/80 shadow-2xs font-semibold gap-2 hover:bg-slate-50"
              >
                <ArrowUpRight
                  size={13}
                  className="text-slate-400 stroke-[1.8]"
                />{" "}
                Gia hạn phụ lục hợp đồng mới
              </Button>
              <Button
                variant="ghost"
                className="w-full h-9 justify-start text-xs text-rose-600 font-semibold gap-2 hover:bg-rose-50/50 border border-dashed border-rose-100 rounded-lg"
              >
                <AlertTriangle size={13} className="stroke-[1.8]" /> Kích hoạt
                thanh lý hợp đồng trước hạn
              </Button>
            </div>
          </div>

          {/* Hộp dòng thời gian - Audit Log / Timeline hệ thống */}
          <div className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <History size={14} className="text-slate-400" /> Nhật ký biến động
              chứng từ
            </h3>

            <div className="space-y-4 pl-1.5 relative before:absolute before:left-1.25 before:top-2 before:bottom-2 before:w-px before:bg-slate-200/70 select-none">
              {data?.timeline.map((log, index) => (
                <div
                  key={index}
                  className="flex gap-3 relative items-start text-xs"
                >
                  {/* Chấm tròn định vị trục dọc của timeline */}
                  <div className="h-2 w-2 rounded-full bg-slate-300 border border-white ring-2 ring-slate-50 mt-1 z-10 shrink-0" />
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-semibold text-slate-800 tracking-tight leading-normal">
                      {log.action}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium font-mono">
                      <span>{log.date}</span>
                      <span>•</span>
                      <span className="font-sans font-normal text-slate-500">
                        {log.user}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* HẾT SPLIT-GRID */}
      </div>
    </div>
  );
}
