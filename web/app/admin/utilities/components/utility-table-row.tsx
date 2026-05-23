"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Check,
  EllipsisVertical,
  History,
  X,
  UserSearch,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { HistoryPopover } from "./history-popover";
import {
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/shared/components/ui/dropdown-menu";
import { UtilityHistoryDialog } from "./UtilityHistoryDialog";
import { toast } from "sonner";

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

  // Khống chế chặt chẽ: Chỉ số mới bắt buộc phải lớn hơn hoặc bằng chỉ số cũ
  const isInputInvalid =
    (eNew !== "" && eUsage < 0) || (wNew !== "" && wUsage < 0);
  const canLock = eNew !== "" && wNew !== "" && !isInputInvalid;

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <TableRow
      className={`group transition-all duration-200 border-l-2 ${
        isLocked
          ? "bg-emerald-50/20 hover:bg-emerald-50/30 border-l-emerald-500"
          : "hover:bg-slate-50/40 border-l-transparent"
        /* KHẮC PHỤC 3: Giữ nguyên border-l-2 trong suốt từ đầu để triệt tiêu lỗi giật khung hình khi bấm chốt */
      }`}
    >
      {/* 1. Cột Số Phòng & Badge dẹt */}
      <TableCell className="pl-6 py-3 select-none">
        <div className="flex flex-col gap-1">
          <span
            className={`text-sm font-bold font-mono tracking-tight ${isLocked ? "text-emerald-700" : "text-slate-800"}`}
          >
            P.{room}
          </span>
          {isLocked && (
            <Badge className="bg-emerald-600 hover:bg-emerald-600 text-[9px] font-bold h-4.5 px-1.5 rounded self-start shadow-none uppercase tracking-wide">
              Đã chốt số
            </Badge>
          )}
        </div>
      </TableCell>

      {/* 2. Cột Tên Cư Dân */}
      <TableCell className="py-3 select-none">
        <div className="flex flex-col space-y-0.5">
          <span className="font-bold text-slate-700 text-xs tracking-tight">
            {tenant}
          </span>
          <span
            className={`text-[10px] font-semibold ${isLocked ? "text-emerald-600 font-bold" : "text-slate-400"}`}
          >
            {isLocked ? "✓ Đã khóa sổ công nợ" : "• Đang chờ nạp số mới"}
          </span>
        </div>
      </TableCell>

      {/* 3. Ô Nhập Chỉ Số Điện */}
      <TableCell className="py-3">
        <div
          className={`flex items-center gap-2 px-2.5 h-8.5 rounded-lg border transition-all ${
            isLocked
              ? "border-emerald-200 bg-white/50"
              : eNew !== "" && eUsage < 0
                ? "bg-rose-50/60 border-rose-200" // Cảnh báo đỏ rực nếu nhập lùi số
                : "bg-slate-50/40 border-slate-200/80 focus-within:bg-white focus-within:border-slate-400 shadow-2xs"
          }`}
        >
          <div className="flex flex-col min-w-7 select-none opacity-50">
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
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
              placeholder="Gõ số mới..."
              className="border-none bg-transparent shadow-none h-full p-0 text-xs text-slate-800 focus-visible:ring-0 w-full placeholder:text-slate-400 placeholder:font-normal"
              value={eNew}
              onChange={(e) => setENew(e.target.value)}
            />

            {!isLocked && eUsage > 0 && (
              <span className="text-[9px] font-bold font-mono text-amber-600 bg-amber-50 border border-amber-100/60 px-1 py-0.2 rounded shrink-0 select-none animate-in fade-in duration-200">
                +{eUsage} kWh
              </span>
            )}
          </div>

          <HistoryPopover label={`Phòng ${room} - Điện`} unit="kWh" />
        </div>
      </TableCell>

      {/* 4. Ô Nhập Chỉ Số Nước */}
      <TableCell className="py-3">
        <div
          className={`flex items-center gap-2 px-2.5 h-8.5 rounded-lg border transition-all ${
            isLocked
              ? "border-emerald-200 bg-white/50"
              : wNew !== "" && wUsage < 0
                ? "bg-rose-50/60 border-rose-200"
                : "bg-slate-50/40 border-slate-200/80 focus-within:bg-white focus-within:border-slate-400 shadow-2xs"
          }`}
        >
          <div className="flex flex-col min-w-7 select-none opacity-50">
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
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
              placeholder="Gõ số mới..."
              className="border-none bg-transparent shadow-none h-full p-0 text-xs text-slate-800 focus-visible:ring-0 w-full placeholder:text-slate-400 placeholder:font-normal"
              value={wNew}
              onChange={(e) => setWNew(e.target.value)}
            />

            {!isLocked && wUsage > 0 && (
              <span className="text-[9px] font-bold font-mono text-blue-600 bg-blue-50 border border-blue-100/60 px-1 py-0.2 rounded shrink-0 select-none animate-in fade-in duration-200">
                +{wUsage} m³
              </span>
            )}
          </div>

          <HistoryPopover label={`Phòng ${room} - Nước`} unit="m³" />
        </div>
      </TableCell>

      {/* 5. Cột Thành Tiền & Nút Thao Tác */}
      <TableCell className="text-right py-3">
        <div className="flex items-center justify-end gap-4 h-8.5">
          <div className="flex flex-col items-end justify-center select-none">
            <span
              className={`text-xs font-bold font-mono tracking-tight ${isLocked ? "text-emerald-700 font-black" : tempTotal > 0 && !isInputInvalid ? "text-slate-900" : "text-slate-300"}`}
            >
              {isInputInvalid
                ? "Số liệu lỗi"
                : `${tempTotal.toLocaleString("vi-VN")}đ`}
            </span>
            <span className="text-[9px] font-medium text-slate-400 leading-none mt-0.5">
              Tạm tính
            </span>
          </div>

          <div className="shrink-0 w-20 flex justify-end">
            {isLocked ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsLocked(false)}
                className="h-7 px-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50/60 rounded-md text-xs font-bold transition-colors cursor-pointer"
              >
                <X className="w-3 h-3 mr-1 stroke-[2.5]" /> Mở khóa
              </Button>
            ) : (
              <Button
                type="button"
                disabled={!canLock}
                onClick={() => setIsLocked(true)}
                className={`h-7 px-3 rounded-md text-xs font-bold gap-1 transition-all active:scale-[0.98] cursor-pointer ${
                  canLock
                    ? "bg-slate-950 hover:bg-slate-900 text-white shadow-3xs"
                    : "bg-slate-100 text-slate-300 pointer-events-none shadow-none"
                }`}
              >
                <Check className="w-3 h-3 stroke-3" />
                <span>Chốt số</span>
              </Button>
            )}
          </div>
        </div>
      </TableCell>

      {/* 6. Ô Dropdown tác vụ phụ bổ trợ */}
      <TableCell className="pr-4 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* KHẮC PHỤC 2: Định hình h-7 w-7 vuông vắn cho nút ba chấm đồng tâm */}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100/60 cursor-pointer transition-colors"
            >
              <EllipsisVertical size={14} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-48 p-1.5 rounded-xl border-slate-200/80 shadow-md bg-white select-none"
          >
            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
              Tác vụ phòng {room}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 border-slate-100" />

            <DropdownMenuItem
              onClick={() => setIsHistoryOpen(true)} // Bật modal lên!
              className="cursor-pointer gap-2 rounded-lg py-2 text-slate-600 text-xs font-semibold focus:bg-slate-50 transition-colors"
            >
              <History size={13} className="text-slate-400" /> Lịch sử điện nước
            </DropdownMenuItem>

            <DropdownMenuItem
              className="gap-2 rounded-lg py-2 text-slate-600 text-xs font-semibold focus:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => {
                toast.info("Thông báo hệ thống!", {
                  description:
                    "Chức năng này đang trong quá trình phát triển...",
                });
              }}
            >
              <UserSearch size={13} className="text-slate-400" /> Tra cứu hồ sơ
              cư dân
            </DropdownMenuItem>

            <DropdownMenuItem
              className="gap-2 rounded-lg py-2 text-slate-600 text-xs font-semibold focus:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => {
                toast.info("Thông báo hệ thống!", {
                  description:
                    "Chức năng này đang trong quá trình phát triển...",
                });
              }}
            >
              <AlertTriangle size={13} className="text-slate-400" /> Báo lỗi
              đồng hồ bãi
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 border-slate-100" />
            <DropdownMenuItem
              className="gap-2 rounded-lg py-2 text-rose-500 text-xs font-bold focus:bg-rose-50 focus:text-rose-600 cursor-pointer transition-colors"
              onClick={() => {
                toast.info("Thông báo hệ thống!", {
                  description:
                    "Chức năng này đang trong quá trình phát triển...",
                });
              }}
            >
              <Trash2 size={13} /> Xóa trống chỉ số kì này
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>

      <UtilityHistoryDialog
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        roomNumber={room}
      />
    </TableRow>
  );
};
