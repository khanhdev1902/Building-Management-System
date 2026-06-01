"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  History,
  LayoutGrid,
  FilterX,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { assetApi } from "../apis/asset.api";
import { RoomAsset } from "../types/asset.type";

// Bản đồ ánh xạ Status từ Backend -> Giao diện Tiếng Việt + Style
const statusConfig: Record<
  string,
  { label: string; dot: string; text: string }
> = {
  Active: {
    label: "Ổn định",
    dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]",
    text: "text-emerald-700 bg-emerald-50/60 border-emerald-100",
  },
  Maintenance: {
    label: "Bảo trì",
    dot: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]",
    text: "text-amber-700 bg-amber-50/60 border-amber-100",
  },
  Broken: {
    label: "Lỗi kỹ thuật",
    dot: "bg-rose-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]",
    text: "text-rose-700 bg-rose-50/60 border-rose-100",
  },
};

export function InventoryManager() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roomAssets, setRoomAssets] = useState<RoomAsset[]>([]);
  const [roomFilter, setRoomFilter] = useState("all");
  const itemsPerPage = 8;

  // Gọi API lấy dữ liệu thực tế từ hệ thống
  useEffect(() => {
    const getRoomAsset = async () => {
      try {
        const res = await assetApi.getAllRoomAssets();
        setRoomAssets(res.data || []);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu tài sản:", error);
      }
    };
    getRoomAsset();
  }, []);

  // Tính toán số lượng thiết bị động theo từng phòng dựa trên assetQuantity
  const roomOptions = useMemo(() => {
    const counts: Record<string, number> = {};
    let totalCount = 0;

    roomAssets.forEach((item) => {
      if (item.roomNumber) {
        const roomKey = item.roomNumber.trim();
        const quantity = item.assetQuantity ?? 1;
        counts[roomKey] = (counts[roomKey] || 0) + quantity;
        totalCount += quantity;
      }
    });

    const list = Object.entries(counts).map(([roomNumber, quantity]) => ({
      roomNumber,
      quantity,
    }));

    return { total: totalCount, list };
  }, [roomAssets]);

  // Bộ lọc nâng cao dữ liệu hệ thống (Đã sửa lỗi so sánh và bọc chống sập chuỗi)
  const filteredData = useMemo(() => {
    return roomAssets.filter((item) => {
      // Ép về chuỗi an toàn, tránh lỗi crash luồng nếu BE trả về null/undefined
      const assetNameSafe = item.assetName
        ? String(item.assetName).toLowerCase()
        : "";
      const assetIdSafe = item.assetId
        ? String(item.assetId).toLowerCase()
        : "";
      const searchSafe = search.toLowerCase().trim();

      // 1. Khớp điều kiện Tìm kiếm (Mã hoặc Tên)
      const matchSearch =
        assetNameSafe.includes(searchSafe) || assetIdSafe.includes(searchSafe);

      // 2. Khớp điều kiện Tình trạng
      const matchStatus =
        statusFilter === "all" || item.assetStatus === statusFilter;

      // 3. Khớp điều kiện Vị trí phòng (Chuẩn hóa trim khoảng trắng)
      const matchRoom =
        roomFilter === "all" ||
        (item.roomNumber && item.roomNumber.trim() === roomFilter.trim());

      return matchSearch && matchStatus && matchRoom;
    });
  }, [search, statusFilter, roomFilter, roomAssets]);

  // Phân trang dữ liệu hiển thị (Pagination)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setRoomFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="bg-white border border-slate-200/80 flex flex-col min-h-145 rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02),0_8px_24px_-10px_rgba(15,23,42,0.04)] transition-all">
      {/* 1. Thanh Công cụ (Toolbar) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 border-b border-slate-100 bg-slate-50/40">
        <div className="relative w-full sm:flex-1 min-w-0 sm:min-w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 stroke-[1.6]"
            size={14}
          />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 h-9 bg-white border-slate-200 focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/10 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 transition-all"
            placeholder="Tìm mã thiết bị hoặc tên linh kiện..."
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          {/* Lọc Trạng Thái */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-36 text-xs font-medium border-slate-200 bg-white text-slate-600 rounded-lg shadow-2xs hover:bg-slate-50/80 transition-colors">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-slate-200 shadow-md">
              <SelectItem value="all" className="text-xs">
                Mọi trạng thái
              </SelectItem>
              <SelectItem value="Active" className="text-xs">
                Ổn định vận hành
              </SelectItem>
              <SelectItem value="Maintenance" className="text-xs">
                Đang bảo trì
              </SelectItem>
              <SelectItem value="Broken" className="text-xs">
                Lỗi kỹ thuật
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Lọc Vị Trí Phòng */}
          <Select
            value={roomFilter}
            onValueChange={(val) => {
              setRoomFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-42 text-xs font-medium border-slate-200 bg-white text-slate-600 rounded-lg shadow-2xs hover:bg-slate-50/80 transition-colors">
              <SelectValue placeholder="Vị trí phòng" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-slate-200 shadow-md">
              <SelectItem value="all" className="text-xs">
                <div className="flex justify-between w-full items-center gap-3">
                  <span>Tất cả phòng</span>
                  <span className="text-[10px] px-1.5 py-0.2 font-mono font-bold bg-slate-100 text-slate-500 rounded-full">
                    {roomOptions.total}
                  </span>
                </div>
              </SelectItem>
              {roomOptions.list.map((r) => (
                <SelectItem
                  key={r.roomNumber}
                  value={r.roomNumber}
                  className="text-xs"
                >
                  <div className="flex justify-between w-full items-center gap-3">
                    <span>{r.roomNumber}</span>
                    <span className="text-[10px] px-1.5 py-0.2 font-mono font-bold bg-indigo-50 text-indigo-600 rounded-full">
                      {r.quantity}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Nút Clear Filter nhanh */}
          {(search || statusFilter !== "all" || roomFilter !== "all") && (
            <Button
              onClick={resetFilters}
              variant="ghost"
              className="h-9 px-2.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-dashed border-rose-200 bg-rose-50/20 text-xs font-medium"
            >
              <Trash2 size={13} className="mr-1 stroke-[1.8]" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* 2. Khối Bảng Dữ Liệu hiển thị chính */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse table-fixed min-w-175">
          <thead>
            <tr className="bg-slate-50/40 border-b border-slate-100/80 select-none">
              <th className="w-[14%] py-3 px-5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Mã thiết bị
              </th>
              <th className="w-[31%] py-3 px-5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Tên tài sản hệ thống
              </th>
              <th className="w-[12%] py-3 px-5 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">
                Số lượng
              </th>
              <th className="w-[15%] py-3 px-5 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">
                Vị trí lắp đặt
              </th>
              <th className="w-[18%] py-3 px-5 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">
                Tình trạng
              </th>
              <th className="w-[10%] py-3 px-5 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60">
            {currentData.length > 0 ? (
              currentData.map((item, key) => {
                // Lấy style cấu hình trạng thái hoặc dùng fallback mặc định
                const currentStatus = statusConfig[item.assetStatus] || {
                  label: item.assetStatus || "Chưa rõ",
                  dot: "bg-slate-400",
                  text: "text-slate-600 bg-slate-50 border-slate-200",
                };

                // Cắt ngắn ID chỉ lấy 8 ký tự đầu cho gọn đẹp bố cục (Ví dụ: #7a276357...)
                const shortId = item.assetId
                  ? `${item.assetId.substring(0, 8)}...`
                  : "N/A";

                return (
                  <tr
                    key={key}
                    className="hover:bg-slate-50/30 transition-colors group"
                  >
                    {/* Cột ID thiết bị */}
                    <td
                      className="py-3.5 px-5 font-mono text-[11px] text-slate-400 font-medium"
                      title={item.assetId}
                    >
                      #{shortId}
                    </td>

                    {/* Cột Tên tài sản */}
                    <td className="py-3.5 px-5">
                      <span className="text-xs font-semibold text-slate-800 block truncate group-hover:text-indigo-600 transition-colors">
                        {item.assetName}
                      </span>
                    </td>

                    {/* Cột Số lượng */}
                    <td className="py-3.5 px-5 text-center">
                      <span className="inline-block text-xs font-semibold text-slate-600 font-mono bg-slate-100/80 px-2 py-0.5 rounded-md min-w-6">
                        {item.assetQuantity ?? 1}
                      </span>
                    </td>

                    {/* Cột Vị trí phòng */}
                    <td className="py-3.5 px-5 text-center">
                      <span className="text-xs font-bold text-slate-600 font-mono bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                        {item.roomNumber || "Chưa xếp"}
                      </span>
                    </td>

                    {/* Cột Tình trạng hiển thị (Đã dịch nghĩa sang Tiếng Việt) */}
                    <td className="py-3.5 px-5">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${currentStatus.text}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`}
                          />
                          {currentStatus.label}
                        </span>
                      </div>
                    </td>

                    {/* Cột Tương tác Hành động */}
                    <td className="py-3.5 px-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-7 w-7 p-0 rounded-md sm:opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                          >
                            <MoreHorizontal
                              size={14}
                              className="stroke-[1.8]"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-38 border-slate-200/80 shadow-md rounded-xl p-1 bg-white animate-in fade-in-50 duration-100"
                        >
                          <DropdownMenuItem className="text-xs font-medium gap-2 py-2 cursor-pointer text-slate-600 focus:bg-slate-50 focus:text-slate-900 rounded-lg">
                            <History size={13} className="text-slate-400" /> Xem
                            lịch sử
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs font-medium gap-2 py-2 cursor-pointer text-slate-600 focus:bg-slate-50 focus:text-slate-900 rounded-lg">
                            <LayoutGrid size={13} className="text-slate-400" />{" "}
                            Cấu hình chi tiết
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            ) : (
              /* Trạng thái bảng rỗng không có data */
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center max-w-xs mx-auto text-slate-400 space-y-2">
                    <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-full text-slate-400 mb-1">
                      <FilterX size={18} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xs font-semibold text-slate-800">
                      Không có kết quả
                    </h3>
                    <p className="text-[11px] text-slate-400 text-center leading-normal">
                      Không tìm thấy thiết bị nào trùng khớp với thông số bộ lọc
                      hiện tại.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Thanh Phân Trang (Footer) */}
      <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-white shrink-0 select-none">
        <p className="text-xs font-medium text-slate-400">
          Hiển thị{" "}
          <span className="text-slate-800 font-bold font-mono">
            {currentData.length}
          </span>{" "}
          trên {filteredData.length} thiết bị
        </p>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500">
            Trang{" "}
            <span className="text-slate-900 font-bold font-mono">
              {currentPage}
            </span>{" "}
            / {totalPages || 1}
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-md border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all disabled:opacity-40"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={13} className="stroke-[1.8]" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-md border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all disabled:opacity-40"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight size={13} className="stroke-[1.8]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
