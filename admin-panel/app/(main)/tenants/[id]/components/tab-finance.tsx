import React, { useState } from "react";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Filter,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";

// Giả lập dữ liệu lớn (20 dòng)
const MOCK_DATA = Array.from({ length: 20 }).map((_, i) => ({
  id: `INV-2024-${(i + 1).toString().padStart(3, "0")}`,
  type: i % 3 === 0 ? "Tiền điện" : i % 3 === 1 ? "Tiền nước" : "Phí dịch vụ",
  month: `Tháng 0${(i % 4) + 1}/2026`,
  amount: (Math.floor(Math.random() * 2000) + 100).toLocaleString(),
  status: i < 5 ? "paid" : "unpaid",
  date: i < 5 ? "05/04/2026" : "N/A",
}));

export function TabFinance() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Hiển thị 6 dòng mỗi trang cho đẹp

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = MOCK_DATA.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(MOCK_DATA.length / itemsPerPage);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* 1. Summary Cards (Giữ nguyên) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FinanceSummaryCard
          label="Tổng đã đóng"
          amount="25.400.000"
          icon={<ArrowDownLeft className="text-emerald-500" />}
          subText="Tính từ đầu năm"
        />
        <FinanceSummaryCard
          label="Nợ cần thu"
          amount="1.350.000"
          icon={<ArrowUpRight className="text-red-500" />}
          subText="Hạn chót: 10/04"
          isAlert
        />
        <FinanceSummaryCard
          label="Quỹ dự phòng"
          amount="4.500.000"
          icon={<CreditCard className="text-indigo-500" />}
          subText="Tiền cọc hợp đồng"
        />
      </div>

      {/* 2. ADVANCED TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Tìm mã hóa đơn, loại phí..."
              className="pl-9 h-9 text-[13px] border-slate-200 rounded-md shadow-none focus-visible:ring-1 focus-visible:ring-slate-950"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 border-slate-200"
          >
            <Filter size={14} className="text-slate-500" />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-4 text-[11px] font-bold uppercase tracking-wider border-slate-200"
          >
            <Download size={14} className="mr-2" /> Xuất báo cáo
          </Button>
          {/* <Button
            size="sm"
            className="h-9 px-4 text-[11px] font-bold uppercase tracking-wider bg-slate-900 hover:bg-black shadow-none"
          >
            <Plus size={14} className="mr-2" /> Tạo phiếu thu
          </Button> */}
        </div>
      </div>

      {/* 3. Transaction Table với Cố định chiều cao */}
      <div className="space-y-4">
        <div className="rounded-sm border border-slate-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Mã hóa đơn
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Nội dung phí
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/30 transition-colors group"
                  >
                    <td className="px-4 py-3.5 text-xs font-mono text-slate-500">
                      {item.id}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-[13px] font-bold text-slate-700">
                        {item.type}
                      </p>
                      <p className="text-[11px] text-slate-400">{item.month}</p>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] font-bold text-slate-800">
                      {item.amount}đ
                    </td>
                    <td className="px-4 py-3.5">
                      {item.status === "paid" ? (
                        <Badge className="bg-emerald-50 text-emerald-600 border-none px-2 py-0.5 text-[10px] font-bold">
                          Đã đóng
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-50 text-amber-600 border-none px-2 py-0.5 text-[10px] font-bold">
                          Chưa đóng
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 group-hover:text-indigo-600"
                      >
                        <FileText size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4. Pagination: Bộ điều hướng trang */}
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <p className="text-[11px] font-medium text-slate-500">
              Hiển thị {indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfLastItem, MOCK_DATA.length)} trong tổng số{" "}
              {MOCK_DATA.length}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 border-slate-200"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={14} />
              </Button>
              <div className="flex items-center gap-1 px-2">
                <span className="text-xs font-bold text-slate-700">
                  {currentPage}
                </span>
                <span className="text-xs text-slate-400">/</span>
                <span className="text-xs text-slate-400">{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 border-slate-200"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FinanceSummaryCard({ label, amount, icon, subText, isAlert }: any) {
  return (
    <div
      className={`p-4 rounded-sm border ${isAlert ? "border-red-100 bg-red-50/30" : "border-slate-100 bg-white"} shadow-xs`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <div className="p-1.5 bg-white rounded-sm shadow-xs border border-slate-100">
          {icon}
        </div>
      </div>
      <p className="text-xl font-black text-slate-900 leading-none">
        {amount}{" "}
        <span className="text-xs font-medium uppercase text-slate-400 ml-1">
          VND
        </span>
      </p>
      <p className="text-[10px] font-medium text-slate-400 mt-2">{subText}</p>
    </div>
  );
}
