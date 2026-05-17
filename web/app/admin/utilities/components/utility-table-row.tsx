"use client";

import React, { useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { HistoryPopover } from "./history-popover";

interface UtilityRowProps {
  room: string;
  tenant: string;
  eOld: number;
  wOld: number;
  unitPrices: { electric: number; water: number };
}

export const UtilityTableRow = ({
  room,
  tenant,
  eOld,
  wOld,
  unitPrices,
}: UtilityRowProps) => {
  const [eNew, setENew] = useState("");
  const [wNew, setWNew] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  const eUsage = eNew ? Number(eNew) - eOld : 0;
  const wUsage = wNew ? Number(wNew) - wOld : 0;
  const tempTotal = eUsage * unitPrices.electric + wUsage * unitPrices.water;

  const canLock = eNew !== "" && wNew !== "" && eUsage >= 0 && wUsage >= 0;

  return (
    <TableRow
      className={`group transition-all duration-200 ${
        isLocked
          ? "bg-emerald-50/20 hover:bg-emerald-50/30 border-l-2 border-l-emerald-500"
          : "hover:bg-slate-50/40"
      }`}
    >
      {/* 1. Cột Số Phòng & Badge trạng thái đồng bộ */}
      <TableCell className="pl-6 py-3">
        <div className="flex flex-col gap-1">
          <span
            className={`text-sm font-bold font-mono tracking-tight ${isLocked ? "text-emerald-700" : "text-slate-800"}`}
          >
            P.{room}
          </span>
          {isLocked && (
            <Badge className="bg-emerald-600 hover:bg-emerald-600 text-[9px] font-medium h-4.5 px-1.5 rounded self-start shadow-2xs">
              Đã chốt số
            </Badge>
          )}
        </div>
      </TableCell>

      {/* 2. Cột Tên Cư Dân & Gợi ý trạng thái */}
      <TableCell className="py-3">
        <div className="flex flex-col space-y-0.5">
          <span className="font-semibold text-slate-700 text-xs tracking-tight">
            {tenant}
          </span>
          <span
            className={`text-[10px] font-medium ${isLocked ? "text-emerald-600 italic" : "text-slate-400"}`}
          >
            {isLocked ? "Đã xác nhận sổ" : "Chưa có chỉ số mới"}
          </span>
        </div>
      </TableCell>

      {/* 3. Ô Nhập Chỉ Số Điện Tinh Xảo */}
      <TableCell className="py-3">
        <div
          className={`flex items-center gap-2 px-2.5 h-9 rounded-lg border transition-all ${
            isLocked
              ? "border-emerald-200 bg-white/60 shadow-2xs"
              : eUsage < 0
                ? "bg-rose-50/60 border-rose-200"
                : "bg-slate-50/50 border-slate-200/60 focus-within:bg-white focus-within:border-slate-400"
          }`}
        >
          {/* Chỉ số cũ phẳng */}
          <div className="flex flex-col min-w-8 select-none opacity-60">
            <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider">
              Cũ
            </span>
            <span className="font-mono text-xs font-bold text-slate-600 leading-none">
              {eOld}
            </span>
          </div>

          <ArrowRight
            className={`w-3 h-3 shrink-0 ${isLocked ? "text-emerald-300" : "text-slate-300"}`}
          />

          <div className="flex-1 flex items-center justify-between gap-1.5 min-w-0">
            <Input
              type="number"
              disabled={isLocked}
              placeholder="Nhập số mới..."
              className="border-none bg-transparent shadow-none h-full p-0 font-mono text-xs font-semibold text-slate-800 focus-visible:ring-0 w-full placeholder:text-slate-400 placeholder:font-normal"
              value={eNew}
              onChange={(e) => setENew(e.target.value)}
            />

            {/* Badge tiêu thụ tích hợp gọn gàng vào trong góc phải ô input */}
            {!isLocked && eUsage > 0 && (
              <span className="text-[10px] font-bold font-mono text-amber-600 bg-amber-50 border border-amber-100/60 px-1 py-0.2 rounded shrink-0 select-none animate-in fade-in duration-300">
                +{eUsage} kWh
              </span>
            )}
          </div>

          <HistoryPopover label={`Phòng ${room} - Điện`} unit="kWh" />
        </div>
      </TableCell>

      {/* 4. Ô Nhập Chỉ Số Nước Tinh Xảo */}
      <TableCell className="py-3">
        <div
          className={`flex items-center gap-2 px-2.5 h-9 rounded-lg border transition-all ${
            isLocked
              ? "border-emerald-200 bg-white/60 shadow-2xs"
              : wUsage < 0
                ? "bg-rose-50/60 border-rose-200"
                : "bg-slate-50/50 border-slate-200/60 focus-within:bg-white focus-within:border-slate-400"
          }`}
        >
          <div className="flex flex-col min-w-8 select-none opacity-60">
            <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider">
              Cũ
            </span>
            <span className="font-mono text-xs font-bold text-slate-600 leading-none">
              {wOld}
            </span>
          </div>

          <ArrowRight
            className={`w-3 h-3 shrink-0 ${isLocked ? "text-emerald-300" : "text-slate-300"}`}
          />

          <div className="flex-1 flex items-center justify-between gap-1.5 min-w-0">
            <Input
              type="number"
              disabled={isLocked}
              placeholder="Nhập số mới..."
              className="border-none bg-transparent shadow-none h-full p-0 font-mono text-xs font-semibold text-slate-800 focus-visible:ring-0 w-full placeholder:text-slate-400 placeholder:font-normal"
              value={wNew}
              onChange={(e) => setWNew(e.target.value)}
            />

            {!isLocked && wUsage > 0 && (
              <span className="text-[10px] font-bold font-mono text-blue-600 bg-blue-50 border border-blue-100/60 px-1 py-0.2 rounded shrink-0 select-none animate-in fade-in duration-300">
                +{wUsage} m³
              </span>
            )}
          </div>

          <HistoryPopover label={`Phòng ${room} - Nước`} unit="m³" />
        </div>
      </TableCell>

      {/* 5. Cột Thành Tiền & Nút Điều Hướng Tác Vụ */}
      <TableCell className="text-right pr-6 py-3">
        <div className="flex items-center justify-end gap-3.5 h-9">
          {/* Con số tổng tiền dạt sang trái của nút bấm */}
          <div className="flex flex-col items-end justify-center">
            <span
              className={`text-xs font-bold font-mono tracking-tight ${
                isLocked
                  ? "text-emerald-700"
                  : tempTotal > 0
                    ? "text-slate-800"
                    : "text-slate-300 select-none"
              }`}
            >
              {tempTotal.toLocaleString("vi-VN")}đ
            </span>
            <span className="text-[9px] font-medium text-slate-400 leading-none">
              Tạm tính
            </span>
          </div>

          <div className="shrink-0 w-16 flex justify-end">
            {isLocked ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLocked(false)}
                className="h-7 px-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50/60 rounded-md text-xs font-medium transition-colors"
              >
                <X className="w-3 h-3 mr-1 stroke-2" /> Mở khóa
              </Button>
            ) : (
              <Button
                disabled={!canLock}
                onClick={() => setIsLocked(true)}
                className={`h-7 px-2.5 rounded-md text-xs font-medium gap-1 transition-all active:scale-[0.98] ${
                  canLock
                    ? "bg-slate-900 hover:bg-slate-800 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-300 pointer-events-none"
                }`}
              >
                <Check className="w-3 h-3 stroke-[2.5]" />
                <span>Chốt</span>
              </Button>
            )}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
