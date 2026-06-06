/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import {
  CalendarClock,
  Plus,
  UserPlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
  UserCheck,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { toast } from "sonner";

// 1. Khai báo danh sách nhân sự tổng của tòa nhà Danjin dùng để lựa chọn gán ca
const AVAILABLE_STAFF = [
  { id: "STF-01", name: "Nguyễn Minh Hùng", role: "SECURITY" },
  { id: "STF-02", name: "Lê Hoàng Nam", role: "SECURITY" },
  { id: "STF-03", name: "Phạm Văn Đức", role: "TECHNICAL" },
  { id: "STF-04", name: "Hoàng Thùy Linh", role: "CLEANER" },
  { id: "STF-05", name: "Trần Thị Kim Anh", role: "ACCOUNTANT" },
];

const DAYS_OF_WEEK = [
  { key: "mon", label: "Thứ Hai", date: "08/06" },
  { key: "tue", label: "Thứ Ba", date: "09/06" },
  { key: "wed", label: "Thứ Tư", date: "10/06" },
  { key: "thu", label: "Thứ Năm", date: "11/06" },
  { key: "fri", label: "Thứ Sáu", date: "12/06" },
  { key: "sat", label: "Thứ Bảy", date: "13/06" },
  { key: "sun", label: "Chủ Nhật", date: "14/06" },
];

const INITIAL_SHIFT_TYPES = [
  {
    id: "S1",
    name: "Ca Sáng",
    time: "06:00 - 14:00",
    bg: "bg-amber-50/40 text-amber-800 border-amber-100",
  },
  {
    id: "S2",
    name: "Ca Chiều",
    time: "14:00 - 22:00",
    bg: "bg-indigo-50/40 text-indigo-800 border-indigo-100",
  },
  {
    id: "S3",
    name: "Ca Đêm",
    time: "22:00 - 06:00",
    bg: "bg-slate-900 text-slate-100 border-slate-950",
  },
];

const INITIAL_SCHEDULE: Record<string, Record<string, any[]>> = {
  S1: {
    mon: [
      { name: "Nguyễn Minh Hùng", role: "SECURITY" },
      { name: "Hoàng Thùy Linh", role: "CLEANER" },
    ],
    tue: [{ name: "Nguyễn Minh Hùng", role: "SECURITY" }],
    wed: [{ name: "Nguyễn Minh Hùng", role: "SECURITY" }],
    thu: [{ name: "Nguyễn Minh Hùng", role: "SECURITY" }],
    fri: [
      { name: "Nguyễn Minh Hùng", role: "SECURITY" },
      { name: "Hoàng Thùy Linh", role: "CLEANER" },
    ],
    sat: [],
    sun: [],
  },
  S2: {
    mon: [{ name: "Phạm Văn Đức", role: "TECHNICAL" }],
    tue: [{ name: "Phạm Văn Đức", role: "TECHNICAL" }],
    wed: [{ name: "Phạm Văn Đức", role: "TECHNICAL" }],
    thu: [{ name: "Phạm Văn Đức", role: "TECHNICAL" }],
    fri: [],
    sat: [{ name: "Phạm Văn Đức", role: "TECHNICAL" }],
    sun: [],
  },
  S3: {
    mon: [{ name: "Lê Hoàng Nam", role: "SECURITY" }],
    tue: [{ name: "Lê Hoàng Nam", role: "SECURITY" }],
    wed: [{ name: "Lê Hoàng Nam", role: "SECURITY" }],
    thu: [{ name: "Lê Hoàng Nam", role: "SECURITY" }],
    fri: [{ name: "Lê Hoàng Nam", role: "SECURITY" }],
    sat: [{ name: "Nguyễn Minh Hùng", role: "SECURITY" }],
    sun: [{ name: "Lê Hoàng Nam", role: "SECURITY" }],
  },
};

export default function ShiftPage() {
  const [schedule, setSchedule] =
    useState<Record<string, Record<string, any[]>>>(INITIAL_SCHEDULE);
  const [shiftTypes, setShiftTypes] = useState(INITIAL_SHIFT_TYPES);

  // States kiểm soát Modal Gán nhân viên
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [activeCell, setActiveCell] = useState<{
    shiftId: string;
    dayKey: string;
  } | null>(null);

  // States kiểm soát Modal Tạo ca trực mới
  const [isCreateShiftOpen, setIsCreateShiftOpen] = useState(false);
  const [newShiftData, setNewShiftData] = useState({
    name: "",
    startTime: "",
    endTime: "",
  });

  // 1. Tính toán số liệu KPI tài nguyên thực tế dựa trên state
  const stats = useMemo(() => {
    let assignedPositions = 0;
    const totalSlots = shiftTypes.length * DAYS_OF_WEEK.length * 2; // Giả lập mỗi ca cần tối thiểu 2 người trực

    Object.values(schedule).forEach((dayObj) => {
      Object.values(dayObj).forEach((staffArray) => {
        assignedPositions += staffArray.length;
      });
    });

    const emptySlots = Math.max(0, totalSlots - assignedPositions);
    return { assignedPositions, emptySlots };
  }, [schedule, shiftTypes]);

  // 2. Kích hoạt mở modal gán nhân sự và lưu vết ô đang click
  const handleOpenAssignModal = (shiftId: string, dayKey: string) => {
    setActiveCell({ shiftId, dayKey });
    setIsAssignOpen(true);
  };

  // 3. Thực thi gán nhân viên vào ô lịch trực
  const handleAssignStaff = (staff: { name: string; role: string }) => {
    if (!activeCell) return;
    const { shiftId, dayKey } = activeCell;

    // Kiểm tra xem nhân viên này đã trùng lịch trực trong ô này chưa
    const currentStaffInCell = schedule[shiftId]?.[dayKey] || [];
    if (currentStaffInCell.some((s) => s.name === staff.name)) {
      toast.error(`Nhân viên ${staff.name} đã được gán ca này rồi cưng!`);
      return;
    }

    setSchedule((prev) => {
      const shiftData = prev[shiftId] || {};
      const dayData = shiftData[dayKey] || [];
      return {
        ...prev,
        [shiftId]: {
          ...shiftData,
          [dayKey]: [...dayData, staff],
        },
      };
    });

    toast.success(`Đã điều phối ${staff.name} vào ca trực`);
    setIsAssignOpen(false);
  };

  // 4. Xóa nhân viên khỏi ca trực cụ thể
  const handleRemoveStaff = (
    shiftId: string,
    dayKey: string,
    staffName: string,
  ) => {
    setSchedule((prev) => {
      const shiftData = prev[shiftId] || {};
      const dayData = shiftData[dayKey] || [];
      return {
        ...prev,
        [shiftId]: {
          ...shiftData,
          [dayKey]: dayData.filter((s) => s.name !== staffName),
        },
      };
    });
    toast.success(`Đã gỡ lịch trực của ${staffName.split(" ").pop()}`);
  };

  // 5. Khởi tạo thêm ca trực mới vào hệ thống mẫu
  const handleCreateShiftType = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newShiftData.name ||
      !newShiftData.startTime ||
      !newShiftData.endTime
    ) {
      toast.error("Vui lòng điền đủ tên ca và khung giờ!");
      return;
    }

    const newId = `S${shiftTypes.length + 1}`;
    const newType = {
      id: newId,
      name: newShiftData.name,
      time: `${newShiftData.startTime} - ${newShiftData.endTime}`,
      bg: "bg-teal-50/50 text-teal-800 border-teal-100",
    };

    setShiftTypes([...shiftTypes, newType]);

    // Khởi tạo vùng nhớ rỗng cho ca mới trên sơ đồ matrix tuần
    setSchedule((prev) => ({
      ...prev,
      [newId]: {
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
        sun: [],
      },
    }));

    toast.success(
      `Đã cấu hình thêm khuôn mẫu ${newShiftData.name} vào hệ thống`,
    );
    setIsCreateShiftOpen(false);
    setNewShiftData({ name: "", startTime: "", endTime: "" });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-slate-50/10 min-h-screen antialiased selection:bg-indigo-50">
      {/* TOP BAR TIÊU ĐỀ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-5 select-none">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <CalendarClock size={20} className="text-slate-700 stroke-[1.8]" />
            Lịch trực & Điều phối Ca vận hành
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Quản lý và sắp xếp sơ đồ lịch trực an ninh, bảo trì kỹ thuật cho tòa
            nhà chung cư Danjin.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 text-xs font-semibold">
          <div className="flex items-center bg-white border border-slate-200 shadow-3xs rounded-lg h-9 overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-8 rounded-none border-r border-slate-100 text-slate-500 hover:bg-slate-50"
            >
              <ChevronLeft size={14} className="stroke-2" />
            </Button>
            <span className="px-3 text-slate-700 font-medium tracking-tight">
              Tuần này: 08/06 - 14/06/2026
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-8 rounded-none border-l border-slate-100 text-slate-500 hover:bg-slate-50"
            >
              <ChevronRight size={14} className="stroke-2" />
            </Button>
          </div>

          <Button
            onClick={() => setIsCreateShiftOpen(true)}
            className="cursor-pointer h-9 bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-2xs flex gap-1.5 items-center active:scale-[0.99] transition-all"
          >
            <Plus size={14} className="stroke-[2.5]" />
            Tạo ca trực mới
          </Button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 select-none">
        <div className="bg-white p-3.5 border border-slate-200/80 rounded-xl flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Tổng số ca đã lấp đầy
            </span>
            <span className="text-base font-bold text-slate-800 font-mono">
              {stats.assignedPositions}{" "}
              <span className="text-xs font-sans text-slate-400 font-normal">
                vị trí tuần
              </span>
            </span>
          </div>
          <div className="p-2 bg-emerald-50 border border-emerald-100/60 rounded-lg text-emerald-600">
            <CheckCircle2 size={14} />
          </div>
        </div>

        <div className="bg-white p-3.5 border border-slate-200/80 rounded-xl flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Chỉ số trống thiếu nhân sự
            </span>
            <span className="text-base font-bold text-amber-600 font-mono">
              {stats.emptySlots}{" "}
              <span className="text-xs font-sans text-slate-400 font-normal">
                ô trực trống
              </span>
            </span>
          </div>
          <div className="p-2 bg-amber-50 border border-amber-100/60 rounded-lg text-amber-600">
            <AlertCircle size={14} />
          </div>
        </div>

        <div className="bg-white p-3.5 border border-slate-200/80 rounded-xl flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Cơ số nhân sự tham gia
            </span>
            <span className="text-base font-bold text-indigo-600 font-mono">
              {AVAILABLE_STAFF.length}{" "}
              <span className="text-xs font-sans text-slate-400 font-normal">
                thành viên sẵn sàng
              </span>
            </span>
          </div>
          <div className="p-2 bg-indigo-50 border border-indigo-100/60 rounded-lg text-indigo-600">
            <Clock size={14} />
          </div>
        </div>
      </div>

      {/* MATRIX SCHEDULER GRID */}
      <div className="border border-slate-200/70 bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-hidden">
        <Table className="table-fixed w-full border-collapse">
          <TableHeader className="bg-slate-50/60 border-b border-slate-100 select-none">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-5 py-3 w-[16%]">
                Mốc ca / Thời gian
              </TableHead>
              {DAYS_OF_WEEK.map((day) => (
                <TableHead
                  key={day.key}
                  className="text-[10px] font-bold text-slate-500 uppercase tracking-wider py-3 text-center border-l border-slate-100"
                >
                  <div className="space-y-0.5">
                    <span className="block text-slate-800 font-bold">
                      {day.label}
                    </span>
                    <span className="block text-[9px] font-mono text-slate-400 font-medium">
                      {day.date}
                    </span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-slate-100 text-xs">
            {shiftTypes.map((shift) => (
              <TableRow key={shift.id} className="hover:bg-transparent">
                <TableCell className="pl-5 py-4 align-top select-none">
                  <div className="space-y-1">
                    <span
                      className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${shift.bg}`}
                    >
                      {shift.name}
                    </span>
                    <p className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1">
                      <Clock size={11} className="text-slate-400" />{" "}
                      {shift.time}
                    </p>
                  </div>
                </TableCell>

                {DAYS_OF_WEEK.map((day) => {
                  const assignedStaff = schedule[shift.id]?.[day.key] || [];

                  return (
                    <TableCell
                      key={day.key}
                      className="p-2 align-top border-l border-slate-100 group/cell hover:bg-slate-50/30 transition-colors"
                    >
                      <div className="flex flex-col gap-1.5 h-full min-h-21.25 justify-between">
                        <div className="space-y-1">
                          {assignedStaff.length > 0 ? (
                            assignedStaff.map((staff, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-1.5 bg-white border border-slate-150 rounded-lg shadow-3xs group/item transition-all select-none"
                              >
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <Avatar className="h-5 w-5 rounded-md border border-slate-100 shrink-0">
                                    <AvatarFallback className="bg-slate-50 text-slate-600 text-[8px] font-black">
                                      {staff.name
                                        .split(" ")
                                        .pop()
                                        ?.substring(0, 2)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span
                                    className="font-semibold text-slate-700 text-[11px] truncate tracking-tight"
                                    title={staff.name}
                                  >
                                    {staff.name.split(" ").slice(-2).join(" ")}
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    handleRemoveStaff(
                                      shift.id,
                                      day.key,
                                      staff.name,
                                    )
                                  }
                                  className="opacity-0 group-hover/item:opacity-100 text-slate-400 hover:text-rose-600 p-0.5 rounded transition-all cursor-pointer"
                                  title="Gỡ khỏi ca trực"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-[10px] text-slate-400/60 font-medium italic text-center pt-4 select-none">
                              Trống lịch
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            handleOpenAssignModal(shift.id, day.key)
                          }
                          className="opacity-0 group-hover/cell:opacity-100 flex items-center justify-center gap-1 w-full py-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md transition-all hover:bg-indigo-600 hover:text-white hover:border-indigo-600 cursor-pointer select-none"
                        >
                          <UserPlus size={11} className="stroke-[2.5]" />
                          <span>Gán ca trực</span>
                        </button>
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ================= MODAL 1: BẢNG GÁN NHÂN SỰ VÀO CA TRỰC ================= */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="sm:max-w-100 p-5 rounded-2xl border border-slate-200 bg-white shadow-lg animate-in fade-in duration-200">
          <DialogHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
            <DialogTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck size={14} className="text-indigo-600" /> Chọn nhân viên
              điều phối
            </DialogTitle>
          </DialogHeader>

          <div className="py-2 space-y-1.5 max-h-70 overflow-y-auto">
            {AVAILABLE_STAFF.map((staff) => (
              <div
                key={staff.id}
                onClick={() => handleAssignStaff(staff)}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-white hover:border-indigo-100 hover:bg-indigo-50/20 cursor-pointer transition-all group select-none"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 rounded-lg border border-slate-100">
                    <AvatarFallback className="bg-slate-50 text-slate-600 text-xs font-bold">
                      {staff.name
                        .split(" ")
                        .pop()
                        ?.substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-950 transition-colors">
                      {staff.name}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 font-medium">
                      #{staff.id}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 border border-slate-200 bg-slate-50 px-2 py-0.5 rounded-md uppercase">
                  {staff.role === "SECURITY"
                    ? "Bảo vệ"
                    : staff.role === "TECHNICAL"
                      ? "Kỹ thuật"
                      : "Vệ sinh"}
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 2: KHỞI TẠO KHUÔN MẪU CA TRỰC MỚI ================= */}
      <Dialog open={isCreateShiftOpen} onOpenChange={setIsCreateShiftOpen}>
        <DialogContent className="sm:max-w-95 p-5 rounded-2xl border border-slate-200 bg-white shadow-lg">
          <DialogHeader className="border-b border-slate-100 pb-3">
            <DialogTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <LayoutGrid size={14} className="text-indigo-600" /> Định nghĩa ca
              trực mới
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleCreateShiftType}
            className="space-y-4 text-xs pt-2"
          >
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">
                Tên phân hệ ca *
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Ca Hành Chính, Ca Gãy Chiều..."
                value={newShiftData.name}
                onChange={(e) =>
                  setNewShiftData({ ...newShiftData, name: e.target.value })
                }
                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 shadow-2xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  Giờ bắt đầu *
                </label>
                <input
                  type="time"
                  value={newShiftData.startTime}
                  onChange={(e) =>
                    setNewShiftData({
                      ...newShiftData,
                      startTime: e.target.value,
                    })
                  }
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 shadow-2xs focus:outline-none focus:border-indigo-500 font-mono font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  Giờ kết thúc *
                </label>
                <input
                  type="time"
                  value={newShiftData.endTime}
                  onChange={(e) =>
                    setNewShiftData({
                      ...newShiftData,
                      endTime: e.target.value,
                    })
                  }
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 shadow-2xs focus:outline-none focus:border-indigo-500 font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <Button
                type="submit"
                className="cursor-pointer h-9 bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex-1 gap-1.5 justify-center font-bold uppercase tracking-wider"
              >
                Xác nhận tạo
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateShiftOpen(false)}
                className="h-9 text-slate-500 rounded-lg px-4 font-semibold"
              >
                Hủy
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
