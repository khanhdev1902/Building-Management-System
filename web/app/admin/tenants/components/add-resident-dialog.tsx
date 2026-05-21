/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
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
  Plus,
  Trash2,
  Sparkles,
  Loader2, // Import thêm icon loading xoay tròn cao cấp
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
import { tenantApi } from "../apis/tenant.api";
import { VehicleTypeEnum } from "../types/tenant.type";

// 1. SCHEMA VALIDATION ZOD ĐA TẦNG ĐỊA CHỈ & ĐA PHƯƠNG TIỆN
const residentSchema = z.object({
  name: z.string().min(2, "Họ và tên cư dân bắt buộc nhập từ 2 ký tự trở lên"),
  phone: z
    .string()
    .regex(
      /^(03|05|07|08|09)\d{8}$/,
      "Số điện thoại không đúng định dạng Việt Nam",
    ),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  cccd: z.string().length(12, "Số định danh CCCD phải đúng 12 chữ số"),
  birthday: z
    .string()
    .min(1, "Vui lòng chọn ngày sinh")
    .refine(
      (dateString) => {
        const birthday = new Date(dateString);
        const today = new Date();

        let age = today.getFullYear() - birthday.getFullYear();
        const monthDifference = today.getMonth() - birthday.getMonth();

        if (
          monthDifference < 0 ||
          (monthDifference === 0 && today.getDate() < birthday.getDate())
        ) {
          age--;
        }

        return age >= 16;
      },
      {
        message: "Cư dân đăng ký lưu trú phải từ 16 tuổi trở lên",
      },
    ),
  gender: z.string().min(1, "Vui lòng chọn giới tính"),
  occupation: z.string().min(2, "Vui lòng nhập công việc hiện tại"),
  role: z.string(),

  province: z.string().min(1, "Vui lòng chọn Tỉnh/Thành phố"),
  district: z.string().min(1, "Vui lòng chọn Quận/Huyện"),
  ward: z.string().min(1, "Vui lòng chọn Phường/Xã"),
  addressDetail: z.string().min(2, "Vui lòng nhập số nhà, thôn/xóm cụ thể"),

  vehicles: z.array(
    z.object({
      type: z.enum([
        VehicleTypeEnum.MOTORBIKE,
        VehicleTypeEnum.ELECTRIC_BIKE,
        VehicleTypeEnum.CAR,
        VehicleTypeEnum.OTHER,
      ]),
      licensePlate: z.string().min(4, "Biển số xe không hợp lệ"),
    }),
  ),
});

type ResidentFormValues = z.infer<typeof residentSchema>;

export function AddResidentDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [cccdFrontImage, setCccdFrontImage] = useState<string | null>(null);
  const [cccdBackImage, setCccdBackImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm state tracking luồng gửi API hỏa tốc

  const methods = useForm<ResidentFormValues>({
    resolver: zodResolver(residentSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      cccd: "",
      birthday: "",
      gender: "Nam",
      occupation: "Sinh viên",
      role: "member",
      province: "",
      district: "",
      ward: "",
      addressDetail: "",
      vehicles: [],
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

  const {
    fields: vehicleFields,
    append: appendVehicle,
    remove: removeVehicle,
  } = useFieldArray({
    control,
    name: "vehicles",
  });

  const watchedValues = watch();

  const handleImageUpload = (type: "front" | "back") => {
    if (type === "front") setCccdFrontImage("cccd_front_mockup.jpg");
    else setCccdBackImage("cccd_back_mockup.jpg");
    toast.success(
      `Đã số hóa thành công mặt ${type === "front" ? "trước" : "sau"} CCCD!`,
    );
  };

  const onSubmit = async (data: ResidentFormValues) => {
    setIsSubmitting(true); // Bật hiệu ứng loading khi bắt đầu submit
    console.log("Đồng bộ nhân khẩu và bãi xe Danjin BMS:", {
      ...data,
      cccdFrontImage,
      cccdBackImage,
    });
    try {
      const newTenant = await tenantApi.createTenant(data);
      console.log("Kết quả phản hồi API khi tạo cư dân mới:", newTenant);
      toast.success(`✓ Khai báo tạm trú thành công cư dân ${data.name}!`);

      reset();
      setCccdFrontImage(null);
      setCccdBackImage(null);
      setIsOpen(false);
    } catch (error: any) {
      console.error("Lỗi khi đồng bộ dữ liệu nhân khẩu mới:", error);
      toast.error(
        error.message ??
          "Đã có lỗi xảy ra khi thêm cư dân mới, vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false); // Tắt hiệu ứng loading kể cả khi thành công hay thất bại
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-8 text-xs font-semibold bg-slate-950 hover:bg-slate-900 text-white rounded-lg px-3 shadow-2xs gap-1.5 cursor-pointer transition-colors"
        >
          <UserPlus size={13} className="stroke-[2.5]" />
          <span>Thêm nhân khẩu lưu trú</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-5xl bg-white rounded-xl border border-slate-200 p-0 shadow-xl font-sans overflow-hidden flex flex-col md:flex-row md:h-147.5">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            id="add-resident-form"
            className="flex-1 p-6 flex flex-col justify-between overflow-y-auto"
          >
            <div className="space-y-4">
              <DialogHeader className="select-none">
                <DialogTitle className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <UserPlus
                    size={15}
                    className="text-indigo-600 stroke-[2.5]"
                  />{" "}
                  Đăng ký tờ khai nhân khẩu cư trú mới
                </DialogTitle>
                <DialogDescription className="text-[11px] text-slate-400 font-medium mt-0.5">
                  Dữ liệu phân rã địa chỉ hành chính và cấu hình đa phương tiện
                  tự động liên thông với cổng bảo mật tầng hầm.
                </DialogDescription>
              </DialogHeader>

              {/* KHAY 1: THÔNG TIN LÝ LỊCH NHÂN TRẮC HỌC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 pt-1 text-xs">
                <FormGroup
                  label="Họ và tên cư dân"
                  error={errors.name?.message}
                >
                  <div className="relative group">
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      {...register("name")}
                      disabled={isSubmitting}
                      placeholder="Ví dụ: Trần Thế Anh"
                      className="h-8.5 pl-8 bg-slate-50/40 border-slate-200 rounded-lg text-slate-800 focus-visible:bg-white transition-all shadow-2xs"
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
                      disabled={isSubmitting}
                      placeholder="09xx xxx xxx"
                      className="h-8.5 pl-8 bg-slate-50/40 border-slate-200 rounded-lg text-slate-800 focus-visible:bg-white transition-all shadow-2xs"
                    />
                  </div>
                </FormGroup>

                <FormGroup label="Địa chỉ Email" error={errors.email?.message}>
                  <div className="relative group">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      {...register("email")}
                      disabled={isSubmitting}
                      placeholder="theanh@gmail.com"
                      className="h-8.5 pl-8 bg-slate-50/40 border-slate-200 rounded-lg text-slate-800 focus-visible:bg-white transition-all shadow-2xs"
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
                      disabled={isSubmitting}
                      placeholder="Gõ 12 số căn cước..."
                      className="h-8.5 pl-8 bg-slate-50/40 border-slate-200 rounded-lg text-slate-800 focus-visible:bg-white transition-all shadow-2xs"
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
                    disabled={isSubmitting}
                    className="h-8.5 bg-slate-50/40 border-slate-200 focus-visible:border-slate-400 rounded-lg text-slate-700 shadow-2xs"
                  />
                </FormGroup>

                <FormGroup label="Giới tính trắc học">
                  <Select
                    disabled={isSubmitting}
                    value={watchedValues.gender}
                    onValueChange={(val) => setValue("gender", val)}
                  >
                    <SelectTrigger className="h-8.5 border-slate-200 bg-slate-50/40 rounded-lg text-xs px-2.5 focus:ring-0 shadow-2xs">
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
                  label="Học tập / Nghề nghiệp"
                  error={errors.occupation?.message}
                >
                  <div className="relative group">
                    <Briefcase className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      {...register("occupation")}
                      disabled={isSubmitting}
                      placeholder="Ví dụ: Sinh viên"
                      className="h-8.5 pl-8 bg-slate-50/40 border-slate-200 rounded-lg text-slate-800 focus-visible:bg-white transition-all shadow-2xs"
                    />
                  </div>
                </FormGroup>

                <FormGroup label="Vai trò nhãn lưu trú">
                  <Select
                    disabled={isSubmitting}
                    value={watchedValues.role}
                    onValueChange={(val) => setValue("role", val)}
                  >
                    <SelectTrigger className="h-8.5 border-slate-200 bg-slate-50/40 rounded-lg text-xs px-2.5 focus:ring-0 shadow-2xs">
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
              </div>

              {/* KHAY 2: PHÂN RÃ ĐỊA CHỈ NGUYÊN QUÁN 3 TẦNG PHÁP LÝ */}
              <div className="space-y-2.5 pt-1.5 select-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin size={12} /> Quê quán
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <FormGroup
                    label="Tỉnh / Thành phố"
                    error={errors.province?.message}
                  >
                    <Input
                      {...register("province")}
                      disabled={isSubmitting}
                      placeholder="Ví dụ: Hà Nội"
                      className="h-8.5 bg-slate-50/40 border-slate-200 rounded-lg text-xs"
                    />
                  </FormGroup>
                  <FormGroup
                    label="Quận / Huyện"
                    error={errors.district?.message}
                  >
                    <Input
                      {...register("district")}
                      disabled={isSubmitting}
                      placeholder="Ví dụ: Cầu Giấy"
                      className="h-8.5 bg-slate-50/40 border-slate-200 rounded-lg text-xs"
                    />
                  </FormGroup>
                  <FormGroup label="Phường / Xã" error={errors.ward?.message}>
                    <Input
                      {...register("ward")}
                      disabled={isSubmitting}
                      placeholder="Ví dụ: Dịch Vọng Hậu"
                      className="h-8.5 bg-slate-50/40 border-slate-200 rounded-lg text-xs"
                    />
                  </FormGroup>
                  <div className="sm:col-span-3">
                    <FormGroup
                      label="Số nhà, đường, thôn/xóm chi tiết"
                      error={errors.addressDetail?.message}
                    >
                      <Input
                        {...register("addressDetail")}
                        disabled={isSubmitting}
                        placeholder="Ví dụ: Số 45, Ngõ 102 Trần Tử Bình"
                        className="h-8.5 bg-slate-50/40 border-slate-200 rounded-lg text-xs text-slate-800 focus-visible:bg-white transition-all shadow-2xs"
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>

              {/* KHAY 3: MẢNG ĐỘNG ĐĂNG KÝ ĐA PHƯƠNG TIỆN GỬI XE HẦM IoT */}
              <div className="space-y-2 pt-1 select-none">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Bike size={12} /> Danh mục phương tiện đăng ký gửi hầm
                  </span>
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      appendVehicle({
                        type: VehicleTypeEnum.MOTORBIKE,
                        licensePlate: "",
                      })
                    }
                    variant="outline"
                    size="sm"
                    className="h-5.5 text-[9px] font-bold border-slate-200 text-slate-600 hover:bg-slate-50 rounded"
                  >
                    <Plus size={10} className="mr-0.5 stroke-[2.5]" /> Bổ sung
                    xe
                  </Button>
                </div>

                <div className="space-y-2 max-h-26.25 overflow-y-auto pr-0.5">
                  {vehicleFields.length === 0 ? (
                    <p className="text-[11px] text-slate-400 font-medium italic p-2 text-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200/60">
                      Cư dân không đăng ký sử dụng phương tiện giữ xe tại tòa
                      nhà.
                    </p>
                  ) : (
                    vehicleFields.map((field, idx) => (
                      <div
                        key={field.id}
                        className="flex gap-2 p-1.5 border border-slate-200/60 rounded-lg bg-white shadow-3xs items-center animate-in fade-in duration-150"
                      >
                        <Select
                          disabled={isSubmitting}
                          defaultValue={
                            watchedValues.vehicles?.[idx]?.type || "MOTORBIKE"
                          }
                          onValueChange={(val) =>
                            setValue(
                              `vehicles.${idx}.type`,
                              val as ResidentFormValues["vehicles"][number]["type"],
                            )
                          }
                        >
                          <SelectTrigger className="h-7 border-slate-200 bg-slate-50/40 rounded text-[11px] font-semibold px-2 w-28 focus:ring-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="p-1 rounded-md border-slate-200">
                            <SelectItem
                              value={VehicleTypeEnum.MOTORBIKE}
                              className="text-xs"
                            >
                              Xe máy
                            </SelectItem>
                            <SelectItem
                              value={VehicleTypeEnum.ELECTRIC_BIKE}
                              className="text-xs"
                            >
                              Xe đạp điện
                            </SelectItem>
                            <SelectItem
                              value={VehicleTypeEnum.CAR}
                              className="text-xs"
                            >
                              Ô tô
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="space-y-1 flex-1">
                          <Input
                            {...register(
                              `vehicles.${idx}.licensePlate` as const,
                            )}
                            disabled={isSubmitting}
                            placeholder="Ví dụ: 29X1-888.88"
                            className="h-7 rounded border-slate-200 uppercase text-slate-800"
                          />
                          {errors.vehicles?.[idx]?.licensePlate && (
                            <p className="text-[9px] text-rose-600 font-bold">
                              {
                                (errors.vehicles as any)[idx]?.licensePlate
                                  ?.message
                              }
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => removeVehicle(idx)}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-300 hover:text-rose-600 rounded shrink-0"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* THANH ĐÁY TÁC VỤ ĐIỀU PHỐI TRÊN KHAY TRÁI */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 select-none mt-4">
              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={() => setIsOpen(false)}
                className="h-8.5 text-xs text-slate-400 hover:text-slate-700 font-semibold rounded-lg cursor-pointer"
              >
                Hủy bỏ tờ khai
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-8.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-2xs cursor-pointer active:scale-[0.99] uppercase tracking-wider flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang đồng bộ...</span>
                  </>
                ) : (
                  <span>Duyệt nhập khẩu</span>
                )}
              </Button>
            </div>
          </form>
        </FormProvider>

        {/* ================= CỘT PHẢI (5/12): LIVE PREVIEW CHỨNG TỪ SỐ HÓA ================= */}
        <div className="w-full md:w-80 bg-slate-50/60 p-5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 select-none shrink-0">
          <div className="space-y-4 flex-1 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
              <Sparkles size={11} className="text-indigo-500" /> Phôi chứng từ
              đối soát
            </span>

            <div className="bg-white p-4 shadow-sm rounded-xl border border-slate-200/60 relative overflow-hidden flex-1 flex flex-col justify-between space-y-4">
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900" />

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">
                  Cư dân lưu trú được đăng ký
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

              <div className="border border-slate-100 bg-slate-50/40 p-2.5 rounded-lg space-y-2 text-[11px] font-medium text-slate-600 flex-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Số CCCD:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {watchedValues.cccd || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hệ / Giới tính:</span>
                  <span className="text-slate-700 font-sans">
                    {watchedValues.birthday
                      ? watchedValues.birthday.split("-").reverse().join("/")
                      : "—"}{" "}
                    • {watchedValues.gender}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 pt-1 border-t border-slate-100/60">
                  <span className="text-slate-400">Nguyên quán lưu gốc:</span>
                  <p className="text-slate-700 font-sans leading-normal text-[10px] font-semibold mt-0.5 whitespace-pre-line">
                    {watchedValues.province
                      ? `${watchedValues.addressDetail}, ${watchedValues.ward}, ${watchedValues.district}, ${watchedValues.province}`
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">
                  Luồng phương tiện IoT hầm (
                  {watchedValues.vehicles?.length || 0})
                </span>
                <div className="max-h-20 overflow-y-auto space-y-1 pr-0.5">
                  {(watchedValues.vehicles || []).map(
                    (v, i) =>
                      v.licensePlate && (
                        <div
                          key={i}
                          className="flex items-center justify-between text-[10px] bg-slate-900 text-white px-2 py-1 rounded font-mono uppercase font-bold"
                        >
                          <span className="text-indigo-300 text-[9px] font-sans">
                            {v.type}
                          </span>
                          <span>{v.licensePlate}</span>
                        </div>
                      ),
                  )}
                </div>
              </div>

              <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleImageUpload("front")}
                    className={`h-10 border rounded-lg flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all bg-slate-50/10 border-dashed ${cccdFrontImage ? "border-emerald-200 bg-emerald-50/20 text-emerald-700" : "border-slate-200 hover:border-slate-300 disabled:opacity-50"}`}
                  >
                    <span className="text-[8px] font-bold">
                      {cccdFrontImage ? "✓ Mặt trước: OK" : "Ảnh Mặt Trước"}
                    </span>
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleImageUpload("back")}
                    className={`h-10 border rounded-lg flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all bg-slate-50/10 border-dashed ${cccdBackImage ? "border-emerald-200 bg-emerald-50/20 text-emerald-700" : "border-slate-200 hover:border-slate-300 disabled:opacity-50"}`}
                  >
                    <span className="text-[8px] font-bold">
                      {cccdBackImage ? "✓ Mặt sau: OK" : "Ảnh Mặt Sau"}
                    </span>
                  </button>
                </div>
              </div>
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
          {error}
        </p>
      )}
    </div>
  );
}
