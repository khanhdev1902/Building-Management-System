"use client";

import React, { useEffect, useState } from "react";
import { X, Check, Package, Save } from "lucide-react";

interface AssetImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, quantity: number) => void;
  initialData?: { name: string; quantity: number } | null;
}

export const AssetImportModal = ({
  isOpen,
  onClose,
  onConfirm,
  initialData,
}: AssetImportModalProps) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setName(initialData.name);
        setQuantity(initialData.quantity);
      } else {
        setName("");
        setQuantity(1);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const isEdit = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Lớp nền mờ Glassmorphism cao cấp hơn */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Khung nội dung chính bo góc mềm mại đồng bộ hệ thống */}
      <div className="relative w-full max-w-sm bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] border border-slate-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ease-out">
        {/* 1. Header Modal tinh tế */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/40">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg text-white shadow-2xs ${
                isEdit ? "bg-amber-500" : "bg-slate-900"
              }`}
            >
              <Package size={14} className="stroke-[1.8]" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              {isEdit ? "Cập nhật danh mục" : "Nhập lô thiết bị mới"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* 2. Form điền thông tin dẹt, lì */}
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">
              Tên loại tài sản / Thiết bị
            </label>
            <input
              autoFocus
              type="text"
              placeholder="Ví dụ: Điều hòa Daikin 12000BTU..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50/50 border border-slate-200 focus:bg-white text-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:border-slate-400 focus:ring-0 transition-all placeholder:text-slate-400 placeholder:font-normal"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">
              Số lượng nhập kho
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full h-9 px-3 bg-slate-50/50 border border-slate-200 focus:bg-white text-slate-800 rounded-lg text-xs font-semibold font-mono focus:outline-none focus:border-slate-400 focus:ring-0 transition-all"
            />
          </div>
        </div>

        {/* 3. Khối điều khiển hành động dẹt phẳng */}
        <div className="px-5 py-3.5 bg-slate-50/60 border-t border-slate-100 flex justify-end items-center gap-2">
          <button
            onClick={onClose}
            className="h-8 px-3.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Hủy bỏ
          </button>

          <button
            disabled={!name.trim() || quantity < 1}
            onClick={() => {
              onConfirm(name, quantity);
              onClose();
            }}
            className={`h-8 px-4 text-xs font-medium text-white rounded-lg transition-all shadow-2xs flex items-center gap-1.5 active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none ${
              isEdit
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            {isEdit ? (
              <Save size={13} />
            ) : (
              <Check size={13} className="stroke-[2.5]" />
            )}
            <span>{isEdit ? "Lưu thay đổi" : "Hoàn tất"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
