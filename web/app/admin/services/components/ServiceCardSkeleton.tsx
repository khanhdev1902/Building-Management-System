import React from "react";

export function ServiceCardSkeleton() {
  return (
    <div className="p-5 border border-slate-100 bg-white rounded-2xl space-y-4 animate-pulse shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 bg-slate-200/80 rounded-xl" />
        <div className="w-16 h-5 bg-slate-200/80 rounded-full" />
      </div>

      <div className="space-y-2 pt-1">
        <div className="h-4 bg-slate-200/80 rounded-md w-1/3" />
        <div className="h-3 bg-slate-200/60 rounded-md w-3/4" />
      </div>

      <div className="border-t border-dashed border-slate-100 pt-4 flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-2 bg-slate-200/50 rounded-md w-12" />
          <div className="h-4 bg-slate-200/80 rounded-md w-20" />
        </div>

        <div className="w-20 h-8 bg-slate-200/80 rounded-xl" />
      </div>
    </div>
  );
}
