/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Save, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any; // Data khi sửa
  onSave: (data: any) => void;
}

export const ServiceFormModal = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}: ServiceFormProps) => {
  const { register, handleSubmit, reset } = useForm();

  // Reset form mỗi khi mở/đóng hoặc đổi data (Sửa/Thêm)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ name: "", price: "", unit: "", description: "" });
    }
  }, [initialData, reset, isOpen]);

  const onSubmit = (data: any) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125 rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
        <DialogHeader className="p-8 pb-0">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black text-slate-900">
                {initialData ? "Cập nhật dịch vụ" : "Thêm dịch vụ mới"}
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-medium">
                Điền thông tin để vận hành tiện ích tòa nhà.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-6 space-y-6">
          <div className="space-y-4">
            {/* Tên dịch vụ */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Tên dịch vụ
              </Label>
              <Input
                id="name"
                className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-indigo-500 transition-all"
                placeholder="Ví dụ: Internet Tốc độ cao"
                {...register("name", { required: true })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Giá tiền */}
              <div className="space-y-2">
                <Label
                  htmlFor="price"
                  className="text-xs font-bold uppercase tracking-widest text-slate-400"
                >
                  Đơn giá (VNĐ)
                </Label>
                <Input
                  id="price"
                  type="number"
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all"
                  placeholder="200.000"
                  {...register("price", { required: true })}
                />
              </div>
              {/* Đơn vị */}
              <div className="space-y-2">
                <Label
                  htmlFor="unit"
                  className="text-xs font-bold uppercase tracking-widest text-slate-400"
                >
                  Đơn vị tính
                </Label>
                <Input
                  id="unit"
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all"
                  placeholder="Tháng/Phòng"
                  {...register("unit", { required: true })}
                />
              </div>
            </div>

            {/* Mô tả */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Mô tả chi tiết
              </Label>
              <Textarea
                id="description"
                className="min-h-25 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all resize-none"
                placeholder="Mô tả quyền lợi hoặc ghi chú dịch vụ..."
                {...register("description")}
              />
            </div>
          </div>

          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex gap-3 items-start">
            <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
            <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
              Thông tin này sẽ được hiển thị trực tiếp trên hóa đơn hàng tháng
              của cư dân. Hãy kiểm tra kỹ đơn giá trước khi lưu.
            </p>
          </div>

          <DialogFooter className="pt-2 gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 rounded-2xl h-12 font-bold text-slate-500 hover:bg-slate-100"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-2xl h-12 bg-slate-900 hover:bg-indigo-600 font-bold shadow-xl shadow-slate-200 transition-all"
            >
              <Save className="w-4 h-4 mr-2" />
              {initialData ? "Lưu thay đổi" : "Tạo dịch vụ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
