/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import {
  Receipt,
  Search,
  FileDown,
  Mail,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Send,
  Printer,
  CreditCard,
  QrCode,
  ArrowUpRight,
  Zap,
  Droplets,
  ChevronLeft,
  ChevronRight,
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
import { Checkbox } from "@/shared/components/ui/checkbox";
import { InvoiceDetailDialog } from "./components/InvoiceDetailDialog";
import { toast } from "sonner";

// Mock Data bóc tách chi phí đậm đặc nghiệp vụ chuỗi CCMN Danjin 2026
const MOCK_INVOICES = [
  {
    id: "INV-2026-0501",
    room: "101",
    tenant: "Trần Bình An",
    amount: 5270000,
    dueDate: "15/05/2026",
    status: "Pending",
    counters: {
      electric: { old: 2100, new: 2220, used: 120 },
      water: { old: 800, new: 812, used: 12 },
    },
    breakdown: {
      rent: 4500000,
      electric: 420000,
      water: 200000,
      service: 150000,
    },
  },
  {
    id: "INV-2026-0502",
    room: "202",
    tenant: "Trần Thị Bình",
    amount: 5650000,
    dueDate: "15/05/2026",
    status: "Paid",
    counters: {
      electric: { old: 3410, new: 3530, used: 120 },
      water: { old: 1105, new: 1115, used: 10 },
    },
    breakdown: {
      rent: 4800000,
      electric: 420000,
      water: 280000,
      service: 150000,
    },
  },
  {
    id: "INV-2026-0412",
    room: "405",
    tenant: "Lê Minh Công",
    amount: 5120000,
    dueDate: "15/04/2026",
    status: "Overdue",
    counters: {
      electric: { old: 1850, new: 1940, used: 90 },
      water: { old: 640, new: 648, used: 8 },
    },
    breakdown: {
      rent: 4500000,
      electric: 315000,
      water: 155000,
      service: 100000,
    },
  },
];

export default function InvoiceManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusTab, setStatusTab] = useState<
    "all" | "Paid" | "Pending" | "Overdue"
  >("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Thêm 2 dòng state này vào đầu component InvoiceManagementPage
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const handleOpenDetail = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsDetailOpen(true);
  };

  // 1. Luồng xử lý bộ lọc tập trung
  const filteredInvoices = useMemo(() => {
    return MOCK_INVOICES.filter((inv) => {
      const matchesSearch =
        inv.room.includes(searchTerm) ||
        inv.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (statusTab !== "all" && inv.status !== statusTab) return false;
      return true;
    });
  }, [searchTerm, statusTab]);

  // 2. Logic tương tác mảng Checkbox hàng loạt
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredInvoices.map((inv) => inv.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-5 bg-slate-50/20 min-h-screen antialiased selection:bg-indigo-50">
      {/* 1. TOP BAR CHỨNG TỪ TÁC VỤ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-4 select-none">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-slate-400 stroke-[1.8]" />
            Sổ gốc Hóa đơn & Công nợ
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Kỳ chu kỳ đối soát hệ thống tháng này • Đang kiểm soát{" "}
            {MOCK_INVOICES.length} chứng từ lõi.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <Button
            variant="outline"
            className="h-9 text-xs font-semibold border-slate-200 text-slate-600 bg-white hover:bg-slate-50 shadow-2xs rounded-lg flex-1 sm:flex-none"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> In hàng
            loạt
          </Button>
          <Button className="h-9 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-2xs flex-1 sm:flex-none">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Khởi tạo hóa đơn lẻ
          </Button>
        </div>
      </div>

      {/* 2. KHỐI THỐNG KÊ KPI CARDS FLAT, LIỀN MẠCH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        <StatsMetricCard
          title="Tổng doanh số phát hành"
          value="1.24 tỷ"
          sub="Kỳ hạn T05/2026"
          icon={CreditCard}
          color="indigo"
        />
        <StatsMetricCard
          title="Dòng tiền thực thu"
          value="840.5 tr"
          sub="Đạt tiến độ 68%"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatsMetricCard
          title="Nợ chờ đối soát"
          value="320.0 tr"
          sub="45 lệnh treo"
          icon={Clock}
          color="amber"
        />
        <StatsMetricCard
          title="Nợ đọng quá hạn"
          value="85.2 tr"
          sub="Rủi ro dòng tiền cao"
          icon={AlertCircle}
          color="rose"
        />
      </div>

      {/* 3. TOOLBAR TÌM KIẾM & CHUYỂN TAB TRẠNG THÁI TRÀN VIỀN */}
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-center select-none pt-1">
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors stroke-[1.5]" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm nhanh số phòng, họ tên cư dân, ID hóa đơn..."
            className="w-full pl-9 pr-4 h-10 bg-white border border-slate-200/80 focus-visible:border-slate-400 focus-visible:ring-0 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal transition-all"
          />
        </div>

        {/* Cụm chuyển trạng thái dẹt khít chuẩn SaaS */}
        <div className="flex flex-wrap items-center justify-end gap-2 w-full lg:w-auto">
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/40 w-fit h-9 items-center">
            {[
              { key: "all", label: "Tất cả công nợ" },
              { key: "Paid", label: "Đã tất toán" },
              { key: "Pending", label: "Chờ thanh toán" },
              { key: "Overdue", label: "Quá hạn treo" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setStatusTab(tab.key as any);
                  setSelectedIds([]);
                }}
                className={`h-7 px-3.5 rounded-md text-xs font-semibold transition-all ${
                  statusTab === tab.key
                    ? "bg-white shadow-2xs text-slate-900"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

          <Button
            variant="outline"
            className="h-9 text-xs border-slate-200 bg-white text-slate-600 font-semibold gap-1.5 rounded-lg shadow-2xs"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-400" /> Xuất Excel
          </Button>
        </div>
      </div>

      {/* 4. BẢNG HIỂN THỊ CHỨNG TỪ NÉN MẬT ĐỘ THÔNG TIN CHUYÊN SÂU */}
      <div className="rounded-xl border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white overflow-hidden flex flex-col min-h-100">
        {/* Action Console đen sẫm phẳng lì khi có checkbox được tick */}
        {selectedIds.length > 0 && (
          <div className="bg-slate-900 px-5 py-2.5 flex items-center justify-between text-white animate-in fade-in slide-in-from-top-2 duration-200 select-none">
            <span className="text-xs font-semibold font-mono tracking-tight text-slate-300">
              Đang lựa chọn{" "}
              <strong className="text-white font-bold">
                {selectedIds.length}
              </strong>{" "}
              chứng từ công nợ
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-7 text-[10px] font-bold bg-white text-slate-900 hover:bg-slate-100 gap-1.5 rounded-md shadow-none uppercase"
              >
                <Send className="w-3 h-3" /> Gửi nhắc nợ hàng loạt
              </Button>
              <Button
                size="sm"
                className="h-7 text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white gap-1.5 rounded-md border border-white/10 shadow-none uppercase"
              >
                <QrCode className="w-3 h-3" /> Xuất QR gộp tiền
              </Button>
            </div>
          </div>
        )}

        <Table>
          <TableHeader className="bg-slate-50/40 border-b border-slate-100/80 select-none">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 pl-4 py-3">
                <Checkbox
                  checked={
                    filteredInvoices.length > 0 &&
                    selectedIds.length === filteredInvoices.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider py-3 w-[12%]">
                ID Hóa đơn
              </TableHead>
              <TableHead className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider py-3 w-[15%]">
                Vị trí phòng
              </TableHead>
              <TableHead className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider py-3 w-[35%]">
                Bóc tách cấu phần điện nước chi tiết
              </TableHead>
              <TableHead className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider text-right py-3 w-[13%]">
                Tổng tiền gốc
              </TableHead>
              <TableHead className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider py-3 w-[13%] pl-6">
                Hạn kì đối soát
              </TableHead>
              <TableHead className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider text-center py-3 w-[12%]">
                Trạng thái tiền
              </TableHead>
              <TableHead className="w-10 py-3 pr-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100/60">
            {filteredInvoices.map((inv) => {
              const isChecked = selectedIds.includes(inv.id);
              return (
                <TableRow
                  key={inv.id}
                  className={`group transition-colors border-none ${isChecked ? "bg-indigo-50/20 hover:bg-indigo-50/30" : "hover:bg-slate-50/40"}`}
                >
                  <TableCell className="pl-4 py-3">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleSelectRow(inv.id, !!checked)
                      }
                    />
                  </TableCell>

                  {/* Mã ID hóa đơn */}
                  <TableCell className="font-mono text-xs font-bold text-slate-400 py-3">
                    {inv.id}
                  </TableCell>

                  {/* Vị trí phòng & Tên chủ hộ */}
                  <TableCell className="py-3">
                    <span className="font-bold text-slate-800 text-xs font-mono">
                      P.{inv.room}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans block mt-0.5 truncate max-w-30 font-medium">
                      {inv.tenant}
                    </span>
                  </TableCell>

                  {/* KHẮC PHỤC: Khay phân tách điện nước thực tế, hiển thị rõ số công tơ */}
                  <TableCell className="py-3">
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] font-medium text-slate-400 font-sans">
                      <span className="flex items-center gap-1">
                        <Zap size={11} className="text-amber-500" /> Điện:{" "}
                        <strong className="text-slate-700 font-mono font-bold">
                          {inv.counters.electric.used} kWh
                        </strong>{" "}
                        <span className="text-slate-300">
                          ({inv.counters.electric.old}➔
                          {inv.counters.electric.new})
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Droplets size={11} className="text-blue-500" /> Nước:{" "}
                        <strong className="text-slate-700 font-mono font-bold">
                          {inv.counters.water.used} m³
                        </strong>{" "}
                        <span className="text-slate-300">
                          ({inv.counters.water.old}➔{inv.counters.water.new})
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[9px] text-slate-400 font-medium font-sans mt-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 w-fit">
                      <span>
                        Gốc: {(inv.breakdown.rent / 1000).toLocaleString()}k
                      </span>
                      <span>•</span>
                      <span>Điện: {inv.breakdown.electric / 1000}k</span>
                      <span>•</span>
                      <span>Nước: {inv.breakdown.water / 1000}k</span>
                      <span>•</span>
                      <span>DV: {inv.breakdown.service / 1000}k</span>
                    </div>
                  </TableCell>

                  {/* Tổng số tiền */}
                  <TableCell className="font-bold text-slate-900 text-right font-mono py-3">
                    {inv.amount.toLocaleString("vi-VN")}đ
                  </TableCell>

                  {/* Hạn đóng & Cảnh báo số ngày trễ */}
                  <TableCell className="py-3 pl-6 font-medium">
                    <div className="text-xs text-slate-600 font-mono">
                      {inv.dueDate}
                    </div>
                    {inv.status === "Overdue" && (
                      <div className="text-[9px] text-rose-500 font-bold font-sans mt-0.5 flex items-center gap-0.5">
                        ⚠️ Đã trễ 4 ngày
                      </div>
                    )}
                  </TableCell>

                  {/* Badge dẹt phẳng lì trạng thái dòng tiền */}
                  <TableCell className="text-center py-3">
                    <StatusBadge status={inv.status} />
                  </TableCell>

                  {/* Dropdown tác vụ hệ thống */}
                  <TableCell className="text-right pr-4 py-3">
                    <div className="flex justify-end gap-1 items-center h-7">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100/50"
                        title="Gửi email nhắc nhanh"
                      >
                        <Mail className="w-3.5 h-3.5 stroke-[1.75]" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-md opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 p-1 rounded-lg border border-slate-200/70 bg-white shadow-md"
                        >
                          {/* // Tìm đến DropdownMenuItem "Chi tiết hóa đơn" trong
                          bảng Table của anh và gắn lệnh: */}
                          <DropdownMenuItem
                            onClick={() => handleOpenDetail(inv)} // Bắn toàn bộ Object hóa đơn vào state kích hoạt
                            className="gap-2 rounded py-2 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />{" "}
                            Chi tiết hóa đơn
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 rounded py-2 text-emerald-600 hover:bg-emerald-50/40 text-xs font-semibold cursor-pointer">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Xác nhận
                            khớp tiền
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1 border-slate-100" />
                          <DropdownMenuItem className="gap-2 rounded py-2 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer">
                            <QrCode className="w-3.5 h-3.5 text-slate-400" />{" "}
                            Tải ảnh QR VietQR
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 rounded py-2 text-rose-600 hover:bg-rose-50/50 text-xs font-semibold cursor-pointer">
                            Hủy bỏ chứng từ
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

        {/* CỤM ĐIỀU HƯỚNG PHÂN TRANG GẮN CHÂN TABLE */}
        <div className="px-4 py-2.5 border-t border-slate-100 bg-white flex items-center justify-between shrink-0 select-none">
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
              <span className="text-slate-900 font-bold font-mono">1</span> / 12
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
      <InvoiceDetailDialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        invoice={selectedInvoice}
        onConfirmPayment={(id) => {
          // Luồng xử lý gọi API cập nhật trạng thái hóa đơn sang "Paid"
          toast.success(`Đã tất toán và khóa sổ công nợ chứng từ ${id}!`);
        }}
      />
    </div>
  );
}

// SUB-COMPONENT 1: BADGE TRẠNG THÁI TIỀN DẸT MỊN CHUẨN SAAS
function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; class: string; dot: string }> =
    {
      Paid: {
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

// SUB-COMPONENT 2: CARD STATS METRIC PHẲNG LÌ
function StatsMetricCard({ title, value, sub, icon: Icon, color }: any) {
  const colors: Record<string, string> = {
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100/40",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100/40",
    amber: "text-amber-600 bg-amber-50 border-amber-100/40",
    rose: "text-rose-600 bg-rose-50 border-rose-100/40",
  };

  return (
    <div className="bg-white p-4 border border-slate-200/80 rounded-xl flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
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
