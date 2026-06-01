/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Receipt,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Search,
  Download,
  QrCode,
  ChevronRight,
  Copy,
  Building2,
  ArrowUpRight,
  Info,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { toast } from "sonner";

interface InvoiceItem {
  id: string;
  code: string;
  title: string;
  month: string;
  dueDate: string;
  amount: number;
  status: "paid" | "unpaid";
  details: {
    name: string;
    cost: number;
    type: "BASE" | "USAGE" | "DEDUCTION";
  }[];
}

// DỮ LIỆU ĐƯỢC CHUẨN HÓA SÁT THỰC TẾ (CÓ BÙ TRỪ KHẤU TRỪ DÒNG TIỀN)
const MOCK_INVOICES: InvoiceItem[] = [
  {
    id: "inv-1",
    code: "INV-2026-05",
    title: "Hóa đơn tổng hợp tháng 05/2026",
    month: "Tháng 05, 2026",
    dueDate: "30/05/2026",
    amount: 4850000,
    status: "unpaid",
    details: [
      {
        name: "Tiền phòng (Phòng 202 — Tòa Danjin)",
        cost: 3500000,
        type: "BASE",
      },
      { name: "Tiền điện (300 kWh × 3.500đ)", cost: 1050000, type: "USAGE" },
      { name: "Tiền nước, mạng & Vệ sinh cố định", cost: 200000, type: "BASE" },
      { name: "Phí dịch vụ chung cư mini", cost: 100000, type: "BASE" },
      { name: "Khấu trừ tiền thừa kỳ trước", cost: -100000, type: "DEDUCTION" }, // Khấu trừ tiền thừa thực tế
    ],
  },
  {
    id: "inv-2",
    code: "INV-2026-04",
    title: "Hóa đơn tổng hợp tháng 04/2026",
    month: "Tháng 04, 2026",
    dueDate: "30/04/2026",
    amount: 4620000,
    status: "paid",
    details: [
      {
        name: "Tiền phòng (Phòng 202 — Tòa Danjin)",
        cost: 3500000,
        type: "BASE",
      },
      { name: "Tiền điện (240 kWh × 3.500đ)", cost: 840000, type: "USAGE" },
      { name: "Tiền nước, mạng & Vệ sinh cố định", cost: 200000, type: "BASE" },
      { name: "Phí dịch vụ chung cư mini", cost: 100000, type: "BASE" },
    ],
  },
  {
    id: "inv-3",
    code: "INV-2026-03",
    title: "Hóa đơn tổng hợp tháng 03/2026",
    month: "Tháng 03, 2026",
    dueDate: "30/03/2026",
    amount: 4500000,
    status: "paid",
    details: [
      {
        name: "Tiền phòng (Phòng 202 — Tòa Danjin)",
        cost: 3500000,
        type: "BASE",
      },
      { name: "Tiền điện (210 kWh × 3.500đ)", cost: 730000, type: "USAGE" },
      { name: "Tiền nước, mạng & Vệ sinh cố định", cost: 170000, type: "BASE" },
      { name: "Phí dịch vụ chung cư mini", cost: 100000, type: "BASE" },
    ],
  },
];

export default function Invoice() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(MOCK_INVOICES);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(
    null,
  );

  const unpaidTotal = invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleCopyText = (text: string, msg: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`✓ Đã sao chép ${msg}`);
  };

  // Giả lập Webhook đóng tiền nhảy số realtime cực phê
  const handleSimulatePayment = () => {
    if (!selectedInvoice) return;
    toast.loading("Đang xác thực giao dịch qua cổng VietQR...");
    setTimeout(() => {
      setInvoices((prev) =>
        prev.map((item) =>
          item.id === selectedInvoice.id ? { ...item, status: "paid" } : item,
        ),
      );
      setIsDialogOpen(false);
      toast.success(
        `✓ Đã quyết toán thành công hóa đơn mã ${selectedInvoice.code}! Hệ thống đã tự động lập phiếu thu tương ứng.`,
      );
    }, 1200);
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.code.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "unpaid") return matchesSearch && inv.status !== "paid";
    if (activeTab === "paid") return matchesSearch && inv.status === "paid";
    return matchesSearch;
  });

  const handleOpenDetails = (invoice: InvoiceItem) => {
    setSelectedInvoice(invoice);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-5 select-none antialiased font-sans max-w-5xl mx-auto pb-24 md:pb-6">
      {/* 1. TIÊU ĐỀ TRANG DẸT MỊN */}
      <div className="flex flex-col gap-0.5 border-b border-slate-100 pb-4">
        <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Receipt className="w-5 h-5 text-slate-900 stroke-[2.2]" />
          Hóa đơn & Chi phí dịch vụ
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Theo dõi lịch sử đóng tiền phòng, chỉ số hao phí công tơ và biên lai
          tất toán hằng tháng.
        </p>
      </div>

      {/* 2. KHỐI TỔNG QUAN TÀI CHÍNH (GIỮ NGUYÊN PHÔI GỐC - ĐỘT PHÁ UI) */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card className="border border-rose-100 shadow-2xs rounded-xl bg-linear-to-br from-rose-50/10 to-white overflow-hidden">
          <CardContent className="p-4.5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">
                Tổng chưa thanh toán
              </span>
              <h2 className="text-xl md:text-2xl font-mono font-black text-rose-600 tracking-tight">
                {formatVND(unpaidTotal)}
              </h2>
              <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0 text-rose-500" /> Hạn
                chốt: Ngày 05 hàng tháng
              </p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-rose-50 border border-rose-100/50 flex items-center justify-center text-rose-500 shrink-0">
              <Receipt className="h-4 w-4 stroke-[2]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-3xs rounded-xl bg-white">
          <CardContent className="p-4.5 flex items-center justify-between h-full">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Không gian lưu trú
              </span>
              <h3 className="text-xs md:text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" /> Phòng 202 —
                Tòa Danjin
              </h3>
              <p className="text-[11px] text-slate-400 font-medium font-mono">
                Giá gốc: {formatVND(3500000)}/tháng
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-3xs rounded-xl bg-white sm:col-span-2 md:col-span-1">
          <CardContent className="p-4.5 flex items-center justify-between h-full">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Kỳ đối soát dữ liệu
              </span>
              <h3 className="text-xs md:text-sm font-bold text-slate-800 tracking-tight">
                Tháng 05 / 2026
              </h3>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 shrink-0 stroke-[2.5]" /> Đã
                chốt số điện nước ngày 20
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. DANH SÁCH CHI TIẾT HÓA ĐƠN ĐƯỢC QUY HOẠCH TINH TẾ */}
      <Card className="border border-slate-100 shadow-3xs rounded-xl bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-50 p-4 md:px-6 bg-slate-50/20">
          <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-xs md:text-sm font-bold text-slate-900 uppercase tracking-wide">
                Sổ cái chi phí hằng tháng
              </CardTitle>
              <CardDescription className="text-[11px] font-medium text-slate-400">
                Danh sách toàn bộ hóa đơn gốc và chứng từ biên lai điện tử của
                phòng.
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-52">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Tìm mã số, tên tháng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8.5 pl-8 w-full text-xs bg-white rounded-lg border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-900 focus-visible:border-slate-900 placeholder:font-normal font-semibold text-slate-800"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs
            defaultValue="all"
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="border-b border-slate-100 px-4 md:px-6 bg-white overflow-x-auto scrollbar-none">
              <TabsList className="bg-transparent gap-5 h-10 p-0 rounded-none w-full justify-start">
                {["all", "unpaid", "paid"].map((status) => (
                  <TabsTrigger
                    key={status}
                    value={status}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent text-xs font-bold text-slate-400 data-[state=active]:text-slate-900 h-full p-0 cursor-pointer capitalize transition-all"
                  >
                    {status === "all"
                      ? "Tất cả chứng từ"
                      : status === "unpaid"
                        ? "Chưa thanh toán"
                        : "Biên lai lịch sử"}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="m-0">
              {/* 📊 MOBILE CONTAINER VIEW: CHUYỂN THÀNH LIST CARD KHÔNG DÙNG TABLE ĐỂ TRÁNH TRÀN MÀN HÌNH */}
              <div className="block md:hidden divide-y divide-slate-50">
                {filteredInvoices.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-400 font-medium italic">
                    Không tìm thấy chứng từ hóa đơn nào phù hợp.
                  </div>
                ) : (
                  filteredInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      onClick={() => handleOpenDetails(inv)}
                      className="p-4 flex items-center justify-between active:bg-slate-50 transition-colors cursor-pointer gap-2"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200/50 px-1.5 py-0.5 rounded">
                            {inv.code}
                          </span>
                          {inv.status === "paid" ? (
                            <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100/60 shadow-none rounded px-1.5 py-0 text-[9px] font-bold uppercase tracking-tight">
                              Tất toán
                            </Badge>
                          ) : (
                            <Badge className="bg-rose-50 text-rose-600 border border-rose-100/60 shadow-none rounded px-1.5 py-0 text-[9px] font-bold uppercase tracking-tight animate-pulse">
                              Chờ nộp
                            </Badge>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {inv.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <Calendar size={11} /> Hạn chốt: {inv.dueDate}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 text-right">
                        <span
                          className={`text-xs font-mono font-black ${inv.status === "unpaid" ? "text-rose-600" : "text-slate-900"}`}
                        >
                          {formatVND(inv.amount)}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 🖥️ DESKTOP CONTAINER VIEW: RENDER BẢNG CHUẨN ERP KHI HIỂN THỊ MÀN HÌNH TO */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/30 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
                      <th className="px-6 py-3 w-[15%]">Mã hóa đơn</th>
                      <th className="px-6 py-3 w-[40%]">Nội dung chi tiết</th>
                      <th className="px-6 py-3 w-[15%]">Hạn đóng</th>
                      <th className="px-6 py-3 w-[15%]">Tổng số tiền</th>
                      <th className="px-6 py-3 w-[15%] text-right pr-8">
                        Tác vụ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs text-slate-600 font-semibold">
                    {filteredInvoices.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-12 text-slate-400 italic font-medium"
                        >
                          Không tìm thấy dữ liệu hóa đơn nào trùng khớp.
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices.map((inv) => (
                        <tr
                          key={inv.id}
                          className="hover:bg-slate-50/40 transition-colors group"
                        >
                          <td className="px-6 py-4 font-mono text-slate-900 font-bold">
                            {inv.code}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-slate-900 font-bold">
                                {inv.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> Chốt số điện
                                nước định kỳ {inv.month}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-mono font-medium">
                            {inv.dueDate}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`font-mono font-black text-sm ${inv.status === "unpaid" ? "text-rose-600" : "text-slate-900"}`}
                            >
                              {formatVND(inv.amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right pr-6">
                            <Button
                              size="sm"
                              variant={
                                inv.status === "paid" ? "ghost" : "outline"
                              }
                              onClick={() => handleOpenDetails(inv)}
                              className={`h-7.5 rounded-lg text-[11px] font-bold uppercase tracking-wider px-3 cursor-pointer shadow-none transition-all ${
                                inv.status !== "paid"
                                  ? "border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                                  : "text-slate-400 hover:bg-slate-100"
                              }`}
                            >
                              {inv.status === "paid"
                                ? "Xem biên lai"
                                : "Nộp tiền ngay"}
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 4. DIALOG PHÔI THANH TOÁN QR & BÓC TÁCH PHÍ ĐỒNG BỘ CHẶT CHẼ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md bg-white rounded-xl border border-slate-100 p-5 md:p-6 shadow-2xl overflow-hidden font-sans flex flex-col animate-in fade-in zoom-in-95 duration-200 focus-visible:outline-none">
          <DialogHeader className="space-y-1 text-left border-b border-slate-50 pb-3">
            <div className="flex justify-between items-center pr-6 w-full">
              <DialogTitle className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Receipt className="h-4.5 w-4.5 text-rose-500 stroke-[2.2]" />{" "}
                Bảng kê khai phí phòng
              </DialogTitle>
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                {selectedInvoice?.code}
              </span>
            </div>
            <DialogDescription className="text-[11px] text-slate-400 font-medium">
              Cơ sở hạch toán chi phí sử dụng định kỳ {selectedInvoice?.month}
            </DialogDescription>
          </DialogHeader>

          {/* Khối bóc tách dòng tiền có chứa cấu trúc âm dương */}
          <div className="py-1 space-y-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3 space-y-2.5 divide-y divide-slate-100/60 font-semibold text-xs text-slate-700">
              {selectedInvoice?.details.map((detail, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start gap-4 pt-2.5 first:pt-0"
                >
                  <span
                    className={`font-medium leading-normal ${detail.type === "DEDUCTION" ? "text-emerald-600" : "text-slate-500"}`}
                  >
                    {detail.type === "DEDUCTION" ? "✨ " : "• "}
                    {detail.name}
                  </span>
                  <span
                    className={`font-mono font-bold shrink-0 ${detail.type === "DEDUCTION" ? "text-emerald-600" : "text-slate-900"}`}
                  >
                    {detail.cost > 0 ? "" : "-"}
                    {Math.abs(detail.cost).toLocaleString("vi-VN")}đ
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center p-1 font-bold border-t border-slate-100 pt-3">
              <span className="text-[11px] md:text-xs uppercase tracking-wider text-slate-900">
                Tổng giá trị quyết toán
              </span>
              <span
                className={`text-base font-mono font-black ${selectedInvoice?.status === "unpaid" ? "text-rose-600" : "text-slate-900"}`}
              >
                {selectedInvoice ? formatVND(selectedInvoice.amount) : "0đ"}
              </span>
            </div>
          </div>

          {/* Khối cổng VietQR thông minh dành cho Mobile */}
          <div className="pt-2 border-t border-slate-50 mt-1">
            {selectedInvoice?.status !== "paid" ? (
              <div className="space-y-3.5 text-center">
                <p className="text-[10.5px] text-slate-400 font-semibold bg-rose-50/50 border border-rose-100/40 py-1.5 px-2 rounded-lg leading-relaxed flex items-center justify-center gap-1">
                  <Info size={12} className="text-rose-500 shrink-0" /> Chụp màn
                  hình mã QR hoặc copy cú pháp bên dưới để nộp quỹ tự động.
                </p>

                {/* Khung QR dẹt mịn Luxury */}
                <div className="mx-auto h-40 w-40 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center justify-center p-2.5 shadow-inner relative group">
                  <QrCode className="h-32 w-32 text-slate-900 stroke-[1.2] transition-transform duration-300 group-hover:scale-102" />
                </div>

                {/* Bảng thông tin text an toàn để chạm copy nhanh bằng một tay */}
                <div className="text-[11px] text-slate-600 font-semibold font-mono bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-left space-y-1.5 shadow-2xs">
                  <div className="flex justify-between border-b border-white pb-1">
                    <span className="text-slate-400 font-normal">
                      Ngân hàng:
                    </span>
                    <span className="text-slate-800">MB BANK (Quân Đội)</span>
                  </div>
                  <div className="flex justify-between border-b border-white pb-1">
                    <span className="text-slate-400 font-normal">
                      Số tài khoản:
                    </span>
                    <button
                      onClick={() =>
                        handleCopyText("0987654321", "số tài khoản")
                      }
                      className="text-slate-800 flex items-center gap-1 hover:text-slate-900 cursor-pointer font-bold"
                    >
                      0987654321 <Copy size={11} className="text-slate-400" />
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-normal">
                      Cú pháp ghi chú:
                    </span>
                    <button
                      onClick={() =>
                        handleCopyText(
                          `DANJIN P202 ${selectedInvoice?.code}`,
                          "cú pháp ghi chú",
                        )
                      }
                      className="text-rose-600 flex items-center gap-1 hover:text-rose-700 cursor-pointer font-bold"
                    >
                      DANJIN P202 {selectedInvoice?.code}{" "}
                      <Copy size={11} className="text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Thanh Action Button tất toán thử nghiệm */}
                <div className="flex gap-2 pt-1 w-full">
                  <Button
                    variant="ghost"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 h-9 text-xs text-slate-400 hover:text-slate-600 font-bold rounded-lg cursor-pointer"
                  >
                    Đóng lại
                  </Button>
                  <Button
                    onClick={handleSimulatePayment}
                    className="flex-1 h-9 text-xs font-black bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm uppercase tracking-wider cursor-pointer"
                  >
                    Tôi đã chuyển khoản
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 w-full">
                <Button
                  variant="ghost"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 h-9 text-xs text-slate-400 hover:text-slate-600 font-bold rounded-lg cursor-pointer"
                >
                  Đóng lại
                </Button>
                <Button
                  onClick={() =>
                    toast.success(
                      "✓ Đã lưu lệnh in biên lai điện tử điện hồ sơ.",
                    )
                  }
                  className="flex-1 h-9 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider shadow-sm"
                >
                  <Download className="h-3.5 w-3.5" /> Xuất biên lai PDF
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
