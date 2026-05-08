"use client";

import React, { useState } from "react";
import { ArrowLeft, History, LayoutGrid } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ContractHistorySheet } from "./ContractHistorySheet";
import { InvoiceHistorySheet } from "./InvoiceHistorySheet";

interface RoomHeaderProps {
  roomNumber: string;
  floor: string;
  area: string;
  type: string;
  statusLabel: string;
  onBack?: () => void;
  onViewHistory?: () => void;
  onRenewContract?: () => void;
}
const MOCK_CONTRACTS = [
  {
    id: "DJ-2026-A101",
    representative: "Nguyễn Văn Khanh",
    startDate: "20/03/2026",
    endDate: "20/03/2027",
    status: "active",
    price: 6500000,
    deposit: 13000000,
    note: "Hợp đồng mới nhất, khách thiện chí.",
  },
  {
    id: "DJ-2025-A101",
    representative: "Trần Minh Tâm",
    startDate: "15/01/2025",
    endDate: "15/01/2026",
    status: "expired",
    price: 6000000,
    deposit: 12000000,
    note: "Khách hoàn thành hợp đồng, đã hoàn cọc.",
  },
  {
    id: "DJ-2025-A101",
    representative: "Trần Minh Tâm",
    startDate: "15/01/2025",
    endDate: "15/01/2026",
    status: "expired",
    price: 6000000,
    deposit: 12000000,
    note: "Khách hoàn thành hợp đồng, đã hoàn cọc.",
  },
  {
    id: "DJ-2025-A101",
    representative: "Trần Minh Tâm",
    startDate: "15/01/2025",
    endDate: "15/01/2026",
    status: "expired",
    price: 6000000,
    deposit: 12000000,
    note: "Khách hoàn thành hợp đồng, đã hoàn cọc.",
  },
  {
    id: "DJ-2025-A101",
    representative: "Trần Minh Tâm",
    startDate: "15/01/2025",
    endDate: "15/01/2026",
    status: "expired",
    price: 6000000,
    deposit: 12000000,
    note: "Khách hoàn thành hợp đồng, đã hoàn cọc.",
  },
  {
    id: "DJ-2025-A101",
    representative: "Trần Minh Tâm",
    startDate: "15/01/2025",
    endDate: "15/01/2026",
    status: "expired",
    price: 6000000,
    deposit: 12000000,
    note: "Khách hoàn thành hợp đồng, đã hoàn cọc.",
  },
  {
    id: "DJ-2025-A101",
    representative: "Trần Minh Tâm",
    startDate: "15/01/2025",
    endDate: "15/01/2026",
    status: "expired",
    price: 6000000,
    deposit: 12000000,
    note: "Khách hoàn thành hợp đồng, đã hoàn cọc.",
  },
  {
    id: "DJ-2025-A101",
    representative: "Trần Minh Tâm",
    startDate: "15/01/2025",
    endDate: "15/01/2026",
    status: "expired",
    price: 6000000,
    deposit: 12000000,
    note: "Khách hoàn thành hợp đồng, đã hoàn cọc.",
  },
];

const MOCK_INVOICES = [
  {
    id: "INV-2026-04",
    month: "04",
    year: "2026",
    totalAmount: 7250000,
    status: "paid",
    paidBy: "Nguyễn Văn Khanh",
    paymentMethod: "Chuyển khoản (MB)",
    paymentDate: "02/04/2026",
    transactionId: "FT2604018892",
  },
  {
    id: "INV-2026-03",
    month: "03",
    year: "2026",
    totalAmount: 6850000,
    status: "paid",
    paidBy: "Lê Minh Nhật",
    paymentMethod: "Tiền mặt",
    paymentDate: "05/03/2026",
    transactionId: "CASH-3992",
  },
  {
    id: "INV-2026-05",
    month: "05",
    year: "2026",
    totalAmount: 7100000,
    status: "pending", // Hóa đơn chưa thanh toán sẽ hiện thông báo cảnh báo
  },
];

export const RoomHeader = ({
  roomNumber,
  floor,
  area,
  type,
  statusLabel,
  onBack,
}: RoomHeaderProps) => {
  const [isContractSheetOpen, setIsContractSheetOpen] = useState(false);
  const [isInvoiceSheetOpen, setIsInvoiceSheetOpen] = useState(false); // Thêm cái này
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      {/* Thông tin phòng & Breadcrumb */}
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="-ml-2 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
        </Button>

        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            {roomNumber}
          </h1>
          <Badge className="bg-slate-900 text-white hover:bg-slate-900 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            {statusLabel}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
          <span className="flex items-center gap-1.5">
            <LayoutGrid className="w-4 h-4" /> Tầng {floor}
          </span>
          <span className="flex items-center gap-1.5 border-l pl-4">
            <LayoutGrid className="w-4 h-4" /> {area} m²
          </span>
          <span className="flex items-center gap-1.5 border-l pl-4 text-indigo-600">
            {type}
          </span>
        </div>
      </div>

      {/* Nhóm Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setIsInvoiceSheetOpen(true)} // Mở sheet hóa đơn
          className="border-slate-200 text-slate-700 font-semibold h-11 px-6 hover:bg-slate-50"
        >
          <History className="mr-2 h-4 w-4" /> Lịch sử hóa đơn
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsContractSheetOpen(true)} // Mở sheet hợp đồng
          className="border-slate-200 text-slate-700 font-semibold h-11 px-6 hover:bg-slate-50"
        >
          <History className="mr-2 h-4 w-4" /> Lịch sử hợp đồng
        </Button>
      </div>

      {/* Sheet Lịch sử Hợp đồng */}
      <ContractHistorySheet
        isOpen={isContractSheetOpen}
        onClose={() => setIsContractSheetOpen(false)}
        contracts={MOCK_CONTRACTS}
      />

      {/* Sheet Lịch sử Hóa đơn */}
      <InvoiceHistorySheet
        isOpen={isInvoiceSheetOpen}
        onClose={() => setIsInvoiceSheetOpen(false)}
        invoices={MOCK_INVOICES}
      />
    </div>
  );
};
