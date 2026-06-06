"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  UserCheck,
  UserX,
  ShieldAlert,
  MoreVertical,
  Phone,
  Briefcase,
  Wrench,
  Shield,
  CircleDollarSign,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { toast } from "sonner";

// 1. Định nghĩa Mock Data nhân sự thực tế của tòa nhà Danjin
const INITIAL_STAFF = [
  {
    id: "STF-001",
    name: "Nguyễn Minh Hùng",
    role: "SECURITY",
    phone: "0912.345.678",
    status: "ACTIVE",
    joinDate: "12/02/2024",
  },
  {
    id: "STF-002",
    name: "Trần Thị Kim Anh",
    role: "ACCOUNTANT",
    phone: "0988.112.233",
    status: "ACTIVE",
    joinDate: "05/01/2025",
  },
  {
    id: "STF-003",
    name: "Phạm Văn Đức",
    role: "TECHNICAL",
    phone: "0977.555.999",
    status: "ACTIVE",
    joinDate: "20/06/2024",
  },
  {
    id: "STF-004",
    name: "Lê Hoàng Nam",
    role: "SECURITY",
    phone: "0904.888.777",
    status: "LEAVE",
    joinDate: "15/08/2024",
  },
  {
    id: "STF-005",
    name: "Hoàng Thùy Linh",
    role: "CLEANER",
    phone: "0936.444.111",
    status: "ACTIVE",
    joinDate: "01/03/2025",
  },
];

// Cấu hình hiển thị vai trò tinh xảo
const ROLE_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  SECURITY: {
    label: "Bảo vệ tòa nhà",
    icon: <Shield size={12} />,
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  ACCOUNTANT: {
    label: "Kế toán công nợ",
    icon: <CircleDollarSign size={12} />,
    color: "text-purple-600 bg-purple-50 border-purple-100",
  },
  TECHNICAL: {
    label: "Kỹ thuật điện nước",
    icon: <Wrench size={12} />,
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  CLEANER: {
    label: "Vệ sinh cảnh quan",
    icon: <Briefcase size={12} />,
    color: "text-teal-600 bg-teal-50 border-teal-100",
  },
};

export default function StaffPage() {
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [searchTerm, setSearchTerm] = useState("");

  // Tính toán số liệu thống kê nhanh trên đầu trang
  const stats = useMemo(() => {
    const total = staffList.length;
    const active = staffList.filter((s) => s.status === "ACTIVE").length;
    const leave = total - active;
    return { total, active, leave };
  }, [staffList]);

  // Bộ lọc tìm kiếm theo tên hoặc số điện thoại
  const filteredStaff = useMemo(() => {
    return staffList.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone.includes(searchTerm),
    );
  }, [searchTerm, staffList]);

  const handleToggleStatus = (id: string, currentStatus: string) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: currentStatus === "ACTIVE" ? "LEAVE" : "ACTIVE" }
          : s,
      ),
    );
    toast.success(`Đã cập nhật trạng thái nhân sự #${id.slice(4)}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-slate-50/10 min-h-screen antialiased selection:bg-indigo-50">
      {/* ============================================================ */}
      {/* 1. TOP BAR: TIÊU ĐỀ & THỐNG KÊ KÉN NHỎ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-5 select-none">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users size={20} className="text-slate-700 stroke-[1.8]" />
            Quản lý Đội ngũ Nhân sự Vận hành
          </h2>
          <p className="text-xs text-slate-400 font-medium flex items-center gap-3">
            <span>
              Tổng nhân sự:{" "}
              <strong className="text-slate-700 font-mono">
                {stats.total}
              </strong>
            </span>
            <span className="text-slate-200">|</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.4)]" />
              Đang trực:{" "}
              <strong className="text-slate-700 font-mono">
                {stats.active}
              </strong>
            </span>
            <span className="text-slate-200">|</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              Nghỉ phép:{" "}
              <strong className="text-slate-700 font-mono">
                {stats.leave}
              </strong>
            </span>
          </p>
        </div>

        <Button
          onClick={() =>
            toast.info("Tính năng thêm nhân sự đang kết nối Modal...")
          }
          className="cursor-pointer h-9 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-2xs flex gap-1.5 items-center active:scale-[0.99] transition-all"
        >
          <Plus size={14} className="stroke-[2.5]" />
          Thêm nhân viên mới
        </Button>
      </div>

      {/* ============================================================ */}
      {/* 2. TOOLBAR: Ô TÌM KIẾM SẠCH SẼ */}
      <div className="flex items-center max-w-md relative select-none">
        <Search
          size={14}
          className="absolute left-3.5 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Tìm kiếm nhân viên theo tên hoặc số điện thoại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-9 pl-9 pr-4 bg-white border border-slate-200/90 text-xs rounded-lg text-slate-800 placeholder-slate-400 shadow-2xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
        />
      </div>

      {/* ============================================================ */}
      {/* 3. KHU VỰC BẢNG NỘI DUNG CHÍNH CHUẨN SAAS */}
      <div className="border border-slate-200/70 bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/60 border-b border-slate-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-5 py-3 w-[8%]">
                Mã NV
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 w-[25%]">
                Nhân sự
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 w-[22%]">
                Vai trò đảm nhiệm
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 w-[15%]">
                Số điện thoại
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 w-[15%]">
                Ngày vào làm
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center py-3 w-[10%]">
                Trạng thái
              </TableHead>
              <TableHead className="py-3 w-[5%]"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-slate-100 text-xs">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => {
                const role = ROLE_CONFIG[staff.role] || {
                  label: staff.role,
                  icon: <Briefcase size={12} />,
                  color: "bg-slate-100 text-slate-700",
                };

                return (
                  <TableRow
                    key={staff.id}
                    className="hover:bg-slate-50/40 transition-colors group"
                  >
                    {/* Mã nhân viên */}
                    <TableCell className="font-mono font-bold text-slate-400 pl-5 py-3.5">
                      #{staff.id.slice(4)}
                    </TableCell>

                    {/* Avatar & Tên */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-slate-100 rounded-lg shadow-3xs shrink-0 select-none">
                          <AvatarFallback className="bg-slate-100 text-slate-600 text-[11px] font-bold">
                            {staff.name
                              .split(" ")
                              .pop()
                              ?.substring(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-slate-800 group-hover:text-indigo-950 transition-colors">
                          {staff.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Vai trò */}
                    <TableCell className="py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-semibold select-none ${role.color}`}
                      >
                        {role.icon}
                        {role.label}
                      </span>
                    </TableCell>

                    {/* Số điện thoại */}
                    <TableCell className="font-mono font-semibold text-slate-600 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Phone
                          size={12}
                          className="text-slate-400 stroke-[1.5]"
                        />
                        <span>{staff.phone}</span>
                      </div>
                    </TableCell>

                    {/* Ngày vào làm */}
                    <TableCell className="text-slate-400 font-mono font-medium py-3.5">
                      {staff.joinDate}
                    </TableCell>

                    {/* Trạng thái Kén phát sáng */}
                    <TableCell className="text-center py-3.5 select-none">
                      <button
                        onClick={() =>
                          handleToggleStatus(staff.id, staff.status)
                        }
                        className="cursor-pointer focus:outline-none"
                      >
                        {staff.status === "ACTIVE" ? (
                          <Badge
                            variant="outline"
                            className="bg-emerald-50 text-emerald-700 border-emerald-200/80 px-2 py-0.2 rounded-full text-[10px] font-bold flex items-center gap-1"
                          >
                            <span className="h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.6)]" />
                            Đang trực
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-slate-50 text-slate-500 border-slate-200 px-2 py-0.2 rounded-full text-[10px] font-bold flex items-center gap-1"
                          >
                            <span className="h-1 w-1 rounded-full bg-slate-400" />
                            Nghỉ phép
                          </Badge>
                        )}
                      </button>
                    </TableCell>

                    {/* Tác vụ Dropdown Menu ẩn */}
                    <TableCell className="pr-4 text-right py-3.5">
                      <button className="cursor-pointer text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors">
                        <MoreVertical size={14} className="stroke-[1.75]" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-slate-400 font-medium select-none"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldAlert
                      size={20}
                      className="text-slate-300 stroke-[1.5]"
                    />
                    <span>Không tìm thấy nhân viên nào khớp với bộ lọc</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
