import { Plus, LayoutGrid, Activity, TrendingUp } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface ServiceHeaderProps {
  onAdd: () => void;
}

const STATS = [
  {
    label: "Tổng dịch vụ",
    value: "12",
    sub: "+2 mới",
    icon: LayoutGrid,
    statusType: "primary",
    hoverStyle:
      "group-hover:text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-100",
    badgeStyle: "text-indigo-700 bg-indigo-50/60 border-indigo-100/50",
  },
  {
    label: "Tỷ lệ vận hành",
    value: "98.5%",
    sub: "Ổn định",
    icon: Activity,
    statusType: "success",
    hoverStyle:
      "group-hover:text-emerald-600 group-hover:bg-emerald-50 group-hover:border-emerald-100",
    badgeStyle: "text-emerald-700 bg-emerald-50/60 border-emerald-100/50",
  },
  {
    label: "Doanh thu tháng",
    value: "24.5M",
    sub: "Dự kiến",
    icon: TrendingUp,
    statusType: "info",
    hoverStyle:
      "group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-100",
    badgeStyle: "text-blue-700 bg-blue-50/60 border-blue-100/50",
  },
];

export const ServiceHeader = ({ onAdd }: ServiceHeaderProps) => (
  <div className="space-y-5 mb-2">
    {/* 1. Header Top: Thiết kế thanh lịch, tinh giản tiêu đề */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-0.5">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Danh mục Dịch vụ & Tiện ích
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Cấu hình và thiết lập các gói chi phí vận hành, tiện ích nội khu tòa
          nhà.
        </p>
      </div>

      <Button
        onClick={onAdd}
        className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-9 px-3.5 shadow-2xs transition-all font-medium text-xs flex items-center gap-1.5 self-start sm:self-center"
      >
        <Plus className="h-4 w-4 stroke-2" />
        Tạo dịch vụ mới
      </Button>
    </div>

    {/* 2. Stats Row: Phẳng hoàn toàn, nén chặt thông tin kiểu Enterprise */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      {STATS.map((stat, i) => (
        <div
          key={i}
          className="group relative flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:border-slate-300 transition-all duration-300 select-none overflow-hidden"
        >
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-medium text-slate-400">{stat.label}</p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900 tracking-tight font-sans">
                {stat.value}
              </span>

              {/* Badge xu hướng tinh gọn thay thế cho text thô */}
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${stat.badgeStyle}`}
              >
                {stat.sub}
              </span>
            </div>
          </div>

          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-400 transition-all duration-300 ${stat.hoverStyle}`}
          >
            <stat.icon className="h-4 w-4 stroke-[1.5]" />
          </div>
          <div className="absolute bottom-0 left-3 right-3 h-px bg-slate-100 group-hover:bg-slate-200 transition-colors" />
        </div>
      ))}
    </div>
  </div>
);
