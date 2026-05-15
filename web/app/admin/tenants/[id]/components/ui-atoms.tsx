/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FileText, Download } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

// 1. Thẻ số liệu (Tiền cọc, dư nợ...)
export function MetricCard({
  label,
  value,
  unit,
  color = "text-slate-900",
}: any) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-2xl font-bold tracking-tight ${color}`}>
          {value}
        </span>
        <span className="text-xs font-semibold text-slate-400">{unit}</span>
      </div>
    </div>
  );
}

// 2. Dòng thông tin Sidebar (SĐT, Email...)
export function SidebarInfoItem({ icon, label, value }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
        {label}
      </p>
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <span className="text-slate-400 scale-90">
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<any>, { size: 14 })
            : icon}
        </span>
        {value}
      </div>
    </div>
  );
}

// 3. Dòng nhân khẩu
export function PeopleRow({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-slate-50/50">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
          {name.charAt(0)}
        </div>
        <span className="text-[13px] font-medium text-slate-700">{name}</span>
      </div>
      <span className="text-[11px] font-medium text-slate-400 px-2 py-0.5 bg-slate-50 rounded border border-slate-100">
        {role}
      </span>
    </div>
  );
}

// 4. Thẻ file tài liệu
export function FileCard({ name, size }: { name: string; size: string }) {
  return (
    <div className="flex items-center justify-between p-2.5 bg-slate-50/50 border border-slate-100 rounded-lg group hover:border-indigo-200 transition-colors">
      <div className="flex items-center gap-2 overflow-hidden">
        <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
        <span className="text-xs font-medium text-slate-600 truncate">
          {name}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-medium text-slate-400 uppercase">
          {size}
        </span>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Download className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// 5. Dòng nhật ký (Dạng chấm tròn)
export function TimelineRow({
  date,
  title,
  type,
}: {
  date: string;
  title: string;
  type: "finance" | "incident" | "system";
}) {
  const iconMap: any = {
    finance: <div className="w-2 h-2 rounded-full bg-emerald-500" />,
    incident: <div className="w-2 h-2 rounded-full bg-red-500" />,
    system: <div className="w-2 h-2 rounded-full bg-indigo-500" />,
  };

  return (
    <div className="relative pl-7">
      <div className="absolute left-2.25 top-1.5 z-10">{iconMap[type]}</div>
      <div>
        <p className="text-[11px] font-medium text-slate-400 mb-0.5">{date}</p>
        <p className="text-[13px] font-semibold text-slate-700">{title}</p>
      </div>
    </div>
  );
}

// 6. Dòng chi tiết (Dạng Key - Value)
export function DetailRow({
  label,
  value,
  isBold,
  color = "text-slate-700",
}: any) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={`${isBold ? "font-bold" : "font-medium"} ${color}`}>
        {value}
      </span>
    </div>
  );
}

// 7. Thẻ chỉ số Điện/Nước
export function UtilityCard({ icon, label, value, unit, sub, trend }: any) {
  return (
    <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 text-slate-400 mb-3">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-tight">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-xl font-bold text-slate-900">{value}</span>
        <span className="text-[10px] font-medium text-slate-400">{unit}</span>
      </div>
      <p
        className={`text-[10px] font-medium ${trend === "up" ? "text-red-500" : "text-slate-400"}`}
      >
        {sub}
      </p>
    </div>
  );
}

// 8. Bước tiến trình (Dạng Timeline ngang)
export function TimelineStep({ date, title, status, isLast }: any) {
  const colors: any = {
    completed: "bg-emerald-500",
    pending: "bg-indigo-500",
    upcoming: "bg-slate-200",
  };
  return (
    <div
      className={`flex flex-col min-w-30 relative ${!isLast ? "flex-1" : ""}`}
    >
      {!isLast && (
        <div className="absolute top-1.5 left-3 w-full h-0.5 bg-slate-100 z-0" />
      )}
      <div
        className={`w-3 h-3 rounded-full ${colors[status]} z-10 border-2 border-white shadow-sm mb-2`}
      />
      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
        {date}
      </p>
      <p className="text-[11px] font-bold text-slate-700">{title}</p>
    </div>
  );
}
