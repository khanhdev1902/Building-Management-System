"use client";

import React, { useEffect, useState } from "react";
import { Plus, QrCode, Database, Layers, ListFilter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";

// Sub-components đã được tinh chỉnh
import { AssetStats } from "./components/AssetStats";
import { InventoryManager } from "./components/InventoryManager";
import { AssetManager } from "./components/AssetManager";
import { AssetCategory } from "./types/asset.type";
import { assetApi } from "./apis/asset.api";
import { toast } from "sonner";

export default function AssetPage() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [assets, setAssets] = useState<AssetCategory[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [active, setActive] = useState<number>(0);

  useEffect(() => {
    const getAssets = async () => {
      try {
        const res = await assetApi.getAllAssets();
        if (res && res.data) {
          setAssets(res.data.assets);
          setTotal(res.data.totalAsset ?? 0);
          setActive(res.data.activeAsset ?? 0);
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error?.message || "Không thể tải danh sách thiết bị");
      }
    };
    getAssets();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/40 antialiased selection:bg-indigo-50">
      {/* 1. Top Navigation Bar: Phẳng, lì, kết cấu Glassmorphism trong suốt nhẹ */}
      <nav className="h-14 px-6 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
        <div className="flex items-center gap-5">
          {/* Logo khối thương hiệu */}
          <div className="flex items-center gap-2.5 border-r border-slate-200/80 pr-5 h-8">
            <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm shrink-0">
              <Database size={14} className="text-white stroke-[1.8]" />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-xs font-bold tracking-tight text-slate-900 leading-none">
                Hạ tầng & Thiết bị
              </h1>
              <p className="text-[9px] font-medium text-slate-400 font-mono tracking-wide uppercase leading-none">
                Asset System
              </p>
            </div>
          </div>

          {/* Tab Switcher: Thiết kế thanh mảnh chuẩn h-9 cao cấp */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-auto"
          >
            <TabsList className="bg-slate-100/70 p-0.5 rounded-lg h-9 border border-slate-200/40">
              <TabsTrigger
                value="inventory"
                className="h-8 px-3.5 text-xs font-medium text-slate-500 rounded-md data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-2xs transition-all flex gap-1.5 items-center"
              >
                <ListFilter size={13} className="stroke-[1.8]" />
                <span>Danh sách thiết bị</span>
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="h-8 px-3.5 text-xs font-medium text-slate-500 rounded-md data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-2xs transition-all flex gap-1.5 items-center"
              >
                <Layers size={13} className="stroke-[1.8]" />
                <span>Danh mục tổng quát</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Cụm Action điều khiển bên phải */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="h-8 px-2.5 text-slate-500 font-medium text-xs hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors"
          >
            <QrCode size={14} className="mr-1.5 text-slate-400 stroke-[1.8]" />
            Quét mã QR
          </Button>

          <div className="w-px h-3.5 bg-slate-200/80" />

          <Button className="h-8 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-all shadow-2xs flex gap-1.5 active:scale-[0.99]">
            <Plus size={14} className="stroke-2" />
            Tạo danh mục mới
          </Button>
        </div>
      </nav>

      {/* 2. Không gian nội dung chính: Bố cục Fluid mở rộng thoáng đãng */}
      <main className="max-w-7xl mx-auto p-6 space-y-7 w-full">
        {/* Khối Thống kê báo cáo vận hành */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-0.75 h-3.5 bg-slate-900 rounded-full" />
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Báo cáo hiệu suất vận hành hệ thống
            </h2>
          </div>
          <AssetStats total={total} active={active} />
        </div>

        {/* Khối hiển thị Danh sách dữ liệu / Danh mục tương ứng */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
          {activeTab === "inventory" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Chi tiết thực thể thiết bị theo phòng
                </h3>
              </div>
              <InventoryManager />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Phân loại nhóm danh mục tài sản tòa nhà
                </h3>
              </div>
              <AssetManager assets={assets} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
