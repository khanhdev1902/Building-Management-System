"use client";

import React from "react";

interface ContractStepperProps {
  currentStep: number;
}

export function ContractStepper({ currentStep }: ContractStepperProps) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 pb-4 select-none">
      <StepCircle num={1} active={currentStep >= 1} label="Lý lịch đại diện" />
      <div
        className={`h-px flex-1 ${currentStep > 1 ? "bg-slate-900" : "bg-slate-100"}`}
      />
      <StepCircle num={2} active={currentStep >= 2} label="Tài khóa mặt bằng" />
      <div
        className={`h-px flex-1 ${currentStep > 2 ? "bg-slate-900" : "bg-slate-100"}`}
      />
      <StepCircle num={3} active={currentStep >= 3} label="Nhân khẩu & Phí" />
    </div>
  );
}

function StepCircle({
  num,
  active,
  label,
}: {
  num: number;
  active: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 select-none shrink-0">
      <div
        className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-black border transition-all duration-300
        ${active ? "bg-slate-900 border-slate-900 text-white" : "bg-transparent border-slate-200 text-slate-300"}`}
      >
        {num}
      </div>
      <span
        className={`text-xs font-bold tracking-tight transition-colors duration-300 ${active ? "text-slate-900" : "text-slate-300"}`}
      >
        {label}
      </span>
    </div>
  );
}
