/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { Users, Wallet, Activity, ShieldCheck, Zap } from "lucide-react";
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
import { roomApi } from "../apis/room.api";
import { useParams } from "next/navigation";
import { RoomDetailData } from "./types/room-detail.type";

export default function RoomDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [room, setRoom] = useState<RoomDetailData>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getRoomData = async () => {
    try {
      setIsLoading(true);
      const res = await roomApi.getRoomById(id);
      setRoom(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      // Giữ hiệu ứng loading tối thiểu 400ms để tránh UI giật nhanh quá mức
      setTimeout(() => setIsLoading(false), 400);
    }
  };

  useEffect(() => {
    if (id) getRoomData();
  }, [id]);

  // ================= 🎨 BỘ KHUNG XƯƠNG SKELETON ĐỒNG TRỤC NỀN LUXURY =================
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6 bg-slate-50/20 min-h-screen antialiased select-none animate-in fade-in duration-200">
        {/* 1. Skeleton cho RoomHeader */}
        <div className="space-y-4 pb-1 border-b border-slate-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 w-full">
              <div className="h-8 w-8 rounded-lg bg-slate-200/70 animate-pulse shrink-0" />
              <div className="h-5 bg-slate-200/70 rounded-md w-36 animate-pulse" />
              <div className="h-4.5 bg-slate-100 rounded-sm w-20 animate-pulse" />
            </div>
            <div className="h-8 w-8 rounded-lg bg-slate-200/70 animate-pulse shrink-0" />
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
            <div className="h-4 bg-slate-200/60 rounded-sm w-44 animate-pulse" />
            <div className="h-4 bg-slate-200/60 rounded-sm w-72 animate-pulse" />
          </div>
        </div>

        {/* 2. Skeleton cho dải Tabs List Tab */}
        <div className="h-11 w-full bg-slate-100/60 rounded-lg flex items-center px-4 gap-2 border border-slate-200/20">
          <div className="h-7 bg-white rounded-md w-28 animate-pulse shadow-3xs" />
          <div className="h-7 bg-slate-200/40 rounded-md w-28 animate-pulse" />
          <div className="h-7 bg-slate-200/40 rounded-md w-28 animate-pulse" />
        </div>

        {/* 3. Skeleton cho cấu trúc Overview Tab Layout (Phỏng theo lưới 12 cột) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start pt-2">
          {/* Cột trái (8/12): Chỉ số + Thẻ bảng biểu */}
          <div className="lg:col-span-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-20 bg-white border border-slate-100 rounded-xl animate-pulse shadow-3xs" />
              <div className="h-20 bg-white border border-slate-100 rounded-xl animate-pulse shadow-3xs" />
              <div className="h-20 bg-white border border-slate-100 rounded-xl animate-pulse shadow-3xs" />
            </div>
            <div className="h-48 bg-white border border-slate-100 rounded-xl animate-pulse shadow-3xs" />
            <div className="h-32 bg-white border border-slate-100 rounded-xl animate-pulse shadow-3xs" />
          </div>
          {/* Cột phải (4/12): Tài chính King Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="h-40 bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-28 bg-white border border-slate-100 rounded-xl animate-pulse shadow-3xs" />
          </div>
        </div>
      </div>
    );
  }

  if(!room) return;
  if(!room.tenant) return;
  // ================= GIAO DIỆN CHÍNH KHI ĐÃ ĐỔ ĐẦY ĐỦ DATA VÀO COMPONENT =================
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-5 bg-slate-50/20 min-h-screen antialiased selection:bg-indigo-50">
      {/* 1. ROOM HEADER */}
      <RoomHeader
        roomNumber={room?.roomNumber}
        floor={room?.floor}
        area={room?.area}
        type={room?.type}
        statusLabel={
          room?.status === "OCCUPIED" ? "Đang cho thuê" : "Đang trống"
        }
        metrics={{
          price: room?.price ?? 0,
          deposit: room?.deposit ?? 0,
          expiryDate: room?.contract?.expiryDate ?? "—/—/—",
        }}
      />

      {/* 2. MAIN WORKSPACE CONTENT */}
      <Tabs
        defaultValue="overview"
        className="w-full overflow-hidden flex flex-col"
      >
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

        <TabsContent value="overview" className="mt-0 outline-hidden">
          <OverviewTab room={room} />
        </TabsContent>

        <TabsContent value="residents" className="mt-0 outline-hidden">
          <ResidentTab tenant={room.tenant} />
        </TabsContent>

        <TabsContent value="services" className="mt-0 outline-hidden">
          <ServiceManagement
            meteredServices={room?.meteredServices}
            fixedServices={room?.fixedServices}
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
