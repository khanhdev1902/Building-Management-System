/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export function StepServicesForm() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const watchedServices = watch("services");

  const {
    fields: occupantFields,
    append: appendOccupant,
    remove: removeOccupant,
  } = useFieldArray({
    control,
    name: "occupants",
  });

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control,
    name: "services",
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Thành viên ở ghép */}
      <div className="space-y-2 select-none">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Users size={13} className="text-slate-400" /> Hồ sơ nhân khẩu đi
            cùng phòng (Roommates)
          </h3>
          <Button
            type="button"
            onClick={() =>
              appendOccupant({ name: "", cccd: "", licensePlate: "" })
            }
            variant="outline"
            size="sm"
            className="h-6 text-[10px] font-semibold border-slate-200 rounded-md text-slate-600 hover:bg-slate-50"
          >
            <Plus size={11} className="mr-1 stroke-[2.5]" /> Thêm nhân khẩu
          </Button>
        </div>

        <div className="space-y-2 max-h-35 overflow-y-auto pr-0.5">
          {occupantFields.length === 0 ? (
            <p className="text-[11px] text-slate-400 font-medium italic p-2 text-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
              Không có nhân khẩu ở ghép đi cùng (Phòng đơn cá nhân).
            </p>
          ) : (
            occupantFields.map((field, idx) => (
              <div
                key={field.id}
                className="flex gap-2 p-2 border border-slate-200/60 rounded-xl bg-slate-50/30 items-center"
              >
                <div className="space-y-1 flex-1">
                  <Input
                    {...register(`occupants.${idx}.name` as const)}
                    placeholder="Họ và tên thành viên..."
                    className="h-7.5 text-xs rounded-md bg-white border-slate-200 font-semibold"
                  />
                  {(errors.occupants as any)?.[idx]?.name && (
                    <p className="text-[9px] text-rose-600 font-bold">
                      {(errors.occupants as any)[idx]?.name?.message}
                    </p>
                  )}
                </div>
                <Input
                  {...register(`occupants.${idx}.cccd` as const)}
                  placeholder="Số CMND/CCCD"
                  className="h-7.5 text-xs rounded-md bg-white border-slate-200 font-mono w-28"
                />
                <Input
                  {...register(`occupants.${idx}.licensePlate` as const)}
                  placeholder="Biển số xe máy"
                  className="h-7.5 text-xs rounded-md bg-white border-slate-200 font-mono uppercase w-24"
                />
                <Button
                  type="button"
                  onClick={() => removeOccupant(idx)}
                  variant="ghost"
                  size="icon"
                  className="h-7.5 w-7.5 text-slate-400 hover:text-rose-600 rounded-md shrink-0"
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Danh mục định mức cước */}
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
          <h3 className="text-xs font-bold text-slate-800">
            III. Danh mục dịch vụ & Định mức cước trích đóng
          </h3>
          <Button
            type="button"
            onClick={() =>
              appendService({
                id: Date.now(),
                name: "Khoản phí bổ sung",
                price: 0,
                unit: "tháng",
              })
            }
            variant="outline"
            size="sm"
            className="h-6 text-[10px] font-semibold border-slate-200 rounded-md text-slate-600 hover:bg-slate-50"
          >
            <Plus size={11} className="mr-1 stroke-[2.5]" /> Thêm khoản phí
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-1.5 max-h-35 overflow-y-auto pr-0.5 select-none">
          {serviceFields.map((field, idx) => (
            <div
              key={field.id}
              className="flex items-center gap-2 px-3 h-8.5 border border-dashed border-slate-200 rounded-lg bg-white"
            >
              <Input
                {...register(`services.${idx}.name` as const)}
                className="h-7 text-xs font-semibold w-28 border-none p-0 focus-visible:ring-0 text-slate-700"
              />
              <div className="flex-1" />
              <Input
                type="number"
                {...register(`services.${idx}.price` as const, {
                  valueAsNumber: true,
                })}
                className="h-7 text-xs w-20 rounded-md border-slate-200 font-mono text-right font-bold"
              />
              <span className="text-[10px] text-slate-400 font-medium w-12 font-mono">
                /{watchedServices?.[idx]?.unit || "u"}
              </span>
              <Button
                type="button"
                onClick={() => removeService(idx)}
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-300 hover:text-rose-600 rounded-md shrink-0"
              >
                <Trash2 size={12} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
