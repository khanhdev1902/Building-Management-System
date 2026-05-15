"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  QrCode,
  Database,
  HardDrive,
  Layers,
  Settings2,
  ArrowRight,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

// Sub-components
import { AssetStats } from "./components/AssetStats";
import { InventoryManager } from "./components/InventoryManager";
import { CategoryManager } from "./components/CategoryManager";

export default function AssetPage() {
  const [activeTab, setActiveTab] = useState("inventory");

  return (
    <div className="min-h-screen bg-white">
      {/* Header: Tối giản, thanh mảnh hơn */}
      <header className="px-12 py-10 border-b border-zinc-100 bg-white sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-900 rounded flex items-center justify-center">
                <Database size={16} className="text-white" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900 uppercase">
                Kiến trúc Tài sản
              </h1>
            </div>
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.15em] pl-11">
              Hệ điều hành Danjin / Kiểm soát thiết bị
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="h-10 px-6 border-zinc-200 text-[10px] font-bold uppercase tracking-widest rounded-none hover:bg-zinc-50 transition-all"
            >
              <QrCode size={14} className="mr-2" /> Quét thiết bị
            </Button>
            <Button className="h-10 px-6 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-none hover:bg-zinc-800 shadow-none transition-all">
              <Plus size={14} className="mr-2" />
              {activeTab === "inventory" ? "Nhập kho mới" : "Thêm danh mục"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto">
        {/* Stats Section: Luồng dữ liệu vận hành */}
        <AssetStats />

        <div className="px-12">
          <Tabs
            defaultValue="inventory"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <div className="flex items-center justify-between border-b border-zinc-100">
              <TabsList className="bg-transparent h-auto p-0 gap-12 rounded-none">
                <TabsTrigger value="inventory" className="tab-industrial">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono opacity-40">01</span>
                    Đội ngũ thiết bị
                  </div>
                </TabsTrigger>
                <TabsTrigger value="categories" className="tab-industrial">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono opacity-40">02</span>
                    Danh mục gốc
                  </div>
                </TabsTrigger>
                <TabsTrigger value="settings" className="tab-industrial">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono opacity-40">03</span>
                    Cấu hình hệ thống
                  </div>
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-6">
                <div className="relative">
                  <Search
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-300"
                    size={14}
                  />
                  <Input
                    className="pl-6 h-12 border-none bg-transparent text-xs w-64 focus-visible:ring-0 placeholder:text-zinc-300"
                    placeholder="Tìm kiếm tài sản hệ thống..."
                  />
                </div>
                <Button
                  variant="ghost"
                  className="h-12 px-0 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:bg-transparent hover:text-zinc-900"
                >
                  Bộ lọc <ArrowRight size={12} className="ml-2" />
                </Button>
              </div>
            </div>

            <div className="py-12 animate-in fade-in duration-700">
              <TabsContent value="inventory" className="outline-none m-0">
                <InventoryManager />
              </TabsContent>

              <TabsContent value="categories" className="outline-none m-0">
                <CategoryManager />
              </TabsContent>

              <TabsContent value="settings" className="outline-none m-0">
                <div className="h-[400px] border border-dashed border-zinc-100 flex items-center justify-center">
                  <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-[0.2em]">
                    Đang chờ thiết lập cấu hình
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>

      <style jsx global>{`
        .tab-industrial {
          border-radius: 0 !important;
          border-bottom: 2px solid transparent !important;
          padding: 24px 0 !important;
          font-weight: 700 !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.15em !important;
          color: #a1a1aa !important;
          background: transparent !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: none !important;
        }
        .tab-industrial[data-state="active"] {
          border-bottom-color: #18181b !important;
          color: #18181b !important;
        }
        .tab-industrial:hover {
          color: #18181b !important;
        }
      `}</style>
    </div>
  );
}
