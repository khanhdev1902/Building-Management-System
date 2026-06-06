"use client";

import React, { useState } from "react";
import {
  User,
  Shield,
  KeyRound,
  Activity,
  Mail,
  Phone,
  Briefcase,

  Eye,
  EyeOff,
  Terminal,
  Clock,
  Fingerprint,
  CalendarDays,
  
  Save,
  
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { toast } from "sonner";

const MOCK_ADMIN_PROFILE = {
  fullName: "Nguyễn Văn Khanh",
  code: "DJ-ADMIN-1903",
  email: "khanhdv1902@gmail.com",
  phone: "0345755058",
  role: "Super Admin",
  title: "Hệ thống quản lý / IT Director",
  joinedDate: "18/03/2026",
  permissions: [
    "ALL_PRIVILEGES",
    "MANAGE_CONTRACTS",
    "MANAGE_FINANCE",
    "MANAGE_IOT_GATEWAY",
  ],
  auditLogs: [
    {
      id: "log-1",
      action: "Chốt chỉ số điện nước",
      target: "Phòng P.201",
      time: "10 phút trước",
      ip: "14.226.12.85",
    },
    {
      id: "log-2",
      action: "Khai báo tạm trú (Roommate)",
      target: "Cư dân Trần Thế Anh",
      time: "1 giờ trước",
      ip: "14.226.12.85",
    },
    {
      id: "log-3",
      action: "Phát hành hợp đồng số hóa",
      target: "Căn hộ P.101",
      time: "2 giờ trước",
      ip: "14.226.12.85",
    },
    {
      id: "log-4",
      action: "Đăng nhập hệ thống",
      target: "Thiết bị Opera Browser / Windows",
      time: "09:52 AM",
      ip: "14.226.12.85",
    },
  ],
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(MOCK_ADMIN_PROFILE);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPass, setShowPass] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("✓ Đồng bộ hồ sơ tài khoản quản trị viên thành công!");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp trùng nhau!");
      return;
    }
    toast.success("✓ Cập nhật mật mã bảo mật hệ thống mới thành công!");
    setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setShowPasswordForm(false);
  };

  function resetForm() {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-slate-50/10 min-h-screen antialiased selection:bg-indigo-50">
      {/* 1. TOP BAR HEADER: PHẲNG, TINH TẾ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-5 select-none">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600 stroke-[1.8]" />
            Cấu hình tài khoản quản trị cấp cao
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Thiết lập định danh cá nhân, giám sát đặc quyền tối cao và theo dõi
            vết nhật ký hệ thống Danjin BMS.
          </p>
        </div>
      </div>

      {/* 2. CHỦ THỂ IDENTIFICATION HERO (ĐẬP BỎ CARD - DẸT PHẲNG TRAN TRÀN VIỀN) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-slate-100 pb-6 select-none">
        {/* Avatar Khối Minimal vuông dẹt */}
        <div className="h-16 w-16 rounded-2xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center border border-slate-800 shadow-sm shrink-0">
          {profile.fullName.split(" ").pop()?.slice(0, 2).toUpperCase()}
        </div>

        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
              {profile.fullName}
            </h2>
            <Badge className="bg-rose-50 text-rose-700 border border-rose-100 text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-none select-none tracking-wider">
              {profile.role}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1 text-slate-600">
              <Briefcase size={13} className="text-slate-400" /> {profile.title}
            </span>
            <span className="hidden sm:inline text-slate-200">•</span>
            <span className="flex items-center gap-1 font-mono">
              <Fingerprint size={13} className="text-slate-400" /> ID:{" "}
              {profile.code}
            </span>
            <span className="hidden sm:inline text-slate-200">•</span>
            <span className="flex items-center gap-1">
              <CalendarDays size={13} className="text-slate-400" /> Lập tài
              khoản: {profile.joinedDate}
            </span>
          </div>
        </div>
      </div>

      {/* 3. LAYOUT CẤU TRÚC PHÂN CHIA HỆ THỐNG GRID 12 CỘT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= CỘT TRÁI (7/12): HỒ SƠ & BẢO MẬT ================= */}
        <div className="lg:col-span-7 space-y-8">
          {/* PHÂN KHU HỒ SƠ HÀNH CHÍNH */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2 select-none">
              <User size={13} className="text-slate-400" /> I. Lý lịch hành
              chính nhân sự
            </h3>

            <form
              onSubmit={handleUpdateInfo}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-medium"
            >
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide">
                  Họ và tên điều hành
                </label>
                <Input
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                  className="h-9 text-xs bg-white border-slate-200 rounded-lg font-semibold text-slate-800 focus-visible:border-slate-400 focus-visible:ring-0 shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide">
                  Số điện thoại liên lạc
                </label>
                <div className="relative flex items-center">
                  <Input
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="h-9 text-xs bg-white border-slate-200 rounded-lg font-mono font-bold text-slate-800 pl-8 focus-visible:border-slate-400 focus-visible:ring-0 shadow-2xs w-full"
                  />
                  <Phone
                    size={13}
                    className="absolute left-2.5 text-slate-400"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide">
                  Hòm thư điện tử đăng nhập (Email)
                </label>
                <div className="relative flex items-center">
                  <Input
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="h-9 text-xs bg-white border-slate-200 rounded-lg font-semibold text-slate-800 pl-8 focus-visible:border-slate-400 focus-visible:ring-0 shadow-2xs w-full"
                  />
                  <Mail
                    size={13}
                    className="absolute left-2.5 text-slate-400"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 pt-1 flex justify-end select-none">
                <Button
                  type="submit"
                  className="cursor-pointer h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-2xs flex gap-1.5 items-center active:scale-[0.99] transition-all"
                >
                  <Save size={13} />
                  Cập nhật thông tin hồ sơ
                </Button>
              </div>
            </form>
          </div>

          {/* PHÂN KHU THAY ĐỔI MẬT MÃ BẢO MẬT */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 select-none">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <KeyRound size={13} className="text-slate-400" /> II. Cấu hình
                khóa bảo mật lớp
              </h3>
              {!showPasswordForm && (
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer transition-colors"
                >
                  Yêu cầu cấp đổi mật mã
                </button>
              )}
            </div>

            {showPasswordForm ? (
              <form
                onSubmit={handleUpdatePassword}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <Input
                      type={showPass.old ? "text" : "password"}
                      value={passwords.oldPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          oldPassword: e.target.value,
                        })
                      }
                      className="h-9 pl-3 pr-8 text-xs font-mono rounded-lg border-slate-200 bg-white shadow-2xs focus-visible:border-slate-400 focus-visible:ring-0"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPass({ ...showPass, old: !showPass.old })
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPass.old ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <Input
                      type={showPass.new ? "text" : "password"}
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          newPassword: e.target.value,
                        })
                      }
                      className="h-9 pl-3 pr-8 text-xs font-mono rounded-lg border-slate-200 bg-white shadow-2xs focus-visible:border-slate-400 focus-visible:ring-0"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPass({ ...showPass, new: !showPass.new })
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPass.new ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">
                    Xác nhận mã mới
                  </label>
                  <Input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="h-9 text-xs font-mono rounded-lg border-slate-200 bg-white shadow-2xs focus-visible:border-slate-400 focus-visible:ring-0"
                    required
                  />
                </div>

                <div className="sm:col-span-3 pt-1 flex justify-end gap-2 select-none">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      resetForm();
                      setShowPasswordForm(false);
                    }}
                    className="h-9 text-xs font-semibold text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    className="cursor-pointer h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-2xs uppercase tracking-wider text-[10px]"
                  >
                    Xác nhận khóa mới
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-[11px] text-slate-400 font-medium italic select-none">
                Chuỗi mã khóa đăng nhập hệ thống được băm mật mã một chiều
                Bcrypt chuẩn lõi an toàn của máy chủ Danjin.
              </p>
            )}
          </div>
        </div>

        {/* ================= CỘT PHẢI (5/12): ĐẶC QUYỀN & TIMELINE AUDIT LOGS ================= */}
        <div className="lg:col-span-5 space-y-8">
          {/* PHÂN KHU ĐẶC QUYỀN HỆ THỐNG */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block select-none border-b border-slate-100 pb-2">
              Đặc quyền vận hành tối cao
            </span>
            <div className="flex flex-wrap gap-1.5 select-none pt-0.5">
              {profile.permissions.map((perm, idx) => (
                <div
                  key={idx}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded text-[10px] font-mono font-bold uppercase shadow-3xs ${
                    perm === "ALL_PRIVILEGES"
                      ? "bg-rose-50 text-rose-700 border-rose-100"
                      : "bg-slate-50 text-slate-600 border-slate-200/60"
                  }`}
                >
                  {perm}
                </div>
              ))}
            </div>
          </div>

          {/* PHÂN KHU TIMELINE AUDIT LOGS CHẠY DỌC CAO CẤP */}
          <div className="space-y-4">
            <div className="select-none">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Activity size={12} className="text-indigo-500 animate-pulse" />
                Nhật ký thao tác nghiệp vụ (Audit Logs)
              </span>
            </div>

            {/* Trục dọc timeline siêu dẹt, chìm sâu thanh mảnh */}
            <div className="space-y-5 pl-2 relative before:absolute before:left-1.75 before:top-2 before:bottom-2 before:w-px before:bg-slate-200/60">
              {profile.auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex gap-4.5 relative items-start text-xs group"
                >
                  {/* Chấm tròn node lặn chìm */}
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300 border border-white ring-2 ring-slate-50 mt-1.5 z-10 shrink-0 group-hover:bg-indigo-500 group-hover:ring-indigo-50 transition-colors" />

                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-slate-800 tracking-tight leading-normal truncate group-hover:text-indigo-950 transition-colors">
                        {log.action}
                      </p>
                      <span className="text-[9px] font-semibold text-slate-400 shrink-0 font-sans flex items-center gap-0.5 select-none">
                        <Clock size={10} className="stroke-[1.8]" /> {log.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[11px]">
                      <p className="text-slate-400 font-medium truncate">
                        Đối tượng:{" "}
                        <span className="text-slate-600 font-semibold">
                          {log.target}
                        </span>
                      </p>
                      <span className="text-[9px] font-mono font-medium text-slate-400 tracking-tight select-none">
                        IP: {log.ip}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ràng buộc bảo mật */}
            <div className="flex items-start gap-2 p-3 border border-dashed border-slate-200 rounded-xl bg-slate-50/30 text-[10px] text-slate-400 leading-relaxed font-medium select-none">
              <Terminal className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p>
                Mọi phiên tương tác vật lý lên chỉ số phòng, lõi bãi xe thông
                minh và hóa đơn cư dân của tài khoản{" "}
                <strong className="text-slate-500 font-bold">
                  khanhdv1902
                </strong>{" "}
                đều được ghi mã băm SHA-256 bất biến lên máy chủ bảo mật trung
                tâm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
