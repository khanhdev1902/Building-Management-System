/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  ChartEntry,
  StatusType,
  Transaction,
  ViewMode,
} from "./types/revenue.type";
import {
  MONTH_LABELS,
  MONTHS,
  RAW_TRANSACTIONS,
  ROOM_OPTIONS,
  YEARS,
} from "./data";
import KpiCards from "./components/kpi-cards";
import TransactionTable from "./components/transaction-table";
import RevenueTrendChart from "./components/revenue-trend-chart";
import CollectionRateChart from "./components/collection-rate-chart";
import TopRoomsCard from "./components/top-rooms-card";
import MethodBreakdownChart from "./components/method-breakdown-chart";
import FeeBreakdownChart from "./components/fee-breakdown-chart";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getMonth(d: string) {
  return parseInt(d.slice(5, 7));
}
function getYear(d: string) {
  return parseInt(d.slice(0, 4));
}
function getQuarter(d: string) {
  return Math.ceil(getMonth(d) / 3);
}

// ─── FILTER LOGIC ─────────────────────────────────────────────────────────────
interface FilterState {
  viewMode: ViewMode;
  year: number;
  quarter: number | null;
  month: number | null;
  room: string;
  statusFilter: StatusType | "all";
}

function filterTransactions(txns: Transaction[], f: FilterState) {
  return txns.filter((t) => {
    if (f.room !== "all" && t.room !== f.room) return false;
    if (getYear(t.date) !== f.year) return false;
    if (
      f.viewMode === "month" &&
      f.month !== null &&
      getMonth(t.date) !== f.month
    )
      return false;
    if (
      f.viewMode === "quarter" &&
      f.quarter !== null &&
      getQuarter(t.date) !== f.quarter
    )
      return false;
    if (f.statusFilter !== "all" && t.status !== f.statusFilter) return false;
    return true;
  });
}

function buildChartData(txns: Transaction[], f: FilterState): ChartEntry[] {
  if (f.viewMode === "month") {
    return MONTHS.map((label, i) => {
      const m = i + 1;
      const slice = txns.filter(
        (t) => getYear(t.date) === f.year && getMonth(t.date) === m,
      );
      return {
        label,
        revenue: Math.round(
          slice
            .filter((t) => t.status === "Paid")
            .reduce((a, t) => a + t.amount, 0) / 1_000_000,
        ),
        debt: Math.round(
          slice
            .filter((t) => t.status === "Overdue")
            .reduce((a, t) => a + t.amount, 0) / 1_000_000,
        ),
      };
    });
  }
  if (f.viewMode === "quarter") {
    return [1, 2, 3, 4].map((q) => {
      const slice = txns.filter(
        (t) => getYear(t.date) === f.year && getQuarter(t.date) === q,
      );
      return {
        label: `Q${q}`,
        revenue: Math.round(
          slice
            .filter((t) => t.status === "Paid")
            .reduce((a, t) => a + t.amount, 0) / 1_000_000,
        ),
        debt: Math.round(
          slice
            .filter((t) => t.status === "Overdue")
            .reduce((a, t) => a + t.amount, 0) / 1_000_000,
        ),
      };
    });
  }
  return YEARS.map((y) => {
    const slice = txns.filter((t) => getYear(t.date) === y);
    return {
      label: `${y}`,
      revenue: Math.round(
        slice
          .filter((t) => t.status === "Paid")
          .reduce((a, t) => a + t.amount, 0) / 1_000_000,
      ),
      debt: Math.round(
        slice
          .filter((t) => t.status === "Overdue")
          .reduce((a, t) => a + t.amount, 0) / 1_000_000,
      ),
    };
  });
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function RevenueDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [year, setYear] = useState(2026);
  const [quarter, setQuarter] = useState<number>(2);
  const [month, setMonth] = useState<number>(5);
  const [room, setRoom] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusType | "all">("all");

  // State bộ lọc tổng hợp sạch sẽ
  const filterState: FilterState = useMemo(
    () => ({
      viewMode,
      year,
      quarter: viewMode === "quarter" ? quarter : null,
      month: viewMode === "month" ? month : null,
      room,
      statusFilter,
    }),
    [viewMode, year, quarter, month, room, statusFilter],
  );

  // Bộ data chart chỉ lọc theo Phòng, bỏ qua bộ lọc thời gian chi tiết để vẽ toàn thời gian
  const chartTxnsAll = useMemo(
    () => RAW_TRANSACTIONS.filter((t) => room === "all" || t.room === room),
    [room],
  );

  const chartData: ChartEntry[] = useMemo(
    () => buildChartData(chartTxnsAll, filterState),
    [chartTxnsAll, filterState],
  );

  // Danh sách hóa đơn hiển thị chuẩn chỉnh dưới Table (tuân thủ 100% bộ lọc)
  const visibleTxns = useMemo(
    () => filterTransactions(RAW_TRANSACTIONS, filterState),
    [filterState],
  );

  // Xử lý tổng hợp số liệu KPI dựa trên visibleTxns công thức động
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
  const total = useMemo(
    () => visibleTxns.reduce((a, t) => a + t.amount, 0),
    [visibleTxns],
  );
  const rate = total > 0 ? Math.round((paidTotal / total) * 1000) / 10 : 0;

  // Top 5 phòng thực thu cao nhất dựa theo kỳ thời gian đang chọn
  const top5 = useMemo(() => {
    const map: Record<string, { name: string; amount: number }> = {};
    RAW_TRANSACTIONS.filter((t) => {
      if (getYear(t.date) !== year) return false;
      if (
        viewMode === "month" &&
        t.status === "Paid" &&
        getMonth(t.date) !== month
      )
        return false;
      if (
        viewMode === "quarter" &&
        t.status === "Paid" &&
        getQuarter(t.date) !== quarter
      )
        return false;
      return t.status === "Paid";
    }).forEach((t) => {
      if (!map[t.room]) map[t.room] = { name: t.name, amount: 0 };
      map[t.room].amount += t.amount;
    });
    return Object.entries(map)
      .map(([room, v]) => ({ room, ...v }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [year, viewMode, month, quarter]);

  // Phân rã phương thức thanh toán ăn theo danh sách hóa đơn đang lọc
  const methodPie = useMemo(() => {
    const map: Record<string, number> = {};
    visibleTxns
      .filter((t) => t.status === "Paid")
      .forEach((t) => {
        map[t.method] = (map[t.method] ?? 0) + t.amount;
      });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value: Math.round(value / 1_000_000),
    }));
  }, [visibleTxns]);

  const periodLabel = useMemo(() => {
    if (viewMode === "month") return `Tháng ${month}/${year}`;
    if (viewMode === "quarter") return `Quý ${quarter}/${year}`;
    return `Năm ${year}`;
  }, [viewMode, month, quarter, year]);

  const chartTitle =
    viewMode === "month"
      ? `12 tháng năm ${year}`
      : viewMode === "quarter"
        ? `4 quý năm ${year}`
        : `Tất cả các năm`;

  return (
    <div className="max-w-7xl mx-auto px-5 py-6 space-y-6 bg-slate-50/30 min-h-screen antialiased font-sans select-none">
      {/* ── HEADER & FILTERS ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-200/60 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" /> Tổng quan tài
            chính — Danjin Tower
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {periodLabel} · Cập nhật đối soát hệ thống
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View mode toggle */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/40 h-8 items-center text-xs font-semibold">
            {(["month", "quarter", "year"] as ViewMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`h-7 px-3 rounded-md transition-colors cursor-pointer ${viewMode === m ? "bg-white shadow-3xs text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
              >
                {m === "month" ? "Tháng" : m === "quarter" ? "Quý" : "Năm"}
              </button>
            ))}
          </div>

          <Select
            value={String(year)}
            onValueChange={(v) => setYear(Number(v))}
          >
            <SelectTrigger className="h-8 text-xs w-24 bg-white border-slate-200 rounded-lg font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-xs rounded-xl">
              {YEARS.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  Năm {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {viewMode === "quarter" && (
            <Select
              value={String(quarter)}
              onValueChange={(v) => setQuarter(Number(v))}
            >
              <SelectTrigger className="h-8 text-xs w-24 bg-white border-slate-200 rounded-lg font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs rounded-xl">
                {[1, 2, 3, 4].map((q) => (
                  <SelectItem key={q} value={String(q)}>
                    Quý {q}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {viewMode === "month" && (
            <Select
              value={String(month)}
              onValueChange={(v) => setMonth(Number(v))}
            >
              <SelectTrigger className="h-8 text-xs w-28 bg-white border-slate-200 rounded-lg font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs rounded-xl">
                {MONTH_LABELS.map((label, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={room} onValueChange={setRoom}>
            <SelectTrigger className="h-8 text-xs w-48 bg-white border-slate-200 rounded-lg font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-xs rounded-xl">
              {ROOM_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v: any) => setStatusFilter(v)}
          >
            <SelectTrigger className="h-8 text-xs w-32 bg-white border-slate-200 rounded-lg font-medium">
              <SelectValue placeholder="Trạng thái thu" />
            </SelectTrigger>
            <SelectContent className="text-xs rounded-xl font-semibold">
              <SelectItem value="all">Mọi trạng thái</SelectItem>
              <SelectItem value="Paid" className="text-emerald-600">
                ✓ Đã thu
              </SelectItem>
              <SelectItem value="Pending" className="text-amber-600">
                Chờ khớp
              </SelectItem>
              <SelectItem value="Overdue" className="text-rose-600">
                ⚠ Quá hạn
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <KpiCards visibleTxns={visibleTxns} />

      {/* ── CHARTS ROW 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
        <div className="lg:col-span-4">
          <RevenueTrendChart
            chartData={chartData}
            chartTitle={chartTitle}
            periodLabel={periodLabel}
            viewMode={viewMode}
          />
        </div>

        <div className="lg:col-span-3">
          <CollectionRateChart
            rate={rate}
            paidTotal={paidTotal}
            overdueTotal={overdueTotal}
            periodLabel={periodLabel}
          />
        </div>
      </div>

      {/* ── CHARTS ROW 2 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <TopRoomsCard rooms={top5} periodLabel={periodLabel} />
        <FeeBreakdownChart />
        <MethodBreakdownChart methodPie={methodPie} />
      </div>

      {/* ── ROW 3: TABLE RỘNG 100% ── */}
      <TransactionTable visibleTxns={visibleTxns} />
    </div>
  );
}
