/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { AlertCircle, FileCheck2, User, Bike } from "lucide-react";

export function ContractLivePreview() {
  const { watch } = useFormContext();
  const watchedValues = watch();

  // 1. Thuật toán tự động tính ngày đáo hạn hợp đồng chuẩn chu kỳ tháng
  const endDate = useMemo(() => {
    if (!watchedValues.startDate || !watchedValues.duration) return "---";
    const start = new Date(watchedValues.startDate);
    start.setMonth(start.getMonth() + Number(watchedValues.duration));
    return start.toISOString().split("T")[0].split("-").reverse().join("/");
  }, [watchedValues.startDate, watchedValues.duration]);

  // Helper format nhanh ngày sinh YYYY-MM-DD sang DD/MM/YYYY hiển thị phôi chứng từ
  const formatVietnameseDate = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split("-").reverse().join("/");
  };

  return (
    <div className="lg:col-span-5 bg-slate-50/40 p-6 md:p-8 space-y-4 flex flex-col justify-start select-none border-t lg:border-t-0 border-slate-100/80">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1 pb-1">
        <FileCheck2 size={12} className="text-slate-400" /> Xem trước phôi chứng
        từ
      </h3>

      {/* MẶT GIẤY BIÊN BẢN CHỨNG TỪ SỐ HÓA PHẲNG LÌ */}
      <div className="bg-white p-5.5 shadow-[0_1px_3px_rgba(15,23,42,0.01),0_10px_32px_-12px_rgba(15,23,42,0.03)] space-y-4 rounded-xl border border-slate-200/60 relative overflow-hidden flex-1 flex flex-col justify-between">
        {/* Đường line định vị đỉnh thẻ dẹt mảnh */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900" />

        <div className="space-y-4">
          {/* KHỐI 1: HỒ SƠ LÝ LỊCH ĐẠI DIỆN PHÁP LÝ (BÊN B) */}
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
              Đại diện pháp lý bên thuê (Bên B)
            </span>

            <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5">
                <User size={13} className="text-slate-400" />
                <p className="text-xs font-black text-slate-900 tracking-tight truncate leading-none">
                  {watchedValues.tenantName || (
                    <span className="text-slate-300 italic">
                      Chưa có thông tin...
                    </span>
                  )}
                </p>
              </div>

              {/* Dải thông số lý lịch hiển thị phẳng mượt nếu có dữ liệu */}
              {(watchedValues.phone || watchedValues.cccd) && (
                <div className="text-[11px] font-medium text-slate-500 space-y-1 pt-1 border-t border-slate-100/60">
                  {watchedValues.phone && (
                    <p className="">
                      Liên lạc:{" "}
                      <strong className="text-slate-800 font-bold">
                        {watchedValues.phone}
                      </strong>{" "}
                      - {watchedValues.occupation}
                    </p>
                  )}
                  {watchedValues.cccd && (
                    <p className="">
                      CCCD:{" "}
                      <strong className="text-slate-800 font-bold">
                        {watchedValues.cccd}
                      </strong>
                    </p>
                  )}
                  {watchedValues.birthday && (
                    <p>
                      Ngày sinh: {formatVietnameseDate(watchedValues.birthday)}{" "}
                      - Giới tính: {watchedValues.gender}
                    </p>
                  )}
                  {watchedValues.hometown && (
                    <p className="leading-relaxed truncate">
                      Quê quán: {watchedValues.hometown}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* KHỐI 2: KHUNG TÀI KHÓA MẶT BẰNG & THỜI HẠN ĐỐI SOÁT CHI TIẾT */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-b border-slate-100 py-3.5 font-sans text-xs font-medium text-slate-600">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[9px] font-bold uppercase tracking-tight block">
                Phòng bàn giao
              </span>
              <span className="font-black text-slate-900">
                {watchedValues.roomNumber || "---"}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 text-[9px] font-bold uppercase tracking-tight block">
                Chu kỳ tài khóa
              </span>
              <span className="font-bold text-slate-800">
                {watchedValues.paymentCycle
                  ? `Thanh toán ${watchedValues.paymentCycle} tháng/lần`
                  : "---"}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 text-[9px] font-bold uppercase tracking-tight block">
                Giá thuê phòng
              </span>
              <span className="font-bold text-slate-800">
                {watchedValues.rentPrice
                  ? `${Number(watchedValues.rentPrice || 0).toLocaleString("vi-VN")}đ`
                  : "---"}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 text-[9px] font-bold uppercase tracking-tight block">
                Quỹ bảo chứng (Cọc)
              </span>
              <span className="font-bold text-slate-800">
                {watchedValues.deposit
                  ? `${Number(watchedValues.deposit || 0).toLocaleString("vi-VN")}đ`
                  : "---"}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 text-[9px] font-bold uppercase tracking-tight block">
                Kích hoạt hiệu lực
              </span>
              <span className="font-bold text-slate-700">
                {watchedValues.startDate?.split("-").reverse().join("/") || "---"}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 text-[9px] font-bold uppercase tracking-tight block">
                Đáo hạn cam kết
              </span>
              <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                {endDate}
              </span>
            </div>
          </div>

          {/* KHỐI 3: BẢNG KÊ CÁC ĐỊNH MỨC DỊCH VỤ ĐI KÈM PHÒNG */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
              Bảng kê cước tiện ích áp phòng cứng
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(watchedValues.services || []).map(
                (s: any) =>
                  s.name && (
                    <div
                      key={s.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-slate-600 font-mono text-[9px] font-bold select-none"
                    >
                      <span className="text-slate-400">{s.name}:</span>
                      <span className="text-slate-800 font-extrabold">
                        {Number(s.price || 0).toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  ),
              )}
            </div>
          </div>

          {/* Khay hiển thị luồng xe cộ IoT của chủ hộ gửi hầm nếu có phát sinh dữ liệu */}
          {watchedValues.tenantVehicles &&
            watchedValues.tenantVehicles.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-0.5">
                  <Bike size={10} /> Phương tiện IoT chủ hộ gửi hầm
                </span>
                <div className="flex flex-wrap gap-1">
                  {watchedValues.tenantVehicles.map(
                    (v: any, idx: number) =>
                      v.licensePlate && (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-900 text-white rounded font-mono text-[9px] font-bold uppercase"
                        >
                          <span className="text-slate-400 text-[8px] font-sans">
                            {v.type}:
                          </span>
                          <span>{v.licensePlate}</span>
                        </div>
                      ),
                  )}
                </div>
              </div>
            )}
        </div>

        {/* KHỐI CHÂN: TỔNG TIỀN PHÒNG NGÀY BÀN GIAO ĐỔI SANG SLATE ĐẬM SANG TRỌNG */}
        <div className="space-y-3 mt-auto">
          <div className="space-y-1.5 p-3.5 bg-slate-950 text-white rounded-xl relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-radial from-white/5 to-transparent opacity-30 pointer-events-none" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block leading-none">
              Tổng tiền thanh thoán hợp đồng (Cọc + Tháng đầu)
            </span>

            <div className="flex items-baseline justify-between pt-1">
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-black font-mono tracking-tight leading-none text-white">
                  {(
                    Number(watchedValues.deposit || 0) +
                    Number(watchedValues.rentPrice || 0)
                  ).toLocaleString("vi-VN")}
                </span>
                <span className="text-[10px] font-bold font-sans opacity-60 ml-0.5 text-slate-400">
                  VND
                </span>
              </div>

              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold rounded px-1.5 py-0 h-4 uppercase tracking-tight shadow-none select-none">
                Đơn vị tính: VNĐ
              </Badge>
            </div>
          </div>

          {/* Dòng ghi chú chốt hạ phần cứng công tơ nền vật lý */}
          <div className="flex items-start gap-1.5 p-2.5 border border-dashed border-slate-200 rounded-lg bg-slate-50/40 text-[10px] text-slate-500 leading-normal font-medium font-sans select-none">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <p>
              Hệ thống ghi nhận chỉ số bàn giao nền:{" "}
              <span className="font-mono font-bold text-slate-800">
                {watchedValues.electricStart || 0} kWh
              </span>{" "}
              điện và{" "}
              <span className="font-mono font-bold text-slate-800">
                {watchedValues.waterStart || 0} m³
              </span>{" "}
              nước.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Badge helper dẹt gọn bọc lót hiển thị
function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`inline-flex items-center font-semibold transition-colors ${className}`}
    >
      {children}
    </div>
  );
}
