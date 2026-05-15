"use client";

import React, { useState } from "react";
import {
  Mail,
  ShieldCheck,
  Camera,
  Save,
  LogOut,
  Fingerprint,
  Calendar,
  Loader2,
  Lock,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

const INITIAL_DATA = {
  id: "21f26108-6a68-44eb-8e39-654586eb6b50",
  email: "khach-thue-04@gmail.com",
  role: "TENANT",
  firstName: "Khánh",
  lastName: "Nguyễn",
  phone: "0987654329",
  gender: "male",
  avatarUrl: null,
  isActive: true,
  tenantProfile: {
    id: "c3f8e39a-9b4c-4c80-bc44-ba993492cc90",
    citizenId: "001203004524",
    dateOfBirth: "2002-05-15T00:00:00.000Z",
    permanentAddress: "100 Nguyễn Xiển, Hà Nội",
    occupation: "Kỹ sư phần mềm",
    isHost: true,
  },
};

export default function ProfilePage() {
  const [user, setUser] = useState(INITIAL_DATA);
  const [isUpdating, setIsUpdating] = useState(false);

  // State cho mật khẩu
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser((prev) => ({ ...prev, [id]: value }));
  };

  const handleTenantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser((prev) => ({
      ...prev,
      tenantProfile: { ...prev.tenantProfile, [id]: value },
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [id]: value }));
  };

  const onSave = async () => {
    setIsUpdating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Dữ liệu cập nhật:", { user, passwordData });
    alert("Cập nhật thông tin thành công!");
    setIsUpdating(false);
  };

  const fullName = `${user.lastName} ${user.firstName}`;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-card p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={user.avatarUrl || ""} />
              <AvatarFallback className="text-2xl bg-indigo-600 text-white font-bold">
                {user.lastName[0]}
                {user.firstName[0]}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full border shadow-sm hover:bg-indigo-50"
            >
              <Camera className="h-4 w-4 text-indigo-600" />
            </Button>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                Cư dân
              </Badge>
              {user.tenantProfile?.isHost && (
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                  Chủ hộ
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            className="flex-1 md:flex-none text-red-500 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" /> Thoát
          </Button>
          <Button
            className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 transition-all"
            onClick={onSave}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- CỘT TRÁI --- */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Hồ sơ định danh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <InfoRow
                icon={<Fingerprint />}
                label="CCCD"
                value={user.tenantProfile.citizenId}
              />
              <InfoRow
                icon={<Calendar />}
                label="Ngày sinh"
                value={new Date(
                  user.tenantProfile.dateOfBirth,
                ).toLocaleDateString("vi-VN")}
              />
              <InfoRow
                icon={<Mail />}
                label="Email"
                value={user.email}
                isMuted
              />
            </CardContent>
          </Card>
        </div>

        {/* --- CỘT PHẢI: TABS --- */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 shadow-sm border">
              <TabsTrigger value="general">Thông tin</TabsTrigger>
              <TabsTrigger value="address">Cư trú</TabsTrigger>
              <TabsTrigger value="security">Mật khẩu</TabsTrigger>
            </TabsList>

            {/* TAB 1: THÔNG TIN CHUNG */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Cá nhân & Liên lạc</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Họ và tên đệm</Label>
                      <Input
                        id="lastName"
                        value={user.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Tên</Label>
                      <Input
                        id="firstName"
                        value={user.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        value={user.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: CƯ TRÚ */}
            <TabsContent value="address">
              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết cư trú</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Nghề nghiệp hiện tại</Label>
                    <Input
                      id="occupation"
                      value={user.tenantProfile.occupation}
                      onChange={handleTenantChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="permanentAddress">Địa chỉ thường trú</Label>
                    <Input
                      id="permanentAddress"
                      value={user.tenantProfile.permanentAddress}
                      onChange={handleTenantChange}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: MẬT KHẨU (MỚI THÊM) */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Đổi mật khẩu</CardTitle>
                  <CardDescription>
                    Để đảm bảo an toàn, vui lòng không chia sẻ mật khẩu với
                    người khác.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="oldPassword"
                        type="password"
                        className="pl-10"
                        placeholder="Nhập mật khẩu cũ"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Mật khẩu mới</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Tối thiểu 8 ký tự"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Xác nhận mật khẩu mới
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </div>

                  {passwordData.newPassword &&
                    passwordData.confirmPassword &&
                    passwordData.newPassword !==
                      passwordData.confirmPassword && (
                      <p className="text-xs text-red-500 font-medium italic">
                        * Mật khẩu xác nhận không khớp.
                      </p>
                    )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// --- HỖ TRỢ ---
function InfoRow({
  icon,
  label,
  value,
  isMuted = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isMuted?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="text-indigo-500 w-4 h-4">{icon}</div>
      <span className="text-muted-foreground w-20">{label}:</span>
      <span
        className={`font-medium ${isMuted ? "text-muted-foreground italic" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${className}`}
    >
      {children}
    </span>
  );
}
