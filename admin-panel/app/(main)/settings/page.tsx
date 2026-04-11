"use client";

import React from "react";
import {
  Settings,
  Building2,
  Zap,
  CreditCard,
  Bell,
  ShieldCheck,
  Save,
  Globe,
  Mail,
  Smartphone,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";

export default function SettingPage() {
  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8 bg-[#fbfcfd] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-8 h-8 text-primary" />
            Cấu hình hệ thống
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Thiết lập thông số vận hành, đơn giá và tích hợp cho Danjin.
          </p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4" /> Lưu tất cả thay đổi
        </Button>
      </div>

      <Tabs defaultValue="building" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 h-auto flex-wrap md:flex-nowrap">
          <TabsTrigger value="building" className="gap-2 px-4 py-2">
            <Building2 className="w-4 h-4" /> Tòa nhà
          </TabsTrigger>
          <TabsTrigger value="finance" className="gap-2 px-4 py-2">
            <Zap className="w-4 h-4" /> Đơn giá dịch vụ
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2 px-4 py-2">
            <CreditCard className="w-4 h-4" /> Thanh toán
          </TabsTrigger>
          <TabsTrigger value="notification" className="gap-2 px-4 py-2">
            <Bell className="w-4 h-4" /> Thông báo
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 px-4 py-2">
            <ShieldCheck className="w-4 h-4" /> Bảo mật
          </TabsTrigger>
        </TabsList>

        {/* 1. THÔNG TIN TÒA NHÀ */}
        <TabsContent value="building">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Thông tin vận hành</CardTitle>
              <CardDescription>
                Cập nhật thông tin pháp lý và thương hiệu của chung cư.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tên hiển thị hệ thống</Label>
                  <Input
                    placeholder="Danjin - Mini Apartment Manager"
                    defaultValue="Danjin A"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Địa chỉ tòa nhà</Label>
                  <Input placeholder="Số 123, đường ABC..." />
                </div>
                <div className="space-y-2">
                  <Label>Hotline kỹ thuật (24/7)</Label>
                  <Input placeholder="09xx.xxx.xxx" />
                </div>
                <div className="space-y-2">
                  <Label>Website tòa nhà</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-xs font-bold uppercase">
                      <Globe className="w-3 h-3 mr-1" /> https://
                    </span>
                    <Input className="rounded-l-none" placeholder="danjin.vn" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. ĐƠN GIÁ DỊCH VỤ (Cực kỳ quan trọng cho hệ thống của bạn) */}
        <TabsContent value="finance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm border-l-4 border-l-amber-400">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" /> Biểu giá Điện &
                  Nước
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Giá điện (VNĐ/kWh)</Label>
                  <Input type="number" defaultValue="3500" />
                </div>
                <div className="space-y-2">
                  <Label>Giá nước (VNĐ/m3)</Label>
                  <Input type="number" defaultValue="25000" />
                </div>
                <div className="space-y-2">
                  <Label>Định mức nước tối thiểu (Nếu có)</Label>
                  <Input type="number" placeholder="Ví dụ: 4m3" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm border-l-4 border-l-blue-400">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-500" /> Phí dịch vụ cố
                  định
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Phí quản lý (VNĐ/phòng)</Label>
                  <Input type="number" defaultValue="150000" />
                </div>
                <div className="space-y-2">
                  <Label>Phí gửi xe máy</Label>
                  <Input type="number" defaultValue="100000" />
                </div>
                <div className="space-y-2">
                  <Label>Phí thu gom rác</Label>
                  <Input type="number" defaultValue="30000" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 3. THANH TOÁN (Dành cho ZaloPay/QR Code của Khanh) */}
        <TabsContent value="payment">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Cổng thanh toán & Ngân hàng</CardTitle>
              <CardDescription>
                Cấu hình luồng nhận tiền và đối soát tự động.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#0085FF] rounded-lg flex items-center justify-center font-black text-white italic text-xs">
                    ZaloPay
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">
                      Tích hợp ZaloPay Merchant
                    </p>
                    <p className="text-xs text-slate-500 italic">
                      Xử lý giao dịch QR Code thời gian thực
                    </p>
                  </div>
                </div>
                <Switch checked={true} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2 text-sm">
                  <Label>App ID (ZaloPay)</Label>
                  <Input type="password" value="255312345678" readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Số tài khoản nhận tiền chính</Label>
                  <Input placeholder="Nhập STK ngân hàng..." />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. THÔNG BÁO (Dành cho WebSocket của Khanh) */}
        <TabsContent value="notification">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Kênh thông báo (Real-time)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium">
                    Gửi hóa đơn qua Email tự động
                  </span>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium">
                    Thông báo đẩy (App Push) khi có sự cố
                  </span>
                </div>
                <Switch checked />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium">
                    Nhắc nợ hóa đơn tự động (Ngày 5 hàng tháng)
                  </span>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
