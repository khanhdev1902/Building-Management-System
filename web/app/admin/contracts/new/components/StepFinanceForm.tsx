"use client";

import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { ChevronDown, Home } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { FormGroup } from "./FormGroup";
import { RoomResponse } from "@/app/admin/rooms/types/room.type";
import { roomApi } from "@/app/admin/rooms/apis/room.api";

export function StepFinanceForm() {
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext();

  const paymentCycleValue = watch("paymentCycle");
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [openRoomList, setOpenRoomList] = useState(false);

  // Luồng Fetching đồng bộ danh mục quỹ phòng từ Server Danjin
  useEffect(() => {
    const getRooms = async () => {
      try {
        const res = await roomApi.getAllRooms();
        setRooms(res.data || []);
      } catch (error) {
        console.error("Lỗi đồng bộ quỹ phòng trống:", error);
      }
    };
    getRooms();
  }, []);

  // Hàm helper: Biến số nguyên thành chuỗi phân tách dấu chấm Việt Nam
  const formatCurrency = (value: string | number) => {
    if (!value && value !== 0) return "";
    const stringValue = value.toString().replace(/\D/g, "");
    return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Hàm helper: Bóc sạch dấu chấm để trả về số nguyên cho Zod Schema
  const parseCurrency = (value: string) => {
    const num = parseInt(value.replace(/\./g, ""), 10);
    return isNaN(num) ? 0 : num;
  };

  const handleSelectRoom = (room: RoomResponse) => {
    setValue("roomNumber", room.roomNumber);
    setValue("rentPrice", room.roomPrice);
    setValue("deposit", room.roomPrice * 2); // Mặc định cọc bằng 2 tháng tiền nhà
    setOpenRoomList(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-50 pb-1">
        II. Khung tài khóa, cam kết thời hạn & Chỉ số công tơ nền
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Ô CHỌN SỐ PHÒNG LAI GIỮ NGUYÊN BIÊN ĐỘ TÁC VỤ */}
        <FormGroup
          label="Số phòng ký kết"
          error={errors.roomNumber?.message as string}
        >
          <div className="relative flex items-center w-full group">
            <Input
              disabled={true}
              {...register("roomNumber")}
              placeholder="Nhập số phòng hoặc chọn nhanh..."
              className="h-8.5 text-xs font-mono font-bold bg-slate-50/40 border-slate-200 rounded-lg pr-8 focus-visible:bg-white transition-all w-full"
            />
            <Popover open={openRoomList} onOpenChange={setOpenRoomList}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="absolute right-0 top-0 h-8.5 w-8 flex items-center justify-center text-slate-400 hover:text-slate-800 border-l border-slate-200/60 transition-colors cursor-pointer"
                >
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${openRoomList ? "rotate-180" : ""}`}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="p-1 w-64 rounded-xl border border-slate-200 shadow-md bg-white select-none"
                align="end"
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1.5 border-b border-slate-50">
                  Danh sách quỹ phòng hiện có
                </div>
                <div className="max-h-48 overflow-y-auto pt-0.5">
                  {rooms.length === 0 ? (
                    <p className="text-[11px] text-slate-400 p-3 italic text-center">
                      Không tìm thấy phòng trống khả dụng
                    </p>
                  ) : (
                    rooms.map((room) => (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => handleSelectRoom(room)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-50 transition-colors flex items-center justify-between font-medium group cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <Home
                            size={12}
                            className="text-slate-400 group-hover:text-indigo-600"
                          />
                          <span className="font-mono font-bold text-slate-800">
                            {room.roomNumber}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-500 font-bold">
                          {Number(room?.roomPrice ?? 0).toLocaleString("vi-VN")}
                          đ
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </FormGroup>

        {/* Ô GIÁ THUÊ CỨNG: Bọc Controller định dạng dấu chấm Việt Nam */}
        <FormGroup
          label="Giá thuê cứng / Tháng (VND)"
          error={errors.rentPrice?.message as string}
        >
          <Controller
            name="rentPrice"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                type="text"
                value={formatCurrency(value)}
                onChange={(e) => onChange(parseCurrency(e.target.value))}
                placeholder="6.500.000"
                className="h-8.5 text-xs font-mono font-bold bg-slate-50/40 border-slate-200 rounded-lg focus-visible:bg-white transition-all text-right pr-3"
              />
            )}
          />
        </FormGroup>

        {/* Ô TIỀN CỌC GIỮ PHÒNG: Bọc Controller định dạng dấu chấm Việt Nam */}
        <FormGroup
          label="Quỹ tiền đặt cọc giữ phòng (VND)"
          error={errors.deposit?.message as string}
        >
          <Controller
            name="deposit"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                type="text"
                value={formatCurrency(value)}
                onChange={(e) => onChange(parseCurrency(e.target.value))}
                placeholder="13.000.000"
                className="h-8.5 text-xs font-mono font-bold bg-slate-50/40 border-slate-200 rounded-lg text-indigo-600 focus-visible:bg-white transition-all text-right pr-3"
              />
            )}
          />
        </FormGroup>

        <FormGroup
          label="Thời hạn cam kết ở (Tháng)"
          error={errors.duration?.message as string}
        >
          <Input
            type="number"
            {...register("duration", { valueAsNumber: true })}
            className="h-8.5 text-xs font-mono font-bold bg-slate-50/40 border-slate-200 rounded-lg focus-visible:bg-white transition-all"
          />
        </FormGroup>

        <FormGroup
          label="Ngày hợp đồng bắt đầu tính tiền"
          error={errors.startDate?.message as string}
        >
          <Input
            type="date"
            {...register("startDate")}
            className="h-8.5 text-xs bg-slate-50/40 border-slate-200 rounded-lg focus-visible:bg-white transition-all"
          />
        </FormGroup>

        <FormGroup label="Chu kỳ đóng tiền định kỳ">
          <Select
            value={paymentCycleValue}
            onValueChange={(val) => setValue("paymentCycle", val)}
          >
            <SelectTrigger className="h-8.5 border-slate-200 bg-slate-50/40 rounded-lg text-xs font-semibold px-2.5 shadow-none focus:ring-0 cursor-pointer">
              <SelectValue placeholder="Chọn chu kỳ đóng tiền" />
            </SelectTrigger>
            <SelectContent className="p-1 rounded-lg border-slate-200 shadow-sm">
              <SelectItem value="1" className="text-xs">
                Đóng tiền hàng tháng
              </SelectItem>
              <SelectItem value="3" className="text-xs">
                Đóng tiền 3 tháng / lần
              </SelectItem>
              <SelectItem value="6" className="text-xs">
                Đóng tiền 6 tháng / lần
              </SelectItem>
            </SelectContent>
          </Select>
        </FormGroup>

        <div className="sm:col-span-2 grid grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-100 rounded-xl select-none">
          <FormGroup
            label="Chỉ số ĐIỆN đầu kỳ chốt bàn giao"
            error={errors.electricStart?.message as string}
          >
            <Input
              type="number"
              {...register("electricStart", { valueAsNumber: true })}
              className="h-8 text-xs bg-white border-slate-200 rounded-md font-mono font-bold text-slate-800"
            />
          </FormGroup>
          <FormGroup
            label="Chỉ số NƯỚC đầu kỳ chốt bàn giao"
            error={errors.waterStart?.message as string}
          >
            <Input
              type="number"
              {...register("waterStart", { valueAsNumber: true })}
              className="h-8 text-xs bg-white border-slate-200 rounded-md font-mono font-bold text-slate-800"
            />
          </FormGroup>
        </div>
      </div>
    </div>
  );
}
