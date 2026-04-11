/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import {
  Zap,
  Droplets,
  Search,
  Save,
  FileDown,
  History,
  AlertTriangle,
  CheckCircle2,
  MoreVertical,
  LayoutGrid,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
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
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Progress } from "@/shared/components/ui/progress"; // Giả định bạn có component này

const mockUtilityData = [
  {
    id: "R-101",
    roomName: "101",
    floor: "Tầng 1",
    electric: { old: 1250, new: 1380, usage: 130 },
    water: { old: 450, new: 465, usage: 15 },
    status: "Pending",
  },
  {
    id: "R-102",
    roomName: "102",
    floor: "Tầng 1",
    electric: { old: 2100, new: 2550, usage: 450 }, // Bất thường
    water: { old: 800, new: 812, usage: 12 },
    status: "Done",
  },
];

export default function UtilityReadingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFloor, setActiveFloor] = useState("all");

  return (
    <div className="p-4 md:p-8 max-w-350 mx-auto space-y-6 bg-[#f8fafc] min-h-screen pb-24 md:pb-8">
      {/* 1. Top Header: Tối giản & Thông tin quan trọng */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Ghi chỉ số Điện & Nước
            </h1>
          </div>
          <p className="text-slate-500 text-sm flex items-center gap-2">
            Kỳ hóa đơn:{" "}
            <span className="font-semibold text-slate-700">Tháng 03/2026</span>
            <Badge variant="secondary" className="font-normal">
              Chốt vào ngày 30 hàng tháng
            </Badge>
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button variant="outline" size="sm" className="shrink-0 gap-2">
            <FileDown className="w-4 h-4" /> Xuất Excel
          </Button>
          <Button
            size="sm"
            className="shrink-0 gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md"
          >
            <Save className="w-4 h-4" /> Chốt & Gửi thông báo
          </Button>
        </div>
      </div>

      {/* 2. Dashboard Mini: Theo dõi tiến độ nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-500 uppercase">
                Tiến độ tổng thể
              </p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold">45/120</span>
                <span className="text-xs font-bold text-indigo-600">37%</span>
              </div>
              <Progress value={37} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">
                Cảnh báo bất thường
              </p>
              <p className="text-lg font-bold">08 Phòng</p>
              <p className="text-[10px] text-red-500">
                Tiêu thụ tăng hơn 50% so với tháng trước
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white hidden md:flex">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <History className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">
                Cập nhật cuối
              </p>
              <p className="text-sm font-bold text-slate-700 text-ellipsis overflow-hidden">
                Trần Văn Khanh
              </p>
              <p className="text-[10px] text-slate-400">14:30 - Hôm nay</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Toolbar: Lọc và Tìm kiếm */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Tìm số phòng hoặc tên chủ hộ..."
            className="pl-9 border-none bg-transparent focus-visible:ring-0 text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-8 w-px bg-slate-100 hidden md:block" />
        <Tabs
          defaultValue="all"
          className="w-full md:w-auto"
          onValueChange={setActiveFloor}
        >
          <TabsList className="bg-slate-50 p-1">
            <TabsTrigger value="all" className="text-xs">
              Tất cả
            </TabsTrigger>
            <TabsTrigger value="t1" className="text-xs">
              Tầng 1
            </TabsTrigger>
            <TabsTrigger value="t2" className="text-xs">
              Tầng 2
            </TabsTrigger>
            <TabsTrigger value="t3" className="text-xs">
              Tầng 3
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 4. Main Table: Thiết kế theo dạng "Sheet" để nhập nhanh */}
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-25 font-semibold text-slate-600">
                  Phòng
                </TableHead>
                <TableHead className="min-w-70">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Zap className="w-4 h-4" /> Điện (kWh)
                  </div>
                </TableHead>
                <TableHead className="min-w-70">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Droplets className="w-4 h-4" /> Nước (m³)
                  </div>
                </TableHead>
                <TableHead className="w-30 text-center">
                  Trạng thái
                </TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {mockUtilityData.map((room) => (
                <TableRow
                  key={room.id}
                  className="group transition-colors hover:bg-slate-50/80"
                >
                  <TableCell className="font-bold text-slate-700">
                    {room.roomName}
                    <div className="text-[10px] font-normal text-slate-400 md:hidden">
                      {room.floor}
                    </div>
                  </TableCell>

                  {/* Điện */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-medium">
                          Cũ
                        </label>
                        <Input
                          value={room.electric.old}
                          disabled
                          className="h-9 w-20 bg-slate-50 border-slate-200 text-xs font-mono"
                        />
                      </div>
                      <div className="pt-5 text-slate-300">→</div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-medium">
                          Mới
                        </label>
                        <Input
                          placeholder="Nhập..."
                          defaultValue={
                            room.status === "Done" ? room.electric.new : ""
                          }
                          className={`h-9 w-24 font-mono font-bold focus:ring-amber-500 ${
                            room.electric.usage > 400
                              ? "border-red-300 bg-red-50 text-red-600"
                              : ""
                          }`}
                        />
                      </div>
                      <div className="pt-5">
                        <Badge
                          variant="secondary"
                          className="font-mono h-9 px-2 flex items-center bg-slate-100 text-slate-600 border-none"
                        >
                          +{room.electric.usage}
                        </Badge>
                      </div>
                      {room.electric.usage > 400 && (
                        <div className="pt-5 hidden md:block">
                          <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Nước */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-medium">
                          Cũ
                        </label>
                        <Input
                          value={room.water.old}
                          disabled
                          className="h-9 w-20 bg-slate-50 border-slate-200 text-xs font-mono"
                        />
                      </div>
                      <div className="pt-5 text-slate-300">→</div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-medium">
                          Mới
                        </label>
                        <Input
                          placeholder="Nhập..."
                          defaultValue={
                            room.status === "Done" ? room.water.new : ""
                          }
                          className="h-9 w-24 font-mono font-bold focus:ring-blue-500"
                        />
                      </div>
                      <div className="pt-5">
                        <Badge
                          variant="secondary"
                          className="font-mono h-9 px-2 flex items-center bg-blue-50 text-blue-600 border-none"
                        >
                          +{room.water.usage}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    {room.status === "Done" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-200 mx-auto" />
                    )}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Xem lịch sử</DropdownMenuItem>
                        <DropdownMenuItem>Báo hỏng đồng hồ</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Xóa số liệu
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* 5. Mobile Floating Footer: Cực kỳ quan trọng cho người đi ghi số */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] md:hidden bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between z-50">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400">Tiến độ</span>
          <span className="font-bold">45/120 Phòng</span>
        </div>
        <Button className="bg-indigo-500 hover:bg-indigo-600 rounded-xl gap-2 h-11 px-6">
          <Save className="w-4 h-4" /> Lưu tất cả
        </Button>
      </div>

      {/* Legend & Tips */}
      <div className="flex items-center gap-6 text-xs text-slate-500 px-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" /> Tiêu thụ bất
          thường
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500" /> Đã hoàn thành
        </div>
        <div className="hidden md:block">
          <kbd className="px-1.5 py-0.5 rounded border bg-white shadow-sm">
            Enter
          </kbd>{" "}
          để xuống dòng nhanh
        </div>
      </div>
    </div>
  );
}
