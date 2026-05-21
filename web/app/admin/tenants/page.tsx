"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { TenantHeader } from "./components/tenant-header";
import { TenantStatsBanner } from "./components/tenant-stats-banner";
import { TenantFilterToolbar } from "./components/tenant-filter-toolbar";
import { TenantTable } from "./components/tenant-table";
import { Tenant } from "./types/tenant.type";
import { tenantApi } from "./apis/tenant.api";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

export default function TenantsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading toàn cục
  const [isRefreshing, setIsRefreshing] = useState(false); // Trạng thái hiệu ứng xoay nút refresh

  // Hàm gọi API bọc trong useCallback để dùng lại khi Refresh hỏa tốc
  const getTenants = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    setIsLoading(true);
    try {
      const res = await tenantApi.getAllTenants();
      setTenants(res.data || res);
      if (isManualRefresh) {
        toast.success("Đã làm mới danh sách cư dân mới nhất!");
      }
    } catch (error) {
      console.error("Lỗi đồng bộ API cư dân: ", error);
      toast.error("Không thể kết nối với máy chủ, vui lòng thử lại.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Kéo dữ liệu nhân khẩu lần đầu khi mở trang
  useEffect(() => {
    getTenants();
  }, [getTenants]);

  // ĐỒNG BỘ TOÀN DIỆN SCHEMA BỘ LỌC THỰC TẾ
  const [filters, setFilters] = useState({
    floor: "all",
    roomNumber: "all",
    province: "all",
    gender: "all",
    identityVerified: "all",
    hasVehicle: "all",
  });

  // 1. MA TRẬN LỌC TẬP TRUNG
  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const matchesSearch =
        tenant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.phone.includes(searchTerm) ||
        (tenant.citizenId && tenant.citizenId.includes(searchTerm));

      if (!matchesSearch) return false;

      if (statusFilter !== "all" && tenant.status !== statusFilter) {
        return false;
      }

      if (
        filters.floor !== "all" &&
        tenant.roomNumber &&
        !tenant.roomNumber.startsWith(filters.floor)
      ) {
        return false;
      }

      if (
        filters.roomNumber !== "all" &&
        tenant.roomNumber !== filters.roomNumber
      ) {
        return false;
      }

      if (
        filters.province !== "all" &&
        tenant.hometown?.province !== filters.province
      ) {
        return false;
      }

      if (filters.gender !== "all" && tenant.gender !== filters.gender) {
        return false;
      }

      if (filters.identityVerified !== "all") {
        const isVerified = tenant.identityVerified === true;
        if (filters.identityVerified === "verified" && !isVerified)
          return false;
        if (filters.identityVerified === "unverified" && isVerified)
          return false;
      }

      if (filters.hasVehicle !== "all") {
        const hasVehicle = tenant.vehicles && tenant.vehicles.length > 0;
        if (filters.hasVehicle === "yes" && !hasVehicle) return false;
        if (filters.hasVehicle === "no" && hasVehicle) return false;
      }

      return true;
    });
  }, [tenants, searchTerm, statusFilter, filters]);

  // 2. THUẬT TOÁN BẺ PHÂN TRANG
  const totalPages = Math.ceil(filteredTenants.length / ITEMS_PER_PAGE);

  const paginatedTenants = useMemo(() => {
    return filteredTenants.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );
  }, [filteredTenants, currentPage]);

  // Bộ đếm số liệu thời gian thực hiển thị lên Banner Stats
  const statsCounts = useMemo(
    () => ({
      total: tenants.length,
      pending: tenants.filter((t) => t.status === "PENDING").length,
      active: tenants.filter((t) => t.status === "ACTIVE").length,
      expiring: tenants.filter((t) => t.status === "EXPIRING").length,
      unverified: tenants.filter((t) => !t.identityVerified).length,
    }),
    [tenants],
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-5.5 bg-slate-50/20 min-h-screen antialiased select-none">
      {/* KHU VỰC HEADER TÍCH HỢP NÚT REFRESH ĐỒNG BỘ */}
        <TenantHeader
          totalTenants={statsCounts.total}
          getTenants={getTenants}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
        />

      {/* Banner thống kê trạng thái */}
      <TenantStatsBanner
        statsCounts={statsCounts}
        statusFilter={statusFilter}
        onFilterChange={(status) => {
          setStatusFilter(status);
          setCurrentPage(1);
        }}
      />

      {/* Thanh tìm kiếm & bộ lọc nâng cao Popover */}
      <TenantFilterToolbar
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        filters={filters}
        onFiltersChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
      />

      {/* ĐIỀU PHỐI LUỒNG: HIỂN THỊ SKELETON LOADING HOẶC DATA TABLE NGUYÊN BẢN */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <TenantTable
          data={paginatedTenants}
          currentPage={currentPage}
          totalPages={totalPages || 1}
          onPageChange={setCurrentPage}
          totalRecords={filteredTenants.length}
        />
      )}
    </div>
  );
}

// --- SUB-COMPONENT TRỰC QUAN MÔ PHỎNG PHÔI SKELETON CHO TABLE CHỜ TẢI DỮ LIỆU ---
function TableSkeleton() {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden p-4 space-y-4 animate-pulse">
      {/* Thảo khung header ảo */}
      <div className="grid grid-cols-6 gap-4 border-b border-slate-100 pb-3">
        <div className="h-3.5 bg-slate-100 rounded-md col-span-2" />
        <div className="h-3.5 bg-slate-100 rounded-md" />
        <div className="h-3.5 bg-slate-100 rounded-md" />
        <div className="h-3.5 bg-slate-100 rounded-md" />
        <div className="h-3.5 bg-slate-100 rounded-md text-center" />
      </div>
      {/* Lặp 4 dòng xương cá mô phỏng row */}
      {[...Array(4)].map((_, index) => (
        <div key={index} className="grid grid-cols-6 gap-4 items-center py-2.5">
          <div className="space-y-2 col-span-2">
            <div className="h-4 bg-slate-50 rounded-md w-3/4" />
            <div className="h-3 bg-slate-50 rounded-md w-1/2" />
          </div>
          <div className="h-4 bg-slate-50 rounded-md w-2/3" />
          <div className="h-4 bg-slate-50 rounded-md w-5/6" />
          <div className="h-4 bg-slate-50 rounded-md w-1/2" />
          <div className="h-6 bg-slate-50 rounded-full w-16 mx-auto" />
        </div>
      ))}
    </div>
  );
}
