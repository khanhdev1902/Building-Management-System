import React from "react";

export function InvoicePageSkeleton() {
  return (
    <div className="space-y-5 animate-pulse select-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white p-4 border border-slate-200/60 rounded-xl flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          >
            <div className="space-y-2 grow mr-4">
              <div className="h-2.5 bg-slate-200 rounded w-2/3" />
              <div className="h-6 bg-slate-200 rounded w-1/2" />
              <div className="h-2.5 bg-slate-100 rounded w-1/3" />
            </div>
            <div className="h-9 w-9 bg-slate-200 rounded-xl shrink-0" />
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-3 justify-between items-center pt-1">
        <div className="h-10 bg-slate-200 rounded-lg w-full lg:w-96" />
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <div className="h-9 bg-slate-200 rounded-lg w-80" />
          <div className="h-9 bg-slate-200 rounded-lg w-24" />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/60 bg-white overflow-hidden flex flex-col min-h-100">
        <div className="bg-slate-50/60 border-b border-slate-100/80 px-4 py-3 flex items-center gap-4">
          <div className="h-4 bg-slate-200 rounded w-4" />
          <div className="h-3 bg-slate-200 rounded w-16" />
          <div className="h-3 bg-slate-200 rounded w-24" />
          <div className="h-3 bg-slate-200 rounded w-48 grow" />
          <div className="h-3 bg-slate-200 rounded w-20" />
          <div className="h-3 bg-slate-200 rounded w-20" />
        </div>

        <div className="divide-y divide-slate-100/60">
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div key={rowIndex} className="px-4 py-4 flex items-center gap-4">
              <div className="h-4 bg-slate-200 rounded w-4 shrink-0" />

              <div className="h-3.5 bg-slate-200 rounded w-20 font-mono shrink-0" />

              <div className="space-y-1.5 w-28 shrink-0">
                <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                <div className="h-2.5 bg-slate-100 rounded w-1/2" />
              </div>

              <div className="space-y-2 grow">
                <div className="flex gap-4">
                  <div className="h-3 bg-slate-200 rounded w-28" />
                  <div className="h-3 bg-slate-200 rounded w-28" />
                </div>
                <div className="h-4 bg-slate-100 rounded w-64" />
              </div>

              <div className="h-4 bg-slate-200 rounded w-24 shrink-0 justify-end" />

              <div className="h-3.5 bg-slate-200 rounded w-20 shrink-0" />

              <div className="h-5 bg-slate-200 rounded-full w-24 shrink-0" />

              <div className="h-7 w-7 bg-slate-150 rounded-md shrink-0" />
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 p-4 flex justify-between items-center bg-white mt-auto">
          <div className="h-3 bg-slate-200 rounded w-48" />
          <div className="h-6 bg-slate-200 rounded w-32" />
        </div>
      </div>
    </div>
  );
}
