/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FileText,
  Search,
  FileDown,
  Printer,
  Coins,
  QrCode,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { CreateReceiptDialog } from "./components/CreateReceiptDialog";
import { ReceiptDetailDialog } from "./components/ReceiptDetailDialog";
import { receiptApi } from "./apis/receipt.api";
import { Receipt } from "./types/receipt.type";


export default function ReceiptManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "ROOM" | "EXTERNAL">(
    "all",
  );
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  const handleOpenDetail = (receipt: any) => {
    setSelectedReceipt(receipt);
    setIsDetailOpen(true);
  };

  const fechData = async () => {
    try {
      const res = await receiptApi.getAllReceipts();
      console.log(res);
      setReceipts(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fechData();
  }, []);

  const filteredReceipts = useMemo(() => {
    return receipts.filter((rec) => {
      const matchesSearch =
        (rec.room && rec.room.includes(searchTerm)) ||
        rec.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rec.invoiceId &&
          rec.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      if (typeFilter === "ROOM" && !rec.room) return false;
      if (typeFilter === "EXTERNAL" && rec.room) return false;

      return true;
    });
  }, [receipts, searchTerm, typeFilter]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-5 bg-slate-50/20 min-h-screen antialiased font-sans select-none">
      {/* TOP HEAD BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-xl font-black tracking-tight text-slate-950 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 stroke-[2.2]" />
            Sổ cái Phiếu thu thực tế
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Quản lý liên thông dòng tiền thực thu nội bộ tòa nhà và các khoản
            doanh thu tự do ngoài vận hành.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <Button
            variant="outline"
            className="h-9 text-xs border-slate-200 bg-white text-slate-600 font-bold gap-1.5 rounded-lg shadow-3xs cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-400" /> Xuất báo cáo thu
          </Button>

          {/* NÚT TẠO PHIẾU THU TỰ ĐỘNG CHUẨN SAAS */}
          <CreateReceiptDialog
            onSuccess={() => {
              // API load lại danh sách sổ cái phiếu thu thực tế sau khi thêm mới thành công
            }}
          />
        </div>
      </div>

      {/* TOOLBAR SEARCH & FILTER */}
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-center pt-1">
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[1.8]" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm số phòng, cư dân, mã phiếu, hóa đơn..."
            className="w-full pl-9 pr-4 h-9.5 bg-white border border-slate-200/80 focus-visible:border-slate-400 focus-visible:ring-0 rounded-lg text-xs font-semibold text-slate-800"
          />
        </div>

        {/* Bộ lọc phân loại dòng tiền: Theo phòng hoặc Thu ngoài */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/40 w-fit h-9.5 items-center">
          {[
            { key: "all", label: "Tất cả phiếu thu" },
            { key: "ROOM", label: "Dòng tiền theo Phòng" },
            { key: "EXTERNAL", label: "Doanh thu tự do ngoài" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTypeFilter(tab.key as any)}
              className={`h-7.5 px-3.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                typeFilter === tab.key
                  ? "bg-white shadow-3xs text-slate-900"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE SỔ CÁI NÉN THÔNG TIN */}
      <div className="rounded-xl border border-slate-200/80 shadow-3xs bg-white overflow-hidden flex flex-col min-h-96">
        <Table>
          <TableHeader className="bg-slate-50/40 border-b border-slate-100/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 tracking-wider py-3 pl-5 w-[14%]">
                Mã phiếu thu
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 tracking-wider py-3 w-[14%]">
                Phân loại nghiệp vụ
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 tracking-wider py-3 w-[12%]">
                Hóa đơn gốc
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 tracking-wider py-3 w-[12%]">
                Vị trí phòng
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 tracking-wider py-3 w-[22%]">
                Mã đối soát / Người duyệt
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right py-3 w-[14%] pr-6">
                Ngày lập phiếu
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right py-3 w-[14%] pr-6">
                Số tiền nhận
              </TableHead>
              <TableHead className="w-10 py-3 pr-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100/60 text-xs font-medium text-slate-600">
            {filteredReceipts.map((rec) => (
              <TableRow
                key={rec.id}
                className="group hover:bg-slate-50/30 border-none transition-colors"
              >
                <TableCell className="font-mono font-bold text-slate-900 pl-5 py-3">
                  {rec.id}
                </TableCell>

                {/* Cột phân loại nghiệp vụ chi tiết */}
                <TableCell className="py-3">
                  <TypeBadge type={rec.type} />
                </TableCell>

                <TableCell className="font-mono text-slate-400 py-3">
                  {rec.invoiceId || "—"}
                </TableCell>

                <TableCell className="py-3">
                  {rec.room ? (
                    <>
                      <span className="font-bold text-slate-800 font-mono">
                        P.{rec.room}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-sans truncate max-w-27.5 mt-0.5">
                        {rec.tenant}
                      </span>
                    </>
                  ) : (
                    <span className="text-slate-400 italic">
                      Ngoại vi • {rec.tenant}
                    </span>
                  )}
                </TableCell>

                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <PaymentMethodBadge method={rec.paymentMethod} />
                    <div className="space-y-0.5">
                      <span className="text-slate-700 font-semibold block">
                        {rec.collectedBy}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        Ref: {rec.referenceNo}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-3 font-mono text-slate-500">
                  {rec.createdAt}
                </TableCell>

                <TableCell className="font-mono font-black text-green-700 text-right text-sm pr-6 py-3">
                  +{rec.amount.toLocaleString("vi-VN")}đ
                </TableCell>

                <TableCell className="text-right pr-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      {/* Biến nút in cũ thành nút Ba chấm chìm tinh tế */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4" />{" "}
                        {/* Đổi icon Printer thành MoreHorizontal */}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-44 p-1 rounded-xl border border-slate-200/80 bg-white shadow-md select-none"
                    >
                      {/* ⚡ TÁC VỤ 1: Click xem phôi chi tiết */}
                      <DropdownMenuItem
                        onClick={() => handleOpenDetail(rec)} // Kích hoạt nạp dữ liệu dòng được chọn
                        className="gap-2 rounded-lg py-2 text-slate-600 text-xs font-semibold focus:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <Eye size={13} className="text-slate-400" /> Xem chi
                        tiết phiếu
                      </DropdownMenuItem>

                      {/* TÁC VỤ 2: Gọi lệnh in */}
                      <DropdownMenuItem
                        className="gap-2 rounded-lg py-2 text-slate-600 text-xs font-semibold focus:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => window.print()}
                      >
                        <Printer size={13} className="text-slate-400" /> In
                        phiếu thu (K80)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <ReceiptDetailDialog
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            receipt={selectedReceipt}
          />
        </Table>
      </div>
    </div>
  );
}

// CHIP TRẠNG THÁI NGHIỆP THỰC TẾ
function TypeBadge({ type }: { type: string }) {
  const map: Record<string, { label: string; class: string }> = {
    CONTRACT_INITIAL: {
      label: "Cọc & Tiền nhà đầu kỳ",
      class: "bg-indigo-50 text-indigo-700 border-indigo-100",
    },
    ROOM: {
      label: "Tiền phòng",
      class: "bg-indigo-50 text-indigo-700 border-indigo-100",
    },
    ROOM_REPAIR: {
      label: "Sửa chữa thiết bị",
      class: "bg-amber-50 text-amber-700 border-amber-100",
    },
    EXTERNAL_REVENUE: {
      label: "Doanh thu tự do ngoài",
      class: "bg-slate-900 text-white border-none",
    },
  };
  const current = map[type] || {
    label: "Cước phí tháng",
    class: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <Badge
      variant="outline"
      className={`${current.class} text-[9px] font-bold rounded px-1.5 py-0.5 shadow-none`}
    >
      {current.label}
    </Badge>
  );
}

function PaymentMethodBadge({ method }: { method: string }) {
  if (method === "BANK_TRANSFER") {
    return (
      <div className="p-1.5 bg-blue-50 border border-blue-100/60 text-blue-600 rounded-lg shrink-0">
        <QrCode size={13} />
      </div>
    );
  }
  return (
    <div className="p-1.5 bg-emerald-50 border border-emerald-100/60 text-emerald-600 rounded-lg shrink-0">
      <Coins size={13} />
    </div>
  );
}
