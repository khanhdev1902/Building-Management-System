"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useMemo, useEffect } from "react";
import { ServiceCard } from "./components/ServiceCard";
import { ServiceHeader } from "./components/ServiceHeader";
import { ServiceToolbar } from "./components/ServiceToolbar";
import { ServiceFormModal } from "./components/ServiceFormModal";
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { ServiceResponse } from "./types/service.type";
import { serviceApi } from "./apis/service.api";
import { ServiceCardSkeleton } from "./components/ServiceCardSkeleton";

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
        toast.success("Cập nhật dịch vụ thành công");
      } else {
        await serviceApi.createService(data);
        toast.success("Thêm mới dịch vụ thành công");
      }
      fetchServices();
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra khi lưu dữ liệu");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6 min-h-screen bg-slate-50/20 antialiased selection:bg-indigo-50">
      <ServiceHeader onAdd={handleAddNew} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="space-y-0.5">
          <h2 className="text-sm font-semibold text-slate-800 tracking-tight">
            Danh mục dịch vụ tiện ích
          </h2>
          <p className="text-xs text-slate-400">
            Tổng số{" "}
            <span className="font-semibold text-slate-700 font-mono">
              {filteredServices.length}
            </span>{" "}
            gói dịch vụ đang mở vận hành
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none">
            <ServiceToolbar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 border-slate-200 bg-white text-slate-400 hover:text-slate-800 rounded-xl transition-all shadow-2xs shrink-0"
            onClick={fetchServices}
          >
            <RefreshCw
              size={14}
              className={isLoading ? "animate-spin" : "text-slate-500"}
            />
          </Button>
        </div>
      </div>

      <div className="pt-2">
        {isLoading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <ServiceCardSkeleton key={index} />
            ))}
          </div>
        ) : paginatedServices.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {paginatedServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service as any}
                onEdit={() => handleEdit(service)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 max-w-xl mx-auto shadow-2xs">
            <div className="p-3 bg-slate-50 rounded-full border border-slate-100 text-slate-300 mb-3.5">
              <Inbox className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-0.5">
              Không tìm thấy dịch vụ
            </h3>
            <p className="text-xs text-slate-400 max-w-xs text-center mb-4">
              Không tìm thấy kết quả nào khớp với bộ lọc hoặc từ khóa hiện tại.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg text-xs font-medium border-slate-200 shadow-2xs"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
            >
              Đặt lại cấu hình lọc
            </Button>
          </div>
        )}
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200/60 pt-5 mt-4">
          <p className="text-xs font-medium text-slate-400">
            Hiển thị{" "}
            <span className="text-slate-800 font-semibold font-mono">
              {paginatedServices.length}
            </span>{" "}
            trên {filteredServices.length} kết quả
          </p>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">
              Trang{" "}
              <span className="text-slate-900 font-semibold font-mono">
                {currentPage}
              </span>{" "}
              / {totalPages}
            </span>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all disabled:opacity-40"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={14} className="stroke-[1.8]" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all disabled:opacity-40"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={14} className="stroke-[1.8]" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingService}
        onSave={handleSave}
      />
    </div>
  );
}
