/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Save,
  Home,
  Car,
  Wifi,
  ShieldCheck,
  Zap,
  Droplets,
  Trash2,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
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
import { cn } from "@/shared/utils/cn";

// 1. Schema Validation - Bổ sung status
const serviceSchema = z.object({
  name: z.string().min(2, "Tên dịch vụ phải có ít nhất 2 ký tự"),
  price: z.number().min(0, "Giá tiền không được âm"),
  unit: z.string().min(1, "Vui lòng nhập đơn vị tính"),
  description: z
    .string()
    .max(200, "Mô tả không nên quá 200 ký tự")
    .optional()
    .or(z.literal("")),
  iconKey: z.string().min(1),
  status: z.string().min(1), // Thêm status vào đây
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSave: (data: ServiceFormValues) => void;
}

const ICON_OPTIONS = [
  { key: "home", icon: Home },
  { key: "car", icon: Car },
  { key: "wifi", icon: Wifi },
  { key: "security", icon: ShieldCheck },
  { key: "electricity", icon: Zap },
  { key: "water", icon: Droplets },
  { key: "trash", icon: Trash2 },
  { key: "repair", icon: Wrench },
];

// Định nghĩa các option cho status
const STATUS_OPTIONS = [
  {
    key: "active",
    label: "Hoạt động",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    key: "warning",
    label: "Cảnh báo",
    icon: AlertCircle,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    key: "maintenance",
    label: "Bảo trì",
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
];

export const ServiceFormModal = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}: ServiceFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      price: 0,
      unit: "",
      description: "",
      iconKey: "home",
      status: "active", // Default status
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const currentIcon = watch("iconKey");
  const currentStatus = watch("status");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name || "",
          price: Number(initialData.price) || 0,
          unit: initialData.unit || "",
          description: initialData.description || "",
          iconKey: initialData.iconKey || "home",
          status: initialData.status || "active",
        });
      } else {
        reset({
          name: "",
          price: 0,
          unit: "",
          description: "",
          iconKey: "home",
          status: "active",
        });
      }
    }
  }, [initialData, reset, isOpen]);

  const onSubmit = (data: ServiceFormValues) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125 p-0 overflow-hidden border-slate-200 shadow-2xl rounded-xl">
        <DialogHeader className="px-6 pt-6 pb-4 bg-slate-50/50 border-b">
          <div className="space-y-1 text-left">
            <DialogTitle className="text-xl font-semibold text-slate-900">
              {initialData ? "Chỉnh sửa dịch vụ" : "Thiết lập dịch vụ mới"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              Cấu hình các thông số vận hành và phí dịch vụ tòa nhà.
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-6">
          {/* Hàng 1: Icon và Status */}
          <div className="grid grid-cols-2 gap-6">
            {/* Chọn biểu tượng */}
            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Biểu tượng
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {ICON_OPTIONS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setValue("iconKey", item.key)}
                    className={cn(
                      "flex items-center justify-center h-10 w-10 rounded-lg border transition-all",
                      currentIcon === item.key
                        ? "bg-indigo-50 border-indigo-500 text-indigo-600 shadow-sm"
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-300",
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Chọn Trạng thái */}
            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Trạng thái vận hành
              </Label>
              <div className="flex flex-col gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setValue("status", opt.key)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                      currentStatus === opt.key
                        ? `${opt.bg} ${opt.border} ${opt.color} shadow-sm`
                        : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50",
                    )}
                  >
                    <opt.icon className="w-3.5 h-3.5" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {/* Tên dịch vụ */}
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-[11px] font-bold uppercase tracking-wider text-slate-500"
              >
                Tên dịch vụ
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Ví dụ: Internet (Cơ bản)"
                className={cn(
                  "h-10 border-slate-200 focus:border-indigo-500",
                  errors.name && "border-red-500 focus:border-red-500",
                )}
              />
              {errors.name && (
                <p className="text-[10px] font-medium text-red-500 italic">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Giá tiền */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="price"
                  className="text-[11px] font-bold uppercase tracking-wider text-slate-500"
                >
                  Đơn giá (VNĐ)
                </Label>
                <Input
                  id="price"
                  type="number"
                  {...register("price")}
                  className={cn(
                    "h-10 border-slate-200",
                    errors.price && "border-red-500",
                  )}
                />
              </div>

              {/* Đơn vị */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="unit"
                  className="text-[11px] font-bold uppercase tracking-wider text-slate-500"
                >
                  Đơn vị tính
                </Label>
                <Input
                  id="unit"
                  {...register("unit")}
                  placeholder="Tháng/Phòng"
                  className={cn(
                    "h-10 border-slate-200",
                    errors.unit && "border-red-500",
                  )}
                />
              </div>
            </div>

            {/* Mô tả */}
            <div className="space-y-1.5">
              <Label
                htmlFor="description"
                className="text-[11px] font-bold uppercase tracking-wider text-slate-500"
              >
                Mô tả
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                className="min-h-16 border-slate-200 resize-none text-sm"
                placeholder="Thông tin thêm về cách tính phí..."
              />
            </div>
          </div>

          {/* Footer actions */}
          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-10 border-slate-200 text-slate-600 font-semibold"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-10 bg-slate-900 hover:bg-indigo-600 font-semibold text-white transition-all shadow-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {initialData ? "Lưu thay đổi" : "Kích hoạt dịch vụ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
