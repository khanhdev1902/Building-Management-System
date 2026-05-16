"use client";
import { History } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Separator } from "@/shared/components/ui/separator";

// Mock history data internal hoặc truyền từ props
const MOCK_HISTORY = [
  { month: "02/2026", index: 1250, usage: 140, amount: "490.000" },
  { month: "01/2026", index: 1110, usage: 135, amount: "472.500" },
];

export const HistoryPopover = ({
  label,
  unit,
}: {
  label: string;
  unit: string;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-slate-300 hover:text-indigo-600 transition-all"
      >
        <History className="w-3.5 h-3.5" />
      </Button>
    </PopoverTrigger>
    <PopoverContent
      className="w-72 p-0 rounded-2xl overflow-hidden border-none shadow-2xl"
      align="end"
    >
      <div className="bg-slate-900 p-3 text-white">
        <h4 className="font-bold text-xs">{label}</h4>
        <p className="text-[9px] text-slate-400 uppercase mt-1 tracking-wider">
          3 kỳ gần nhất
        </p>
      </div>
      <div className="p-3 space-y-3 bg-white">
        {MOCK_HISTORY.map((h, i) => (
          <div key={i} className="text-[10px]">
            <div className="flex justify-between font-bold">
              <span className="text-slate-400">{h.month}</span>
              <span className="text-indigo-600">
                +{h.usage} {unit}
              </span>
            </div>
            <div className="flex justify-between text-[9px] mt-0.5">
              <span className="italic text-slate-400">Chỉ số: {h.index}</span>
              <span className="text-emerald-600 font-bold">{h.amount}đ</span>
            </div>
            {i < MOCK_HISTORY.length - 1 && (
              <Separator className="mt-2 opacity-50" />
            )}
          </div>
        ))}
      </div>
    </PopoverContent>
  </Popover>
);
