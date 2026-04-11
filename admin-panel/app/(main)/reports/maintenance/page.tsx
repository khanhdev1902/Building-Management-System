"use client";

import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  ArrowUpRight,
  Settings2,
  Construction,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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

const maintenanceStats = [
  { name: "Tuần 1", requests: 12, completed: 10 },
  { name: "Tuần 2", requests: 18, completed: 15 },
  { name: "Tuần 3", requests: 15, completed: 14 },
  { name: "Tuần 4", requests: 25, completed: 20 },
];

const equipmentHealth = [
  { category: "Thang máy", health: 95, status: "Tốt" },
  { category: "Hệ thống PCCC", health: 100, status: "Tốt" },
  { category: "Máy phát điện", health: 78, status: "Cần bảo trì" },
  { category: "Hệ thống nước", health: 88, status: "Ổn định" },
];

export default function MaintenanceReport() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-slate-50/50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Báo cáo Kỹ thuật
          </h2>
          <p className="text-sm text-slate-500">
            Theo dõi sự cố, tiến độ sửa chữa và sức khỏe hạ tầng
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings2 className="mr-2 h-4 w-4" /> Cấu hình thiết bị
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            <Construction className="mr-2 h-4 w-4" /> Lịch bảo trì định kỳ
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Yêu cầu mới</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14</div>
            <p className="text-xs text-slate-500 mt-1">
              4 yêu cầu khẩn cấp (SLA 2h)
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">08</div>
            <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[60%]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Hoàn thành tháng
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">124</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +15% hiệu suất đội ngũ
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Chi phí linh kiện
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">32.5M</div>
            <p className="text-xs text-slate-500 mt-1">
              Vượt 5% ngân sách dự kiến
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart: Performance */}
        <Card className="lg:col-span-4 border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Hiệu suất xử lý sự cố</CardTitle>
            <CardDescription>
              So sánh số lượng yêu cầu và số ca đã đóng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={maintenanceStats}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
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
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="requests"
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                    name="Yêu cầu nhận"
                  />
                  <Bar
                    dataKey="completed"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                    name="Đã xử lý"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Health List */}
        <Card className="lg:col-span-3 border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Sức khỏe hệ thống</CardTitle>
            <CardDescription>Chỉ số vận hành thiết bị cốt lõi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {equipmentHealth.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {item.category}
                  </span>
                  <Badge
                    variant={item.health > 90 ? "secondary" : "outline"}
                    className={
                      item.health <= 80
                        ? "text-red-600 bg-red-50 border-red-100"
                        : ""
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
                <Progress
                  value={item.health}
                  className={`h-2 ${item.health <= 80 ? "bg-red-100" : ""}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Urgent Tasks Table */}
        <Card className="lg:col-span-7 border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">
              Các đầu việc kỹ thuật cần chú ý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Nội dung sự cố</TableHead>
                  <TableHead>Mức độ</TableHead>
                  <TableHead>Kỹ thuật viên</TableHead>
                  <TableHead>Thời gian chờ</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    room: "Hầm B2",
                    issue: "Rò rỉ đường ống nước thải",
                    priority: "Khẩn cấp",
                    staff: "Nguyễn Văn Hùng",
                    wait: "45 phút",
                  },
                  {
                    room: "P.1504",
                    issue: "Hỏng điều hòa (Cư dân báo)",
                    priority: "Trung bình",
                    staff: "Lê Anh Tuấn",
                    wait: "2 giờ",
                  },
                  {
                    room: "Sảnh T1",
                    issue: "Thay bóng đèn trang trí",
                    priority: "Thấp",
                    staff: "Phạm Minh Đức",
                    wait: "5 giờ",
                  },
                  {
                    room: "Thang máy số 3",
                    issue: "Kêu to khi di chuyển",
                    priority: "Khẩn cấp",
                    staff: "Đội Schindler",
                    wait: "15 phút",
                  },
                ].map((task, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-bold text-slate-900">
                      {task.room}
                    </TableCell>
                    <TableCell>{task.issue}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            task.priority === "Khẩn cấp"
                              ? "bg-red-500 animate-pulse"
                              : task.priority === "Trung bình"
                                ? "bg-orange-400"
                                : "bg-blue-400"
                          }`}
                        />
                        <span className="text-xs font-medium">
                          {task.priority}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {task.staff}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {task.wait}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Cập nhật
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
