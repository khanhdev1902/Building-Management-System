"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormGroup } from "./FormGroup";

export function StepFinanceForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const paymentCycleValue = watch("paymentCycle");

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-50 pb-1">
        II. Khung tài khóa, cam kết thời hạn & Chỉ số công tơ nền
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormGroup
          label="Số phòng ký kết"
          error={errors.roomNumber?.message as string}
        >
          <Input
            {...register("roomNumber")}
            className="h-8.5 text-xs font-mono font-bold bg-slate-50/40 border-slate-200 rounded-lg"
          />
        </FormGroup>

        <FormGroup
          label="Giá thuê cứng / Tháng (VND)"
          error={errors.rentPrice?.message as string}
        >
          <Input
            type="number"
            {...register("rentPrice", { valueAsNumber: true })}
            className="h-8.5 text-xs font-mono font-bold bg-slate-50/40 border-slate-200 rounded-lg"
          />
        </FormGroup>

        <FormGroup
          label="Quỹ tiền đặt cọc giữ phòng (VND)"
          error={errors.deposit?.message as string}
        >
          <Input
            type="number"
            {...register("deposit", { valueAsNumber: true })}
            className="h-8.5 text-xs font-mono font-bold bg-slate-50/40 border-slate-200 rounded-lg text-indigo-600"
          />
        </FormGroup>

        <FormGroup
          label="Thời hạn cam kết ở (Tháng)"
          error={errors.duration?.message as string}
        >
          <Input
            type="number"
            {...register("duration", { valueAsNumber: true })}
            className="h-8.5 text-xs font-mono font-bold bg-slate-50/40 border-slate-200 rounded-lg"
          />
        </FormGroup>

        <FormGroup
          label="Ngày hợp đồng bắt đầu tính tiền"
          error={errors.startDate?.message as string}
        >
          <Input
            type="date"
            {...register("startDate")}
            className="h-8.5 text-xs bg-slate-50/40 border-slate-200 rounded-lg"
          />
        </FormGroup>

        <FormGroup label="Chu kỳ đóng tiền định kỳ">
          <Select
            value={paymentCycleValue}
            onValueChange={(val) => setValue("paymentCycle", val)}
          >
            <SelectTrigger className="h-8.5 border-slate-200 bg-slate-50/40 rounded-lg text-xs font-semibold px-2.5">
              <SelectValue placeholder="Chọn chu kỳ đóng tiền" />
            </SelectTrigger>
            <SelectContent className="p-1 rounded-lg">
              <SelectItem value="1" className="text-xs">
                Đóng tiền hàng tháng
              </SelectItem>
              <SelectItem value="3" className="text-xs">
                Đóng tiền 3 tháng / lần
              </SelectItem>
              <SelectItem value="6" className="text-xs">
                Đóng tiền 6 tháng / lần
              </SelectItem>
            </SelectContent>
          </Select>
        </FormGroup>

        <div className="sm:col-span-2 grid grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-100 rounded-xl select-none">
          <FormGroup
            label="Chỉ số ĐIỆN đầu kỳ chốt bàn giao"
            error={errors.electricStart?.message as string}
          >
            <Input
              type="number"
              {...register("electricStart", { valueAsNumber: true })}
              className="h-8 text-xs bg-white border-slate-200 rounded-md font-mono font-bold text-slate-800"
            />
          </FormGroup>
          <FormGroup
            label="Chỉ số NƯỚC đầu kỳ chốt bàn giao"
            error={errors.waterStart?.message as string}
          >
            <Input
              type="number"
              {...register("waterStart", { valueAsNumber: true })}
              className="h-8 text-xs bg-white border-slate-200 rounded-md font-mono font-bold text-slate-800"
            />
          </FormGroup>
        </div>
      </div>
    </div>
  );
}
