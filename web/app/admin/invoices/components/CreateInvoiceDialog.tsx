/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  FilePlus2,
  User,
  Zap,
  Droplets,
  Wrench,
  ArrowRight,
  Wallet,
  Trash2,
  ShieldAlert,
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
import { Textarea } from "@/shared/components/ui/textarea";

// ================= MOCKUP DATA LIÊN THÔNG ĐẬM ĐẶC NGHIỆP VỤ DANJIN BMS =================
const MOCK_ROOM_REGISTRY: Record<
  string,
  {
    tenantName: string;
    paymentCycle: number;
    rentPrice: number;
    eOld: number;
    wOld: number;
    electricPrice: number;
    waterPrice: number;
    serviceFee: number;
    initialExtraServices?: { name: string; price: number }[];
  }
> = {
  "101": {
    tenantName: "Trần Bình An",
    paymentCycle: 1,
    rentPrice: 4500000,
    eOld: 2100,
    wOld: 800,
    electricPrice: 3500,
    waterPrice: 25000,
    serviceFee: 150000,
    initialExtraServices: [],
  },
  "202": {
    tenantName: "Trần Thị Bình",
    paymentCycle: 3,
    rentPrice: 4800000,
    eOld: 3410,
    wOld: 1105,
    electricPrice: 3500,
    waterPrice: 25000,
    serviceFee: 150000,
    initialExtraServices: [{ name: "Thay bóng đèn hành lang", price: 200000 }],
  },
  "405": {
    tenantName: "Lê Minh Công",
    paymentCycle: 2,
    rentPrice: 4500000,
    eOld: 1850,
    wOld: 640,
    electricPrice: 3800,
    waterPrice: 28000,
    serviceFee: 100000,
    initialExtraServices: [],
  },
};

// ZOD SCHEMA: Kiểm soát luồng tài khóa chỉnh sửa sâu
const invoiceFormSchema = z.object({
  roomNumber: z.string().min(1, "Bắt buộc phải chọn số phòng khởi tạo"),
  rentPrice: z.number().min(0, "Giá phòng không được âm"),
  electricPrice: z.number().min(0, "Đơn giá điện không được âm"),
  waterPrice: z.number().min(0, "Đơn giá nước không được âm"),
  serviceFee: z.number().min(0, "Phí quản lý không được âm"),
  eNew: z.string().min(1, "Bắt buộc nhập số điện mới chốt"),
  wNew: z.string().min(1, "Bắt buộc nhập số nước mới chốt"),
  note: z.string().optional(),
  extraServices: z
    .array(
      z.object({
        name: z.string().min(1, "Tên loại phí phát sinh bắt buộc"),
        price: z.number().min(0, "Số tiền không được âm"),
      }),
    )
    .optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

export function CreateInvoiceDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const methods = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      roomNumber: "",
      rentPrice: 0,
      electricPrice: 0,
      waterPrice: 0,
      serviceFee: 0,
      eNew: "",
      wNew: "",
      note: "",
      extraServices: [],
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

  // Quản lý mảng động các khoản phí phát sinh ngoài (Thay bóng đèn, sửa khóa...)
  const {
    fields: extraFields,
    append: appendExtra,
    remove: removeExtra,
  } = useFieldArray({
    control,
    name: "extraServices",
  });

  // Khay nạp dữ liệu nền khi admin click chọn mã phòng con
  const roomData = useMemo(() => {
    if (!selectedRoom) return null;
    return MOCK_ROOM_REGISTRY[selectedRoom] || null;
  }, [selectedRoom]);

  // Luồng auto-fill đè giá trị mặc định lên form khi tráo đổi phòng
  useEffect(() => {
    if (roomData) {
      setValue("rentPrice", roomData.rentPrice);
      setValue("electricPrice", roomData.electricPrice);
      setValue("waterPrice", roomData.waterPrice);
      setValue("serviceFee", roomData.serviceFee);
      setValue("extraServices", roomData.initialExtraServices || []);
      setValue("eNew", "");
      setValue("wNew", "");
    }
  }, [roomData, setValue]);

  // Lắng nghe toàn bộ các trường biến động trên form để phục vụ bảng chiết tính tự động
  const watchedRentPrice = watch("rentPrice") || 0;
  const watchedElectricPrice = watch("electricPrice") || 0;
  const watchedWaterPrice = watch("waterPrice") || 0;
  const watchedServiceFee = watch("serviceFee") || 0;
  const watchedENew = watch("eNew");
  const watchedWNew = watch("wNew");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const watchedExtras = watch("extraServices") || [];

  const billingCalculation = useMemo(() => {
    if (!roomData)
      return {
        eUsage: 0,
        wUsage: 0,
        eCost: 0,
        wCost: 0,
        extraTotal: 0,
        grandTotal: 0,
      };

    const eUsage = watchedENew ? Number(watchedENew) - roomData.eOld : 0;
    const wUsage = watchedWNew ? Number(watchedWNew) - roomData.wOld : 0;

    const eCost = eUsage > 0 ? eUsage * watchedElectricPrice : 0;
    const wCost = wUsage > 0 ? wUsage * watchedWaterPrice : 0;

    // Cộng dồn toàn bộ mảng động phí phát sinh ngoài
    const extraTotal = watchedExtras.reduce(
      (sum, item) => sum + (Number(item?.price) || 0),
      0,
    );
    const grandTotal =
      Number(watchedRentPrice) +
      eCost +
      wCost +
      Number(watchedServiceFee) +
      extraTotal;

    return { eUsage, wUsage, eCost, wCost, extraTotal, grandTotal };
  }, [
    roomData,
    watchedRentPrice,
    watchedElectricPrice,
    watchedWaterPrice,
    watchedServiceFee,
    watchedENew,
    watchedWNew,
    watchedExtras,
  ]);

  const onSubmit = (data: InvoiceFormValues) => {
    if (billingCalculation.eUsage < 0 || billingCalculation.wUsage < 0) {
      toast.error("Lỗi chỉ số: Số công tơ mới không được phép nhỏ hơn số cũ!");
      return;
    }

    console.log("Xác nhận phát hành hóa đơn nén nghiệp vụ phát sinh ngoài:", {
      ...data,
      billingCalculation,
    });
    toast.success(
      `✓ Phát hành hóa đơn phòng P.${data.roomNumber} thành công! Tổng cước: ${billingCalculation.grandTotal.toLocaleString()}đ`,
    );

    reset();
    setSelectedRoom(null);
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          reset();
          setSelectedRoom(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="h-8 text-xs font-semibold rounded-lg shadow-2xs cursor-pointer select-none">
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Khởi tạo hóa đơn lẻ
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-4xl bg-white rounded-xl border border-slate-200 p-0 shadow-xl font-sans overflow-hidden flex flex-col md:flex-row md:h-140 animate-in fade-in zoom-in-95 duration-200">
        {/* ================= CỘT TRÁI (7 PHẦN): INPUT CHỈ SỐ VÀ CẤU HÌNH LIÊN THÔNG GIÁ ================= */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 p-5 flex flex-col justify-between overflow-y-auto border-r border-slate-100"
        >
          <div className="space-y-4">
            <DialogHeader className="select-none">
              <DialogTitle className="text-sm font-black text-slate-950 uppercase tracking-wide flex items-center gap-1.5">
                <FilePlus2 size={15} className="text-indigo-600 stroke-[2.5]" />
                Phát hành chứng từ hóa đơn phòng lẻ
              </DialogTitle>
              <DialogDescription className="text-[11px] text-slate-400 font-medium">
                Cho phép tùy biến đơn giá mặt bằng, nạp chỉ số phần cứng và kê
                khai các khoản phí sửa chữa ngoài.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-1 text-xs font-medium text-slate-700">
              {/* 1. Ô CHỌN PHÒNG */}
              <FormGroup
                label="Mã căn hộ quyết toán"
                error={errors.roomNumber?.message}
              >
                <Select
                  onValueChange={(val) => {
                    setValue("roomNumber", val);
                    setSelectedRoom(val);
                  }}
                >
                  <SelectTrigger className="h-8.5 border-slate-200 bg-slate-50/40 rounded-lg text-xs font-bold px-2.5 shadow-3xs cursor-pointer">
                    <SelectValue placeholder="Bấm để mở danh sách phòng..." />
                  </SelectTrigger>
                  <SelectContent className="p-1 rounded-lg border-slate-200 bg-white shadow-sm">
                    {Object.keys(MOCK_ROOM_REGISTRY).map((r) => (
                      <SelectItem
                        key={r}
                        value={r}
                        className="text-xs font-mono font-bold"
                      >
                        Phòng P.{r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormGroup>

              {roomData ? (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {/* BỘ KHUNG TÙY BIẾN ĐƠN GIÁ ĐẦU KỲ (EDITABLE FIELDS) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                    <FormGroup label="Giá phòng (VND)">
                      <Input
                        type="number"
                        {...register("rentPrice", { valueAsNumber: true })}
                        className="h-7.5 text-xs font-mono font-bold rounded-lg bg-white border-slate-200"
                      />
                    </FormGroup>
                    <FormGroup label="Đơn giá Điện">
                      <Input
                        type="number"
                        {...register("electricPrice", { valueAsNumber: true })}
                        className="h-7.5 text-xs font-mono font-bold rounded-lg bg-white border-slate-200 text-amber-600"
                      />
                    </FormGroup>
                    <FormGroup label="Đơn giá Nước">
                      <Input
                        type="number"
                        {...register("waterPrice", { valueAsNumber: true })}
                        className="h-7.5 text-xs font-mono font-bold rounded-lg bg-white border-slate-200 text-blue-600"
                      />
                    </FormGroup>
                    <FormGroup label="Combo Quản lý">
                      <Input
                        type="number"
                        {...register("serviceFee", { valueAsNumber: true })}
                        className="h-7.5 text-xs font-mono font-bold rounded-lg bg-white border-slate-200 text-indigo-600"
                      />
                    </FormGroup>
                  </div>

                  {/* NHẬP CÔNG TƠ ĐIỆN NƯỚC CHỐT SỔ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormGroup
                      label="Chỉ số Điện mới chốt (kWh)"
                      error={errors.eNew?.message}
                    >
                      <div
                        className={`flex items-center gap-2 px-2.5 h-8.5 rounded-lg border transition-all ${billingCalculation.eUsage < 0 ? "bg-rose-50/60 border-rose-200" : "bg-white border-slate-200 shadow-3xs"}`}
                      >
                        <span className="text-[10px] text-slate-400 font-mono">
                          Cũ: <strong>{roomData.eOld}</strong>
                        </span>
                        <ArrowRight size={11} className="text-slate-300" />
                        <Input
                          type="number"
                          {...register("eNew")}
                          placeholder="Nhập số mới..."
                          className="border-none bg-transparent shadow-none h-full p-0 font-mono text-xs font-bold text-slate-800 focus-visible:ring-0 w-full"
                        />
                      </div>
                    </FormGroup>

                    <FormGroup
                      label="Chỉ số Nước mới chốt (m³)"
                      error={errors.wNew?.message}
                    >
                      <div
                        className={`flex items-center gap-2 px-2.5 h-8.5 rounded-lg border transition-all ${billingCalculation.wUsage < 0 ? "bg-rose-50/60 border-rose-200" : "bg-white border-slate-200 shadow-3xs"}`}
                      >
                        <span className="text-[10px] text-slate-400 font-mono">
                          Cũ: <strong>{roomData.wOld}</strong>
                        </span>
                        <ArrowRight size={11} className="text-slate-300" />
                        <Input
                          type="number"
                          {...register("wNew")}
                          placeholder="Nhập số mới..."
                          className="border-none bg-transparent shadow-none h-full p-0 font-mono text-xs font-bold text-slate-800 focus-visible:ring-0 w-full"
                        />
                      </div>
                    </FormGroup>
                  </div>

                  {/* PHÂN KHU BỔ SUNG PHÍ DỊCH VỤ NGOÀI (DYNAMIC EXTRA FEES MODULE) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                        🛵 III. Phí dịch vụ ngoài phát sinh lẻ trong kỳ
                      </span>
                      <Button
                        type="button"
                        onClick={() => appendExtra({ name: "", price: 0 })}
                        variant="outline"
                        size="sm"
                        className="h-5.5 text-[9px] font-bold border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 cursor-pointer shadow-3xs"
                      >
                        <Plus size={10} className="mr-0.5" /> Thêm phí ngoài
                      </Button>
                    </div>

                    <div className="max-h-28 overflow-y-auto space-y-1.5 pr-0.5">
                      {extraFields.length === 0 ? (
                        <p className="text-[10px] text-slate-400 font-medium italic py-1.5 text-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200/50">
                          Không có khoản phí phát sinh ngoài (Phòng vận hành
                          bình thường).
                        </p>
                      ) : (
                        extraFields.map((field, idx) => (
                          <div
                            key={field.id}
                            className="flex items-center gap-2 animate-in fade-in duration-150"
                          >
                            <div className="flex-1">
                              <Input
                                {...register(
                                  `extraServices.${idx}.name` as const,
                                )}
                                placeholder="Ví dụ: Thay bóng đèn, thợ sửa vòi nước..."
                                className="h-7 text-xs rounded-lg bg-white border-slate-200 font-semibold text-slate-700"
                              />
                            </div>
                            <div className="w-24">
                              <Input
                                type="number"
                                {...register(
                                  `extraServices.${idx}.price` as const,
                                  { valueAsNumber: true },
                                )}
                                placeholder="Số tiền"
                                className="h-7 text-xs font-mono font-bold text-right rounded-lg bg-white border-slate-200 text-slate-800"
                              />
                            </div>
                            <Button
                              type="button"
                              onClick={() => removeExtra(idx)}
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-300 hover:text-rose-600 rounded shrink-0 cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-10 text-center text-[11px] text-slate-400 italic bg-slate-50/40 border border-dashed border-slate-200 rounded-xl select-none">
                  Vui lòng lựa chọn căn hộ ở trên để mở khóa bảng nạp chỉ số
                  phần cứng và gộp dịch vụ ngoài.
                </div>
              )}

              <FormGroup label="Ghi chú hóa đơn">
                <Textarea
                  {...register("note")}
                  placeholder="Aa..."
                  className="min-h-32 rounded-lg border-slate-100 bg-slate-50/20 text-slate-700 resize-none"
                />
              </FormGroup>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 select-none mt-4 shrink-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                reset();
                setSelectedRoom(null);
                setIsOpen(false);
              }}
              className="h-8.5 text-xs text-slate-400 hover:text-slate-700 font-bold rounded-lg cursor-pointer"
            >
              Hủy lệnh
            </Button>
            <Button
              type="submit"
              disabled={!roomData}
              className="h-8.5 px-4.5 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs rounded-lg shadow-sm cursor-pointer uppercase tracking-wider text-[10px] disabled:opacity-40"
            >
              Phát hành hóa đơn
            </Button>
          </div>
        </form>

        {/* ================= CỘT PHẢI (5 PHẦN): BẢNG CHIẾT TÍNH ĐỐI SOÁT LUỒNG TIỀN SANG TRỌNG ================= */}
        <div className="w-full md:w-80 bg-slate-50/60 p-5 flex flex-col justify-start select-none shrink-0 space-y-4 border-t md:border-t-0 md:border-l border-slate-100 overflow-y-auto">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
            <Wallet size={11} className="text-indigo-500" /> Bảng chiết tính tự
            động kỳ này
          </span>

          {roomData ? (
            <div className="space-y-3.5 text-[11px] font-medium text-slate-500 flex-1 flex flex-col justify-between min-h-0">
              <div className="p-3 bg-white border border-slate-200/60 rounded-xl space-y-2.5 shadow-3xs overflow-y-auto max-h-77.5">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block leading-none">
                    Cư dân lưu trú
                  </span>
                  <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                    <User size={11} className="text-slate-400" />{" "}
                    {roomData.tenantName}
                  </span>
                </div>

                <div className="h-px bg-slate-100 w-full" />

                <div className="flex justify-between">
                  <span>Tiền phòng cứng:</span>
                  <strong className="text-slate-800 font-mono">
                    {Number(watchedRentPrice).toLocaleString()}đ
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-0.5">
                    <Zap size={11} className="text-amber-500" /> Điện (+
                    {billingCalculation.eUsage} kWh):
                  </span>
                  <strong className="text-slate-800 font-mono">
                    {billingCalculation.eCost.toLocaleString()}đ
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-0.5">
                    <Droplets size={11} className="text-blue-500" /> Nước (+
                    {billingCalculation.wUsage} m³):
                  </span>
                  <strong className="text-slate-800 font-mono">
                    {billingCalculation.wCost.toLocaleString()}đ
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-0.5">
                    <Wrench size={11} className="text-indigo-400" /> Combo dịch
                    vụ quản lý:
                  </span>
                  <strong className="text-slate-800 font-mono">
                    {Number(watchedServiceFee).toLocaleString()}đ
                  </strong>
                </div>

                {/* Đoạn lặp hiển thị vết của phí phát sinh ngoài bên cột đối soát */}
                {billingCalculation.extraTotal > 0 && (
                  <>
                    <div className="h-px bg-slate-100 w-full" />
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-rose-500 uppercase tracking-tight block">
                        Chi phí phát sinh lẻ:
                      </span>
                      {watchedExtras?.map(
                        (item: any, idx: number) =>
                          item.name && (
                            <div
                              key={idx}
                              className="flex justify-between items-baseline pl-1 text-slate-600"
                            >
                              <span className="truncate max-w-32.5 text-slate-500">
                                • {item.name}:
                              </span>
                              <strong className="font-mono font-bold text-slate-800">
                                +{Number(item.price || 0).toLocaleString()}đ
                              </strong>
                            </div>
                          ),
                      )}
                    </div>
                  </>
                )}

                <div className="h-px bg-slate-100 w-full" />
                <div className="flex justify-between items-center text-[10px] text-indigo-600 font-bold bg-indigo-50/40 px-2 py-0.5 rounded border border-indigo-100/30">
                  <span>CHU KỲ TÀI KHÓA HỢP ĐỒNG:</span>
                  <span>{roomData.paymentCycle} THÁNG/LẦN</span>
                </div>
              </div>

              <div className="space-y-2 mt-auto shrink-0 pt-2">
                {billingCalculation.eUsage < 0 ||
                billingCalculation.wUsage < 0 ? (
                  <div className="flex items-center gap-1.5 p-2 bg-rose-50 border border-rose-100 rounded-lg text-[10px] font-bold text-rose-600 select-none">
                    <ShieldAlert size={12} className="shrink-0 stroke-[2.5]" />
                    <span>Lỗi: Số mới nhỏ hơn số cũ!</span>
                  </div>
                ) : null}

                <div className="p-3.5 bg-slate-950 text-white rounded-xl relative overflow-hidden shadow-sm">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block leading-none">
                    Tổng cước phát hành (Tạm tính)
                  </span>
                  <div className="flex items-baseline gap-0.5 pt-1.5">
                    <span className="text-xl font-black font-mono tracking-tight leading-none text-white">
                      {billingCalculation.grandTotal.toLocaleString("vi-VN")}
                    </span>
                    <span className="text-[10px] font-bold font-sans opacity-60 ml-0.5 text-slate-400">
                      VND
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 border border-dashed border-slate-200 rounded-xl p-4 bg-white shadow-3xs">
              <FilePlus2
                size={24}
                className="text-slate-200 stroke-[1.5] mb-2"
              />
              <p className="text-[10px] leading-normal font-medium">
                Chọn một căn hộ ở cột bên để kích hoạt bảng phân rã hóa đơn tự
                động.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
