export function ContractTableSkeleton() {
  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs animate-pulse">
      {/* Table Header Skeleton */}
      <div className="bg-slate-50 border-b border-slate-100 p-4 grid grid-cols-5 gap-4">
        <div className="h-4 bg-slate-200 rounded-sm w-2/3"></div>
        <div className="h-4 bg-slate-200 rounded-sm w-1/2"></div>
        <div className="h-4 bg-slate-200 rounded-sm w-1/3"></div>
        <div className="h-4 bg-slate-200 rounded-sm w-1/2"></div>
        <div className="h-4 bg-slate-200 rounded-sm w-1/4 justify-self-end"></div>
      </div>

      {/* Table Rows Skeleton */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="p-4 grid grid-cols-5 gap-4 items-center">
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded-sm w-3/4"></div>
              <div className="h-3 bg-slate-100 rounded-sm w-1/2"></div>
            </div>
            <div className="h-4 bg-slate-200 rounded-sm w-2/3"></div>
            <div className="h-5 bg-slate-200 rounded-full w-24"></div>
            <div className="h-4 bg-slate-200 rounded-sm w-1/2"></div>
            <div className="h-8 bg-slate-200 rounded-lg w-8 justify-self-end"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
