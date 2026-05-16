"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { HistoryPopover } from "./history-popover"; // Giả định chú tách popover ra riêng

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
      className={`group transition-all ${isLocked ? "bg-emerald-50/30" : "hover:bg-slate-50/50"}`}
    >
      <TableCell className="pl-8">
        <div
          className={`text-xl font-black ${isLocked ? "text-emerald-700" : "text-slate-900"}`}
        >
          {room}
        </div>
        {isLocked && (
          <Badge className="bg-emerald-500 text-[8px] h-4">ĐÃ CHỐT</Badge>
        )}
      </TableCell>

      <TableCell>
        <div className="font-bold text-slate-700 text-sm">{tenant}</div>
        <div className="text-[10px] text-slate-400">
          {isLocked ? (
            <span className="text-emerald-600 font-medium italic">
              Vừa xác nhận
            </span>
          ) : (
            "Chưa có dữ liệu"
          )}
        </div>
      </TableCell>

      {/* Nhập Điện */}
      <TableCell>
        <div
          className={`flex items-center gap-2 p-2 rounded-2xl border transition-all ${
            isLocked
              ? "border-emerald-200 bg-white/50"
              : eUsage < 0
                ? "bg-red-50 border-red-200"
                : "bg-slate-50 border-transparent focus-within:bg-white focus-within:border-amber-400"
          }`}
        >
          <div className="flex flex-col min-w-10 pl-1 opacity-60">
            <span className="text-[8px] font-bold uppercase">Cũ</span>
            <span className="font-mono text-xs font-bold text-slate-600">
              {eOld}
            </span>
          </div>
          <ArrowRight
            className={`w-3 h-3 ${isLocked ? "text-emerald-300" : "text-slate-300"}`}
          />
          <div className="flex-1 relative">
            <Input
              type="number"
              disabled={isLocked}
              placeholder="..."
              className="border-none bg-transparent shadow-none h-9 font-bold focus-visible:ring-0"
              value={eNew}
              onChange={(e) => setENew(e.target.value)}
            />
            {!isLocked && eUsage > 0 && (
              <Badge className="absolute -top-3 -right-1 font-black text-[9px] bg-amber-500">
                +{eUsage}
              </Badge>
            )}
          </div>
          <HistoryPopover label={`Phòng ${room} - Điện`} unit="kWh" />
        </div>
      </TableCell>

      {/* Nhập Nước */}
      <TableCell>
        <div
          className={`flex items-center gap-2 p-2 rounded-2xl border transition-all ${
            isLocked
              ? "border-emerald-200 bg-white/50"
              : wUsage < 0
                ? "bg-red-50 border-red-200"
                : "bg-slate-50 border-transparent focus-within:bg-white focus-within:border-blue-400"
          }`}
        >
          <div className="flex flex-col min-w-10 pl-1 opacity-60">
            <span className="text-[8px] font-bold uppercase">Cũ</span>
            <span className="font-mono text-xs font-bold text-slate-600">
              {wOld}
            </span>
          </div>
          <ArrowRight
            className={`w-3 h-3 ${isLocked ? "text-emerald-300" : "text-slate-300"}`}
          />
          <div className="flex-1 relative">
            <Input
              type="number"
              disabled={isLocked}
              placeholder="..."
              className="border-none bg-transparent shadow-none h-9 font-bold focus-visible:ring-0"
              value={wNew}
              onChange={(e) => setWNew(e.target.value)}
            />
            {!isLocked && wUsage > 0 && (
              <Badge className="absolute -top-3 -right-1 font-black text-[9px] bg-blue-500">
                +{wUsage}
              </Badge>
            )}
          </div>
          <HistoryPopover label={`Phòng ${room} - Nước`} unit="m³" />
        </div>
      </TableCell>

      <TableCell className="text-right pr-8">
        <div className="flex flex-col items-end gap-1">
          {isLocked ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLocked(false)}
              className="h-7 text-slate-400 hover:text-amber-600"
            >
              <X className="w-3 h-3 mr-1" /> Mở
            </Button>
          ) : (
            <Button
              disabled={!canLock}
              onClick={() => setIsLocked(true)}
              className={`h-8 rounded-lg font-black text-[10px] uppercase ${canLock ? "bg-emerald-600 text-white shadow-md shadow-emerald-100" : "bg-slate-100 text-slate-300"}`}
            >
              <CheckCircle2 className="w-3 h-3 mr-1.5" /> Chốt
            </Button>
          )}
          <div
            className={`text-xs font-black ${isLocked ? "text-emerald-700" : tempTotal > 0 ? "text-slate-900" : "text-slate-300"}`}
          >
            {tempTotal.toLocaleString()}đ
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
