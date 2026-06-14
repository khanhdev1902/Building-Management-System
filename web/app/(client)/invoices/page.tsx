/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Receipt,
  Search,
  FileDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  ArrowUpRight,
  Zap,
  Droplets,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  AlertTriangle,
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
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { InvoiceDetailDialog } from "./components/InvoiceDetailDialog";
import { toast } from "sonner";
import { invoiceApi } from "./apis/invoice.api";
import { Invoice } from "./types/invoice.type";
import { InvoicePageSkeleton } from "./components/InvoicePageSkeleton";

export default function InvoiceManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

 const [statusTab, setStatusTab] = useState<
     "all" | "PAID" | "UNPAID" | "Overdue"
   >("all");

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const res = await invoiceApi.getAllInvoices();
      setInvoices(res.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleViewInvoice = async (invoiceId: string) => {
    try {
      const blob = await invoiceApi.exportInvoicePdf(invoiceId);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const blob = await invoiceApi.exportInvoicePdf(invoiceId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoiceId.slice(0, 12)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success(
        `Đã xuất hóa đơn PDF cho chứng từ ${invoiceId.slice(0, 12)}!`,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDetail = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsDetailOpen(true);
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        inv.roomNumber.includes(searchTerm) ||
        inv.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (statusTab !== "all" && inv.status !== statusTab) return false;
      return true;
    });
  }, [searchTerm, statusTab, invoices]);


  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.totalAmount),
    0,
  );
  const totalAmountf = invoices
    .filter((i) => i.status === "PAID")
    .reduce((sum, invoice) => sum + Number(invoice.totalAmount), 0);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 pt-6 sm:pt-10 space-y-4 sm:space-y-5 bg-slate-50/20 min-h-screen antialiased selection:bg-indigo-50">
      {isLoading ? (
        <InvoicePageSkeleton />
      ) : (
        <>
          {/* KPI CARDS — scroll ngang trên mobile, grid trên desktop */}
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 select-none snap-x snap-mandatory sm:overflow-visible">
            <StatsMetricCard
              title="Tổng tiền đã thanh toán"
              value={`${totalAmount.toLocaleString("vi-VN")}đ`}
              sub="Kỳ hạn T05/2026"
              icon={CreditCard}
              color="indigo"
            />
            <StatsMetricCard
              title="Thanh toán tháng này"
              value={`${totalAmountf.toLocaleString("vi-VN")}đ`}
              sub="Đạt tiến độ 68%"
              icon={CheckCircle2}
              color="emerald"
            />
            <StatsMetricCard
              title="Nợ chưa thanh toán"
              value={`${(totalAmount - totalAmountf).toLocaleString("vi-VN")}đ`}
              sub="45 lệnh treo"
              icon={Clock}
              color="amber"
            />
            <StatsMetricCard
              title="Nợ đọng quá hạn"
              value="0đ"
              sub="Rủi ro dòng tiền cao"
              icon={AlertCircle}
              color="rose"
            />
          </div>

          {/* TOOLBAR */}
          <div className="flex flex-col gap-3 select-none">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors stroke-[1.5]" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm số phòng, tên, ID..."
                className="w-full pl-9 pr-4 h-10 bg-white border border-slate-200/80 focus-visible:border-slate-400 focus-visible:ring-0 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full">
              {/* Tabs trạng thái - scroll ngang trên mobile */}
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/40 h-9 items-center overflow-x-auto flex-1 min-w-0 no-scrollbar">
                {[
                  { key: "all", label: "Tất cả" },
                  { key: "Paid", label: "Đã tất toán" },
                  { key: "Pending", label: "Chờ thanh toán" },
                  { key: "Overdue", label: "Quá hạn" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setStatusTab(tab.key as any);
                      setSelectedIds([]);
                    }}
                    className={`h-7 px-3 rounded-md text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      statusTab === tab.key
                        ? "bg-white shadow-2xs text-slate-900"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0 border-slate-200 bg-white text-slate-600 rounded-lg shadow-2xs sm:hidden"
                onClick={() => {
                  toast.info("Thông báo hệ thống!", {
                    description:
                      "Chức năng này đang trong quá trình phát triển...",
                  });
                }}
              >
                <FileDown className="w-3.5 h-3.5 text-slate-400" />
              </Button>

              <Button
                variant="outline"
                className="h-9 text-xs border-slate-200 bg-white text-slate-600 font-semibold gap-1.5 rounded-lg shadow-2xs hidden sm:flex shrink-0"
                onClick={() => {
                  toast.info("Thông báo hệ thống!", {
                    description:
                      "Chức năng này đang trong quá trình phát triển...",
                  });
                }}
              >
                <FileDown className="w-3.5 h-3.5 text-slate-400" /> Xuất Excel
              </Button>
            </div>
          </div>

          {/* MOBILE: danh sách card thay cho table */}
          <div className="sm:hidden space-y-2 pb-16">
            {filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm font-mono">
                        Phòng {inv.roomNumber}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-slate-400">
                        {inv.id.toUpperCase().slice(0, 8)}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium block mt-0.5 truncate">
                      {inv.tenantName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <StatusBadge status={inv.status} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 p-1 rounded-lg border border-slate-200/70 bg-white shadow-md"
                      >
                        <DropdownMenuItem
                          onClick={() => handleOpenDetail(inv)}
                          className="gap-2 rounded py-2 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                          Chi tiết hóa đơn
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleViewInvoice(inv.id)}
                          className="gap-2 cursor-pointer rounded-md py-2 text-xs font-medium text-slate-600 hover:bg-sky-50 focus:bg-sky-50"
                        >
                          <Receipt className="h-4 w-4" />
                          Xem biên lai điện tử
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDownloadInvoice(inv.id)}
                          className="gap-2 rounded py-2 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer"
                        >
                          <FileDown className="h-4 w-4" />
                          Xuất hóa đơn PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 border-slate-100" />
                        <DropdownMenuItem className="gap-2 rounded py-2 text-rose-600 hover:bg-rose-50/50 text-xs font-semibold cursor-pointer">
                          <AlertTriangle className="h-4 w-4" /> Đánh dấu sai sót
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Zap size={11} className="text-amber-500" />
                    <strong className="text-slate-700 font-mono font-bold">
                      {inv.invoiceItems.find((i) => i.type === "ELECTRIC")
                        ?.quantity ?? ""}{" "}
                      kWh
                    </strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Droplets size={11} className="text-blue-500" />
                    <strong className="text-slate-700 font-mono font-bold">
                      {inv.invoiceItems.find((i) => i.type === "WATER")
                        ?.quantity ?? ""}{" "}
                      m³
                    </strong>
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-400 font-mono">
                    Hạn: {inv.dueDate}
                    {inv.status === "Overdue" && (
                      <span className="text-rose-500 font-bold ml-1">
                        (Trễ 4 ngày)
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-slate-900 text-sm font-mono">
                    {inv.totalAmount.toLocaleString("vi-VN")}đ
                  </div>
                </div>
              </div>
            ))}

            {filteredInvoices.length === 0 && (
              <div className="text-center text-xs text-slate-400 py-10">
                Không tìm thấy hóa đơn phù hợp.
              </div>
            )}

            {/* Mobile pagination */}
            <div className="flex items-center justify-between px-1 pt-2">
              <p className="text-[11px] font-medium text-slate-400">
                <span className="text-slate-800 font-semibold font-mono">
                  {filteredInvoices.length}
                </span>{" "}
                / 120 chứng từ
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-slate-400">
                  <span className="text-slate-900 font-bold font-mono">1</span>{" "}
                  / 12
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-md border-slate-200 text-slate-600 bg-white disabled:opacity-40"
                    disabled
                  >
                    <ChevronLeft className="w-3.5 h-3.5 stroke-[1.8]" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-md border-slate-200 text-slate-600 bg-white"
                  >
                    <ChevronRight className="w-3.5 h-3.5 stroke-[1.8]" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP/TABLET: bảng đầy đủ */}
          <div className="hidden sm:flex relative rounded-xl border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white overflow-hidden flex-col min-h-120">
            <div className="overflow-x-auto">
              <Table className="min-w-225">
                <TableHeader className="bg-slate-50/40 border-b border-slate-100/80 select-none">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider py-3 w-[8%]">
                      STT
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider py-3 w-[12%]">
                      ID Hóa đơn
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider py-3 w-[15%]">
                      Vị trí phòng
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider py-3 w-[35%] hidden lg:table-cell">
                      Bóc tách cấu phần điện nước chi tiết
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider text-right py-3 w-[13%]">
                      Tổng tiền gốc
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider py-3 w-[13%] pl-6 hidden lg:table-cell">
                      Hạn kì đối soát
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider text-center py-3 w-[12%]">
                      Trạng thái tiền
                    </TableHead>
                    <TableHead className="w-10 py-3 pr-4"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100/60">
                  {filteredInvoices.map((inv, key) => {
                    const isChecked = selectedIds.includes(inv.id);
                    return (
                      <TableRow
                        key={inv.id}
                        className={`group transition-colors border-none ${isChecked ? "bg-indigo-50/20 hover:bg-indigo-50/30" : "hover:bg-slate-50/40"}`}
                      >
                        <TableCell className="pl-4 py-3">{key + 1}</TableCell>

                        <TableCell className="font-mono text-xs font-bold text-slate-400 py-3">
                          {inv.id.toUpperCase().slice(0, 12)}
                        </TableCell>

                        <TableCell className="py-3">
                          <span className="font-bold text-slate-800 text-xs font-mono">
                            Phòng {inv.roomNumber}
                          </span>
                          <span className="text-[10px] text-slate-400 font-sans block mt-0.5 truncate max-w-30 font-medium">
                            {inv.tenantName}
                          </span>
                        </TableCell>

                        <TableCell className="py-3 hidden lg:table-cell">
                          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] font-medium text-slate-400 font-sans">
                            <span className="flex items-center gap-1">
                              <Zap size={11} className="text-amber-500" /> Điện:{" "}
                              <strong className="text-slate-700 font-mono font-bold">
                                {inv.invoiceItems.find(
                                  (i) => i.type === "ELECTRIC",
                                )?.quantity ?? ""}{" "}
                                kWh
                              </strong>{" "}
                              <span className="text-slate-300">
                                (
                                {inv.invoiceItems.find(
                                  (i) => i.type === "ELECTRIC",
                                )?.previousReading ?? ""}
                                ➔
                                {inv.invoiceItems.find(
                                  (i) => i.type === "ELECTRIC",
                                )?.currentReading ?? ""}
                                )
                              </span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Droplets size={11} className="text-blue-500" />{" "}
                              Nước:{" "}
                              <strong className="text-slate-700 font-mono font-bold">
                                {inv.invoiceItems.find(
                                  (i) => i.type === "WATER",
                                )?.quantity ?? ""}{" "}
                                m³
                              </strong>{" "}
                              <span className="text-slate-300">
                                (
                                {inv.invoiceItems.find(
                                  (i) => i.type === "WATER",
                                )?.previousReading ?? ""}
                                ➔
                                {inv.invoiceItems.find(
                                  (i) => i.type === "WATER",
                                )?.currentReading ?? ""}
                                )
                              </span>
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-slate-400 font-medium font-sans mt-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 w-fit">
                            <span>
                              Gốc:{" "}
                              {(
                                (inv.invoiceItems.find((i) => i.type == "ROOM")
                                  ?.subTotal || 0) / 1000
                              ).toLocaleString("vi-VN")}{" "}
                              k
                            </span>
                            <span>•</span>
                            <span>
                              Điện:{" "}
                              {(
                                (inv.invoiceItems.find(
                                  (i) => i.type === "ELECTRIC",
                                )?.subTotal ?? 0) / 1000
                              ).toLocaleString("vi-VN")}{" "}
                              k
                            </span>
                            <span>•</span>
                            <span>
                              Nước:{" "}
                              {(
                                (inv.invoiceItems.find(
                                  (i) => i.type === "WATER",
                                )?.subTotal ?? 0) / 1000
                              ).toLocaleString("vi-VN")}{" "}
                              k
                            </span>
                            <span>•</span>
                            <span>
                              DV:{" "}
                              {(
                                inv.invoiceItems.reduce(
                                  (acc, item) =>
                                    acc +
                                    (item.type === "SERVICE"
                                      ? item.subTotal
                                      : 0),
                                  0,
                                ) / 1000
                              ).toLocaleString("vi-VN")}{" "}
                              k
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="font-bold text-slate-900 text-right font-mono py-3">
                          {inv.totalAmount.toLocaleString("vi-VN")}đ
                        </TableCell>

                        <TableCell className="py-3 pl-6 font-medium hidden lg:table-cell">
                          <div className="text-xs text-slate-600 font-mono">
                            {inv.dueDate}
                          </div>
                          {inv.status === "Overdue" && (
                            <div className="text-[9px] text-rose-500 font-bold font-sans mt-0.5 flex items-center gap-0.5">
                              Đã trễ 4 ngày
                            </div>
                          )}
                        </TableCell>

                        <TableCell className="text-center py-3">
                          <StatusBadge status={inv.status} />
                        </TableCell>

                        <TableCell className="text-right pr-4 py-3">
                          <div className="flex justify-end gap-1 items-center h-7">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 cursor-pointer rounded-md group-hover:opacity-100 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                >
                                  <MoreVertical className="w-3.5 h-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-48 p-1 rounded-lg border border-slate-200/70 bg-white shadow-md"
                              >
                                <DropdownMenuItem
                                  onClick={() => handleOpenDetail(inv)}
                                  className="gap-2 rounded py-2 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer"
                                >
                                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />{" "}
                                  Chi tiết hóa đơn
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleViewInvoice(inv.id)}
                                  className="gap-2 cursor-pointer rounded-md py-2 text-xs font-medium text-slate-600 hover:bg-sky-50 focus:bg-sky-50"
                                >
                                  <Receipt className="h-4 w-4" />
                                  Xem biên lai điện tử
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDownloadInvoice(inv.id)}
                                  className="gap-2 rounded py-2 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer"
                                >
                                  <FileDown className="h-4 w-4" />
                                  Xuất hóa đơn PDF
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1 border-slate-100" />
                                <DropdownMenuItem className="gap-2 rounded py-2 text-rose-600 hover:bg-rose-50/50 text-xs font-semibold cursor-pointer">
                                  <AlertTriangle className="h-4 w-4" /> Đánh dấu
                                  sai sót
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className=" absolute bottom-0 left-0 w-full px-4 py-2.5 border-t border-slate-100 bg-white flex items-center justify-between shrink-0 select-none">
              <p className="text-[11px] font-medium text-slate-400">
                Hiển thị{" "}
                <span className="text-slate-800 font-semibold font-mono">
                  {filteredInvoices.length}
                </span>{" "}
                trên 120 chứng từ hóa đơn tháng
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-slate-400">
                  Trang{" "}
                  <span className="text-slate-900 font-bold font-mono">1</span>{" "}
                  / 12
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6.5 w-6.5 rounded-md border-slate-200 text-slate-600 bg-white disabled:opacity-40"
                    disabled
                  >
                    <ChevronLeft className="w-3.5 h-3.5 stroke-[1.8]" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6.5 w-6.5 rounded-md border-slate-200 text-slate-600 bg-white"
                  >
                    <ChevronRight className="w-3.5 h-3.5 stroke-[1.8]" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <InvoiceDetailDialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        invoice={selectedInvoice}
        onDownloadPdf={handleDownloadInvoice}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; class: string; dot: string }> =
    {
      PAID: {
        label: "Đã tất toán",
        class: "bg-emerald-50 text-emerald-700 border-emerald-100/70",
        dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]",
      },
      Pending: {
        label: "Chờ thanh toán",
        class: "bg-amber-50 text-amber-700 border-amber-100/70",
        dot: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]",
      },
      Overdue: {
        label: "Quá hạn treo",
        class: "bg-rose-50 text-rose-700 border-rose-100/70",
        dot: "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.4)]",
      },
    };

  const config = configs[status] || configs.Pending;

  return (
    <Badge
      variant="outline"
      className={`${config.class} border px-2 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1.5 w-fit mx-auto cursor-default`}
    >
      <span className={`h-1.2 w-1.2 rounded-full ${config.dot}`} />
      {config.label}
    </Badge>
  );
}

function StatsMetricCard({ title, value, sub, icon: Icon, color }: any) {
  const colors: Record<string, string> = {
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100/40",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100/40",
    amber: "text-amber-600 bg-amber-50 border-amber-100/40",
    rose: "text-rose-600 bg-rose-50 border-rose-100/40",
  };

  return (
    <div className="bg-white p-4 border border-slate-200/80 rounded-xl flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)] shrink-0 w-[78%] sm:w-auto snap-start">
      <div className="space-y-0.5 min-w-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
          {title}
        </span>
        <h4 className="text-xl font-bold text-slate-900 font-sans tracking-tight">
          {value}
        </h4>
        <span className="text-[10px] font-medium text-slate-400 block truncate">
          {sub}
        </span>
      </div>
      <div className={`p-2.5 rounded-xl border ${colors[color]} shrink-0`}>
        <Icon className="w-4 h-4 stroke-[1.8]" />
      </div>
    </div>
  );
}
