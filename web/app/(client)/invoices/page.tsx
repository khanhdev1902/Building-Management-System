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
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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

interface InvoiceItem {
  id: string;
  code: string;
  title: string;
  month: string;
  dueDate: string;
  amount: number;
  status: "paid" | "unpaid" | "overdue";
  details: { name: string; cost: number; note?: string }[];
}

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
      { name: "Tiền phòng (Phòng 202 - Tòa Danjin)", cost: 3500000 },
      { name: "Tiền điện (300 kWh × 3.500đ)", cost: 1050000 },
      { name: "Tiền nước mạng & Vệ sinh cố định", cost: 200000 },
      { name: "Phí dịch vụ chung cư mini", cost: 100000 },
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
      { name: "Tiền phòng (Phòng 202 - Tòa Danjin)", cost: 3500000 },
      { name: "Tiền điện (240 kWh × 3.500đ)", cost: 840000 },
      { name: "Tiền nước mạng & Vệ sinh cố định", cost: 200000 },
      { name: "Phí dịch vụ chung cư mini", cost: 100000 },
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
      { name: "Tiền phòng (Phòng 202 - Tòa Danjin)", cost: 3500000 },
      { name: "Tiền điện (210 kWh × 3.500đ)", cost: 730000 },
      { name: "Tiền nước mạng & Vệ sinh cố định", cost: 170000 },
      { name: "Phí dịch vụ chung cư mini", cost: 100000 },
    ],
  },
];

export default function Invoice() {
  const [invoices] = useState<InvoiceItem[]>(MOCK_INVOICES);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // KIỂM SOÁT DIALOG TẬP TRUNG TẠI ĐÂY
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

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.code.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "unpaid") return matchesSearch && inv.status !== "paid";
    if (activeTab === "paid") return matchesSearch && inv.status === "paid";
    return matchesSearch;
  });

  // Hàm mở xem chi tiết hóa đơn
  const handleOpenDetails = (invoice: InvoiceItem) => {
    setSelectedInvoice(invoice);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-5 select-none animate-in fade-in-50 duration-300">
      {/* TIÊU ĐỀ TRANG */}
      <div className="flex flex-col gap-0.5">
        <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
          Hóa đơn & Chi phí
        </h1>
        <p className="text-[11px] md:text-xs text-slate-500 font-medium">
          Theo dõi lịch sử đóng tiền phòng và chi phí dịch vụ.
        </p>
      </div>

      {/* TỔNG QUAN TÀI CHÍNH */}
      <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card className="border border-amber-100 shadow-[0_2px_12px_rgba(245,158,11,0.04)] rounded-xl bg-linear-to-br from-amber-50/20 to-white overflow-hidden">
          <CardContent className="p-4.5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600/90">
                Tổng chưa thanh toán
              </span>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                {formatVND(unpaidTotal)}
              </h2>
              <p className="text-[10px] text-amber-700 font-semibold flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" /> Hạn chốt: Ngày 30
                hàng tháng
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0">
              <Receipt className="h-5 w-5 stroke-[1.75]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/70 shadow-2xs rounded-xl bg-white">
          <CardContent className="p-4.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Không gian sống
              </span>
              <h3 className="text-sm md:text-base font-bold text-slate-800 tracking-tight">
                Phòng 202 — Tòa Danjin
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Gốc: {formatVND(3500000)}/tháng
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/70 shadow-2xs rounded-xl bg-white sm:col-span-2 md:col-span-1">
          <CardContent className="p-4.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Kỳ thu hiện tại
              </span>
              <h3 className="text-sm md:text-base font-bold text-slate-800 tracking-tight">
                Tháng 05 / 2026
              </h3>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 shrink-0" /> Đã chốt số điện
                nước ngày 20
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DANH SÁCH CHI TIẾT HÓA ĐƠN */}
      <Card className="border border-slate-200/70 shadow-2xs rounded-xl bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-100 p-4 md:px-6 md:py-4 bg-slate-50/40">
          <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xs md:text-sm font-bold text-slate-800">
                Lịch sử giao dịch chi phí
              </CardTitle>
              <CardDescription className="text-[10px] md:text-[11px] font-medium text-slate-400">
                Danh sách các hóa đơn của phòng bạn.
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-48">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Tìm theo mã, tháng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8.5 pl-8 w-full text-xs bg-white rounded-lg border-slate-200 focus-visible:ring-indigo-500"
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
              <TabsList className="bg-transparent gap-4 md:gap-5 h-10 p-0 rounded-none border-b border-transparent">
                <TabsTrigger
                  value="all"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent text-xs font-semibold text-slate-500 data-[state=active]:text-indigo-600 h-full p-0"
                >
                  Tất cả
                </TabsTrigger>
                <TabsTrigger
                  value="unpaid"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent text-xs font-semibold text-slate-500 data-[state=active]:text-indigo-600 h-full p-0"
                >
                  Chưa thanh toán
                </TabsTrigger>
                <TabsTrigger
                  value="paid"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent text-xs font-semibold text-slate-500 data-[state=active]:text-indigo-600 h-full p-0"
                >
                  Đã thanh toán
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="m-0">
              {/* MOBILE UI */}
              <div className="block md:hidden divide-y divide-slate-100">
                {filteredInvoices.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-400 font-medium">
                    Không tìm thấy hóa đơn nào.
                  </div>
                ) : (
                  filteredInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      onClick={() => handleOpenDetails(inv)}
                      className="p-4 flex items-center justify-between active:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="space-y-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                            {inv.code}
                          </span>
                          {inv.status === "paid" ? (
                            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100/60 shadow-none rounded-md px-1.5 py-0 text-[9px] font-bold">
                              Đã đóng
                            </Badge>
                          ) : (
                            <Badge className="bg-rose-50 text-rose-700 border border-rose-100/60 shadow-none rounded-md px-1.5 py-0 text-[9px] font-bold animate-pulse">
                              Chờ đóng
                            </Badge>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 truncate">
                          {inv.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium">
                          Hạn đóng: {inv.dueDate}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 text-right">
                        <span className="text-xs font-black text-slate-900">
                          {formatVND(inv.amount)}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* DESKTOP UI */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/30 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
                      <th className="px-6 py-3">Mã hóa đơn</th>
                      <th className="px-6 py-3">Tên khoản chi</th>
                      <th className="px-6 py-3">Hạn thanh toán</th>
                      <th className="px-6 py-3">Tổng số tiền</th>
                      <th className="px-6 py-3">Trạng thái</th>
                      <th className="px-6 py-3 text-right">Tương tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
                    {filteredInvoices.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-12 text-slate-400 font-medium"
                        >
                          Không tìm thấy hóa đơn nào trùng khớp.
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices.map((inv) => (
                        <tr
                          key={inv.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 font-mono text-slate-700 font-semibold">
                            {inv.code}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-800">
                                {inv.title}
                              </span>
                              <span className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> {inv.month}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {inv.dueDate}
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-800">
                            {formatVND(inv.amount)}
                          </td>
                          <td className="px-6 py-4">
                            {inv.status === "paid" ? (
                              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-none rounded-md px-2 py-0.5 text-[10px] font-bold">
                                Đã hoàn tất
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-50 text-amber-700 border border-amber-200/60 shadow-none rounded-md px-2 py-0.5 text-[10px] font-bold animate-pulse">
                                Chờ đóng tiền
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              size="sm"
                              variant={
                                inv.status === "paid" ? "ghost" : "outline"
                              }
                              onClick={() => handleOpenDetails(inv)}
                              className={`h-8 rounded-lg text-xs font-semibold ${inv.status !== "paid" ? "border-indigo-200 text-indigo-600 hover:bg-indigo-50/40 hover:border-indigo-300" : "text-slate-500"}`}
                            >
                              {inv.status === "paid"
                                ? "Xem chi tiết"
                                : "Thanh toán ngay"}
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

      {/* DIALOG GỐC ĐƯỢC ĐƯA RA NGOÀI VÀ QUẢN LÝ BẰNG STATE TẬP TRUNG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[92%] sm:max-w-115 bg-white rounded-xl border border-slate-200 p-5 md:p-6 select-none focus-visible:outline-none">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-sm md:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Receipt className="h-4.5 w-4.5 text-indigo-600" /> Chi tiết hóa
              đơn chi phí
            </DialogTitle>
            <DialogDescription className="text-[11px] md:text-xs text-slate-400">
              Mã số: {selectedInvoice?.code} — Định kỳ {selectedInvoice?.month}
            </DialogDescription>
          </DialogHeader>

          <div className="py-2.5 space-y-3.5">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-2.5 divide-y divide-slate-100/70">
              {selectedInvoice?.details.map((detail, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start gap-4 text-[11px] md:text-xs pt-2.5 first:pt-0"
                >
                  <span className="text-slate-500 font-medium leading-normal">
                    {detail.name}
                  </span>
                  <span className="text-slate-800 font-semibold shrink-0">
                    {formatVND(detail.cost)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center px-1">
              <span className="text-[11px] md:text-xs font-bold text-slate-800">
                Tổng cộng thanh toán
              </span>
              <span className="text-sm md:text-base font-extrabold text-indigo-600 tracking-tight">
                {selectedInvoice ? formatVND(selectedInvoice.amount) : "0đ"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            {selectedInvoice?.status !== "paid" ? (
              <div className="space-y-3 text-center">
                <p className="text-[10px] md:text-[11px] text-slate-400 font-medium">
                  Quét mã VietQR để thanh toán nhanh qua ứng dụng Ngân hàng
                </p>
                <div className="mx-auto h-36 w-36 md:h-40 md:w-40 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col items-center justify-center p-2 shadow-inner">
                  <QrCode className="h-28 w-28 md:h-32 md:w-32 text-slate-800 stroke-[1.25]" />
                </div>
                <div className="text-[10px] text-slate-400 font-mono bg-slate-50 py-2 px-3 rounded-lg border border-slate-100 text-left space-y-0.5">
                  <div>
                    • Ngân hàng:{" "}
                    <span className="font-bold text-slate-700">MBBank</span>
                  </div>
                  <div>
                    • Số TK:{" "}
                    <span className="font-bold text-slate-700">0987654321</span>
                  </div>
                  <div>
                    • Nội dung:{" "}
                    <span className="font-bold text-indigo-600">
                      DANJIN P202 T5
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8.5 rounded-lg text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" /> Tải hóa đơn PDF
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
