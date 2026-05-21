"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ShieldAlert,
  Clock,
  Activity,
  Download,
  Eye,
  Building,
  Key,
  Database,
  Cpu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { toast } from "sonner";

// Mock Data chuẩn dữ liệu Audit Log của hệ thống vận hành chung cư
const INITIAL_LOGS = [
  {
    id: "LOG-9942",
    timestamp: "21/05/2026 06:45:12",
    actor: { name: "Nguyễn Minh Tuấn", role: "Quản lý tòa A", avatar: "MT" },
    action: "UPDATE_BILL",
    module: "finance",
    target: "Hóa đơn điện Tháng 05 - Phòng 302",
    description:
      "Thay đổi chỉ số điện đầu kỳ từ 4520 kWh thành 4510 kWh theo yêu cầu đối soát lại.",
    ipAddress: "14.226.45.102",
    severity: "medium", // low | medium | high
    meta: {
      before: "4520 kWh",
      after: "4510 kWh",
      reason: "Sai sót nhập liệu hộ hộ dân",
    },
  },
  {
    id: "LOG-9941",
    timestamp: "21/05/2026 02:15:00",
    actor: { name: "Hệ thống IoT Auto", role: "Gateway", avatar: "SYS" },
    action: "DEVICE_SHUTDOWN",
    module: "iot",
    target: "Rơ-le điện Aptomat - Phòng 202",
    description:
      "Tự động ngắt nguồn điện phòng 202 do phát hiện dòng điện quá tải liên tục vượt ngưỡng an toàn (32A).",
    ipAddress: "192.168.1.50",
    severity: "high",
    meta: {
      current_load: "34.5A",
      threshold: "32A",
      hardware_id: "SMART-APT-202",
    },
  },
  {
    id: "LOG-9940",
    timestamp: "20/05/2026 23:10:45",
    actor: { name: "Trần Thế Anh", role: "Cư dân", avatar: "TA" },
    action: "USER_LOGIN",
    module: "auth",
    target: "Tài khoản cư dân P.202",
    description: "Đăng nhập thành công vào ứng dụng di động Danjin App cư dân.",
    ipAddress: "27.72.105.14",
    severity: "low",
    meta: { device: "iPhone 15 Pro", os: "iOS 19.1", location: "Hà Nội, VN" },
  },
  {
    id: "LOG-9939",
    timestamp: "20/05/2026 16:30:22",
    actor: { name: "Lê Thị Hồng", role: "Chủ sở hữu (Admin)", avatar: "LH" },
    action: "DELETE_TENANT",
    module: "tenant",
    target: "Nhân khẩu: Nguyễn Văn B (Phòng 104)",
    description:
      "Xóa hồ sơ thông tin và hủy quyền truy cập thẻ từ hầm xe của cư dân do hết hạn hợp đồng thuê.",
    ipAddress: "113.190.22.88",
    severity: "high",
    meta: { contract_end: "20/05/2026", card_revoked: "CARD-88421" },
  },
  {
    id: "LOG-9938",
    timestamp: "20/05/2026 14:15:01",
    actor: { name: "Nguyễn Minh Tuấn", role: "Quản lý tòa A", avatar: "MT" },
    action: "APPROVE_RESIDENT",
    module: "tenant",
    target: "Tờ khai tạm trú - Phòng 101",
    description:
      "Phê duyệt hồ sơ thông tin trắc học CCCD cho cư dân mới dọn vào ở ghép.",
    ipAddress: "14.226.45.102",
    severity: "low",
    meta: { resident_id: "034202001425", ocr_verified: "true" },
  },
];

export default function AuditLogManagement() {
  const [logs] = useState(INITIAL_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  // State xem chi tiết cấu trúc JSON Log
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Lọc và Tìm kiếm Real-time
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesModule =
        moduleFilter === "all" || log.module === moduleFilter;
      const matchesSeverity =
        severityFilter === "all" || log.severity === severityFilter;

      return matchesSearch && matchesModule && matchesSeverity;
    });
  }, [logs, searchQuery, moduleFilter, severityFilter]);

  // Dữ liệu phân trang thực tế
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, currentPage]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;

  // Giả lập xuất báo cáo Excel/CSV
  const handleExport = () => {
    toast.success(
      "Hệ thống đang nén dữ liệu và xuất file audit_logs_2026.csv thành công!",
    );
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50/50 text-slate-900 font-sans antialiased overflow-hidden">
      {/* 1. TOP HEADER PANEL */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-xs select-none">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-950 text-white rounded-xl shadow-sm">
            <Activity className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Nhật ký hệ thống (Audit Logs)
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Truy vết dòng thời gian bảo mật, ghi nhận mọi hành động tác động
              tới cơ sở dữ liệu tòa nhà
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleExport}
          className="h-9.5 text-xs font-bold border-slate-200 text-slate-700 rounded-xl gap-2 hover:bg-slate-50 shadow-3xs cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-400" /> Xuất tệp dữ liệu nhật
          ký
        </Button>
      </header>

      {/* 2. ADVANCED CONTROL FILTER BAR */}
      <section className="bg-white border-b border-slate-200/60 px-6 py-3 flex flex-col sm:flex-row items-center gap-3 justify-between select-none">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Ô Tìm kiếm thực thể */}
          <div className="relative w-full sm:w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
            <Input
              placeholder="Tìm theo tài khoản, tác vụ, số phòng, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8.5 bg-slate-50 border-slate-200 text-xs h-8.5 rounded-xl focus-visible:ring-2 focus-visible:ring-slate-950/10 focus-visible:border-slate-800 transition-all w-full font-medium"
            />
          </div>

          {/* Lọc Phân hệ Module */}
          <Select
            value={moduleFilter}
            onValueChange={(val) => {
              setModuleFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8.5 w-36 border-slate-200 bg-slate-50 text-[11px] font-semibold px-2.5 rounded-xl shadow-3xs focus:ring-0">
              <SelectValue placeholder="Phân hệ" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 text-xs font-medium">
              <SelectItem value="all" className="text-xs font-semibold">
                Tất cả phân hệ
              </SelectItem>
              <SelectItem value="finance" className="text-xs">
                Tài chính (Finance)
              </SelectItem>
              <SelectItem value="tenant" className="text-xs">
                Nhân khẩu (Tenant)
              </SelectItem>
              <SelectItem value="iot" className="text-xs">
                Thiết bị phần cứng (IoT)
              </SelectItem>
              <SelectItem value="auth" className="text-xs">
                Bảo mật / Đăng nhập
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lọc theo mức độ rủi ro hệ thống */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Mức độ nguy cơ:
          </span>
          <Select
            value={severityFilter}
            onValueChange={(val) => {
              setSeverityFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8.5 w-32 border-slate-200 bg-white rounded-xl text-[11px] font-semibold px-2.5 shadow-3xs focus:ring-0">
              <SelectValue placeholder="Độ nghiêm trọng" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 text-xs font-semibold">
              <SelectItem
                value="all"
                className="text-xs font-semibold text-slate-800"
              >
                Mọi cấp độ
              </SelectItem>
              <SelectItem value="low" className="text-xs text-blue-600">
                Thấp (Thông tin)
              </SelectItem>
              <SelectItem value="medium" className="text-xs text-amber-600">
                Trung bình (Cảnh báo)
              </SelectItem>
              <SelectItem value="high" className="text-xs text-red-600">
                🚨 Cao (Nguy hiểm)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* 3. CORE LOG TIME TABLE LIST */}
      <main className="flex-1 p-6 overflow-hidden flex flex-col justify-between">
        <ScrollArea className="flex-1 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <div className="w-full min-w-237.5 text-xs">
            {/* Table Header Row */}
            <div className="grid grid-cols-12 gap-4 bg-slate-50/70 p-4 border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider select-none">
              <div className="col-span-2">Dòng thời gian</div>
              <div className="col-span-2">Người thực hiện (Actor)</div>
              <div className="col-span-2">Mã hành động</div>
              <div className="col-span-5">Mô tả chi tiết tác động dữ liệu</div>
              <div className="col-span-1 text-center">Chi tiết</div>
            </div>

            {/* Table Body Content Rows */}
            {paginatedLogs.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {paginatedLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50/40 transition-colors border-l-4 ${renderSeverityLeftBorder(log.severity)}`}
                  >
                    {/* 1. Khối Thời gian */}
                    <div className="col-span-2 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700 font-mono font-bold text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{log.timestamp.split(" ")[1]}</span>
                      </div>
                      <span className="block text-[10px] text-slate-400 font-medium font-sans pl-5">
                        {log.timestamp.split(" ")[0]}
                      </span>
                    </div>

                    {/* 2. Khối Tài khoản tác nhân */}
                    <div className="col-span-2 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-[11px] text-slate-600 shrink-0 select-none">
                        {log.actor.avatar}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 truncate text-[12px]">
                          {log.actor.name}
                        </h4>
                        <span className="block text-[10px] text-slate-400 font-medium truncate">
                          {log.actor.role}
                        </span>
                      </div>
                    </div>

                    {/* 3. Khối Loại tác vụ & Module */}
                    <div className="col-span-2 space-y-1">
                      <div className="flex items-center gap-1">
                        {renderModuleIcon(log.module)}
                        <span className="font-mono font-black text-slate-700 text-[11px] uppercase tracking-tight">
                          {log.action}
                        </span>
                      </div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider pl-4">
                        {log.id}
                      </span>
                    </div>

                    {/* 4. Khối mô tả hành động thực tế */}
                    <div className="col-span-5 space-y-1 pr-4">
                      <p className="font-semibold text-slate-800 line-clamp-1 text-[12.5px] tracking-tight">
                        Target:{" "}
                        <span className="text-slate-500 font-mono text-xs">
                          {log.target}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium line-clamp-1 leading-relaxed">
                        {log.description}
                      </p>
                      <span className="inline-block text-[10px] text-slate-300 font-mono font-medium">
                        IP thiết bị: {log.ipAddress}
                      </span>
                    </div>

                    {/* 5. Nút bấm soi Object JSON */}
                    <div className="col-span-1 text-center select-none">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedLog(log)}
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center select-none">
                <ShieldAlert className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-400">
                  Không tìm thấy bản ghi nhật ký hệ thống nào
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Vui lòng tinh chỉnh hoặc reset lại cấu hình bộ lọc nâng cao
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* 4. PACINATION FOOTER BLOCK */}
        <footer className="flex items-center justify-between pt-4 select-none">
          <p className="text-xs text-slate-400 font-semibold">
            Hiển thị dòng từ{" "}
            <span className="text-slate-700 font-mono">
              {filteredLogs.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            đến{" "}
            <span className="text-slate-700 font-mono">
              {Math.min(currentPage * itemsPerPage, filteredLogs.length)}
            </span>{" "}
            trên tổng số{" "}
            <span className="text-slate-700 font-mono">
              {filteredLogs.length}
            </span>{" "}
            bản kiểm toán rủi ro bảo mật
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="h-8.5 w-8.5 rounded-xl border-slate-200 text-slate-500 shadow-3xs hover:bg-white disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className={`h-8.5 w-8.5 rounded-xl text-xs font-bold font-mono transition-all ${currentPage === page ? "bg-slate-950 text-white border-none shadow-sm" : "border-slate-200 text-slate-600 hover:bg-white"}`}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="h-8.5 w-8.5 rounded-xl border-slate-200 text-slate-500 shadow-3xs hover:bg-white disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </footer>
      </main>

      {/* ================= MODAL DIALOG PREVIEW CHI TIẾT STRUCT OBJECT METADATA LOG ================= */}
      <Dialog
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        <DialogContent className="sm:max-w-125 bg-white rounded-2xl p-6 font-sans">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-slate-900 flex items-center gap-2 select-none uppercase tracking-wide">
              <Database className="w-4 h-4 text-slate-600" /> Siêu dữ liệu
              Metadata chuyên sâu
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 select-none">
              Chi tiết các trường dữ liệu bị can thiệp biến đổi trong Object Cơ
              sở dữ liệu.
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4 pt-2">
              {/* Box tóm tắt nhanh trạng thái */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-xs font-medium text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Log ID:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedLog.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hành vi gốc:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedLog.action}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Thiết bị IP:</span>
                  <span className="font-mono text-slate-700">
                    {selectedLog.ipAddress}
                  </span>
                </div>
              </div>

              {/* Box JSON Struct Highlighting */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block select-none">
                  Cấu trúc dữ liệu can thiệp (Meta JSON)
                </label>
                <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto text-[11px] font-mono font-bold text-emerald-400 shadow-inner max-h-56 leading-relaxed">
                  <pre>{JSON.stringify(selectedLog.meta, null, 2)}</pre>
                </div>
              </div>

              <div className="flex justify-end pt-1 select-none">
                <Button
                  onClick={() => setSelectedLog(null)}
                  className="h-9 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                >
                  Đóng cửa sổ tra cứu
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper phân loại Icon theo phân hệ Module hệ thống
function renderModuleIcon(mod: string) {
  switch (mod) {
    case "finance":
      return <Database className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
    case "tenant":
      return <Building className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
    case "iot":
      return <Cpu className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
    default:
      return <Key className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
  }
}

// Helper đổi màu thanh viền bên trái dòng dữ liệu dựa vào rủi ro rà soát bảo mật
function renderSeverityLeftBorder(severity: string) {
  switch (severity) {
    case "high":
      return "border-l-red-500 bg-red-50/10 hover:bg-red-50/20";
    case "medium":
      return "border-l-amber-500 bg-amber-50/10 hover:bg-amber-50/20";
    default:
      return "border-l-slate-200";
  }
}
