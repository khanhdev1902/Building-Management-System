"use client";

import React, { useState, useMemo } from "react";
import { ContractHeader } from "./components/contract-header";
import { ContractStatsBanner } from "./components/contract-stats-banner";
import { ContractFilterToolbar } from "./components/contract-filter-toolbar";
// KHẮC PHỤC: Bổ sung import ContractTable bị sót
import { ContractTable } from "./components/contract-table";
import { CONTRACT_DATA } from "./data";


const ITEMS_PER_PAGE = 10;

export default function ContractsPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");

  // KHẮC PHỤC: Khai báo lại state currentPage quản lý phân trang bảng
  const [currentPage, setCurrentPage] = useState(1);

  // KHẮC PHỤC: Khai báo đầy đủ cấu trúc state filters tránh lỗi "undefined"
  const [filters, setFilters] = useState({
    tower: "all",
    room: "all",
    status: "all",
    paymentStatus: "all",
    minPrice: "",
    maxPrice: "",
  });

  // Thuật toán bộ lọc đa năng phối hợp Search + Click Banner Stats + Popover nâng cao
  const filteredContracts = useMemo(() => {
    return CONTRACT_DATA.filter((item) => {
      // 1. Kiểm tra từ khóa tìm kiếm (Mã HĐ, Số phòng, Tên khách)
      const matchesSearch =
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.room.includes(search) ||
        item.tenant.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Lọc theo Block / Tòa nhà
      if (filters.tower !== "all" && item.tower !== filters.tower) return false;

      // 3. Lọc theo Số phòng cụ thể
      if (filters.room !== "all" && item.room !== filters.room) return false;

      // 4. Lọc theo Tình trạng pháp lý (Kết hợp cả trạng thái ở Banner Stats và Popover)
      if (filters.status !== "all" && item.status !== filters.status)
        return false;

      // 5. Lọc theo Trạng thái bảo lưu tiền cọc quỹ
      if (
        filters.paymentStatus !== "all" &&
        item.paymentStatus !== filters.paymentStatus
      )
        return false;

      // 6. Lọc theo Khoảng đơn giá thuê (Min Price)
      if (filters.minPrice !== "" && item.rent < Number(filters.minPrice))
        return false;

      // 7. Lọc theo Khoảng đơn giá thuê (Max Price)
      if (filters.maxPrice !== "" && item.rent > Number(filters.maxPrice))
        return false;

      return true;
    });
  }, [search, filters]);

  // Thuật toán Phân trang động bám sát lưới dữ liệu thực tế
  const totalPages = Math.ceil(filteredContracts.length / ITEMS_PER_PAGE);
  const paginatedContracts = useMemo(() => {
    return filteredContracts.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );
  }, [filteredContracts, currentPage]);

  // Đếm nhanh số lượng theo từng trạng thái để đẩy ngược chỉ số lên Banner Stats thực tế
  const statsCounts = useMemo(
    () => ({
      total: CONTRACT_DATA.length,
      active: CONTRACT_DATA.filter((c) => c.status === "active").length,
      expiring: CONTRACT_DATA.filter((c) => c.status === "expiring").length,
      expired: CONTRACT_DATA.filter((c) => c.status === "expired").length,
    }),
    [],
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-slate-50/20 min-h-screen antialiased">
      {/* 1. Header phân hệ chính */}
      <ContractHeader totalContracts={statsCounts.total} />

      {/* 2. Banner thống kê số liệu - Đã kết nối hàm đổi state filter khi click */}
      <ContractStatsBanner
        activeCount={statsCounts.active}
        expiringCount={statsCounts.expiring}
        pendingCount={statsCounts.expired} // Hiển thị số lượng hợp đồng đã kết thúc/chờ xử lý thanh lý
        totalDeposit="185.5M"
        activeFilter={filters.status}
        onFilterChange={(status) => {
          setFilters({ ...filters, status });
          setCurrentPage(1); // Reset trang về 1 khi đổi bộ lọc
        }}
      />

      {/* 3. Toolbar tìm kiếm & bộ lọc nâng cao (Khoảng giá, Tòa nhà, Số phòng) */}
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

      {/* 4. Khay lưới Bảng dữ liệu chính pháp lý */}
      <ContractTable
        data={paginatedContracts} // KHẮC PHỤC: Đưa mảng đã xử lý lọc và phân trang thực tế vào đây
        currentPage={currentPage}
        totalPages={totalPages || 1}
        onPageChange={setCurrentPage}
        totalRecords={filteredContracts.length}
      />
    </div>
  );
}
