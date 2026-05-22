/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Users, Bike, User } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormGroup } from "./FormGroup";

export function StepServicesForm() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const watchedValues = watch();

  // 1. Quản lý mảng động nhân khẩu đi cùng phòng (Roommates)
  const {
    fields: occupantFields,
    append: appendOccupant,
    remove: removeOccupant,
  } = useFieldArray({
    control,
    name: "occupants",
  });

  // 2. Quản lý danh sách phương tiện xe cộ động của Chủ hộ đại diện
  const {
    fields: tenantVehicleFields,
    append: appendTenantVehicle,
    remove: removeTenantVehicle,
  } = useFieldArray({
    control,
    name: "tenantVehicles",
  });

  // 3. Quản lý danh mục định mức cước phí dịch vụ áp phòng
  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control,
    name: "services",
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200 overflow-y-auto max-h-120 pr-0.5 select-none font-sans">
      {/* ================= PHÂN KHU I: THÀNH VIÊN Ở GHÉP ĐI KÈM (ROOMMATES) ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Users size={13} className="text-indigo-600 stroke-[2.5]" /> I. Hồ
            sơ nhân khẩu đi cùng phòng (Roommates)
          </h3>
          <Button
            type="button"
            onClick={() =>
              appendOccupant({
                name: "",
                phone: "",
                cccd: "",
                birthday: "",
                gender: "Nam",
                occupation: "",
                licensePlate: "",
              })
            }
            variant="outline"
            size="sm"
            className="h-6 text-[10px] font-bold border-slate-200 text-slate-600 hover:bg-slate-50 shadow-3xs rounded-md cursor-pointer"
          >
            <Plus size={11} className="mr-0.5 stroke-[2.5]" /> Bổ sung thành
            viên
          </Button>
        </div>

        <div className="space-y-3.5 max-h-85 overflow-y-auto pr-0.5">
          {occupantFields.length === 0 ? (
            <p className="text-[11px] text-slate-400 font-medium italic p-3 text-center bg-slate-50/40 rounded-xl border border-dashed border-slate-200/60">
              Không có nhân khẩu ở ghép đi cùng (Hợp đồng phòng đơn cá nhân).
            </p>
          ) : (
            occupantFields.map((field, idx) => {
              const occupantErrors = (errors.occupants as any)?.[idx];

              return (
                <div
                  key={field.id}
                  className="group relative p-4 border border-slate-200/70 rounded-xl bg-slate-50/20 hover:border-slate-300 transition-all space-y-3 mr-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100/70 pb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <User size={11} /> Thành viên thứ {idx + 1}
                    </span>
                    <Button
                      type="button"
                      onClick={() => removeOccupant(idx)}
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-slate-300 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>

                  {/* LƯỚI FORM ĐỒNG BỘ 100% CẤU TRÚC FORMS GROUP */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[11px]">
                    <FormGroup
                      label="Họ và tên"
                      error={occupantErrors?.name?.message}
                    >
                      <Input
                        {...register(`occupants.${idx}.name` as const)}
                        placeholder="Nhập họ và tên..."
                        className="mt-1"
                      />
                    </FormGroup>

                    <FormGroup
                      label="Số điện thoại"
                      error={occupantErrors?.phone?.message}
                    >
                      <Input
                        {...register(`occupants.${idx}.phone` as const)}
                        placeholder="09xx xxx xxx"
                        className="mt-1"
                      />
                    </FormGroup>

                    <FormGroup
                      label="Số CCCD"
                      error={occupantErrors?.cccd?.message}
                    >
                      <Input
                        {...register(`occupants.${idx}.cccd` as const)}
                        placeholder="12 chữ số"
                        className="mt-1"
                      />
                    </FormGroup>

                    <FormGroup
                      label="Ngày sinh"
                      error={occupantErrors?.birthday?.message}
                    >
                      <Input
                        type="date"
                        {...register(`occupants.${idx}.birthday` as const)}
                        className="mt-1"
                      />
                    </FormGroup>

                    <FormGroup label="Giới tính">
                      <Select
                        defaultValue={
                          watchedValues.occupants?.[idx]?.gender || "Nam"
                        }
                        onValueChange={(val) =>
                          setValue(`occupants.${idx}.gender`, val)
                        }
                      >
                        <SelectTrigger className="h-7.5 border-slate-200 bg-white rounded-lg text-xs px-2 focus:ring-0 shadow-3xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="p-1 rounded border-slate-200 bg-white shadow-sm">
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
                      label="Nghề nghiệp / Công việc"
                      error={occupantErrors?.occupation?.message}
                    >
                      <Input
                        {...register(`occupants.${idx}.occupation` as const)}
                        placeholder="Ví dụ: Sinh viên"
                        className="mt-1"
                      />
                    </FormGroup>

                    <div className="sm:col-span-3">
                      <FormGroup
                        label="Biển số xe gắn máy cá nhân đăng ký hầm gửi xe"
                        error={occupantErrors?.licensePlate?.message}
                      >
                        <div className="relative group">
                          <Input
                            {...register(
                              `occupants.${idx}.licensePlate` as const,
                            )}
                            placeholder="Ví dụ: 29N1-888.88"
                            className="pl-8 mt-1 uppercase"
                          />
                          <Bike
                            size={13}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                        </div>
                      </FormGroup>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ================= PHÂN KHU II: PHƯƠNG TIỆN IoT CỦA CHỦ HỘ ================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Bike size={13} className="text-slate-400" /> II. Đăng ký phương
            tiện gửi hầm của Chủ Hộ ({watchedValues.tenantName || "Bên B"})
          </h3>
          <Button
            type="button"
            onClick={() =>
              appendTenantVehicle({ type: "MOTORBIKE", licensePlate: "" })
            }
            variant="outline"
            size="sm"
            className="h-5.5 text-[9px] font-bold border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <Plus size={10} className="mr-0.5 stroke-[2.5]" /> Đăng ký xe chủ hộ
          </Button>
        </div>

        <div className="space-y-2 max-h-32 overflow-y-auto pr-0.5">
          {tenantVehicleFields.length === 0 ? (
            <p className="text-[11px] text-slate-400 font-medium italic p-2 text-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200/60">
              Chủ hộ chưa khai báo phương tiện cơ giới sử dụng gửi hầm tòa nhà.
            </p>
          ) : (
            tenantVehicleFields.map((field, idx) => {
              const vehicleErrors = (errors.tenantVehicles as any)?.[idx];

              return (
                <div key={field.id} className="animate-in fade-in duration-100">
                  <FormGroup
                    label=""
                    error={vehicleErrors?.licensePlate?.message}
                  >
                    <div className="flex gap-2 p-1.5 border border-slate-200/60 rounded-xl bg-white shadow-3xs items-center w-full">
                      <Select
                        defaultValue={
                          watchedValues.tenantVehicles?.[idx]?.type ||
                          "MOTORBIKE"
                        }
                        onValueChange={(val) =>
                          setValue(`tenantVehicles.${idx}.type`, val)
                        }
                      >
                        <SelectTrigger className="h-7.5 border-slate-200 bg-slate-50/40 rounded text-[11px] font-semibold px-2 w-28 focus:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="p-1 rounded border-slate-200 bg-white">
                          <SelectItem value="MOTORBIKE" className="text-xs">
                            XE MÁY
                          </SelectItem>
                          <SelectItem value="Xe đạp điện" className="text-xs">
                            XE ĐẠP ĐIỆN
                          </SelectItem>
                          <SelectItem value="CAR" className="text-xs">
                            Ô TÔ
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex-1">
                        <Input
                          {...register(
                            `tenantVehicles.${idx}.licensePlate` as const,
                          )}
                          placeholder="Ví dụ: 29X1-888.88"
                          className="h-7.5 text-xs rounded border-slate-200 uppercase text-slate-800 bg-slate-50/10 focus-visible:bg-white transition-all shadow-3xs"
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={() => removeTenantVehicle(idx)}
                        variant="ghost"
                        size="icon"
                        className="h-7.5 w-7.5 text-slate-300 hover:text-rose-600 rounded shrink-0 cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </FormGroup>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ================= PHÂN KHU III: DANH MỤC DỊCH VỤ ĐỊNH MỨC ================= */}
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
            className="h-5.5 text-[9px] font-bold border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <Plus size={10} className="mr-0.5 stroke-[2.5]" /> Thêm khoản phí
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-1.5 max-h-80 overflow-y-auto pr-0.5 select-none">
          {serviceFields.map((field, idx) => {
            const serviceErrors = (errors.services as any)?.[idx];

            return (
              <div key={field.id}>
                <FormGroup
                  label=""
                  error={
                    serviceErrors?.price?.message ||
                    serviceErrors?.name?.message
                  }
                >
                  <div className="flex items-center gap-2 px-3 h-8.5 border border-dashed border-slate-200 rounded-lg bg-white w-full">
                    <Input
                      {...register(`services.${idx}.name` as const)}
                      className="h-6.5 text-xs font-semibold w-28 border-none p-0 focus-visible:ring-0 text-slate-700"
                    />
                    <div className="flex-1" />
                    <Input
                      type="number"
                      {...register(`services.${idx}.price` as const, {
                        valueAsNumber: true,
                      })}
                      className="h-6.5 text-xs w-32 rounded border-slate-200 font-bold text-red-600"
                    />
                    <span className="text-[10px] text-slate-400 w-28">
                      /{watchedValues.services?.[idx]?.unit || "u"}
                    </span>
                    <Button
                      type="button"
                      onClick={() => removeService(idx)}
                      variant="ghost"
                      size="icon"
                      className="h-6.5 w-6.5 text-slate-300 hover:text-rose-600 rounded shrink-0 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </FormGroup>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
