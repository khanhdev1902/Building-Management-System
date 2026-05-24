import React from "react";

export function FormGroup({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1 w-full">
      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wide select-none">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[10px] text-rose-600 font-semibold flex items-center gap-1 mt-0.5 animate-in fade-in duration-200">
          {error}
        </p>
      )}
    </div>
  );
}
