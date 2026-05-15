"use client";

import React from "react";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  highlight?: boolean;
  className?: string;
}

export const StatCard = ({
  label,
  value,
  subValue,
  highlight,
  className,
}: StatCardProps) => {
  return (
    <Card
      className={cn(
        "border-slate-200/60 shadow-sm rounded-xl p-5 space-y-2 transition-all",
        highlight && "bg-indigo-50/30 border-indigo-100",
        className,
      )}
    >
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <div className="space-y-0.5">
        <p
          className={cn(
            "text-lg font-bold tracking-tight",
            highlight ? "text-indigo-600" : "text-slate-900",
          )}
        >
          {value}
        </p>
        {subValue && (
          <p className="text-[11px] text-slate-500 font-medium">{subValue}</p>
        )}
      </div>
    </Card>
  );
};
