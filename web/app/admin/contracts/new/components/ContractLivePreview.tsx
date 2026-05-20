/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";

export function ContractLivePreview() {
  const { watch } = useFormContext();
  const watchedValues = watch();

  const endDate = useMemo(() => {
    if (!watchedValues.startDate || !watchedValues.duration) return "—";
    const start = new Date(watchedValues.startDate);
    start.setMonth(start.getMonth() + Number(watchedValues.duration));
    return start.toISOString().split("T")[0].split("-").reverse().join("/");
  }, [watchedValues.startDate, watchedValues.duration]);

  return (
    <div className="lg:col-span-5 bg-slate-50/30 p-6 md:p-8 space-y-4 flex flex-col justify-start select-none border-t lg:border-t-0 border-slate-100">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200/50 pb-2.5">
        Xem trước phôi chứng từ luồng
      </h3>

      <div className="bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.02)] space-y-4.5 rounded-xl border border-slate-200/60 relative overflow-hidden flex-1 flex flex-col">
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900" />

        <div className="space-y-0.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">
            Đại diện pháp lý bên thuê (Bên B)
          </span>
          <p className="text-sm font-extrabold text-slate-900 tracking-tight truncate">
            {watchedValues.tenantName || (
              <span className="text-slate-300 italic font-medium">
                Chờ nhập họ tên...
              </span>
            )}
          </p>
          {watchedValues.phone && (
            <span className="text-[10px] font-mono text-slate-400 block font-medium mt-0.5">
              Liên lạc: {watchedValues.phone} • Job: {watchedValues.occupation}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 border-t border-b border-slate-100 py-3.5 font-sans text-xs font-medium text-slate-600 bg-slate-50/30 px-3 rounded-xl border">
          <div className="space-y-0.5">
            <span className="text-slate-400 text-[9px] font-bold uppercase tracking-tight block">
              Căn hộ bàn giao
            </span>
            <span className="font-bold text-slate-900 font-mono">
              P.{watchedValues.roomNumber} (Danjin BMS)
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 text-[9px] font-bold uppercase tracking-tight block">
              Chu kỳ tài khóa
            </span>
            <span className="font-semibold text-slate-800">
              Thanh toán {watchedValues.paymentCycle} tháng/lần
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 text-[9px] font-bold uppercase tracking-tight block">
              Kích hoạt hiệu lực
            </span>
            <span className="font-bold text-slate-700 font-mono">
              {watchedValues.startDate?.split("-").reverse().join("/") || "—"}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 text-[9px] font-bold uppercase tracking-tight block">
              Đáo hạn cam kết
            </span>
            <span className="font-bold text-amber-600 font-mono">
              {endDate}
            </span>
          </div>
        </div>

        <div className="space-y-2 flex-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            Bảng kê cước tiện ích cố định phòng
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(watchedValues.services || []).map((s: any) => (
              <div
                key={s.id}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-50/60 border border-slate-200/50 rounded text-slate-600 font-mono text-[9px] font-bold"
              >
                <span>{s.name}:</span>
                <span className="text-slate-900 font-extrabold">
                  {s.price?.toLocaleString("vi-VN")}đ
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 p-3.5 bg-indigo-900 text-white rounded-xl relative overflow-hidden shadow-3xs mt-auto">
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-70 block leading-none">
            Tổng cước thu ngày nhận bàn giao phòng
          </span>
          <div className="flex items-baseline gap-0.5 pt-0.5">
            <span className="text-2xl font-black font-mono tracking-tight leading-none">
              {(
                Number(watchedValues.deposit || 0) +
                Number(watchedValues.rentPrice || 0)
              ).toLocaleString("vi-VN")}
            </span>
            <span className="text-[10px] font-bold font-sans opacity-80 ml-0.5">
              VND
            </span>
          </div>
        </div>

        <div className="flex items-start gap-1.5 p-2.5 border border-dashed border-slate-200 rounded-lg bg-slate-50/40 text-[10px] text-slate-500 leading-normal font-medium font-sans">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
          <p>
            Chỉ số công tơ điện nước nền bàn giao:{" "}
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
  );
}
