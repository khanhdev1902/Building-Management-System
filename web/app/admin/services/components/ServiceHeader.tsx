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
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    label: "Vận hành",
    value: "98.5%",
    sub: "Ổn định",
    icon: Activity,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Doanh thu",
    value: "24.5M",
    sub: "Dự kiến",
    icon: TrendingUp,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
];

export const ServiceHeader = ({ onAdd }: ServiceHeaderProps) => (
  <div className="space-y-6 mb-6">
    {/* Header Top: Title & Action gộp làm một để giảm padding */}
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Dịch vụ <span className="text-slate-300 font-normal">/</span> Tiện ích
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Thiết lập danh mục chi phí vận hành tòa nhà.
        </p>
      </div>

      <Button
        onClick={onAdd}
        className="bg-slate-900 hover:bg-indigo-600 text-white rounded-lg h-9 px-4 shadow-sm transition-all font-semibold text-xs flex items-center gap-2"
      >
        <Plus className="h-4 w-4 stroke-[3px]" />
        Tạo mới
      </Button>
    </div>

    {/* Stats Row: Nhỏ gọn hơn, không chiếm diện tích */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {STATS.map((stat, i) => (
        <div
          key={i}
          className="group flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/60 shadow-sm transition-all hover:border-indigo-100"
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}
          >
            <stat.icon className="h-5 w-5 stroke-[2px]" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-1">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-slate-900 leading-none">
                {stat.value}
              </span>
              <span
                className={`text-[9px] font-bold ${stat.color} leading-none`}
              >
                {stat.sub}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
