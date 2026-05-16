/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ServiceCard } from "./components/ServiceCard";
import { ServiceHeader } from "./components/ServiceHeader";
import { ServiceToolbar } from "./components/ServiceToolbar";
import { ServiceFormModal } from "./components/ServiceFormModal";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Inbox,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { ServiceResponse } from "./types/service.type";
import { serviceApi } from "./apis/service.api";

const ITEMS_PER_PAGE = 8;

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceResponse | null>(
    null,
  );

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await serviceApi.getAllServices();
      if (res && res.data) {
        setServices(res.data);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải danh sách dịch vụ");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchSearch = s.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter, services]);

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredServices, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleAddNew = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service: ServiceResponse) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (editingService) {
        await serviceApi.updateService(editingService.id, data);
        toast.success("Cập nhật thành công");
      } else {
        await serviceApi.createService(data);
        toast.success("Thêm mới thành công");
      }
      fetchServices();
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra khi lưu dữ liệu");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 p-4">
      {/* 1. Top Header Section */}
      <ServiceHeader onAdd={handleAddNew} />

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        {/* 2. Toolbar & Filter Section */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                Danh mục dịch vụ
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Vận hành và cấu hình các gói tiện ích tòa nhà
              </p>
            </div>

            <div className="flex items-center gap-2">
              <ServiceToolbar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-slate-200 text-slate-400 hover:text-slate-900"
                onClick={fetchServices}
              >
                <RefreshCw
                  size={14}
                  className={isLoading ? "animate-spin" : ""}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* 3. Main Content Area */}
        <div className="p-4 min-h-[450px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400 mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Đang đồng bộ dữ liệu...
              </p>
            </div>
          ) : paginatedServices.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {paginatedServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service as any}
                  onEdit={() => handleEdit(service)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
              <Inbox
                className="w-8 h-8 text-slate-200 mb-3"
                strokeWidth={1.5}
              />
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Không có dịch vụ nào được tìm thấy
              </p>
              <Button
                variant="link"
                className="mt-1 text-[10px] text-indigo-600 uppercase font-black tracking-tight"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                Thiết lập lại bộ lọc
              </Button>
            </div>
          )}
        </div>

        {/* 4. Pagination - Tối giản kiểu SaaS */}
        {!isLoading && totalPages > 1 && (
          <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <div className="hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Hiển thị {paginatedServices.length} / {filteredServices.length}{" "}
                kết quả
              </p>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:bg-white hover:shadow-sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:bg-white hover:shadow-sm"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={14} />
              </Button>

              <div className="flex items-center gap-1 px-2">
                <span className="text-[11px] font-black text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded">
                  {currentPage.toString().padStart(2, "0")}
                </span>
                <span className="text-[10px] font-bold text-slate-300">/</span>
                <span className="text-[11px] font-bold text-slate-400">
                  {totalPages.toString().padStart(2, "0")}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:bg-white hover:shadow-sm"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:bg-white hover:shadow-sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingService}
        onSave={handleSave}
      />
    </div>
  );
}
