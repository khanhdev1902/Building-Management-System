"use client";

import React, { useState, useEffect } from "react";
import { Clock, AlertCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

interface CountdownTimerProps {
  // Mốc thời gian Backend trả về (Định dạng ISO String hoặc Timestamp)
  // Ví dụ: "2026-06-05T00:00:00.000Z" (Đúng nửa đêm ngày mùng 5 tháng 6)
  targetTargetDate: string;
  onTimerEnd?: () => void;
}

export function InvoicingCountdown({
  targetTargetDate,
  onTimerEnd,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetTargetDate) - +new Date();

      if (difference <= 0) {
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

    // Chạy ngay lập tức lượt đầu để tránh UI bị delay 1 giây
    calculateTimeLeft();

    // Kích hoạt bộ đếm thời gian thực mỗi giây
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetTargetDate]);

  // Hàm helper để render số có 2 chữ số (Ví dụ: 05 thay vì 5)
  const padZero = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="p-4.5 shadow-3xs max-w-lg select-none font-sans flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
          {timeLeft.isOver
            ? "Cron Job đang chạy ngầm dưới Server."
            : "Hệ thống sẽ tự quét công tơ điện nước và lập hóa đơn đồng loạt."}
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
              <div className="flex flex-col px-1.5 min-w-[34px]">
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
