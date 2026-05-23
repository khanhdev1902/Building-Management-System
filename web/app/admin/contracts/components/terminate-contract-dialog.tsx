"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { AlertTriangle, FileWarning, Coins } from "lucide-react";
import { TerminateContractSchema } from "../schemas/TerminateContractSchema";

type TerminateFormData = z.infer<typeof TerminateContractSchema>;

interface TerminateContractDialogProps {
  contractData: {
    id: string;
    room: string;
    tenant: string;
    deposit: number;
  };
  onSubmit: (data: TerminateFormData) => Promise<void> | void;
  trigger?: React.ReactNode;
}

export function TerminateContractDialog({
  contractData,
  onSubmit,
  trigger,
}: TerminateContractDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. KHỞI TẠO REACT HOOK FORM VỚI ZOD RESOLVER
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<TerminateFormData>({
    resolver: zodResolver(TerminateContractSchema),
    defaultValues: {
      returnDate: "",
      terminationReason: "",
      depositHandling: "FORFEIT_ALL",
      refundAmount: 0,
      notes: "",
    },
  });

  // Theo dõi (watch) giá trị của phương án xử lý cọc để thay đổi UI linh hoạt
  const currentHandling = watch("depositHandling");

  // 3. LOGIC TỰ ĐỘNG CẬP NHẬT SỐ TIỀN HOÀN TRẢ THEO PHƯƠNG ÁN CỌC
  const handleHandlingChange = (
    type: "REFUND_ALL" | "FORFEIT_ALL" | "PARTIAL_REFUND",
  ) => {
    setValue("depositHandling", type);
    if (type === "REFUND_ALL") {
      setValue("refundAmount", contractData.deposit);
    } else if (type === "FORFEIT_ALL") {
      setValue("refundAmount", 0);
    } else {
      setValue("refundAmount", Math.floor(contractData.deposit / 2)); // Gợi ý phạt 50%
    }
  };

  // Reset form về trạng thái ban đầu mỗi khi đóng/mở modal
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onFormSubmit = async (data: TerminateFormData) => {
    try {
      setIsSubmitting(true);
      // Đính kèm ID hợp đồng vào payload gửi đi
      await onSubmit({
        ...data,
        // contractId: contractData.id,
      });
      setOpen(false);
    } catch (error) {
      console.error("Lỗi kết thúc hợp đồng trước hạn:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="destructive"
            className="h-9 px-3 text-xs font-semibold rounded-lg gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Thanh lý trước hạn</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-125 rounded-xl border border-slate-200 bg-white p-6 shadow-lg antialiased">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          {/* Header Tiêu đề & Cảnh báo đỏ */}
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2 text-rose-600">
              <FileWarning className="h-5 w-5 stroke-[2.25]" />
              <DialogTitle className="text-lg font-bold tracking-tight">
                Chấm dứt hợp đồng trước thời hạn
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-500 text-xs leading-relaxed">
              Bạn đang thực hiện quy trình thanh lý pháp lý cho căn hộ{" "}
              <span className="font-bold text-slate-800 font-mono">
                {contractData.room}
              </span>{" "}
              của khách hàng{" "}
              <span className="font-bold text-slate-800">
                {contractData.tenant}
              </span>
              . Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          {/* Banner Thông tin tiền cọc gốc */}
          <div className="flex items-center justify-between p-3 bg-amber-50/60 border border-amber-100 rounded-lg text-xs select-none">
            <div className="flex items-center gap-2 text-amber-800 font-medium">
              <Coins className="h-4 w-4 text-amber-600" />
              <span>Quỹ tiền đặt cọc hiện tại:</span>
            </div>
            <span className="font-mono font-black text-amber-900 text-sm">
              {Number(contractData.deposit).toLocaleString("vi-VN")}đ
            </span>
          </div>

          {/* Khối Input Fields chính */}
          <div className="space-y-4">
            {/* 1. Ngày bàn giao thực tế */}
            <div className="space-y-1.5">
              <Label
                htmlFor="returnDate"
                className="text-xs font-bold text-slate-700"
              >
                Ngày bàn giao căn hộ thực tế{" "}
                <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="returnDate"
                type="date"
                {...register("returnDate")}
                className="h-9 font-mono text-xs border-slate-200 rounded-lg focus-visible:ring-indigo-500"
              />
              {errors.returnDate && (
                <p className="text-rose-500 text-[11px] font-medium">
                  {errors.returnDate.message}
                </p>
              )}
            </div>

            {/* 2. Phương án xử lý cọc pháp lý */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">
                Phương án xử lý tiền cọc{" "}
                <span className="text-rose-500">*</span>
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleHandlingChange("FORFEIT_ALL")}
                  className={`p-2.5 text-center border rounded-lg text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    currentHandling === "FORFEIT_ALL"
                      ? "border-rose-500 bg-rose-50/40 text-rose-700 shadow-2xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>Phạt huỷ cọc</span>
                  <span className="text-[9px] font-normal opacity-75">
                    (Tịch thu 100%)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleHandlingChange("REFUND_ALL")}
                  className={`p-2.5 text-center border rounded-lg text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    currentHandling === "REFUND_ALL"
                      ? "border-emerald-500 bg-emerald-50/40 text-emerald-700 shadow-2xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>Hoàn trả hết</span>
                  <span className="text-[9px] font-normal opacity-75">
                    (Trả lại 100%)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleHandlingChange("PARTIAL_REFUND")}
                  className={`p-2.5 text-center border rounded-lg text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    currentHandling === "PARTIAL_REFUND"
                      ? "border-amber-500 bg-amber-50/40 text-amber-700 shadow-2xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>Khấu trừ một phần</span>
                  <span className="text-[9px] font-normal opacity-75">
                    (Phạt tùy chỉnh)
                  </span>
                </button>
              </div>
            </div>

            {/* 3. Số tiền thực tế hoàn trả */}
            <div className="space-y-1.5">
              <Label
                htmlFor="refundAmount"
                className="text-xs font-bold text-slate-700 flex items-center gap-1"
              >
                Số tiền thực tế hoàn trả khách (đ){" "}
                <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="refundAmount"
                type="number"
                disabled={currentHandling !== "PARTIAL_REFUND"}
                {...register("refundAmount", { valueAsNumber: true })}
                className="h-9 font-mono font-bold text-xs border-slate-200 rounded-lg disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="0"
                min="0"
                max={contractData.deposit}
              />
              {errors.refundAmount && (
                <p className="text-rose-500 text-[11px] font-medium">
                  {errors.refundAmount.message}
                </p>
              )}
            </div>

            {/* 4. Lý do chấm dứt trước hạn */}
            <div className="space-y-1.5">
              <Label
                htmlFor="terminationReason"
                className="text-xs font-bold text-slate-700"
              >
                Lý do kết thúc hợp đồng <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="terminationReason"
                rows={2}
                {...register("terminationReason")}
                placeholder="Ví dụ: Khách hàng chuyển công tác đột xuất, vi phạm điều khoản tiếng ồn..."
                className="text-xs border-slate-200 rounded-lg resize-none p-2.5 focus-visible:ring-indigo-500"
              />
              {errors.terminationReason && (
                <p className="text-rose-500 text-[11px] font-medium">
                  {errors.terminationReason.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer nút hành động điều hướng */}
          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setOpen(false)}
              className="h-9 text-xs font-semibold border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-2xs cursor-pointer active:scale-[0.98] transition-transform"
            >
              {isSubmitting ? "Đang xử lý..." : "Xác nhận thanh lý"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
