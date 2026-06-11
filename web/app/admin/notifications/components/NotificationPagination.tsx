import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NotificationPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NotificationPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: NotificationPaginationProps) {
  const rangeStart =
    totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const rangeEnd = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <footer className="flex items-center justify-between pt-4 select-none">
      {/* Summary */}
      <p className="text-xs text-slate-400 font-semibold">
        Hiển thị <span className="text-slate-700 font-mono">{rangeStart}</span>
        {" – "}
        <span className="text-slate-700 font-mono">{rangeEnd}</span> trên tổng
        số <span className="text-slate-700 font-mono">{totalItems}</span> bản
        ghi
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8.5 w-8.5 rounded-xl border-slate-200 text-slate-500 shadow-3xs hover:bg-white cursor-pointer disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            size="sm"
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(page)}
            className={`h-8.5 w-8.5 rounded-xl text-xs font-bold font-mono transition-all ${
              currentPage === page
                ? "bg-slate-900 text-white shadow-sm border-none"
                : "border-slate-200 text-slate-600 hover:bg-white"
            }`}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8.5 w-8.5 rounded-xl border-slate-200 text-slate-500 shadow-3xs hover:bg-white cursor-pointer disabled:opacity-40"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </footer>
  );
}
