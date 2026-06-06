"use client";

import React, { useState } from "react";
import {
  Settings,
  Lock,
  CalendarClock,
  BellRing,
  Zap,
  Droplets,
  Save,
  RefreshCw,
  SlidersHorizontal,
  KeyRound,
  ShieldCheck,
  Wifi,
  ShieldAlert,
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
import { toast } from "sonner";

export function FormGroup({
  label,
  subLabel,
  error,
  children,
}: {
  label: string;
  subLabel?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5 w-full">
      <div className="space-y-0.5 select-none">
        <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
          {label}
        </label>
        {subLabel && (
          <p className="text-[10px] text-slate-400 font-medium">{subLabel}</p>
        )}
      </div>
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

  // State quản lý toàn bộ cấu hình lõi thực tế của Danjin BMS
  const [settings, setSettings] = useState({
    defaultPassword: "123456",
    requirePasswordChange: true,
    sessionTimeout: "1440",

    billingAnchorDay: "25",
    invoiceGenerationDay: "28",
    gracePeriodDays: "3",

    enableAutoDunning: true,
    firstReminderDays: "1",
    finalReminderDays: "5",

    defaultElectricPrice: 3500,
    defaultWaterPrice: 30000,
    defaultServiceFee: 150000,
  });

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      toast.success(
        "✓ Đồng bộ tham số và cấu hình cấu trúc tự động hóa thành công!",
      );
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-7 bg-slate-50/10 min-h-screen antialiased selection:bg-indigo-50">
      {/* 1. TOP NAVIGATION BAR: TIÊU ĐỀ ĐIỀU HÀNH CHUYÊN SÂU */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-5 select-none">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600 stroke-[1.8]" />
            Tham số & Cấu hình Hệ thống lõi
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Thiết lập mật khẩu khởi tạo, điều phối vòng tải cronjob phát hành
            hóa đơn tự động và biên độ phạt công nợ.
          </p>
        </div>

        {/* Cụm Tabs dẹt khít lồng trực tiếp lên hàng Topbar để tiết kiệm không gian */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/40 w-fit h-9 items-center shrink-0 shadow-3xs">
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`h-7 px-3.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "security"
                ? "bg-white shadow-2xs text-slate-900"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Lock size={12} className="stroke-[1.8]" /> Cấp phát & Bảo mật
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("billing")}
            className={`h-7 px-3.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "billing"
                ? "bg-white shadow-2xs text-slate-900"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <CalendarClock size={12} className="stroke-[1.8]" /> Chu kỳ Tự động
            hóa
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("utility")}
            className={`h-7 px-3.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "utility"
                ? "bg-white shadow-2xs text-slate-900"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <SlidersHorizontal size={12} className="stroke-[1.8]" /> Định mức
            nền
          </button>
        </div>
      </div>

      {/* 2. KHÔNG GIAN NỘI DUNG CHÍNH - ĐÃ PHÁ BỎ CHIẾC HỘP THÔ CỨNG */}
      <form onSubmit={handleSaveSettings} className="space-y-8 max-w-4xl">
        {/* ================= TAB 1: BẢO MẬT & MẬT KHẨU KHỞI TẠO ================= */}
        {activeTab === "security" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3 select-none">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound size={14} className="text-indigo-600 stroke-[1.8]" />{" "}
                Kiểm soát mật khẩu mặc định ban đầu
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormGroup
                label="Mật khẩu khởi tạo"
                subLabel="Mật khẩu nền gán tự động khi thêm mới cư dân"
              >
                <Input
                  value={settings.defaultPassword}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultPassword: e.target.value,
                    })
                  }
                  className="h-9 font-mono text-xs font-bold rounded-lg border-slate-200 bg-white text-slate-800 shadow-2xs focus-visible:border-slate-400 focus-visible:ring-0"
                />
              </FormGroup>

              <FormGroup
                label="Thời gian hết hạn phiên (Session timeout)"
                subLabel="Tự động đăng xuất tài khoản khi không tương tác"
              >
                <Select
                  value={settings.sessionTimeout}
                  onValueChange={(val) =>
                    setSettings({ ...settings, sessionTimeout: val })
                  }
                >
                  <SelectTrigger className="h-9 text-xs font-semibold border-slate-200 bg-white text-slate-700 rounded-lg shadow-2xs focus:ring-0 focus:border-slate-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    <SelectItem value="30" className="text-xs cursor-pointer">
                      30 phút (Yêu cầu bảo mật cao)
                    </SelectItem>
                    <SelectItem value="60" className="text-xs cursor-pointer">
                      60 phút (Mức tiêu chuẩn mặc định)
                    </SelectItem>
                    <SelectItem value="1440" className="text-xs cursor-pointer">
                      24 giờ (Duy trì phiên vận hành)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>

              <div className="sm:col-span-2 flex items-center justify-between p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/40 hover:bg-slate-50/70 transition-all select-none">
                <div className="space-y-1 pr-4">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-500" /> Bắt
                    buộc thiết lập lại mật khẩu mới ở lần đầu login
                  </span>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                    Cư dân nhận bàn giao phòng hoặc nhân viên mới gán vào hệ
                    thống Danjin bắt buộc phải thay đổi thông tin xác thực ban
                    đầu để kích hoạt quyền truy cập ứng dụng.
                  </p>
                </div>
                <Switch
                  checked={settings.requirePasswordChange}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, requirePasswordChange: checked })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: CRONJOB TỰ ĐỘNG HÓA TÀI KHÓA ================= */}
        {activeTab === "billing" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3 select-none">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarClock
                  size={14}
                  className="text-indigo-600 stroke-[1.8]"
                />{" "}
                Vòng quét tự động hóa tài khóa tòa nhà
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormGroup
                label="Ngày khóa sổ công tơ"
                subLabel="Hệ thống chốt số điện nước phòng"
              >
                <Select
                  value={settings.billingAnchorDay}
                  onValueChange={(val) =>
                    setSettings({ ...settings, billingAnchorDay: val })
                  }
                >
                  <SelectTrigger className="h-9 text-xs font-bold font-mono border-slate-200 bg-white rounded-lg shadow-2xs focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    <SelectItem
                      value="20"
                      className="text-xs font-mono cursor-pointer"
                    >
                      Ngày 20 hàng tháng
                    </SelectItem>
                    <SelectItem
                      value="25"
                      className="text-xs font-mono cursor-pointer"
                    >
                      Ngày 25 hàng tháng
                    </SelectItem>
                    <SelectItem
                      value="30"
                      className="text-xs font-mono cursor-pointer"
                    >
                      Ngày 30 hàng tháng
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>

              <FormGroup
                label="Ngày phát hành hóa đơn"
                subLabel="Tự động sinh mã VietQR gạch nợ"
              >
                <Select
                  value={settings.invoiceGenerationDay}
                  onValueChange={(val) =>
                    setSettings({ ...settings, invoiceGenerationDay: val })
                  }
                >
                  <SelectTrigger className="h-9 text-xs font-bold font-mono border-slate-200 bg-white rounded-lg shadow-2xs focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    <SelectItem
                      value="25"
                      className="text-xs font-mono cursor-pointer"
                    >
                      Ngày 25 hàng tháng
                    </SelectItem>
                    <SelectItem
                      value="28"
                      className="text-xs font-mono cursor-pointer"
                    >
                      Ngày 28 hàng tháng
                    </SelectItem>
                    <SelectItem
                      value="1"
                      className="text-xs font-mono cursor-pointer"
                    >
                      Ngày 01 đầu tháng sau
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>

              <FormGroup
                label="Thời hạn nộp cước phí"
                subLabel="Hạn đóng tiền kể từ ngày ra phiếu"
              >
                <div className="relative flex items-center">
                  <Input
                    type="number"
                    value={settings.gracePeriodDays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        gracePeriodDays: e.target.value,
                      })
                    }
                    className="h-9 font-mono text-xs font-bold rounded-lg border-slate-200 bg-white pr-12 shadow-2xs focus-visible:border-slate-400 focus-visible:ring-0"
                  />
                  <span className="absolute right-3 text-[10px] text-slate-400 font-bold select-none">
                    NGÀY
                  </span>
                </div>
              </FormGroup>

              {/* LUỒNG CHẠY ROBOT DUNNING NHẮC NỢ CÔNG NỢ */}
              <div className="sm:col-span-3 border border-slate-200/90 bg-white rounded-2xl p-5 shadow-3xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 select-none">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <BellRing
                        size={14}
                        className="text-indigo-500 stroke-[1.8]"
                      />{" "}
                      Kích hoạt hệ thống gửi tin nhắc nợ tự động
                    </span>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Bật robot dunning tự động truy quét hóa đơn trễ hạn và
                      cảnh báo cư dân.
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableAutoDunning}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, enableAutoDunning: checked })
                    }
                  />
                </div>

                {settings.enableAutoDunning && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1 animate-in fade-in duration-200">
                    <FormGroup
                      label="Gửi tin nhắn mềm (Zalo/App)"
                      subLabel="Tự động nhắc nhở sau khi hóa đơn bị trễ cước"
                    >
                      <div className="relative flex items-center">
                        <Input
                          type="number"
                          value={settings.firstReminderDays}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              firstReminderDays: e.target.value,
                            })
                          }
                          className="h-9 text-xs font-mono font-bold pr-12 rounded-lg border-slate-200 bg-slate-50/40 text-slate-800 focus-visible:border-slate-400 focus-visible:ring-0"
                        />
                        <span className="absolute right-3 text-[10px] text-slate-400 font-bold select-none">
                          NGÀY
                        </span>
                      </div>
                    </FormGroup>

                    <FormGroup
                      label="Khóa cổng IoT hầm xe + Gửi SMS khẩn cấp"
                      subLabel="Cưỡng chế ngắt quyền truy cập tài sản khi nợ đọng kéo dài"
                    >
                      <div className="relative flex items-center">
                        <Input
                          type="number"
                          value={settings.finalReminderDays}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              finalReminderDays: e.target.value,
                            })
                          }
                          className="h-9 text-xs font-mono font-bold text-rose-600 pr-12 rounded-lg border-slate-200 bg-rose-50/10 focus-visible:border-rose-300 focus-visible:ring-0"
                        />
                        <span className="absolute right-3 text-[10px] text-rose-400 font-bold select-none">
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

        {/* ================= TAB 3: ĐỊNH MỨC PHỤ TẢI NỀN MẶC ĐỊNH ================= */}
        {activeTab === "utility" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3 select-none">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal
                  size={14}
                  className="text-indigo-600 stroke-[1.8]"
                />{" "}
                Khuôn mẫu đơn giá tiện ích toàn tòa nhà
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormGroup
                label="Đơn giá Điện tiêu thụ"
                subLabel="Giá trị áp dụng (VND/kWh)"
              >
                <div className="relative flex items-center">
                  <Input
                    type="number"
                    value={settings.defaultElectricPrice}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        defaultElectricPrice: Number(e.target.value),
                      })
                    }
                    className="h-9 font-mono text-xs font-bold text-slate-800 pl-8 rounded-lg border-slate-200 bg-white focus-visible:border-slate-400 focus-visible:ring-0"
                  />
                  <Zap size={13} className="absolute left-2.5 text-amber-500" />
                </div>
              </FormGroup>

              <FormGroup
                label="Đơn giá Nước sạch"
                subLabel="Giá trị sinh hoạt (VND/m³)"
              >
                <div className="relative flex items-center">
                  <Input
                    type="number"
                    value={settings.defaultWaterPrice}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        defaultWaterPrice: Number(e.target.value),
                      })
                    }
                    className="h-9 font-mono text-xs font-bold text-slate-800 pl-8 rounded-lg border-slate-200 bg-white focus-visible:border-slate-400 focus-visible:ring-0"
                  />
                  <Droplets
                    size={13}
                    className="absolute left-2.5 text-blue-500"
                  />
                </div>
              </FormGroup>

              <FormGroup
                label="Combo Phí Quản lý & Wifi"
                subLabel="Định mức thu cố định (VND/Phòng)"
              >
                <div className="relative flex items-center">
                  <Input
                    type="number"
                    value={settings.defaultServiceFee}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        defaultServiceFee: Number(e.target.value),
                      })
                    }
                    className="h-9 font-mono text-xs font-bold text-indigo-600 pl-8 rounded-lg border-slate-200 bg-white focus-visible:border-indigo-400 focus-visible:ring-0"
                  />
                  <Wifi
                    size={13}
                    className="absolute left-2.5 text-indigo-400"
                  />
                </div>
              </FormGroup>
            </div>

            {/* BOX CẢNH BÁO PHÁP LÝ KHI THAY ĐỔI ĐƠN GIÁ */}
            <div className="flex gap-3 p-4 border border-amber-100 bg-amber-50/40 rounded-xl text-xs text-amber-800 font-medium leading-relaxed select-none">
              <ShieldAlert
                size={16}
                className="text-amber-500 shrink-0 mt-0.5"
              />
              <p>
                <strong className="font-bold">Lưu ý nghiệp vụ:</strong> Việc cập
                nhật khuôn mẫu đơn giá tiện ích nền chỉ có tác dụng tự động bơm
                giá trị gợi ý vào các hợp đồng tạo mới từ thời điểm này về sau.
                Toàn bộ các hợp đồng cũ đang vận hành sẽ giữ nguyên giá trị đã
                ký kết để bảo toàn tính pháp lý chứng từ.
              </p>
            </div>
          </div>
        )}

        {/* 3. FOOTER BUTTON: ĐỒNG BỘ TOÀN CỤC CHÂN FORM */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200/60 select-none">
          <Button
            type="submit"
            disabled={isSaving}
            className="cursor-pointer h-9 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 uppercase tracking-wider transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw size={13} className="animate-spin text-slate-300" />
            ) : (
              <Save size={13} className="stroke-[1.8]" />
            )}
            <span>
              {isSaving ? "Đang cập nhật..." : "Đồng bộ cấu hình cấu trúc"}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
