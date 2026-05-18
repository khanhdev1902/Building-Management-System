/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FileText,
  Printer,
  History,
  AlertTriangle,
  ArrowUpRight,
  Eye,
  Briefcase,
  Search,
  SearchX,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { contractHistorys } from "../../data-contract";
import Link from "next/link";

interface ContractTabProps {
  room: {
    roomNumber: string;
    price: number;
    deposit: number;
    contract: {
      id: string;
      duration: string;
      expiryDate: string;
      status: string;
    };
    tenant: {
      representative: {
        name: string;
        startDate: string;
      };
    };
  };
}

const ITEMS_PER_PAGE = 3;

export function ContractTab({ room }: ContractTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "expired" | "terminated"
  >("all");
  const [selectedContractId, setSelectedContractId] = useState(
    room.contract.id,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập luồng API Gateway Fetching dữ liệu mượt mà khi tương tác bộ lọc
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, statusFilter]);

  // Import bộ dữ liệu mở rộng 20 bản ghi thực chiến từ file data-contract của anh
  //   const contractHistorys = [
  //     {
  //       id: room.contract.id,
  //       representative: room.tenant.representative.name,
  //       price: room.price,
  //       deposit: room.deposit,
  //       startDate: room.tenant.representative.startDate,
  //       endDate: room.contract.expiryDate,
  //       duration: room.contract.duration,
  //       status: "active",
  //       paymentStatus: "holding",
  //       terminationReason: "—",
  //       fileName: "BienBanHopDong_KySo_A101_2026.pdf",
  //       fileSize: "2.4 MB",
  //     },
  //     {
  //       id: "DJ-2025-A101",
  //       representative: "Trần Minh Tâm",
  //       price: 6000000,
  //       deposit: 12000000,
  //       startDate: "15/01/2025",
  //       endDate: "15/01/2026",
  //       duration: "12 tháng",
  //       status: "expired",
  //       paymentStatus: "refunded",
  //       terminationReason: "Hết hạn hợp đồng - Chuyển công tác",
  //       fileName: "HopDong_ThanhLy_TranMinhTam_2025.pdf",
  //       fileSize: "2.1 MB",
  //     },
  //     {
  //       id: "DJ-2025-A101-EXT",
  //       representative: "Lê Thị Hồng",
  //       price: 6200000,
  //       deposit: 12400000,
  //       startDate: "01/06/2025",
  //       endDate: "01/12/2025",
  //       duration: "6 tháng",
  //       status: "expired",
  //       paymentStatus: "refunded",
  //       terminationReason: "Hết hạn hợp đồng - Mua nhà riêng",
  //       fileName: "PhuLuc_GiaHan_LeThiHong_2025.pdf",
  //       fileSize: "1.9 MB",
  //     },
  //     {
  //       id: "DJ-2024-A101",
  //       representative: "Lê Văn Cường",
  //       price: 5800000,
  //       deposit: 11600000,
  //       startDate: "01/06/2024",
  //       endDate: "10/11/2024",
  //       duration: "6 tháng",
  //       status: "terminated",
  //       paymentStatus: "forfeited",
  //       terminationReason: "Thanh lý trước hạn - Vi phạm cam kết thời gian",
  //       fileName: "PhuLuc_PhatCoc_LeVanCuong_2024.pdf",
  //       fileSize: "1.8 MB",
  //     },
  //   ];

  // 1. Luồng xử lý COMPUTED STATE bộ lọc tập trung
  const filteredContracts = useMemo(() => {
    return contractHistorys.filter((con) => {
      const matchesSearch =
        con.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        con.representative.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || con.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  // 2. Thuật toán cắt lát phân trang
  const totalPages = Math.ceil(filteredContracts.length / ITEMS_PER_PAGE) || 1;
  const paginatedContracts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredContracts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredContracts, currentPage]);

  const currentSelectedContract = useMemo(() => {
    return (
      contractHistorys.find((c) => c.id === selectedContractId) ||
      contractHistorys[0]
    );
  }, [selectedContractId]);

  const contractLogs: Record<
    string,
    Array<{ time: string; user: string; action: string }>
  > = {
    "DJ-2026-A101": [
      {
        time: "15/02/2026 11:00",
        user: "Minh Tuấn (Kỹ thuật)",
        action:
          "Bàn giao thiết thiết bị nội thất & Kích hoạt vân tay cổng ra vào",
      },
      {
        time: "15/02/2026 10:15",
        user: "Hệ thống (Auto)",
        action: "Đã khớp lệnh thu đủ tiền quỹ cọc bảo lưu phòng",
      },
      {
        time: "12/02/2026 09:30",
        user: "Khánh Nguyễn (Manager)",
        action: "Khởi tạo phôi hợp đồng điện tử thành công",
      },
    ],
    "DJ-2025-A101": [
      {
        time: "15/01/2026 14:00",
        user: "Văn Hải (Trực ban)",
        action: "Nghiệm thu mặt bằng sạch sẽ, hoàn trả cọc gốc",
      },
    ],
  };

  return (
    <div className="p-5 divide-y divide-slate-100/70 font-sans bg-white antialiased animate-in fade-in duration-300">
      {/* SECTION 1: SỔ CÁI VÀ TOOLBAR BỘ LỌC DẸT PHẲNG */}
      <section className="pb-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center select-none">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Briefcase size={14} className="text-slate-400" /> Sổ gốc lưu trữ
              danh mục hồ sơ hợp đồng hành chính
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Theo dõi vòng đời tạm trú, lịch sử hoàn trả cọc và lý do biến động
              của căn hộ #{room.roomNumber}.
            </p>
          </div>
          <Badge
            variant="outline"
            className="bg-slate-50 border-slate-200 text-slate-600 text-[10px] font-bold rounded px-2 h-5"
          >
            {contractHistorys.length} CHỨNG TỪ GỐC
          </Badge>
        </div>

        {/* Cụm công cụ tìm kiếm và Tab trạng thái phẳng dẹt cao h-8 */}
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-center select-none bg-slate-50/60 p-2.5 rounded-xl border border-slate-200/60">
          <div className="relative w-full lg:w-64 group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm số hợp đồng, tên cư dân..."
              className="pl-7.5 h-7.5 text-[11px] bg-white border-slate-200 focus-visible:border-slate-400 focus-visible:ring-0 rounded-md placeholder:font-normal"
            />
          </div>

          <div className="flex bg-slate-200/50 p-0.5 rounded-md w-full lg:w-auto h-7.5 items-center border border-slate-200/40">
            {[
              { key: "all", label: "Tất cả các đời" },
              { key: "active", label: "Đang hoạt động" },
              { key: "expired", label: "Đã tất toán" },
              { key: "terminated", label: "Thanh lý sớm" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setStatusFilter(t.key as any);
                  setCurrentPage(1);
                }}
                className={`h-6.5 px-3 rounded-sm text-[10px] font-bold transition-all cursor-pointer ${statusFilter === t.key ? "bg-white shadow-3xs text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bảng kê danh sách nén chặt mật độ thông tin */}
        <div className="rounded-xl border border-slate-200/60 overflow-hidden bg-white flex flex-col min-h-55">
          <Table>
            <TableHeader className="bg-slate-50/30 border-b border-slate-100 select-none">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-4 py-2 w-[15%]">
                  Mã hợp đồng
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 w-[20%]">
                  Đại diện pháp lý
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 w-[35%]">
                  Vòng đời chu kỳ (Từ ➔ Đến)
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 text-right w-[18%]">
                  Tài khóa định mức
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 text-center w-[12%]">
                  Trạng thái
                </TableHead>
                <TableHead className="w-10 py-2 pr-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-50 text-xs">
              {isLoading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <TableRow
                    key={i}
                    className="hover:bg-transparent border-none"
                  >
                    <TableCell className="pl-4 py-3.5">
                      <div className="h-3.5 bg-slate-100 rounded-sm w-16 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-3.5 bg-slate-100 rounded-sm w-24 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <div className="h-3 bg-slate-100 rounded-sm w-44 animate-pulse" />
                        <div className="h-2.5 bg-slate-50 rounded-sm w-32 animate-pulse" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-3.5 bg-slate-100 rounded-sm w-20 ml-auto animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4.5 bg-slate-100 rounded-md w-16 mx-auto animate-pulse" />
                    </TableCell>
                    <TableCell className="pr-4">
                      <div className="h-5 bg-slate-100 rounded-md w-5 ml-auto animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredContracts.length === 0 ? (
                <TableRow className="hover:bg-transparent border-none">
                  <TableCell colSpan={6} className="h-45 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 space-y-1.5 max-w-xs mx-auto select-none">
                      <SearchX size={16} className="text-slate-300" />
                      <h4 className="text-[11px] font-bold text-slate-700">
                        Không có dữ liệu hợp đồng tương thích
                      </h4>
                      <p className="text-[10px] text-slate-400 text-center leading-normal">
                        Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc làm sạch
                        khay bộ lọc trạng thái.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedContracts.map((con) => (
                  <TableRow
                    key={con.id}
                    className={`group transition-colors border-none ${selectedContractId === con.id ? "bg-indigo-50/20 hover:bg-indigo-50/30" : "hover:bg-slate-50/20"}`}
                  >
                    <TableCell className="font-mono font-bold text-slate-900 pl-4 py-2.5">
                      {con.id}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700 py-2.5">
                      {con.representative}
                    </TableCell>
                    <TableCell className="font-mono text-slate-500 py-2.5">
                      <span className="text-slate-800 font-bold">
                        {con.startDate}
                      </span>{" "}
                      ➔{" "}
                      <span className="text-slate-800 font-bold">
                        {con.endDate}
                      </span>
                      <span className="text-[10px] font-sans text-slate-400 block mt-0.5 font-semibold truncate max-w-60">
                        {con.status === "active"
                          ? `✓ Chu kỳ thuê: ${con.duration}`
                          : `⚠️ Lý do dừng: ${con.terminationReason}`}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-slate-900 py-2.5">
                      <span>{con.price.toLocaleString("vi-VN")}đ</span>
                      <span className="text-[9px] font-sans text-slate-400 font-normal mt-0.5 flex items-center justify-end gap-1 select-none">
                        <CircleDollarSign
                          size={10}
                          className="text-slate-300"
                        />{" "}
                        Cọc giữ: {(con.deposit / 1000000).toFixed(1)}M •
                        <span
                          className={`font-bold ${con.paymentStatus === "holding" ? "text-amber-600" : con.paymentStatus === "refunded" ? "text-slate-400" : "text-rose-600"}`}
                        >
                          {con.paymentStatus === "holding"
                            ? "Giữ cọc"
                            : con.paymentStatus === "refunded"
                              ? "Hoàn cọc"
                              : "Phạt cọc"}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="text-center py-2.5">
                      <Badge
                        variant="outline"
                        className={`border-none text-[9px] font-bold px-1.5 py-0.5 rounded select-none cursor-default ${
                          con.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : con.status === "expired"
                              ? "bg-slate-100 text-slate-400"
                              : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {con.status === "active"
                          ? "Đang chạy"
                          : con.status === "expired"
                            ? "Hết hạn"
                            : "Bị hủy bỏ"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-4 py-2.5">
                      <Link href={`/admin/contracts/${con.id}`}>
                        <Button
                          onClick={() => setSelectedContractId(con.id)}
                          variant="ghost"
                          size="icon"
                          className={`h-6 w-6 rounded-md transition-colors ${selectedContractId === con.id ? "text-indigo-600 bg-indigo-50/50" : "text-slate-300 group-hover:text-slate-600 group-hover:bg-slate-100"}`}
                        >
                          <Eye size={12} />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* CHÂN KHAY ĐIỀU HƯỚNG PHÂN TRANG DẸT MỊN */}
          {!isLoading && filteredContracts.length > 0 && totalPages > 1 && (
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between select-none mt-auto">
              <span className="text-[10px] font-medium text-slate-400 font-mono">
                Trang {currentPage} / {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 rounded border-slate-200 text-slate-600 bg-white"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 rounded border-slate-200 text-slate-600 bg-white"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: BỐ CỤC PHẲNG CHI TIẾT TẬP TIN SỐ HÓA & WORKFLOW ACTIONS */}
      <section className="py-5 flex flex-col lg:flex-row lg:items-start gap-6 w-full">
        <div className="lg:col-span-8 space-y-2.5 flex-1 w-full">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">
            Tệp tin số hóa đính kèm văn bản chứng từ gốc
          </span>
          <div className="flex items-center justify-between p-2.5 border border-slate-200/60 rounded-xl bg-slate-50/30 group hover:border-slate-300 hover:bg-white transition-all text-xs max-w-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText
                size={14}
                className="text-slate-400 group-hover:text-indigo-600 shrink-0"
              />
              <span className="font-semibold text-slate-600 truncate">
                {currentSelectedContract.fileName}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide px-1">
                {currentSelectedContract.fileSize}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-400 hover:text-slate-800 rounded"
              >
                <Printer size={12} />
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 w-full lg:w-72 bg-slate-50/30 p-4 rounded-xl border border-slate-200/60 space-y-3 select-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Trung tâm điều hành hành chính
          </span>
          <div className="space-y-1.5 w-full">
            {currentSelectedContract.status === "active" ? (
              <>
                <Button
                  variant="outline"
                  className="w-full h-8 text-xs font-semibold border-slate-200 bg-white text-slate-700 rounded-lg hover:bg-slate-50 shadow-3xs flex items-center justify-start gap-2"
                >
                  <ArrowUpRight size={13} className="text-slate-400" /> Gia hạn
                  phụ lục hợp đồng mới
                </Button>
                <Button
                  variant="ghost"
                  className="w-full h-8 text-xs font-bold text-rose-600 bg-rose-50/20 hover:bg-rose-50/60 border border-dashed border-rose-100 rounded-lg flex items-center justify-start gap-2 uppercase tracking-tight"
                >
                  <AlertTriangle size={13} className="text-rose-500" /> Kích
                  hoạt thanh lý phạt cọc
                </Button>
              </>
            ) : (
              <div className="p-3 text-[11px] text-slate-400 font-medium font-sans leading-normal border border-dashed border-slate-200 bg-slate-100/40 rounded-lg">
                ⚠️ Chứng từ này thuộc chu kỳ tài khóa cũ đã khóa sổ pháp lý. Hệ
                thống vô hiệu hóa toàn bộ quyền can thiệp chỉnh sửa dữ liệu quá
                khứ.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: NHẬT KÝ ĐỐI SOÁT AUDIT LOGS ĐỘNG THEO DÒNG CLICK */}
      <section className="pt-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 select-none">
          <History size={14} className="text-slate-400" /> Nhật ký kiểm toán dấu
          vết lịch sử chứng từ (
          <span className="font-mono text-indigo-600 font-bold">
            {currentSelectedContract.id}
          </span>
          )
        </h3>

        <div className="space-y-4 pl-1 relative before:absolute before:left-1.25 before:top-2 before:bottom-2 before:w-px before:bg-slate-200/60 select-none">
          {(
            contractLogs[currentSelectedContract.id] || [
              {
                time: "01/01/2026 00:00",
                user: "Hệ thống (Auto)",
                action: "Lưu trữ dữ liệu đồng bộ chứng từ lịch sử an toàn",
              },
            ]
          ).map((log, idx) => (
            <div
              key={idx}
              className="flex gap-3 relative items-start text-xs font-sans"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-slate-300 border border-white ring-2 ring-slate-50 mt-1 z-10 shrink-0" />
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <p className="font-semibold text-slate-800 tracking-tight leading-normal">
                    {log.action}
                  </p>
                  <span className="text-[10px] font-medium text-slate-400 font-mono shrink-0">
                    {log.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Nhân sự thụ lý hồ sơ:{" "}
                  <span className="text-slate-500 font-sans">{log.user}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
