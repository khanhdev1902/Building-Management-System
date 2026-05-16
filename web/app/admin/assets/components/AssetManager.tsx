/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Box, MoreVertical, Plus } from "lucide-react";
import { AssetImportModal } from "./AssetImportModal";

export function AssetManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingData, setEditingData] = useState<{
    name: string;
    quantity: number;
    id: string;
  } | null>(null);
  const [categories, setCategories] = useState([
    {
      id: "CAT-001",
      name: "Điều hòa Daikin Inverter",
      total: 12,
      active: 10,
      available: 2,
    },
  ]);

  const handleOpenEdit = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingData({ name: item.name, quantity: item.total, id: item.id });
    setIsOpen(true);
  };

  const handleConfirm = (name: string, quantity: number) => {
    if (editingData) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingData.id
            ? { ...c, name, total: quantity, available: quantity - c.active }
            : c,
        ),
      );
    } else {
      // Logic thêm mới
      const newId = `CAT-00${categories.length + 1}`;
      setCategories([
        ...categories,
        { id: newId, name, total: quantity, active: 0, available: quantity },
      ]);
    }
    setEditingData(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {categories.map((item) => (
        <div
          key={item.id}
          onClick={(e) => handleOpenEdit(item, e)}
          className="group relative bg-white rounded-lg border border-slate-200 
                     /* Hiệu ứng chéo chéo sang trái & nhấc lên */
                     hover:-translate-y-2 hover:-translate-x-1 hover:rotate-1
                     /* Shadow lệch để tạo chiều sâu thực tế */
                     hover:shadow-[15px_25px_50px_-12px_rgba(0,0,0,0.12)] 
                     transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                     cursor-pointer overflow-hidden flex flex-col justify-between h-[140px]"
        >
          {/* Một lớp phủ sáng mờ khi hover để tăng cảm giác 3D */}
          <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="p-4 relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex gap-3 items-center min-w-0">
                <div className="p-2.5 bg-slate-50 text-slate-700 rounded-sm group-hover:bg-slate-900 group-hover:text-white group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 shadow-sm border border-slate-100 group-hover:border-slate-800">
                  <Box size={16} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-black text-slate-900 truncate uppercase tracking-tight mb-1">
                    {item.name}
                  </h3>
                  <p className="text-[9px] text-slate-400 font-bold tracking-[0.2em] leading-none">
                    {item.id}
                  </p>
                </div>
              </div>
              <button className="text-slate-300 hover:text-slate-900 transition-colors p-1">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          <div className="px-4 pb-4 mt-auto relative z-10">
            <div className="flex justify-between items-end mb-3">
              <div className="flex gap-5">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Total
                  </span>
                  <span className="text-[16px] font-black text-slate-900 leading-none tabular-nums">
                    {item.total}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">
                    Live
                  </span>
                  <span className="text-[16px] font-black text-emerald-600 leading-none tabular-nums">
                    {item.active}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest mb-1">
                    Stock
                  </span>
                  <span className="text-[16px] font-black text-amber-600 leading-none tabular-nums">
                    {item.available}
                  </span>
                </div>
              </div>

              <div className="text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {Math.round((item.active / item.total) * 100)}%
              </div>
            </div>

            <div className="h-[3px] w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                style={{ width: `${(item.active / item.total) * 100}%` }}
              />
            </div>
          </div>

          {/* Đường line mỏng ở cạnh trái để tạo điểm nhấn khi nghiêng */}
          <div className="absolute left-0 top-0 w-0.5 h-full bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}

      {/* Nút Thêm Mới - Cũng phải có Perspective tương tự */}
      <div
        onClick={() => {
          setEditingData(null);
          setIsOpen(true);
        }}
        className="h-[140px] border-2 border-dashed border-slate-200 rounded-lg 
                   flex flex-col items-center justify-center text-slate-400 
                   hover:border-slate-900 hover:bg-slate-50 hover:text-slate-900 
                   hover:-translate-y-2 hover:-translate-x-1 hover:rotate-1
                   transition-all duration-500 cursor-pointer group"
      >
        <div className="p-3 rounded bg-slate-50 group-hover:bg-white shadow-sm mb-2">
          <Plus
            size={20}
            className="group-hover:rotate-90 transition-transform duration-500"
          />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
          Nhập lô hàng
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
