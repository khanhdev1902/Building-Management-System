/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Zap,
  Search,
  Save,
  FileDown,
  History,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Calculator,
  X,
  Clock,
  CheckCircle,
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
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Progress } from "@/shared/components/ui/progress";
import { Separator } from "@/shared/components/ui/separator";

// --- Mock Data Lịch sử ---
const MOCK_HISTORY = [
  { month: "02/2026", index: 1250, usage: 140, amount: "490.000" },
  { month: "01/2026", index: 1110, usage: 135, amount: "472.500" },
  { month: "12/2025", index: 975, usage: 160, amount: "560.000" },
];

const UNIT_PRICES = { electric: 3500, water: 15000 };

export default function UtilityReadingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFloor, setActiveFloor] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all"); // 'all' | 'done' | 'pending'

  return (
    <div className="p-4 md:p-8 max-w-400 mx-auto space-y-6 bg-[#f8fafc] min-h-screen pb-32 md:pb-8">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sticky top-0 z-30 bg-[#f8fafc]/80 backdrop-blur-md pb-4 pt-2">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-xl shadow-lg shadow-amber-200">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Ghi Chỉ Số Dịch Vụ
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge className="bg-indigo-600 border-none font-bold">
                  KỲ T03/2026
                </Badge>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider italic">
                  Hạn chốt: 30/03
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 bg-white"
          >
            <FileDown className="w-4 h-4 mr-2" /> Xuất Excel
          </Button>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xl px-6 font-bold">
            <Save className="w-4 h-4 mr-2" /> Chốt Tất Cả
          </Button>
        </div>
      </div>

      {/* 2. Dashboard Tiến độ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatProgressCard
          label="Tiến độ Điện"
          current={45}
          total={120}
          color="amber"
        />
        <StatProgressCard
          label="Tiến độ Nước"
          current={38}
          total={120}
          color="blue"
        />
        <Card className="rounded-2xl border-none shadow-sm bg-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-xl text-red-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Cảnh báo
              </p>
              <p className="text-xl font-black text-red-600">08 Phòng</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-none shadow-sm bg-indigo-900 text-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl text-indigo-300">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-indigo-300 uppercase">
                Dự thu dịch vụ
              </p>
              <p className="text-xl font-black">142.5M</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Toolbar Lọc */}
     {/* 2. Toolbar Lọc (Redesign) */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 space-y-3">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Tìm kiếm */}
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              placeholder="Tìm số phòng, tên khách..."
              className="pl-10 border-none bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500/10 rounded-xl h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Lọc Tầng */}
          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
            <span className="text-[10px] font-black text-slate-400 uppercase ml-2 hidden lg:block">Tầng:</span>
            <Tabs value={activeFloor} onValueChange={setActiveFloor} className="w-fit">
              <TabsList className="bg-slate-100 p-1 rounded-xl h-11">
                <TabsTrigger value="all" className="rounded-lg px-4 font-bold text-[10px]">TẤT CẢ</TabsTrigger>
                <TabsTrigger value="1" className="rounded-lg px-4 font-bold text-[10px]">TẦNG 1</TabsTrigger>
                <TabsTrigger value="2" className="rounded-lg px-4 font-bold text-[10px]">TẦNG 2</TabsTrigger>
                <TabsTrigger value="3" className="rounded-lg px-4 font-bold text-[10px]">TẦNG 3</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Lọc Trạng Thái Chốt */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <span className="text-[10px] font-black text-slate-400 uppercase ml-2 hidden lg:block">Trạng thái:</span>
            <Tabs value={activeStatus} onValueChange={setActiveStatus} className="w-fit">
              <TabsList className="bg-slate-100 p-1 rounded-xl h-11">
                <TabsTrigger value="all" className="rounded-lg px-4 font-bold text-[10px]">TẤT CẢ</TabsTrigger>
                <TabsTrigger value="pending" className="rounded-lg px-4 font-bold text-[10px] flex gap-2 items-center">
                  <Clock className="w-3 h-3 text-amber-500" /> CHƯA CHỐT
                </TabsTrigger>
                <TabsTrigger value="done" className="rounded-lg px-4 font-bold text-[10px] flex gap-2 items-center">
                  <CheckCircle className="w-3 h-3 text-emerald-500" /> ĐÃ CHỐT
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* 4. Sheet Nhập liệu */}
      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-100">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-24 pl-8 font-black text-slate-400 uppercase text-[11px]">
                  Phòng
                </TableHead>
                <TableHead className="font-black text-slate-400 uppercase text-[11px]">
                  Chủ hộ
                </TableHead>
                <TableHead className="min-w-[320px] font-black text-amber-600 uppercase text-[11px]">
                  Số ĐIỆN (kWh)
                </TableHead>
                <TableHead className="min-w-[320px] font-black text-blue-600 uppercase text-[11px]">
                  Số NƯỚC (m³)
                </TableHead>
                <TableHead className="text-right pr-8 font-black text-slate-400 uppercase text-[11px]">
                  Tạm tính tiền
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <InputRow
                room="101"
                tenant="Nguyễn Văn A"
                eOld={1250}
                wOld={450}
              />
              <InputRow
                room="102"
                tenant="Trần Thị B"
                eOld={2100}
                wOld={800}
                isAlert
              />
              <InputRow room="201" tenant="Lê Văn C" eOld={3400} wOld={120} />
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Mobile Floating Save Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden z-50">
        <Button className="h-14 px-8 rounded-full bg-slate-900 text-white shadow-2xl gap-3 text-lg font-black border-4 border-white">
          <Save className="w-6 h-6" /> LƯU KẾT QUẢ
        </Button>
      </div>
    </div>
  );
}

// --- Cell Nhập liệu kèm Lịch sử ---
// --- Cập nhật Logic cho InputRow ---
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function InputRow({ room, tenant, eOld, wOld, isAlert }: any) {
  const [eNew, setENew] = useState("");
  const [wNew, setWNew] = useState("");
  const [isLocked, setIsLocked] = useState(false); // Trạng thái chốt từng dòng

  const eUsage = eNew ? Number(eNew) - eOld : 0;
  const wUsage = wNew ? Number(wNew) - wOld : 0;
  const tempTotal = eUsage * UNIT_PRICES.electric + wUsage * UNIT_PRICES.water;

  // Kiểm tra điều kiện để cho phép chốt
  const canLock = eNew !== "" && wNew !== "" && eUsage >= 0 && wUsage >= 0;

  return (
    <TableRow className={`group transition-all ${isLocked ? "bg-emerald-50/30" : "hover:bg-slate-50/50"}`}>
      <TableCell className="pl-8">
        <div className={`text-xl font-black ${isLocked ? "text-emerald-700" : "text-slate-900"}`}>
          {room}
        </div>
        {isLocked && <Badge className="bg-emerald-500 text-[8px] h-4">ĐÃ CHỐT</Badge>}
      </TableCell>
      
      <TableCell>
        <div className="font-bold text-slate-700 text-sm">{tenant}</div>
        <div className="text-[10px] text-slate-400 flex items-center gap-1">
          {isLocked ? <span className="text-emerald-600 font-medium">Xác nhận lúc 14:30</span> : "Đang chờ nhập..."}
        </div>
      </TableCell>

      {/* Nhập Điện */}
      <TableCell>
        <div className={`flex items-center gap-2 p-2 rounded-2xl border transition-all 
          ${isLocked ? 'border-emerald-200 bg-white/50' : 
            eUsage < 0 ? "bg-red-50 border-red-200" : "bg-slate-50 border-transparent hover:border-slate-200 focus-within:bg-white focus-within:border-amber-400"}
        `}>
          <div className="flex flex-col min-w-12.5 pl-1 opacity-60">
            <span className="text-[9px] font-bold uppercase">Cũ</span>
            <span className="font-mono font-black text-slate-600">{eOld}</span>
          </div>
          <ArrowRight className={`w-3 h-3 ${isLocked ? 'text-emerald-300' : 'text-slate-300'}`} />
          <div className="flex-1 relative">
            <Input
              type="number"
              disabled={isLocked}
              placeholder="Ghi số mới..."
              className="border-none bg-transparent shadow-none h-10 font-mono font-black text-lg focus-visible:ring-0 disabled:opacity-100"
              value={eNew}
              onChange={(e) => setENew(e.target.value)}
            />
            {eUsage > 0 && (
              <Badge className={`absolute -top-3 -right-1 font-black text-[10px] ${isLocked ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                +{eUsage}
              </Badge>
            )}
          </div>
          <HistoryPopover label={`Phòng ${room} - Điện`} unit="kWh" />
        </div>
      </TableCell>

      {/* Nhập Nước */}
      <TableCell>
        <div className={`flex items-center gap-2 p-2 rounded-2xl border transition-all 
          ${isLocked ? 'border-emerald-200 bg-white/50' : 
            wUsage < 0 ? "bg-red-50 border-red-200" : "bg-slate-50 border-transparent hover:border-slate-200 focus-within:bg-white focus-within:border-blue-400"}
        `}>
          <div className="flex flex-col min-w-12.5 pl-1 opacity-60">
            <span className="text-[9px] font-bold uppercase">Cũ</span>
            <span className="font-mono font-black text-slate-600">{wOld}</span>
          </div>
          <ArrowRight className={`w-3 h-3 ${isLocked ? 'text-emerald-300' : 'text-slate-300'}`} />
          <div className="flex-1 relative">
            <Input
              type="number"
              disabled={isLocked}
              placeholder="Ghi số mới..."
              className="border-none bg-transparent shadow-none h-10 font-mono font-black text-lg focus-visible:ring-0 disabled:opacity-100"
              value={wNew}
              onChange={(e) => setWNew(e.target.value)}
            />
            {wUsage > 0 && (
              <Badge className={`absolute -top-3 -right-1 font-black text-[10px] ${isLocked ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                +{wUsage}
              </Badge>
            )}
          </div>
          <HistoryPopover label={`Phòng ${room} - Nước`} unit="m³" />
        </div>
      </TableCell>

      {/* Cột Hành động Chốt */}
      <TableCell className="text-right pr-8">
        <div className="flex flex-col items-end gap-2">
          {isLocked ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsLocked(false)}
              className="text-slate-400 hover:text-amber-600 h-8 gap-1"
            >
              <X className="w-3 h-3" /> Mở khóa
            </Button>
          ) : (
            <Button 
              disabled={!canLock}
              onClick={() => setIsLocked(true)}
              className={`h-9 rounded-xl font-bold transition-all px-4 ${canLock ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-100' : 'bg-slate-200 text-slate-400'}`}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> Chốt số
            </Button>
          )}
          <div className={`text-sm font-black transition-colors ${isLocked ? 'text-emerald-700' : tempTotal > 0 ? 'text-slate-900' : 'text-slate-300'}`}>
            {tempTotal.toLocaleString()}đ
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

// --- Popover Lịch sử chi tiết ---
function HistoryPopover({ label, unit }: { label: string; unit: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-lg transition-all shadow-sm"
        >
          <History className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 rounded-3xl overflow-hidden shadow-2xl border-none"
        align="end"
      >
        <div className="bg-slate-900 p-4 text-white">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-sm tracking-tight">{label}</h4>
            <Badge className="bg-white/10 text-white border-none text-[10px]">
              LỊCH SỬ
            </Badge>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest opacity-60">
            3 kỳ hóa đơn gần nhất
          </p>
        </div>

        <div className="p-4 space-y-3 bg-white">
          {MOCK_HISTORY.map((h, i) => (
            <div key={i} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black text-slate-400">
                  {h.month}
                </span>
                <span className="text-xs font-black text-indigo-600">
                  +{h.usage} {unit}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${(h.usage / 200) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 items-center">
                <span className="text-[9px] text-slate-400 italic">
                  Chỉ số: {h.index}
                </span>
                <span className="text-[9px] font-bold text-emerald-600">
                  {h.amount}đ
                </span>
              </div>
              {i < MOCK_HISTORY.length - 1 && (
                <Separator className="mt-3 opacity-50" />
              )}
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase">
            Trung bình:
          </span>
          <span className="text-sm font-black text-slate-900">
            145 {unit}/tháng
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// --- Stat Progress Card ---
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function StatProgressCard({ label, current, total, color }: any) {
  const percent = (current / total) * 100;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const colorMap: any = {
    amber: "bg-amber-500",
    blue: "bg-blue-500",
  };
  return (
    <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            {label}
          </p>
          <span className="text-xs font-black text-slate-900">
            {current}/{total}
          </span>
        </div>
        <Progress
          value={percent}
          className="h-2 bg-slate-100"
          // indicatorClassName={colorMap[color]}
        />
        <p className="text-[10px] font-bold text-slate-400 mt-2 text-right">
          {percent.toFixed(0)}% hoàn thành
        </p>
      </CardContent>
    </Card>
  );
}
