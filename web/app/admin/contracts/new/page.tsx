/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, CheckCircle2, X, Loader2 } from "lucide-react"; // Bổ sung Loader2 chuyên nghiệp
import Link from "next/link";
import { useRouter } from "next/navigation"; // Hook điều hướng của Next.js
import { toast } from "sonner"; // Toast thông báo xịn mịn

import { ContractStepper } from "./components/ContractStepper";
import { StepTenantForm } from "./components/StepTenantForm";
import { StepFinanceForm } from "./components/StepFinanceForm";
import { StepServicesForm } from "./components/StepServicesForm";
import { ContractLivePreview } from "./components/ContractLivePreview";
import { Button } from "@/shared/components/ui/button";
import { contractApi } from "./apis/contracts.api";

const contractFormSchema = z.object({
  tenantId: z.string(),
  tenantName: z.string().min(2, "Họ và tên bắt buộc nhập từ 2 ký tự"),
  phone: z
    .string()
    .regex(
      /^(03|05|07|08|09)\d{8}$/,
      "Số điện thoại không đúng định dạng Việt Nam",
    ),
  email: z.string().email("Địa chỉ Email không hợp lệ"),
  cccd: z.string().length(12, "Số định danh căn cước công dân phải đúng 12 số"),
  birthday: z.string().min(1, "Vui lòng chọn ngày sinh"),
  gender: z.string().min(1, "Vui lòng chọn giới tính"),
  hometown: z.string().min(3, "Nguyên quán đăng ký gốc bắt buộc nhập"),
  occupation: z.string().min(2, "Vui lòng nhập nghề nghiệp hiện tại"),
  roomNumber: z.string().min(1, "Vui lòng nhập số phòng bàn giao"),
  roomId: z.string(),
  rentPrice: z.number().min(500000, "Giá thuê căn hộ tối thiểu từ 500k"),
  deposit: z.number().min(500000, "Quỹ tiền đặt cọc tối thiểu từ 500k"),
  duration: z.number().min(1, "Thời hạn tối thiểu là 1 tháng"),
  paymentCycle: z.string(),
  startDate: z.string().min(1, "Vui lòng chọn ngày kích hoạt hợp đồng"),
  electricStart: z.number().min(0, "Chỉ số điện không được âm"),
  waterStart: z.number().min(0, "Chỉ số nước không được âm"),

  occupants: z.array(
    z.object({
      name: z.string().min(2, "Họ tên thành viên không được trống"),
      phone: z
        .string()
        .regex(/^(03|05|07|08|09)\d{8}$/, "Số điện thoại không đúng định dạng")
        .optional()
        .or(z.literal("")),
      cccd: z
        .string()
        .length(12, "CCCD phải đúng 12 chữ số")
        .optional()
        .or(z.literal("")),
      birthday: z.string().min(1, "Vui lòng chọn ngày sinh"),
      gender: z.string().min(1, "Vui lòng chọn giới tính"),
      occupation: z.string().min(2, "Vui lòng nhập nghề nghiệp"),
      licensePlate: z.string().optional(),
    }),
  ),

  tenantVehicles: z.array(
    z.object({
      type: z.string(),
      licensePlate: z.string().min(4, "Biển số xe không hợp lệ"),
    }),
  ),
  services: z.array(
    z.object({
      name: z.string(),
      price: z.number(),
      unit: z.string(),
    }),
  ),
});

type ContractFormValues = z.infer<typeof contractFormSchema>;

export default function CreateContract() {
  const [step, setStep] = useState(1);
  const [isCallApi, setIsCallApi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // State quản lý trạng thái đang xử lý API
  const router = useRouter();

  const methods = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    mode: "onChange",
    defaultValues: {
      tenantId:"",
      tenantName: "",
      phone: "",
      email: "",
      cccd: "",
      birthday: "",
      gender: "Nam",
      hometown: "",
      occupation: "",
      roomId: "",
      roomNumber: "",
      rentPrice: 0,
      deposit: 0,
      duration: 12,
      paymentCycle: "1",
      startDate: "",
      electricStart: 0,
      waterStart: 0,
      occupants: [],
      tenantVehicles: [],
      services: [],
    },
  });

  const {
    handleSubmit,
    trigger,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors },
  } = methods;

  const handleNextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) {
      fieldsToValidate = [
        "tenantName",
        "phone",
        "email",
        "cccd",
        "birthday",
        "gender",
        "hometown",
        "occupation",
      ];
    } else if (step === 2) {
      fieldsToValidate = [
        "roomNumber",
        "rentPrice",
        "deposit",
        "duration",
        "startDate",
        "electricStart",
        "waterStart",
      ];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) setStep((prev) => prev + 1);
  };

  // LUỒNG XỬ LÝ SUBMIT ĐƯỢC CHUYỂN SANG ASYNC CHUẨN KIẾM TOÁN BẢO MẬT
  const onSubmit = async (data: ContractFormValues) => {
    if (!isCallApi) return;
    setIsSubmitting(true);
    try {
      const response = await contractApi.createContract(data);
      console.log("Phản hồi tạo hợp đồng:", response);

      // Thông báo UI sang trọng dạng Toast thay vì alert
      toast.success(
        `✓ Phát hành thành công hợp đồng phòng ${data.roomNumber}!`,
      );

      // Trả admin về trang danh sách hợp đồng đúng yêu cầu của cưng
      router.push("/admin/contracts");
    } catch (error: any) {
      console.error("Lỗi khi call API tạo hợp đồng:", error);
      toast.error(
        error?.response?.data?.message ||
          "Lỗi khởi tạo hợp đồng, vui lòng thử lại.",
      );
    } finally {
      setIsCallApi(false);
      setIsSubmitting(false);
    }
  };

  const onCancel = (e: React.MouseEvent) => {
    if (isSubmitting) {
      e.preventDefault(); // Chặn không cho thoát nếu đang gọi API giữa chừng
      return;
    }
    const confirmCancel = window.confirm(
      "Bạn có chắc chắn muốn hủy đăng ký hợp đồng?",
    );
    if (!confirmCancel) e.preventDefault();
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-slate-200/80 bg-white rounded-xl overflow-hidden shadow-sm min-h-175 relative antialiased font-sans"
      >
        {/* Nút hủy bỏ đồng bộ trạng thái disabled */}
        <Link
          href="/admin/contracts"
          onClick={onCancel}
          className={`absolute right-5 top-4 z-50 flex items-center gap-1 text-slate-400 hover:text-rose-600 text-xs font-semibold bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md shadow-3xs transition-all ${isSubmitting ? "pointer-events-none opacity-40" : ""}`}
        >
          <span>Hủy bỏ</span> <X size={12} />
        </Link>

        <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between border-r border-slate-100 bg-white">
          <div className="space-y-6">
            <ContractStepper currentStep={step} />
            {step === 1 && <StepTenantForm />}
            {step === 2 && <StepFinanceForm />}
            {step === 3 && <StepServicesForm />}
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-6 shrink-0 select-none">
            {/* Nút quay lại bước trước */}
            <Button
              type="button"
              variant="ghost"
              disabled={step === 1 || isSubmitting}
              onClick={() => setStep(step - 1)}
              className="h-8.5 px-3 text-xs font-semibold text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5 stroke-[2.5]" /> Quay lại
              bước trước
            </Button>

            {step < 3 ? (
              <Button
                type="button"
                disabled={step === 3 || isSubmitting}
                onClick={handleNextStep}
                className="h-8.5 px-4.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-3xs flex items-center gap-1 cursor-pointer"
              >
                <span>Tiếp tục</span>
              </Button>
            ) : (
              /* NÚT SUBMIT CHUYỂN ĐỔI BIẾN HÌNH LOADING TRỰC QUAN */
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={() => {
                  setIsCallApi(true);
                }}
                className={`h-8.5 px-5 text-white font-bold rounded-lg shadow-3xs flex items-center gap-1.5 cursor-pointer uppercase tracking-wide text-[11px] transition-all duration-200 ${isSubmitting ? "bg-indigo-400/80 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Đang khởi tạo...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={13} />
                    <span>Đăng ký hợp đồng</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <ContractLivePreview />
      </form>
    </FormProvider>
  );
}
