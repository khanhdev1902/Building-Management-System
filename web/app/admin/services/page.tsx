// const MOCK_SERVICES = [
//   {
//     id: "S1",
//     name: "Gửi xe máy",
//     price: 150000,
//     unit: "xe",
//     status: "active",
//     iconKey: "car",
//     description: "Hệ thống thẻ từ, camera giám sát 24/7.",
//   },
//   {
//     id: "S2",
//     name: "Vệ sinh hành lang",
//     price: 50000,
//     unit: "phòng",
//     status: "active",
//     iconKey: "trash",
//     description: "Vệ sinh khu vực dùng chung định kỳ.",
//   },
//   {
//     id: "S3",
//     name: "Bảo trì thang máy",
//     price: 100000,
//     unit: "phòng",
//     status: "warning",
//     iconKey: "repair",
//     description: "Kiểm tra an toàn kỹ thuật mỗi tháng.",
//   },
//   {
//     id: "S4",
//     name: "Internet (Cơ bản)",
//     price: 200000,
//     unit: "phòng",
//     status: "active",
//     iconKey: "wifi",
//     description: "Băng thông ổn định, xử lý sự cố trong 2h.",
//   },
//   {
//     id: "S5",
//     name: "Điện hành lang",
//     price: 30000,
//     unit: "tháng",
//     status: "active",
//     iconKey: "electricity",
//     description: "Hệ thống chiếu sáng công cộng tòa nhà.",
//   },
//   {
//     id: "S6",
//     name: "Nước sinh hoạt",
//     price: 12000,
//     unit: "m3",
//     status: "active",
//     iconKey: "water",
//     description: "Nước sạch theo tiêu chuẩn thành phố.",
//   },
//   {
//     id: "S7",
//     name: "An ninh bảo vệ",
//     price: 80000,
//     unit: "phòng",
//     status: "active",
//     iconKey: "security",
//     description: "Bảo vệ trực ca và tuần tra cơ sở.",
//   },
//   {
//     id: "S8",
//     name: "Sửa chữa nhỏ",
//     price: 0,
//     unit: "lần",
//     status: "maintenance",
//     iconKey: "repair",
//     description: "Hỗ trợ cư dân các lỗi hỏng hóc cơ bản.",
//   },
//   {
//     id: "S9",
//     name: "Phí xử lý rác",
//     price: 25000,
//     unit: "hộ",
//     status: "active",
//     iconKey: "trash",
//     description: "Thu gom và xử lý rác thải sinh hoạt hàng ngày.",
//   },
//   {
//     id: "S10",
//     name: "Gửi ô tô",
//     price: 1200000,
//     unit: "xe",
//     status: "active",
//     iconKey: "car",
//     description: "Chỗ đỗ xe ô tô cố định dưới hầm B2.",
//   },
//   {
//     id: "S11",
//     name: "Gym & Pool",
//     price: 500000,
//     unit: "người",
//     status: "active",
//     iconKey: "home",
//     description: "Sử dụng tiện ích hồ bơi và phòng gym cao cấp.",
//   },
//   {
//     id: "S12",
//     name: "Chăm sóc cây xanh",
//     price: 15000,
//     unit: "phòng",
//     status: "active",
//     iconKey: "home",
//     description: "Duy trì cảnh quan xanh mát tại khuôn viên.",
//   },
// ];

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

  // 1. Fetch data từ API - Xử lý theo kiểu throw error
  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await serviceApi.getAllServices();
      console.log("API Response service:", res); // Debug log để xem cấu trúc dữ liệu trả về
      // Theo JSON anh gửi: res là object bọc ngoài, res.data mới là mảng service
      if (res && res.data) {
        setServices(res.data);
      }
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error(error?.message || "Không thể tải danh sách dịch vụ");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 2. Logic lọc dữ liệu tổng hợp
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchSearch = s.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter, services]);

  // 3. Logic phân trang
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

  // 4. Xử lý Lưu (Create/Update)
  const handleSave = async (data: any) => {
    try {
      if (editingService) {
        await serviceApi.updateService(editingService.id, data);
        toast.success("Cập nhật thành công");
      } else {
        await serviceApi.createService(data);
        toast.success("Thêm mới thành công");
      }
      fetchServices(); // Refresh lại danh sách
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra khi lưu dữ liệu");
    }
  };

  // 5. Xử lý Xóa
  const handleDelete = async (id: string) => {
    if (confirm("Anh có chắc muốn xóa dịch vụ này không?")) {
      try {
        await serviceApi.deleteService(id);
        toast.success("Đã xóa dịch vụ");
        fetchServices();
      } catch (error: any) {
        toast.error(error?.message || "Không thể xóa dịch vụ");
      }
    }
  };

  return (
    <div className="max-w-360 mx-auto space-y-8 animate-in fade-in duration-500">
      <ServiceHeader onAdd={handleAddNew} />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Danh mục dịch vụ
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Vận hành và cấu hình các gói tiện ích tòa nhà
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <ServiceToolbar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-sm text-slate-500">Đang tải dữ liệu...</p>
          </div>
        ) : paginatedServices.length > 0 ? (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {paginatedServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service as any}
                onEdit={() => handleEdit(service)}
                // onDelete={() => handleDelete(service.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-slate-50/40 rounded-3xl border border-dashed border-slate-200">
            <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
              <Inbox className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-sm text-slate-500 font-medium italic">
              Không tìm thấy kết quả phù hợp
            </p>
            <Button
              variant="ghost"
              className="mt-2 text-xs text-indigo-600 hover:bg-indigo-50"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
            >
              Xóa tất cả bộ lọc
            </Button>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
              Trang {currentPage} <span className="mx-1 text-slate-200">/</span>{" "}
              {totalPages}
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-900"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-900"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center px-2 gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant="ghost"
                      className={`h-8 min-w-8 px-2 text-xs font-bold rounded-lg ${
                        currentPage === page
                          ? "text-indigo-600 bg-indigo-50"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ),
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-900"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-900"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
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
