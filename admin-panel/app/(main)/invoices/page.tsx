"use client";

import React from "react";
import {
  Search,
  Plus,
  FileText,
  MoreVertical,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

// Dữ liệu mẫu hóa đơn
const INVOICES = [
  {
    id: "INV-001",
    room: "101",
    tenant: "Nguyễn Văn A",
    amount: "5.200.000",
    date: "05/03/2026",
    status: "paid",
  },
  {
    id: "INV-002",
    room: "102",
    tenant: "Trần Thị B",
    amount: "4.850.000",
    date: "10/03/2026",
    status: "pending",
  },
  {
    id: "INV-003",
    room: "201",
    tenant: "Lê Văn C",
    amount: "6.100.000",
    date: "01/03/2026",
    status: "overdue",
  },
  {
    id: "INV-004",
    room: "305",
    tenant: "Phạm Minh M",
    amount: "4.500.000",
    date: "12/03/2026",
    status: "pending",
  },
];

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý hóa đơn</h1>
          <p className="text-muted-foreground">
            Theo dõi tình trạng thanh toán và gửi thông báo tiền phòng tháng
            này.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Xuất báo cáo
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Tạo hóa đơn
          </Button>
        </div>
      </div>

      {/* Tabs & Search */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="pending">Chờ thanh toán</TabsTrigger>
            <TabsTrigger value="paid">Đã thu</TabsTrigger>
            <TabsTrigger value="overdue">Quá hạn</TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Tìm hóa đơn, phòng..." className="pl-9" />
          </div>
        </div>

        <TabsContent value="all" className="mt-4 border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Mã HD</TableHead>
                <TableHead>Phòng</TableHead>
                <TableHead>Khách thuê</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium text-blue-600 cursor-pointer hover:underline">
                    {invoice.id}
                  </TableCell>
                  <TableCell>P.{invoice.room}</TableCell>
                  <TableCell>{invoice.tenant}</TableCell>
                  <TableCell className="font-semibold">
                    {invoice.amount}đ
                  </TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" /> Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />{" "}
                          Xác nhận đã thu
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Xóa hóa đơn
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Component hỗ trợ hiển thị Badge trạng thái
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "paid":
      return (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-700 hover:bg-green-100 flex w-fit items-center gap-1"
        >
          <CheckCircle2 className="h-3 w-3" /> Đã thanh toán
        </Badge>
      );
    case "pending":
      return (
        <Badge
          variant="outline"
          className="text-yellow-600 border-yellow-200 bg-yellow-50 flex w-fit items-center gap-1"
        >
          <Clock className="h-3 w-3" /> Chờ thu
        </Badge>
      );
    case "overdue":
      return (
        <Badge variant="destructive" className="flex w-fit items-center gap-1">
          <AlertCircle className="h-3 w-3" /> Quá hạn
        </Badge>
      );
    default:
      return null;
  }
}
