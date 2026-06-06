"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  MoreVertical,
  Plus,
  Package,
  Activity,
  Archive,
} from "lucide-react";
import { AssetImportModal } from "./AssetImportModal";
import { AssetCategory } from "../types/asset.type";
import { assetApi } from "../apis/asset.api";

export function AssetManager({ assets = [] }: { assets: AssetCategory[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingData, setEditingData] = useState<{
    name: string;
    quantity: number;
    id: string;
  } | null>(null);

  // Đồng bộ state khi props từ component cha thay đổi
  const [categories, setCategories] = useState<AssetCategory[]>(assets);
  useEffect(() => {
    setCategories(assets);
  }, [assets]);

  const handleOpenEdit = (item: AssetCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingData({ name: item.name, quantity: item.total, id: item.id });
    setIsOpen(true);
  };

  const handleConfirm = async (name: string, quantity: number) => {
    try {
      if (editingData) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingData.id
              ? {
                  ...c,
                  name,
                  total: quantity,
                  available: Math.max(0, quantity - c.active),
                }
              : c,
          ),
        );
        await assetApi.updateAsset(editingData.id, {
          name: name,
          total: quantity,
        });
      } else {
        const newAsset = await assetApi.createAsset({
          name: name,
          total: quantity,
        });
        if (newAsset?.data) {
          setCategories((prev) => [...prev, newAsset.data]);
        }
      }
    } catch (error) {
      console.error("Lỗi cập nhật tài sản:", error);
    } finally {
      setEditingData(null);
      setIsOpen(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-1 w-full max-w-7xl mx-auto">
      {categories.map((item) => {
        // Tránh lỗi chia cho 0 khiến UI hiện NaN%
        const usageRate =
          item.total > 0 ? Math.round((item.active / item.total) * 100) : 0;

        // UX Cải tiến: Đổi màu linh hoạt theo công suất sử dụng
        const getProgressColor = (rate: number) => {
          if (rate >= 90) return "bg-rose-500"; // Sắp hết kho bãi
          if (rate >= 70) return "bg-amber-500"; // Cần chú ý nhập thêm
          return "bg-indigo-600"; // Trạng thái an toàn, mượt mà
        };

        return (
          <div
            key={item.id}
            onClick={(e) => handleOpenEdit(item, e)}
            className="group relative bg-white rounded-2xl border border-slate-200/90 p-5 transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between h-36 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_14px_30px_-4px_rgba(99,102,241,0.08),0_4px_12px_-2px_rgba(99,102,241,0.02)]"
          >
            {/* Top Line Info: Icon và Tên thiết bị */}
            <div className="flex items-start justify-between w-full gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors duration-300 shrink-0">
                  <Box size={16} className="stroke-[1.75]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-950 transition-colors truncate tracking-tight mb-0.5">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Mã thiết bị: #{item.id.slice(0, 5)}
                  </p>
                </div>
              </div>

              {/* Nút ba chấm: Chặn stopPropagation để không bị kích hoạt đè sự kiện của Card */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Xử lý mở dropdown menu riêng ở đây nếu có
                }}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-50 shrink-0 -mt-1 -mr-1"
              >
                <MoreVertical size={14} className="stroke-[1.75]" />
              </button>
            </div>

            {/* Bottom Line Info: Tối giản hóa dữ liệu số */}
            <div className="space-y-3 w-full">
              <div className="flex items-center justify-between w-full">
                {/* Thiết kế các chỉ số phân rõ Icon nhỏ trực quan */}
                <div className="flex items-center gap-4 text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Package size={12} className="text-slate-400 shrink-0" />
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-bold text-slate-800 font-mono text-sm">
                        {item.total}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        tổng
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Activity size={12} className="text-emerald-500 shrink-0" />
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-bold text-emerald-600 font-mono text-sm">
                        {item.active}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        dùng
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Archive size={12} className="text-blue-500 shrink-0" />
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-bold text-slate-700 font-mono text-sm">
                        {item.available}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        kho
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tỉ lệ phần trăm tinh xảo */}
                <span
                  className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border ${
                    usageRate >= 95
                      ? "bg-rose-50 text-rose-600 border-rose-100"
                      : "bg-slate-50 text-slate-500 border-slate-100"
                  }`}
                >
                  {usageRate}%
                </span>
              </div>

              {/* Thanh tiến độ siêu phẳng thông minh */}
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressColor(usageRate)}`}
                  style={{ width: `${Math.min(100, usageRate)}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* Nút Thêm Mới: Chiều cao h-36 đồng bộ hoàn hảo */}
      <div
        onClick={() => {
          setEditingData(null);
          setIsOpen(true);
        }}
        className="h-36 border border-dashed border-slate-200/80 bg-white rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/10 hover:text-indigo-600 transition-all duration-300 cursor-pointer group shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:-translate-y-1"
      >
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:text-indigo-600 group-hover:border-indigo-100 shadow-2xs mb-2 transition-all duration-300">
          <Plus
            size={16}
            className="group-hover:rotate-90 transition-transform duration-300 stroke-[2.5]"
          />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-indigo-600 transition-colors">
          Nhập lô hàng mới
        </span>
      </div>

      <AssetImportModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingData(null);
        }}
        onConfirm={handleConfirm}
        initialData={editingData}
      />
    </div>
  );
}
