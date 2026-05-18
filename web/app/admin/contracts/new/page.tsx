"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronRight,
  ArrowLeft,
  Plus,
  Trash2,
  Zap,
  Droplets,
  Bike,
  Settings,
  X,
  Users,
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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import Link from "next/link";

export default function CreateContract() {
  const [step, setStep] = useState(1);

  // State quản lý dữ liệu nghiệp vụ đầy đủ cho Danjin BMS
  const [formData, setFormData] = useState({
    tenantName: "Nguyễn Văn Anh",
    phone: "",
    cccd: "",
    roomNumber: "101",
    deposit: 4500000,
    rentPrice: 4500000,
    paymentCycle: "1", // Chu kỳ đóng tiền (1 tháng, 3 tháng...)
    startDate: "2026-05-18",
    duration: 12,
    electricStart: 0, // Chỉ số điện đầu kỳ
    waterStart: 0, // Chỉ số nước đầu kỳ
    occupants: [{ name: "", cccd: "", licensePlate: "" }], // Biển số xe nhân khẩu
    services: [
      {
        id: 1,
        name: "Điện vận hành",
        price: 3500,
        unit: "kWh",
        icon: <Zap className="w-3 h-3" />,
      },
      {
        id: 2,
        name: "Nước sinh hoạt",
        price: 100000,
        unit: "Người",
        icon: <Droplets className="w-3 h-3" />,
      },
      {
        id: 3,
        name: "Phí gửi xe máy",
        price: 150000,
        unit: "Xe",
        icon: <Bike className="w-3 h-3" />,
      },
    ],
  });

  // Tự động tính ngày kết thúc hợp đồng
  const endDate = useMemo(() => {
    if (!formData.startDate) return "";
    const start = new Date(formData.startDate);
    start.setMonth(start.getMonth() + Number(formData.duration));
    return start.toISOString().split("T")[0];
  }, [formData.startDate, formData.duration]);

  // Tính toán tài chính ngày bàn giao
  const totalInitialPayment = useMemo(() => {
    return formData.deposit + formData.rentPrice;
  }, [formData.deposit, formData.rentPrice]);

  const addOccupant = () =>
    setFormData({
      ...formData,
      occupants: [
        ...formData.occupants,
        { name: "", cccd: "", licensePlate: "" },
      ],
    });

  const removeOccupant = (index: number) =>
    setFormData({
      ...formData,
      occupants: formData.occupants.filter((_, i) => i !== index),
    });

  const addService = () => {
    const newService = {
      id: Date.now(),
      name: "Phí dịch vụ mới",
      price: 0,
      unit: "Tháng",
      icon: <Settings className="w-3 h-3" />,
    };
    setFormData({ ...formData, services: [...formData.services, newService] });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-slate-200/80 bg-white rounded-xl overflow-hidden shadow-[0_12px_32px_-8px_rgba(15,23,42,0.04)] min-h-[680px] relative antialiased selection:bg-indigo-50">
      {/* Nút thoát phẳng dẹt tinh tế góc phải */}
      <Link
        href="/admin/contracts"
        className="absolute right-5 top-4 z-50 flex items-center gap-1.5 text-slate-400 hover:text-rose-600 transition-colors text-xs font-medium bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md"
      >
        <span>Hủy bỏ</span>
        <X size={13} className="stroke-[2]" />
      </Link>

      {/* CỘT TRÁI: KHÔNG GIAN NHẬP LIỆU FORM PHẲNG */}
      <div className="lg:col-span-7 p-6 md:p-9 flex flex-col justify-between border-r border-slate-100 bg-white">
        <div className="space-y-7">
          {/* Cụm Stepper thanh mảnh chuẩn SaaS */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <StepCircle num={1} active={step >= 1} label="Cư dân đại diện" />
            <div
              className={`h-px flex-1 ${step > 1 ? "bg-slate-900" : "bg-slate-200/60"}`}
            />
            <StepCircle
              num={2}
              active={step >= 2}
              label="Tài chính & Thời hạn"
            />
            <div
              className={`h-px flex-1 ${step > 2 ? "bg-slate-900" : "bg-slate-200/60"}`}
            />
            <StepCircle
              num={3}
              active={step >= 3}
              label="Dịch vụ & Nhân khẩu"
            />
          </div>

          <div className="space-y-5">
            {/* Step 1: Thông tin cư dân ký hợp đồng */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-sm font-semibold text-slate-900">
                  I. Thông tin chủ thể thuê căn hộ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormGroup label="Họ và tên khách thuê">
                    <Input
                      value={formData.tenantName}
                      onChange={(e) =>
                        setFormData({ ...formData, tenantName: e.target.value })
                      }
                      placeholder="Ví dụ: Nguyễn Văn Anh"
                      className="h-9.5 px-3 bg-slate-50/50 border-slate-200 focus-visible:bg-white focus-visible:border-slate-400 rounded-lg text-xs font-medium"
                    />
                  </FormGroup>
                  <FormGroup label="Số điện thoại liên lạc">
                    <Input
                      placeholder="09xx xxx xxx"
                      className="h-9.5 px-3 bg-slate-50/50 border-slate-200 focus-visible:bg-white focus-visible:border-slate-400 rounded-lg text-xs font-mono font-medium"
                    />
                  </FormGroup>
                  <div className="md:col-span-2">
                    <FormGroup label="Số CMND / CCCD / Định danh pháp lý">
                      <Input
                        placeholder="Số căn cước công dân 12 số..."
                        className="h-9.5 px-3 bg-slate-50/50 border-slate-200 focus-visible:bg-white focus-visible:border-slate-400 rounded-lg text-xs font-mono font-medium"
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Cấu hình phòng, chu kỳ thanh toán & Số đầu kỳ */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-sm font-semibold text-slate-900">
                  II. Cấu hình tài chính, thời hạn & Số nền đầu kỳ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormGroup label="Số phòng bàn giao">
                    <Input
                      value={formData.roomNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, roomNumber: e.target.value })
                      }
                      className="h-9.5 px-3 bg-slate-50/50 border-slate-200 focus-visible:bg-white focus-visible:border-slate-400 rounded-lg text-xs font-mono font-semibold"
                    />
                  </FormGroup>
                  <FormGroup label="Tiền nhà / Mỗi tháng (VND)">
                    <Input
                      type="number"
                      value={formData.rentPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rentPrice: Number(e.target.value),
                        })
                      }
                      className="h-9.5 px-3 bg-slate-50/50 border-slate-200 focus-visible:bg-white focus-visible:border-slate-400 rounded-lg text-xs font-mono font-bold"
                    />
                  </FormGroup>
                  <FormGroup label="Thời hạn hợp đồng (Tháng)">
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: Number(e.target.value),
                        })
                      }
                      className="h-9.5 px-3 bg-slate-50/50 border-slate-200 focus-visible:bg-white focus-visible:border-slate-400 rounded-lg text-xs font-mono font-semibold"
                    />
                  </FormGroup>
                  <FormGroup label="Chu kỳ thanh toán định kỳ">
                    <Select
                      value={formData.paymentCycle}
                      onValueChange={(val) =>
                        setFormData({ ...formData, paymentCycle: val })
                      }
                    >
                      <SelectTrigger className="h-9.5 border-slate-200 bg-slate-50/50 rounded-lg text-xs font-medium focus:ring-0">
                        <SelectValue placeholder="Chọn chu kỳ đóng tiền" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border-slate-200">
                        <SelectItem value="1" className="text-xs">
                          Thanh toán theo từng tháng
                        </SelectItem>
                        <SelectItem value="3" className="text-xs">
                          Thanh toán 3 tháng / lần
                        </SelectItem>
                        <SelectItem value="6" className="text-xs">
                          Thanh toán 6 tháng / lần
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormGroup>
                  <FormGroup label="Ngày hợp đồng bắt đầu có hiệu lực">
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="h-9.5 px-3 bg-slate-50/50 border-slate-200 focus-visible:bg-white focus-visible:border-slate-400 rounded-lg text-xs font-medium"
                    />
                  </FormGroup>
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
                      className="h-9.5 px-3 bg-slate-50/50 border-slate-200 focus-visible:bg-white focus-visible:border-slate-400 rounded-lg text-xs font-mono font-bold text-indigo-600"
                    />
                  </FormGroup>

                  {/* Khối chỉ số công tơ điện nước đầu kỳ phục vụ chốt số sau này */}
                  <div className="md:col-span-2 grid grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <FormGroup label="Chỉ số CÔNG TƠ ĐIỆN đầu kỳ">
                      <Input
                        type="number"
                        value={formData.electricStart}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            electricStart: Number(e.target.value),
                          })
                        }
                        className="h-8 px-2 bg-white border-slate-200 rounded-md text-xs font-mono font-semibold focus-visible:border-slate-400"
                      />
                    </FormGroup>
                    <FormGroup label="Chỉ số ĐỒNG HỒ NƯỚC đầu kỳ">
                      <Input
                        type="number"
                        value={formData.waterStart}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            waterStart: Number(e.target.value),
                          })
                        }
                        className="h-8 px-2 bg-white border-slate-200 rounded-md text-xs font-mono font-semibold focus-visible:border-slate-400"
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Quản lý nhân khẩu ở cùng & Biển số xe */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <h3 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <Users size={14} className="text-slate-400" /> Nhân khẩu
                      lưu trú cùng (Thành viên)
                    </h3>
                    <Button
                      onClick={addOccupant}
                      variant="outline"
                      size="sm"
                      className="h-6.5 text-[10px] font-semibold border-slate-200 rounded-md text-slate-600 hover:bg-slate-50"
                    >
                      <Plus className="w-3 h-3 mr-1 stroke-[2]" /> Thêm thành
                      viên
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {formData.occupants.map((occ, index) => (
                      <div
                        key={index}
                        className="flex gap-2 p-2.5 border border-slate-200/60 rounded-lg bg-slate-50/40 items-center"
                      >
                        <Input
                          placeholder="Họ và tên"
                          value={occ.name}
                          onChange={(e) => {
                            const updated = [...formData.occupants];
                            updated[index].name = e.target.value;
                            setFormData({ ...formData, occupants: updated });
                          }}
                          className="h-8 text-xs rounded-md bg-white border-slate-200 flex-1"
                        />
                        <Input
                          placeholder="Số CCCD"
                          value={occ.cccd}
                          onChange={(e) => {
                            const updated = [...formData.occupants];
                            updated[index].cccd = e.target.value;
                            setFormData({ ...formData, occupants: updated });
                          }}
                          className="h-8 text-xs rounded-md bg-white border-slate-200 flex-1 font-mono"
                        />
                        <Input
                          placeholder="Biển số xe (Nếu có)"
                          value={occ.licensePlate}
                          onChange={(e) => {
                            const updated = [...formData.occupants];
                            updated[index].licensePlate = e.target.value;
                            setFormData({ ...formData, occupants: updated });
                          }}
                          className="h-8 text-xs rounded-md bg-white border-slate-200 w-32 font-mono uppercase"
                        />
                        <Button
                          onClick={() => removeOccupant(index)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-rose-600 rounded-md shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Khối quản lý danh mục định mức dịch vụ */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <h3 className="text-xs font-semibold text-slate-800">
                      III. Danh mục dịch vụ & Định mức thu
                    </h3>
                    <Button
                      onClick={addService}
                      variant="outline"
                      size="sm"
                      className="h-6.5 text-[10px] font-semibold border-slate-200 rounded-md text-slate-600 hover:bg-slate-50"
                    >
                      <Plus className="w-3 h-3 mr-1 stroke-[2]" /> Bổ sung khoản
                      phí
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {formData.services.map((service, index) => (
                      <div
                        key={service.id}
                        className="flex items-center gap-2.5 px-3 h-9 border border-dashed border-slate-200 rounded-lg bg-white"
                      >
                        <Input
                          value={service.name}
                          onChange={(e) => {
                            const updated = [...formData.services];
                            updated[index].name = e.target.value;
                            setFormData({ ...formData, services: updated });
                          }}
                          className="h-7 text-xs font-semibold w-28 border-none p-0 focus-visible:ring-0 text-slate-700"
                        />
                        <div className="flex-1" />
                        <Input
                          type="number"
                          value={service.price}
                          onChange={(e) => {
                            const updated = [...formData.services];
                            updated[index].price = Number(e.target.value);
                            setFormData({ ...formData, services: updated });
                          }}
                          className="h-7 text-xs w-24 rounded-md border-slate-200 font-mono text-right"
                        />
                        <span className="text-[11px] text-slate-400 font-medium w-12 font-mono">
                          /{service.unit}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-300 hover:text-rose-600 rounded-md shrink-0"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              services: formData.services.filter(
                                (_, i) => i !== index,
                              ),
                            });
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Khối điều hướng chân Form */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-8 shrink-0">
          <Button
            variant="ghost"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="h-8.5 px-3 text-xs font-medium text-slate-400 hover:text-slate-700 rounded-lg disabled:opacity-30"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5 stroke-[2]" /> Quay lại
            bước trước
          </Button>

          <Button
            onClick={() =>
              step < 3
                ? setStep(step + 1)
                : alert("Hợp đồng khởi tạo thành công!")
            }
            className="h-8.5 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-2xs flex items-center gap-1 active:scale-[0.99]"
          >
            <span>
              {step === 3 ? "Phát hành hợp đồng" : "Tiếp tục thiết lập"}
            </span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
          </Button>
        </div>
      </div>

      {/* CỘT PHẢI: BẢN LIVE PREVIEW PHÁP LÝ SANG TRỌNG */}
      <div className="lg:col-span-5 bg-slate-50/60 p-6 md:p-9 space-y-5 flex flex-col justify-start select-none">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/60 pb-3">
          Xem trước chứng từ hợp đồng
        </h3>

        {/* Khung biên bản tờ giấy hóa đơn */}
        <div className="bg-white p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] space-y-5 rounded-xl border border-slate-200/60 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900" />

          <div className="space-y-0.5">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
              Cư dân đại diện pháp lý
            </p>
            <p className="text-base font-bold text-slate-900 tracking-tight">
              {formData.tenantName || "Chưa nhập tên..."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-3 border-t border-b border-slate-100 py-4 font-sans text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] font-medium block">
                Vị trí phòng bàn giao
              </span>
              <span className="font-semibold text-slate-800 font-mono">
                Phòng {formData.roomNumber} (Block A)
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] font-medium block">
                Chu kỳ đóng tiền nhà
              </span>
              <span className="font-semibold text-slate-800">
                Thanh toán {formData.paymentCycle} tháng/lần
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] font-medium block">
                Ngày kích hoạt ở
              </span>
              <span className="font-semibold text-slate-700 font-mono">
                {formData.startDate.split("-").reverse().join("/")}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] font-medium block">
                Ngày đáo hạn bàn giao
              </span>
              <span className="font-semibold text-slate-700 font-mono">
                {endDate.split("-").reverse().join("/")}
              </span>
            </div>
          </div>

          {/* Hiển thị định mức vận hành nền tảng */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Định mức vận hành dịch vụ
            </p>
            <div className="flex flex-wrap gap-1.5">
              {formData.services.map((s) => (
                <div
                  key={s.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-200/60 rounded text-slate-600 font-mono text-[10px] font-semibold"
                >
                  <span>{s.name}:</span>
                  <span className="text-slate-900">
                    {s.price.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="text-slate-400 font-sans font-normal text-[9px]">
                    /{s.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tổng kết tổng số tiền cọc quỹ ngày bàn giao */}
          <div className="space-y-2 p-4 bg-indigo-600/90 text-white rounded-xl shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-radial from-white/10 to-transparent opacity-40 pointer-events-none" />
            <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80 leading-none">
              Tổng thu ngày nhận phòng (Cọc + Tháng đầu)
            </p>
            <div className="flex items-baseline gap-1 pt-1">
              <span className="text-2xl font-bold font-mono tracking-tight leading-none">
                {totalInitialPayment.toLocaleString("vi-VN")}
              </span>
              <span className="text-xs font-semibold font-sans opacity-90">
                VNĐ
              </span>
            </div>
          </div>

          {/* Dòng ghi chú pháp lý nhỏ */}
          <div className="flex items-start gap-2 p-3 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <p className="text-[10px] text-slate-500 leading-normal font-medium">
              Chỉ số điện nền đầu kỳ chốt cố định là{" "}
              <span className="font-mono font-bold text-slate-800">
                {formData.electricStart} kWh
              </span>
              . Mọi tranh chấp sau ngày bàn giao sẽ căn cứ theo chứng từ số nền
              này.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// KHẮC PHỤC LỖI: Định nghĩa hoàn chỉnh component FormGroup cho TypeScript & Eslint
function FormGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wide select-none">
        {label}
      </label>
      {children}
    </div>
  );
}

// KHẮC PHỤC LỖI: Định nghĩa hoàn chỉnh component StepCircle cho TypeScript & Eslint
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
    <div className="flex items-center gap-2 select-none shrink-0">
      <div
        className={`h-5.5 w-5.5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300
        ${
          active
            ? "bg-slate-900 border-slate-900 text-white shadow-2xs"
            : "bg-transparent border-slate-200 text-slate-300"
        }`}
      >
        {num}
      </div>
      <span
        className={`text-xs font-semibold tracking-tight transition-colors duration-300 ${
          active ? "text-slate-900" : "text-slate-300"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
