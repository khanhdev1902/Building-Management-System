"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ContractHeader } from "./components/contract-header";
import { ContractStatsBanner } from "./components/contract-stats-banner";
import { ContractFilterToolbar } from "./components/contract-filter-toolbar";
import { ContractTable } from "./components/contract-table";
import { contractApi } from "./new/apis/contracts.api";
import { ContractResponse } from "./new/types/contract.type";
import { ContractTableSkeleton } from "./components/contract-table-skeleton";

const ITEMS_PER_PAGE = 10;

export default function ContractsPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");
  const [contracts, setContracts] = useState<ContractResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // KHẮC PHỤC: Tách hàm fetch data ra riêng và bọc useCallback để tái sử dụng
  const fetchContracts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await contractApi.getAllContracts();
      // Giả lập độ trễ ngắn để hiệu ứng xoay icon và Skeleton hiển thị mượt mà
      await new Promise((resolve) => setTimeout(resolve, 500));
      setContracts(res.data || []);
    } catch (error) {
      console.error("Lỗi fetch hợp đồng:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Gọi lần đầu khi Component Mount
  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const [filters, setFilters] = useState({
    tower: "all",
    room: "all",
    status: "all",
    paymentStatus: "all",
    minPrice: "",
    maxPrice: "",
  });

  // Thuật toán bộ lọc nâng cao
  const filteredContracts = useMemo(() => {
    return contracts.filter((item) => {
      const matchesSearch =
        (item.id?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (item.room || "").includes(search) ||
        (item.tenant?.toLowerCase() || "").includes(search.toLowerCase());

      if (!matchesSearch) return false;
      if (filters.tower !== "all" && item.tower !== filters.tower) return false;
      if (filters.room !== "all" && item.room !== filters.room) return false;
      if (filters.status !== "all" && item.status !== filters.status)
        return false;
      if (
        filters.minPrice !== "" &&
        (item.rent ?? 0) < Number(filters.minPrice)
      )
        return false;
      if (
        filters.maxPrice !== "" &&
        (item.rent ?? 0) > Number(filters.maxPrice)
      )
        return false;

      return true;
    });
  }, [search, filters, contracts]);

  // Phân trang động
  const totalPages = Math.ceil(filteredContracts.length / ITEMS_PER_PAGE);
  const paginatedContracts = useMemo(() => {
    return filteredContracts.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );
  }, [filteredContracts, currentPage]);

  // Đếm nhanh số lượng trạng thái cho StatsBanner
  const statsCounts = useMemo(
    () => ({
      total: contracts.length,
      active: contracts.filter(
        (c) => c.status === "ACTIVE" || c.status === "active",
      ).length,
      expiring: contracts.filter(
        (c) => c.status === "EXPIRING" || c.status === "expiring",
      ).length,
      expired: contracts.filter(
        (c) => c.status === "EXPIRED" || c.status === "expired",
      ).length,
    }),
    [contracts],
  );

  const totalDeposit = (contracts || [])
    .filter((c) => c.status === "ACTIVE")
    .reduce((sum, c) => sum + Number(c.deposit), 0);
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-slate-50/20 min-h-screen antialiased">
      {/* 1. Header phân hệ chính - KẾT NỐI HÀM REFRESH DATA */}
      <ContractHeader
        totalContracts={statsCounts.total}
        onRefresh={fetchContracts}
        isRefreshing={isLoading}
      />

      {/* 2. Banner thống kê số liệu */}
      <ContractStatsBanner
        activeCount={statsCounts.active}
        expiringCount={statsCounts.expiring}
        pendingCount={statsCounts.expired}
        totalDeposit={isLoading ? "..." :`${ totalDeposit.toLocaleString('vi-VN')}đ`}
        activeFilter={filters.status}
        onFilterChange={(status) => {
          setFilters({ ...filters, status });
          setCurrentPage(1);
        }}
      />

      {/* 3. Toolbar tìm kiếm & bộ lọc nâng cao */}
      <ContractFilterToolbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={filters}
        onFiltersChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
      />

      {/* 4. Khay lưới Bảng dữ liệu chính pháp lý kết hợp hiệu ứng RENDER ĐỘNG */}
      {isLoading ? (
        <ContractTableSkeleton />
      ) : (
        <ContractTable
          data={paginatedContracts}
          currentPage={currentPage}
          totalPages={totalPages || 1}
          onPageChange={setCurrentPage}
          totalRecords={filteredContracts.length}
        />
      )}
    </div>
  );
}
