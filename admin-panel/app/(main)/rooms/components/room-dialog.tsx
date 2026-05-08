/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Save,
  Zap,
  Droplets,
  LayoutGrid,
  ListPlus,
  ShieldCheck,
  Pencil,
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
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Textarea } from "@/shared/components/ui/textarea";

// --- Mockup Data ---
const LIST_SERVICES = [
  { id: "wifi", name: "Internet Cáp Quang", price: 100000, unit: "tháng" },
  { id: "cleaning", name: "Dọn vệ sinh", price: 50000, unit: "lần" },
  { id: "parking", name: "Gửi xe máy", price: 150000, unit: "xe" },
  { id: "management", name: "Phí quản lý", price: 100000, unit: "phòng" },
];

const AVAILABLE_AMENITIES = [
  "Điều hòa",
  "Nóng lạnh",
  "Giường",
  "Tủ quần áo",
  "Tủ lạnh",
  "Máy giặt",
  "Ban công",
  "Bếp từ",
];

interface RoomDialogProps {
  mode?: "create" | "update";
  initialData?: any;
  onSubmit: (data: any) => void;
  trigger?: React.ReactNode;
}

export function RoomDialog({
  mode = "create",
  initialData,
  onSubmit,
  trigger,
}: RoomDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: "",
    floor: "1",
    price: "",
    area: "",
    type: "Studio",
    status: "available",
    description: "",
    services: { electricity: 3500, water: 100000 },
    otherServices: [], // Danh sách ID các dịch vụ chọn thêm
    amenities: [],
  });

  useEffect(() => {
    if (mode === "update" && initialData && isOpen) {
      setFormData({
        ...initialData,
        price: initialData.price?.toString() || "",
        area: initialData.area?.toString() || "",
        otherServices: initialData.services
          ? Object.keys(initialData.services).filter(
              (k) => k !== "electricity" && k !== "water",
            )
          : [],
      });
    } else if (mode === "create" && isOpen) {
      setFormData({
        name: "",
        floor: "1",
        price: "",
        area: "",
        type: "Studio",
        status: "available",
        description: "",
        services: { electricity: 3500, water: 100000 },
        otherServices: [],
        amenities: [],
      });
    }
  }, [initialData, mode, isOpen]);

  const toggleAmenity = (amenity: string) => {
    setFormData((prev: any) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a: string) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const toggleService = (serviceId: string) => {
    setFormData((prev: any) => ({
      ...prev,
      otherServices: prev.otherServices.includes(serviceId)
        ? prev.otherServices.filter((s: string) => s !== serviceId)
        : [...prev.otherServices, serviceId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic gộp services cố định và services đã chọn thành 1 object
    const finalServices = { ...formData.services };
    formData.otherServices.forEach((sId: string) => {
      const s = LIST_SERVICES.find((item) => item.id === sId);
      if (s) finalServices[sId] = s.price;
    });

    const submissionData = {
      ...formData,
      price: Number(formData.price),
      area: Number(formData.area),
      services: finalServices,
    };
    delete submissionData.otherServices;

    onSubmit(submissionData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="rounded-xl cursor-pointer py-4 bg-slate-900 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <Plus className="mr-1 h-4 w-4" /> Tạo mới
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-150 p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <DialogHeader className="p-6 bg-slate-900 text-white">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            {mode === "create" ? (
              <LayoutGrid className="w-6 h-6" />
            ) : (
              <Pencil className="w-6 h-6" />
            )}
            {mode === "create" ? "Khởi tạo căn hộ" : "Cập nhật thiết lập"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-slate-50/50 p-0 h-12">
              <TabsTrigger
                value="general"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:bg-transparent px-6 font-bold text-xs uppercase tracking-widest"
              >
                Thông tin
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:bg-transparent px-6 font-bold text-xs uppercase tracking-widest"
              >
                Dịch vụ
              </TabsTrigger>
              <TabsTrigger
                value="amenities"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:bg-transparent px-6 font-bold text-xs uppercase tracking-widest"
              >
                Tiện ích
              </TabsTrigger>
            </TabsList>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Tab 1: Thông tin chung */}
              <TabsContent value="general" className="space-y-4 mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label className="text-[11px] font-black uppercase text-slate-400">
                      Tên / Số phòng
                    </Label>
                    <Input
                      className="rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                      placeholder="VD: P.402"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase text-slate-400">
                      Tầng
                    </Label>
                    <Select
                      value={formData.floor}
                      onValueChange={(v) =>
                        setFormData({ ...formData, floor: v })
                      }
                    >
                      <SelectTrigger className="rounded-xl bg-slate-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["1", "2", "3", "4", "5", "6"].map((f) => (
                          <SelectItem key={f} value={f}>
                            Tầng {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase text-slate-400">
                      Loại phòng
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(v) =>
                        setFormData({ ...formData, type: v })
                      }
                    >
                      <SelectTrigger className="rounded-xl bg-slate-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Studio">Studio</SelectItem>
                        <SelectItem value="1PN">1 Phòng ngủ</SelectItem>
                        <SelectItem value="2PN">2 Phòng ngủ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase text-slate-400">
                      Diện tích (m²)
                    </Label>
                    <Input
                      type="number"
                      className="rounded-xl bg-slate-50"
                      required
                      value={formData.area}
                      onChange={(e) =>
                        setFormData({ ...formData, area: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase text-slate-400">
                      Giá thuê (VNĐ)
                    </Label>
                    <Input
                      type="number"
                      className="rounded-xl bg-slate-50 font-bold text-indigo-600"
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label className="text-[11px] font-black uppercase text-slate-400">
                      Mô tả ngắn
                    </Label>
                    <Textarea
                      className="rounded-xl bg-slate-50 border-slate-200"
                      rows={2}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Tab 2: Dịch vụ */}
              <TabsContent value="services" className="space-y-6 mt-0">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-indigo-500 flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3" /> Dịch vụ mặc định (Cố
                    định)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-bold text-slate-700">
                          Giá điện
                        </span>
                      </div>
                      <span className="text-xs font-black text-slate-900">
                        3.500đ / số
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-bold text-slate-700">
                          Giá nước
                        </span>
                      </div>
                      <span className="text-xs font-black text-slate-900">
                        100.000đ / người
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-indigo-500 flex items-center gap-2">
                    <ListPlus className="w-3 h-3" /> Chọn dịch vụ bổ sung
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {LIST_SERVICES.map((s) => (
                      <div
                        key={s.id}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${formData.otherServices.includes(s.id) ? "border-indigo-500 bg-indigo-50/50 shadow-sm" : "border-slate-100 bg-white hover:border-slate-300"}`}
                        onClick={() => toggleService(s.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={formData.otherServices.includes(s.id)}
                            onCheckedChange={() => toggleService(s.id)}
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {s.name}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Đơn giá: {s.price.toLocaleString()}đ / {s.unit}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-white">
                          {s.price.toLocaleString()}đ
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Tab 3: Tiện ích */}
              <TabsContent value="amenities" className="mt-0">
                <div className="grid grid-cols-2 gap-3">
                  {AVAILABLE_AMENITIES.map((item) => (
                    <div
                      key={item}
                      onClick={() => toggleAmenity(item)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${formData.amenities.includes(item) ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" : "bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300"}`}
                    >
                      <Checkbox
                        checked={formData.amenities.includes(item)}
                        onCheckedChange={() => toggleAmenity(item)}
                        className={
                          formData.amenities.includes(item)
                            ? "border-white data-[state=checked]:bg-white data-[state=checked]:text-slate-900"
                            : ""
                        }
                      />
                      <span className="text-sm font-bold">{item}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>

            <DialogFooter className="p-6 bg-slate-50/80 border-t">
              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 h-12 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
              >
                <Save className="mr-2 h-4 w-4" />
                {mode === "update"
                  ? "Lưu thay đổi thiết lập"
                  : "Khởi tạo dữ liệu căn hộ"}
              </Button>
            </DialogFooter>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
}
