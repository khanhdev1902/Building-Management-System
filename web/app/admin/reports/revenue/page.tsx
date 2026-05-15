"use client";

import React from "react";
import {
  Banknote,
  Download,
  Filter,
  MoreHorizontal,
  CreditCard,
  ArrowUpRight,
  TrendingUp,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Import shadcn (giả định bạn đã cài)
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const monthlyData = [
  { name: "T1", revenue: 120, debt: 15 },
  { name: "T2", revenue: 150, debt: 10 },
  { name: "T3", revenue: 180, debt: 45 },
  { name: "T4", revenue: 140, debt: 20 },
  { name: "T5", revenue: 190, debt: 12 },
  { name: "T6", revenue: 210, debt: 8 },
];

export default function RevenueDashboard() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-slate-50/50">
      {/* Header Area */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Tài chính & Công nợ
          </h2>
          <div className="flex items-center text-slate-500 mt-1">
            <span className="text-sm">
              Báo cáo cập nhật lần cuối: 10 phút trước
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Lọc kỳ hạn
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" /> Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white border">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="invoices">Danh sách hóa đơn</TabsTrigger>
          <TabsTrigger value="debts">Phân tích nợ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Top Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-sm border-none ring-1 ring-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Tổng thực thu
                </CardTitle>
                <Banknote className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  452.230.000đ
                </div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="mr-1 h-3 w-3" /> +20.1% so với tháng
                  trước
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-none ring-1 ring-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Nợ quá hạn
                </CardTitle>
                <CreditCard className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  38.400.000đ
                </div>
                <div className="flex mt-2 gap-1">
                  <Badge variant="destructive" className="text-[10px]">
                    Cảnh báo cao
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-none ring-1 ring-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Tỷ lệ thanh toán
                </CardTitle>
                <ArrowUpRight className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">92.4%</div>
                <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[92%]" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-none ring-1 ring-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Hóa đơn chờ
                </CardTitle>
                <FileText className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">24</div>
                <p className="text-xs text-slate-500 mt-1">
                  Đã gửi nhắc nợ 12 hộ
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Chart */}
            <Card className="lg:col-span-4 shadow-sm border-none ring-1 ring-slate-200">
              <CardHeader>
                <CardTitle>Dòng tiền theo tháng</CardTitle>
                <CardDescription>
                  So sánh giữa số tiền phải thu và thực thu (triệu VNĐ)
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-87.5">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="name"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        stroke="#64748b"
                      />
                      <YAxis
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        stroke="#64748b"
                        tickFormatter={(v) => `${v}M`}
                      />
                      <Tooltip
                        cursor={{ fill: "#f8fafc" }}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                        }}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                        name="Thực thu"
                      />
                      <Bar
                        dataKey="debt"
                        fill="#e2e8f0"
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                        name="Còn nợ"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Invoices Table */}
            <Card className="lg:col-span-3 shadow-sm border-none ring-1 ring-slate-200">
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-1">
                  <CardTitle>Giao dịch gần đây</CardTitle>
                  <CardDescription>
                    Có 120 giao dịch trong tháng này.
                  </CardDescription>
                </div>
                <Button size="sm" variant="ghost" className="ml-auto">
                  Xem tất cả
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="w-25">Phòng</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        id: "101",
                        room: "P.402",
                        amount: "5.200.000",
                        status: "Paid",
                      },
                      {
                        id: "102",
                        room: "P.901",
                        amount: "8.150.000",
                        status: "Pending",
                      },
                      {
                        id: "103",
                        room: "P.205",
                        amount: "4.000.000",
                        status: "Overdue",
                      },
                      {
                        id: "104",
                        room: "P.110",
                        amount: "12.000.000",
                        status: "Paid",
                      },
                      {
                        id: "105",
                        room: "P.303",
                        amount: "2.450.000",
                        status: "Paid",
                      },
                    ].map((inv) => (
                      <TableRow
                        key={inv.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <TableCell className="font-medium text-slate-900">
                          {inv.room}
                        </TableCell>
                        <TableCell>{inv.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              inv.status === "Paid"
                                ? "secondary"
                                : inv.status === "Pending"
                                  ? "outline"
                                  : "destructive"
                            }
                            className="text-[10px] font-semibold uppercase tracking-wider"
                          >
                            {inv.status === "Paid"
                              ? "Đã thu"
                              : inv.status === "Pending"
                                ? "Chờ"
                                : "Nợ"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                              <DropdownMenuItem className="text-blue-600">
                                Gửi nhắc nợ
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
