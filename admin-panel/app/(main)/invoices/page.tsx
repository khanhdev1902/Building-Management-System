/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Receipt,
  Search,
  Filter,
  FileDown,
  Mail,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Send,
  Printer,
  CreditCard,
  QrCode,
  ArrowUpRight,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/shared/components/ui/card";
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
import { Checkbox } from "@/shared/components/ui/checkbox"; // Giả định có shadcn checkbox

// Mock Data
const mockInvoices = [
  {
    id: "INV-2026-001",
    room: "A-101",
    tenant: "Nguyễn Văn A",
    amount: 5450000,
    dueDate: "05/04/2026",
    status: "Paid", // Paid, Pending, Overdue
    type: "Hợp đồng",
    updatedAt: "2 giờ trước",
  },
  {
    id: "INV-2026-002",
    room: "B-205",
    tenant: "Trần Thị B",
    amount: 1250000,
    dueDate: "05/04/2026",
    status: "Pending",
    type: "Điện nước",
    updatedAt: "5 giờ trước",
  },
  {
    id: "INV-2026-003",
    room: "A-502",
    tenant: "Lê Văn C",
    amount: 8900000,
    dueDate: "25/03/2026",
    status: "Overdue",
    type: "Tổng hợp",
    updatedAt: "1 ngày trước",
  },
];

export default function InvoiceManagementPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  return (
    <div className="p-4 md:p-8 max-w-400 mx-auto space-y-6 bg-[#f8fafc] min-h-screen">
      {/* 1. Header & Tổng quan */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-indigo-600" />
            Quản lý Hóa đơn & Công nợ
          </h1>
          <p className="text-sm text-slate-500">
            Tháng 03/2026 • 120 hóa đơn đã phát hành
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none gap-2">
            <Printer className="w-4 h-4" /> In hàng loạt
          </Button>
          <Button className="flex-1 md:flex-none gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
            <Plus className="w-4 h-4" /> Tạo hóa đơn lẻ
          </Button>
        </div>
      </div>

      {/* 2. Thống kê nhanh (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Tổng doanh thu"
          value="1.24 tỷ"
          subValue="+12% so với tháng trước"
          icon={CreditCard}
          color="indigo"
        />
        <StatsCard
          title="Đã thu hồi"
          value="840 tr"
          subValue="68% tiến độ"
          icon={CheckCircle2}
          color="green"
        />
        <StatsCard
          title="Nợ chờ xử lý"
          value="320 tr"
          subValue="45 hóa đơn"
          icon={Clock}
          color="amber"
        />
        <StatsCard
          title="Nợ quá hạn"
          value="85 tr"
          subValue="Cần nhắc nợ ngay"
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* 3. Bộ lọc & Toolbar */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Tìm mã số, phòng, tên cư dân..."
              className="pl-10 bg-slate-50 border-none"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <Button
              variant="ghost"
              size="sm"
              className="text-indigo-600 font-semibold bg-indigo-50"
            >
              Tất cả
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-500">
              Chưa thanh toán
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-500">
              Quá hạn
            </Button>
            <div className="w-px h-6 bg-slate-200 mx-2" />
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" /> Lọc thêm
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <FileDown className="w-4 h-4" /> Xuất Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4. Danh sách hóa đơn */}
      <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
        {selectedInvoices.length > 0 && (
          <div className="bg-indigo-600 p-3 flex items-center justify-between text-white animate-in slide-in-from-top-4">
            <span className="text-sm font-medium">
              Đang chọn {selectedInvoices.length} hóa đơn
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="gap-2 text-indigo-700"
              >
                <Send className="w-3.5 h-3.5" /> Gửi thông báo nợ
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="gap-2 text-indigo-700"
              >
                <QrCode className="w-3.5 h-3.5" /> Tạo mã QR gộp
              </Button>
            </div>
          </div>
        )}
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-12.5">
                <Checkbox />
              </TableHead>
              <TableHead>Mã hóa đơn</TableHead>
              <TableHead>Phòng & Cư dân</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Hạn thanh toán</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockInvoices.map((inv) => (
              <TableRow
                key={inv.id}
                className="group hover:bg-slate-50/50 transition-colors"
              >
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="font-mono text-xs font-bold text-slate-500">
                  {inv.id}
                </TableCell>
                <TableCell>
                  <div className="font-bold text-slate-800">{inv.room}</div>
                  <div className="text-xs text-slate-400">{inv.tenant}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="font-normal text-[10px] uppercase tracking-wider"
                  >
                    {inv.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-bold text-slate-900">
                  {inv.amount.toLocaleString("vi-VN")} đ
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-600">{inv.dueDate}</div>
                  {inv.status === "Overdue" && (
                    <div className="text-[10px] text-red-500 font-medium">
                      Đã trễ 4 ngày
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={inv.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                      title="Gửi email/Zalo"
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="gap-2">
                          <ArrowUpRight className="w-4 h-4" /> Chi tiết hóa đơn
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-green-600">
                          <CheckCircle2 className="w-4 h-4" /> Xác nhận thanh
                          toán
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2">
                          <QrCode className="w-4 h-4" /> Xem mã QR thu tiền
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600">
                          Hủy hóa đơn
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// Sub-component: Badge trạng thái
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Paid: "bg-green-100 text-green-700 border-green-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Overdue: "bg-red-100 text-red-700 border-red-200",
  };
  const labels: Record<string, string> = {
    Paid: "Đã thu tiền",
    Pending: "Chờ thanh toán",
    Overdue: "Quá hạn",
  };

  return (
    <Badge
      className={`${styles[status]} border shadow-none px-2 py-0.5 rounded-full text-[11px]`}
    >
      {labels[status]}
    </Badge>
  );
}

// Sub-component: Card thống kê
function StatsCard({ title, value, subValue, icon: Icon, color }: any) {
  const colors: any = {
    indigo: "text-indigo-600 bg-indigo-50",
    green: "text-green-600 bg-green-50",
    amber: "text-amber-600 bg-amber-50",
    red: "text-red-600 bg-red-50",
  };

  return (
    <Card className="border-none shadow-sm bg-white">
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          <p className="text-[10px] text-slate-400 mt-1">{subValue}</p>
        </div>
        <div className={`p-3 rounded-2xl ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </CardContent>
    </Card>
  );
}
