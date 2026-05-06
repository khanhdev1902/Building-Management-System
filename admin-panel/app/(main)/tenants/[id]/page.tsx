"use client";
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
import { TenantStatsBar } from "./components/tenant-stats-bar";
export default function TenantProfessionalDetail() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-6 bg-[#fafafa] min-h-screen font-sans text-slate-900">
      <TenantHeader
        name="Trần Bình An"
        id="RES-8802"
        room="P.101"
        building="Danjin Tower"
        status="Đang cư trú"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <TenantSidebar />

        {/* --- MAIN CONTENT --- */}
        <div className="lg:col-span-9 space-y-6">
          <TenantStatsBar deposit="4.500.000" debt="0" expiryDays="245" />

          <Tabs
            defaultValue="overview"
            className="w-full bg-white rounded-xs border border-slate-200"
          >
            <TabsList className="bg-transparent w-full justify-start gap-4 px-6 border-b border-slate-100">
              <TabsTrigger value="overview" className="tab-pro-style">
                Tổng quan
              </TabsTrigger>
              <TabsTrigger value="contracts" className="tab-pro-style">
                Hợp đồng & Dịch vụ
              </TabsTrigger>
              <TabsTrigger value="finance" className="tab-pro-style">
                Lịch sử tài chính
              </TabsTrigger>
              <TabsTrigger value="request" className="tab-pro-style">
                Yêu cầu & Sự cố
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <TabOverview />
            </TabsContent>
            <TabsContent value="contracts">
              <TabContract />
            </TabsContent>
            <TabsContent value="finance">
              <TabFinance />
            </TabsContent>
            <TabsContent value="request">
              <TabRequest />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
