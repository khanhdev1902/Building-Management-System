"use client";

import React, { useState } from "react";
import { Filter, FileDown, Calendar, Loader2, Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { toast } from "sonner";

// Định nghĩa các loại chu kỳ linh hoạt
type PeriodType = "current_month" | "last_month" | "custom_month" | "all_time";

export default function FinancialTopbar() {
  const [isExporting, setIsExporting] = useState(false);
  const [currentPeriod, setCurrentPeriod] =
    useState<PeriodType>("current_month");

  // State lưu trữ tháng năm tùy chọn (Định dạng chuẩn HTML: YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    return `${now.getFullYear()}-${mm}`;
  });

  // Lấy thời gian thực tại thời điểm chạy app để hiển thị động trên UI
  const now = new Date();
  const currentMonthStr = `${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;

  // Tính toán chuỗi hiển thị cho tháng trước
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthStr = `${String(lastMonthDate.getMonth() + 1).padStart(2, "0")}/${lastMonthDate.getFullYear()}`;

  // Hàm Helper tính toán nhãn nút bấm động
  const getPeriodLabel = () => {
    switch (currentPeriod) {
      case "current_month":
        return `Kỳ báo cáo: Th. ${currentMonthStr}`;
      case "last_month":
        return `Kỳ báo cáo: Th. ${lastMonthStr}`;
      case "custom_month":
        const [year, month] = selectedMonth.split("-");
        return `Kỳ báo cáo: Th. ${month}/${year}`;
      case "all_time":
        return "Kỳ báo cáo: Toàn thời gian";
      default:
        return "Lọc kì chu kỳ";
    }
  };

  const handlePeriodChange = (period: PeriodType, customValue?: string) => {
    setCurrentPeriod(period);
    let label = "";

    if (period === "custom_month" && customValue) {
      setSelectedMonth(customValue);
      const [year, month] = customValue.split("-");
      label = `tháng ${month}/${year}`;
    } else {
      label =
        period === "current_month"
          ? "tháng hiện tại"
          : period === "last_month"
            ? "tháng trước"
            : "toàn bộ lịch sử";
    }

    toast.info(`Đã cập nhật dữ liệu dòng tiền theo ${label}`);
    // Thực tế cưng truyền dữ liệu này ra component cha: fetchApi(period, period === "custom_month" ? customValue : null)
  };

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    const toastId = toast.loading(
      "Hệ thống đang trích xuất dữ liệu dòng tiền...",
    );

    try {
      // Gửi tham số thời gian thực tế lên backend NestJS
      const exportParams = {
        type: currentPeriod,
        targetDate: currentPeriod === "custom_month" ? selectedMonth : null,
      };
      console.log("Params gửi lên API:", exportParams);

      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Xuất file báo cáo tài chính gốc thành công!", {
        id: toastId,
      });
    } catch (error) {
      console.error(error);
      toast.error("Lỗi cấu trúc dữ liệu, không thể xuất file", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-4 select-none">
      {/* Khối tiêu đề */}
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Tổng quan Tài chính & Phân tích Dòng tiền
        </h2>
        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Hệ thống tự động đối soát Webhook ngân hàng kỳ này • Cập nhật lúc:{" "}
          <span className="font-mono font-bold text-slate-700">
            {now.getHours()}:{String(now.getMinutes()).padStart(2, "0")} hôm nay
          </span>
        </p>
      </div>

      {/* Khối cụm nút tương tác nghiệp vụ */}
      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
        {/* NÚT LỌC CHU KỲ DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="cursor-pointer h-9 text-xs font-semibold border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs rounded-lg flex-1 sm:flex-none gap-1.5 transition-colors focus:bg-slate-50"
            >
              <Filter size={14} className="text-slate-400 stroke-[1.8]" />
              <span className="font-medium text-slate-800">
                {getPeriodLabel()}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-64 rounded-xl p-1.5 border border-slate-200/80 shadow-md bg-white space-y-1"
          >
            <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1.5">
              Cấu hình kỳ đối soát tài chính
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100 my-1" />

            <DropdownMenuItem
              onClick={() => handlePeriodChange("current_month")}
              className="cursor-pointer text-xs font-medium text-slate-700 rounded-lg px-2 py-2 hover:bg-slate-50 flex items-center justify-between focus:bg-slate-50"
            >
              <div className="flex items-center gap-2">
                <Calendar size={13} className="text-slate-400" />
                <span>Tháng hiện tại ({currentMonthStr})</span>
              </div>
              {currentPeriod === "current_month" && (
                <Check size={14} className="text-indigo-600 stroke-[2.5]" />
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handlePeriodChange("last_month")}
              className="cursor-pointer text-xs font-medium text-slate-700 rounded-lg px-2 py-2 hover:bg-slate-50 flex items-center justify-between focus:bg-slate-50"
            >
              <div className="flex items-center gap-2">
                <Calendar size={13} className="text-slate-400" />
                <span>Tháng trước ({lastMonthStr})</span>
              </div>
              {currentPeriod === "last_month" && (
                <Check size={14} className="text-indigo-600 stroke-[2.5]" />
              )}
            </DropdownMenuItem>

            {/* THỰC TẾ CAO CẤP: Cho chọn tháng năm bất kỳ qua input control dẹt phẳng */}
            <div className="relative flex items-center gap-2 text-xs font-medium text-slate-700 rounded-lg px-2 py-1.5 hover:bg-slate-50/50 group">
              <Calendar size={13} className="text-slate-400 shrink-0" />
              <span className="grow">Tùy chọn tháng:</span>
              <input
                type="month"
                value={selectedMonth}
                max={`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`} // Không cho chọn tháng tương lai
                onChange={(e) => {
                  if (e.target.value)
                    handlePeriodChange("custom_month", e.target.value);
                }}
                className="cursor-pointer bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold font-mono px-2 py-0.5 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
              {currentPeriod === "custom_month" && (
                <Check
                  size={14}
                  className="text-indigo-600 stroke-[2.5] ml-1 shrink-0"
                />
              )}
            </div>

            <DropdownMenuSeparator className="bg-slate-100 my-1" />

            <DropdownMenuItem
              onClick={() => handlePeriodChange("all_time")}
              className="cursor-pointer text-xs font-medium text-slate-700 rounded-lg px-2 py-2 hover:bg-slate-50 flex items-center justify-between focus:bg-slate-50"
            >
              <div className="flex items-center gap-2">
                <Calendar size={13} className="text-slate-400" />
                <span>Sổ cái tổng (Toàn thời gian)</span>
              </div>
              {currentPeriod === "all_time" && (
                <Check size={14} className="text-indigo-600 stroke-[2.5]" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* NÚT XUẤT BÁO CÁO */}
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="cursor-pointer h-9 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-2xs flex-1 sm:flex-none gap-1.5 min-w-[140px] justify-center transition-all active:scale-[0.98]"
        >
          {isExporting ? (
            <Loader2 size={14} className="animate-spin text-slate-300" />
          ) : (
            <FileDown size={14} className="stroke-[1.8]" />
          )}
          <span>{isExporting ? "Đang trích xuất..." : "Xuất báo cáo gốc"}</span>
        </Button>
      </div>
    </div>
  );
}
