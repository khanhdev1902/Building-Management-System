"use client";

import React, { useState } from "react";
import {
  Settings,
  Lock,
  CalendarClock,
  BellRing,
  Zap,
  Droplets,
  ShieldAlert,
  Save,
  RefreshCw,
  SlidersHorizontal,
  KeyRound,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Card, CardContent } from "@/shared/components/ui/card";
//import { FormGroup } from "../contracts/create/components/FormGroup"; // Dùng lại helper báo lỗi dẹt phẳng
import { toast } from "sonner";

export function FormGroup({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1 w-full">
      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wide select-none">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[10px] text-rose-600 font-semibold flex items-center gap-1 mt-0.5 animate-in fade-in duration-200">
          {error}
        </p>
      )}
    </div>
  );
}

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "security" | "billing" | "utility"
  >("security");
  const [isSaving, setIsSaving] = useState(false);

  // State quản lý toàn bộ cấu hình lõi của Danjin BMS
  const [settings, setSettings] = useState({
    // 1. Cấu hình bảo mật tài khoản mới
    defaultPassword: "DanjinBMS@2026",
    requirePasswordChange: true,
    sessionTimeout: "60", // phút

    // 2. Cấu hình tự động hóa tài khóa & hóa đơn
    billingAnchorDay: "25", // Ngày 25 hàng tháng chốt số
    invoiceGenerationDay: "28", // Ngày 28 phát hành hóa đơn VietQR
    gracePeriodDays: "3", // 3 ngày sau khi ra hóa đơn là hạn đóng tiền

    // 3. Luồng tự động nhắc nợ tự động
    enableAutoDunning: true,
    firstReminderDays: "1", // Trễ 1 ngày: Nhắc nhở mềm qua Zalo/App
    finalReminderDays: "5", // Trễ 5 ngày: Cảnh báo SMS + Đóng băng IoT hầm xe

    // 4. Giá định mức phần cứng nền mặc định toàn tòa nhà
    defaultElectricPrice: 3500,
    defaultWaterPrice: 30000,
    defaultServiceFee: 150000,
  });

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Mô phỏng luồng delay gửi API xuống server NestJS
    setTimeout(() => {
      setIsSaving(false);
      toast.success("✓ Đồng bộ cấu hình tự động hóa toàn hệ thống thành công!");
    }, 800);
  };

  return (
    <div className=" p-4 space-y-5 bg-slate-50/20 min-h-screen antialiased font-sans select-none">
      {/* HEADER PHÂN KHU TÁC VỤ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-xl font-black tracking-tight text-slate-950 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600 stroke-[2.2]" />
            Tham số & Cấu hình Hệ thống
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Thiết lập mật khẩu khởi tạo, cấu hình cronjob tự động ra hóa đơn và
            biên độ phạt công nợ quá hạn.
          </p>
        </div>
      </div>

      {/* THANH TABS ĐIỀU HƯỚNG CỤC BỘ DẸT KHÍT CHUẨN B2B SAAS */}
      <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/40 w-fit h-9 items-center">
        <button
          onClick={() => setActiveTab("security")}
          className={`h-7 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "security"
              ? "bg-white shadow-2xs text-slate-900"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Lock size={12} /> Cấp phát & Bảo mật
        </button>
        <button
          onClick={() => setActiveTab("billing")}
          className={`h-7 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "billing"
              ? "bg-white shadow-2xs text-slate-900"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <CalendarClock size={12} /> Chu kỳ Hóa đơn & Nhắc nợ
        </button>
        {/* <button
          onClick={() => setActiveTab("utility")}
          className={`h-7 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "utility"
              ? "bg-white shadow-2xs text-slate-900"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <SlidersHorizontal size={12} /> Định mức Phụ tải nền
        </button> */}
      </div>

      {/* KHÔNG GIAN CONTAINER FORM ĐIỀU KHIỂN CHÍNH */}
      <form onSubmit={handleSaveSettings} className="space-y-5">
        <Card className="border border-slate-200/80 bg-white rounded-xl shadow-3xs overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-950" />
          <CardContent className="p-6">
            {/* ================= TAB 1: BẢO MẬT & MẬT KHẨU MẶC ĐỊNH ================= */}
            {activeTab === "security" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                    <KeyRound size={13} className="text-indigo-600" /> Cấu hình
                    cấp phát mật khẩu ban đầu
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Áp dụng tự động khi quản trị viên tạo nhanh tài khoản cư dân
                    hoặc nhân viên vận hành mới.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormGroup label="Mật khẩu khởi tạo mặc định">
                    <Input
                      value={settings.defaultPassword}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          defaultPassword: e.target.value,
                        })
                      }
                      className="h-8.5 font-mono text-xs font-bold rounded-lg border-slate-200 bg-slate-50/20"
                    />
                  </FormGroup>

                  <FormGroup label="Thời gian hết hạn phiên đăng nhập (Session)">
                    <Select
                      value={settings.sessionTimeout}
                      onValueChange={(val) =>
                        setSettings({ ...settings, sessionTimeout: val })
                      }
                    >
                      <SelectTrigger className="h-8.5 text-xs font-semibold border-slate-200 bg-slate-50/20 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white p-1 rounded-lg border-slate-200">
                        <SelectItem value="30" className="text-xs">
                          30 phút (Bảo mật cao)
                        </SelectItem>
                        <SelectItem value="60" className="text-xs">
                          60 phút (Tiêu chuẩn)
                        </SelectItem>
                        <SelectItem value="1440" className="text-xs">
                          24 giờ (Duy trì liên tục)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormGroup>

                  {/* Switch toggle bắt buộc đổi mật khẩu ở lần đầu login */}
                  <div className="sm:col-span-2 flex items-center justify-between p-3.5 border border-dashed border-slate-200 rounded-xl bg-slate-50/40">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 block">
                        Bắt buộc thay đổi mật khẩu ở lần đăng nhập đầu tiên
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        Cư dân bắt buộc phải thiết lập mật khẩu mới sau khi nhận
                        bàn giao phòng để kích hoạt App Danjin.
                      </span>
                    </div>
                    <Switch
                      checked={settings.requirePasswordChange}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          requirePasswordChange: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 2: CRONJOB TỰ ĐỘNG HÓA HÓA ĐƠN & NHẮC NỢ ================= */}
            {activeTab === "billing" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                    <CalendarClock size={13} className="text-indigo-600" /> Chu
                    kỳ quét tải Cronjob & Thiết lập dunning công nợ
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Điều phối lõi tự động hóa tính toán tiền phòng, sinh mã
                    VietQR gạch nợ và đẩy thông báo tin nhắn.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
                  <FormGroup label="Ngày khóa sổ chốt số công tơ">
                    <Select
                      value={settings.billingAnchorDay}
                      onValueChange={(val) =>
                        setSettings({ ...settings, billingAnchorDay: val })
                      }
                    >
                      <SelectTrigger className="h-8.5 text-xs font-bold font-mono border-slate-200 bg-slate-50/20 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white p-1 rounded-lg border-slate-200">
                        <SelectItem value="20" className="text-xs font-mono">
                          Ngày 20 hàng tháng
                        </SelectItem>
                        <SelectItem value="25" className="text-xs font-mono">
                          Ngày 25 hàng tháng
                        </SelectItem>
                        <SelectItem value="30" className="text-xs font-mono">
                          Ngày 30 hàng tháng
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormGroup>

                  <FormGroup label="Ngày tự động phát hành hóa đơn">
                    <Select
                      value={settings.invoiceGenerationDay}
                      onValueChange={(val) =>
                        setSettings({ ...settings, invoiceGenerationDay: val })
                      }
                    >
                      <SelectTrigger className="h-8.5 text-xs font-bold font-mono border-slate-200 bg-slate-50/20 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white p-1 rounded-lg border-slate-200">
                        <SelectItem value="25" className="text-xs font-mono">
                          Ngày 25 hàng tháng
                        </SelectItem>
                        <SelectItem value="28" className="text-xs font-mono">
                          Ngày 28 hàng tháng
                        </SelectItem>
                        <SelectItem value="1" className="text-xs font-mono">
                          Ngày 01 đầu tháng sau
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormGroup>

                  <FormGroup label="Hạn đóng cước phí (Số ngày từ khi ra phiếu)">
                    <Input
                      type="number"
                      value={settings.gracePeriodDays}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          gracePeriodDays: e.target.value,
                        })
                      }
                      className="h-8.5 font-mono text-xs font-bold rounded-lg border-slate-200 bg-slate-50/20"
                    />
                  </FormGroup>

                  {/* PHÂN KHU TỰ ĐỘNG BẮN TIN NHẮC NỢ QUA APP / SMS */}
                  <div className="sm:col-span-3 p-4 border border-slate-100 bg-slate-50/40 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <BellRing size={13} className="text-slate-400" /> Kích
                        hoạt hệ thống robot tự động gửi thông báo nhắc nợ
                      </span>
                      <Switch
                        checked={settings.enableAutoDunning}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            enableAutoDunning: checked,
                          })
                        }
                      />
                    </div>

                    {settings.enableAutoDunning && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 animate-in fade-in duration-200">
                        <FormGroup label="Gửi tin nhắn mềm (Zalo/App) sau trễ hạn">
                          <div className="relative">
                            <Input
                              type="number"
                              value={settings.firstReminderDays}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  firstReminderDays: e.target.value,
                                })
                              }
                              className="h-8 text-xs font-mono font-bold pr-12 rounded-lg border-slate-200 bg-white"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">
                              NGÀY
                            </span>
                          </div>
                        </FormGroup>
                        <FormGroup label="Khóa cổng IoT hầm xe + Gửi SMS khẩn cấp sau trễ hạn">
                          <div className="relative">
                            <Input
                              type="number"
                              value={settings.finalReminderDays}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  finalReminderDays: e.target.value,
                                })
                              }
                              className="h-8 text-xs font-mono font-bold text-rose-600 pr-12 rounded-lg border-slate-200 bg-white"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">
                              NGÀY
                            </span>
                          </div>
                        </FormGroup>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: GIÁ ĐỊNH MỨC TIỆN ÍCH MẶC ĐỊNH ================= */}
            {activeTab === "utility" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                    <SlidersHorizontal size={13} className="text-indigo-600" />{" "}
                    Khuôn mẫu đơn giá tiện ích toàn tòa nhà
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Đơn giá cơ sở tự động bơm vào trường nhập liệu mỗi khi lập
                    hợp đồng mặt bằng mới.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
                  <FormGroup label="Đơn giá Điện tiêu thụ (VND/kWh)">
                    <div className="relative">
                      <Input
                        type="number"
                        value={settings.defaultElectricPrice}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            defaultElectricPrice: Number(e.target.value),
                          })
                        }
                        className="h-8.5 font-mono text-xs font-bold text-slate-800 pl-7.5 rounded-lg border-slate-200 bg-slate-50/20"
                      />
                      <Zap
                        size={12}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-500"
                      />
                    </div>
                  </FormGroup>

                  <FormGroup label="Đơn giá Nước sạch sinh hoạt (VND/m³)">
                    <div className="relative">
                      <Input
                        type="number"
                        value={settings.defaultWaterPrice}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            defaultWaterPrice: Number(e.target.value),
                          })
                        }
                        className="h-8.5 font-mono text-xs font-bold text-slate-800 pl-7.5 rounded-lg border-slate-200 bg-slate-50/20"
                      />
                      <Droplets
                        size={12}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-blue-500"
                      />
                    </div>
                  </FormGroup>

                  <FormGroup label="Combo phí Quản lý & Wifi mặc định">
                    <Input
                      type="number"
                      value={settings.defaultServiceFee}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          defaultServiceFee: Number(e.target.value),
                        })
                      }
                      className="h-8.5 font-mono text-xs font-bold text-indigo-600 rounded-lg border-slate-200 bg-slate-50/20 text-right pr-3"
                    />
                  </FormGroup>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CỤM PHÍM DUYỆT KHÓA GỬI TOÀN CỤC CHÂN FORM */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60 select-none">
          <Button
            type="submit"
            disabled={isSaving}
            className="h-9 px-5 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer uppercase tracking-wider active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw size={13} className="animate-spin" />
            ) : (
              <Save size={13} />
            )}
            <span>{isSaving ? "Slaving..." : "Đồng bộ cấu hình cấu trúc"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
