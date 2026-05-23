"use client";

import React, { useState, useMemo, useEffect } from "react";
import { SearchX, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";

// Import hệ thống component đã được tối ưu hóa đồng bộ
import { FilterToolbar } from "./components/filter-toolbar";
import { MOCK_ROOMS } from "./mockup-data";
import { UtilityStatsBanner } from "./components/utility-stats-banner";
import { UtilityTableRow } from "./components/utility-table-row";
import { UtilityHeader } from "./components/utility-header";
import { toast } from "sonner";

const UNIT_PRICES = { electric: 3500, water: 15000 };
const ITEMS_PER_PAGE = 10;

export default function UtilityReadingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFloor, setActiveFloor] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // KHẮC PHỤC: Bổ sung biến trạng thái Loading hệ thống
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập trạng thái đồng bộ dữ liệu ban đầu
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); // Hiệu ứng Shimmer chạy lướt nhẹ 600ms rất chuyên nghiệp
    return () => clearTimeout(timer);
  }, []);

  // Lọc dữ liệu mượt mà ở Client-side
  const filteredRooms = useMemo(() => {
    return MOCK_ROOMS.filter((room) => {
      const matchesSearch =
        room.roomNumber.includes(searchTerm) ||
        room.tenantName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFloor = activeFloor === "all" || room.floor === activeFloor;
      const matchesStatus =
        activeStatus === "all" ||
        (activeStatus === "done" ? room.isLocked : !room.isLocked);
      return matchesSearch && matchesFloor && matchesStatus;
    });
  }, [searchTerm, activeFloor, activeStatus]);

  // Logic Phân trang
  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
  const paginatedRooms = useMemo(() => {
    return filteredRooms.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );
  }, [filteredRooms, currentPage]);

  return (
    <div className="bg-slate-50/40 min-h-screen antialiased selection:bg-indigo-50">
      {/* KHẮC PHỤC: Ép space-y từ 6 xuống 4 để kéo sát Header và Banner lại gần nhau */}
      <div className="max-w-7xl mx-auto px-4 space-y-4 w-full">
        {/* 1. Tuyến đầu: Header chốt kỳ hạn */}
        <UtilityHeader
          currentMonth="T03/2026"
          deadline="30/03"
          onExport={() => {
            toast.info("Thông báo hệ thống!", {
              description: "Chức năng này đang trong quá trình phát triển...",
            });
          }}
          onSaveAll={() => {
            toast.info("Thông báo hệ thống!", {
              description: "Chức năng này đang trong quá trình phát triển...",
            });
          }}
        />

        {/* 2. Tuyến hai: Khối thống kê tiến độ chốt số */}
        <UtilityStatsBanner
          totalRooms={MOCK_ROOMS.length}
          electricDone={MOCK_ROOMS.filter((r) => r.isLocked).length}
          waterDone={38}
          issueCount={8}
          estimatedRevenue="142.5"
        />

        {/* 3. Tuyến ba: Thanh công cụ tìm kiếm và lọc tầng thông minh (h-10) */}
        <FilterToolbar
          searchTerm={searchTerm}
          setSearchTerm={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          activeFloor={activeFloor}
          setActiveFloor={(val) => {
            setActiveFloor(val);
            setCurrentPage(1);
          }}
          activeStatus={activeStatus}
          setActiveStatus={(val) => {
            setActiveStatus(val);
            setCurrentPage(1);
          }}
          onReset={() => {
            setSearchTerm("");
            setActiveFloor("all");
            setActiveStatus("all");
            setCurrentPage(1);
          }}
        />

        {/* 4. Khu vực chính: Bảng nhập liệu phẳng tràn viền cao cấp */}
        <div className="border border-slate-200/80 bg-white rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.01),0_12px_24px_-4px_rgba(15,23,42,0.03)] flex flex-col min-h-125">
          <div className="overflow-x-auto flex-1">
            <Table className="w-full min-w-225">
              <TableHeader className="bg-slate-50/40 border-b border-slate-100/80 select-none">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[12%] pl-6 py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                    Phòng
                  </TableHead>
                  <TableHead className="w-[18%] py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                    Cư dân đại diện
                  </TableHead>
                  <TableHead className="w-[31%] py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                    Chỉ số điện nhập mới (kWh)
                  </TableHead>
                  <TableHead className="w-[31%] py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                    Chỉ số nước nhập mới (m³)
                  </TableHead>
                  <TableHead className="w-[8%] text-right pr-6 py-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                    Thành tiền
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100/60">
                {/* KHẮC PHỤC: Tích hợp hiệu ứng Loading Skeleton động cho Table Row */}
                {isLoading ? (
                  Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <TableRow
                      key={i}
                      className="animate-pulse hover:bg-transparent"
                    >
                      <TableCell className="pl-6 py-4.5">
                        <div className="h-4 bg-slate-100 rounded w-12" />
                      </TableCell>
                      <TableCell className="py-4.5">
                        <div className="h-4 bg-slate-100 rounded w-28" />
                      </TableCell>
                      <TableCell className="py-4.5">
                        <div className="h-9 bg-slate-50/60 border border-slate-100/70 rounded-lg w-full" />
                      </TableCell>
                      <TableCell className="py-4.5">
                        <div className="h-9 bg-slate-50/60 border border-slate-100/70 rounded-lg w-full" />
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4.5">
                        <div className="h-4 bg-slate-100 rounded w-16 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : paginatedRooms.length > 0 ? (
                  paginatedRooms.map((room) => (
                    <UtilityTableRow
                      key={room.id}
                      room={room.roomNumber}
                      tenant={room.tenantName}
                      eOld={room.eOld}
                      wOld={room.wOld}
                      unitPrices={UNIT_PRICES}
                    />
                  ))
                ) : (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="h-100 text-center">
                      <div className="flex flex-col items-center justify-center max-w-xs mx-auto text-slate-400 space-y-2">
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-full text-slate-400 mb-1">
                          <SearchX size={20} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xs font-semibold text-slate-800">
                          Không tìm thấy phòng
                        </h3>
                        <p className="text-[11px] text-slate-400 text-center leading-normal">
                          Không có căn hộ nào trùng khớp với số phòng hoặc tên
                          cư dân bạn tìm kiếm.
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => setSearchTerm("")}
                          className="text-xs font-medium text-indigo-600 mt-1"
                        >
                          Xóa bộ lọc tìm kiếm
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* 5. Khối điều hướng phân trang: Đồng bộ biến isLoading an toàn */}
          {!isLoading && totalPages > 1 && (
            <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between shrink-0 select-none">
              <p className="text-xs font-medium text-slate-400">
                Hiển thị{" "}
                <span className="text-slate-800 font-semibold font-mono">
                  {paginatedRooms.length}
                </span>{" "}
                trên {filteredRooms.length} căn hộ
              </p>

              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-500">
                  Trang{" "}
                  <span className="text-slate-900 font-semibold font-mono">
                    {currentPage}
                  </span>{" "}
                  / {totalPages}
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-md border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all disabled:opacity-40"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="w-3.5 h-3.5 stroke-[1.8]" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-md border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all disabled:opacity-40"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                    }}
                  >
                    <ChevronRight className="w-3.5 h-3.5 stroke-[1.8]" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
