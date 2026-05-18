"use client";

import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { TenantHeader } from "./components/tenant-header";
import { TenantSidebar } from "./components/tenant-sidebar";
import { TabOverview } from "./components/tab-overview";
import { TabContract } from "./components/tab-contract";
import { TabFinance } from "./components/tab-finance";
import { TabRequest } from "./components/tab-request";

// const TabRequest = () => (
//   <div className="p-6 text-xs text-slate-400 font-medium font-sans">
//     Hệ thống Ticket tiếp nhận và xử lý phản ánh sự cố kỹ thuật (Chờ thiết
//     lập)...
//   </div>
// );

export default function TenantProfessionalDetail() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-5 bg-slate-50/30 min-h-screen antialiased selection:bg-indigo-50">
      {/* 1. HEADER NÂNG CẤP: Đã tích hợp sẵn dải StatsBar đồng hàng bên phải */}
      <TenantHeader
        name="Trần Bình An"
        id="RES-8802"
        room="101"
        building="Danjin Tower Block A"
        status="active"
        metrics={{
          deposit: "4,500,000",
          debt: "1,250,000",
          expiryDays: "245",
        }}
      />

      {/* 2. KHUNG GRID BỐ CỤC CHÍNH (3:9) LIỀN MẠCH, KHÔNG RỜI RẠC */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* SIDEBAR TRÁI: Đã đóng gói thành 1 khối dọc đồng nhất */}
        <div className="lg:col-span-3">
          <TenantSidebar />
        </div>

        {/* WORKSPACE BÊN PHẢI: Tấm nền trắng phẳng lì loại bỏ "hộp lồng hộp" */}
        <div className="lg:col-span-9">
          <Tabs
            defaultValue="overview"
            className="w-full bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.02)] overflow-hidden flex flex-col"
          >
            {/* Thanh Tabs điều hướng phẳng mượt */}
            <TabsList className="bg-slate-50/50 w-full justify-start gap-1 px-5 border-b border-slate-100 h-11 rounded-none select-none shrink-0">
              <TabsTrigger
                value="overview"
                className="h-8 text-xs font-semibold px-3 data-[state=active]:bg-white data-[state=active]:shadow-2xs rounded-md text-slate-500 data-[state=active]:text-slate-900 transition-all cursor-pointer"
              >
                Tổng quan cư trú
              </TabsTrigger>
              <TabsTrigger
                value="contracts"
                className="h-8 text-xs font-semibold px-3 data-[state=active]:bg-white data-[state=active]:shadow-2xs rounded-md text-slate-500 data-[state=active]:text-slate-900 transition-all cursor-pointer"
              >
                Hợp đồng & Dịch vụ
              </TabsTrigger>
              <TabsTrigger
                value="finance"
                className="h-8 text-xs font-semibold px-3 data-[state=active]:bg-white data-[state=active]:shadow-2xs rounded-md text-slate-500 data-[state=active]:text-slate-900 transition-all cursor-pointer"
              >
                Lịch sử tài chính
              </TabsTrigger>
              <TabsTrigger
                value="request"
                className="h-8 text-xs font-semibold px-3 data-[state=active]:bg-white data-[state=active]:shadow-2xs rounded-md text-slate-500 data-[state=active]:text-slate-900 transition-all cursor-pointer"
              >
                Yêu cầu & Sự cố
              </TabsTrigger>
            </TabsList>

            {/* Khay nội dung đổ dữ liệu phẳng */}
            <TabsContent value="overview" className="mt-0 outline-hidden">
              <TabOverview />
            </TabsContent>
            <TabsContent value="contracts" className="mt-0 outline-hidden">
              <TabContract />
            </TabsContent>
            <TabsContent value="finance" className="mt-0 outline-hidden">
              <TabFinance />
            </TabsContent>
            <TabsContent value="request" className="mt-0 outline-hidden">
              <TabRequest />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
