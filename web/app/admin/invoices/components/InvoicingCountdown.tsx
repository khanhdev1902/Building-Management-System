/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Clock, AlertCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

interface SystemInvoiceSetting {
  invoiceGenerateDay: number;
  invoiceGenerateHour: number;
  invoiceGenerateMinute: number;
  [key: string]: any;
}

interface CountdownTimerProps {
  settingData: SystemInvoiceSetting | null | undefined;
  onTimerEnd?: () => void;
}

export function InvoicingCountdown({
  settingData,
  onTimerEnd,
}: CountdownTimerProps) {
  // Đã bổ sung đầy đủ state ép Loading 5 giây ở đây nè cưng!
  const [isForceLoading, setIsForceLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  // 1. Bộ đếm giữ trạng thái hiệu ứng Loading đúng 5 giây
  useEffect(() => {
    const timerDelay = setTimeout(() => {
      setIsForceLoading(false);
    }, 5000);

    return () => clearTimeout(timerDelay);
  }, []);

  // 2. Bộ tính toán thời gian đếm ngược thực tế
  useEffect(() => {
    // CHẶN: Nếu chưa có data từ Server HOẶC vẫn đang trong 5 giây ép loading thì không tính toán
    if (!settingData || isForceLoading) return;

    const calculateTimeLeft = () => {
      const now = new Date();

      let targetDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        settingData.invoiceGenerateDay,
        settingData.invoiceGenerateHour,
        settingData.invoiceGenerateMinute,
        0,
      );

      if (now > targetDate) {
        targetDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          settingData.invoiceGenerateDay,
          settingData.invoiceGenerateHour,
          settingData.invoiceGenerateMinute,
          0,
        );
      }

      const difference = +targetDate - +now;
      console.log("Thời gian còn lại (ms):", difference);

      // Đặt ngưỡng biên an toàn 500ms như cưng muốn
      if (difference <= 1000) {
        console.log("Đã đến thời điểm chốt sổ hóa đơn tự động!");
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isOver: true,
        });
        if (onTimerEnd) onTimerEnd();
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isOver: false,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [settingData, onTimerEnd, isForceLoading]); // Thêm isForceLoading vào dependency array để kích hoạt lại sau 5s

  const padZero = (num: number) => String(num).padStart(2, "0");

  // Giao diện Skeleton hiện ra khi chưa có data HOẶC đang trong chu kỳ 5 giây ép buộc
  if (!settingData || isForceLoading) {
    return (
      <div className="p-4.5 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl max-w-lg text-center text-xs font-medium text-slate-400 animate-pulse flex items-center justify-center gap-1.5 h-[58px] w-[340px]">
        <span>Đang đồng bộ thời gian từ Server...</span>
        <Clock
          size={12}
          className="inline-block animate-spin text-indigo-500"
        />
      </div>
    );
  }

  return (
    <div className="p-4.5 shadow-3xs max-w-lg select-none font-sans flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-100 rounded-2xl">
      <div className="space-y-1 min-w-0 flex-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
          Tiến trình tự động hóa hệ thống
        </span>
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
          <Clock
            size={14}
            className={
              timeLeft.isOver
                ? "text-rose-500"
                : "text-indigo-600 animate-pulse"
            }
          />
          {timeLeft.isOver
            ? "Đang phát hành hóa đơn..."
            : "Thời hạn tự động chốt sổ kỳ tới"}
        </h4>
        <p className="text-[11px] text-slate-400 font-medium leading-normal flex items-center gap-1 pt-0.5">
          <AlertCircle size={12} className="text-amber-500 shrink-0" />
          {timeLeft.isOver ? (
            "Cron Job đang chạy ngầm dưới Server."
          ) : (
            <span>
              Tự động chốt lúc{" "}
              <strong className="text-slate-700 font-mono">
                {padZero(settingData.invoiceGenerateHour)}:
                {padZero(settingData.invoiceGenerateMinute)}
              </strong>{" "}
              ngày{" "}
              <strong className="text-slate-700 font-mono">
                {settingData.invoiceGenerateDay}
              </strong>{" "}
              hàng tháng.
            </span>
          )}
        </p>
      </div>

      {/* KHỐI ĐỒ HỌA ĐỒNG HỒ SỐ DẸT MỊN CHUẨN SAAS */}
      {!timeLeft.isOver ? (
        <div className="flex items-center gap-1 text-center font-mono shrink-0 bg-slate-50 border border-slate-100 p-2 rounded-xl shadow-2xs">
          {[
            { label: "Ngày", val: timeLeft.days },
            { label: "Giờ", val: timeLeft.hours },
            { label: "Phút", val: timeLeft.minutes },
            { label: "Giây", val: timeLeft.seconds },
          ].map((item, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col px-1.5 min-w-8.5">
                <span className="text-sm font-black text-slate-900 tracking-tight leading-none">
                  {padZero(item.val)}
                </span>
                <span className="text-[8px] font-sans font-bold text-slate-400 uppercase tracking-wide mt-1">
                  {item.label}
                </span>
              </div>
              {idx < 3 && (
                <span className="text-xs font-black text-slate-300 pb-4 leading-none">
                  :
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <Badge className="bg-rose-50 border-rose-100 text-rose-600 font-black font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 gap-1 shadow-none rounded-lg shrink-0 animate-bounce">
          <RefreshCw size={11} className="animate-spin" /> Lập hóa đơn
        </Badge>
      )}
    </div>
  );
}
