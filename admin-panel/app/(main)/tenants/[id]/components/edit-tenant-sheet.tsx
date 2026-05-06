/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { User, Home, Car, CalendarCheck, Clock } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

export function EditTenantSheet({ isOpen, onClose, tenantData }: any) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {/* Cố định chiều rộng và cấu hình flex để footer luôn nằm đáy */}
      <SheetContent className="sm:max-w-135 p-0 flex flex-col gap-0 border-l-slate-200">
        {/* HEADER CỐ ĐỊNH */}
        <SheetHeader className="relative p-8 border-b bg-white">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <User size={24} strokeWidth={2.5} />
            </div>
            <div>
              <SheetTitle className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                {tenantData.name}
              </SheetTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-indigo-100 bg-indigo-50/50 text-indigo-600 font-bold text-[10px] px-2 py-0"
                >
                  <Home size={10} className="mr-1" /> CĂN HỘ {tenantData.room}
                </Badge>
                <span className="text-slate-300 text-xs">|</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Clock size={10} /> Cập nhật: 02:18 AM
                </span>
              </div>
            </div>
          </div>

          {/* Nút đóng (X) mặc định của Shadcn sẽ nằm ở góc, ta không cần thêm */}
        </SheetHeader>

        {/* VÙNG NỘI DUNG CÓ THỂ CUỘN */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Nhóm 1: Thông tin cá nhân */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase text-indigo-600 tracking-[0.2em] flex items-center gap-2">
              <User size={14} className="stroke-[3px]" /> Định danh cư dân
            </h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-400">
                  Họ và tên khách hàng
                </Label>
                <Input
                  defaultValue={tenantData.name}
                  className="h-11 border-slate-200 font-medium focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase text-slate-400">
                    Số điện thoại
                  </Label>
                  <Input
                    defaultValue="0987 654 321"
                    className="h-11 border-slate-200 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase text-slate-400">
                    Email liên hệ
                  </Label>
                  <Input
                    defaultValue="anhnv@gmail.com"
                    className="h-11 border-slate-200 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Nhóm 2: Thông tin cư trú & Pháp lý */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase text-indigo-600 tracking-[0.2em] flex items-center gap-2">
              <CalendarCheck size={14} className="stroke-[3px]" /> Quản lý cư
              trú
            </h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase text-slate-400">
                    Trạng thái cư trú
                  </Label>
                  <Select defaultValue="active">
                    <SelectTrigger className="h-11 border-slate-200 font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="active"
                        className="text-emerald-600 font-bold"
                      >
                        Đang cư trú
                      </SelectItem>
                      <SelectItem value="temp">Tạm vắng</SelectItem>
                      <SelectItem value="out" className="text-red-500">
                        Đã checkout
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase text-slate-400">
                    Ngày đăng ký tạm trú
                  </Label>
                  <Input
                    type="date"
                    defaultValue="2026-01-15"
                    className="h-11 border-slate-200 font-medium text-slate-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Nhóm 3: Phương tiện (Mới bổ sung để nhân viên quản lý thẻ xe) */}
          <div className="space-y-4 pb-4">
            <h3 className="text-[11px] font-black uppercase text-indigo-600 tracking-[0.2em] flex items-center gap-2">
              <Car size={14} className="stroke-[3px]" /> Thông tin phương tiện
            </h3>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase text-slate-400">
                    Biển số xe chính
                  </Label>
                  <Input
                    defaultValue="29-G1 123.45"
                    className="h-11 border-slate-200 font-bold uppercase bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase text-slate-400">
                    Mã thẻ xe (RFID)
                  </Label>
                  <Input
                    defaultValue="#99120"
                    className="h-11 border-slate-200 font-mono font-bold bg-white"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full h-9 text-[11px] font-black uppercase border-dashed border-slate-300 text-slate-500"
              >
                + Thêm phương tiện khác
              </Button>
            </div>
          </div>
        </div>

        {/* FOOTER CỐ ĐỊNH - Giải quyết lỗi UI bị đè */}
        <SheetFooter className="p-6 border-t bg-white flex-row gap-3 sm:justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 sm:flex-none h-11 px-8 font-bold text-slate-500 hover:bg-slate-100"
          >
            Đóng
          </Button>
          <Button className="flex-1 sm:flex-none h-11 px-10 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xl shadow-slate-200 transition-all active:scale-95">
            Xác nhận cập nhật
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
