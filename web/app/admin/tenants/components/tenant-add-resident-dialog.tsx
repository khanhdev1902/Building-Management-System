"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  UserPlus,
  User,
  Phone,
  Mail,
  FileText,
  Bike,
  Briefcase,
  MapPin,
  UploadCloud,
  Fingerprint,
  Sparkles,
  Calendar,
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
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";

// 1. TỐI ƯU SCHEMA: Linh hoạt hơn cho thực tế quản lý vận hành
const residentSchema = z.object({
  name: z.string().min(2, "Họ và tên cư dân bắt buộc nhập từ 2 ký tự"),
  phone: z
    .string()
    .regex(
      /^(03|05|07|08|09)\d{8}$/,
      "Số điện thoại không đúng định dạng (10 số)",
    ),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  cccd: z.string().length(12, "Số định danh CCCD phải đúng 12 chữ số"),
  birthday: z.string().min(1, "Vui lòng chọn ngày sinh"),
  gender: z.string().min(1, "Vui lòng chọn giới tính"),
  hometown: z.string().min(3, "Vui lòng nhập nguyên quán"),
  occupation: z.string().min(2, "Vui lòng nhập công việc hiện tại"),
  role: z.string(),
  licensePlate: z.string().optional(),
});

type ResidentFormValues = z.infer<typeof residentSchema>;

export function AddResidentDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [cccdFrontImage, setCccdFrontImage] = useState<string | null>(null);
  const [cccdBackImage, setCccdBackImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ResidentFormValues>({
    resolver: zodResolver(residentSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      cccd: "",
      birthday: "",
      gender: "Nam",
      hometown: "",
      occupation: "Sinh viên",
      role: "member",
      licensePlate: "",
    },
  });

  const watchedValues = watch();

  // Giả lập OCR số hóa chứng từ
  const handleImageUpload = (type: "front" | "back") => {
    if (type === "front") setCccdFrontImage("cccd_front.jpg");
    else setCccdBackImage("cccd_back.jpg");
    toast.success(`Đã số hóa mặt ${type === "front" ? "trước" : "sau"} CCCD!`);
  };

  const onSubmit = (data: ResidentFormValues) => {
    // Thay vì chặn cứng, ta đưa ra cảnh báo mềm hoặc xử lý linh hoạt
    if (!cccdFrontImage || !cccdBackImage) {
      toast.warning("Lưu ý: Hồ sơ chưa đính kèm đủ 2 mặt ảnh CCCD.");
    }

    console.log("Đồng bộ nhân khẩu Danjin BMS:", {
      ...data,
      cccdFrontImage,
      cccdBackImage,
    });

    toast.success(`✓ Khai báo tạm trú thành công cư dân ${data.name}!`);
    reset();
    setCccdFrontImage(null);
    setCccdBackImage(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-8 text-xs font-semibold bg-slate-950 hover:bg-slate-900 text-white rounded-lg px-3 shadow-sm gap-1.5 cursor-pointer transition-colors"
        >
          <UserPlus size={13} className="stroke-[2.5]" />
          <span>Thêm nhân khẩu lưu trú</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-5xl bg-white rounded-xl border border-slate-200/80 p-0 shadow-xl font-sans overflow-hidden flex flex-col md:flex-row md:h-[580px]">
        {/* ================= CỘT TRÁI (7/12): FORM ĐƯỢC BỌC TOÀN BỘ ĐỂ ANTIBUG SUBMIT ================= */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 p-6 flex flex-col justify-between overflow-y-auto"
        >
          <div className="space-y-4">
            <DialogHeader className="select-none">
              <DialogTitle className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Fingerprint
                  size={16}
                  className="text-indigo-600 stroke-[2.5]"
                />
                Đăng ký tờ khai nhân khẩu cư trú mới
              </DialogTitle>
              <DialogDescription className="text-[11px] text-slate-400 font-medium mt-0.5">
                Điền thông tin lý lịch cá nhân. Dữ liệu sẽ tự động đồng bộ sang
                luồng khai báo Công an Phường.
              </DialogDescription>
            </DialogHeader>

            {/* LƯỚI FORM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 pt-1 text-xs">
              <FormGroup label="Họ và tên cư dân" error={errors.name?.message}>
                <div className="relative group">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    {...register("name")}
                    placeholder="Ví dụ: Trần Thế Anh"
                    className="h-8.5 pl-8 bg-slate-50/40 border-slate-200 rounded-lg font-semibold text-slate-800 focus-visible:bg-white transition-all shadow-sm"
                  />
                </div>
              </FormGroup>

              <FormGroup
                label="Số điện thoại liên lạc"
                error={errors.phone?.message}
              >
                <div className="relative group">
                  <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    {...register("phone")}
                    placeholder="09xx xxx xxx"
                    className="h-8.5 pl-8 bg-slate-50/40 border-slate-200 rounded-lg font-mono font-bold text-slate-800 focus-visible:bg-white transition-all shadow-sm"
                  />
                </div>
              </FormGroup>

              <FormGroup
                label="Thư điện tử (Email)"
                error={errors.email?.message}
              >
                <div className="relative group">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    {...register("email")}
                    placeholder="theanh@gmail.com"
                    className="h-8.5 pl-8 bg-slate-50/40 border-slate-200 rounded-lg font-medium text-slate-800 focus-visible:bg-white transition-all shadow-sm"
                  />
                </div>
              </FormGroup>

              <FormGroup
                label="Số định danh gốc (CCCD)"
                error={errors.cccd?.message}
              >
                <div className="relative group">
                  <FileText className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    {...register("cccd")}
                    placeholder="Gõ 12 số căn cước..."
                    className="h-8.5 pl-8 bg-slate-50/40 border-slate-200 rounded-lg font-mono font-bold text-slate-800 focus-visible:bg-white transition-all shadow-sm"
                  />
                </div>
              </FormGroup>

              <FormGroup
                label="Ngày tháng năm sinh"
                error={errors.birthday?.message}
              >
                <Input
                  type="date"
                  {...register("birthday")}
                  className="h-8.5 bg-slate-50/40 border-slate-200 focus-visible:border-slate-400 rounded-lg font-medium text-slate-700 shadow-sm"
                />
              </FormGroup>

              <FormGroup label="Giới tính trắc học">
                <Select
                  value={watchedValues.gender}
                  onValueChange={(val) => setValue("gender", val)}
                >
                  <SelectTrigger className="h-8.5 border-slate-200 bg-slate-50/40 rounded-lg text-xs font-semibold px-2.5 shadow-sm focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="p-1 rounded-lg border-slate-200">
                    <SelectItem value="Nam" className="text-xs">
                      Nam giới
                    </SelectItem>
                    <SelectItem value="Nữ" className="text-xs">
                      Nữ giới
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>

              <FormGroup
                label="Nguyên quán đăng ký gốc"
                error={errors.hometown?.message}
              >
                <div className="relative group">
                  <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    {...register("hometown")}
                    placeholder="Ví dụ: Kim Động, Hưng Yên"
                    className="h-8.5 pl-8 bg-slate-50/40 border-slate-200 rounded-lg font-medium text-slate-800 focus-visible:bg-white transition-all shadow-sm"
                  />
                </div>
              </FormGroup>

              <FormGroup
                label="Học tập / Nghề nghiệp"
                error={errors.occupation?.message}
              >
                <div className="relative group">
                  <Briefcase className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    {...register("occupation")}
                    placeholder="Ví dụ: Sinh viên"
                    className="h-8.5 pl-8 bg-slate-50/40 border-slate-200 rounded-lg font-medium text-slate-800 focus-visible:bg-white transition-all shadow-sm"
                  />
                </div>
              </FormGroup>

              <FormGroup label="Vai trò nhãn lưu trú">
                <Select
                  value={watchedValues.role}
                  onValueChange={(val) => setValue("role", val)}
                >
                  <SelectTrigger className="h-8.5 border-slate-200 bg-slate-50/40 rounded-lg text-xs font-semibold px-2.5 shadow-sm focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="p-1 rounded-lg border-slate-200">
                    <SelectItem
                      value="representative"
                      className="text-xs font-semibold text-indigo-600"
                    >
                      Đại diện ký Hợp đồng
                    </SelectItem>
                    <SelectItem value="member" className="text-xs">
                      Thành viên lưu trú cùng
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>

              <FormGroup label="Biển số xe máy đăng ký gửi hầm">
                <div className="relative group">
                  <Bike className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    {...register("licensePlate")}
                    placeholder="Ví dụ: 29X1-888.88"
                    className="h-8.5 pl-8 bg-slate-50/40 border-slate-200 rounded-lg font-mono uppercase font-bold text-slate-800 focus-visible:bg-white transition-all shadow-sm"
                  />
                </div>
              </FormGroup>
            </div>
          </div>

          {/* THANH ĐÁY ĐIỀU HƯỚNG NẰM TRONG FORM CHUẨN */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 select-none mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="h-8.5 text-xs text-slate-400 hover:text-slate-700 font-semibold rounded-lg cursor-pointer"
            >
              Hủy bỏ tờ khai
            </Button>
            <Button
              type="submit"
              className="h-8.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-sm cursor-pointer active:scale-[0.99] uppercase tracking-wider"
            >
              Duyệt nhập khẩu
            </Button>
          </div>
        </form>

        {/* ================= CỘT PHẢI (5/12): LIVE PREVIEW VẪN GIỮ NGUYÊN SANG TRỌNG ================= */}
        <div className="w-full md:w-80 bg-slate-50/60 p-5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 select-none">
          <div className="space-y-4 flex-1 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
              <Sparkles size={11} className="text-indigo-500" /> Phôi chứng từ
              số hóa
            </span>

            <div className="bg-white p-4 shadow-sm rounded-xl border border-slate-200/60 relative overflow-hidden flex-1 flex flex-col justify-between space-y-4">
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900" />

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">
                  Hồ sơ nhân khẩu trắc học
                </span>
                <p className="text-sm font-black text-slate-900 tracking-tight truncate leading-tight">
                  {watchedValues.name || (
                    <span className="text-slate-300 italic font-medium">
                      Chờ nhập họ tên...
                    </span>
                  )}
                </p>
                {watchedValues.phone && (
                  <span className="text-[10px] font-mono text-slate-400 block font-semibold">
                    SĐT: {watchedValues.phone}
                  </span>
                )}
              </div>

              <div className="border border-slate-100 bg-slate-50/40 p-2.5 rounded-lg space-y-2 text-[11px] font-medium text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Số định danh:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {watchedValues.cccd || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ngày sinh / Hệ:</span>
                  <span className="text-slate-700 font-sans">
                    {watchedValues.birthday || "—"} • {watchedValues.gender}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nghề nghiệp:</span>
                  <span className="text-slate-700 truncate max-w-[120px] font-sans">
                    {watchedValues.occupation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Xếp loại nhãn:</span>
                  <Badge
                    variant="outline"
                    className={`border-none text-[8px] font-bold rounded px-1.5 h-4 flex items-center ${watchedValues.role === "representative" ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-500"}`}
                  >
                    {watchedValues.role === "representative"
                      ? "Chủ hộ ký HĐ"
                      : "Thành viên ở ghép"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">
                  Hồ sơ đính kèm Công an phường
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleImageUpload("front")}
                    className={`h-11 border rounded-lg flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all bg-slate-50/10 border-dashed ${cccdFrontImage ? "border-emerald-200 bg-emerald-50/20 text-emerald-700" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    <UploadCloud
                      size={12}
                      className={
                        cccdFrontImage ? "text-emerald-500" : "text-slate-400"
                      }
                    />
                    <span className="text-[8px] font-bold">
                      {cccdFrontImage ? "Mặt trước: Ok" : "Ảnh Mặt Trước"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleImageUpload("back")}
                    className={`h-11 border rounded-lg flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all bg-slate-50/10 border-dashed ${cccdBackImage ? "border-emerald-200 bg-emerald-50/20 text-emerald-700" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    <UploadCloud
                      size={12}
                      className={
                        cccdBackImage ? "text-emerald-500" : "text-slate-400"
                      }
                    />
                    <span className="text-[8px] font-bold">
                      {cccdBackImage ? "Mặt sau: Ok" : "Ảnh Mặt Sau"}
                    </span>
                  </button>
                </div>
              </div>

              {watchedValues.licensePlate && (
                <div className="flex items-center gap-1.5 p-2 bg-slate-900 text-white rounded-lg select-none text-[10px] font-sans">
                  <Calendar
                    size={11}
                    className="text-indigo-400 animate-pulse"
                  />
                  <span className="truncate">
                    IoT kích hoạt gửi hầm:{" "}
                    <strong className="font-mono text-indigo-300">
                      {watchedValues.licensePlate}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FormGroup({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1 w-full">
      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wide select-none">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[10px] text-rose-600 font-semibold flex items-center gap-1 mt-0.5 animate-in fade-in duration-150">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
