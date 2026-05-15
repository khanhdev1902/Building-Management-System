"use client";

import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ArrowUpDown,
  History,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

// Tạo dữ liệu giả lập lớn để test phân trang
const MOCK_DATA = Array.from({ length: 25 }, (_, i) => ({
  id: `DK-992-X${i + 1}`,
  name: i % 2 === 0 ? "Daikin Inverter 1.5 HP" : "LG Dual Cool 1.0 HP",
  room: `P.${100 + i}`,
  status: i % 3 === 0 ? "Bảo trì" : "Ổn định",
  category: i % 2 === 0 ? "Điện lạnh" : "Gia dụng",
}));

export function InventoryManager() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const totalPages = Math.ceil(MOCK_DATA.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = MOCK_DATA.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar: Làm phẳng và sắc nét hơn */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors"
            size={14}
          />
          <Input
            className="pl-9 h-10 bg-transparent border-zinc-200 rounded-none border-b focus-visible:ring-0 focus-visible:border-zinc-900 transition-all placeholder:text-zinc-300 text-sm"
            placeholder="Tìm kiếm thực thể thiết bị..."
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-10 rounded-none border-zinc-200 px-4 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-50"
          >
            <Filter size={14} className="mr-2" /> Lọc trạng thái
          </Button>
          <Button
            variant="outline"
            className="h-10 rounded-none border-zinc-200 px-4 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-50"
          >
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Table Section: Phẳng hóa hoàn toàn */}
      <div className="border border-zinc-100 bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-100">
              <th className="p-4 text-[10px] font-black uppercase text-zinc-400 tracking-[0.15em] pl-8">
                Mã định danh (S/N)
              </th>
              <th className="p-4 text-[10px] font-black uppercase text-zinc-400 tracking-[0.15em]">
                Thiết bị{" "}
                <ArrowUpDown size={10} className="inline ml-1 opacity-50" />
              </th>
              <th className="p-4 text-[10px] font-black uppercase text-zinc-400 tracking-[0.15em]">
                Vị trí lắp đặt
              </th>
              <th className="p-4 text-[10px] font-black uppercase text-zinc-400 tracking-[0.15em]">
                Phân loại
              </th>
              <th className="p-4 text-[10px] font-black uppercase text-zinc-400 tracking-[0.15em] text-right">
                Tình trạng
              </th>
              <th className="w-12 pr-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {currentData.map((item) => (
              <TableRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>

        {/* Custom Pagination: Phong cách Industrial */}
        <div className="px-8 py-4 bg-white border-t border-zinc-100 flex items-center justify-between">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Hiển thị {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, MOCK_DATA.length)} /{" "}
            {MOCK_DATA.length} thiết bị
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-6 h-6 text-[10px] font-mono transition-all ${
                    currentPage === i + 1
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-400 hover:text-zinc-900"
                  }`}
                >
                  {(i + 1).toString().padStart(2, "0")}
                </button>
              ))}
            </div>
            <div className="flex gap-1 border-l border-zinc-100 pl-6">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-none hover:bg-zinc-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                <ChevronLeft size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-none hover:bg-zinc-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component TableRow để code gọn hơn
function TableRow({ item }: { item: any }) {
  return (
    <tr className="hover:bg-zinc-50/50 transition-colors group">
      <td className="p-4 pl-8 font-mono text-[11px] font-bold text-zinc-400">
        {item.id}
      </td>
      <td className="p-4">
        <div className="space-y-0.5">
          <p className="font-bold text-zinc-900 text-xs">{item.name}</p>
          <p className="text-[9px] text-zinc-300 font-medium uppercase tracking-tight">
            Model Architecture 2026
          </p>
        </div>
      </td>
      <td className="p-4">
        <span className="inline-flex items-center px-2 py-0.5 border border-zinc-200 text-zinc-600 text-[9px] font-black uppercase tracking-tighter">
          {item.room}
        </span>
      </td>
      <td className="p-4 text-[11px] font-medium text-zinc-500">
        {item.category}
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-tight ${
              item.status === "Ổn định" ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            {item.status}
          </span>
          <div
            className={`w-1 h-1 rounded-full ${
              item.status === "Ổn định"
                ? "bg-emerald-500"
                : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
            }`}
          />
        </div>
      </td>
      <td className="p-4 pr-8 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal size={14} className="text-zinc-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-none border-zinc-200 shadow-xl w-48 p-1"
          >
            <DropdownMenuItem className="text-[10px] font-bold uppercase tracking-widest py-2.5 cursor-pointer">
              <History size={12} className="mr-2" /> Xem nhật ký
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[10px] font-bold uppercase tracking-widest py-2.5 cursor-pointer">
              Điều chuyển vị trí
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[10px] font-bold uppercase tracking-widest py-2.5 cursor-pointer text-red-600">
              Báo lỗi kỹ thuật
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
