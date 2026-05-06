import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface ServiceHeaderProps {
  onAdd: () => void; // Thêm khai báo prop
}

export const ServiceHeader = ({ onAdd }: ServiceHeaderProps) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-2">
    <div className="space-y-1">
      <h1 className="text-4xl font-black tracking-tight text-slate-900">
        Dịch vụ <span className="text-indigo-600">&</span> Tiện ích
      </h1>
      <p className="text-slate-500 font-medium italic">
        Thiết lập và vận hành hệ thống phí tòa nhà Danjin.
      </p>
    </div>
    <Button
      onClick={onAdd} // Gán sự kiện vào đây
      className="bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl h-12 px-6 shadow-xl shadow-indigo-100 transition-all duration-300 transform hover:scale-105 active:scale-95"
    >
      <Plus className="mr-2 h-5 w-5" /> Thêm dịch vụ mới
    </Button>
  </div>
);
