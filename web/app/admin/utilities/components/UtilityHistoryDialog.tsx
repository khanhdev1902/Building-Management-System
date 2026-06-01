"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  Zap,
  Droplets,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

interface UtilityHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  roomNumber: string | number;
}

// Giả lập phôi dữ liệu dày đặc từ Server Danjin qua nhiều năm (2024 - 2026)
const MOCK_LARGE_LEDGER = [
  {
    month: "Kỳ 05/2026",
    year: "2026",
    eOld: 2100,
    eNew: 2220,
    eUsed: 120,
    wOld: 800,
    wNew: 812,
    wUsed: 12,
    total: 940000,
  },
  {
    month: "Kỳ 04/2026",
    year: "2026",
    eOld: 1980,
    eNew: 2100,
    eUsed: 120,
    wOld: 788,
    wNew: 800,
    wUsed: 12,
    total: 940000,
  },
  {
    month: "Kỳ 03/2026",
    year: "2026",
    eOld: 1835,
    eNew: 1980,
    eUsed: 145,
    wOld: 778,
    wNew: 788,
    wUsed: 10,
    total: 997500,
  },
  {
    month: "Kỳ 02/2026",
    year: "2026",
    eOld: 1715,
    eNew: 1835,
    eUsed: 120,
    wOld: 770,
    wNew: 778,
    wUsed: 8,
    total: 890000,
  },
  {
    month: "Kỳ 01/2026",
    year: "2026",
    eOld: 1600,
    eNew: 1715,
    eUsed: 115,
    wOld: 760,
    wNew: 770,
    wUsed: 10,
    total: 867500,
  },
  {
    month: "Kỳ 12/2025",
    year: "2025",
    eOld: 1450,
    eNew: 1600,
    eUsed: 150,
    wOld: 745,
    wNew: 760,
    wUsed: 15,
    total: 1100000,
  },
  {
    month: "Kỳ 11/2025",
    year: "2025",
    eOld: 1320,
    eNew: 1450,
    eUsed: 130,
    wOld: 735,
    wNew: 745,
    wUsed: 10,
    total: 955000,
  },
  {
    month: "Kỳ 10/2025",
    year: "2025",
    eOld: 1200,
    eNew: 1320,
    eUsed: 120,
    wOld: 723,
    wNew: 735,
    wUsed: 12,
    total: 940000,
  },
  {
    month: "Kỳ 09/2025",
    year: "2025",
    eOld: 1050,
    eNew: 1200,
    eUsed: 150,
    wOld: 710,
    wNew: 723,
    wUsed: 13,
    total: 1040000,
  },
  {
    month: "Kỳ 08/2025",
    year: "2025",
    eOld: 900,
    eNew: 1050,
    eUsed: 150,
    wOld: 695,
    wNew: 710,
    wUsed: 15,
    total: 1100000,
  },
  {
    month: "Kỳ 07/2025",
    year: "2025",
    eOld: 740,
    eNew: 900,
    eUsed: 160,
    wOld: 680,
    wNew: 695,
    wUsed: 15,
    total: 1135000,
  },
  {
    month: "Kỳ 06/2025",
    year: "2025",
    eOld: 610,
    eNew: 740,
    eUsed: 130,
    wOld: 668,
    wNew: 680,
    wUsed: 12,
    total: 975000,
  },
  {
    month: "Kỳ 05/2025",
    year: "2025",
    eOld: 490,
    eNew: 610,
    eUsed: 120,
    wOld: 658,
    wNew: 668,
    wUsed: 10,
    total: 900000,
  },
  {
    month: "Kỳ 04/2025",
    year: "2025",
    eOld: 380,
    eNew: 490,
    eUsed: 110,
    wOld: 650,
    wNew: 658,
    wUsed: 8,
    total: 825000,
  },
  {
    month: "Kỳ 03/2025",
    year: "2025",
    eOld: 280,
    eNew: 380,
    eUsed: 100,
    wOld: 640,
    wNew: 650,
    wUsed: 10,
    total: 770000,
  },
  {
    month: "Kỳ 02/2025",
    year: "2025",
    eOld: 180,
    eNew: 280,
    eUsed: 100,
    wOld: 632,
    wNew: 640,
    wUsed: 8,
    total: 730000,
  },
  {
    month: "Kỳ 01/2025",
    year: "2025",
    eOld: 80,
    eNew: 180,
    eUsed: 100,
    wOld: 620,
    wNew: 632,
    wUsed: 12,
    total: 790000,
  },
  {
    month: "Kỳ 12/2024",
    year: "2024",
    eOld: 0,
    eNew: 80,
    eUsed: 80,
    wOld: 612,
    wNew: 620,
    wUsed: 8,
    total: 540000,
  },
];

export function UtilityHistoryDialog({
  isOpen,
  onClose,
  roomNumber,
}: UtilityHistoryDialogProps) {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Mức nén chuẩn: Render tối đa 5 dòng/trang để khay modal không bị tuột layout

  // 1. Luồng xử lý bộ lọc theo năm (Chronological Filter Pipeline)
  const filteredData = useMemo(() => {
    // eslint-disable-next-line react-hooks/set-state-in-render
    setCurrentPage(1); // Reset trang về 1 mỗi khi lọc
    if (selectedYear === "all") return MOCK_LARGE_LEDGER;
    return MOCK_LARGE_LEDGER.filter((row) => row.year === selectedYear);
  }, [selectedYear]);

  // 2. Logic phân trang cục bộ (Local Pagination Slice)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  // 3. Khay tính toán KPI nhanh (Phân tích biên độ dao động tiêu thụ)
  const metrics = useMemo(() => {
    if (filteredData.length === 0) return { avgElectric: 0, avgWater: 0 };
    const totalE = filteredData.reduce((acc, cur) => acc + cur.eUsed, 0);
    const totalW = filteredData.reduce((acc, cur) => acc + cur.wUsed, 0);
    return {
      avgElectric: Math.round(totalE / filteredData.length),
      avgWater: Math.round((totalW / filteredData.length) * 10) / 10,
    };
  }, [filteredData]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-2xl bg-white rounded-xl border border-slate-200 p-5 shadow-xl font-sans overflow-hidden flex flex-col justify-between max-h-140 animate-in fade-in zoom-in-95 duration-200">
        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          {/* HEADER DIALOG CỨNG CÁP */}
          <DialogHeader className="select-none pb-2.5 border-b border-slate-100 shrink-0">
            <DialogTitle className="text-sm font-black text-slate-950 uppercase tracking-wide flex items-center gap-2">
              <CalendarDays
                size={15}
                className="text-indigo-600 stroke-[2.5]"
              />
              Sổ cái điện nước lịch sử — Phòng P.{roomNumber}
            </DialogTitle>
            <DialogDescription className="text-[11px] text-slate-400 font-medium">
              Hệ thống lưu vết điện tử chuỗi Danjin. Dữ liệu tự động đồng bộ hóa
              từ phần cứng IoT.
            </DialogDescription>
          </DialogHeader>

          {/* KHAY 1: KPI CARDS PHÂN TÍCH BIÊN ĐỘ XU HƯỚNG */}
          <div className="grid grid-cols-2 gap-3 select-none shrink-0">
            <div className="p-2.5 bg-amber-50/20 border border-amber-100/40 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tiêu thụ Điện trung bình
                </span>
                <span className="font-mono text-sm font-black text-amber-700">
                  +{metrics.avgElectric}{" "}
                  <span className="text-[10px] font-sans font-normal text-slate-400">
                    kWh/tháng
                  </span>
                </span>
              </div>
              <Zap size={14} className="text-amber-500 shrink-0" />
            </div>
            <div className="p-2.5 bg-blue-50/20 border border-blue-100/40 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tiêu thụ Nước trung bình
                </span>
                <span className="font-mono text-sm font-black text-blue-700">
                  +{metrics.avgWater}{" "}
                  <span className="text-[10px] font-sans font-normal text-slate-400">
                    m³/tháng
                  </span>
                </span>
              </div>
              <Droplets size={14} className="text-blue-500 shrink-0" />
            </div>
          </div>

          {/* KHAY 2: TOOLBAR LỌC NĂM TẬP TRUNG DẸT LÌ */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2 rounded-xl select-none shrink-0">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
              <Filter size={12} className="text-slate-400" />
              <span>Lọc niên độ hóa đơn:</span>
            </div>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="h-7 w-32 border-slate-200 bg-white rounded-md text-[11px] font-semibold px-2 focus:ring-0 shadow-3xs cursor-pointer">
                <SelectValue placeholder="Chọn năm" />
              </SelectTrigger>
              <SelectContent className="p-1 rounded-lg border-slate-200 bg-white">
                <SelectItem value="all" className="text-xs">
                  Tất cả các năm
                </SelectItem>
                <SelectItem value="2026" className="text-xs">
                  Năm 2026
                </SelectItem>
                <SelectItem value="2025" className="text-xs">
                  Năm 2025
                </SelectItem>
                <SelectItem value="2024" className="text-xs">
                  Năm 2024
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* KHAY 3: BẢNG SỐ LIỆU ĐỐI SOÁT PHÂN TRANG (Tối ưu cuộn chìm) */}
          <div className="overflow-y-auto rounded-xl border border-slate-200/60 bg-white flex-1 min-h-0 relative">
            <Table>
              <TableHeader className="bg-slate-50/50 text-[10px] font-bold uppercase text-slate-400 tracking-wider sticky top-0 z-10 shadow-3xs select-none">
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  <TableHead className="py-2.5 pl-4 w-[25%]">
                    Kỳ quyết toán
                  </TableHead>
                  <TableHead className="py-2.5 text-center w-[35%] bg-amber-50/10 text-amber-800 font-bold">
                    ⚡ Chỉ số Điện (kWh)
                  </TableHead>
                  <TableHead className="py-2.5 text-center w-[25%] bg-blue-50/10 text-blue-800 font-bold">
                    💧 Chỉ số Nước (m³)
                  </TableHead>
                  <TableHead className="py-2.5 text-right pr-4 w-[15%]">
                    Cước phụ
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs divide-y divide-slate-100/60 font-medium">
                {paginatedData.length === 0 ? (
                  <TableRow className="hover:bg-transparent border-none">
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-slate-400 italic font-sans"
                    >
                      Không tìm thấy dữ liệu đối soát phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row, idx) => (
                    <TableRow
                      key={idx}
                      className="hover:bg-slate-50/30 border-none transition-colors"
                    >
                      <TableCell className="py-2.5 pl-4 font-bold text-slate-700 font-mono">
                        {row.month}
                      </TableCell>
                      <TableCell className="py-2.5 text-center bg-amber-50/5 font-mono">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-slate-400 text-[11px] font-normal">
                            {row.eOld}➔{row.eNew}
                          </span>
                          <Badge
                            variant="outline"
                            className="bg-amber-50 border-amber-200/60 text-amber-700 text-[10px] font-bold rounded px-1.5 h-4.5 shadow-none select-none"
                          >
                            +{row.eUsed}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 text-center bg-blue-50/5 font-mono">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-slate-400 text-[11px] font-normal">
                            {row.wOld}➔{row.wNew}
                          </span>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 border-blue-200/60 text-blue-700 text-[10px] font-bold rounded px-1.5 h-4.5 shadow-none select-none"
                          >
                            +{row.wUsed}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 text-right pr-4 font-mono font-bold text-slate-900">
                        {row.total.toLocaleString("vi-VN")}đ
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* ================= KHAY ĐÁY: ĐIỀU PHỐI PHÂN TRANG VÀ ĐÓNG MODAL ================= */}
        <div className="px-1 pt-3 border-t border-slate-100 flex items-center justify-between shrink-0 select-none mt-3.5 text-xs font-medium">
          {/* Bộ điều hướng phân trang cục bộ */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">
              Trang{" "}
              <strong className="text-slate-800 font-mono font-bold">
                {currentPage}
              </strong>{" "}
              / {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-6.5 w-6.5 rounded-md border-slate-200 text-slate-600 bg-white disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft size={13} className="stroke-2" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="h-6.5 w-6.5 rounded-md border-slate-200 text-slate-600 bg-white disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight size={13} className="stroke-2" />
              </Button>
            </div>
          </div>

          <Button
            type="button"
            onClick={onClose}
            className="h-8 px-4 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-lg shadow-2xs cursor-pointer transition-colors uppercase tracking-wide text-[10px]"
          >
            Đóng sổ tra cứu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
