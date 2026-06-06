"use client";

import React, { useEffect, useState, useMemo } from "react";
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
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
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

// COMPONENT KHUNG XƯƠNG (SKELETON) ĐỂ TÁI CẤU TRÚC TRỰC QUAN KHÔNG GIAN
function ContractDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start animate-pulse">
      {/* Cột trái (8 phần) */}
      <div className="lg:col-span-8 space-y-4">
        {/* Tab switcher skeleton */}
        <div className="h-9 w-80 bg-slate-200/70 rounded-lg" />

        {/* Main profile card skeleton */}
        <div className="border border-slate-200/60 bg-white rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-5 bg-slate-200 rounded w-32" />
          </div>
          <div className="flex gap-5 items-center">
            <div className="h-12 w-12 bg-slate-200 rounded-lg shrink-0" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-2.5 bg-slate-200/70 rounded w-1/2" />
                  <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table list skeleton */}
        <div className="border border-slate-200/60 bg-white rounded-xl p-5 space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/3 border-b border-slate-100 pb-2" />
          <div className="space-y-2.5">
            <div className="h-8 bg-slate-100 rounded w-full" />
            <div className="h-8 bg-slate-200/60 rounded w-full" />
            <div className="h-8 bg-slate-200/60 rounded w-full" />
          </div>
        </div>
      </div>

      {/* Cột phải (4 phần) */}
      <div className="lg:col-span-4 space-y-4">
        {/* Action center skeleton */}
        <div className="border border-slate-200/60 bg-white rounded-xl p-5 space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/2 border-b border-slate-100 pb-2" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-3 bg-slate-200 rounded w-1/3" />
              <div className="h-3 bg-slate-200 rounded w-1/3" />
            </div>
            <div className="flex justify-between">
              <div className="h-3 bg-slate-200 rounded w-1/3" />
              <div className="h-3 bg-slate-200 rounded w-1/4" />
            </div>
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between">
                <div className="h-2.5 bg-slate-100 rounded w-1/4" />
                <div className="h-2.5 bg-slate-100 rounded w-1/4" />
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full w-full" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-9 bg-slate-200/70 rounded-lg w-full" />
            <div className="h-9 bg-slate-200/70 rounded-lg w-full" />
          </div>
        </div>

        {/* Timeline history skeleton */}
        <div className="border border-slate-200/60 bg-white rounded-xl p-5 space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="space-y-4 pl-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-slate-200 mt-1 shrink-0" />
                <div className="space-y-1.5 w-full">
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-2 bg-slate-150 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContractDetailPage() {
  const [activeTab, setActiveTab] = useState<"legal" | "billing" | "assets">(
    "legal",
  );
  const [data, setData] = useState<ContractDetail>();
  const [isLoading, setIsLoading] = useState(true); // Cấu hình trạng thái loading kiểm soát vòng đời dòng dữ liệu
  const params2 = useParams();
  const id = params2.id as string;

  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await contractApi.getContractById(id);
      setData(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Không thể tải thông tin chi tiết chứng từ");
    } finally {
      setIsLoading(false);
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
      toast.error("Lỗi xuất file chứng từ PDF");
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
              className="h-8 w-8 rounded-lg text-slate-500 border border-slate-200/60 bg-white hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft size={14} className="stroke-2" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="h-4 bg-slate-200 rounded w-36 animate-pulse" />
            ) : (
              <>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {data?.id?.slice(0, 8)}...
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-slate-800">
                  Chi tiết hồ sơ pháp lý phòng {data?.roomNumber}
                </span>
              </>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="h-5 bg-slate-200 rounded-full w-28 animate-pulse" />
        ) : (
          (() => {
            // 1. Định nghĩa cấu hình UI cho từng trạng thái
            const statusConfig: Record<
              string,
              {
                label: string;
                containerClass: string;
                dotClass: string;
                shadowClass: string;
              }
            > = {
              ACTIVE: {
                label: "Hợp đồng đang chạy",
                containerClass:
                  "bg-emerald-50 text-emerald-700 border-emerald-200/80",
                dotClass: "bg-emerald-500",
                shadowClass: "shadow-[0_0_6px_rgba(16,185,129,0.5)]",
              },
              EXPIRING: {
                label: "Sắp hết hiệu lực",
                containerClass:
                  "bg-amber-50 text-amber-700 border-amber-200/80",
                dotClass: "bg-amber-500",
                shadowClass: "shadow-[0_0_6px_rgba(245,158,11,0.5)]",
              },
              EXPIRED: {
                label: "Đã kết thúc",
                containerClass:
                  "bg-slate-50 text-slate-600 border-slate-200/80",
                dotClass: "bg-slate-400",
                shadowClass: "shadow-[0_0_6px_rgba(148,163,184,0.4)]",
              },
            };

            // 2. Lấy config theo status thực tế từ API
            const currentStatus = data?.status || "ACTIVE";
            const config = statusConfig[currentStatus] || statusConfig.ACTIVE;

            return (
              <Badge
                variant="outline"
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all select-none ${config.containerClass}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${config.dotClass} ${config.shadowClass}`}
                />
                {config.label}
              </Badge>
            );
          })() // Nhớ cặp ngoặc này để hàm tự thực thi và trả về Component luôn nhé!
        )}
      </div>

      {/* 2. KHU VỰC ĐIỀU HƯỚNG DỮ LIỆU CHÍNH */}
      {isLoading ? (
        <ContractDetailSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start animate-in fade-in duration-300">
          {/* CỘT TRÁI (LỚN): NỘI DUNG CHI TIẾT CHIA TAB */}
          <div className="lg:col-span-8 space-y-4">
            {/* Thanh chuyển đổi Tab */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/40 w-fit h-9 items-center select-none">
              <button
                onClick={() => setActiveTab("legal")}
                className={`h-7 px-4 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "legal" ? "bg-white shadow-2xs text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
              >
                <FileText size={13} className="stroke-[1.8]" /> Hồ sơ & Nhân
                khẩu
              </button>
              <button
                onClick={() => setActiveTab("billing")}
                className={`h-7 px-4 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "billing" ? "bg-white shadow-2xs text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
              >
                <Receipt size={13} className="stroke-[1.8]" /> Sổ gốc hóa đơn
              </button>
              <button
                onClick={() => setActiveTab("assets")}
                className={`h-7 px-4 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "assets" ? "bg-white shadow-2xs text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
              >
                <Package size={13} className="stroke-[1.8]" /> Hiện trạng tài
                sản
              </button>
            </div>

            {/* TAB 1: HỒ SƠ PHÁP LÝ & NHÂN KHẨU */}
            {activeTab === "legal" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-200">
                <div className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                      <User size={14} className="text-slate-400" /> Chủ thể đứng
                      tên hợp đồng
                    </h3>
                    {data?.primaryTenant?.identityVerified && (
                      <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <ShieldCheck size={12} /> Đã đối chiếu CCCD gốc
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <Avatar className="h-12 w-12 border border-slate-100 rounded-lg shadow-2xs shrink-0">
                      <AvatarFallback className="bg-slate-100 text-slate-700 text-xs font-bold">
                        {data?.primaryTenant?.name
                          ?.substring(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-5 w-full text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] font-medium">
                          Họ và tên
                        </span>
                        <span className="font-bold text-slate-800">
                          {data?.primaryTenant?.name}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-medium">
                          Số điện thoại
                        </span>
                        <span className="font-mono font-semibold text-slate-800">
                          {data?.primaryTenant?.phone}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-medium">
                          CCCD/Định danh
                        </span>
                        <span className="font-mono font-semibold text-slate-700">
                          {data?.primaryTenant?.cccd}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-medium">
                          Hộ khẩu thường trú
                        </span>
                        <span className="font-semibold text-slate-700">
                          {data?.primaryTenant?.hometown}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Khối quản lý thành viên ở cùng */}
                <div className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
                    <Users size={14} className="text-slate-400" /> Nhân khẩu tạm
                    trú đi kèm ({data?.occupants?.length || 0} thành viên)
                  </h3>
                  <Table>
                    <TableHeader className="bg-slate-50/50 border-b border-slate-100/60">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-3 py-2">
                          Họ và tên
                        </TableHead>
                        <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2">
                          Số CCCD
                        </TableHead>
                        <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2">
                          Số điện thoại
                        </TableHead>
                        <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2">
                          Ngày sinh
                        </TableHead>
                        <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2">
                          Quê quán
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-slate-100/60 text-xs">
                      {data?.occupants?.map((occ, index) => (
                        <TableRow key={index} className="hover:bg-slate-50/30">
                          <TableCell className="font-semibold text-slate-800 pl-3 py-2.5">
                            {occ.name}
                          </TableCell>
                          <TableCell className="font-mono text-slate-600 py-2.5">
                            {occ.cccd}
                          </TableCell>
                          <TableCell className="text-slate-500 font-medium py-2.5">
                            {occ.phone || "---"}
                          </TableCell>
                          <TableCell className="text-slate-500 font-medium py-2.5">
                            {occ.dateOfBirth || "---"}
                          </TableCell>
                          <TableCell className="py-2.5">
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold uppercase text-[10px] border border-slate-200/40">
                              {occ.hometownAddress || "---"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Khối định mức dịch vụ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2">
                      Định mức phí dịch vụ áp dụng
                    </h3>
                    <div className="space-y-2">
                      {data?.services?.map((s, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs p-2 border border-dashed border-slate-100 rounded-lg"
                        >
                          <span className="font-semibold text-slate-700">
                            {s.name}
                          </span>
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
                          {data?.initialCounters?.electric}{" "}
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
                          {data?.initialCounters?.water}{" "}
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
                        đối trừ đầu tiên.
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
                  Lịch sử phát sinh hóa đơn công nợ
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
                        Trạng thái
                      </TableHead>
                      <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2">
                        Ngày thanh toán
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-100/60 text-xs">
                    {data?.billingHistory?.map((bill, index) => (
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
                            className="bg-emerald-50 text-emerald-700 border-emerald-100 rounded px-2 py-0.5 text-[10px] font-medium"
                          >
                            Đã khớp tiền
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-slate-400 py-3">
                          {bill.paidDate
                            ? new Date(bill.paidDate).toLocaleDateString(
                                "vi-VN",
                              )
                            : "---"}
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
                  Biên bản bàn giao kiểm kê hiện trạng đồ đạc
                </h3>
                <Table>
                  <TableHeader className="bg-slate-50/50 border-b border-slate-100/60">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-3 py-2">
                        Tên vật tư tài sản
                      </TableHead>
                      <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-center py-2 w-[15%]">
                        Số lượng
                      </TableHead>
                      <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 w-[55%]">
                        Mô tả chi tiết tình trạng
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-100/60 text-xs">
                    {data?.assets?.map((asset, index) => (
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

          {/* CỘT PHẢI (NHỎ): TRUNG TÂM NGHIỆP VỤ & LỊCH SỬ TIMELINE */}
          <div className="lg:col-span-4 space-y-4">
            {/* Hộp quản trị tác vụ */}
            <div className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2">
                Trung tâm tác vụ hợp đồng
              </h3>
              <div className="space-y-3 font-sans text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">
                    Tiền thuê nhà:
                  </span>
                  <span className="font-bold text-slate-900 font-mono">
                    {data?.rentPrice?.toLocaleString("vi-VN")} đ / tháng
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">
                    Tiền đặt cọc:
                  </span>
                  <span className="font-bold text-indigo-600 font-mono">
                    {data?.deposit?.toLocaleString("vi-VN")} đ
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
                      {data?.startDate
                        ? new Date(data.startDate).toLocaleDateString("vi-VN")
                        : "---"}
                    </span>
                    <span className="text-slate-800 font-bold">
                      Đã trôi qua {timeProgress}%
                    </span>
                    <span>
                      Hết:{" "}
                      {data?.endDate
                        ? new Date(data.endDate).toLocaleDateString("vi-VN")
                        : "---"}
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

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => handleDownloadContract(id)}
                  variant="outline"
                  className="w-full h-9 justify-start text-xs text-slate-700 border-slate-200/80 shadow-2xs font-semibold gap-2 hover:bg-slate-50 cursor-pointer"
                >
                  <Printer size={13} className="text-slate-400 stroke-[1.8]" />{" "}
                  Xuất bản cứng hợp đồng (PDF)
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-9 justify-start text-xs text-slate-700 border-slate-200/80 shadow-2xs font-semibold gap-2 hover:bg-slate-50 cursor-pointer"
                >
                  <ArrowUpRight
                    size={13}
                    className="text-slate-400 stroke-[1.8]"
                  />{" "}
                  Gia hạn phụ lục hợp đồng mới
                </Button>
                <Button
                  variant="ghost"
                  className="w-full h-9 justify-start text-xs text-rose-600 font-semibold gap-2 hover:bg-rose-50/50 border border-dashed border-rose-100 rounded-lg cursor-pointer"
                >
                  <AlertTriangle size={13} className="stroke-[1.8]" /> Kích hoạt
                  thanh lý hợp đồng trước hạn
                </Button>
              </div>
            </div>

            {/* Hộp dòng thời gian - Timeline */}
            <div className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <History size={14} className="text-slate-400" /> Nhật ký biến
                động chứng từ
              </h3>
              <div className="space-y-4 pl-1.5 relative before:absolute before:left-1.25 before:top-2 before:bottom-2 before:w-px before:bg-slate-200/70 select-none">
                {data?.timeline?.map((log, index) => (
                  <div
                    key={index}
                    className="flex gap-3 relative items-start text-xs"
                  >
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
        </div>
      )}
    </div>
  );
}
