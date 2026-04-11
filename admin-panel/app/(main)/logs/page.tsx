"use client";
import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Trash2,
  Info,
  AlertTriangle,
  XCircle,
  Clock,
  User,
  Globe,
} from "lucide-react";

// Mock data mẫu - sau này bạn sẽ gọi từ NestJS API
const mockLogs = [
  {
    id: "LOG-001",
    type: "INFO",
    action: "Đăng nhập hệ thống",
    user: "Nguyễn Văn Khánh",
    target: "Hệ thống Auth",
    ip: "192.168.1.1",
    time: "2026-03-29 22:30:15",
  },
  {
    id: "LOG-002",
    type: "ERROR",
    action: "Lỗi thanh toán QR",
    user: "Trần Thị B",
    target: "SePay Integration",
    ip: "113.161.2.45",
    time: "2026-03-29 21:15:00",
  },
  {
    id: "LOG-003",
    type: "WARNING",
    action: "Thay đổi phân quyền",
    user: "Admin",
    target: "RBAC Module",
    ip: "1.1.1.1",
    time: "2026-03-29 20:05:10",
  },
  {
    id: "LOG-004",
    type: "INFO",
    action: "Xuất báo cáo doanh thu",
    user: "Kế toán trưởng",
    target: "Finance",
    ip: "14.226.5.12",
    time: "2026-03-29 19:45:30",
  },
];

export default function SystemLogPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusStyle = (type: string) => {
    switch (type) {
      case "ERROR":
        return "bg-red-100 text-red-700 border-red-200 icon-red-500";
      case "WARNING":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "INFO":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "ERROR":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "WARNING":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="p-6 max-w-400 mx-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Nhật ký hệ thống
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi và giám sát mọi hoạt động vận hành của chung cư.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Xuất dữ liệu
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
            <Trash2 className="w-4 h-4" /> Xóa nhật ký cũ
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm hành động, người dùng, IP..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
          <option value="">Tất cả mức độ</option>
          <option value="info">Thông tin (Info)</option>
          <option value="warning">Cảnh báo (Warning)</option>
          <option value="error">Lỗi (Error)</option>
        </select>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all">
          <Filter className="w-4 h-4" /> Áp dụng lọc
        </button>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-bottom border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Mức độ
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Hành động
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Người thực hiện
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Đối tượng
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Địa chỉ IP
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Thời gian
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {mockLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(log.type)}`}
                    >
                      {getIcon(log.type)}
                      {log.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {log.action}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="w-3 h-3" />
                      </div>
                      {log.user}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{log.target}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-500 italic">
                      <Globe className="w-3 h-3 text-slate-400" />
                      {log.ip}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500 font-mono text-[13px]">
                    <div className="flex items-center justify-end gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {log.time}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION (Footer) */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <p className="text-xs text-slate-500 font-medium">
            Hiển thị 1 - 4 trong tổng số 1,240 log
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded bg-white text-xs disabled:opacity-50">
              Trước
            </button>
            <button className="px-3 py-1 border border-slate-200 rounded bg-white text-xs hover:bg-slate-50">
              Tiếp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
