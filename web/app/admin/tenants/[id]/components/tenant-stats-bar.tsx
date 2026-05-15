import React from "react";
import { MetricCard } from "./ui-atoms";

interface TenantStatsBarProps {
  deposit: string;
  debt: string;
  expiryDays: string;
}

export function TenantStatsBar({
  deposit,
  debt,
  expiryDays,
}: TenantStatsBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        label="Tiền đặt cọc"
        value={deposit}
        unit="VND"
        color="text-slate-900"
      />
      <MetricCard
        label="Dư nợ hiện tại"
        value={debt}
        unit="VND"
        color="text-emerald-600"
      />
      <MetricCard
        label="Ngày hết hạn HĐ"
        value={expiryDays}
        unit="Ngày"
        color="text-amber-600"
      />
    </div>
  );
}
