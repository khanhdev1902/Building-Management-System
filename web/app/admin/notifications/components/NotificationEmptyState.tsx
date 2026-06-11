import React from "react";
import { FileText } from "lucide-react";

export function NotificationEmptyState() {
  return (
    <div className="py-16 text-center select-none">
      <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
      <p className="text-sm font-bold text-slate-400">
        Không tìm thấy thông báo phù hợp
      </p>
      <p className="text-xs text-slate-300 mt-1">
        Vui lòng thay đổi cấu hình bộ lọc hoặc từ khóa tìm kiếm
      </p>
    </div>
  );
}
