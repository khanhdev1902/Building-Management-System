"use client";

import React from "react";
import {
  FileText,
  Calendar,
  ShieldCheck,
  Zap,
  Droplets,
  Wifi,
  Trash2,
  Download,
  ExternalLink,
  History,
  CheckCircle2,
  FileClock,
  CircleDollarSign,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

export function TabContract() {
  // Mockup dữ liệu chu kỳ hợp đồng pháp lý thực tế năm 2026
  const contractInfo = {
    code: "HD-2026-002",
    title: "Hợp đồng thuê căn hộ dịch vụ - Phòng 101",
    deposit: "4,500,000",
    rentPrice: "4,500,000",
    cycle: "Thanh toán 1 tháng / lần",
    startDate: "15/01/2026",
    endDate: "15/01/2027",
    signedDate: "12/01/2026",
    manager: "Khánh Nguyễn (Admin)",
    files: [
      { name: "HopDongThue_ChinhThuc_P101.pdf", size: "2.4 MB" },
      { name: "PhuLuc_BanGiaoTaiSan_P101.pdf", size: "1.8 MB" },
    ],
  };

  const servicePrices = [
    {
      name: "Điện tiêu thụ",
      price: "3.500đ",
      unit: "kWh",
      note: "Số nền gốc: 2100 kWh",
      icon: <Zap size={13} className="text-amber-500" />,
    },
    {
      name: "Nước sinh hoạt",
      price: "100.000đ",
      unit: "Người/Tháng",
      note: "Số nền gốc: 800 m³",
      icon: <Droplets size={13} className="text-blue-500" />,
    },
    {
      name: "Mạng Internet (Wifi)",
      price: "100.000đ",
      unit: "Phòng/Tháng",
      note: "Băng thông cố định 150Mbps",
      icon: <Wifi size={13} className="text-sky-500" />,
    },
    {
      name: "Phí dịch vụ chung",
      price: "150.000đ",
      unit: "Phòng/Tháng",
      note: "Vệ sinh hành lang, thang máy, rác",
      icon: <CircleDollarSign size={13} className="text-slate-500" />,
    },
  ];

  return (
    <div className="divide-y divide-slate-100/70 font-sans animate-in fade-in duration-300">
      {/* SECTION 1: CHI TIẾT ĐIỀU KHOẢN HỢP ĐỒNG PHÁP LÝ */}
      <section className="p-5 space-y-4">
        <div className="flex items-center justify-between select-none">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <FileText size={14} className="text-slate-400" /> Thông tin hợp đồng
            thuê gốc
          </h3>
          <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded flex items-center gap-1">
            <ShieldCheck size={12} /> Chứng từ gốc hệ thống
          </span>
        </div>

        {/* Lưới thông số hợp đồng phẳng dẹt */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3.5 gap-x-5 text-xs font-medium text-slate-600 bg-slate-50/40 p-4 rounded-xl border border-slate-100">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
              Mã số chứng từ
            </span>
            <span className="font-mono font-bold text-slate-900">
              {contractInfo.code}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
              Giá thuê mặt bằng
            </span>
            <span className="font-mono font-bold text-slate-800">
              {contractInfo.rentPrice} đ / tháng
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
              Bảo lưu quỹ tiền cọc
            </span>
            <span className="font-mono font-bold text-indigo-600">
              {contractInfo.deposit} đ
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
              Chu kỳ thanh toán
            </span>
            <span className="text-slate-800 font-semibold">
              {contractInfo.cycle}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
              Ngày kích hoạt ở
            </span>
            <span className="font-mono text-slate-700">
              {contractInfo.startDate}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
              Ngày đáo hạn hợp đồng
            </span>
            <span className="font-mono text-amber-600 font-bold">
              {contractInfo.endDate}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
              Ngày ký kết văn bản
            </span>
            <span className="font-mono text-slate-500">
              {contractInfo.signedDate}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
              Nhân sự thụ lý hồ sơ
            </span>
            <span className="text-slate-500 font-sans">
              {contractInfo.manager}
            </span>
          </div>
        </div>

        {/* Khay lưu trữ file văn bản số hóa */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Tệp tin số hóa biên bản hợp đồng
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {contractInfo.files.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 border border-slate-100 rounded-lg bg-white group hover:border-slate-300 transition-colors text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-md text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0">
                    <FileText size={14} />
                  </div>
                  <div className="min-w-0">
                    <span
                      className="font-semibold text-slate-700 truncate block text-xs"
                      title={file.name}
                    >
                      {file.name}
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 font-mono block uppercase tracking-wide mt-0.5">
                      {file.size}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:text-slate-800 rounded-md"
                  >
                    <Download size={13} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: ĐỊNH MỨC GIÁ DỊCH VỤ & CHỐT ĐẦU KỲ PHÒNG */}
      <section className="p-5 space-y-3.5">
        <div className="flex items-center justify-between select-none">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <FileClock size={14} className="text-slate-400" /> Danh mục đơn giá
            dịch vụ phòng đang áp dụng
          </h3>
          <Button
            variant="outline"
            size="sm"
            className="h-6.5 text-[10px] font-semibold border-slate-200 rounded-md text-slate-600 hover:bg-slate-50"
          >
            Cấu hình lại giá dịch vụ
          </Button>
        </div>

        {/* Lưới danh sách đơn giá dịch vụ phẳng dẹt tràn lề */}
        <div className="rounded-xl border border-slate-200/60 overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-slate-50/30 border-b border-slate-100 select-none">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-4 py-2">
                  Tên dịch vụ liên kết
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2">
                  Mức đơn giá áp dụng
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2">
                  Đơn vị tính
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2 pl-2">
                  Ghi chú đối trừ / Chỉ số nền gốc
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-50 text-xs">
              {servicePrices.map((service, idx) => (
                <TableRow
                  key={idx}
                  className="hover:bg-slate-50/30 border-none group"
                >
                  <TableCell className="font-bold text-slate-800 pl-4 py-2.5">
                    <div className="flex items-center gap-2">
                      {service.icon}
                      <span>{service.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono font-bold text-slate-900 py-2.5">
                    {service.price}
                  </TableCell>
                  <TableCell className="text-slate-400 font-medium font-mono py-2.5">
                    /{service.unit}
                  </TableCell>
                  <TableCell className="text-slate-500 font-medium py-2.5 italic pl-2">
                    {service.note}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-start gap-1.5 text-[10px] text-slate-400 font-medium leading-normal bg-slate-50/60 p-2.5 rounded-lg border border-dashed border-slate-200 select-none">
          <CheckCircle2 size={12} className="text-slate-400 mt-0.5 shrink-0" />
          <span>
            Biểu giá dịch vụ trên được khóa chốt cố định theo chu kỳ hợp đồng.
            Mọi thay đổi về đơn giá điện nước tòa nhà của ban quản lý sẽ không
            tự động áp đặt vào phòng này cho đến khi ký phụ lục hợp đồng mới.
          </span>
        </div>
      </section>
    </div>
  );
}
