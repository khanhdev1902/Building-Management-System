// src/app/revenue/components/kpi-cards.tsx
"use client";

import React, { useMemo } from "react";
import {
  Banknote,
  CreditCard,
  ArrowUpRight,
  FileText,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Transaction } from "../types/revenue.type";

// ─── HELPER ĐỊNH DẠNG TIỀN TỆ ──────────────────────────────────────────────────
const fmt = (n: number) =>
  (n / 1_000_000).toLocaleString("vi-VN", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }) + "M đ";

interface KpiCardsProps {
  visibleTxns: Transaction[];
}

export default function KpiCards({ visibleTxns }: KpiCardsProps) {
  // ⚡ Tự động tính toán các chỉ số động ăn theo bộ lọc đã truyền xuống
  const paidTotal = useMemo(
    () =>
      visibleTxns
        .filter((t) => t.status === "Paid")
        .reduce((a, t) => a + t.amount, 0),
    [visibleTxns],
  );
  const overdueTotal = useMemo(
    () =>
      visibleTxns
        .filter((t) => t.status === "Overdue")
        .reduce((a, t) => a + t.amount, 0),
    [visibleTxns],
  );
  const pendingCount = useMemo(
    () => visibleTxns.filter((t) => t.status === "Pending").length,
    [visibleTxns],
  );
  const overdueCount = useMemo(
    () => visibleTxns.filter((t) => t.status === "Overdue").length,
    [visibleTxns],
  );
  const total = useMemo(
    () => visibleTxns.reduce((a, t) => a + t.amount, 0),
    [visibleTxns],
  );

  const rate = total > 0 ? Math.round((paidTotal / total) * 1000) / 10 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
      {/* CARD 1: DOANH THU THỰC THU */}
      <KpiItem
        title="Dòng tiền thực thu"
        value={fmt(paidTotal)}
        sub={`${visibleTxns.filter((t) => t.status === "Paid").length} giao dịch thành công`}
        icon={Banknote}
        accent="emerald"
        badge={<TrendingUp size={11} className="text-emerald-600" />}
      />

      {/* CARD 2: CÔNG NỢ QUÁ HẠN */}
      <KpiItem
        title="Công nợ quá hạn"
        value={fmt(overdueTotal)}
        sub={`Treo ${overdueCount} chứng từ gốc`}
        icon={CreditCard}
        accent="rose"
        badge={
          overdueCount > 0 ? (
            <Badge className="bg-rose-50 text-rose-700 border-none px-1.5 py-0 rounded text-[9px] font-black">
              RỦI RO
            </Badge>
          ) : (
            <Badge className="bg-slate-100 text-slate-500 border-none px-1.5 py-0 rounded text-[9px]">
              SẠCH
            </Badge>
          )
        }
      />

      {/* CARD 3: TỶ LỆ THU HỒI */}
      <KpiItem
        title="Tỷ lệ thu hồi"
        value={`${rate}%`}
        sub="Mục tiêu tài khóa: 95%"
        icon={ArrowUpRight}
        accent={rate >= 95 ? "emerald" : rate >= 85 ? "indigo" : "rose"}
        badge={
          <div className="w-16 bg-slate-100 h-1 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${rate >= 95 ? "bg-emerald-500" : rate >= 85 ? "bg-indigo-600" : "bg-rose-500"}`}
              style={{ width: `${Math.min(rate, 100)}%` }}
            />
          </div>
        }
      />

      {/* CARD 4: CHỜ XÁC NHẬN */}
      <KpiItem
        title="Chờ xác nhận"
        value={`${pendingCount} hóa đơn`}
        sub={`Tổng ${visibleTxns.length} hóa đơn kỳ này`}
        icon={FileText}
        accent="amber"
        badge={
          pendingCount > 0 ? (
            <span className="text-[10px] text-amber-600 font-bold">
              • Đối soát lệnh
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 font-medium">
              • Đã khớp hết
            </span>
          )
        }
      />
    </div>
  );
}

// ─── COMPONENT CON NỘI BỘ (Đã được định nghĩa Type chuẩn chỉnh) ──────────────
interface KpiItemProps {
  title: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  accent: "emerald" | "rose" | "indigo" | "amber"; // ⚡ Giới hạn key chính xác ở đây
  badge: React.ReactNode;
}

function KpiItem({
  title,
  value,
  sub,
  icon: Icon,
  accent,
  badge,
}: KpiItemProps) {
  const map = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-sm transition-shadow">
      <div className="space-y-0.5 min-w-0 pr-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
          {title}
        </span>
        <h4 className="text-xl font-black text-slate-900 tracking-tight font-mono">
          {value}
        </h4>
        <div className="flex items-center gap-1.5 pt-0.5">
          {badge}
          <span className="text-[10px] font-medium text-slate-400 truncate">
            {sub}
          </span>
        </div>
      </div>
      <div className={`p-2.5 rounded-xl border shrink-0 ${map[accent]}`}>
        <Icon className="w-4 h-4 stroke-[2.2]" />
      </div>
    </div>
  );
}
