"use client";

import React from "react";
import {
  CheckCircle,
  Clock,
  FileText,
  Building,
  Users,
  Megaphone,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Notification } from "./NotificationTableRow";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NotificationDetailDialogProps {
  notification: Notification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide w-28 shrink-0 pt-0.5">
        {label}
      </span>
      <div className="flex-1 text-xs font-semibold text-slate-700">
        {children}
      </div>
    </div>
  );
}

// function TypeBadgeDetail({ type }: { type: Notification["type"] }) {
//   const map = {
//     finance: { label: "Tài chính", cls: "bg-blue-50 text-blue-700" },
//     maintenance: { label: "Bảo trì", cls: "bg-amber-50 text-amber-700" },
//     life: { label: "Đời sống", cls: "bg-emerald-50 text-emerald-700" },
//   };
//   const { label, cls } = map[type] ?? map.life;
//   return (
//     <Badge
//       variant="outline"
//       className={`border-none rounded-md text-[10px] font-bold px-1.5 py-0.5 ${cls}`}
//     >
//       {label}
//     </Badge>
//   );
// }

function TypeBadgeDetail({ type }: { type: Notification["type"] }) {
  // Định nghĩa cụ thể kiểu cho Object Map để nhận mọi key string
  const map: Record<string, { label: string; cls: string }> = {
    finance: { label: "Tài chính", cls: "bg-blue-50 text-blue-700" },
    maintenance: { label: "Bảo trì", cls: "bg-amber-50 text-amber-700" },
    life: { label: "Đời sống", cls: "bg-emerald-50 text-emerald-700" },
  };

  // Bây giờ TypeScript sẽ cho phép index mượt mà
  const { label, cls } = map[type] ?? map.life;

  return (
    <Badge
      variant="outline"
      className={`border-none rounded-md text-[10px] font-bold px-1.5 py-0.5 ${cls}`}
    >
      {label}
    </Badge>
  );
}

function StatusBadgeDetail({ status }: { status: Notification["status"] }) {
  switch (status) {
    case "sent":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50/50 border border-emerald-100 px-2 py-0.5 rounded-full">
          <CheckCircle className="w-3 h-3 stroke-[2.5]" /> Đã phát
        </span>
      );
    case "scheduled":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50/50 border border-blue-100 px-2 py-0.5 rounded-full">
          <Clock className="w-3 h-3 stroke-[2.5]" /> Hẹn giờ
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
          <FileText className="w-3 h-3" /> Bản nháp
        </span>
      );
  }
}

function PriorityBadge({ priority }: { priority: Notification["priority"] }) {
  if (priority !== "high") return null;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
      <AlertTriangle className="w-3 h-3 stroke-[2.5]" /> Khẩn cấp
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NotificationDetailDialog({
  notification: n,
  open,
  onOpenChange,
}: NotificationDetailDialogProps) {
  if (!n) return null;

  const readPercent =
    n.stats.sent > 0 ? Math.round((n.stats.read / n.stats.sent) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white rounded-xl p-6 border border-slate-200 shadow-2xl font-sans">
        {/* Header */}
        <div className="space-y-1 border-b border-slate-100 pb-4 select-none">
          <DialogTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 rounded-md">
              <Megaphone size={14} className="text-slate-600 stroke-2" />
            </div>
            Chi tiết bản tin thông báo
          </DialogTitle>
          <DialogDescription className="text-[11px] text-slate-400 font-medium font-mono">
            {n.id} · Tạo lúc {n.createdAt}
          </DialogDescription>
        </div>

        {/* Body */}
        <div className="pt-2 space-y-0">
          <DetailRow label="Tiêu đề">
            <span className="text-slate-900 font-bold text-[13px] leading-snug">
              {n.title}
            </span>
          </DetailRow>

          <DetailRow label="Danh mục">
            <div className="flex items-center gap-2 flex-wrap">
              <TypeBadgeDetail type={n.type} />
              <PriorityBadge priority={n.priority} />
            </div>
          </DetailRow>

          <DetailRow label="Phạm vi nhận">
            <div className="flex items-center gap-1.5">
              {n.target.includes("Toàn bộ") ? (
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              )}
              <span>{n.target}</span>
            </div>
          </DetailRow>

          <DetailRow label="Trạng thái">
            <StatusBadgeDetail status={n.status} />
          </DetailRow>

          <DetailRow label="Nội dung">
            <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
              {n.content}
            </p>
          </DetailRow>

          <DetailRow label="Tỷ lệ xem">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 font-mono">
                <span>
                  {n.stats.read} / {n.stats.sent} người đã xem
                </span>
                <span className="text-slate-700">{readPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-700"
                  style={{ width: `${readPercent}%` }}
                />
              </div>
            </div>
          </DetailRow>
        </div>
      </DialogContent>
    </Dialog>
  );
}
