import { Box, Plus, MoreVertical } from "lucide-react";

export function CategoryManager() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Card Danh mục - Kiểu chuyên nghiệp */}
      <div className="p-4 bg-white rounded-md border border-zinc-200 hover:shadow-md transition-all cursor-pointer relative group">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-zinc-100 rounded text-zinc-600 group-hover:text-zinc-900">
            <Box size={18} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-zinc-900 leading-none">
              Điều hòa Daikin
            </h3>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">
              ID: CAT-001
            </span>
          </div>
          <button className="text-zinc-400 hover:text-zinc-900">
            <MoreVertical size={16} />
          </button>
        </div>

        <div className="pt-3 border-t border-zinc-50 flex justify-between items-center">
          <p className="text-xs text-zinc-500">
            Số lượng tài sản:{" "}
            <span className="font-bold text-zinc-900">12</span>
          </p>
          <div className="w-2 h-2 rounded-full bg-emerald-500" title="Active" />
        </div>
      </div>

      {/* Nút thêm mới - Dạng thanh mảnh */}
      <div className="border border-dashed border-zinc-300 rounded-md flex flex-col items-center justify-center py-6 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-colors cursor-pointer group">
        <Plus
          size={20}
          className="mb-1 group-hover:scale-110 transition-transform"
        />
        <span className="text-xs font-medium">Thêm danh mục</span>
      </div>
    </div>
  );
}
