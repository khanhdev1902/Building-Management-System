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
  Building2,
  Smartphone,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Terminal,
  Clock,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { toast } from "sonner";

// Mockup dữ liệu tài khoản quản trị tối cao Danjin BMS
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
  const [showPass, setShowPass] = useState({ old: false, new: false });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("✓ Cập nhật hồ sơ tài khoản quản trị thành công!");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Mật khẩu mới nhập lại không khớp trùng nhau!");
      return;
    }
    toast.success("✓ Đổi mật khẩu bảo mật hệ thống thành công!");
    setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setShowPasswordForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-5 bg-slate-50/20 min-h-screen antialiased font-sans select-none">
      {/* 1. TOP TITLE HEADER DẸT MẢNH */}
      <div className="border-b border-slate-200/60 pb-4">
        <h1 className="text-xl font-black tracking-tight text-slate-950 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600 stroke-[2.2]" />
          Cấu hình tài khoản quản trị cấp cao
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Thiết lập hồ sơ cá nhân, giám sát đặc quyền hệ thống và theo dõi vết
          nhật ký bảo mật Danjin BMS.
        </p>
      </div>

      {/* 2. LAYOUT GRID 12 CỘT BẤT ĐỐI XỨNG PHẲNG LÌ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= CỘT TRÁI (7/12): HỒ SƠ & THÔNG TIN CÁ NHÂN ================= */}
        <div className="lg:col-span-7 space-y-5">
          {/* CARD TỔNG QUAN AVATAR & NHÃN PHÂN QUYỀN VĂN PHÒNG */}
          <Card className="border border-slate-200/80 bg-white rounded-xl shadow-3xs overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-950" />
            <CardContent className="p-5 flex items-center gap-4 pt-6">
              <div className="h-16 w-16 rounded-xl bg-slate-950 text-white font-black text-xl flex items-center justify-center border border-slate-800 shadow-sm shrink-0">
                {profile.fullName.split(" ").pop()?.slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-slate-900 tracking-tight leading-none">
                    {profile.fullName}
                  </h2>
                  <Badge className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[9px] font-bold px-1.5 py-0 h-4.5 rounded uppercase shadow-none select-none">
                    {profile.role}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 font-medium font-sans flex items-center gap-1">
                  <Briefcase size={12} /> {profile.title}
                </p>
                <p className="text-[10px] text-slate-400 font-mono font-medium">
                  Mã quản trị: {profile.code} • Ngày gia nhập:{" "}
                  {profile.joinedDate}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* FORM NHẬP SỬA ĐỔI THÔNG TIN HÀNH CHÍNH */}
          <Card className="border border-slate-200/80 bg-white rounded-xl shadow-3xs">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                <User size={13} className="text-slate-400" /> I. Hồ sơ lý lịch
                hành chính
              </h3>

              <form
                onSubmit={handleUpdateInfo}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wide">
                    Họ và tên Admin
                  </label>
                  <Input
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                    className="h-8.5 text-xs bg-slate-50/30 border-slate-200 rounded-lg font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wide">
                    Số điện thoại liên hệ
                  </label>
                  <Input
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="h-8.5 text-xs bg-slate-50/30 border-slate-200 rounded-lg font-mono font-bold text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wide">
                    Địa chỉ thư điện tử (Email)
                  </label>
                  <Input
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="h-8.5 text-xs bg-slate-50/30 border-slate-200 rounded-lg font-semibold text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2 pt-1 flex justify-end">
                  <Button
                    type="submit"
                    className="h-8.5 px-4 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-lg shadow-3xs cursor-pointer uppercase tracking-wider text-[10px]"
                  >
                    Lưu thay đổi hồ sơ
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* KHỐI ĐỔI MẬT KHẨU BẢO MẬT HỆ THỐNG */}
          <Card className="border border-slate-200/80 bg-white rounded-xl shadow-3xs transition-all">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <KeyRound size={13} className="text-slate-400" /> II. Thay đổi
                  mã khóa bảo mật
                </h3>
                {!showPasswordForm && (
                  <Button
                    type="button"
                    onClick={() => setShowPasswordForm(true)}
                    variant="outline"
                    size="sm"
                    className="h-6 text-[10px] font-bold border-slate-200 text-slate-600 rounded"
                  >
                    Yêu cầu đổi
                  </Button>
                )}
              </div>

              {showPasswordForm ? (
                <form
                  onSubmit={handleUpdatePassword}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="space-y-1 relative">
                    <label className="text-[9px] font-bold uppercase text-slate-400 tracking-wide">
                      Mật khẩu cũ
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
                        className="h-8 pl-3 pr-7 text-xs font-mono rounded-lg border-slate-200 bg-slate-50/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPass({ ...showPass, old: !showPass.old })
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {showPass.old ? (
                          <EyeOff size={12} />
                        ) : (
                          <Eye size={12} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 relative">
                    <label className="text-[9px] font-bold uppercase text-slate-400 tracking-wide">
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
                        className="h-8 pl-3 pr-7 text-xs font-mono rounded-lg border-slate-200 bg-slate-50/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPass({ ...showPass, new: !showPass.new })
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {showPass.new ? (
                          <EyeOff size={12} />
                        ) : (
                          <Eye size={12} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-400 tracking-wide">
                      Xác nhận mật khẩu
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
                      className="h-8 font-mono text-xs rounded-lg border-slate-200 bg-slate-50/20"
                      required
                    />
                  </div>

                  <div className="sm:col-span-3 pt-1 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowPasswordForm(false)}
                      className="h-8 text-xs font-semibold text-slate-400 hover:text-slate-700 rounded-lg"
                    >
                      Hủy bỏ
                    </Button>
                    <Button
                      type="submit"
                      className="h-8 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-3xs uppercase text-[10px]"
                    >
                      Xác nhận khóa mới
                    </Button>
                  </div>
                </form>
              ) : (
                <p className="text-[11px] text-slate-400 font-medium italic">
                  Mật khẩu hệ thống được mã hóa một chiều Bcrypt chuẩn an toàn
                  dữ liệu máy chủ.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ================= CỘT PHẢI (5/12): ĐẶC QUYỀN HỆ THỐNG & AUDIT LOGS ================= */}
        <div className="lg:col-span-5 space-y-5">
          {/* BLOCK KHAI BÁO BẢNG ĐẶC QUYỀN PHÂN QUYỀN SÂU */}
          <Card className="border border-slate-200/80 bg-white rounded-xl shadow-3xs select-none">
            <CardContent className="p-5 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                Đặc quyền tài khoản quản trị
              </span>
              <div className="flex flex-wrap gap-1.5">
                {profile.permissions.map((perm, idx) => (
                  <div
                    key={idx}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded text-[9px] font-mono font-bold uppercase ${
                      perm === "ALL_PRIVILEGES"
                        ? "bg-rose-50 text-rose-700 border-rose-100/70 shadow-3xs"
                        : "bg-slate-50 text-slate-600 border-slate-200/50"
                    }`}
                  >
                    <span>{perm}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* BLOCK NHẬT KÝ HOẠT ĐỘNG (AUDIT LOGS CHÌM SANG TRỌNG) */}
          <Card className="border border-slate-200/80 bg-white rounded-xl shadow-3xs flex-1 flex flex-col justify-between">
            <CardContent className="p-5 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <Activity
                    size={12}
                    className="text-indigo-500 animate-pulse"
                  />{" "}
                  Nhật ký thao tác hệ thống (Audit Logs)
                </span>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Lưu vết 4 phiên hành động nghiệp vụ gần nhất.
                </p>
              </div>

              {/* Dải timeline nén phẳng lì cứng cáp */}
              <div className="space-y-3">
                {profile.auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/30 flex items-start justify-between gap-3 text-[11px] font-medium transition-colors hover:bg-slate-50/70"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-slate-800 font-bold tracking-tight truncate">
                        {log.action}
                      </p>
                      <p className="text-slate-400 text-[10px] font-sans truncate">
                        Đối tượng:{" "}
                        <span className="text-slate-600 font-semibold">
                          {log.target}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col items-end shrink-0 select-none text-right font-mono text-[9px] text-slate-400 space-y-0.5">
                      <span className="flex items-center gap-0.5 font-sans font-semibold text-slate-500">
                        <Clock size={9} />
                        {log.time}
                      </span>
                      <span>IP: {log.ip}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trích dẫn bảo mật dòng đáy khay */}
              <div className="flex items-start gap-1.5 p-2.5 border border-dashed border-slate-200 rounded-lg bg-slate-50/40 text-[10px] text-slate-400 leading-normal font-medium font-sans select-none">
                <Terminal className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <p>
                  Mọi phiên tương tác vật lý lên chỉ số phòng, lõi bãi xe và hóa
                  đơn cư dân đều được ghi mã băm tự động lên hệ thống phân tích
                  bảo mật trung tâm.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
