/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/shared/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    AVAILABLE: "bg-emerald-50 text-emerald-700 border-emerald-100",
    OCCUPIED: "bg-blue-50 text-blue-700 border-blue-100",
    MAINTENANCE: "bg-amber-50 text-amber-700 border-amber-100",
  };
  const labels: any = {
    AVAILABLE: "Trống",
    OCCUPIED: "Đã thuê",
    MAINTENANCE: "Bảo trì",
  };

  return (
    <Badge
      className={`${styles[status]} border shadow-none px-2 py-0 rounded-lg text-[10px] font-bold uppercase`}
    >
      {labels[status]}
    </Badge>
  );
}
