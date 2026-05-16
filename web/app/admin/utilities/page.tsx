"use client";

import React, { useState, useMemo } from "react";
import { SearchX, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";

// Import các hàng tuyển đã tách
import { FilterToolbar } from "./components/filter-toolbar";
import { MOCK_ROOMS } from "./mockup-data";
import { UtilityStatsBanner } from "./components/utility-stats-banner";
import { UtilityTableRow } from "./components/utility-table-row";
import { UtilityHeader } from "./components/utility-header";

const UNIT_PRICES = { electric: 3500, water: 15000 };
const ITEMS_PER_PAGE = 10;

export default function UtilityReadingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFloor, setActiveFloor] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Memoize data để tránh re-calculate khi không cần thiết
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
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      {/* Container hẹp lại một chút để tập trung thị giác */}
      <div className="max-w-[1400px] mx-auto px-4 space-y-8">
        <UtilityHeader
          currentMonth="T03/2026"
          deadline="30/03"
          onExport={() => {}}
          onSaveAll={() => {}}
        />

        <UtilityStatsBanner
          totalRooms={MOCK_ROOMS.length}
          electricDone={MOCK_ROOMS.filter((r) => r.isLocked).length}
          waterDone={38}
          issueCount={8}
          estimatedRevenue="142.5"
        />

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

        {/* Khu vực Table chính */}
        <div className="space-y-4">
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-xl overflow-hidden bg-white/80 backdrop-blur-md">
            <Table>
              <TableHeader className="bg-slate-50/50 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-24 pl-10 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                    Phòng
                  </TableHead>
                  <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">
                    Chủ hộ
                  </TableHead>
                  <TableHead className="min-w-[320px] font-black text-amber-600 uppercase text-[10px] tracking-widest">
                    Số ĐIỆN (kWh)
                  </TableHead>
                  <TableHead className="min-w-[320px] font-black text-blue-600 uppercase text-[10px] tracking-widest">
                    Số NƯỚC (m³)
                  </TableHead>
                  <TableHead className="text-right pr-10 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                    Tạm tính
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRooms.length > 0 ? (
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
                  <TableRow>
                    <TableCell colSpan={5} className="h-[400px] text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                        <SearchX className="w-12 h-12 opacity-20" />
                        <p className="font-bold text-sm">
                          Không tìm thấy phòng nào phù hợp
                        </p>
                        <Button
                          variant="link"
                          onClick={() => setSearchTerm("")}
                          className="text-indigo-600"
                        >
                          Xóa tìm kiếm
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          {/* 4. Pagination Component - Thanh mảnh và hiện đại */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                Hiển thị{" "}
                <span className="text-slate-900">{paginatedRooms.length}</span>{" "}
                trên{" "}
                <span className="text-slate-900">{filteredRooms.length}</span>{" "}
                phòng
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg hover:bg-slate-100"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "ghost"}
                      className={`w-8 h-8 rounded-lg text-[10px] font-black ${currentPage === i + 1 ? "bg-slate-900" : "text-slate-400"}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg hover:bg-slate-100"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
