"use client";

import React, { useState } from "react";
import { Plus, QrCode, Database, Layers, ListFilter } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";

// Sub-components
import { AssetStats } from "./components/AssetStats";
import { InventoryManager } from "./components/InventoryManager";
import { AssetManager } from "./components/AssetManager";

export default function AssetPage() {
  // Đưa inventory (Danh sách thiết bị) lên làm mặc định
  const [activeTab, setActiveTab] = useState("inventory");

  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      {/* Top Navigation Bar: Tinh gọn tối đa */}
      <nav className="h-16 px-8 bg-white border-b border-slate-200/60 sticky top-0 z-30 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 border-r border-slate-200 pr-6">
            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
              <Database size={16} className="text-white" />
            </div>
            <div className="leading-none">
              <h1 className="text-[12px] font-black uppercase tracking-tighter text-slate-900">
                Hạ tầng thiết bị
              </h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Asset System
              </p>
            </div>
          </div>

          {/* Tab Switcher dạng Industrial Segmented Control */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-auto"
          >
            <TabsList className="bg-slate-100/80 p-1 rounded-lg h-10 border border-slate-200/50">
              <TabsTrigger
                value="inventory"
                className="px-4 text-[11px] font-black uppercase tracking-tight rounded-md data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all flex gap-2 items-center"
              >
                <ListFilter size={14} /> Danh sách thiết bị
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="px-4 text-[11px] font-black uppercase tracking-tight rounded-md data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all flex gap-2 items-center"
              >
                <Layers size={14} /> Danh mục tổng quát
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="h-9 px-3 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 rounded-md"
          >
            <QrCode size={16} className="mr-2" /> Scanner
          </Button>
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <Button className="h-9 px-4 bg-slate-900 text-white text-[10px] font-black rounded-md hover:bg-slate-800 shadow-lg shadow-slate-900/10 uppercase tracking-widest flex gap-2">
            <Plus size={14} />
            Tạo danh mục
          </Button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8 space-y-8">
        {/* Section Thống kê: Nhìn gắt và chuyên nghiệp */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-slate-900 rounded-full" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Báo cáo hiệu suất vận hành
            </h2>
          </div>
          <AssetStats />
        </div>

        {/* Content Section */}
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
          {activeTab === "inventory" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  Thực thể thiết bị theo phòng
                </h3>
              </div>
              <InventoryManager />
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                Phân loại danh mục tài sản
              </h3>
              <AssetManager />
            </div>
          )}
        </div>
      </main>

      {/* Style bổ sung để Tab trigger nhìn chuyên nghiệp hơn */}
      <style jsx global>{`
        [data-state="active"].tab-industrial {
          background-color: white !important;
          color: #0f172a !important;
        }
      `}</style>
    </div>
  );
}
