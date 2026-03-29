"use client";

import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Camera,
  Save,
  LogOut,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Switch } from "@/shared/components/ui/switch";
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

export default function ProfilePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-card p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="text-2xl">AD</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Admin Danjin</h1>
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-primary" /> Quản trị viên hệ
              thống
            </p>
            <div className="flex gap-2 mt-2">
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-700 hover:bg-blue-50"
              >
                Cấp bậc: High-Level
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            className="flex-1 md:flex-none text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
          </Button>
          <Button className="flex-1 md:flex-none">
            <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Thông tin liên lạc nhanh */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-foreground/80">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>admin@danjin.vn</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/80">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>0988.777.666</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/80">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Thanh Xuân, Hà Nội</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Tình trạng tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tài khoản của bạn đang ở trạng thái bảo mật cao nhất. Lần đăng
                nhập cuối cùng: <strong>01:30 AM hôm nay</strong> từ thiết bị{" "}
                <strong>Windows (Chrome)</strong>.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cột phải: Form cấu hình chi tiết */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="general">Cơ bản</TabsTrigger>
              <TabsTrigger value="security">Bảo mật</TabsTrigger>
              <TabsTrigger value="notifications">Thông báo</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Chỉnh sửa hồ sơ</CardTitle>
                  <CardDescription>
                    Cập nhật thông tin hiển thị công khai của bạn.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và tên</Label>
                      <Input id="name" defaultValue="Admin Danjin" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email liên hệ</Label>
                      <Input id="email" defaultValue="admin@danjin.vn" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Giới thiệu ngắn</Label>
                    <textarea
                      id="bio"
                      className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Viết vài dòng về bản thân..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Mật khẩu & Bảo mật</CardTitle>
                  <CardDescription>
                    Thay đổi mật khẩu và quản lý xác thực 2 lớp.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current">Mật khẩu hiện tại</Label>
                      <Input id="current" type="password" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new">Mật khẩu mới</Label>
                        <Input id="new" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm">Xác nhận mật khẩu</Label>
                        <Input id="confirm" type="password" />
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Xác thực 2 lớp (2FA)</Label>
                      <p className="text-xs text-muted-foreground">
                        Tăng cường bảo mật bằng mã gửi về điện thoại.
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt thông báo</CardTitle>
                  <CardDescription>
                    Chọn những gì bạn muốn hệ thống gửi về.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label>Thông báo hóa đơn mới</Label>
                      <p className="text-xs text-muted-foreground">
                        Khi có hóa đơn được tạo tự động hàng tháng.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label>Nhắc nhở thanh toán</Label>
                      <p className="text-xs text-muted-foreground">
                        Khi khách hàng quá hạn thanh toán 3 ngày.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
function Badge({ children, variant, className }: any) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
