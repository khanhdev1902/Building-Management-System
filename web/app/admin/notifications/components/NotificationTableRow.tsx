import React from "react";
import {
  Building,
  Users,
  Eye,
  MoreVertical,
  Trash2,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: "FINANCE" | "maintenance" | "life" | string;
  priority: "low" | "high" | string;
  status: "sent" | "scheduled" | "draft" | string;
  target: string;
  createdAt: string;
  stats: {
    read: number;
    sent: number;
  };
}

interface NotificationTableRowProps {
  notification: Notification;
  onDelete: (id: string) => void;
  onView?: (id: string) => void;
}

// ─── Badge helpers ────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: Notification["type"] }) {
  switch (type) {
    case "finance":
      return (
        <Badge
          variant="outline"
          className="border-none bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold px-1.5 py-0.5"
        >
          Tài chính
        </Badge>
      );
    case "maintenance":
      return (
        <Badge
          variant="outline"
          className="border-none bg-amber-50 text-amber-700 rounded-md text-[10px] font-bold px-1.5 py-0.5"
        >
          Bảo trì
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="border-none bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold px-1.5 py-0.5"
        >
          Đời sống
        </Badge>
      );
  }
}

function StatusBadge({ status }: { status: Notification["status"] }) {
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

// ─── Component ────────────────────────────────────────────────────────────────

export function NotificationTableRow({
  notification: n,
  onDelete,
  onView,
}: NotificationTableRowProps) {
  const readPercent =
    n.stats.sent > 0 ? Math.round((n.stats.read / n.stats.sent) * 100) : 0;

  return (
    <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50/50 transition-colors">
      {/* Tiêu đề & nội dung rút gọn */}
      <div className="col-span-5 space-y-1 pr-4">
        <div className="flex items-center gap-2">
          <TypeBadge type={n.type} />
          {n.priority === "high" && (
            <Badge className="bg-red-50 text-red-600 border border-red-100 rounded text-[9px] px-1 font-bold">
              Khẩn cấp
            </Badge>
          )}
          <span className="text-[10px] font-mono font-bold text-slate-400">
            {n.id}
          </span>
        </div>
        <h3 className="font-bold text-slate-800 line-clamp-1 text-[13px] tracking-tight">
          {n.title}
        </h3>
        <p className="text-[11px] text-slate-400 font-medium line-clamp-1">
          {n.content}
        </p>
      </div>

      {/* Phạm vi nhận */}
      <div className="col-span-2 flex items-center gap-1.5 font-semibold text-slate-600">
        {n.target.includes("Toàn bộ") ? (
          <Building className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <Users className="w-3.5 h-3.5 text-blue-500" />
        )}
        <span>{n.target}</span>
      </div>

      {/* Trạng thái phát */}
      <div className="col-span-2 select-none">
        <StatusBadge status={n.status} />
        <span className="block text-[10px] text-slate-400 font-medium mt-1 font-mono">
          {n.createdAt}
        </span>
      </div>

      {/* Tỷ lệ xem */}
      <div className="col-span-2 space-y-1 pr-6">
        <div className="flex justify-between text-[10px] font-bold text-slate-500 font-mono">
          <span>
            Đã xem: {n.stats.read}/{n.stats.sent}
          </span>
          <span>{readPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${readPercent}%` }}
          />
        </div>
      </div>

      {/* Menu tác vụ */}
      <div className="col-span-1 text-center select-none">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 rounded-xl border-slate-200"
          >
            <DropdownMenuItem
              className="text-xs py-2 cursor-pointer gap-2 font-medium"
              onClick={() => onView?.(n.id)}
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" /> Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs py-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 gap-2 font-semibold"
              onClick={() => onDelete(n.id)}
            >
              <Trash2 className="w-3.5 h-3.5" /> Gỡ bản tin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
