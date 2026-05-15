import {
  AlertCircle,
  DollarSign,
  ShieldCheck,
  Wrench,
  ArrowUpRight,
} from "lucide-react";

export function AssetStats() {
  return (
    <div className="grid grid-cols-4 gap-0 bg-white border-y border-zinc-100 py-10">
      {/* Metric 1: Tài chính - Thay đổi hoàn toàn style để không còn "toy-like" */}
      <div className="px-10 border-r border-zinc-100 space-y-4">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Tổng vốn đầu tư
          </span>
          <DollarSign size={14} strokeWidth={1.5} />
        </div>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-light tracking-tight text-zinc-900">
              1.420.000.000
            </p>
            <span className="text-[10px] font-medium text-emerald-600 flex items-center">
              <ArrowUpRight size={10} className="mr-0.5" /> 12%
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 font-medium italic">
            Khấu hao lũy kế: 240tr
          </p>
        </div>
      </div>

      {/* Metric 2: Trạng thái vận hành */}
      <div className="px-10 border-r border-zinc-100 space-y-4">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Hiệu suất thiết bị
          </span>
          <ShieldCheck size={14} strokeWidth={1.5} />
        </div>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-light tracking-tight text-zinc-900">
              90.3%
            </p>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold">
            112{" "}
            <span className="text-zinc-300 font-normal">
              / 124 thiết bị sẵn sàng
            </span>
          </p>
        </div>
      </div>

      {/* Metric 3: Bảo trì định kỳ */}
      <div className="px-10 border-r border-zinc-100 space-y-4">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Lịch bảo trì
          </span>
          <Wrench size={14} strokeWidth={1.5} />
        </div>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-light tracking-tight text-zinc-900 text-amber-600">
              08
            </p>
          </div>
          <p className="text-[10px] text-zinc-500 font-medium">
            Yêu cầu chờ xử lý trong tuần
          </p>
        </div>
      </div>

      {/* Metric 4: Rủi ro hệ thống */}
      <div className="px-10 space-y-4">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Cảnh báo hệ thống
          </span>
          <AlertCircle size={14} strokeWidth={1.5} />
        </div>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-light tracking-tight text-red-600">
              02
            </p>
          </div>
          <p className="text-[10px] text-zinc-500 font-medium">
            <span className="font-bold underline decoration-red-200">
              Kỹ thuật:
            </span>{" "}
            Thang máy, PCCC
          </p>
        </div>
      </div>
    </div>
  );
}
