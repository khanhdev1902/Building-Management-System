"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { FileText } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormGroup } from "./FormGroup"; // Gom chung helper báo lỗi

export function StepTenantForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const genderValue = watch("gender");

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-50 pb-1">
        <FileText size={14} className="text-slate-400" /> I. Hồ sơ nhân trắc học
        bên thuê căn hộ
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormGroup
          label="Họ và tên khách thuê đại diện"
          error={errors.tenantName?.message as string}
        >
          <Input
            {...register("tenantName")}
            placeholder="Ví dụ: Nguyễn Văn Khanh"
            className="h-8.5 text-xs bg-slate-50/40 border-slate-200 rounded-lg"
          />
        </FormGroup>

        <FormGroup
          label="Số điện thoại khẩn cấp"
          error={errors.phone?.message as string}
        >
          <Input
            {...register("phone")}
            placeholder="09xx xxx xxx"
            className="h-8.5 text-xs bg-slate-50/40 border-slate-200 rounded-lg"
          />
        </FormGroup>

        <FormGroup
          label="Địa chỉ thư điện tử (Email)"
          error={errors.email?.message as string}
        >
          <Input
            {...register("email")}
            placeholder="khanhnv@danjin.vn"
            className="h-8.5 text-xs bg-slate-50/40 border-slate-200 rounded-lg"
          />
        </FormGroup>

        <FormGroup
          label="Số định danh gốc (CCCD)"
          error={errors.cccd?.message as string}
        >
          <Input
            {...register("cccd")}
            placeholder="Số căn cước công dân 12 số..."
            className="h-8.5 text-xs bg-slate-50/40 border-slate-200 rounded-lg"
          />
        </FormGroup>

        <FormGroup
          label="Ngày tháng năm sinh"
          error={errors.birthday?.message as string}
        >
          <Input
            type="date"
            {...register("birthday")}
            className="h-8.5 text-xs bg-slate-50/40 border-slate-200 rounded-lg"
          />
        </FormGroup>

        <FormGroup label="Giới tính cư trú">
          <Select
            value={genderValue}
            onValueChange={(val) => setValue("gender", val)}
          >
            <SelectTrigger className="h-8.5 border-slate-200 bg-slate-50/40 rounded-lg text-xs font-semibold px-2.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="p-1 rounded-lg">
              <SelectItem value="Nam" className="text-xs">
                Nam
              </SelectItem>
              <SelectItem value="Nữ" className="text-xs">
                Nữ
              </SelectItem>
            </SelectContent>
          </Select>
        </FormGroup>

        <FormGroup
          label="Nguyên quán đăng ký khai sinh gốc"
          error={errors.hometown?.message as string}
        >
          <Input
            {...register("hometown")}
            placeholder="Ví dụ: Xuân Trường, Nam Định"
            className="h-8.5 text-xs bg-slate-50/40 border-slate-200 rounded-lg"
          />
        </FormGroup>

        <FormGroup
          label="Nghề nghiệp / Học tập hiện tại"
          error={errors.occupation?.message as string}
        >
          <Input
            {...register("occupation")}
            placeholder="Ví dụ: Sinh viên IT Thăng Long"
            className="h-8.5 text-xs bg-slate-50/40 border-slate-200 rounded-lg"
          />
        </FormGroup>
      </div>
    </div>
  );
}
