/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { Badge } from "@/shared/components/ui/badge";
import {
  CalendarDays,
  User2,
  ArrowRight,
  History,
  Info,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";

export const ContractHistorySheet = ({ isOpen, onClose, contracts }: any) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {/* Tăng độ rộng sheet để ko bị chật, dùng border nhẹ nhàng */}
      <SheetContent className=" max-w-full sm:max-w-xl border-l border-slate-100 p-0 overflow-hidden flex flex-col">
        {/* Header Clean hơn */}
        <div className="p-8 pb-6 border-b border-slate-50">
          <SheetHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center">
                <History className="w-5 h-5 text-white" />
              </div>
              <SheetTitle className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                Lịch sử thuê phòng
              </SheetTitle>
            </div>
            <SheetDescription className="text-slate-500 text-sm leading-relaxed">
              Hiển thị danh sách các kỳ hạn hợp đồng đã và đang thực hiện tại
              phòng này.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Nội dung cuộn */}
        <div className="flex-1 overflow-y-auto p-8 pt-6 bg-slate-50/30">
          <div className="relative">
            {/* Timeline Line: Làm mờ hơn */}
            <div className="absolute left-2.75 top-2 bottom-0 w-px bg-slate-200" />

            <div className="space-y-10 relative">
              {contracts.map((item: any) => (
                <div key={item.id} className="relative pl-9 group">
                  {/* Timeline Point: Nhỏ và tinh tế hơn */}
                  <div
                    className={cn(
                      "absolute left-0 top-1.5 w-5.75 h-5.75 rounded-full border-4 border-white z-10",
                      item.status === "active"
                        ? "bg-indigo-600"
                        : "bg-slate-300",
                    )}
                  />

                  <div className="space-y-4">
                    {/* Header Card: ID & Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold text-slate-400 font-mono tracking-wider">
                        #{item.id}
                      </span>
                      <Badge
                        className={cn(
                          "rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter shadow-none",
                          item.status === "active"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200",
                        )}
                      >
                        {item.status === "active"
                          ? "Đang hiệu lực"
                          : "Đã kết thúc"}
                      </Badge>
                    </div>

                    {/* Main Content: Phẳng hơn, Card tối giản */}
                    <div
                      className={cn(
                        "p-5 rounded-xl border transition-all",
                        item.status === "active"
                          ? "bg-white border-indigo-200 shadow-sm"
                          : "bg-white border-slate-200 shadow-none hover:border-slate-300",
                      )}
                    >
                      {/* Đại diện thuê */}
                      <div className="flex items-start gap-3 mb-5">
                        <div className="h-9 w-9 rounded bg-slate-100 flex items-center justify-center shrink-0">
                          <User2 size={16} className="text-slate-500" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            Người đại diện
                          </p>
                          <p className="text-sm font-bold text-slate-800">
                            {item.representative}
                          </p>
                        </div>
                      </div>

                      {/* Thông số: Grid thoáng đạt */}
                      <div className="grid grid-cols-2 gap-8 py-4 border-y border-slate-50 mb-4">
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            Giá thuê
                          </p>
                          <p className="text-base font-bold text-slate-900">
                            {item.price.toLocaleString()}{" "}
                            <span className="text-xs font-normal">đ</span>
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            Tiền cọc
                          </p>
                          <p className="text-base font-bold text-indigo-600">
                            {item.deposit.toLocaleString()}{" "}
                            <span className="text-xs font-normal text-indigo-400">
                              đ
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Thời gian */}
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <CalendarDays size={14} className="text-slate-400" />
                        <span className="text-xs tracking-tight">
                          {item.startDate}
                        </span>
                        <ArrowRight size={12} className="text-slate-300 mx-1" />
                        <span className="text-xs tracking-tight">
                          {item.endDate}
                        </span>
                      </div>
                    </div>

                    {/* Ghi chú: Box riêng biệt, tinh tế */}
                    {item.note && (
                      <div className="ml-2 flex gap-2 items-start p-3 bg-amber-50/50 rounded-lg border border-amber-100/50">
                        <Info
                          size={14}
                          className="text-amber-500 shrink-0 mt-0.5"
                        />
                        <p className="text-xs text-amber-700/80 leading-snug font-medium">
                          {item.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
