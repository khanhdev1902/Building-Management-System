/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

interface InfoRowProps {
  icon: React.ReactElement;
  label: string;
  value: string;
  className?: string;
}

export const InfoRow = ({ icon, label, value, className }: InfoRowProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="text-slate-400">
        {/* Clone để ép size icon đồng nhất 14px */}
        {React.cloneElement(icon, { size: 14 } as any)}
      </div>
      <div className="flex-1 flex justify-between items-center">
        <span className="text-xs text-slate-500 font-medium">{label}</span>
        <span className="text-sm font-bold text-slate-800">{value}</span>
      </div>
    </div>
  );
};
