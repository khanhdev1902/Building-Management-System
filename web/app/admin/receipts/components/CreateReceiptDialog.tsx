/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  FilePlus2,
  Home,
  FileText,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormGroup } from "@/shared/components/FormGroup";
import { toast } from "sonner";

// 1. ĐỊNH NGHĨA SCHEMA ZOD ĐỐI SOÁT NGHIỆP VỤ PHIẾU THU LÕI
const receiptFormSchema = z.object({
  type: z.enum(["CONTRACT_INITIAL", "ROOM_REPAIR", "EXTERNAL_REVENUE"]),
  room: z.string().optional(),
  invoiceId: z.string().optional(),
  tenant: z.string().min(2, "Tên người nộp tiền bắt buộc nhập từ 2 ký tự"),
  amount: z.number().min(1000, "Số tiền thu tối thiểu từ 1.000đ"),
  paymentMethod: z.enum(["BANK_TRANSFER", "CASH"]),
  referenceNo: z.string().min(2, "Mã tham chiếu/Nội dung bắt buộc nhập"),
});

type ReceiptFormValues = z.infer<typeof receiptFormSchema>;

interface CreateReceiptDialogProps {
  onSuccess?: () => void;
}

export function CreateReceiptDialog({ onSuccess }: CreateReceiptDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const methods = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptFormSchema),
    defaultValues: {
      type: "ROOM_REPAIR",
      room: "",
      invoiceId: "",
      tenant: "",
      amount: 0,
      paymentMethod: "BANK_TRANSFER",
      referenceNo: "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  // Lắng nghe real-time phân loại phiếu thu để tráo đổi cấu trúc ô nhập liệu
  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedType = watch("type");

  // Helper định dạng tiền tệ dấu chấm Việt Nam khi gõ
  const formatCurrency = (value: string | number) => {
    if (!value && value !== 0) return "";
    return value
      .toString()
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseCurrency = (value: string) => {
    const num = parseInt(value.replace(/\./g, ""), 10);
    return isNaN(num) ? 0 : num;
  };

  const onSubmit = (data: ReceiptFormValues) => {
    // Ép dọn dẹp dữ liệu rác nếu là phiếu thu tự do ngoài
    const finalData = {
      ...data,
      room: data.type === "EXTERNAL_REVENUE" ? null : data.room,
      invoiceId: data.type === "EXTERNAL_REVENUE" ? null : data.invoiceId,
    };

    console.log("Xử lý lập phiếu thu thực tế Danjin BMS:", finalData);
    toast.success(
      `✓ Khóa sổ lập thành công phiếu thu trị giá ${data.amount.toLocaleString()}đ!`,
    );

    reset();
    setIsOpen(false);
    if (onSuccess) onSuccess();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="h-9 text-xs font-bold bg-slate-950 hover:bg-slate-900 text-white rounded-lg shadow-3xs gap-1.5 cursor-pointer uppercase tracking-wider text-[10px]">
          <Plus size={13} className="stroke-[2.5]" /> Lập phiếu thu tự do
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-xl bg-white rounded-xl border border-slate-200 p-5 shadow-xl font-sans overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <DialogHeader className="select-none pb-2 border-b border-slate-100">
          <DialogTitle className="text-sm font-black text-slate-950 uppercase tracking-wide flex items-center gap-1.5">
            <FilePlus2 size={15} className="text-indigo-600 stroke-[2.5]" />
            Khởi tạo chứng từ phiếu thu mới
          </DialogTitle>
          <DialogDescription className="text-[11px] text-slate-400 font-medium">
            Ghi nhận dòng tiền thực tế nhập quỹ két hoặc tài khoản ngân hàng
            liên thông.
          </DialogDescription>
        </DialogHeader>

        {/* FORM WORKSPACE PHẲNG LÌ */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 pt-3 text-xs font-medium text-slate-700"
        >
          {/* Ô 1: Phân loại nghiệp vụ dòng tiền */}
          <FormGroup label="Phân loại nghiệp vụ dòng tiền">
            <Select
              defaultValue="ROOM_REPAIR"
              onValueChange={(val: any) => setValue("type", val)}
            >
              <SelectTrigger className="h-8.5 border-slate-200 bg-slate-50/40 rounded-lg text-xs font-semibold px-2.5 focus:ring-0 cursor-pointer shadow-3xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="p-1 rounded-lg border-slate-200 bg-white shadow-sm">
                <SelectItem value="ROOM_REPAIR" className="text-xs">
                  🔧 Sửa chữa thiết bị / Phí phát sinh phòng
                </SelectItem>
                <SelectItem value="CONTRACT_INITIAL" className="text-xs">
                  📦 Tiền cọc & Tiền nhà đầu kỳ ký HĐ
                </SelectItem>
                <SelectItem value="EXTERNAL_REVENUE" className="text-xs">
                  🌐 Doanh thu tự do ngoài vận hành
                </SelectItem>
              </SelectContent>
            </Select>
          </FormGroup>

          {/* Ô 2: CỤM BIẾN ĐỔI NGỮ CẢNH ĐỘNG (Ẩn toàn bộ nếu là doanh thu ngoài) */}
          {watchedType !== "EXTERNAL_REVENUE" && (
            <div className="grid grid-cols-2 gap-3.5 animate-in fade-in duration-200">
              <FormGroup
                label="Số phòng đối chiếu"
                error={errors.room?.message}
              >
                <div className="relative">
                  <Input
                    {...register("room")}
                    placeholder="Ví dụ: 101"
                    className="h-8.5 pl-7 text-xs font-mono font-bold rounded-lg border-slate-200 bg-slate-50/20"
                  />
                  <Home
                    size={12}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </FormGroup>

              <FormGroup label="Mã Hóa đơn liên thông (Nếu có)">
                <div className="relative">
                  <Input
                    {...register("invoiceId")}
                    placeholder="Ví dụ: INV-2026-..."
                    className="h-8.5 pl-7 text-xs font-mono rounded-lg border-slate-200 bg-slate-50/20"
                  />
                  <FileText
                    size={12}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </FormGroup>
            </div>
          )}

          {/* Ô 3: Tên đối tượng nộp tiền */}
          <FormGroup
            label="Họ tên người nộp tiền thực tế"
            error={errors.tenant?.message}
          >
            <div className="relative">
              <Input
                {...register("tenant")}
                placeholder="Nhập tên người nộp hoặc đối tác..."
                className="h-8.5 pl-7 text-xs font-semibold text-slate-800 rounded-lg border-slate-200 bg-slate-50/20"
              />
              <User
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </FormGroup>

          {/* Ô 4: Hình thức nhận tiền & Số tiền thực tế gõ chấm VNĐ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormGroup label="Hình thức giao dịch tài khóa">
              <Select
                defaultValue="BANK_TRANSFER"
                onValueChange={(val: any) => setValue("paymentMethod", val)}
              >
                <SelectTrigger className="h-8.5 border-slate-200 bg-slate-50/40 rounded-lg text-xs font-semibold px-2.5 focus:ring-0 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="p-1 rounded-lg border-slate-200 bg-white">
                  <SelectItem value="BANK_TRANSFER" className="text-xs">
                    🪪 Chuyển khoản ngân hàng (VietQR)
                  </SelectItem>
                  <SelectItem value="CASH" className="text-xs">
                    💵 Thu tiền mặt trực tiếp
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormGroup>

            <FormGroup
              label="Số tiền thực nhận (VND)"
              error={errors.amount?.message}
            >
              <Controller
                name="amount"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="text"
                    value={formatCurrency(value)}
                    onChange={(e) => onChange(parseCurrency(e.target.value))}
                    placeholder="1.500.000"
                    className="h-8.5 text-xs font-mono font-black bg-slate-50/40 border-slate-200 rounded-lg text-right pr-3 focus-visible:bg-white text-slate-900"
                  />
                )}
              />
            </FormGroup>
          </div>

          {/* Ô 5: Nội dung ghi chú / Số tham chiếu */}
          <FormGroup
            label="Mã tham chiếu Bank / Nội dung diễn giải phiếu"
            error={errors.referenceNo?.message}
          >
            <Input
              {...register("referenceNo")}
              placeholder="Ví dụ: Khách vãng lai nộp cước xe lượt / Chuyển khoản cước sửa vỡ kính phòng..."
              className="h-8.5 text-xs rounded-lg border-slate-200 bg-slate-50/20 focus-visible:bg-white transition-all font-medium text-slate-800"
            />
          </FormGroup>

          {/* BỘ PHÍM ĐIỀU PHỐI ĐÁY KHAY DIALOG */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 select-none mt-5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                reset();
                setIsOpen(false);
              }}
              className="h-8.5 text-xs text-slate-400 hover:text-slate-700 font-bold rounded-lg cursor-pointer"
            >
              Hủy bỏ chứng từ
            </Button>
            <Button
              type="submit"
              className="h-8.5 px-4.5 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs rounded-lg shadow-sm cursor-pointer uppercase tracking-wider text-[10px]"
            >
              Ký duyệt phát hành phiếu
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
