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
  Clock,
  History,
  CheckCircle2,
  AlertCircle,
  FileDown,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import FinancialTopbar from "./components/financialTopbar";

// Mockup dữ liệu dòng tiền băm nhỏ thực tế năm 2026 của chuỗi Danjin Tower
const monthlyData = [
  { name: "Tháng 01", revenue: 190, debt: 15 },
  { name: "Tháng 02", revenue: 210, debt: 10 },
  { name: "Tháng 03", revenue: 225, debt: 45 },
  { name: "Tháng 04", revenue: 240, debt: 20 },
  { name: "Tháng 05", revenue: 258, debt: 12 }, // Tháng 5 hiện tại bám sát tiến độ
];

export default function RevenueDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-slate-50/20 min-h-screen antialiased selection:bg-indigo-50">
      <FinancialTopbar />

      {/* 2. CHIA TABS WORKSPACE PHẲNG */}
      <Tabs defaultValue="overview" className="space-y-5">
        {/* <TabsList className="bg-slate-100 p-0.5 rounded-lg border border-slate-200/40 w-fit h-9 items-center select-none">
          <TabsTrigger
            value="overview"
            className="h-7 px-4 rounded-md text-xs font-semibold transition-all data-[state=active]:bg-white data-[state=active]:shadow-2xs text-slate-500 data-[state=active]:text-slate-900"
          >
            Tổng quan tài khóa
          </TabsTrigger>
          <TabsTrigger
            value="invoices"
            className="h-7 px-4 rounded-md text-xs font-semibold transition-all text-slate-500 hover:text-slate-800"
          >
            Hóa đơn kì này
          </TabsTrigger>
          <TabsTrigger
            value="debts"
            className="h-7 px-4 rounded-md text-xs font-semibold transition-all text-slate-500 hover:text-slate-800"
          >
            Phân tích nợ đọng
          </TabsTrigger>
        </TabsList> */}

        <TabsContent value="overview" className="space-y-5 mt-0 outline-hidden">
          {/* 3. KHỐI THỐNG KÊ METRIC CARDS LÌ PHẲNG */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
            <StatsCard
              title="Dòng tiền thực thu"
              value="452,230,000 đ"
              sub="+20.1% so với tháng trước"
              icon={Banknote}
              color="emerald"
              status={<TrendingUp size={11} className="text-emerald-600" />}
            />
            <StatsCard
              title="Công nợ quá hạn"
              value="38,400,000 đ"
              sub="Treo 12 chứng từ gốc"
              icon={CreditCard}
              color="rose"
              status={
                <Badge className="bg-rose-50 text-rose-700 border-none px-1.5 py-0 rounded text-[9px] font-bold">
                  RỦI RO CAO
                </Badge>
              }
            />
            <StatsCard
              title="Tỷ lệ lấp đầy quỹ tiền"
              value="92.4%"
              sub="Mục tiêu tài khóa: 95%"
              icon={ArrowUpRight}
              color="indigo"
              status={
                <div className="w-16 bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full w-[92%]" />
                </div>
              }
            />
            <StatsCard
              title="Hóa đơn treo chờ duyệt"
              value="24 chứng từ"
              sub="Đã gửi thông báo nợ 12 hộ"
              icon={FileText}
              color="amber"
              status={
                <span className="text-[10px] text-amber-600 font-semibold">
                  • Đang chờ khớp
                </span>
              }
            />
          </div>

          {/* 4. GRID HAI CỘT ĐỐI XỨNG: BIỂU ĐỒ VÀ BẢNG ĐỐI SOÁT GẦN ĐÂY */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
            {/* Cột trái (4 phần): Biểu đồ Recharts thanh mảnh, sắc nét */}
            <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.01)] p-5 space-y-4">
              <div className="flex items-center justify-between select-none">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Xu hướng phân rã dòng tiền (2026)
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Đối soát giá trị thực thu và nợ đọng lũy kế qua các kỳ (Đơn
                    vị: Triệu VND)
                  </p>
                </div>
              </div>
              <div className="h-64 w-full select-none">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      stroke="#94a3b8"
                      className="font-mono"
                    />
                    <YAxis
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      stroke="#94a3b8"
                      tickFormatter={(v) => `${v}M`}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(241,245,249,0.4)" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        backgroundColor: "#fff",
                        fontSize: "11px",
                        fontFamily: "sans-serif",
                      }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#0f172a"
                      radius={[3, 3, 0, 0]}
                      barSize={16}
                      name="Thực thu"
                    />
                    <Bar
                      dataKey="debt"
                      fill="#cbd5e1"
                      radius={[3, 3, 0, 0]}
                      barSize={16}
                      name="Treo nợ"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cột phải (3 phần): Bảng giao dịch dòng tiền đậm đặc nghiệp vụ */}
            <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.01)] p-5 space-y-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 select-none">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Luồng khớp lệnh gần đây
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Quét sao kê ngân hàng 5 phút trước
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-[10px] font-bold text-indigo-600 uppercase p-0"
                >
                  Xem toàn sổ
                </Button>
              </div>

              <div className="overflow-x-auto flex-1">
                <Table>
                  <TableHeader className="bg-slate-50/50 border-b border-slate-100/60 select-none">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 pl-2">
                        Căn hộ / Cư dân
                      </TableHead>
                      <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 text-right">
                        Giá trị thu
                      </TableHead>
                      <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-center py-2">
                        Trạng thái
                      </TableHead>
                      <TableHead className="w-6 py-2 pr-2"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-100/50 text-xs">
                    {[
                      {
                        id: "INV-01",
                        room: "P.402",
                        name: "Trần Bình An",
                        amount: "5,200,000",
                        status: "Paid",
                        method: "VietQR",
                      },
                      {
                        id: "INV-02",
                        room: "P.901",
                        name: "Hoàng Thu Thảo",
                        amount: "8,150,000",
                        status: "Pending",
                        method: "Chờ khớp",
                      },
                      {
                        id: "INV-03",
                        room: "P.205",
                        name: "Trần Thị Bình",
                        amount: "4,000,000",
                        status: "Overdue",
                        method: "Treo trễ",
                      },
                      {
                        id: "INV-04",
                        room: "P.110",
                        name: "Nguyễn Văn Anh",
                        amount: "12,000,000",
                        status: "Paid",
                        method: "Bank Transfer",
                      },
                      {
                        id: "INV-05",
                        room: "P.303",
                        name: "Vũ Hải Đăng",
                        amount: "2,450,000",
                        status: "Paid",
                        method: "Tiền mặt",
                      },
                    ].map((inv) => (
                      <TableRow
                        key={inv.id}
                        className="hover:bg-slate-50/30 border-none group"
                      >
                        <TableCell className="py-2.5 pl-2">
                          <span className="font-bold text-slate-800 font-mono">
                            P.{inv.room.replace("P.", "")}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-sans font-medium mt-0.5">
                            {inv.name}
                          </span>
                        </TableCell>
                        <TableCell className="text-right py-2.5">
                          <strong className="font-mono text-slate-900 font-bold">
                            {inv.amount}đ
                          </strong>
                          <span className="text-[9px] text-slate-400 block font-mono font-normal mt-0.5">
                            {inv.method}
                          </span>
                        </TableCell>
                        <TableCell className="text-center py-2.5">
                          <Badge
                            variant="outline"
                            className={`border-none text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              inv.status === "Paid"
                                ? "bg-emerald-50 text-emerald-700"
                                : inv.status === "Pending"
                                  ? "bg-amber-50 text-amber-700 animate-pulse"
                                  : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            {inv.status === "Paid"
                              ? "Đã thu"
                              : inv.status === "Pending"
                                ? "Chờ"
                                : "Nợ đọng"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-2 py-2.5">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-slate-300 opacity-0 group-hover:opacity-100 rounded-md"
                              >
                                <MoreHorizontal size={13} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-40 p-1 border-slate-200"
                            >
                              <DropdownMenuLabel className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                                Tác vụ sổ gốc
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator className="my-1 border-slate-100" />
                              <DropdownMenuItem className="text-xs font-semibold p-2">
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs font-semibold text-indigo-600 p-2">
                                Khớp duyệt tiền
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// SUB-COMPONENT: THẺ TRỰC QUAN STATS CARD PHẲNG LÌ
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatsCard({ title, value, sub, icon: Icon, color, status }: any) {
  const colors: Record<string, string> = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100/40",
    rose: "text-rose-600 bg-rose-50 border-rose-100/40",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100/40",
    amber: "text-amber-600 bg-amber-50 border-amber-100/40",
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center justify-between transition-all hover:shadow-2xs">
      <div className="space-y-0.5 min-w-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
          {title}
        </span>
        <h4 className="text-xl font-bold text-slate-900 font-sans tracking-tight">
          {value}
        </h4>

        {/* Khay lồng trạng thái inline phẳng mịn */}
        <div className="flex items-center gap-2 pt-1">
          {status}
          <span className="text-[10px] font-medium text-slate-400 truncate block">
            {sub}
          </span>
        </div>
      </div>
      <div className={`p-2.5 rounded-xl border ${colors[color]} shrink-0`}>
        <Icon className="w-4 h-4 stroke-[1.8]" />
      </div>
    </div>
  );
}
