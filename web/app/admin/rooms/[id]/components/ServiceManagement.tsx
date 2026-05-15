/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Search,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Settings2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";

const MOCK_BILLING_CYCLES = [
  {
    month: "04/2026",
    electric: { prev: 1100, curr: 1240, usage: 140 },
    water: { prev: 78, curr: 85, usage: 7 },
    total: 700000,
    recordedBy: "Khanh Nguyen",
    recordedAt: "01/05/2026 08:30",
  },
  {
    month: "03/2026",
    electric: { prev: 980, curr: 1100, usage: 120 },
    water: { prev: 70, curr: 78, usage: 8 },
    total: 660000,
    recordedBy: "Minh Nhat",
    recordedAt: "01/04/2026 09:15",
  },
];

export const ServiceManagement = ({ fixedServices = [] }: any) => {
  return (
    <div className="mt-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* --- CỘT TRÁI: BIẾN ĐỘNG TIÊU THỤ (Main Table) --- */}
        <Card className="lg:col-span-8 p-0 border-slate-200/60 shadow-none bg-white rounded-xl overflow-hidden">
          {/* Header Table */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Biến động tiêu thụ
              </h3>
              <p className="text-[13px] text-slate-500 font-medium">
                Lịch sử ghi chép chỉ số định kỳ
              </p>
            </div>

            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <Input
                placeholder="Tìm kỳ hạn..."
                className="h-9 pl-9 w-full sm:w-56 text-sm border-slate-200 bg-white focus:ring-0 focus:border-slate-400 transition-all rounded-lg"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-y border-slate-100">
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Kỳ hạn
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                    Điện (kWh)
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                    Nước (m³)
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                    Phát sinh
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_BILLING_CYCLES.map((item) => (
                  <tr
                    key={item.month}
                    className="hover:bg-slate-50/30 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">
                          {item.month}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          {item.recordedAt}
                        </span>
                      </div>
                    </td>

                    {/* Chỉ số Điện */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="text-xs font-medium text-slate-400">
                            {item.electric.prev}
                          </span>
                          <ArrowRight size={12} className="text-slate-300" />
                          <span className="text-sm font-bold text-slate-900">
                            {item.electric.curr}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 bg-amber-50 px-2 py-0.5 rounded-full">
                          <div className="w-1 h-1 rounded-full bg-amber-500" />
                          <span className="text-[10px] font-bold text-amber-700">
                            +{item.electric.usage} kWh
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Chỉ số Nước */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="text-xs font-medium text-slate-400">
                            {item.water.prev}
                          </span>
                          <ArrowRight size={12} className="text-slate-300" />
                          <span className="text-sm font-bold text-slate-900">
                            {item.water.curr}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 bg-blue-50 px-2 py-0.5 rounded-full">
                          <div className="w-1 h-1 rounded-full bg-blue-500" />
                          <span className="text-[10px] font-bold text-blue-700">
                            +{item.water.usage} m³
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <span className="text-base font-bold text-slate-900 tracking-tight">
                        {item.total.toLocaleString()}đ
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Table */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:bg-slate-50"
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="text-[12px] font-bold text-slate-600 px-2">
                1 / 12
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:bg-slate-50"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
            <Button
              variant="ghost"
              className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 gap-2 uppercase tracking-widest"
            >
              <Download size={14} /> Xuất dữ liệu
            </Button>
          </div>
        </Card>

        {/* --- CỘT PHẢI: DỊCH VỤ & THỐNG KÊ --- */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-5 border-slate-200/60 shadow-none bg-white rounded-xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Settings2 size={16} className="text-slate-400" />
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                  Dịch vụ cố định
                </h3>
              </div>
              <Button
                variant="ghost"
                className="h-auto p-0 text-indigo-600 text-[11px] font-bold hover:bg-transparent"
              >
                + THÊM
              </Button>
            </div>

            <div className="space-y-2">
              {fixedServices.map((service: any) => (
                <div
                  key={service.id}
                  className="group flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                      {React.cloneElement(
                        service.icon as React.ReactElement<{ size?: number }>,
                        {
                          size: 18,
                        },
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-700">
                        {service.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {service.price.toLocaleString()}đ / {service.unit}
                      </p>
                    </div>
                  </div>
                  <Trash2
                    size={14}
                    className="text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-500 cursor-pointer transition-all"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Revenue Card - Minimalist Dark Mode */}
          <Card className="p-6 bg-slate-900 border-none rounded-xl text-white overflow-hidden relative group">
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Doanh thu dịch vụ (T5)
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tighter">
                  2.450.000
                </span>
                <span className="text-xs font-medium text-slate-500">VND</span>
              </div>
              <Button className="w-full mt-6 bg-white hover:bg-slate-100 text-slate-900 border-none rounded-lg font-bold text-[11px] h-9 transition-all">
                CHI TIẾT DOANH THU
              </Button>
            </div>
            {/* Subtle Gradient Decor */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
          </Card>
        </div>
      </div>
    </div>
  );
};
