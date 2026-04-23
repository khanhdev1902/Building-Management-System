/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import {
  Home,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Info,
  Plus,
  Trash2,
  Zap,
  Droplets,
  Bike,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import Link from "next/link";

export default function CreateContract() {
  const [step, setStep] = useState(1);

  // State quản lý dữ liệu
  const [formData, setFormData] = useState({
    tenantName: "Nguyễn Văn Anh",
    phone: "",
    cccd: "",
    roomNumber: "101",
    deposit: 4500000,
    rentPrice: 4500000,
    startDate: "2026-04-15",
    duration: 12, // Tháng
    occupants: [{ name: "", cccd: "" }],
    // Danh sách dịch vụ động
    services: [
      {
        id: 1,
        name: "Điện",
        price: 3500,
        unit: "kWh",
        icon: <Zap className="w-3 h-3" />,
      },
      {
        id: 2,
        name: "Nước",
        price: 100000,
        unit: "Người",
        icon: <Droplets className="w-3 h-3" />,
      },
      {
        id: 3,
        name: "Gửi xe",
        price: 150000,
        unit: "Xe",
        icon: <Bike className="w-3 h-3" />,
      },
    ],
  });

  // 1. Tự động tính ngày kết thúc
  const endDate = useMemo(() => {
    if (!formData.startDate) return "";
    const start = new Date(formData.startDate);
    start.setMonth(start.getMonth() + Number(formData.duration));
    return start.toISOString().split("T")[0];
  }, [formData.startDate, formData.duration]);

  // 2. Tính toán tài chính
  const totalInitialPayment = useMemo(() => {
    return formData.deposit + formData.rentPrice;
  }, [formData.deposit, formData.rentPrice]);

  // Logic Thêm/Xóa người ở
  const addOccupant = () =>
    setFormData({
      ...formData,
      occupants: [...formData.occupants, { name: "", cccd: "" }],
    });
  const removeOccupant = (index: number) =>
    setFormData({
      ...formData,
      occupants: formData.occupants.filter((_, i) => i !== index),
    });

  // Logic Thêm dịch vụ mới
  const addService = () => {
    const newService = {
      id: Date.now(),
      name: "Dịch vụ mới",
      price: 0,
      unit: "Tháng",
      icon: <Settings className="w-3 h-3" />,
    };
    setFormData({ ...formData, services: [...formData.services, newService] });
  };

  return (
    <div className=" relative grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-187.5 border border-slate-100 bg-white shadow-2xl font-sans">
      <Link
        href="/contracts"
        onClick={() => alert("Thoát mà không lưu dữ liệu!")}
        className=" 
        absolute right-0 top-0 m-4 flex items-center gap-2 text-gray-600 hover:text-red-500 
        transition-colors text-sm font-semibold"
      >
        Quay lại
        <LogOut size={16} />
      </Link>

      {/* CỘT TRÁI: FORM NHẬP LIỆU */}
      <div className="lg:col-span-7 p-8 md:p-12 space-y-8 border-r border-slate-50">
        <div className="flex items-center gap-4 mb-10">
          <StepCircle num={1} active={step >= 1} label="Cư dân" />
          <div
            className={`h-px w-8 ${step > 1 ? "bg-slate-900" : "bg-slate-100"}`}
          />
          <StepCircle num={2} active={step >= 2} label="Phòng & Giá" />
          <div
            className={`h-px w-8 ${step > 2 ? "bg-slate-900" : "bg-slate-100"}`}
          />
          <StepCircle num={3} active={step >= 3} label="Vận hành" />
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
            {step === 1 && "I. Thông tin chủ thể thuê"}
            {step === 2 && "II. Cấu hình tài chính & Thời hạn"}
            {step === 3 && "III. Nhân khẩu & Dịch vụ tùy chỉnh"}
          </h2>

          {/* Step 1: Cư dân */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
              <FormGroup label="Họ và tên khách thuê">
                <Input
                  value={formData.tenantName}
                  onChange={(e) =>
                    setFormData({ ...formData, tenantName: e.target.value })
                  }
                  placeholder="Nguyễn Văn A"
                  className="rounded-none h-11"
                />
              </FormGroup>
              <FormGroup label="Số điện thoại">
                <Input
                  placeholder="09xx xxx xxx"
                  className="rounded-none h-11"
                />
              </FormGroup>
              <div className="md:col-span-2">
                <FormGroup label="Số CCCD / Định danh">
                  <Input
                    placeholder="0371 xxx xxx xxx"
                    className="rounded-none h-11"
                  />
                </FormGroup>
              </div>
            </div>
          )}

          {/* Step 2: Phòng & Giá */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4">
              <FormGroup label="Chọn phòng">
                <Input
                  value={formData.roomNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, roomNumber: e.target.value })
                  }
                  className="rounded-none h-11"
                />
              </FormGroup>
              <FormGroup label="Tiền thuê / Tháng">
                <Input
                  type="number"
                  value={formData.rentPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rentPrice: Number(e.target.value),
                    })
                  }
                  className="rounded-none h-11 font-bold"
                />
              </FormGroup>
              <FormGroup label="Ngày bắt đầu">
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="rounded-none h-11"
                />
              </FormGroup>
              <FormGroup label="Thời hạn (Tháng)">
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: Number(e.target.value),
                    })
                  }
                  className="rounded-none h-11"
                />
              </FormGroup>
              <div className="md:col-span-2">
                <FormGroup label="Tiền đặt cọc (VND)">
                  <Input
                    type="number"
                    value={formData.deposit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deposit: Number(e.target.value),
                      })
                    }
                    className="rounded-none h-11 font-bold text-indigo-600"
                  />
                </FormGroup>
              </div>
            </div>
          )}

          {/* Step 3: Nhân khẩu & Dịch vụ */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-[11px] font-black uppercase text-slate-900 tracking-widest">
                    Thành viên ở cùng
                  </h3>
                  <Button
                    onClick={addOccupant}
                    variant="outline"
                    size="sm"
                    className="h-7 text-[9px] font-black uppercase rounded-none border-slate-900"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Thêm người
                  </Button>
                </div>
                {formData.occupants.map((occ, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 border border-slate-100 bg-slate-50/50 group"
                  >
                    <Input
                      placeholder="Họ tên"
                      className="h-8 text-xs rounded-none bg-white"
                    />
                    <Input
                      placeholder="Số CCCD"
                      className="h-8 text-xs rounded-none bg-white"
                    />
                    <Button
                      onClick={() => removeOccupant(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-[11px] font-black uppercase text-slate-900 tracking-widest">
                    Danh mục dịch vụ
                  </h3>
                  <Button
                    onClick={addService}
                    variant="outline"
                    size="sm"
                    className="h-7 text-[9px] font-black uppercase rounded-none border-slate-900"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Thêm phí
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {formData.services.map((service, index) => (
                    <div
                      key={service.id}
                      className="flex items-center gap-3 p-2 border border-dashed border-slate-200"
                    >
                      <Input
                        value={service.name}
                        className="h-8 text-xs font-bold w-32 border-none p-0 focus-visible:ring-0"
                      />
                      <Input
                        type="number"
                        value={service.price}
                        className="h-8 text-xs w-24 rounded-none"
                      />
                      <span className="text-[10px] text-slate-400 font-bold uppercase w-12 tracking-tighter">
                        /{service.unit}
                      </span>
                      <div className="flex-1" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 text-slate-300 hover:text-red-500"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            services: formData.services.filter(
                              (_, i) => i !== index,
                            ),
                          })
                        }
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-10 border-t border-slate-50">
          <Button
            variant="ghost"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
          <Button
            onClick={() =>
              step < 3 ? setStep(step + 1) : alert("Hợp đồng đã sẵn sàng!")
            }
            className="rounded-none bg-slate-900 text-white font-black text-[10px] uppercase h-11 px-8"
          >
            {step === 3 ? "Phát hành & Ký tên" : "Tiếp theo"}{" "}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* CỘT PHẢI: LIVE PREVIEW */}
      <div className="lg:col-span-5 bg-slate-50 p-8 md:p-12 space-y-8">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-200 pb-4">
          Bản xem trước hợp đồng
        </h3>

        <div className="bg-white p-8 shadow-xl space-y-6 relative overflow-hidden border-t-4 border-t-slate-900">
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-slate-400 uppercase">
              Khách hàng thuê
            </p>
            <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">
              {formData.tenantName}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <PreviewItem
              label="Mặt bằng"
              value={`Phòng ${formData.roomNumber}`}
              icon={<Home className="w-3 h-3" />}
            />
            <PreviewItem
              label="Thời hạn"
              value={`${formData.duration} Tháng`}
              icon={<Calendar className="w-3 h-3" />}
            />
            <PreviewItem
              label="Ngày bắt đầu"
              value={formData.startDate}
              icon={<Calendar className="w-3 h-3" />}
            />
            <PreviewItem
              label="Ngày kết thúc"
              value={endDate}
              icon={<Calendar className="w-3 h-3 text-red-500" />}
            />
          </div>

          <Separator className="bg-slate-100" />

          {/* DỊCH VỤ ĐÃ CHỌN */}
          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
              Định mức vận hành
            </p>
            <div className="flex flex-wrap gap-2">
              {formData.services.map((s) => (
                <div
                  key={s.id}
                  className="px-2 py-1 bg-slate-900 text-white text-[9px] font-bold flex items-center gap-1.5"
                >
                  {s.icon} {s.name.toUpperCase()}: {s.price.toLocaleString()}
                </div>
              ))}
            </div>
          </div>

          {/* TỔNG KẾT TÀI CHÍNH */}
          <div className="space-y-3 bg-indigo-600 p-6 text-white">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
              Tổng thu ngày bàn giao
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs opacity-90">
                <span>Tiền cọc + Tiền nhà</span>
                <span className="font-bold">
                  {totalInitialPayment.toLocaleString()}đ
                </span>
              </div>
              <p className="text-[22px] font-black tracking-tighter">
                {totalInitialPayment.toLocaleString()}đ
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 border border-indigo-100 bg-indigo-50/30">
            <Info className="w-4 h-4 text-indigo-600 mt-0.5" />
            <p className="text-[10px] text-indigo-700 leading-relaxed font-medium italic">
              Lưu ý: Ngày kết thúc {endDate} là ngày dự kiến bàn giao lại mặt
              bằng sạch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Tối ưu các Sub-components ---

function FormGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-tight">
        {label}
      </label>
      {children}
    </div>
  );
}

function StepCircle({
  num,
  active,
  label,
}: {
  num: number;
  active: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-6 w-6 flex items-center justify-center text-[10px] font-black border-2 transition-all
        ${active ? "bg-slate-900 border-slate-900 text-white" : "bg-transparent border-slate-100 text-slate-200"}`}
      >
        {num}
      </div>
      <span
        className={`text-[10px] font-black uppercase tracking-widest ${active ? "text-slate-900" : "text-slate-200"}`}
      >
        {label}
      </span>
    </div>
  );
}

function PreviewItem({ label, value, icon }: any) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-slate-400">
        {icon}
        <span className="text-[8px] font-black uppercase tracking-tighter">
          {label}
        </span>
      </div>
      <p className="text-xs font-bold text-slate-800 tracking-tight">{value}</p>
    </div>
  );
}
