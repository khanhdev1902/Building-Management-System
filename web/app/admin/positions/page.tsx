"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  Trash2,
  Edit3,
  Users,
  CircleDollarSign,
  Save,
  X,
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
import { toast } from "sonner";

// Mock data cấu hình vị trí thực tế trong tòa nhà Danjin
const INITIAL_POSITIONS = [
  {
    id: "POS-01",
    name: "Bảo vệ tòa nhà",
    code: "SECURITY",
    baseSalary: 7500000,
    staffCount: 2,
    desc: "Trực chốt camera, tuần tra an ninh và quản lý hầm xe.",
  },
  {
    id: "POS-02",
    name: "Kế toán công nợ",
    code: "ACCOUNTANT",
    baseSalary: 10000000,
    staffCount: 1,
    desc: "Đối soát webhook ngân hàng, chốt hóa đơn tiền nhà hàng tháng.",
  },
  {
    id: "POS-03",
    name: "Kỹ thuật điện nước",
    code: "TECHNICAL",
    baseSalary: 9000000,
    staffCount: 1,
    desc: "Bảo trì hệ thống điện lưới, công tơ nước và sửa chữa thiết bị phòng.",
  },
  {
    id: "POS-04",
    name: "Vệ sinh cảnh quan",
    code: "CLEANER",
    baseSalary: 6000000,
    staffCount: 1,
    desc: "Dọn dẹp hành lang, thu gom rác và đảm bảo vệ sinh không gian chung.",
  },
];

export default function PositionPage() {
  const [positions, setPositions] = useState(INITIAL_POSITIONS);

  // State quản lý Form (Dùng chung cho cả Thêm mới và Sửa)
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    code: "",
    baseSalary: "",
    desc: "",
  });

  // Reset form về trạng thái ban đầu
  const resetForm = () => {
    setIsEditing(false);
    setFormData({ id: "", name: "", code: "", baseSalary: "", desc: "" });
  };

  // Xử lý khi bấm nút Sửa trên bảng
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditClick = (pos: any) => {
    setIsEditing(true);
    setFormData({
      id: pos.id,
      name: pos.name,
      code: pos.code,
      baseSalary: pos.baseSalary.toString(),
      desc: pos.desc,
    });
  };

  // Submit form (Thêm hoặc Cập nhật)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.baseSalary) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc (*)");
      return;
    }

    if (isEditing) {
      // Logic Cập nhật
      setPositions((prev) =>
        prev.map((p) =>
          p.id === formData.id
            ? {
                ...p,
                name: formData.name,
                code: formData.code.toUpperCase(),
                baseSalary: Number(formData.baseSalary),
                desc: formData.desc,
              }
            : p,
        ),
      );
      toast.success("Cập nhật thông tin chức danh thành công");
    } else {
      // Logic Thêm mới
      const newPos = {
        id: `POS-${String(positions.length + 1).padStart(2, "0")}`,
        name: formData.name,
        code: formData.code.toUpperCase(),
        baseSalary: Number(formData.baseSalary),
        staffCount: 0,
        desc: formData.desc,
      };
      setPositions((prev) => [...prev, newPos]);
      toast.success("Thêm chức danh công việc mới thành công");
    }
    resetForm();
  };

  const handleDelete = (id: string, staffCount: number) => {
    if (staffCount > 0) {
      toast.error("Không thể xóa vị trí này vì đang có nhân sự đảm nhiệm!");
      return;
    }
    setPositions((prev) => prev.filter((p) => p.id !== id));
    toast.success("Đã gỡ bỏ cấu hình chức danh");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-slate-50/10 min-h-screen antialiased selection:bg-indigo-50">
      {/* 1. TOP BAR: TIÊU ĐỀ HỆ THỐNG */}
      <div className="border-b border-slate-200/60 pb-5 select-none">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Briefcase size={20} className="text-slate-700 stroke-[1.8]" />
          Cấu hình Chức danh & Định mức Vị trí
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Thiết lập sơ đồ vai trò nhân sự, định mức lương cơ bản và phân tách
          quyền hạn vận hành tòa nhà.
        </p>
      </div>

      {/* 2. SPLIT-LAYOUT: BIẾN FORM THÀNH MỘT PANEL CỐ ĐỊNH BÊN TRÁI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PANEL TRÁI: FORM ĐIỀU KHIỂN (4 phần) */}
        <div className="lg:col-span-4 border border-slate-200/80 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 select-none">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              {isEditing ? "Cập nhật vị trí" : "Tạo vị trí mới"}
            </h3>
            {isEditing && (
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Tên chức danh */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">
                Tên vị trí / Chức danh *
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Bảo vệ ca đêm, Kỹ thuật..."
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 shadow-2xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
              />
            </div>

            {/* Mã định danh vai trò */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">
                Mã định danh (Role Code) *
              </label>
              <input
                type="text"
                placeholder="Ví dụ: SECURITY_NIGHT, TECHNICAL..."
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 font-mono shadow-2xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-bold uppercase"
              />
            </div>

            {/* Mức lương định mức */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">
                Lương cơ bản định mức (đ) *
              </label>
              <div className="relative flex items-center">
                <CircleDollarSign
                  size={14}
                  className="absolute left-3 text-slate-400 pointer-events-none"
                />
                <input
                  type="number"
                  placeholder="Ví dụ: 7500000"
                  value={formData.baseSalary}
                  onChange={(e) =>
                    setFormData({ ...formData, baseSalary: e.target.value })
                  }
                  className="w-full h-9 pl-9 pr-3 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 shadow-2xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold font-mono"
                />
              </div>
            </div>

            {/* Mô tả công việc */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">
                Mô tả nghiệp vụ / Trách nhiệm
              </label>
              <textarea
                rows={3}
                placeholder="Ghi chú tóm tắt các công việc cốt lõi của vị trí này..."
                value={formData.desc}
                onChange={(e) =>
                  setFormData({ ...formData, desc: e.target.value })
                }
                className="w-full p-3 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 shadow-2xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium resize-none leading-relaxed"
              />
            </div>

            {/* Nhóm nút lưu */}
            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                className="cursor-pointer h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex-1 gap-1.5 items-center font-semibold transition-all active:scale-[0.99]"
              >
                {isEditing ? (
                  <Save size={13} />
                ) : (
                  <Plus size={13} className="stroke-[2.5]" />
                )}
                <span>{isEditing ? "Cập nhật vị trí" : "Thêm vị trí"}</span>
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="cursor-pointer h-9 text-slate-500 border-slate-200 hover:bg-slate-50 font-semibold rounded-lg px-3"
                >
                  Hủy
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* PANEL PHẢI: BẢNG DANH SÁCH CẤU HÌNH VỊ TRÍ (8 phần) */}
        <div className="lg:col-span-8 border border-slate-200/70 bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/60 border-b border-slate-100 select-none">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-5 py-3 w-[25%]">
                  Vị trí công việc
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 w-[15%]">
                  Mã định danh
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 w-[22%]">
                  Lương cơ bản định mức
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center py-3 w-[18%]">
                  Nhân sự hiện tại
                </TableHead>
                <TableHead className="py-3 w-[20%]"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-100 text-xs">
              {positions.map((pos) => (
                <TableRow
                  key={pos.id}
                  className="hover:bg-slate-50/40 transition-colors group"
                >
                  {/* Tên và Mô tả vị trí */}
                  <TableCell className="pl-5 py-3.5">
                    <div className="space-y-0.5 max-w-xs sm:max-w-sm lg:max-w-xs">
                      <p className="font-semibold text-slate-800 group-hover:text-indigo-950 transition-colors tracking-tight">
                        {pos.name}
                      </p>
                      <p
                        className="text-[10px] text-slate-400 font-medium truncate italic"
                        title={pos.desc}
                      >
                        {pos.desc || "Chưa bổ sung mô tả công việc..."}
                      </p>
                    </div>
                  </TableCell>

                  {/* Mã Code hệ thống */}
                  <TableCell className="py-3.5">
                    <span className="font-mono bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 border border-slate-200/40 rounded text-[10px]">
                      {pos.code}
                    </span>
                  </TableCell>

                  {/* Lương cơ bản */}
                  <TableCell className="font-mono font-bold text-slate-800 py-3.5">
                    {pos.baseSalary.toLocaleString("vi-VN")} đ
                  </TableCell>

                  {/* Số lượng nhân sự gán vào vị trí này */}
                  <TableCell className="text-center py-3.5 select-none">
                    <Badge
                      variant="outline"
                      className={`px-2 py-0.2 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                        pos.staffCount > 0
                          ? "bg-indigo-50/60 text-indigo-700 border-indigo-100 shadow-[0_0_4px_rgba(99,102,241,0.1)]"
                          : "bg-slate-50 text-slate-400 border-slate-200"
                      }`}
                    >
                      <Users
                        size={11}
                        className={
                          pos.staffCount > 0
                            ? "text-indigo-500"
                            : "text-slate-300"
                        }
                      />
                      <span className="font-mono">
                        {pos.staffCount} nhân viên
                      </span>
                    </Badge>
                  </TableCell>

                  {/* Nút tác vụ Sửa / Xóa */}
                  <TableCell className="pr-5 py-3.5 text-right select-none">
                    <div className="flex items-center justify-end gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditClick(pos)}
                        className="cursor-pointer text-slate-500 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Chỉnh sửa cấu hình"
                      >
                        <Edit3 size={13} className="stroke-[1.8]" />
                      </button>
                      <button
                        onClick={() => handleDelete(pos.id, pos.staffCount)}
                        className="cursor-pointer text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Xóa bỏ chức danh"
                      >
                        <Trash2 size={13} className="stroke-[1.8]" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
