"use client";

import React from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  FileText,
  Zap,
  ShieldCheck,
  Wrench,
  MoreVertical,
  CalendarDays,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

// Dữ liệu phân bổ chi phí
const expenseCategoryData = [
  { name: "Điện & Nước chung", value: 45, color: "#3b82f6" },
  { name: "Bảo trì kỹ thuật", value: 25, color: "#10b981" },
  { name: "Vệ sinh & Rác", value: 15, color: "#f59e0b" },
  { name: "An ninh & BV", value: 15, color: "#ef4444" },
];

const budgetData = [
  { name: "Tháng 1", spent: 85, budget: 100 },
  { name: "Tháng 2", spent: 110, budget: 100 },
  { name: "Tháng 3", spent: 95, budget: 100 },
];

export default function ExpensesReport() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-slate-50/50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Chi phí vận hành
          </h2>
          <p className="text-sm text-slate-500">
            Quản lý và tối ưu dòng tiền chi ra của tòa nhà
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white">
            <CalendarDays className="mr-2 h-4 w-4" /> Tháng 03/2026
          </Button>
          <Button className="bg-slate-900 hover:bg-slate-800">
            <Plus className="mr-2 h-4 w-4" /> Tạo phiếu chi
          </Button>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="pb-2">
            <CardDescription>Tổng chi tháng này</CardDescription>
            <CardTitle className="text-3xl font-bold">124.500.000đ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-red-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              Tăng 8.2% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="pb-2">
            <CardDescription>Ngân sách còn lại</CardDescription>
            <CardTitle className="text-3xl font-bold text-green-600">
              15.500.000đ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={88} className="h-2 mb-2" />
            <p className="text-[10px] text-slate-500 uppercase font-medium">
              Đã dùng 88% hạn mức
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="pb-2">
            <CardDescription>Chi phí bảo trì dự kiến</CardDescription>
            <CardTitle className="text-3xl font-bold text-slate-700">
              42.000.000đ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-slate-500">
              <Wrench className="mr-1 h-3 w-3" /> 3 hạng mục trong tuần tới
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Pie Chart: Tỷ trọng chi phí */}
        <Card className="lg:col-span-3 border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Phân bổ chi phí</CardTitle>
            <CardDescription>
              Cơ cấu chi tiêu trong tháng hiện tại
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {expenseCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* List: Danh sách phiếu chi */}
        <Card className="lg:col-span-4 border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Lịch sử phiếu chi</CardTitle>
              <CardDescription>Các giao dịch chi tiền gần đây</CardDescription>
            </div>
            <div className="relative w-48">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Tìm kiếm..." className="pl-8 h-9 text-sm" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Hạng mục</TableHead>
                  <TableHead>Ngày chi</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    id: "PC001",
                    cat: "Điện (Công cộng)",
                    date: "28/03/2026",
                    amount: "12.450k",
                    status: "Hoàn tất",
                    icon: <Zap className="h-4 w-4 text-blue-500" />,
                  },
                  {
                    id: "PC002",
                    cat: "Sửa thang máy",
                    date: "25/03/2026",
                    amount: "8.000k",
                    status: "Duyệt",
                    icon: <Wrench className="h-4 w-4 text-emerald-500" />,
                  },
                  {
                    id: "PC003",
                    cat: "Lương bảo vệ",
                    date: "20/03/2026",
                    amount: "45.000k",
                    status: "Hoàn tất",
                    icon: <ShieldCheck className="h-4 w-4 text-red-500" />,
                  },
                  {
                    id: "PC004",
                    cat: "Vật tư vệ sinh",
                    date: "15/03/2026",
                    amount: "2.100k",
                    status: "Chờ duyệt",
                    icon: <FileText className="h-4 w-4 text-slate-500" />,
                  },
                ].map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-100 rounded-md">
                          {item.icon}
                        </div>
                        <span>{item.cat}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {item.date}
                    </TableCell>
                    <TableCell className="font-bold">{item.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "Hoàn tất" ? "secondary" : "outline"
                        }
                        className={
                          item.status === "Chờ duyệt"
                            ? "border-orange-200 text-orange-600 bg-orange-50"
                            : ""
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              variant="ghost"
              className="w-full mt-4 text-slate-500 hover:text-slate-900"
            >
              Xem báo cáo chi tiết theo năm
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
