"use client";

import React, { useState } from "react";
import {
  Users,
  LayoutGrid,
  Wallet,
  Activity,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { RoomHeader } from "./components/room-header";
import { OverviewTab } from "./components/overview-tab";
import { ResidentTab } from "./components/resident-tab";
import { ServiceManagement } from "./components/service-management-tab";
import { ContractTab } from "./components/ui-custom/contract-tab";
import { BillingTab } from "./components/billing-tab";

export default function RoomDetailPage() {
  const [room] = useState({
    roomNumber: "101",
    type: "Studio Deluxe",
    floor: "1",
    area: "32",
    price: 6500000,
    deposit: 13000000,
    status: "occupied",
    tenant: {
      representative: {
        name: "Nguyễn Văn Khanh",
        phone: "0987.654.321",
        email: "khanhnv@danjin.vn",
        cccd: "001092008888",
        startDate: "20/03/2026",
      },
      members: [
        { id: 1, name: "Trần Thế Anh", role: "Thành viên" },
        { id: 2, name: "Lê Minh Nhật", role: "Thành viên" },
      ],
    },
    meteredServices: [
      {
        id: "s1",
        name: "Điện",
        price: 3500,
        unit: "kWh",
        lastIndex: 1240,
        type: "electric",
      },
      {
        id: "s2",
        name: "Nước",
        price: 30000,
        unit: "m3",
        lastIndex: 85,
        type: "water",
      },
    ],
    fixedServices: [
      {
        id: "f1",
        name: "Internet (Gói Pro)",
        price: 200000,
        unit: "phòng",
        icon: <LayoutGrid className="w-3.5 h-3.5" />,
      },
      {
        id: "f2",
        name: "Quản lý & Vệ sinh",
        price: 150000,
        unit: "phòng",
        icon: <LayoutGrid className="w-3.5 h-3.5" />,
      },
      {
        id: "f3",
        name: "Gửi xe máy",
        price: 150000,
        unit: "xe (x2)",
        icon: <LayoutGrid className="w-3.5 h-3.5" />,
      },
    ],
    contract: {
      id: "DJ-2026-A101",
      duration: "12 tháng",
      expiryDate: "20/03/2027",
      status: "active",
    },
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-5 bg-slate-50/20 min-h-screen antialiased selection:bg-indigo-50">
      {/* 1. ROOM HEADER: Thanh điều hướng phẳng trần, nén chặt chỉ số tài khóa */}
      <RoomHeader
        roomNumber={room.roomNumber}
        floor={room.floor}
        area={room.area}
        type={room.type}
        statusLabel="Đang cho thuê"
        metrics={{
          price: room.price,
          deposit: room.deposit,
          expiryDate: room.contract.expiryDate,
        }}
      />

      {/* 2. MAIN WORKSPACE CONTENT BỌC TABS PHẲNG CHUẨN ENTERPRISE */}
      <Tabs
        defaultValue="overview"
        className="w-full overflow-hidden flex flex-col"
      >
        {/* Thanh Tabs List dẹt khít đồng bộ 100% ngôn ngữ thiết kế Danjin BMS */}
        <TabsList className="bg-slate-50/50 w-full justify-start gap-1 px-5 border-b border-slate-100 h-11 rounded-none select-none shrink-0">
          <TabsTrigger
            value="overview"
            className="h-8 text-xs font-semibold px-3 data-[state=active]:bg-white data-[state=active]:shadow-2xs rounded-md text-slate-500 data-[state=active]:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Activity size={13} className="stroke-[1.8]" /> Tổng quan căn hộ
          </TabsTrigger>
          <TabsTrigger
            value="residents"
            className="h-8 text-xs font-semibold px-3 data-[state=active]:bg-white data-[state=active]:shadow-2xs rounded-md text-slate-500 data-[state=active]:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Users size={13} className="stroke-[1.8]" /> Cư dân lưu trú
          </TabsTrigger>
          <TabsTrigger
            value="services"
            className="h-8 text-xs font-semibold px-3 data-[state=active]:bg-white data-[state=active]:shadow-2xs rounded-md text-slate-500 data-[state=active]:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Zap size={13} className="stroke-[1.8]" /> Tiêu thụ & Tài sản
          </TabsTrigger>
          <TabsTrigger
            value="contract"
            className="h-8 text-xs font-semibold px-3 data-[state=active]:bg-white data-[state=active]:shadow-2xs rounded-md text-slate-500 data-[state=active]:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ShieldCheck size={13} className="stroke-[1.8]" /> Sổ gốc Hợp đồng
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="h-8 text-xs font-semibold px-3 data-[state=active]:bg-white data-[state=active]:shadow-2xs rounded-md text-slate-500 data-[state=active]:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Wallet size={13} className="stroke-[1.8]" /> Sổ gốc Tài chính
          </TabsTrigger>
        </TabsList>

        {/* Khay nội dung phẳng dẹt tràn lề hoàn toàn */}
        <TabsContent value="overview" className="mt-0 outline-hidden">
          <OverviewTab room={room} />
        </TabsContent>

        <TabsContent value="residents" className="mt-0 outline-hidden">
          <ResidentTab tenant={room.tenant} />
        </TabsContent>

        <TabsContent value="services" className="mt-0 outline-hidden">
          <ServiceManagement
            meteredServices={room.meteredServices}
            fixedServices={room.fixedServices}
          />
        </TabsContent>

        <TabsContent value="contract" className="mt-0 outline-hidden">
          <ContractTab room={room} />
        </TabsContent>

        <TabsContent value="billing" className="mt-0 outline-hidden">
          <BillingTab room={room} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
