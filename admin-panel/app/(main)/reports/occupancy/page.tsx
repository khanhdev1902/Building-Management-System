"use client";

import React from "react";
import {
  Home,
  UserMinus,
  UserPlus,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  LayoutGrid,
  History,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
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

const occupancyHistory = [
  { month: "T10", rate: 85 },
  { month: "T11", rate: 88 },
  { month: "T12", rate: 92 },
  { month: "T1", rate: 95 },
  { month: "T2", rate: 90 },
  { month: "T3", rate: 94 },
];

const statusData = [
  { name: "Đang ở", value: 82, color: "#10b981" },
  { name: "Phòng trống", value: 12, color: "#e2e8f0" },
  { name: "Đã cọc", value: 4, color: "#3b82f6" },
  { name: "Đang sửa", value: 2, color: "#f59e0b" },
];

export default function OccupancyReport() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-slate-50/50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Lấp đầy & Biến động
          </h2>
          <p className="text-sm text-slate-500">
            Phân tích hiệu suất khai thác phòng và xu hướng cư dân
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <History className="mr-2 h-4 w-4" /> Lịch sử trống
          </Button>
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <LayoutGrid className="mr-2 h-4 w-4" /> Sơ đồ mặt bằng
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ lấp đầy</CardTitle>
            <Home className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">94.2%</div>
            <div className="flex items-center text-xs text-emerald-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +2.4% tháng này
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Khách mới (Check-in)
            </CardTitle>
            <UserPlus className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <p className="text-xs text-slate-500 mt-1">
              8 hộ gia đình, 10 cá nhân
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Rời đi (Check-out)
            </CardTitle>
            <UserMinus className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-xs text-slate-500 mt-1">
              Tỷ lệ rời đi (Churn): 1.2%
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Thời gian trống TB
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.2 ngày</div>
            <p className="text-xs text-slate-500 mt-1">
              Tốc độ lấp đầy cực nhanh
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Area Chart: Xu hướng lấp đầy */}
        <Card className="lg:col-span-4 border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Biến động 6 tháng qua</CardTitle>
            <CardDescription>
              Tỷ lệ lấp đầy ổn định trên mức 90%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancyHistory}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    stroke="#64748b"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    stroke="#64748b"
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                    formatter={(value) => [`${value}%`, "Tỷ lệ lấp đầy"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRate)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart: Trạng thái hiện tại */}
        <Card className="lg:col-span-3 border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Hiện trạng căn hộ</CardTitle>
            <CardDescription>Tổng số: 240 căn hộ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {statusData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Table: Danh sách phòng sắp trống */}
        <Card className="lg:col-span-7 border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">
              Phòng sắp hết hạn hợp đồng (30 ngày tới)
            </CardTitle>
            <CardDescription>
              Cần liên hệ gia hạn hoặc tìm khách mới
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead>Mã phòng</TableHead>
                  <TableHead>Chủ hộ</TableHead>
                  <TableHead>Ngày hết hạn</TableHead>
                  <TableHead>Tình trạng gia hạn</TableHead>
                  <TableHead>Dự kiến biến động</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    room: "P.2104",
                    name: "Trần Thế Vinh",
                    end: "15/04/2026",
                    status: "Chờ phản hồi",
                    trend: "Có thể rời đi",
                  },
                  {
                    room: "P.0512",
                    name: "Lê Minh Anh",
                    end: "20/04/2026",
                    status: "Đồng ý gia hạn",
                    trend: "Ở tiếp",
                  },
                  {
                    room: "P.1102",
                    name: "Hoàng Văn Dũng",
                    end: "28/04/2026",
                    status: "Chưa liên hệ",
                    trend: "Chưa xác định",
                  },
                  {
                    room: "P.0908",
                    name: "Phạm Thu Hà",
                    end: "30/04/2026",
                    status: "Yêu cầu trả phòng",
                    trend: "Sắp trống",
                  },
                ].map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-bold">{item.room}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-slate-500">{item.end}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-white">
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          item.trend === "Ở tiếp"
                            ? "bg-green-50 text-green-600"
                            : item.trend === "Sắp trống"
                              ? "bg-red-50 text-red-600"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.trend}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
