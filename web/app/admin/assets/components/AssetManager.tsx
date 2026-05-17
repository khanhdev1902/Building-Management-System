"use client";

import React, { useState } from "react";
import { Box, MoreVertical, Plus } from "lucide-react";
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
  const [categories, setCategories] = useState<AssetCategory[]>(assets);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOpenEdit = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingData({ name: item.name, quantity: item.total, id: item.id });
    setIsOpen(true);
  };

  const handleConfirm = async (name: string, quantity: number) => {
    if (editingData) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingData.id
            ? { ...c, name, total: quantity, available: quantity - c.active }
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
      setCategories([...categories, newAsset.data ?? {}]);
    }
    setEditingData(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1 w-full max-w-7xl mx-auto">
      {categories.map((item) => (
        <div
          key={item.id}
          onClick={(e) => handleOpenEdit(item, e)}
          className="group relative bg-white rounded-xl border border-slate-200/80 p-4.5 transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between h-30 shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_24px_-6px_rgba(15,23,42,0.04),0_4px_12px_-2px_rgba(15,23,42,0.01)]"
        >
          {/* Top Line Info: Icon và Tên thiết bị */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 bg-slate-50 border border-slate-100 text-slate-500 rounded-lg group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-300 shadow-2xs">
                <Box size={14} className="stroke-[1.75]" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 truncate tracking-tight">
                {item.name}
              </h3>
            </div>

            <button className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md hover:bg-slate-50 shrink-0">
              <MoreVertical size={14} className="stroke-[1.75]" />
            </button>
          </div>

          {/* Bottom Line Info: Tối giản hóa dữ liệu số */}
          <div className="space-y-2 w-full">
            <div className="flex items-end justify-between text-xs w-full">
              {/* Gom cụm số liệu bằng ký tự phân cách thanh mảnh chuẩn SaaS */}
              <div className="flex items-center gap-3 text-slate-500 font-medium">
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-slate-800 font-mono text-sm">
                    {item.total}
                  </span>
                  <span className="text-[10px] text-slate-400">tổng</span>
                </div>
                <span className="text-slate-200">|</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-emerald-600 font-mono text-sm">
                    {item.active}
                  </span>
                  <span className="text-[10px] text-slate-400">dùng</span>
                </div>
                <span className="text-slate-200">|</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-slate-700 font-mono text-sm">
                    {item.available}
                  </span>
                  <span className="text-[10px] text-slate-400">kho</span>
                </div>
              </div>

              {/* Tỉ lệ phần trăm tinh xảo */}
              <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-50 border border-slate-150 px-1.5 py-0.2 rounded">
                {Math.round((item.active / item.total) * 100)}%
              </span>
            </div>

            {/* Thanh tiến độ siêu phẳng */}
            <div className="h-0.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-900 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(item.active / item.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Nút Thêm Mới: Chiều cao h-[120px] đồng bộ hoàn hảo */}
      <div
        onClick={() => {
          setEditingData(null);
          setIsOpen(true);
        }}
        className="h-30 border border-dashed border-slate-200 bg-white rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-slate-300 hover:bg-slate-50/50 hover:text-slate-800 transition-all duration-300 cursor-pointer group shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:-translate-y-0.5"
      >
        <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-white text-slate-400 group-hover:text-slate-800 shadow-2xs mb-1.5 transition-colors">
          <Plus
            size={15}
            className="group-hover:rotate-90 transition-transform duration-300 stroke-2"
          />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider">
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
