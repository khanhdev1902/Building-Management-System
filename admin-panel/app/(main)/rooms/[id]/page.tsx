/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  User,
  Zap,
  Droplets,
  Wifi,
  Wind,
  Tv,
  Refrigerator,
  ClipboardList,
  Calendar,
  ShieldCheck,
  Wrench,
  History,
  Edit3,
  Trash2,
  Plus,
  Save,
  X,
  Users,
  FileText,
  CheckCircle2,
  Settings2,
  Info,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export default function RoomDetailPage() {
  // 1. Quản lý State dữ liệu phòng
  const [room, setRoom] = useState({
    name: "Phòng 101",
    type: "Studio - Full nội thất",
    floor: "1",
    area: "28",
    price: "5500000",
    deposit: "11000000",
    status: "occupied",
    tenant: {
      owner: {
        name: "Nguyễn Văn A",
        phone: "0901 234 567",
        email: "vanda@gmail.com",
        cccd: "00109200xxxx",
      },
      members: [
        { id: 1, name: "Trần Thị B", relationship: "Vợ" },
        { id: 2, name: "Nguyễn Văn C", relationship: "Con" },
      ],
    },
    // Dịch vụ cố định (không cho xóa)
    fixedServices: [
      { id: "s1", name: "Điện", price: "3.500đ/kWh", type: "electric" },
      { id: "s2", name: "Nước", price: "100.000đ/người", type: "water" },
    ],
    // Dịch vụ linh hoạt (có thể thêm/bớt)
    extraServices: [
      {
        id: "e1",
        name: "Internet High-speed",
        price: "150.000đ/phòng",
        icon: <Wifi className="w-4 h-4" />,
      },
    ],
    facilities: [
      { id: 1, name: "Điều hòa", brand: "Daikin" },
      { id: 2, name: "Tủ lạnh", brand: "Samsung" },
    ],
    contracts: [
      {
        id: "HD001",
        startDate: "15/01/2024",
        endDate: "15/01/2025",
        status: "active",
        price: "5.500.000",
      },
      {
        id: "HD000",
        startDate: "15/01/2023",
        endDate: "14/01/2024",
        status: "expired",
        price: "5.200.000",
      },
    ],
  });

  const [isEditOpen, setIsEditOpen] = useState(false);

  // --- Logic Xử lý Dịch vụ ---
  const addExtraService = () => {
    const newService = {
      id: Date.now().toString(),
      name: "Dịch vụ mới",
      price: "0đ",
      icon: <Settings2 className="w-4 h-4" />,
    };
    setRoom({ ...room, extraServices: [...room.extraServices, newService] });
  };

  const removeExtraService = (id: string) => {
    setRoom({
      ...room,
      extraServices: room.extraServices.filter((s) => s.id !== id),
    });
  };

  // --- Logic Cập nhật Phòng ---
  const handleUpdateRoom = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setRoom({
      ...room,
      name: formData.get("name") as string,
      floor: formData.get("floor") as string,
      price: formData.get("price") as string,
      area: formData.get("area") as string,
    });
    setIsEditOpen(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50/50 min-h-screen">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white shadow-sm border-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                {room.name}
              </h1>
              <Badge className="bg-emerald-100 text-emerald-700 border-none px-3 font-bold">
                ĐANG THUÊ
              </Badge>
            </div>
            <p className="text-slate-500 font-medium tracking-wide uppercase text-[11px] mt-1 flex items-center gap-2">
              Tầng {room.floor} <span className="text-slate-300">|</span>{" "}
              {room.area}m² <span className="text-slate-300">|</span>{" "}
              {room.type}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 bg-white hover:bg-slate-50 transition-all font-semibold"
              >
                <Edit3 className="mr-2 h-4 w-4" /> Sửa thông tin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Cập nhật chi tiết phòng
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateRoom} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>Tên phòng</Label>
                    <Input
                      name="name"
                      defaultValue={room.name}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tầng</Label>
                    <Input
                      name="floor"
                      defaultValue={room.floor}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Diện tích (m²)</Label>
                    <Input
                      name="area"
                      defaultValue={room.area}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Giá thuê gốc (đ/tháng)</Label>
                    <Input
                      name="price"
                      type="number"
                      defaultValue={room.price}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 rounded-xl h-11 font-bold"
                  >
                    Lưu thay đổi
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 font-bold px-6">
            Lập hợp đồng mới
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* A. THÔNG TIN KHÁCH THUÊ */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-50 py-4 px-6">
              <CardTitle className="text-lg flex items-center gap-2 font-bold">
                <Users className="w-5 h-5 text-indigo-500" /> Khách thuê hiện
                tại
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Chủ phòng */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" /> Người đại diện (Chủ HĐ)
                  </div>
                  <div className="p-5 rounded-3xl bg-indigo-50/40 border border-indigo-100/50 space-y-4">
                    <InfoItem
                      label="Họ tên"
                      value={room.tenant.owner.name}
                      bold
                    />
                    <InfoItem
                      label="Số điện thoại"
                      value={room.tenant.owner.phone}
                    />
                    <InfoItem label="Số CCCD" value={room.tenant.owner.cccd} />
                  </div>
                </div>
                {/* Thành viên */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" /> Thành viên (
                      {room.tenant.members.length})
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-indigo-600 hover:bg-indigo-50 rounded-lg text-[11px] font-bold"
                    >
                      + THÊM
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                    {room.tenant.members.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 transition-all group"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {m.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold">
                            {m.relationship}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* B. CƠ SỞ VẬT CHẤT */}
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 px-6">
              <CardTitle className="text-lg flex items-center gap-2 font-bold">
                <ClipboardList className="w-5 h-5 text-indigo-500" /> Cơ sở vật
                chất
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-indigo-600 font-bold text-[11px] hover:bg-indigo-50"
              >
                QUẢN LÝ
              </Button>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {room.facilities.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 rounded-3xl bg-slate-50 border border-transparent hover:border-indigo-100 transition-all text-center relative group"
                  >
                    <div className="mx-auto w-10 h-10 rounded-2xl bg-white flex items-center justify-center mb-3 shadow-sm text-slate-400 border border-slate-100 group-hover:text-indigo-500 transition-colors">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-slate-800 leading-tight">
                      {f.name}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium italic">
                      {f.brand}
                    </p>
                  </div>
                ))}
                <button className="p-4 rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center hover:bg-slate-50 hover:border-indigo-200 transition-all group">
                  <Plus className="w-5 h-5 text-slate-300 group-hover:text-indigo-500" />
                  <span className="text-[10px] font-bold text-slate-400 mt-1 group-hover:text-indigo-600 uppercase tracking-tighter">
                    Thêm đồ
                  </span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CỘT PHẢI: DỊCH VỤ & GIÁ CẢ */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <div className="p-6 bg-indigo-600 text-white relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase opacity-70 tracking-[0.2em]">
                  Tổng giá thuê gốc
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <h2 className="text-4xl font-black">
                    {Number(room.price).toLocaleString()}
                  </h2>
                  <span className="text-sm font-bold opacity-80">đ/tháng</span>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Zap className="w-24 h-24" />
              </div>
            </div>

            <CardContent className="p-6 space-y-5">
              {/* Dịch vụ cố định */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Tiện ích cố định
                  </p>
                  <Info className="w-3 h-3 text-slate-300" />
                </div>
                {room.fixedServices.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-indigo-500">
                        {s.type === "electric" ? (
                          <Zap className="w-4 h-4" />
                        ) : (
                          <Droplets className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-sm font-bold text-slate-700">
                        {s.name}
                      </span>
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      {s.price}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="bg-slate-100" />

              {/* Dịch vụ linh hoạt */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Dịch vụ cộng thêm
                  </p>
                  <Button
                    onClick={addExtraService}
                    variant="ghost"
                    size="sm"
                    className="h-6 text-indigo-600 hover:bg-indigo-50 font-bold text-[10px]"
                  >
                    + THÊM
                  </Button>
                </div>
                <div className="space-y-2">
                  {room.extraServices.length === 0 && (
                    <p className="text-[11px] text-slate-400 text-center py-2 italic border-2 border-dashed border-slate-50 rounded-2xl">
                      Chưa đăng ký dịch vụ thêm
                    </p>
                  )}
                  {room.extraServices.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-2xl transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                          {s.icon}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-700">
                            {s.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold tracking-tight">
                            {s.price}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => removeExtraService(s.id)}
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-slate-100" />
              <InfoItem
                label="Tiền cọc giữ chỗ"
                value={Number(room.deposit).toLocaleString() + " đ"}
                bold
                color="text-indigo-600"
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl bg-slate-900 text-white p-6 relative overflow-hidden group">
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Ghi chú quản lý
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                "Khách thuê rất kỹ tính, phòng luôn sạch sẽ. Cần lưu ý bảo trì
                máy lạnh định kỳ mỗi 6 tháng."
              </p>
            </div>
            <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/10 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
          </Card>
        </div>
      </div>

      {/* 2. DANH SÁCH HỢP ĐỒNG */}
      <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-50 px-8 py-5">
          <CardTitle className="text-lg flex items-center gap-2 font-bold">
            <FileText className="w-5 h-5 text-indigo-500" /> Lịch sử thuê & Hợp
            đồng
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="py-5">Mã số HĐ</th>
                  <th className="py-5">Giai đoạn</th>
                  <th className="py-5">Giá chốt</th>
                  <th className="py-5">Trạng thái</th>
                  <th className="py-5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {room.contracts.map((ct) => (
                  <tr
                    key={ct.id}
                    className="border-b border-slate-50 group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-5 font-black text-slate-900">{ct.id}</td>
                    <td className="py-5 text-slate-500 font-medium">
                      {ct.startDate}{" "}
                      <span className="mx-2 text-slate-300">→</span>{" "}
                      {ct.endDate}
                    </td>
                    <td className="py-5 font-black text-indigo-600">
                      {Number(ct.price).toLocaleString()}đ
                    </td>
                    <td className="py-5">
                      {ct.status === "active" ? (
                        <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 flex items-center w-fit gap-1 font-bold shadow-none">
                          <CheckCircle2 className="w-3 h-3" /> Đang hiệu lực
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-slate-400 border-slate-200 font-bold px-3 py-1 shadow-none"
                        >
                          Đã hoàn thành
                        </Badge>
                      )}
                    </td>
                    <td className="py-5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-indigo-600 font-black text-[11px] hover:bg-indigo-50 rounded-xl"
                      >
                        XEM CHI TIẾT
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Sub-component tinh gọn
function InfoItem({
  label,
  value,
  bold,
  color,
}: {
  label: string;
  value: string;
  bold?: boolean;
  color?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
        {label}
      </p>
      <p
        className={`text-sm ${bold ? "font-black" : "font-semibold"} ${color || "text-slate-900"}`}
      >
        {value}
      </p>
    </div>
  );
}
