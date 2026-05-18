"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  Zap,
  Droplets,
  LayoutGrid,
  ShieldCheck,
  Pencil,
  Info,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Textarea } from "@/shared/components/ui/textarea";
import { serviceApi } from "../../services/apis/service.api";
import { ServiceResponse } from "../../services/types/service.type";
import { roomSchema } from "../schemas/room.schema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { assetApi } from "../../assets/apis/asset.api";
import { AssetCategory } from "../../assets/types/asset.type";

type RoomFormValues = z.infer<typeof roomSchema>;
type RoomSubmitPayload = RoomFormValues;

interface RoomDialogProps {
  mode?: "create" | "update";
  initialData?: Partial<RoomFormValues>;
  onSubmit: (data: RoomSubmitPayload) => void;
  trigger?: React.ReactNode;
}

export function RoomDialog({
  mode = "create",
  initialData,
  onSubmit,
  trigger,
}: RoomDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [lstServices, setLstServices] = useState<ServiceResponse[]>([]);
  const [lstAssets, setLstAssets] = useState<AssetCategory[]>([]);
  const electric = lstServices.find((s) => s.name === "Điện");
  const water = lstServices.find((s) => s.name === "Nước");

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomNumber: "",
      floor: 1,
      roomPrice: 0,
      acreage: 0,
      maxOccupants: 0,
      type: "Studio",
      status: "AVAILABLE",
      description: "",
      amenities: [],
      serviceIds: [],
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form;

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedAmenities = watch("amenities") || [];
  const selectedServiceIds = watch("serviceIds") || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resService = await serviceApi.getAllServices();
        const resAsset = await assetApi.getAllAssets();
        setLstServices(resService.data);
        setLstAssets(resAsset.data.assets);
        console.log(resAsset.data);
      } catch (error) {
        console.error("Lỗi lấy Data:", error);
      }
    };
    if (isOpen) fetchData();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (mode === "update" && initialData) {
        console.log("data update",initialData)
        reset({
          ...initialData,
        });
        console.log("data form update:",form.getValues())
      } else {
        reset({
          roomNumber: "",
          floor: 1,
          roomPrice: 0,
          acreage: 0,
          maxOccupants: 0,
          type: "Studio",
          status: "AVAILABLE",
          description: "",
          amenities: [],
          serviceIds: [],
        });
      }
    }
  }, [isOpen, initialData, mode, reset, form]);

  const handleFinalSubmit = (data: RoomFormValues) => {
    const defaultServiceIds = [electric?.id, water?.id].filter(
      Boolean,
    ) as string[];
    const finalServiceIds = [
      ...new Set([...defaultServiceIds, ...data.serviceIds]),
    ];
    const payload = {
      ...data,
      serviceIds: finalServiceIds,
    };
    console.log("Dữ liệu gửi đi:", payload);
    onSubmit(payload);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="rounded-lg bg-slate-900 hover:bg-slate-800 shadow-md transition-all active:scale-95 p-4 cursor-pointer">
            + Tạo phòng
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-160 p-0 overflow-hidden border-slate-200 rounded-xl shadow-2xl">
        {/* Header tinh giản, chuyên nghiệp */}
        <DialogHeader className="px-6 py-4 border-b bg-white">
          <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 rounded-md">
              {mode === "create" ? (
                <LayoutGrid className="w-4 h-4 text-slate-600" />
              ) : (
                <Pencil className="w-4 h-4 text-slate-600" />
              )}
            </div>
            {mode === "create" ? "Khởi tạo căn hộ mới" : "Cập nhật thông tin"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFinalSubmit)}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-slate-50/50 px-4 h-11 gap-2">
              <TabsTrigger
                value="general"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent px-4 text-xs font-bold uppercase tracking-tight text-slate-500 data-[state=active]:text-slate-900 transition-all"
              >
                Thông tin chung
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent px-4 text-xs font-bold uppercase tracking-tight text-slate-500 data-[state=active]:text-slate-900 transition-all"
              >
                Dịch vụ vận hành
              </TabsTrigger>
              <TabsTrigger
                value="amenities"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent px-4 text-xs font-bold uppercase tracking-tight text-slate-500 data-[state=active]:text-slate-900 transition-all"
              >
                Trang thiết bị
              </TabsTrigger>
            </TabsList>

            <div className="px-6 py-5 max-h-[60vh] overflow-y-auto bg-white">
              {/* TAB 1: THÔNG TIN CHUNG */}
              <TabsContent value="general" className="space-y-5 mt-0">
                <div className="grid grid-cols-6 gap-4">
                  <div className="col-span-3 space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">
                      Tên / Số phòng
                    </Label>
                    <Input
                      {...register("roomNumber")}
                      placeholder="VD: P.402"
                      className="rounded-lg border-slate-200 focus:ring-slate-900"
                    />
                    {errors.roomNumber && (
                      <p className="text-red-500 text-[10px] italic">
                        {errors.roomNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-3 space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">
                      Loại hình
                    </Label>
                    <Select
                      value={watch("type")}
                      onValueChange={(v) => setValue("type", v)}
                    >
                      <SelectTrigger className="rounded-lg border-slate-200 focus:ring-slate-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Studio",
                          "1 Phòng ngủ",
                          "2 Phòng ngủ",
                          "3 Phòng ngủ",
                        ].map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-red-500 text-[10px] italic">
                        {errors.type.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">
                      Tầng
                    </Label>
                    <Input
                      type="number"
                      {...register("floor", { valueAsNumber: true })}
                      className="rounded-lg border-slate-200"
                    />
                  </div>

                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">
                      Diện tích (m²)
                    </Label>
                    <Input
                      type="number"
                      {...register("acreage", { valueAsNumber: true })}
                      className="rounded-lg border-slate-200"
                    />
                    {errors.acreage && (
                      <p className="text-red-500 text-[10px] italic">
                        {errors.acreage.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">
                      Sức chứa (Người)
                    </Label>
                    <Input
                      type="number"
                      {...register("maxOccupants", { valueAsNumber: true })}
                      className="rounded-lg border-slate-200"
                    />
                    {errors.maxOccupants && (
                      <p className="text-red-500 text-[10px] italic">
                        {errors.maxOccupants.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6 space-y-1.5 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">
                      Giá thuê niêm yết (VNĐ / Tháng)
                    </Label>
                    <div className="relative">
                      <Input
                        type="number"
                        {...register("roomPrice", { valueAsNumber: true })}
                        className="rounded-lg border-slate-200 text-lg font-bold text-indigo-700 bg-white"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400 text-xs font-medium">
                        VNĐ
                      </div>
                    </div>
                    {errors.roomPrice && (
                      <p className="text-red-500 text-[10px] italic">
                        {errors.roomPrice.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6 space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">
                      Ghi chú / Mô tả
                    </Label>
                    <Textarea
                      {...register("description")}
                      className="rounded-lg border-slate-200 min-h-20 resize-none"
                      placeholder="Nhập đặc điểm nổi bật của phòng..."
                    />
                  </div>
                </div>
              </TabsContent>

              {/* TAB 2: DỊCH VỤ */}
              <TabsContent value="services" className="space-y-6 mt-0">
                <div className="p-4 rounded-xl border bg-slate-50/50 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Định mức cố định
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-semibold text-slate-600">
                          Giá điện
                        </span>
                      </div>
                      <span className="text-sm font-bold">
                        {Number(electric?.price ?? 0)?.toLocaleString("vi-VN")}
                        đ/ số
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500 fill-blue-500" />
                        <span className="text-xs font-semibold text-slate-600">
                          Giá nước
                        </span>
                      </div>
                      <span className="text-sm font-bold">
                        {Number(water?.price ?? 0)?.toLocaleString("vi-VN")}đ/
                        m3
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Info className="w-3 h-3" /> Các dịch vụ đi kèm khác
                  </Label>
                  <div className="grid grid-cols-1 gap-2">
                    {lstServices
                      .filter((s) => s.name !== "Điện" && s.name !== "Nước")
                      .map((s) => (
                        <label
                          key={s.id}
                          className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                            selectedServiceIds.includes(s.id)
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-200 bg-white hover:border-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedServiceIds.includes(s.id)}
                              onCheckedChange={(checked) => {
                                const current = selectedServiceIds;
                                setValue(
                                  "serviceIds",
                                  checked
                                    ? [...current, s.id]
                                    : current.filter((id) => id !== s.id),
                                );
                              }}
                              className={
                                selectedServiceIds.includes(s.id)
                                  ? "border-white data-[state=checked]:bg-white data-[state=checked]:text-slate-900"
                                  : ""
                              }
                            />
                            <div>
                              <p className="text-sm font-bold">{s.name}</p>
                              <p
                                className={`text-[10px] ${selectedServiceIds.includes(s.id) ? "text-slate-400" : "text-slate-500"}`}
                              >
                                {Number(s.price ?? 0).toLocaleString("vi-VN")}đ
                                / {s.unit}
                              </p>
                            </div>
                          </div>
                          {selectedServiceIds.includes(s.id) && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                        </label>
                      ))}
                  </div>
                </div>
              </TabsContent>

              {/* TAB 3: TIỆN ÍCH */}
              <TabsContent value="amenities" className="mt-0">
                <div className="grid grid-cols-3 gap-3">
                  {lstAssets.map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-center gap-2.5 p-3 rounded-lg border transition-all cursor-pointer shadow-sm ${
                        selectedAmenities.includes(item.id)
                          ? "bg-slate-900 border-slate-900 text-white"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Checkbox
                        checked={selectedAmenities.includes(item.id)}
                        onCheckedChange={(checked) => {
                          const current = selectedAmenities;
                          setValue(
                            "amenities",
                            checked
                              ? [...current, item.id]
                              : current.filter((i) => i !== item.id),
                          );
                        }}
                        className={
                          selectedAmenities.includes(item.id)
                            ? "border-white data-[state=checked]:bg-white data-[state=checked]:text-slate-900"
                            : ""
                        }
                      />
                      <span className="text-[13px] font-medium">
                        {item.name}
                      </span>
                    </label>
                  ))}
                </div>
              </TabsContent>
            </div>

            <DialogFooter className="p-8 bg-slate-50 border-t flex-row justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border-slate-200 text-slate-600 font-semibold"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 rounded-lg px-8 font-bold shadow-lg"
              >
                <Save className="mr-2 h-4 w-4" />
                {mode === "update" ? "Lưu thay đổi" : "Tạo căn hộ"}
              </Button>
            </DialogFooter>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
}
