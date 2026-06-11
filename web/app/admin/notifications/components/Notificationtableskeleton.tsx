import React from "react";

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkeletonBox({ className }: { className?: string }) {
  return (
    <div
      className={`bg-slate-100 rounded-md animate-pulse ${className ?? ""}`}
    />
  );
}

function SkeletonRow() {
  return (
    <div className="grid grid-cols-12 gap-4 p-4 items-center border-b border-slate-100 last:border-0">
      {/* Tiêu đề & nội dung */}
      <div className="col-span-5 space-y-2 pr-4">
        <div className="flex items-center gap-2">
          <SkeletonBox className="h-4 w-14" />
          <SkeletonBox className="h-3 w-10" />
        </div>
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3 w-full" />
      </div>

      {/* Phạm vi nhận */}
      <div className="col-span-2">
        <SkeletonBox className="h-4 w-24" />
      </div>

      {/* Trạng thái */}
      <div className="col-span-2 space-y-1.5">
        <SkeletonBox className="h-5 w-20 rounded-full" />
        <SkeletonBox className="h-3 w-24" />
      </div>

      {/* Tỷ lệ xem */}
      <div className="col-span-2 space-y-1.5 pr-6">
        <div className="flex justify-between">
          <SkeletonBox className="h-3 w-20" />
          <SkeletonBox className="h-3 w-6" />
        </div>
        <SkeletonBox className="h-1.5 w-full rounded-full" />
      </div>

      {/* Tác vụ */}
      <div className="col-span-1 flex justify-center">
        <SkeletonBox className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface NotificationTableSkeletonProps {
  rows?: number;
}

export function NotificationTableSkeleton({
  rows = 5,
}: NotificationTableSkeletonProps) {
  return (
    <div className="flex-1 bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="w-full min-w-200 text-xs">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 bg-slate-50/70 p-4 border-b border-slate-200/80">
          {[5, 2, 2, 2, 1].map((span, i) => (
            <div key={i} className={`col-span-${span}`}>
              <SkeletonBox className="h-3 w-16" />
            </div>
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    </div>
  );
}
