import React from "react";;
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Notification, NotificationTableRow } from "./NotificationTableRow";
import { NotificationEmptyState } from "./NotificationEmptyState";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NotificationTableProps {
  notifications: Notification[];
  onDelete: (id: string) => void;
  onView?: (id: string) => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TableHeader() {
  return (
    <div className="grid grid-cols-12 gap-4 bg-slate-50/70 p-4 border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider select-none text-xs">
      <div className="col-span-5">Nội dung thông báo</div>
      <div className="col-span-2">Phạm vi nhận</div>
      <div className="col-span-2">Trạng thái phát</div>
      <div className="col-span-2">Tỷ lệ xem app</div>
      <div className="col-span-1 text-center">Tác vụ</div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NotificationTable({
  notifications,
  onDelete,
  onView,
}: NotificationTableProps) {
  return (
    <ScrollArea className="flex-1 bg-white rounded-xl border border-slate-200/80 shadow-xs">
      <div className="w-full min-w-200 text-xs">
        <TableHeader />

        {notifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <NotificationTableRow
                key={n.id}
                notification={n}
                onDelete={onDelete}
                onView={onView}
              />
            ))}
          </div>
        ) : (
          <NotificationEmptyState />
        )}
      </div>
    </ScrollArea>
  );
}
