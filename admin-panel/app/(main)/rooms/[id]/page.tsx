"use client";

import React, { useState } from "react";
import {
  Users,
  LayoutGrid,
  Wallet,
  Activity,
  ShieldCheck,
  Zap,
  Wifi,
  Settings2,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Card, CardContent } from "@/shared/components/ui/card";
import { RoomHeader } from "./components/RoomHeader";
import { ServiceManagement } from "./components/ServiceManagement";
import { OverviewTab } from "./components/OverviewTab";
import { ResidentTab } from "./components/ResidentTab";

export default function RoomDetailPage() {
  const [room, setRoom] = useState({
    roomNumber: "A.101",
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
    // Dịch vụ tính theo chỉ số (Metered)
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
    // Dịch vụ cố định (Fixed)
    fixedServices: [
      {
        id: "f1",
        name: "Internet (Gói Pro)",
        price: 200000,
        unit: "phòng",
        icon: <Wifi className="w-4 h-4" />,
      },
      {
        id: "f2",
        name: "Quản lý & Vệ sinh",
        price: 150000,
        unit: "phòng",
        icon: <Settings2 className="w-4 h-4" />,
      },
      {
        id: "f3",
        name: "Gửi xe máy",
        price: 150000,
        unit: "xe (x2)",
        icon: <LayoutGrid className="w-4 h-4" />,
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
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* 1. Header & Quick Stats */}
      <RoomHeader
        roomNumber={room.roomNumber}
        floor={room.floor}
        area={room.area}
        type={room.type}
        statusLabel="Đang cho thuê"
      />

      {/* 2. Main Tabs Navigation */}
      <Tabs defaultValue="overview" className="">
        <div className="flex items-center justify-between border-b border-slate-200 pb-1">
          <TabsList className="bg-transparent h-auto p-0 gap-8">
            <TabTrigger
              value="overview"
              icon={<Activity size={16} />}
              label="Tổng quan"
            />
            <TabTrigger
              value="residents"
              icon={<Users size={16} />}
              label="Cư dân"
            />
            <TabTrigger
              value="services"
              icon={<Zap size={16} />}
              label="Dịch vụ & Chỉ số"
            />
            <TabTrigger
              value="contract"
              icon={<ShieldCheck size={16} />}
              label="Hợp đồng"
            />
            <TabTrigger
              value="billing"
              icon={<Wallet size={16} />}
              label="Tài chính"
            />
          </TabsList>
        </div>

        {/* --- TAB CONTENT: TỔNG QUAN --- */}
        <OverviewTab room={room} />

        {/* --- TAB CONTENT: CƯ DÂN --- */}
        {/* --- TAB CONTENT: CƯ DÂN --- */}
        <TabsContent value="residents" className="mt-6">
          <ResidentTab tenant={room.tenant} />
        </TabsContent>

        {/* --- TAB CONTENT: DỊCH VỤ --- */}
        <TabsContent value="services">
          <ServiceManagement
            meteredServices={room.meteredServices}
            fixedServices={room.fixedServices}
          />
        </TabsContent>

        {/* --- CÁC TAB KHÁC... --- */}
      </Tabs>
    </div>
  );
}

// Sub-component Helper
function TabTrigger({
  value,
  icon,
  label,
}: {
  value: string;
  icon: any;
  label: string;
}) {
  return (
    <TabsTrigger
      value={value}
      className="data-[state=active]:bg-transparent data-[state=active]:text-gray-600 data-[state=active]:border-b-2 rounded-none px-0 pb-3 text-slate-500 font-bold text-sm transition-all flex items-center gap-2"
    >
      {icon} {label}
    </TabsTrigger>
  );
}
