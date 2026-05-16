"use client";

import React, { useEffect, useState } from "react";
import { X, Check, Package, Hash, Type, Save } from "lucide-react";

interface AssetImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, quantity: number) => void;
  initialData?: { name: string; quantity: number } | null; // Thêm prop này
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
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-1.5 rounded transition-colors ${isEdit ? "bg-amber-500" : "bg-slate-900"} text-white`}
            >
              <Package size={16} />
            </div>
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
              {isEdit ? "Cập nhật thông tin lô" : "Nhập lô thiết bị mới"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-900"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <Type size={12} /> Tên loại tài sản
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <Hash size={12} /> Số lượng
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-black text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[11px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onConfirm(name, quantity);
              onClose();
            }}
            className={`px-5 py-2 ${isEdit ? "bg-amber-600 hover:bg-amber-700" : "bg-slate-900 hover:bg-slate-800"} text-white rounded font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2`}
          >
            {isEdit ? <Save size={14} /> : <Check size={14} />}
            {isEdit ? "Lưu thay đổi" : "Hoàn tất nhập kho"}
          </button>
        </div>
      </div>
    </div>
  );
};
