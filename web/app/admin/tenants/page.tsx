"use client";

import React, { useState, useMemo } from "react";
import { TenantHeader } from "./components/tenant-header";
import { TenantStatsBanner } from "./components/tenant-stats-banner";
import { TenantFilterToolbar } from "./components/tenant-filter-toolbar";
import { TenantTable } from "./components/tenant-table";
import { TENANTS } from "./data";
// Lưu ý: Sửa lại đường dẫn import file mockup-data cho đúng cấu trúc thư mục của anh

// Cấu hình số lượng bản ghi tối đa hiển thị trên một trang
const ITEMS_PER_PAGE = 10;

export default function TenantsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    floor: "all",
    identityVerified: "all",
    hasVehicle: "all",
  });

  // 1. Luồng xử lý dữ liệu FILTER tập trung (Computed State)
  const filteredTenants = useMemo(() => {
    return TENANTS.filter((tenant) => {
      // Tìm kiếm nhanh theo Tên, ID, Số điện thoại
      const matchesSearch =
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.phone.includes(searchTerm);

      if (!matchesSearch) return false;

      // Click lọc nhanh trạng thái từ Banner Stats
      if (
        statusFilter !== "all" &&
        statusFilter !== "unverified" &&
        tenant.status !== statusFilter
      )
        return false;
      if (statusFilter === "unverified" && tenant.identityVerified)
        return false;

      // Popover lọc nâng cao 1: Vị trí Tầng (Kiểm tra ký tự đầu của số phòng)
      if (filters.floor !== "all" && !tenant.room.startsWith(filters.floor))
        return false;

      // Popover lọc nâng cao 2: Trạng thái đối chiếu CCCD
      if (filters.identityVerified === "verified" && !tenant.identityVerified)
        return false;
      if (filters.identityVerified === "unverified" && tenant.identityVerified)
        return false;

      // KHẮC PHỤC: Kích hoạt bộ lọc nâng cao 3 - Tình trạng gửi xe tại hầm
      if (
        filters.hasVehicle !== "all" &&
        tenant.hasVehicle !== filters.hasVehicle
      )
        return false;

      return true;
    });
  }, [searchTerm, statusFilter, filters]);

  // 2. THUẬT TOÁN PHÂN TRANG (PAGINATION LOGIC)
  const totalPages = Math.ceil(filteredTenants.length / ITEMS_PER_PAGE);

  const paginatedTenants = useMemo(() => {
    return filteredTenants.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );
  }, [filteredTenants, currentPage]);

  // Đếm số lượng thực tế dựa trên mốc database gốc để đẩy lên Banner Stats
  const statsCounts = useMemo(
    () => ({
      total: TENANTS.length,
      active: TENANTS.filter((t) => t.status === "active").length,
      expiring: TENANTS.filter((t) => t.status === "expiring").length,
      unverified: TENANTS.filter((t) => !t.identityVerified).length,
    }),
    [],
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-5.5 bg-slate-50/20 min-h-screen antialiased">
      {/* Header phân hệ chính */}
      <TenantHeader totalTenants={statsCounts.total} />

      {/* Banner thống kê số liệu tích hợp bấm lọc nhanh */}
      <TenantStatsBanner
        statsCounts={statsCounts}
        statusFilter={statusFilter}
        onFilterChange={(status) => {
          setStatusFilter(status);
          setCurrentPage(1); // Quy tắc SaaS: Reset về trang 1 khi đổi bộ lọc
        }}
      />

      {/* Thanh công cụ tìm kiếm và Popover cấu hình lọc chuyên sâu */}
      <TenantFilterToolbar
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1); // Reset về trang 1 khi gõ từ khóa tìm kiếm
        }}
        filters={filters}
        onFiltersChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1); // Reset về trang 1 khi thay đổi điều kiện lọc trong Popover
        }}
      />

      {/* Bảng hiển thị danh sách dữ liệu phẳng dẹt tràn viền */}
      <TenantTable
        data={paginatedTenants} // Đã đổi sang mảng paginatedTenants đã được cắt gọn (Trang 1: 10 dòng, Trang 2: 5 dòng)
        currentPage={currentPage}
        totalPages={totalPages || 1} // Đảm bảo nếu không có data thì totalPages tối thiểu vẫn bằng 1 để tránh lỗi UI
        onPageChange={setCurrentPage}
        totalRecords={filteredTenants.length} // Tổng số lượng bản ghi sau khi đã qua bộ lọc
      />
    </div>
  );
}
