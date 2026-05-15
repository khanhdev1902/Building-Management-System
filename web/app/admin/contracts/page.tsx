"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Calendar,
  MoreHorizontal,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  AlertCircle,
  Home,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import Link from "next/link";

const CONTRACT_DATA = [
  {
    id: "HD-2026-001",
    room: "P.101",
    tower: "Danjin A",
    tenant: "Nguyễn Văn Anh",
    avatar: "https://github.com/shadcn.png",
    startDate: "10/01/2026",
    endDate: "10/01/2027",
    deposit: 4500000,
    rent: 4500000,
    status: "active",
    paymentStatus: "paid",
  },
  {
    id: "HD-2026-002",
    room: "P.202",
    tower: "Danjin A",
    tenant: "Trần Thị Bình",
    avatar: "",
    startDate: "15/06/2026",
    endDate: "15/06/2027",
    deposit: 5000000,
    rent: 5200000,
    status: "expiring",
    paymentStatus: "partial",
  },
  {
    id: "HD-2025-089",
    room: "P.305",
    tower: "Danjin B",
    tenant: "Lê Văn Cường",
    avatar: "",
    startDate: "01/05/2025",
    endDate: "01/05/2026",
    deposit: 3500000,
    rent: 3500000,
    status: "expired",
    paymentStatus: "paid",
  },
];

export default function ContractsPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  return (
    <div className="flex flex-col gap-8 p-8 bg-slate-50/50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            Hợp đồng thuê phòng
          </h1>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mt-1">
            <Home className="w-4 h-4" />
            <span>Hệ thống Danjin Tower • 45 hợp đồng tổng cộng</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 font-bold text-xs h-11 px-5 shadow-sm bg-white hover:bg-slate-50"
          >
            <Download className="w-4 h-4 mr-2" /> Xuất báo cáo
          </Button>
          <Button className="rounded-xl bg-slate-900 text-white font-bold text-xs h-11 px-6 shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
            <Link href="/contracts/new" className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Tạo hợp đồng
            </Link>
          </Button>
        </div>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Đang hiệu lực"
          value="38"
          trend="+2 tháng này"
          color="emerald"
        />
        <StatCard
          label="Sắp hết hạn (30d)"
          value="05"
          trend="Cần xử lý"
          color="orange"
        />
        <StatCard
          label="Chờ bàn giao"
          value="02"
          trend="Trong tuần"
          color="blue"
        />
        <StatCard
          label="Tổng tiền cọc giữ"
          value="185.5M"
          unit="VND"
          color="slate"
        />
      </div>

      {/* FILTER & TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex flex-1 items-center gap-3 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Tìm mã HĐ, số phòng hoặc tên khách thuê..."
                className="pl-10 h-11 border-slate-100 bg-slate-50/50 focus-visible:ring-slate-200 rounded-xl"
              />
            </div>
            <Button
              variant="outline"
              className="h-11 rounded-xl border-slate-200 gap-2 font-bold text-xs uppercase px-5"
            >
              <Filter className="w-4 h-4" /> Lọc nâng cao
            </Button>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-slate-900" : "text-slate-400"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-slate-900" : "text-slate-400"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b border-slate-100">
              <TableHead className="w-12 px-6">
                <input
                  type="checkbox"
                  className="rounded-md border-slate-300"
                />
              </TableHead>
              <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-widest px-4">
                Mã hợp đồng
              </TableHead>
              <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-widest">
                Vị trí
              </TableHead>
              <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-widest">
                Chủ hộ / Đại diện
              </TableHead>
              <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-widest">
                Thời hạn thuê
              </TableHead>
              <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-widest text-right">
                Giá thuê
              </TableHead>
              <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-widest text-center">
                Trạng thái
              </TableHead>
              <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-widest text-right px-6">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CONTRACT_DATA.map((item) => (
              <TableRow
                key={item.id}
                className="group hover:bg-slate-50/80 transition-all border-b border-slate-50"
              >
                <TableCell className="px-6">
                  <input
                    type="checkbox"
                    className="rounded-md border-slate-300"
                  />
                </TableCell>
                <TableCell className="font-bold text-slate-500 py-5 px-4 text-xs">
                  {item.id}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 text-sm">
                      {item.room}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {item.tower}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 rounded-lg border border-slate-100 shadow-sm">
                      <AvatarImage src={item.avatar} />
                      <AvatarFallback className="text-[10px] font-black bg-indigo-50 text-indigo-600">
                        {item.tenant[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-sm leading-none mb-1">
                        {item.tenant}
                      </span>
                      <div className="flex items-center gap-1">
                        <PaymentStatusBadge status={item.paymentStatus} />
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <span>{item.startDate}</span>
                      <ChevronRight className="w-3 h-3 text-slate-300" />
                      <span>{item.endDate}</span>
                    </div>
                    <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-900 w-[60%]" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-black text-slate-900 text-sm">
                      {item.rent.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      VNĐ / THÁNG
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex justify-end items-center gap-1">
                    <ActionButton icon={<Eye />} label="Chi tiết" />
                    <ActionButton icon={<Calendar />} label="Gia hạn" />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-xl w-48 shadow-xl border-slate-100 p-2"
                      >
                        <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 px-2 py-1.5">
                          Quản lý nghiệp vụ
                        </DropdownMenuLabel>
                        <DropdownMenuItem className="rounded-lg font-bold text-xs gap-2 py-2.5">
                          <FileText className="w-4 h-4" /> In hợp đồng (PDF)
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg font-bold text-xs gap-2 py-2.5">
                          <ArrowUpRight className="w-4 h-4" /> Biên bản bàn giao
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="rounded-lg font-bold text-xs gap-2 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50">
                          <AlertCircle className="w-4 h-4" /> Thanh lý hợp đồng
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* PAGINATION FOOTER */}
        <div className="px-6 py-5 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {" "}
            Hiển thị 1 - 3 của 45 hợp đồng{" "}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl border-slate-200 bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1 px-2">
              <Button
                size="icon"
                className="h-9 w-9 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                1
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl font-bold text-xs"
              >
                2
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl font-bold text-xs"
              >
                3
              </Button>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl border-slate-200 bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ label, value, trend, unit, color }: any) {
  const colorMap: any = {
    emerald: "text-emerald-600 bg-emerald-50",
    orange: "text-orange-600 bg-orange-50",
    blue: "text-blue-600 bg-blue-50",
    slate: "text-slate-900 bg-slate-100",
  };
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
        {label}
      </p>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-black text-slate-900 tracking-tighter">
          {value}
        </span>
        {unit && (
          <span className="text-[10px] font-black text-slate-400">{unit}</span>
        )}
      </div>
      <div
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${colorMap[color]}`}
      >
        {trend}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    active: {
      label: "Đang hiệu lực",
      classes: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    expiring: {
      label: "Sắp hết hạn",
      classes: "bg-orange-50 text-orange-600 border-orange-100",
    },
    expired: {
      label: "Đã kết thúc",
      classes: "bg-slate-100 text-slate-500 border-slate-200",
    },
  };
  const config = configs[status];
  return (
    <Badge
      className={`${config.classes} shadow-none border px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight`}
    >
      {config.label}
    </Badge>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const configs: any = {
    paid: { label: "Đã cọc", classes: "text-emerald-500" },
    partial: { label: "Cọc thiếu", classes: "text-orange-500" },
    unpaid: { label: "Chưa cọc", classes: "text-red-500" },
  };
  return (
    <span
      className={`text-[9px] font-black uppercase tracking-tighter ${configs[status].classes}`}
    >
      • {configs[status].label}
    </span>
  );
}

function ActionButton({ icon, label }: any) {
  return (
    <button className="flex flex-col items-center justify-center w-12 h-12 rounded-xl hover:bg-slate-100 transition-colors group">
      {React.cloneElement(icon, {
        className:
          "w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors",
      })}
      <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase group-hover:text-slate-900">
        {label}
      </span>
    </button>
  );
}

// ("use client");

// import React, { useState } from "react";
// import {
//   User,
//   Home,
//   Calendar,
//   CreditCard,
//   FileCheck,
//   ChevronRight,
//   ArrowLeft,
//   Info,
// } from "lucide-react";
// import { Button } from "@/shared/components/ui/button";
// import { Input } from "@/shared/components/ui/input";
// import { Separator } from "@/shared/components/ui/separator";

// function ServiceInput({ label, value, unit }: { label: string, value: string, unit: string }) {
//   return (
//     <div className="p-3 border border-slate-100 space-y-1">
//       <p className="text-[9px] font-black text-slate-400 uppercase">{label}</p>
//       <div className="flex items-baseline gap-1">
//         <span className="text-sm font-bold text-slate-900">{value}</span>
//         <span className="text-[8px] text-slate-400 font-medium">/{unit}</span>
//       </div>
//     </div>
//   );
// }

// export default function CreateContract() {
//   const [step, setStep] = useState(1);

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[600px] border border-slate-100 bg-white shadow-2xl">
//       {/* CỘT TRÁI: FORM NHẬP LIỆU (7/12) */}
//       <div className="lg:col-span-7 p-8 md:p-12 space-y-8 border-r border-slate-50">
//         {/* Step Indicator */}
//         <div className="flex items-center gap-4 mb-10">
//           <StepCircle num={1} active={step >= 1} label="Cư dân" />
//           <div
//             className={`h-[1px] w-8 ${step > 1 ? "bg-slate-900" : "bg-slate-100"}`}
//           />
//           <StepCircle num={2} active={step >= 2} label="Phòng & Giá" />
//           <div
//             className={`h-[1px] w-8 ${step > 2 ? "bg-slate-900" : "bg-slate-100"}`}
//           />
//           <StepCircle num={3} active={step >= 3} label="Điều khoản" />
//         </div>

//         <div className="space-y-6">
//           <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
//             {step === 1 && "Thông tin cư dân"}
//             {step === 2 && "Cấu hình mặt bằng"}
//             {step === 3 && "Xác nhận điều khoản"}
//           </h2>
//           {/* Form Step 1: Cư dân */}
//           {step === 1 && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black uppercase text-slate-400">
//                   Họ và tên khách thuê
//                 </label>
//                 <Input
//                   placeholder="Nguyễn Văn A"
//                   className="rounded-none border-slate-200 h-11 focus-visible:ring-slate-900"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black uppercase text-slate-400">
//                   Số điện thoại
//                 </label>
//                 <Input
//                   placeholder="09xx xxx xxx"
//                   className="rounded-none border-slate-200 h-11"
//                 />
//               </div>
//               <div className="md:col-span-2 space-y-2">
//                 <label className="text-[10px] font-black uppercase text-slate-400">
//                   Số CCCD / Định danh
//                 </label>
//                 <Input
//                   placeholder="0371 xxx xxx xxx"
//                   className="rounded-none border-slate-200 h-11"
//                 />
//               </div>
//             </div>
//           )}
//           {/* Form Step 2: Phòng & Giá */}
//           {step === 2 && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4">
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black uppercase text-slate-400">
//                   Chọn phòng
//                 </label>
//                 <Input
//                   placeholder="Gõ số phòng (ví dụ: 101)"
//                   className="rounded-none h-11"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black uppercase text-slate-400">
//                   Tiền cọc (VND)
//                 </label>
//                 <Input
//                   type="number"
//                   placeholder="4,500,000"
//                   className="rounded-none h-11 font-bold"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black uppercase text-slate-400">
//                   Ngày bắt đầu
//                 </label>
//                 <Input type="date" className="rounded-none h-11" />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black uppercase text-slate-400">
//                   Thời hạn (Tháng)
//                 </label>
//                 <Input
//                   type="number"
//                   placeholder="12"
//                   className="rounded-none h-11"
//                 />
//               </div>
//             </div>
//           )}
//           {/* /* Thêm vào Step 2 hoặc một Step riêng biệt */}
//           {step === 3 && (
//             <div className="space-y-8 animate-in fade-in">
//               {/* Phần Phòng & Giá cũ của bạn giữ nguyên ... */}

//               {/* PHẦN THÊM MỚI: QUẢN LÝ NHÂN KHẨU */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between border-b border-slate-100 pb-2">
//                   <h3 className="text-xs font-black uppercase text-slate-900 tracking-widest">
//                     Thành viên ở cùng (02)
//                   </h3>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="h-7 text-[9px] font-black uppercase rounded-none"
//                   >
//                     + Thêm người
//                   </Button>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Member 1 */}
//                   <div className="p-4 border border-slate-100 bg-slate-50/50 relative group">
//                     <Input
//                       placeholder="Họ tên người ở cùng"
//                       className="bg-transparent border-none font-bold text-xs p-0 h-auto focus-visible:ring-0 shadow-none"
//                     />
//                     <Input
//                       placeholder="Số CCCD"
//                       className="bg-transparent border-none text-[10px] p-0 h-auto focus-visible:ring-0 shadow-none mt-1"
//                     />
//                     <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 text-[8px] font-black uppercase">
//                       Xóa
//                     </button>
//                   </div>
//                   {/* Thêm nhiều member tương tự... */}
//                 </div>
//               </div>

//               {/* PHẦN THÊM MỚI: DỊCH VỤ ĐI KÈM */}
//               <div className="space-y-4 pt-4">
//                 <h3 className="text-xs font-black uppercase text-slate-900 tracking-widest border-b border-slate-100 pb-2">
//                   Dịch vụ & Định mức
//                 </h3>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <ServiceInput label="Điện" value="3.500" unit="kWh" />
//                   <ServiceInput label="Nước" value="100.000" unit="Người" />
//                   <ServiceInput label="Xe máy" value="150.000" unit="Xe" />
//                   <ServiceInput label="Combo DV" value="200.000" unit="Phòng" />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="flex items-center justify-between pt-10">
//           <Button
//             variant="ghost"
//             disabled={step === 1}
//             onClick={() => setStep(step - 1)}
//             className="text-[10px] font-black uppercase tracking-widest text-slate-400"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
//           </Button>
//           <Button
//             onClick={() => (step < 3 ? setStep(step + 1) : null)}
//             className="rounded-none bg-slate-900 text-white font-black text-[10px] uppercase h-11 px-8"
//           >
//             {step === 3 ? "Hoàn tất & Ký số" : "Tiếp theo"}{" "}
//             <ChevronRight className="w-4 h-4 ml-2" />
//           </Button>
//         </div>
//       </div>

//       {/* CỘT PHẢI: LIVE PREVIEW (5/12) */}
//       <div className="lg:col-span-5 bg-slate-50 p-8 md:p-12 space-y-8">
//         <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-200 pb-4">
//           Bản xem trước hợp đồng
//         </h3>

//         <div className="bg-white p-8 shadow-sm space-y-6 relative overflow-hidden">
//           <div className="absolute top-0 right-0 p-2">
//             <FileCheck className="w-8 h-8 text-slate-50" />
//           </div>

//           <div className="space-y-1">
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
//               Bên thuê (Người đại diện)
//             </p>
//             <p className="text-sm font-black text-slate-900 uppercase">
//               Nguyễn Văn Anh
//             </p>
//           </div>

//           <Separator className="bg-slate-50" />

//           <div className="grid grid-cols-2 gap-4">
//             <PreviewItem
//               label="Mặt bằng"
//               value="Phòng 101"
//               icon={<Home className="w-3 h-3" />}
//             />
//             <PreviewItem
//               label="Tiền cọc"
//               value="4.500.000đ"
//               icon={<CreditCard className="w-3 h-3" />}
//             />
//             <PreviewItem
//               label="Ngày vào"
//               value="15/04/2026"
//               icon={<Calendar className="w-3 h-3" />}
//             />
//             <PreviewItem
//               label="Hết hạn"
//               value="15/04/2027"
//               icon={<Calendar className="w-3 h-3" />}
//             />
//           </div>

//           <div className="p-4 bg-indigo-50/50 border border-indigo-100 flex items-start gap-3">
//             <Info className="w-4 h-4 text-indigo-600 mt-0.5" />
//             <p className="text-[10px] text-indigo-700 leading-relaxed font-medium">
//               Hợp đồng sẽ được tự động chuyển thành bản PDF có giá trị pháp lý
//               sau khi bạn nhấn hoàn tất.
//             </p>
//           </div>
//         </div>

//         <div className="space-y-4">
//           <p className="text-[10px] font-bold text-slate-400 uppercase">
//             Ghi chú vận hành
//           </p>
//           <textarea
//             className="w-full bg-transparent border-b border-slate-200 focus:border-slate-900 outline-none text-xs py-2 transition-all"
//             placeholder="Nhập ghi chú riêng cho căn hộ này..."
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// // --- Sub-components ---

// function StepCircle({
//   num,
//   active,
//   label,
// }: {
//   num: number;
//   active: boolean;
//   label: string;
// }) {
//   return (
//     <div className="flex items-center gap-2">
//       <div
//         className={`h-6 w-6 flex items-center justify-center text-[10px] font-black border-2 transition-all
//         ${active ? "bg-slate-900 border-slate-900 text-white" : "bg-transparent border-slate-100 text-slate-200"}`}
//       >
//         {num}
//       </div>
//       <span
//         className={`text-[10px] font-black uppercase tracking-widest ${active ? "text-slate-900" : "text-slate-200"}`}
//       >
//         {label}
//       </span>
//     </div>
//   );
// }

// function PreviewItem({ label, value, icon }: any) {
//   return (
//     <div className="space-y-1">
//       <div className="flex items-center gap-1.5 text-slate-400">
//         {icon}
//         <span className="text-[8px] font-black uppercase">{label}</span>
//       </div>
//       <p className="text-xs font-bold text-slate-800">{value}</p>
//     </div>
//   );
// }
