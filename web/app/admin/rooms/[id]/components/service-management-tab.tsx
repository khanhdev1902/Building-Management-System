/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Zap,
  Droplets,
  ShieldCheck,
  Gauge,
  Search,
  SearchX,
  ChevronLeft,
  ChevronRight,
  Tv,
  Refrigerator,
  AirVent,
  Lock,
  Hammer,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { meterHistoryLogs } from "../data-meter";

interface ServiceManagementProps {
  meteredServices: Array<{
    id: string;
    name: string;
    price: number;
    unit: string;
    lastIndex: number;
    type: string;
  }>;
  fixedServices: Array<{
    id: string;
    name: string;
    price: number;
    unit: string;
    icon: React.ReactNode;
  }>;
}

const ITEMS_PER_PAGE = 4;

export function ServiceManagement({
  meteredServices,
  fixedServices,
}: ServiceManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "electric" | "water">(
    "all",
  );
  const [yearFilter, setYearFilter] = useState<"2026" | "2025">("2026");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập luồng API Gateway Fetching dữ liệu trong 0.8s khi đổi bộ lọc
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, typeFilter, yearFilter]);

  // Mockup dữ liệu danh mục Tài sản bàn giao thực tế của phòng A.101 chuỗi Danjin BMS
  const roomAssets = [
    {
      id: "AST-101-01",
      name: "Điều hòa Inverter 12000 BTU",
      model: "Casper IC-12TL32",
      serial: "CP-99821A",
      condition: "good",
      label: "Hoạt động tốt",
    },
    {
      id: "AST-101-02",
      name: "Tủ lạnh song lập 180L",
      model: "Toshiba GR-RT252WE",
      serial: "TSB-00821B",
      condition: "good",
      label: "Hoạt động tốt",
    },
    {
      id: "AST-101-03",
      name: "Khóa cửa thông minh Vân tay",
      model: "Kaadas K9-5G",
      serial: "KD-44129X",
      condition: "maintenance",
      label: "Hao mòn pin - Cần thay",
    },
    {
      id: "AST-101-04",
      name: "Bếp hồng ngoại đôi âm sàn",
      model: "Sunhouse SHB9101",
      serial: "SH-88291C",
      condition: "good",
      label: "Hoạt động tốt",
    },
  ];

  // 1. Luồng xử lý COMPUTED STATE bộ lọc tập trung (Tìm kiếm + Loại hình + Thời gian năm)
  const filteredLogs = useMemo(() => {
    return meterHistoryLogs.filter((log) => {
      const matchesSearch =
        log.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.handler.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || log.type === typeFilter;
      const matchesYear = log.period.includes(yearFilter);
      return matchesSearch && matchesType && matchesYear;
    });
  }, [searchTerm, typeFilter, yearFilter]);

  // 2. Thuật toán phân trang mượt mà
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  return (
    <div className="p-5 font-sans bg-white antialiased animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= CỘT TRÁI (7 PHẦN): SỔ CÁI, BỘ LỌC THỜI GIAN & TÀI SẢN ================= */}
        <div className="lg:col-span-7 space-y-5">
          {/* THANH TOOLBAR NÂNG CẤP: Bổ sung bộ lọc thời gian chu kỳ dẹt h-8 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center select-none bg-slate-50/60 p-2.5 rounded-xl border border-slate-200/60">
            <div className="relative w-full sm:w-52 group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
              <Input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm kỳ tháng, người chốt..."
                className="pl-7.5 h-7.5 text-[11px] bg-white border-slate-200 focus-visible:border-slate-400 focus-visible:ring-0 rounded-md placeholder:font-normal"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              {/* Lọc nhanh Loại hình Điện / Nước */}
              <div className="flex bg-slate-200/50 p-0.5 rounded-md h-7.5 items-center border border-slate-200/40">
                {[
                  { key: "all", label: "Tất cả" },
                  { key: "electric", label: "Điện" },
                  { key: "water", label: "Nước" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => {
                      setTypeFilter(t.key as any);
                      setCurrentPage(1);
                    }}
                    className={`h-6.5 px-2.5 rounded-sm text-[10px] font-bold transition-all cursor-pointer ${typeFilter === t.key ? "bg-white shadow-3xs text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* LỌC THỜI GIAN THEO NĂM (MỚI BỔ SUNG) */}
              <div className="flex bg-slate-200/50 p-0.5 rounded-md h-7.5 items-center border border-slate-200/40">
                {[
                  { key: "2026", label: "'26" },
                  { key: "2025", label: "'25" },
                ].map((y) => (
                  <button
                    key={y.key}
                    onClick={() => {
                      setYearFilter(y.key as any);
                      setCurrentPage(1);
                    }}
                    className={`h-6.5 px-2 rounded-sm text-[10px] font-mono font-bold transition-all cursor-pointer ${yearFilter === y.key ? "bg-white shadow-3xs text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    {y.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Khung chứa bảng lịch sử công tơ điện nước */}
          <div className="rounded-xl border border-slate-200/70 shadow-3xs bg-white overflow-hidden flex flex-col min-h-58.75">
            <Table>
              <TableHeader className="bg-slate-50/50 border-b border-slate-100/80 select-none">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-4 py-2">
                    Kỳ hạn đóng
                  </TableHead>
                  <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2">
                    Chỉ số đối soát
                  </TableHead>
                  <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 text-center">
                    Sản lượng
                  </TableHead>
                  <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 text-right pr-4">
                    Thành tiền
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-50 text-xs">
                {isLoading ? (
                  Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <TableRow
                      key={i}
                      className="hover:bg-transparent border-none"
                    >
                      <TableCell className="pl-4 py-3.5">
                        <div className="h-3.5 bg-slate-100 rounded-sm w-16 animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-3 bg-slate-100 rounded-sm w-24 animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-3.5 bg-slate-100 rounded-sm w-12 mx-auto animate-pulse" />
                      </TableCell>
                      <TableCell className="pr-4">
                        <div className="h-3.5 bg-slate-100 rounded-sm w-20 ml-auto animate-pulse" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredLogs.length === 0 ? (
                  <TableRow className="hover:bg-transparent border-none">
                    <TableCell colSpan={4} className="h-46.25 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400 space-y-1.5 max-w-xs mx-auto select-none">
                        <SearchX size={16} className="text-slate-300" />
                        <h4 className="text-[11px] font-bold text-slate-700">
                          Không tìm thấy dữ liệu chốt kì
                        </h4>
                        <p className="text-[10px] text-slate-400 text-center leading-normal">
                          Không có bản ghi chỉ số nào khớp với mốc lọc thời gian
                          đã chọn.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLogs.map((log, idx) => (
                    <TableRow
                      key={idx}
                      className="hover:bg-slate-50/20 border-none"
                    >
                      <TableCell className="font-bold text-slate-800 pl-4 py-2.5">
                        <div className="space-y-0.5">
                          <span>{log.period}</span>
                          <span className="text-[9px] font-sans font-medium text-slate-400 block">
                            {log.handler} • {log.date}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2">
                          {log.type === "electric" ? (
                            <Zap size={11} className="text-amber-500" />
                          ) : (
                            <Droplets size={11} className="text-blue-500" />
                          )}
                          <span className="font-mono text-slate-400">
                            <strong className="text-slate-600 font-bold">
                              {log.oldIndex}
                            </strong>{" "}
                            ➔{" "}
                            <strong className="text-slate-900 font-bold">
                              {log.newIndex}
                            </strong>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-mono font-bold text-slate-800 py-2.5">
                        +{log.used} {log.type === "electric" ? "kWh" : "m³"}
                      </TableCell>
                      <TableCell className="text-right pr-4 py-2.5 font-mono">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900">
                            {log.total.toLocaleString("vi-VN")}đ
                          </span>
                          <span className="text-[9px] font-sans text-slate-400 block font-normal">
                            /{log.price}đ
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Điều hướng phân trang dẹt */}
            {!isLoading && filteredLogs.length > 0 && totalPages > 1 && (
              <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between select-none mt-auto">
                <span className="text-[10px] font-medium text-slate-400 font-mono">
                  Trang {currentPage} / {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 rounded border-slate-200 text-slate-600 bg-white"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 rounded border-slate-200 text-slate-600 bg-white"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  >
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* KHỐI MỚI 3: DANH MỤC TÀI SẢN BÀN GIAO & HAO MÒN (ASSET MANAGEMENT) */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 select-none">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Hammer size={13} className="text-slate-400" /> Sổ niêm phong
                tài sản & Khấu hao nội thất bàn giao phòng
              </h3>
              <Badge
                variant="outline"
                className="bg-slate-50 border-slate-200 text-slate-500 text-[9px] font-bold rounded px-1.5 h-4.5"
              >
                {roomAssets.length} HẠNG MỤC
              </Badge>
            </div>

            {/* Lưới phân phối danh mục thiết bị phần cứng phẳng */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roomAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="border border-slate-100 bg-slate-50/30 rounded-xl p-3 flex flex-col justify-between space-y-3 hover:border-slate-300 hover:bg-white transition-all select-none"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-400 shrink-0">
                      {asset.name.includes("Điều hòa") ? (
                        <AirVent size={14} />
                      ) : asset.name.includes("Tủ lạnh") ? (
                        <Refrigerator size={14} />
                      ) : asset.name.includes("Khóa") ? (
                        <Lock size={14} />
                      ) : (
                        <Tv size={14} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-slate-800 text-[11px] block truncate">
                        {asset.name}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium block truncate mt-0.5">
                        {asset.model}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-slate-100/60 pt-2 text-[10px] font-mono">
                    <span className="text-slate-400 font-medium">
                      S/N:{" "}
                      <strong className="text-slate-600 font-bold">
                        {asset.serial}
                      </strong>
                    </span>
                    <Badge
                      className={`border-none text-[9px] font-bold font-sans px-1.5 py-0 rounded-sm ${asset.condition === "good" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700 animate-pulse"}`}
                    >
                      {asset.label}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= CỘT PHẢI (5 PHẦN): KIỂM ĐỊNH & PHÍ CỐ ĐỊNH PHÒNG ================= */}
        <div className="lg:col-span-5 space-y-4">
          {/* Kiểm định đồng hồ */}
          <div className="bg-slate-50/50 p-4 border border-slate-200/60 rounded-xl space-y-3 select-none">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100/80 pb-2">
              <Gauge size={13} /> Kiểm định & Niêm phong gốc
            </h4>
            <div className="space-y-2">
              {meteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white p-2.5 border border-slate-200/50 rounded-lg flex items-center justify-between text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 text-[11px] block truncate">
                      Đồng hồ {service.name} phòng
                    </span>
                    <span className="text-[9px] font-mono font-medium text-slate-400 block mt-0.5">
                      ID: MTR-{service.id.toUpperCase()}-101
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 justify-end">
                      <ShieldCheck size={12} /> Tem chì kín
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danh mục cước cố định phòng */}
          <div className="bg-white p-4 border border-slate-200/80 rounded-xl space-y-3">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide border-b border-slate-50 pb-2 select-none">
              Cước tiện ích dịch vụ cố định phòng
            </h4>
            <div className="space-y-1.5">
              {fixedServices.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg border border-slate-50 bg-slate-50/30 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="text-slate-400 shrink-0">{item.icon}</div>
                    <span className="font-semibold text-slate-700 truncate max-w-35">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-slate-900">
                      {item.price.toLocaleString("vi-VN")}đ
                    </span>
                    <span className="text-[9px] text-slate-400 block font-medium">
                      /{item.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* HẾT SPLIT LAYOUT */}
      </div>
    </div>
  );
}
