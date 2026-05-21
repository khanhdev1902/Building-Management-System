/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, CheckCircle2, X } from "lucide-react";
import Link from "next/link";

// Import các phân rã mô-đun con dẹt phẳng
import { ContractStepper } from "./components/ContractStepper";
import { StepTenantForm } from "./components/StepTenantForm";
import { StepFinanceForm } from "./components/StepFinanceForm";
import { StepServicesForm } from "./components/StepServicesForm";
import { ContractLivePreview } from "./components/ContractLivePreview";
import { Button } from "@/shared/components/ui/button";

const contractFormSchema = z.object({
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
      cccd: z.string().optional(),
      licensePlate: z.string().optional(),
    }),
  ),
  services: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      price: z.number(),
      unit: z.string(),
    }),
  ),
});

type ContractFormValues = z.infer<typeof contractFormSchema>;

export default function CreateContract() {
  const [step, setStep] = useState(1);

  const methods = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    mode: "onChange",
    defaultValues: {
      tenantName: "",
      phone: "",
      email: "",
      cccd: "",
      birthday: "",
      gender: "Nam",
      hometown: "",
      occupation: "Sinh viên",
      roomNumber: "101",
      rentPrice: 6500000,
      deposit: 13000000,
      duration: 12,
      paymentCycle: "1",
      startDate: "2026-05-18",
      electricStart: 0,
      waterStart: 0,
      occupants: [],
      services: [
        { id: 1, name: "Điện tiêu thụ", price: 3500, unit: "kWh" },
        { id: 2, name: "Nước sinh hoạt", price: 30000, unit: "m³" },
        { id: 3, name: "Phí dịch vụ & Quản lý", price: 150000, unit: "phòng" },
      ],
    },
  });

  const { handleSubmit, trigger } = methods;

  const handleNextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1)
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
    else if (step === 2)
      fieldsToValidate = [
        "roomNumber",
        "rentPrice",
        "deposit",
        "duration",
        "startDate",
        "electricStart",
        "waterStart",
      ];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) setStep((prev) => prev + 1);
  };

  const onSubmit = (data: ContractFormValues) => {
    console.log("Phát hành dữ liệu hợp đồng Danjin:", data);
    // alert("✓ Phát hành hợp đồng số hóa thành công!");
  };

  return (
    // Bọc toàn bộ ngữ cảnh Form Provider để các con lấy dữ liệu qua useFormContext()
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-slate-200/80 bg-white rounded-xl overflow-hidden shadow-sm min-h-175 relative antialiased font-sans"
      >
        <Link
          href="/admin/contracts"
          className="absolute right-5 top-4 z-50 flex items-center gap-1 text-slate-400 hover:text-rose-600 text-xs font-semibold bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md shadow-3xs"
        >
          <span>Hủy bỏ</span> <X size={12} />
        </Link>

        {/* CỘT TRÁI (7 PHẦN): INPUT WORKSPACE */}
        <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between border-r border-slate-100 bg-white">
          <div className="space-y-6">
            <ContractStepper currentStep={step} />

            {/* Render động các step form con */}
            {step === 1 && <StepTenantForm />}
            {step === 2 && <StepFinanceForm />}
            {step === 3 && <StepServicesForm />}
          </div>

          {/* Cụm điều phối nút ở chân trang */}
          <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-6 shrink-0 select-none">
            <Button
              type="button"
              variant="ghost"
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
              className="h-8.5 px-3 text-xs font-semibold text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5 stroke-[2.5]" /> Quay lại
              bước trước
            </Button>

            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNextStep}
                className="h-8.5 px-4.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-3xs flex items-center gap-1 cursor-pointer"
              >
                <span>Tiếp tục</span>
              </Button>
            ) : (
              <Button
                type="submit"
                className="h-8.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-3xs flex items-center gap-1 cursor-pointer uppercase tracking-wide text-[11px]"
              >
                <CheckCircle2 size={13} /> Đăng ký hợp đồng
              </Button>
            )}
          </div>
        </div>

        {/* CỘT PHẢI (5 PHẦN): LIVE PREVIEW CHỨNG TỪ */}
        <ContractLivePreview />
      </form>
    </FormProvider>
  );
}
