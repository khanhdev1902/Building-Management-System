/* eslint-disable react-hooks/incompatible-library */
"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  FileSpreadsheet,
  User,
  Image as ImageIcon,
  UploadCloud,
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

// 1. SCHEMA ZOD CHUẨN ERP - BỎ CÁC TRƯỜNG NHẬP TEXT TỰ DO GÂY SAI LỆCH DB
const expenseFormSchema = z.object({
  buildingId: z.string().min(1, "Vui lòng chọn tòa nhà vận hành"),
  category: z.enum(["MAINTENANCE", "OPERATING", "EQUIPMENT", "OTHER"]),
  applyTo: z.enum(["BUILDING", "ROOM"]),
  roomId: z.string().optional(),
  title: z.string().min(5, "Nội dung chi bắt buộc nhập từ 5 ký tự"),
  paidTo: z.string().min(2, "Tên người nhận tiền bắt buộc nhập"),
  amount: z.number().min(1000, "Số tiền chi tối thiểu từ 1.000đ"),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER"]),
  referenceNo: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

// Mock dữ liệu hệ thống động trả về từ Backend (Thực tế ông sẽ dùng React Query / SWR để fetch)
const mockBuildings = [
  { id: "b-01", name: "Danjin Cầu Giấy" },
  { id: "b-02", name: "Danjin Thanh Xuân" },
];

const mockRoomsByBuilding: Record<string, { id: string; name: string }[]> = {
  "b-01": [
    { id: "r-101", name: "Phòng 101" },
    { id: "r-102", name: "Phòng 102" },
    { id: "r-201", name: "Phòng 201" },
  ],
  "b-02": [
    { id: "r-901", name: "Phòng Penthouse 901" },
    { id: "r-902", name: "Phòng Studio 902" },
  ],
};

export function CreateExpenseDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [evidenceImage, setEvidenceImage] = useState<string | null>(null);

  const methods = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      buildingId: "",
      category: "MAINTENANCE",
      applyTo: "ROOM",
      roomId: "",
      title: "",
      paidTo: "",
      amount: undefined, // Mẹo UX: Để undefined để Input hiển thị placeholder sạch sẽ, không bám số 0
      paymentMethod: "CASH",
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

  const watchedBuildingId = watch("buildingId");
  const watchedApplyTo = watch("applyTo");

  // Helper định dạng tiền tệ dấu chấm Việt Nam
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

  const onSubmit = (data: ExpenseFormValues) => {
    if (!evidenceImage) {
      toast.warning(
        "Lưu ý: Phiếu chi chưa đính kèm ảnh chụp hóa đơn/chứng từ thực tế.",
      );
    }

    console.log("Phát hành phiếu chi quỹ Danjin BMS:", {
      ...data,
      evidenceImage,
    });
    toast.success(
      `✓ Đã lập phiếu chi -${data.amount.toLocaleString()}đ và gạch nợ quỹ lẻ!`,
    );

    reset();
    setEvidenceImage(null);
    setIsOpen(false);
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
        <Button className="h-9 text-[11px] font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm gap-1.5 cursor-pointer uppercase tracking-wider px-4 transition-all">
          <Plus size={14} className="stroke-[2.5]" /> Tạo phiếu chi mới
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-3xl bg-white rounded-xl border border-slate-100 p-0 shadow-2xl overflow-hidden flex flex-col md:flex-row md:h-140 animate-in fade-in zoom-in-95 duration-200">
        {/* ================= CỘT TRÁI: FORM NHẬP LIỆU CHÍNH ================= */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 p-6 flex flex-col justify-between overflow-y-auto border-r border-slate-50"
        >
          <div className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <FileSpreadsheet
                  size={16}
                  className="text-rose-500 stroke-[2.5]"
                />
                Khởi tạo chứng từ chi quỹ lẻ
              </DialogTitle>
              <DialogDescription className="text-[11px] text-slate-400 font-medium">
                Ghi nhận các khoản xuất quỹ mặt hoặc chuyển khoản ngân hàng phục
                vụ vận hành tòa nhà.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-1 text-xs font-semibold text-slate-600">
              {/* HÀNG KHÓA: CHỌN TÒA NHÀ (QUYẾT ĐỊNH DÒNG TIỀN CỦA CƠ SỞ NÀO) */}
              <FormGroup
                label="Tòa nhà áp phí"
                error={errors.buildingId?.message}
              >
                <Controller
                  name="buildingId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        setValue("roomId", ""); // Reset phòng cũ khi chọn tòa nhà mới
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="h-9 border-slate-200 bg-slate-50/40 rounded-lg text-xs font-medium px-3 focus:ring-1 focus:ring-slate-900 cursor-pointer">
                        <SelectValue placeholder="Chọn cơ sở chung cư mini..." />
                      </SelectTrigger>
                      <SelectContent className="p-1 rounded-lg border-slate-100 bg-white shadow-lg">
                        {mockBuildings.map((b) => (
                          <SelectItem
                            key={b.id}
                            value={b.id}
                            className="text-xs rounded-md"
                          >
                            🏢 {b.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormGroup>

              {/* HÀNG 2: PHÂN LOẠI & ĐỐI TƯỢNG ÁP PHÍ */}
              <div className="grid grid-cols-2 gap-3">
                <FormGroup label="Hạng mục chi phí">
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="h-9 border-slate-200 bg-slate-50/40 rounded-lg text-xs font-medium px-3 cursor-pointer">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="p-1 rounded-lg border-slate-100 bg-white">
                          <SelectItem value="MAINTENANCE" className="text-xs">
                            🔧 Bảo trì & Sửa chữa
                          </SelectItem>
                          <SelectItem value="OPERATING" className="text-xs">
                            ⚙️ Vận hành hệ thống
                          </SelectItem>
                          <SelectItem value="EQUIPMENT" className="text-xs">
                            🛋️ Mua sắm trang bị
                          </SelectItem>
                          <SelectItem value="OTHER" className="text-xs">
                            📂 Chi phí khác
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormGroup>

                <FormGroup label="Phạm vi áp phí">
                  <Controller
                    name="applyTo"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="h-9 border-slate-200 bg-slate-50/40 rounded-lg text-xs font-medium px-3 cursor-pointer">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="p-1 rounded-lg border-slate-100 bg-white">
                          <SelectItem value="ROOM" className="text-xs">
                            📍 Theo phòng cụ thể
                          </SelectItem>
                          <SelectItem value="BUILDING" className="text-xs">
                            🏢 Toàn bộ tòa nhà
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormGroup>
              </div>

              {/* HÀNG 3: NỘI DUNG & DANH SÁCH PHÒNG ĐỘNG */}
              <div
                className={`grid ${watchedApplyTo === "ROOM" ? "grid-cols-3" : "grid-cols-1"} gap-3`}
              >
                <div className={watchedApplyTo === "ROOM" ? "col-span-2" : ""}>
                  <FormGroup
                    label="Nội dung chi chi tiết"
                    error={errors.title?.message}
                  >
                    <Input
                      {...register("title")}
                      placeholder="Ví dụ: Sửa phao cơ máy bơm, thay aptomat..."
                      className="h-9 text-xs rounded-lg border-slate-200 bg-slate-50/10 font-medium placeholder:font-normal"
                    />
                  </FormGroup>
                </div>

                {watchedApplyTo === "ROOM" && (
                  <FormGroup label="Số phòng" error={errors.roomId?.message}>
                    <Controller
                      name="roomId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          disabled={!watchedBuildingId}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="h-9 border-slate-200 bg-slate-50/40 rounded-lg text-xs font-medium px-3 cursor-pointer disabled:opacity-50">
                            <SelectValue
                              placeholder={
                                watchedBuildingId ? "Chọn..." : "Chọn tòa trước"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent className="p-1 rounded-lg border-slate-100 bg-white max-h-48 overflow-y-auto">
                            {(mockRoomsByBuilding[watchedBuildingId] || []).map(
                              (r) => (
                                <SelectItem
                                  key={r.id}
                                  value={r.id}
                                  className="text-xs"
                                >
                                  {r.name}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormGroup>
                )}
              </div>

              {/* HÀNG 4: NGƯỜI NHẬN & SỐ TIỀN THỰC XUẤT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormGroup
                  label="Người nhận tiền / Đơn vị thi công"
                  error={errors.paidTo?.message}
                >
                  <div className="relative">
                    <Input
                      {...register("paidTo")}
                      placeholder="Ví dụ: Thợ điện nước Thành Công"
                      className="h-9 pl-8 text-xs font-medium rounded-lg border-slate-200 bg-slate-50/10 placeholder:font-normal"
                    />
                    <User
                      size={13}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </FormGroup>

                <FormGroup
                  label="Số tiền xuất quỹ (VND)"
                  error={errors.amount?.message}
                >
                  <Controller
                    name="amount"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        type="text"
                        value={formatCurrency(value)}
                        onChange={(e) =>
                          onChange(parseCurrency(e.target.value))
                        }
                        placeholder="0"
                        className="h-9 text-xs font-mono font-bold bg-slate-50/30 border-slate-200 rounded-lg text-right pr-3 focus-visible:bg-white text-rose-600 focus-visible:ring-1 focus-visible:ring-rose-500"
                      />
                    )}
                  />
                </FormGroup>
              </div>

              {/* HÀNG 5: HÌNH THỨC & MÃ VẾT CHUYỂN KHOẢN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormGroup label="Hình thức xuất quỹ">
                  <Controller
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="h-9 border-slate-200 bg-slate-50/40 rounded-lg text-xs font-medium px-3 cursor-pointer">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="p-1 rounded-lg border-slate-100 bg-white">
                          <SelectItem value="CASH" className="text-xs">
                            💵 Tiền mặt (Két lẻ)
                          </SelectItem>
                          <SelectItem value="BANK_TRANSFER" className="text-xs">
                            💳 Chuyển khoản ngân hàng
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormGroup>

                <FormGroup label="Mã tham chiếu / Số lệnh (nếu có)">
                  <Input
                    {...register("referenceNo")}
                    placeholder="Ví dụ: FT261456789..."
                    className="h-9 text-xs font-mono rounded-lg border-slate-200 bg-slate-50/10"
                  />
                </FormGroup>
              </div>
            </div>
          </div>

          {/* THANH ACTION BUTTON */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                reset();
                setIsOpen(false);
              }}
              className="h-9 text-xs text-slate-400 hover:text-slate-700 font-bold rounded-lg cursor-pointer px-4"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              className="h-9 px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-sm cursor-pointer uppercase tracking-wider transition-all"
            >
              Ký phát phiếu chi
            </Button>
          </div>
        </form>

        {/* ================= CỘT PHẢI: KHAY TẢI CHỨNG TỪ (BÀI TRÍ MINIMALIST LUXURY) ================= */}
        <div className="w-full md:w-64 bg-slate-50/50 p-5 flex flex-col justify-start shrink-0 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 select-none">
            <ImageIcon size={12} className="text-rose-500" /> Chứng từ đính kèm
          </span>

          <div
            onClick={() => setEvidenceImage("receipt_mockup_01.jpg")}
            className={`flex-1 min-h-35 md:min-h-0 border border-dashed rounded-xl flex flex-col items-center justify-center gap-2.5 px-4 text-center transition-all cursor-pointer group ${
              evidenceImage
                ? "border-emerald-200 bg-emerald-50/20 text-emerald-700"
                : "border-slate-200 bg-white hover:border-slate-300 shadow-2xs text-slate-400"
            }`}
          >
            {evidenceImage ? (
              <>
                <div className="h-9 w-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-2xs">
                  <UploadCloud size={16} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-tight text-emerald-800">
                    Đã lưu chứng từ
                  </p>
                  <p className="text-[9px] font-medium text-slate-400 truncate max-w-40">
                    receipt_evid_01.jpg
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEvidenceImage(null);
                  }}
                  className="h-6 text-[9px] text-rose-500 font-bold hover:bg-rose-50 rounded-md px-2"
                >
                  Xóa tệp
                </Button>
              </>
            ) : (
              <>
                <div className="h-9 w-9 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <UploadCloud size={16} className="text-slate-400" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-700">
                    Tải biên lai lên
                  </p>
                  <p className="text-[9px] text-slate-400 leading-normal px-2">
                    Kéo thả hoặc click để upload ảnh hóa đơn lẻ, biên lai thợ...
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="p-3.5 bg-white border border-slate-100 rounded-xl space-y-1.5 shadow-2xs">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
              💡 Quy tắc dòng tiền
            </span>
            <p className="text-[9px] leading-relaxed text-slate-500 font-medium">
              Khoản chi này sẽ trực tiếp hạch toán vào mục **Giá vốn dịch vụ**
              tháng này của tòa nhà được chọn để tính toán chỉ số ROI chính xác.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
