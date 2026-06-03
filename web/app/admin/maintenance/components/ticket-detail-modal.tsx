/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Wrench,
  UserCheck,
  CreditCard,
  DollarSign,
  CalendarClock,
  Plus,
  Trash2,
  Receipt,
  FileText,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

// Định nghĩa Zod Schema cho Form Điều Phối
const ticketFormSchema = z.object({
  assignee: z.string().optional(),
  appointmentTime: z.string().optional(),
  billPayer: z.enum(["landlord", "resident"]),
  adminNotes: z.string().optional(),
  materials: z.array(
    z.object({
      name: z.string().min(1, { message: "Tên vật tư không được để trống" }),
      price: z.number().min(0, { message: "Giá không được âm" }),
    }),
  ),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

interface TicketDetailModalProps {
  selectedTicket: any | null;
  technicians: string[];
  onClose: () => void;
  onUpdateTicket: (statusTarget: string, updatedData: any) => void;
}

export function TicketDetailModal({
  selectedTicket,
  technicians,
  onClose,
  onUpdateTicket,
}: TicketDetailModalProps) {
  // Khởi tạo React Hook Form
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      assignee: "",
      appointmentTime: "",
      billPayer: "landlord",
      adminNotes: "",
      materials: [],
    },
  });

  // Sử dụng useFieldArray để quản lý danh sách vật tư động
  const { fields, append, remove } = useFieldArray({
    control,
    name: "materials",
  });

  // Đồng bộ hóa dữ liệu cũ của ticket khi admin bấm mở
  useEffect(() => {
    if (selectedTicket) {
      reset({
        assignee: selectedTicket.assignedTo || "",
        appointmentTime: selectedTicket.appointmentTime || "",
        adminNotes: selectedTicket.notes || "",
        billPayer: selectedTicket.billPayer || "landlord",
        materials: selectedTicket.materialsDetails || [],
      });
    }
  }, [selectedTicket, reset]);

  if (!selectedTicket) return null;

  // Theo dõi mảng vật tư để tính tổng tiền realtime
  const watchMaterials = watch("materials");
  const totalCost = (watchMaterials || []).reduce(
    (sum, item) => sum + (Number(item?.price) || 0),
    0,
  );

  // Hàm xử lý Submit chung cho các trạng thái
  const handleAction = (status: string) => {
    // Chạy cơ chế kiểm tra thủ công cho từng nút nghiệp vụ riêng biệt
    const currentNotes = watch("adminNotes") || "";
    const currentAssignee = watch("assignee") || "";
    const currentAppointment = watch("appointmentTime") || "";

    // GIAI ĐOẠN 1: Nếu bấm HỦY -> Ép buộc phải có lý do hủy
    if (status === "cancelled") {
      if (currentNotes.trim().length < 5) {
        setError("adminNotes", {
          type: "manual",
          message:
            "Bắt buộc phải nhập lý do hủy chi tiết (tối thiểu 5 ký tự) để đối soát!",
        });
        return;
      }
    }

    // GIAI ĐOẠN 2: Nếu bấm HẸN LỊCH SỬA -> Ép buộc phải chọn Thợ và Ngày hẹn
    if (status === "scheduled") {
      let hasError = false;
      if (!currentAssignee) {
        setError("assignee", {
          type: "manual",
          message: "Vui lòng chỉ định thợ xử lý sự cố này",
        });
        hasError = true;
      }
      if (!currentAppointment) {
        setError("appointmentTime", {
          type: "manual",
          message: "Vui lòng chọn thời gian hẹn với cư dân",
        });
        hasError = true;
      }
      if (hasError) return;
    }

    // Xóa toàn bộ lỗi cũ nếu các điều kiện trên đã thỏa mãn
    clearErrors();

    // Trigger hàm handleSubmit của react-hook-form để thu thập dữ liệu sạch
    handleSubmit((data) => {
      onUpdateTicket(status, {
        assignedTo: data.assignee,
        appointmentTime: data.appointmentTime,
        notes: data.adminNotes,
        billPayer: data.billPayer,
        cost: totalCost,
        materialsDetails: data.materials,
      });
    })();
  };

  return (
    <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-160 bg-white rounded-2xl p-6 font-sans max-h-[90vh] overflow-y-auto">
        <DialogHeader className="select-none border-b border-slate-100 pb-3">
          <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-600" /> Thẩm định & Điều phối
            nghiệp vụ sửa chữa
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Mã phiếu:{" "}
            <span className="font-mono font-bold text-slate-600">
              {selectedTicket.id}
            </span>{" "}
            — Luồng xử lý sự cố nội bộ Danjin.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-4 pt-2 text-xs"
        >
          {/* THẺ TÓM TẮT KHAI BÁO CỦA CƯ DÂN */}
          <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl space-y-2">
            <div className="flex justify-between font-bold text-slate-800 text-[12.5px]">
              <span className="bg-slate-200/80 text-slate-800 px-2 py-0.5 rounded">
                Vị trí: {selectedTicket.room}
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                {selectedTicket.createdAt}
              </span>
            </div>
            <p className="font-bold text-slate-800 text-[12px]">
              Nội dung báo hỏng:{" "}
              <span className="text-red-600">{selectedTicket.title}</span>
            </p>
            <p className="text-slate-600 font-medium leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/60 text-[11.5px]">
              {selectedTicket.description}
            </p>
            <div className="text-[11px] text-slate-500 font-medium">
              Người báo:{" "}
              <span className="text-slate-800 font-bold">
                {selectedTicket.resident}
              </span>{" "}
              — ĐT:{" "}
              <span className="text-slate-800 font-bold font-mono">
                {selectedTicket.phone}
              </span>
            </div>
          </div>

          {/* KHAY ĐIỀU PHỐI LỊCH HẸN VÀ THỢ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-100 pt-3">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" /> Cử nhân sự
                kỹ thuật
              </label>
              <Select
                value={watch("assignee")}
                onValueChange={(val) => {
                  setValue("assignee", val);
                  clearErrors("assignee");
                }}
              >
                <SelectTrigger
                  className={`h-9 border bg-slate-50/50 rounded-xl text-xs font-semibold ${errors.assignee ? "border-red-500 ring-1 ring-red-500" : "border-slate-200"}`}
                >
                  <SelectValue placeholder="--- Bấm để chỉ định thợ ---" />
                </SelectTrigger>
                <SelectContent className="rounded-xl text-xs font-medium">
                  {technicians.map((tech) => (
                    <SelectItem key={tech} value={tech} className="text-xs">
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assignee && (
                <p className="text-red-500 text-[10px] font-bold mt-1">
                  {errors.assignee.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <CalendarClock className="w-3.5 h-3.5 text-slate-400" /> Đặt
                thời gian hẹn sửa chữa
              </label>
              <Input
                type="datetime-local"
                {...register("appointmentTime")}
                onChange={(e) => {
                  register("appointmentTime").onChange(e);
                  clearErrors("appointmentTime");
                }}
                className={`h-9 bg-slate-50/50 rounded-xl text-xs font-medium text-slate-700 ${errors.appointmentTime ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200"}`}
              />
              {errors.appointmentTime && (
                <p className="text-red-500 text-[10px] font-bold mt-1">
                  {errors.appointmentTime.message}
                </p>
              )}
            </div>
          </div>

          {/* KHAY QUẢN LÝ CHI PHÍ VÀ CHI TIẾT VẬT TƯ NÂNG CAO */}
          <div className="border-t border-slate-100 pt-3 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 text-[12px] flex items-center gap-1">
                <Receipt className="w-3.5 h-3.5 text-blue-600" /> Bóc tách chi
                phí phát sinh thực tế
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", price: 0 })}
                className="h-7 px-2.5 text-[11px] font-bold border-dashed border-blue-300 text-blue-600 hover:bg-blue-50/50 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Thêm hạng mục / vật tư
              </Button>
            </div>

            {/* Danh sách hạng mục động bằng useFieldArray */}
            {fields.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {fields.map((item, index) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center gap-2 bg-slate-50/50 p-2 border border-slate-100 rounded-xl">
                      <span className="text-slate-400 font-bold w-4 text-center">
                        {index + 1}
                      </span>
                      <Input
                        placeholder="Ví dụ: Thay bóng tuýp LED, Aptomat 32A..."
                        {...register(`materials.${index}.name` as const)}
                        className={`h-8 bg-white rounded-lg flex-1 text-xs ${errors.materials?.[index]?.name ? "border-red-500" : "border-slate-200"}`}
                      />
                      <div className="relative w-32">
                        <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                        <Input
                          type="number"
                          placeholder="Giá tiền"
                          {...register(`materials.${index}.price` as const, {
                            valueAsNumber: true,
                          })}
                          className={`h-8 pl-6 bg-white rounded-lg text-xs text-slate-700 ${errors.materials?.[index]?.price ? "border-red-500" : "border-slate-200"}`}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    {errors.materials?.[index] && (
                      <p className="text-red-500 text-[9px] font-bold pl-6">
                        {errors.materials[index]?.name?.message ||
                          errors.materials[index]?.price?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 bg-slate-50/30 border border-dashed border-slate-200 rounded-xl text-slate-400 font-medium text-[11px]">
                Chưa có chi phí phụ tùng hay vật tư phát sinh cho sự cố này.
              </div>
            )}

            {/* Quy trách nhiệm thanh toán */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center bg-slate-50/80 p-3 rounded-xl border border-slate-100">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Quy
                  trách nhiệm thanh toán
                </label>
                <p className="text-[10px] text-slate-400 font-medium">
                  Khoản phí này sẽ tự động kết chuyển vào hóa đơn tương ứng.
                </p>
              </div>
              <Select
                value={watch("billPayer")}
                onValueChange={(val) =>
                  setValue("billPayer", val as "landlord" | "resident")
                }
              >
                <SelectTrigger className="h-8.5 border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs font-medium rounded-lg">
                  <SelectItem value="landlord" className="">
                    Chủ nhà / BQL chịu chi phí
                  </SelectItem>
                  <SelectItem value="resident" className="">
                    Tính tiền vào hóa đơn cư dân
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Khối hiển thị tổng kết tiền mặt tự động cộng dồn */}
            <div className="flex justify-end text-slate-700 font-bold text-[13px] pt-1 pr-1">
              Tổng chi phí phát sinh:&nbsp;
              <span className="text-slate-900 font-mono text-[14px] underline decoration-double decoration-blue-500">
                {totalCost.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>

          {/* NHẬT KÝ NGHIỆM THU NỘI BỘ */}
          <div className="space-y-1.5 border-t border-slate-100 pt-3">
            <label className="font-bold text-slate-700 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Nhật ký nghiệm
              thu / Lý do hoãn hoặc hủy{" "}
              <span className="text-red-500 font-black">*</span>
            </label>
            <Textarea
              placeholder="Ghi lại nguyên nhân hỏng hóc, hoặc BẮT BUỘC nhập lý do tại đây nếu bấm Hủy Ticket..."
              rows={2}
              {...register("adminNotes")}
              onChange={(e) => {
                register("adminNotes").onChange(e);
                clearErrors("adminNotes");
              }}
              className={`rounded-xl bg-slate-50/50 text-xs font-medium leading-relaxed p-2.5 focus-visible:bg-white resize-none ${errors.adminNotes ? "border-red-500 ring-1 ring-red-500" : "border-slate-200"}`}
            />
            {errors.adminNotes && (
              <p className="text-red-500 text-[10px] font-bold mt-1">
                {errors.adminNotes.message}
              </p>
            )}
          </div>

          {/* ĐIỀU PHỐI LUỒNG TRẠNG THÁI (ACTION BUTTONS THỰC TẾ) */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 select-none">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAction("cancelled")}
              className="h-9 text-xs text-slate-400 border-slate-200 hover:text-red-600 hover:bg-red-50/30 font-bold rounded-xl"
            >
              Hủy yêu cầu
            </Button>

            <div className="flex items-center gap-1.5">
              {/* Pending -> Received */}
              {selectedTicket.status === "pending" && (
                <Button
                  type="button"
                  onClick={() => handleAction("received")}
                  className="h-9 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
                >
                  Tiếp nhận yêu cầu
                </Button>
              )}

              {/* Received -> Scheduled */}
              {selectedTicket.status === "received" && (
                <Button
                  type="button"
                  onClick={() => handleAction("scheduled")}
                  className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl"
                >
                  Hẹn lịch sửa
                </Button>
              )}

              {/* Scheduled -> Processing */}
              {selectedTicket.status === "scheduled" && (
                <Button
                  type="button"
                  onClick={() => handleAction("processing")}
                  className="h-9 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl"
                >
                  Bắt đầu sửa chữa
                </Button>
              )}

              {/* Processing -> Completed */}
              {selectedTicket.status === "processing" && (
                <Button
                  type="button"
                  onClick={() => handleAction("completed")}
                  className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                >
                  Hoàn thành sửa chữa
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
